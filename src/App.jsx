import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import GanttView from './components/GanttView/GanttView';
import { loadData, saveData, resetToDemoData } from './lib/storage';
import { createProject, createSubPhase, lightenColor } from './lib/seedData';
import './App.css';

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
    setDraftPhases((phases) => phases.map((p) => (p.id === phaseId ? { ...p, ...updates } : p)));
  }

  function handleAddSubPhase(parentId, name) {
    setDraftPhases((phases) => {
      const parent = phases.find((p) => p.id === parentId);
      const newPhase = createSubPhase(name, parentId, parent ? lightenColor(parent.color) : undefined);
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
        onDeletePhase={handleDeletePhase}
      />
    </div>
  );
}

export default App;
