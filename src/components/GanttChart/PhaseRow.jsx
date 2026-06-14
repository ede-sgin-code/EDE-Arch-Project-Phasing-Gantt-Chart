import { useRef, useState } from 'react';
import { parseISODate, toISODate, addDays, diffInDays, getToday, dateToX, getPhaseStatus, clampDateRange, formatShortDate } from '../../lib/dateUtils';
import { PIXELS_PER_DAY, MIN_BAR_WIDTH_FOR_DATE_LABELS } from '../../lib/ganttConfig';
import { getContrastTextColor } from '../../lib/colorUtils';
import ColorPicker from './ColorPicker';

export default function PhaseRow({ phase, range, editMode, rowHeight, labelWidth, onPhaseChange, onAddSubPhase, onDeletePhase }) {
  const dragRef = useRef(null);
  const [addingSubPhase, setAddingSubPhase] = useState(false);
  const [subPhaseName, setSubPhaseName] = useState('');

  const hasDates = Boolean(phase.startDate && phase.endDate);
  const barLeft = hasDates ? dateToX(parseISODate(phase.startDate), range.start) : 0;
  const barWidth = hasDates ? dateToX(parseISODate(phase.endDate), range.start) - barLeft : 0;
  const status = !editMode ? getPhaseStatus(phase) : null;
  const durationDays = hasDates ? diffInDays(parseISODate(phase.startDate), parseISODate(phase.endDate)) : '';
  const textColor = hasDates ? getContrastTextColor(phase.color) : null;
  const showInlineDates = hasDates && barWidth >= MIN_BAR_WIDTH_FOR_DATE_LABELS;
  const startLabel = hasDates ? formatShortDate(parseISODate(phase.startDate)) : '';
  const endLabel = hasDates ? formatShortDate(parseISODate(phase.endDate)) : '';

  function handleNameChange(e) {
    onPhaseChange(phase.id, { name: e.target.value });
  }

  function handleStartDateChange(e) {
    const value = e.target.value || null;
    if (value && phase.startDate && phase.endDate) {
      // Preserve the current duration: shift the end date along with the start date.
      const duration = diffInDays(parseISODate(phase.startDate), parseISODate(phase.endDate));
      const newEnd = addDays(parseISODate(value), duration);
      onPhaseChange(phase.id, { startDate: value, endDate: toISODate(newEnd) });
    } else if (value && phase.endDate) {
      onPhaseChange(phase.id, clampDateRange(value, phase.endDate));
    } else {
      onPhaseChange(phase.id, { startDate: value });
    }
  }

  function handleEndDateChange(e) {
    const value = e.target.value || null;
    if (phase.startDate && value) {
      onPhaseChange(phase.id, clampDateRange(phase.startDate, value));
    } else {
      onPhaseChange(phase.id, { endDate: value });
    }
  }

  function handleDurationChange(e) {
    const days = Math.round(Number(e.target.value));
    if (!Number.isFinite(days) || days < 1) return;
    const start = phase.startDate ? parseISODate(phase.startDate) : getToday();
    onPhaseChange(phase.id, { startDate: toISODate(start), endDate: toISODate(addDays(start, days)) });
  }

  function handlePercentChange(e) {
    const value = Math.min(100, Math.max(0, Number(e.target.value) || 0));
    onPhaseChange(phase.id, { percentComplete: value });
  }

  function handleColorChange(color) {
    onPhaseChange(phase.id, { color });
  }

  function handleToggleLock() {
    onPhaseChange(phase.id, { locked: !phase.locked });
  }

  function handleDelete() {
    const message = phase.type === 'main'
      ? `Delete "${phase.name}" and any of its sub-phases?`
      : `Delete "${phase.name}"?`;
    if (window.confirm(message)) {
      onDeletePhase(phase.id);
    }
  }

  function handleAddSubPhaseSubmit(e) {
    e.preventDefault();
    const trimmed = subPhaseName.trim();
    if (!trimmed) return;
    onAddSubPhase(phase.id, trimmed);
    setSubPhaseName('');
    setAddingSubPhase(false);
  }

  function cancelAddSubPhase() {
    setAddingSubPhase(false);
    setSubPhaseName('');
  }

  function handleDragMove(e) {
    const drag = dragRef.current;
    if (!drag) return;
    const deltaDays = Math.round((e.clientX - drag.startX) / PIXELS_PER_DAY);
    const origStart = parseISODate(drag.origStart);
    const origEnd = parseISODate(drag.origEnd);

    let newStart = origStart;
    let newEnd = origEnd;

    if (drag.type === 'move') {
      newStart = addDays(origStart, deltaDays);
      newEnd = addDays(origEnd, deltaDays);
    } else if (drag.type === 'resize-left') {
      newStart = addDays(origStart, deltaDays);
      if (newStart >= origEnd) newStart = addDays(origEnd, -1);
    } else {
      newEnd = addDays(origEnd, deltaDays);
      if (newEnd <= origStart) newEnd = addDays(origStart, 1);
    }

    onPhaseChange(phase.id, { startDate: toISODate(newStart), endDate: toISODate(newEnd) });
  }

  function handleDragEnd() {
    dragRef.current = null;
    window.removeEventListener('mousemove', handleDragMove);
    window.removeEventListener('mouseup', handleDragEnd);
  }

  function startDrag(type, e) {
    e.preventDefault();
    dragRef.current = {
      type,
      startX: e.clientX,
      origStart: phase.startDate,
      origEnd: phase.endDate,
    };
    window.addEventListener('mousemove', handleDragMove);
    window.addEventListener('mouseup', handleDragEnd);
  }

  function handleBarMouseDown(e) {
    startDrag('move', e);
  }

  function handleResizeLeftMouseDown(e) {
    e.stopPropagation();
    startDrag('resize-left', e);
  }

  function handleResizeRightMouseDown(e) {
    e.stopPropagation();
    startDrag('resize-right', e);
  }

  const draggable = editMode && !phase.locked && hasDates;

  return (
    <div className={`gantt-row${phase.type === 'sub' ? ' gantt-row-sub' : ''}`} style={{ height: rowHeight }}>
      <div className="gantt-label-cell" style={{ flexBasis: labelWidth, width: labelWidth }}>
        <div className="phase-label-top">
          {editMode ? (
            <input type="text" className="phase-name-input" value={phase.name} onChange={handleNameChange} />
          ) : (
            <span className="phase-name">{phase.name}</span>
          )}
          {editMode && (
            <div className="phase-row-actions">
              <ColorPicker color={phase.color} disabled={phase.locked} onChange={handleColorChange} />
              <button
                type="button"
                className="icon-btn"
                onClick={handleToggleLock}
                title={phase.locked ? 'Unlock phase' : 'Lock phase'}
              >
                {phase.locked ? '\u{1F512}' : '\u{1F513}'}
              </button>
              <button type="button" className="icon-btn icon-btn-danger" onClick={handleDelete} title="Delete phase">
                {'\u{1F5D1}'}
              </button>
            </div>
          )}
        </div>
        {editMode && (
          <div className="phase-edit-fields">
            <div className="edit-fields-row">
              <label className="field-label">
                Start
                <input type="date" value={phase.startDate ?? ''} onChange={handleStartDateChange} disabled={phase.locked} />
              </label>
              <label className="field-label">
                End
                <input type="date" value={phase.endDate ?? ''} onChange={handleEndDateChange} disabled={phase.locked} />
              </label>
            </div>
            <div className="edit-fields-row">
              <label className="field-label">
                Days
                <input
                  type="number"
                  min="1"
                  className="duration-input"
                  value={durationDays}
                  onChange={handleDurationChange}
                  disabled={phase.locked}
                />
              </label>
              <label className="field-label">
                %
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="percent-input"
                  value={phase.percentComplete}
                  onChange={handlePercentChange}
                />
              </label>
            </div>
          </div>
        )}
        {editMode && phase.type === 'main' && (
          addingSubPhase ? (
            <form className="add-subphase-form" onSubmit={handleAddSubPhaseSubmit}>
              <input
                autoFocus
                type="text"
                value={subPhaseName}
                onChange={(e) => setSubPhaseName(e.target.value)}
                placeholder="Sub-phase name"
                onKeyDown={(e) => {
                  if (e.key === 'Escape') cancelAddSubPhase();
                }}
                onBlur={() => {
                  if (!subPhaseName.trim()) cancelAddSubPhase();
                }}
              />
              <button type="submit">Add</button>
            </form>
          ) : (
            <button type="button" className="add-subphase-btn" onClick={() => setAddingSubPhase(true)}>
              + Add Sub-Phase
            </button>
          )
        )}
      </div>
      <div className="gantt-timeline-cell">
        {hasDates ? (
          <>
            <div
              className="phase-bar"
              style={{ left: barLeft, width: barWidth, backgroundColor: phase.color }}
              onMouseDown={draggable ? handleBarMouseDown : undefined}
            >
              <div className="phase-bar-progress" style={{ width: `${phase.percentComplete}%` }} />
              {draggable && (
                <>
                  <div className="resize-handle resize-handle-left" onMouseDown={handleResizeLeftMouseDown} />
                  <div className="resize-handle resize-handle-right" onMouseDown={handleResizeRightMouseDown} />
                </>
              )}
              {showInlineDates && (
                <>
                  <span className="bar-date-label bar-date-start" style={{ color: textColor }}>
                    • {startLabel}
                  </span>
                  <span className="bar-date-label bar-date-end" style={{ color: textColor }}>
                    {endLabel} •
                  </span>
                </>
              )}
            </div>
            {!showInlineDates && (
              <div className="bar-date-tooltip" style={{ left: barLeft + barWidth / 2 }}>
                • {startLabel} - {endLabel} •
              </div>
            )}
            {status && (
              <span
                className={`phase-status${status.overdue ? ' overdue' : ''}`}
                style={{ left: barLeft + barWidth + 8 }}
              >
                {status.label}
              </span>
            )}
          </>
        ) : (
          <span className="no-dates-placeholder">{editMode ? 'Set dates →' : 'No dates set'}</span>
        )}
      </div>
    </div>
  );
}
