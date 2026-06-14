export default function TimelineHeader({ markers }) {
  return (
    <div className="timeline-header">
      {markers.map((m) => (
        <div key={m.label} className="timeline-month" style={{ left: m.x }}>
          {m.label}
        </div>
      ))}
    </div>
  );
}
