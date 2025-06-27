import { h, Fragment } from 'preact';
import { useState } from 'preact/hooks';
import { Event } from '/src/types/event.types';
import { EventForm } from './EventForm';
import { EventActions } from './EventActions';
import '/src/ui/styles/EventSidebar.css';

const emptyEvent: Event = {
  title: '',
  description: '',
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
  location: '',
  status: 'suggested'
};

export function EventSidebar({
  events,
  onEventUpdate,
  onEventApprove,
  onEventReject,
  onClose
}: {
  events: Event[];
  onEventUpdate: (updatedEvent: Event) => void;
  onEventApprove: (event: Event) => void;
  onEventReject: (event: Event) => void;
  onClose: () => void;
}) {
  const [activeEventIndex, setActiveEventIndex] = useState(0);
  const [isAddMode, setIsAddMode] = useState(events.length === 0);
  const [editedEvent, setEditedEvent] = useState<Event>(isAddMode ? { ...emptyEvent } : { ...events[0] });
  const [loading, setLoading] = useState(false);

  // ניווט בין אירועים
  const handleNextEvent = () => {
    setActiveEventIndex(i => {
      setEditedEvent({ ...events[i + 1] });
      return i + 1;
    });
  };
  const handlePrevEvent = () => {
    setActiveEventIndex(i => {
      setEditedEvent({ ...events[i - 1] });
      return i - 1;
    });
  };

  // מעבר למצב הוספה ידנית
  const handleAddNew = () => {
    setEditedEvent({ ...emptyEvent });
  };

  // אישור משימה
  const handleApprove = async () => {
    setLoading(true);
    try {
      await onEventApprove({ ...editedEvent, status: 'confirmed' });
      setEditedEvent({ ...emptyEvent });
    } catch {
      setEditedEvent({ ...emptyEvent });
    }
    setLoading(false);
  };

  // דחיית משימה
  const handleReject = async () => {
    setLoading(true);
    try {
      await onEventReject({ ...editedEvent, status: 'rejected' });
      setEditedEvent({ ...emptyEvent });
      setIsAddMode(true);
    } catch {
    }
    setLoading(false);
  };

  // סגירה
  const handleClose = () => {
    setEditedEvent({ ...emptyEvent });
    onClose();
  };

  return (
    <div className="event-sidebar">
      <div className="event-sidebar-header">
        <h2>{`משימות מזוהות (${events.length})`}</h2>
        <button onClick={handleClose} className="close-button">×</button>
      </div>

      {loading && <div className="loading-msg">מוסיף ליומן...</div>}

      {events.length > 0 && (
        <>
          {events.length > 1 && (
            <div className="event-navigation">
              <span>אירוע {activeEventIndex + 1} מתוך {events.length}</span>
              <div className="navigation-buttons">
                <button className="nav-button" onClick={handlePrevEvent} disabled={activeEventIndex === 0}>הקודם</button>
                <button className="nav-button" onClick={handleNextEvent} disabled={activeEventIndex === events.length - 1}>הבא</button>
              </div>
            </div>
          )}
          <EventForm event={editedEvent} onEventChange={setEditedEvent} />
          <EventActions onApprove={handleApprove} onReject={handleReject} />
        </>
      )}
    </div>
  );
}