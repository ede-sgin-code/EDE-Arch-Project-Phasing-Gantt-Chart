import ProjectList from './ProjectList';
import NewProjectButton from './NewProjectButton';
import './Sidebar.css';

export default function Sidebar({ projects, selectedProjectId, onSelect, onNewProject, onRenameProject, onDeleteProject, onResetDemo }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">Projects</h1>
        <NewProjectButton onCreate={onNewProject} />
      </div>
      <ProjectList
        projects={projects}
        selectedProjectId={selectedProjectId}
        onSelect={onSelect}
        onRename={onRenameProject}
        onDelete={onDeleteProject}
      />
      <button type="button" className="reset-demo-btn" onClick={onResetDemo}>
        Reset to demo data
      </button>
    </aside>
  );
}
