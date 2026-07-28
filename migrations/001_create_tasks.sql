CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL CHECK (length(trim(title)) > 0),
    description TEXT NOT NULL DEFAULT '',
    due_date TEXT NOT NULL CHECK (
        due_date GLOB '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]'
        AND date(due_date) = due_date
    ),
    topic TEXT NOT NULL CHECK (length(trim(topic)) > 0),
    status TEXT NOT NULL DEFAULT 'TODO' CHECK (
        status IN ('TODO', 'IN_PROGRESS', 'COMPLETE')
    ),
    archived_at TEXT,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_tasks_archived_at ON tasks (archived_at);
CREATE INDEX IF NOT EXISTS idx_tasks_topic ON tasks (topic);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks (status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks (due_date);