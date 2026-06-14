export default function Toolbar({ projectName, editMode, onEnterEditMode, onConfirm, onCancel, onExportPdf }) {
  return (
    <div className="toolbar">
      <h2 className="project-title">{projectName}</h2>
      <div className="toolbar-actions">
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
          </>
        )}
      </div>
    </div>
  );
}
