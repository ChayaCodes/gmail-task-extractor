import { h } from 'preact';
import { useState } from 'preact/hooks';

// אפשר להשתמש ב-any במקום להגדיר ממשק מלא
export function TaskBoxInput({ onAddEvent, initialData = {} }: any) {
  const [formData, setFormData] = useState({
    subject: initialData.subject || '',
    description: initialData.description || '',
    startDate: initialData.startDate || '',
    startTime: initialData.startTime || '',
    endDate: initialData.endDate || '',
    endTime: initialData.endTime || '',
    location: initialData.location || '',
  });

  const handleChange = (e: any) => {
    const { target } = e;
    setFormData({
      ...formData,
      [target.id.replace('input', '').toLowerCase()]: target.value
    });
  };

  // פונקציית הטיפול בלחיצה על כפתור השליחה
  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (onAddEvent) {
      onAddEvent(formData);
    }
  };

  return (
    <div className="TaskBoxInput">
      <input 
        type="text" 
        id="inputSubject" 
        placeholder="Subject" 
        value={formData.subject}
        onChange={handleChange}
      />
      <textarea 
        id="inputDescription" 
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
      />
      <input 
        type="date" 
        id="inputStartDate" 
        placeholder="Start Date" 
        value={formData.startDate}
        onChange={handleChange}
      />
      <input 
        type="time" 
        id="inputStartTime" 
        placeholder="Start Time" 
        value={formData.startTime}
        onChange={handleChange}
      />
      <input 
        type="date" 
        id="inputEndDate" 
        placeholder="End Date" 
        value={formData.endDate}
        onChange={handleChange}
      />
      <input 
        type="time" 
        id="inputEndTime" 
        placeholder="End Time" 
        value={formData.endTime}
        onChange={handleChange}
      />
      <input 
        type="text" 
        id="inputLocation" 
        placeholder="Location" 
        value={formData.location}
        onChange={handleChange}
      />
      <button onClick={handleSubmit}>Add Event</button>
    </div>
  );
}