import { useState } from 'react';

export default function AddPhaseRow({ rowHeight, labelWidth, onAdd }) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setName('');
    setAdding(false);
  }

  function cancel() {
    setAdding(false);
    setName('');
  }

  return (
    <div className="gantt-row gantt-row-add" style={{ height: rowHeight }}>
      <div className="gantt-label-cell" style={{ flexBasis: labelWidth, width: labelWidth }}>
        {adding ? (
          <form className="add-phase-form" onSubmit={handleSubmit}>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Phase name"
              onKeyDown={(e) => {
                if (e.key === 'Escape') cancel();
              }}
              onBlur={() => {
                if (!name.trim()) cancel();
              }}
            />
            <button type="submit">Add</button>
          </form>
        ) : (
          <button type="button" className="add-phase-btn" onClick={() => setAdding(true)}>
            + Add Main Phase
          </button>
        )}
      </div>
      <div className="gantt-timeline-cell" />
    </div>
  );
}
