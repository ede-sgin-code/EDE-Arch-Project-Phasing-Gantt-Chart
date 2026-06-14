export const PIXELS_PER_DAY = 6;
export const ROW_HEIGHT = 40;
export const ROW_HEIGHT_EDITING = 176;
export const HEADER_HEIGHT = 48;
export const LABEL_WIDTH = 220;
export const LABEL_WIDTH_EDITING = 360;
export const TIMELINE_PADDING_DAYS = 7;
export const MIN_BAR_WIDTH_FOR_DATE_LABELS = 110;

// Horizontal zoom steps (pixels per day) for the Gantt chart. PIXELS_PER_DAY
// is the default/100% level; the lowest value is the zoom-out floor.
export const ZOOM_LEVELS = [2, 3, 4, 6, 8, 10, 14, 20];
export const DEFAULT_ZOOM_INDEX = ZOOM_LEVELS.indexOf(PIXELS_PER_DAY);

// Minimum week-cell width (7 * pixelsPerDay) for each week-label tier.
export const WEEK_LABEL_FULL_MIN_WIDTH = 60; // "Week 1"
export const WEEK_LABEL_ABBR_MIN_WIDTH = 24; // "W1", below this -> "1"
