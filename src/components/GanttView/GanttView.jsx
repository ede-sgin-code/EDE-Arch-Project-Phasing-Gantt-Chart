import { useRef } from 'react';
import Toolbar from './Toolbar';
import GanttChart from '../GanttChart/GanttChart';
import { exportToPdf } from '../../lib/pdfExport';
import './GanttView.css';

export default function GanttView({
  project,
  phases,
  editMode,
  onEnterEditMode,
  onConfirm,
  onCancel,
  onPhaseChange,
  onAddSubPhase,
  onDeletePhase,
}) {
  const scrollRef = useRef(null);

  if (!project) {
    return (
      <main className="gantt-view gantt-view-empty">
        <p>No project selected. Create one from the sidebar to get started.</p>
      </main>
    );
  }

  function handleExportPdf() {
    exportToPdf(scrollRef.current, project.name);
  }

  return (
    <main className="gantt-view">
      <Toolbar
        projectName={project.name}
        editMode={editMode}
        onEnterEditMode={onEnterEditMode}
        onConfirm={onConfirm}
        onCancel={onCancel}
        onExportPdf={handleExportPdf}
      />
      <div className="gantt-scroll-container" ref={scrollRef}>
        <GanttChart
          phases={phases}
          editMode={editMode}
          onPhaseChange={onPhaseChange}
          onAddSubPhase={onAddSubPhase}
          onDeletePhase={onDeletePhase}
        />
      </div>
    </main>
  );
}
