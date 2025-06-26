import { h } from 'preact';
import { useState } from 'preact/hooks';
import { TaskBoxInput } from './TaskBox';

export function SideBar({ initialTasks = [], onTaskUpdate }: any) {
  const [tasks, setTasks] = useState(initialTasks);
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);

  // טיפול בהוספת משימה חדשה
  const handleAddTask = (taskData: any) => {
    const newTask = {
      id: Date.now(), // מזהה ייחודי פשוט
      ...taskData
    };
    
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    setShowNewTaskForm(false);
    
    if (onTaskUpdate) {
      onTaskUpdate(updatedTasks);
    }
  };

  // טיפול בעדכון משימה קיימת
  const handleUpdateTask = (taskId: number, updatedData: any) => {
    const updatedTasks = tasks.map((task: any) => 
      task.id === taskId ? { ...task, ...updatedData } : task
    );
    
    setTasks(updatedTasks);
    
    if (onTaskUpdate) {
      onTaskUpdate(updatedTasks);
    }
  };

  // טיפול במחיקת משימה
  const handleDeleteTask = (taskId: number) => {
    const updatedTasks = tasks.filter((task: any) => task.id !== taskId);
    setTasks(updatedTasks);
    
    if (onTaskUpdate) {
      onTaskUpdate(updatedTasks);
    }
  };

  return (
    <div className="sidebar">
      <h2>משימות ואירועים</h2>
      
      {/* הצג את כל המשימות הקיימות */}
      {tasks.length > 0 ? (
        <div className="task-list">
          {tasks.map((task: any) => (
            <div key={task.id} className="task-item">
              <h3>{task.subject}</h3>
              <p>{task.description}</p>
              
              {/* כפתורי פעולות */}
              <div className="task-actions">
                <button onClick={() => handleDeleteTask(task.id)}>מחק</button>
                <button onClick={() => {/* להציג טופס עריכה */}}>ערוך</button>
              </div>
              
              {/* אפשרות לפתיחת TaskBox לעריכת המשימה */}
              {/* כאן יש לממש לוגיקת עריכה */}
            </div>
          ))}
        </div>
      ) : (
        <p>אין משימות להצגה</p>
      )}
      
      {/* טופס להוספת משימה חדשה */}
      {showNewTaskForm ? (
        <div className="new-task-form">
          <h3>הוסף משימה חדשה</h3>
          <TaskBoxInput 
            onAddEvent={handleAddTask}
            initialData={{}}
          />
          <button onClick={() => setShowNewTaskForm(false)}>ביטול</button>
        </div>
      ) : (
        <button onClick={() => setShowNewTaskForm(true)}>+ הוסף משימה חדשה</button>
      )}
    </div>
  );
}