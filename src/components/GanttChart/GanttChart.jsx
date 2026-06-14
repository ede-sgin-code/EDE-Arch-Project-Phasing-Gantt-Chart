import { getProjectDateRange, getMonthMarkers, getWeekMarkers, dateToX } from '../../lib/dateUtils';
import { ROW_HEIGHT, ROW_HEIGHT_EDITING, HEADER_HEIGHT, LABEL_WIDTH, LABEL_WIDTH_EDITING } from '../../lib/ganttConfig';
import TimelineHeader from './TimelineHeader';
import PhaseRow from './PhaseRow';
import TodayLine from './TodayLine';
import './GanttChart.css';

export default function GanttChart({ phases, editMode, onPhaseChange, onAddSubPhase, onDeletePhase }) {
  const range = getProjectDateRange(phases);
  const chartWidth = dateToX(range.end, range.start);
  const labelWidth = editMode ? LABEL_WIDTH_EDITING : LABEL_WIDTH;
  const rowHeight = editMode ? ROW_HEIGHT_EDITING : ROW_HEIGHT;
  const totalWidth = labelWidth + chartWidth;
  const bodyHeight = phases.length * rowHeight;
  const monthMarkers = getMonthMarkers(range);
  const weekMarkers = getWeekMarkers(range);

  return (
    <div className="gantt-chart" style={{ width: totalWidth }}>
      <div className="gantt-header-row" style={{ height: HEADER_HEIGHT }}>
        <div className="gantt-label-cell" style={{ flexBasis: labelWidth, width: labelWidth }} />
        <div className="gantt-timeline-cell">
          <TimelineHeader monthMarkers={monthMarkers} weekMarkers={weekMarkers} />
        </div>
      </div>
      <div className="gantt-body" style={{ height: bodyHeight }}>
        {phases.map((phase) => (
          <PhaseRow
            key={phase.id}
            phase={phase}
            range={range}
            editMode={editMode}
            rowHeight={rowHeight}
            labelWidth={labelWidth}
            onPhaseChange={onPhaseChange}
            onAddSubPhase={onAddSubPhase}
            onDeletePhase={onDeletePhase}
          />
        ))}
        {monthMarkers.map((m) => (
          <div key={m.label} className="month-gridline" style={{ left: labelWidth + m.x }} />
        ))}
        <TodayLine range={range} bodyHeight={bodyHeight} labelWidth={labelWidth} />
      </div>
    </div>
  );
}
