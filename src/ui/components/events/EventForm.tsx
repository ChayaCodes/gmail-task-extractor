import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { Event } from '/src/types/event.types';
import '/src/ui/styles/EventForm.css';

// פונקציה שממירה Date או מחרוזת ISO לפורמט שה-input דורש
function toInputDateTime(val?: string | Date | null) {
  if (!val) {
    return '';
  }
  const d = typeof val === 'string' ? new Date(val) : val;
  // מחזיר yyyy-MM-ddTHH:mm
  return d.toISOString().slice(0, 16);
}

export function EventForm({
  event,
  onEventChange
}: {
  event: Event;
  onEventChange: (updatedEvent: Event) => void;
}) {
  const [formData, setFormData] = useState<Event>({ ...event });

  useEffect(() => {
    setFormData({ ...event });
  }, [event]);

  // עדכון ערך רגיל
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    const updatedEvent = {
      ...formData,
      [name]: value
    };
    setFormData(updatedEvent);
    onEventChange(updatedEvent);
  };

  // עדכון ערך DateTime (שומר כ- Date)
  const handleDateTimeChange = (name: string, value: string) => {
    const updatedEvent = {
      ...formData,
      [name]: value ? new Date(value) : null
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
          value={formData.title || ''}
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
          <label htmlFor="startDateTime">תאריך ושעת התחלה</label>
          <input
            type="datetime-local"
            id="startDateTime"
            name="startDateTime"
            value={toInputDateTime(formData.startDateTime)}
            onChange={(e) => handleDateTimeChange('startDateTime', (e.target as HTMLInputElement).value)}
            required
          />
        </div>
        <div className="form-group date-time-group">
          <label htmlFor="endDateTime">תאריך ושעת סיום</label>
          <input
            type="datetime-local"
            id="endDateTime"
            name="endDateTime"
            value={toInputDateTime(formData.endDateTime)}
            onChange={(e) => handleDateTimeChange('endDateTime', (e.target as HTMLInputElement).value)}
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