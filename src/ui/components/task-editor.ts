import React, { useState } from 'react';

interface TaskEditorProps {
    initialTask?: string;
    onSave: (task: string) => void;
    onCancel: () => void;
}

const TaskEditor: React.FC<TaskEditorProps> = ({ initialTask = '', onSave, onCancel }) => {
    const [task, setTask] = useState(initialTask);

    const handleSave = () => {
        onSave(task);
        setTask('');
    };

    return (
        <div className="task-editor">
            <textarea
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="Edit your task here..."
            />
            <div className="task-editor-actions">
                <button onClick={handleSave}>Save</button>
                <button onClick={onCancel}>Cancel</button>
            </div>
        </div>
    );
};

export default TaskEditor;