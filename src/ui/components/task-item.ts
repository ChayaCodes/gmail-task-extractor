import React from 'react';

interface TaskItemProps {
    task: {
        id: string;
        title: string;
        description?: string;
        dueDate?: string;
        completed: boolean;
    };
    onToggleComplete: (id: string) => void;
    onEdit: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleComplete, onEdit }) => {
    return (
        <div className="task-item">
            <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggleComplete(task.id)}
            />
            <div className="task-details">
                <h3>{task.title}</h3>
                {task.description && <p>{task.description}</p>}
                {task.dueDate && <p>Due: {task.dueDate}</p>}
            </div>
            <button onClick={() => onEdit(task.id)}>Edit</button>
        </div>
    );
};

export default TaskItem;