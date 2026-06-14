export default function Toolbar({
  projectName,
  editMode,
  onEnterEditMode,
  onConfirm,
  onCancel,
  onExportPdf,
  onExportExcel,
  zoomPercent,
  onZoomIn,
  onZoomOut,
  canZoomIn,
  canZoomOut,
}) {
  return (
    <div className="toolbar">
      <h2 className="project-title">{projectName}</h2>
      <div className="toolbar-actions">
        <div className="zoom-controls">
          <button
            type="button"
            className="zoom-btn"
            onClick={onZoomOut}
            disabled={!canZoomOut}
            title="Zoom out (Ctrl+Scroll or -)"
          >
            −
          </button>
          <span className="zoom-level">{zoomPercent}%</span>
          <button
            type="button"
            className="zoom-btn"
            onClick={onZoomIn}
            disabled={!canZoomIn}
            title="Zoom in (Ctrl+Scroll or +)"
          >
            +
          </button>
        </div>
        {editMode ? (
          <>
            <button type="button" className="toolbar-btn toolbar-btn-primary" onClick={onConfirm}>
              Confirm
            </button>
            <button type="button" className="toolbar-btn" onClick={onCancel}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <button type="button" className="toolbar-btn toolbar-btn-primary" onClick={onEnterEditMode}>
              Edit Schedule
            </button>
            <button type="button" className="toolbar-btn" onClick={onExportPdf}>
              Export PDF
            </button>
            <button type="button" className="toolbar-btn" onClick={onExportExcel}>
              Export Excel
            </button>
          </>
        )}
      </div>
    </div>
  );
}
