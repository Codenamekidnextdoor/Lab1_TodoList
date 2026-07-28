'use client';

import { Archive, Pencil, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

import type { TaskInput, TaskSort, TaskWithOverdue } from '../../../types/task';
import { archiveTask, createTask, listTasks, updateTask } from '../../lib/task-api';
import { TaskForm } from '../tasks/TaskForm';
import { Button } from '../ui/Button';

export function AppShell() {
  const [tasks, setTasks] = useState<TaskWithOverdue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [archived, setArchived] = useState(false);
  const [sort, setSort] = useState<TaskSort>('dueDate');
  const [error, setError] = useState('');

  useEffect(() => {
    listTasks({ archived, sort })
      .then(setTasks)
      .catch((reason: unknown) => {
        setError(reason instanceof Error ? reason.message : 'Could not load tasks');
      })
      .finally(() => setIsLoading(false));
  }, [archived, sort]);

  async function handleCreate(input: TaskInput): Promise<void> {
    setError('');
    try {
      const task = await createTask(input);
      setTasks((current) => [...current, task]);
      setIsCreating(false);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not create task');
    }
  }

  async function handleUpdate(id: number, input: TaskInput): Promise<void> {
    setError('');
    try {
      const updated = await updateTask(id, input);
      setTasks((current) => current.map((task) => task.id === id ? updated : task));
      setEditingId(null);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not update task');
    }
  }

  async function handleArchive(id: number): Promise<void> {
    setError('');
    try {
      await archiveTask(id);
      setTasks((current) => current.filter((task) => task.id !== id));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not archive task');
    }
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Local workspace</p>
          <h1>Tasks</h1>
        </div>
        <Button type="button" onClick={() => setIsCreating(true)}>
          <Plus aria-hidden="true" size={18} />
          Add task
        </Button>
      </header>

      {isCreating && (
        <section aria-labelledby="new-task-title" className="task-editor">
          <h2 id="new-task-title">New task</h2>
          <TaskForm onSubmit={handleCreate} submitLabel="Create task" />
        </section>
      )}

      {error && <p role="alert">{error}</p>}

      <section aria-labelledby="task-list-title" className="task-workspace">
        <div className="task-toolbar">
          <div className="view-switcher" aria-label="Task view">
            <Button
              type="button"
              variant={archived ? 'secondary' : 'primary'}
              aria-pressed={!archived}
              onClick={() => {
                setIsLoading(true);
                setError('');
                setArchived(false);
              }}
            >
              Active
            </Button>
            <Button
              type="button"
              variant={archived ? 'primary' : 'secondary'}
              aria-pressed={archived}
              onClick={() => {
                setIsLoading(true);
                setError('');
                setArchived(true);
              }}
            >
              Archived
            </Button>
          </div>
          <label className="sort-control">
            <span>Sort tasks</span>
            <select value={sort} onChange={(event) => {
              setIsLoading(true);
              setError('');
              setSort(event.target.value as TaskSort);
            }}>
              <option value="dueDate">Due date</option>
              <option value="topic">Topic</option>
              <option value="status">Status</option>
            </select>
          </label>
        </div>
        <h2 id="task-list-title">{archived ? 'Archived tasks' : 'Active tasks'}</h2>
        {isLoading ? (
          <p>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p>{archived ? 'No archived tasks' : 'No active tasks'}</p>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task.id} className="task-item">
                {editingId === task.id ? (
                  <TaskForm
                    initialValues={task}
                    onSubmit={(input) => handleUpdate(task.id, input)}
                    submitLabel="Save changes"
                  />
                ) : (
                  <>
                    <div className="task-copy">
                      <p className="task-topic">{task.topic}</p>
                      <h3>{task.title}</h3>
                      <p className="task-description">{task.description}</p>
                      {task.isOverdue && <p className="overdue-label">Overdue</p>}
                    </div>
                    <dl>
                      <div><dt>Status</dt><dd>{task.status.replace('_', ' ')}</dd></div>
                      <div><dt>Due</dt><dd>{task.dueDate}</dd></div>
                    </dl>
                    {!archived && <div className="task-actions">
                      <Button
                        type="button"
                        variant="icon"
                        aria-label={`Edit ${task.title}`}
                        onClick={() => setEditingId(task.id)}
                      >
                        <Pencil aria-hidden="true" size={17} />
                      </Button>
                      <Button
                        type="button"
                        variant="icon"
                        aria-label={`Archive ${task.title}`}
                        onClick={() => handleArchive(task.id)}
                      >
                        <Archive aria-hidden="true" size={17} />
                      </Button>
                    </div>}
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}