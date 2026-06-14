import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import GanttView from './components/GanttView/GanttView';
import { loadData, saveData, resetToDemoData } from './lib/storage';
import { createProject, createSubPhase, createMainPhase, lightenColor } from './lib/seedData';
import './App.css';

// Re-sorts the sub-phases under `parentId` by start date (phases with no
// start date sort last), keeping their block contiguous and preserving
// relative order for ties via a stable sort.
function sortSubPhasesByStartDate(phases, parentId) {
  const indices = [];
  const subset = [];
  phases.forEach((p, i) => {
    if (p.parentId === parentId) {
      indices.push(i);
      subset.push(p);
    }
  });
  const sorted = [...subset].sort((a, b) => {
    if (!a.startDate && !b.startDate) return 0;
    if (!a.startDate) return 1;
    if (!b.startDate) return -1;
    return a.startDate < b.startDate ? -1 : a.startDate > b.startDate ? 1 : 0;
  });
  const next = [...phases];
  indices.forEach((idx, i) => {
    next[idx] = sorted[i];
  });
  return next;
}

function App() {
  const [data, setData] = useState(() => loadData());
  const [selectedProjectId, setSelectedProjectId] = useState(() => data.projects[0]?.id ?? null);
  const [editMode, setEditMode] = useState(false);
  const [draftPhases, setDraftPhases] = useState(null);

  useEffect(() => {
    saveData(data);
  }, [data]);

  const selectedProject = data.projects.find((p) => p.id === selectedProjectId) ?? null;
  const visiblePhases = editMode ? draftPhases : selectedProject?.phases ?? [];

  function exitEditMode() {
    setEditMode(false);
    setDraftPhases(null);
  }

  function handleSelectProject(id) {
    if (editMode) exitEditMode();
    setSelectedProjectId(id);
  }

  function handleNewProject(name) {
    const project = createProject(name);
    setData((d) => ({ ...d, projects: [...d.projects, project] }));
    setSelectedProjectId(project.id);
  }

  function handleRenameProject(id, name) {
    setData((d) => ({
      ...d,
      projects: d.projects.map((p) => (p.id === id ? { ...p, name } : p)),
    }));
  }

  function handleDeleteProject(id) {
    const remaining = data.projects.filter((p) => p.id !== id);
    setData((d) => ({ ...d, projects: d.projects.filter((p) => p.id !== id) }));
    if (selectedProjectId === id) {
      setSelectedProjectId(remaining[0]?.id ?? null);
    }
    if (editMode) exitEditMode();
  }

  function handleEnterEditMode() {
    if (!selectedProject) return;
    setDraftPhases(selectedProject.phases.map((p) => ({ ...p })));
    setEditMode(true);
  }

  function handleConfirm() {
    setData((d) => ({
      ...d,
      projects: d.projects.map((p) =>
        p.id === selectedProjectId ? { ...p, phases: draftPhases } : p
      ),
    }));
    exitEditMode();
  }

  function handleCancel() {
    exitEditMode();
  }

  function handlePhaseChange(phaseId, updates) {
    setDraftPhases((phases) => {
      const updated = phases.map((p) => (p.id === phaseId ? { ...p, ...updates } : p));
      if ('startDate' in updates) {
        const phase = updated.find((p) => p.id === phaseId);
        if (phase.type === 'sub') {
          return sortSubPhasesByStartDate(updated, phase.parentId);
        }
      }
      return updated;
    });
  }

  function handleAddSubPhase(parentId, name) {
    setDraftPhases((phases) => {
      const parent = phases.find((p) => p.id === parentId);
      const newPhase = createSubPhase(name, parentId, parent ? lightenColor(parent.color) : undefined, parent?.startDate ?? null);
      const parentIndex = phases.findIndex((p) => p.id === parentId);
      let insertIndex = parentIndex + 1;
      while (insertIndex < phases.length && phases[insertIndex].parentId === parentId) {
        insertIndex += 1;
      }
      const next = [...phases];
      next.splice(insertIndex, 0, newPhase);
      return next;
    });
  }

  function handleAddMainPhase(name) {
    setDraftPhases((phases) => [...phases, createMainPhase(name)]);
  }

  // Groups the flat phase array into contiguous [main phase, ...its sub-phases]
  // blocks, moves the dragged main phase's block to where the target main
  // phase's block sits, then flattens back to a single array. Moving the
  // block as a unit keeps sub-phases grouped with their parent.
  function handleReorderMainPhase(draggedId, targetId) {
    if (draggedId === targetId) return;
    setDraftPhases((phases) => {
      const blocks = [];
      for (const p of phases) {
        if (p.type === 'main') {
          blocks.push({ id: p.id, items: [p] });
        } else {
          blocks[blocks.length - 1].items.push(p);
        }
      }
      const fromIndex = blocks.findIndex((b) => b.id === draggedId);
      const toIndex = blocks.findIndex((b) => b.id === targetId);
      if (fromIndex === -1 || toIndex === -1) return phases;
      const [moved] = blocks.splice(fromIndex, 1);
      blocks.splice(toIndex, 0, moved);
      return blocks.flatMap((b) => b.items);
    });
  }

  function handleDeletePhase(phaseId) {
    setDraftPhases((phases) => phases.filter((p) => p.id !== phaseId && p.parentId !== phaseId));
  }

  function handleResetDemo() {
    if (!window.confirm('Reset all data back to the demo projects? This cannot be undone.')) return;
    const seeded = resetToDemoData();
    setData(seeded);
    setSelectedProjectId(seeded.projects[0]?.id ?? null);
    exitEditMode();
  }

  return (
    <div className="app">
      <Sidebar
        projects={data.projects}
        selectedProjectId={selectedProjectId}
        onSelect={handleSelectProject}
        onNewProject={handleNewProject}
        onRenameProject={handleRenameProject}
        onDeleteProject={handleDeleteProject}
        onResetDemo={handleResetDemo}
      />
      <GanttView
        project={selectedProject}
        phases={visiblePhases}
        editMode={editMode}
        onEnterEditMode={handleEnterEditMode}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        onPhaseChange={handlePhaseChange}
        onAddSubPhase={handleAddSubPhase}
        onAddMainPhase={handleAddMainPhase}
        onReorderMainPhase={handleReorderMainPhase}
        onDeletePhase={handleDeletePhase}
      />
    </div>
  );
}

export default App;
