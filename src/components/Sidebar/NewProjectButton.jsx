import { useState } from 'react';

export default function NewProjectButton({ onCreate }) {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');

  function cancel() {
    setIsAdding(false);
    setName('');
  }

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onCreate(trimmed);
    cancel();
  }

  if (!isAdding) {
    return (
      <button type="button" className="new-project-btn" onClick={() => setIsAdding(true)}>
        + New Project
      </button>
    );
  }

  return (
    <form className="new-project-form" onSubmit={handleSubmit}>
      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Project name"
        onKeyDown={(e) => {
          if (e.key === 'Escape') cancel();
        }}
        onBlur={() => {
          if (!name.trim()) cancel();
        }}
      />
      <button type="submit">Add</button>
    </form>
  );
}
