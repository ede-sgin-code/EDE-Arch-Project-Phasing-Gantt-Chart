import { useCallback, useEffect, useRef, useState } from 'react';
import Toolbar from './Toolbar';
import GanttChart from '../GanttChart/GanttChart';
import { PIXELS_PER_DAY, ZOOM_LEVELS, DEFAULT_ZOOM_INDEX } from '../../lib/ganttConfig';
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
  const [zoomIndex, setZoomIndex] = useState(DEFAULT_ZOOM_INDEX);

  const zoomIn = useCallback(() => {
    setZoomIndex((i) => Math.min(i + 1, ZOOM_LEVELS.length - 1));
  }, []);

  const zoomOut = useCallback(() => {
    setZoomIndex((i) => Math.max(i - 1, 0));
  }, []);

  // Ctrl + scroll zooms the chart horizontally instead of scrolling the page.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return undefined;

    function handleWheel(e) {
      if (!e.ctrlKey) return;
      e.preventDefault();
      if (e.deltaY < 0) zoomIn();
      else zoomOut();
    }

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [zoomIn, zoomOut, project]);

  // +/- keys zoom the chart, unless the user is typing in a field.
  useEffect(() => {
    function handleKeyDown(e) {
      const tag = e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return;
      if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        zoomIn();
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        zoomOut();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoomIn, zoomOut]);

  if (!project) {
    return (
      <main className="gantt-view gantt-view-empty">
        <p>No project selected. Create one from the sidebar to get started.</p>
      </main>
    );
  }

  async function handleExportPdf() {
    const { exportToPdf } = await import('../../lib/pdfExport');
    exportToPdf(scrollRef.current, project.name);
  }

  async function handleExportExcel() {
    const { exportToExcel } = await import('../../lib/excelExport');
    exportToExcel(phases, project.name);
  }

  const pixelsPerDay = ZOOM_LEVELS[zoomIndex];
  const zoomPercent = Math.round((pixelsPerDay / PIXELS_PER_DAY) * 100);

  return (
    <main className="gantt-view">
      <Toolbar
        projectName={project.name}
        editMode={editMode}
        onEnterEditMode={onEnterEditMode}
        onConfirm={onConfirm}
        onCancel={onCancel}
        onExportPdf={handleExportPdf}
        onExportExcel={handleExportExcel}
        zoomPercent={zoomPercent}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        canZoomIn={zoomIndex < ZOOM_LEVELS.length - 1}
        canZoomOut={zoomIndex > 0}
      />
      <div className="gantt-scroll-container" ref={scrollRef}>
        <GanttChart
          phases={phases}
          editMode={editMode}
          pixelsPerDay={pixelsPerDay}
          onPhaseChange={onPhaseChange}
          onAddSubPhase={onAddSubPhase}
          onDeletePhase={onDeletePhase}
        />
      </div>
    </main>
  );
}
