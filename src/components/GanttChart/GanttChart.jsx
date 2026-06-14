import { useState } from 'react';
import { getProjectDateRange, getMonthMarkers, getWeekMarkers, dateToX } from '../../lib/dateUtils';
import { ROW_HEIGHT, ROW_HEIGHT_EDITING, HEADER_HEIGHT, LABEL_WIDTH, LABEL_WIDTH_EDITING } from '../../lib/ganttConfig';
import TimelineHeader from './TimelineHeader';
import PhaseRow from './PhaseRow';
import AddPhaseRow from './AddPhaseRow';
import TodayLine from './TodayLine';
import './GanttChart.css';

export default function GanttChart({ phases, editMode, pixelsPerDay, onPhaseChange, onAddSubPhase, onAddMainPhase, onReorderMainPhase, onDeletePhase }) {
  const [dragState, setDragState] = useState({ draggedId: null, overId: null });
  const [collapsedIds, setCollapsedIds] = useState(() => new Set());
  const range = getProjectDateRange(phases);
  const chartWidth = dateToX(range.end, range.start, pixelsPerDay);
  const labelWidth = editMode ? LABEL_WIDTH_EDITING : LABEL_WIDTH;
  const rowHeight = editMode ? ROW_HEIGHT_EDITING : ROW_HEIGHT;
  const totalWidth = labelWidth + chartWidth;
  const visiblePhases = phases.filter((p) => !(p.parentId && collapsedIds.has(p.parentId)));
  const dataBodyHeight = visiblePhases.length * rowHeight;
  const bodyHeight = dataBodyHeight + (editMode ? rowHeight : 0);
  const monthMarkers = getMonthMarkers(range, pixelsPerDay);
  const weekMarkers = getWeekMarkers(range, pixelsPerDay);

  function toggleCollapse(phaseId) {
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      if (next.has(phaseId)) next.delete(phaseId);
      else next.add(phaseId);
      return next;
    });
  }

  function handleRowDragStart(phaseId) {
    setDragState({ draggedId: phaseId, overId: null });
  }

  function handleRowDragOver(phaseId) {
    setDragState((s) => (s.draggedId ? { ...s, overId: phaseId } : s));
  }

  function handleRowDrop(targetId) {
    if (dragState.draggedId) onReorderMainPhase(dragState.draggedId, targetId);
    setDragState({ draggedId: null, overId: null });
  }

  function handleRowDragEnd() {
    setDragState({ draggedId: null, overId: null });
  }

  return (
    <div className="gantt-chart" style={{ width: totalWidth }}>
      <div className="gantt-header-row" style={{ height: HEADER_HEIGHT }}>
        <div className="gantt-label-cell" style={{ flexBasis: labelWidth, width: labelWidth }} />
        <div className="gantt-timeline-cell">
          <TimelineHeader monthMarkers={monthMarkers} weekMarkers={weekMarkers} />
        </div>
      </div>
      <div className="gantt-body" style={{ height: bodyHeight }}>
        {visiblePhases.map((phase) => (
          <PhaseRow
            key={phase.id}
            phase={phase}
            range={range}
            editMode={editMode}
            rowHeight={rowHeight}
            labelWidth={labelWidth}
            pixelsPerDay={pixelsPerDay}
            onPhaseChange={onPhaseChange}
            onAddSubPhase={onAddSubPhase}
            onDeletePhase={onDeletePhase}
            dragState={dragState}
            onRowDragStart={handleRowDragStart}
            onRowDragOver={handleRowDragOver}
            onRowDrop={handleRowDrop}
            onRowDragEnd={handleRowDragEnd}
            hasSubPhases={phase.type === 'main' && phases.some((p) => p.parentId === phase.id)}
            isCollapsed={collapsedIds.has(phase.id)}
            onToggleCollapse={toggleCollapse}
          />
        ))}
        {editMode && <AddPhaseRow rowHeight={rowHeight} labelWidth={labelWidth} onAdd={onAddMainPhase} />}
        {monthMarkers.map((m) => (
          <div key={m.label} className="month-gridline" style={{ left: labelWidth + m.x, height: dataBodyHeight }} />
        ))}
        <TodayLine range={range} pixelsPerDay={pixelsPerDay} bodyHeight={dataBodyHeight} labelWidth={labelWidth} />
      </div>
    </div>
  );
}
