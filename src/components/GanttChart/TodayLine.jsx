import { getToday, dateToX } from '../../lib/dateUtils';

export default function TodayLine({ range, pixelsPerDay, bodyHeight, labelWidth }) {
  const todayX = dateToX(getToday(), range.start, pixelsPerDay);

  return (
    <>
      <div
        className="today-overlay"
        style={{ left: labelWidth, width: todayX, height: bodyHeight }}
      />
      <div className="today-line" style={{ left: labelWidth + todayX, height: bodyHeight }}>
        <span className="today-line-label">Today</span>
      </div>
    </>
  );
}
