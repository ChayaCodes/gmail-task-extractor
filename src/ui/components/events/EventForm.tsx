import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { Event } from '/src/types/event.types';
import '/src/ui/styles/EventForm.css';

export function EventForm({ 
  event, 
  onEventChange 
}: {
  event: Event;
  onEventChange: (updatedEvent: Event) => void;
}) {
  const [formData, setFormData] = useState<Event>({...event});

  // עדכון הטופס כשמשתנה האירוע הפעיל
  useEffect(() => {
    setFormData({...event});
  }, [event]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    const updatedEvent = {
      ...formData,
      [name]: value
    };
    setFormData(updatedEvent);
    onEventChange(updatedEvent);
  };

  return (
    <div className="event-form">
      <div className="form-group">
        <label htmlFor="title">כותרת</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="כותרת האירוע"
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">תיאור</label>
        <textarea
          id="description"
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          placeholder="פרטים נוספים על האירוע"
          rows={3}
        />
      </div>

      <div className="form-row">
        <div className="form-group date-time-group">
          <label htmlFor="startDate">תאריך התחלה</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
          />
        </div>
        <div className="form-group date-time-group">
          <label htmlFor="startTime">שעת התחלה</label>
          <input
            type="time"
            id="startTime"
            name="startTime"
            value={formData.startTime || ''}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group date-time-group">
          <label htmlFor="endDate">תאריך סיום</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate || formData.startDate}
            onChange={handleChange}
            
          />
        </div>
        <div className="form-group date-time-group">
          <label htmlFor="endTime">שעת סיום</label>
          <input
            type="time"
            id="endTime"
            name="endTime"
            value={formData.endTime || ''}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="location">מיקום</label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location || ''}
          onChange={handleChange}
          placeholder="מיקום האירוע (אופציונלי)"
        />
      </div>
    </div>
  );
}