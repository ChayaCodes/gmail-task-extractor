import { Task } from '../interfaces/task.interface';

export const saveTasksToLocalStorage = (tasks: Task[]): void => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

export const getTasksFromLocalStorage = (): Task[] => {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
};

export const clearTasksFromLocalStorage = (): void => {
    localStorage.removeItem('tasks');
};

export const saveUserPreferences = (preferences: Record<string, any>): void => {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
};

export const getUserPreferences = (): Record<string, any> => {
    const preferences = localStorage.getItem('userPreferences');
    return preferences ? JSON.parse(preferences) : {};
};