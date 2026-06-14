import { useState } from 'react';

export default function ProjectList({ projects, selectedProjectId, onSelect, onRename, onDelete }) {
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  if (projects.length === 0) {
    return <p className="empty-message">No projects yet. Create one above.</p>;
  }

  function startEditing(project) {
    setEditingId(project.id);
    setEditingName(project.name);
  }

  function commitEdit() {
    const trimmed = editingName.trim();
    if (trimmed) {
      onRename(editingId, trimmed);
    }
    setEditingId(null);
  }

  return (
    <ul className="project-list">
      {projects.map((project) => (
        <li key={project.id} className={project.id === selectedProjectId ? 'selected' : ''}>
          {editingId === project.id ? (
            <input
              autoFocus
              type="text"
              className="project-rename-input"
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              onBlur={commitEdit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitEdit();
                if (e.key === 'Escape') setEditingId(null);
              }}
            />
          ) : (
            <button
              type="button"
              className="project-list-item"
              onClick={() => onSelect(project.id)}
              onDoubleClick={() => startEditing(project)}
            >
              {project.name}
            </button>
          )}
          <button
            type="button"
            className="project-rename-btn"
            title={`Rename ${project.name}`}
            onClick={(e) => {
              e.stopPropagation();
              startEditing(project);
            }}
          >
            {'✏️'}
          </button>
          <button
            type="button"
            className="project-delete-btn"
            title={`Delete ${project.name}`}
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm(`Delete project "${project.name}"? This cannot be undone.`)) {
                onDelete(project.id);
              }
            }}
          >
            ×
          </button>
        </li>
      ))}
    </ul>
  );
}
