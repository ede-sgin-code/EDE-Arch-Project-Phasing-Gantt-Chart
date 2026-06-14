export default function ProjectList({ projects, selectedProjectId, onSelect, onDelete }) {
  if (projects.length === 0) {
    return <p className="empty-message">No projects yet. Create one above.</p>;
  }

  return (
    <ul className="project-list">
      {projects.map((project) => (
        <li key={project.id} className={project.id === selectedProjectId ? 'selected' : ''}>
          <button type="button" className="project-list-item" onClick={() => onSelect(project.id)}>
            {project.name}
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
