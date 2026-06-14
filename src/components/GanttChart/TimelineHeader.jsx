export default function TimelineHeader({ monthMarkers, weekMarkers }) {
  return (
    <div className="timeline-header">
      <div className="timeline-month-row">
        {monthMarkers.map((m) => (
          <div key={m.label} className="timeline-month" style={{ left: m.x }}>
            {m.label}
          </div>
        ))}
      </div>
      <div className="timeline-week-row">
        {weekMarkers.map((m, i) => (
          <div key={i} className="timeline-week" style={{ left: m.x }}>
            {m.label}
          </div>
        ))}
      </div>
    </div>
  );
}
