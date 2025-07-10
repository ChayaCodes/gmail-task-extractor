import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { Event } from '/src/types/event.types';
import { EventForm } from './EventForm';
import { EventActions } from './EventActions';
import { EventNavigation } from './EventNavigation';
import '/src/ui/styles/EventSidebar.css';

const emptyEvent: Event = {
  title: '',
  description: '',
  startDateTime: new Date(),
  endDateTime: new Date(new Date().getTime() + 60 * 60 * 1000),
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
  const isAddMode = events.length === 0;
  const [editedEvent, setEditedEvent] = useState<Event>(isAddMode ? { ...emptyEvent } : { ...events[0] });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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

  function goToNextOrClose() {
    if (activeEventIndex < events.length - 1) {
      setActiveEventIndex(activeEventIndex + 1);
      setEditedEvent({ ...events[activeEventIndex + 1] });
    } else {
      onClose();
    }
  }

  // אישור משימה
  const handleApprove = async () => {
    setErrorMsg('');
    if (!editedEvent.title) {
      setErrorMsg('יש להזין כותרת לאירוע');
      return;
    }

    setLoading(true);
    try {
      await onEventApprove({ ...editedEvent, status: 'confirmed' });
      goToNextOrClose();
    } catch (err) {
      setErrorMsg('אירעה שגיאה בעת ההוספה ליומן. נסה שוב.');
    }
    setLoading(false);
  };

  // דחיית משימה
  const handleReject = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      await onEventReject({ ...editedEvent, status: 'rejected' });
      goToNextOrClose();
    } catch (err) {
      setErrorMsg('אירעה שגיאה בעת הדחייה. נסה שוב.');
    }
    setLoading(false);
  };

  // סגירה
  const handleClose = () => {
    setEditedEvent({ ...emptyEvent });
    onClose();
  };

  // עדכון אירוע ערוך כאשר האירועים משתנים
  useEffect(() => {
    console.log("EventSidebar useEffect triggered. events.length:", events.length, "activeEventIndex:", activeEventIndex);
    if (events.length > 0) {
      // ודא שה-index לא מחוץ לטווח
      const validIndex = Math.min(activeEventIndex, events.length - 1);
      if (validIndex !== activeEventIndex) {
        setActiveEventIndex(validIndex);
      }
      const newEvent = { ...events[validIndex] };
      console.log("Setting editedEvent to:", newEvent.title);
      setEditedEvent(newEvent);
    } else {
      console.log("No events - setting empty event");
      setEditedEvent({ ...emptyEvent });
      setActiveEventIndex(0);
    }
  }, [events.length, events, activeEventIndex]); // הוספת events.length כדי לכפות עדכון

  return (
    <div className="event-sidebar">
      <div className="event-sidebar-header">
        <h2>
          {events.length > 0
            ? `אירועים שזוהו (${events.length})`
            : 'הוסף אירוע חדש'}
        </h2>
        <button onClick={handleClose} className="close-button">
          ×
        </button>
      </div>

      <div className="event-sidebar-content">

        {events.length > 1 && (
          <EventNavigation
            currentIndex={activeEventIndex}
            total={events.length}
            onPrev={handlePrevEvent}
            onNext={handleNextEvent}
          />
        )}
        <EventForm event={editedEvent} onEventChange={setEditedEvent} />
        <EventActions
          onApprove={handleApprove}
          onReject={handleReject}
        />
        <div className="event-sidebar-messages">
          {errorMsg && (
            <div className="event-error-msg">{errorMsg}</div>
          )}
          {loading && (
            <div className="loading-msg">מוסיף ליומן...</div>
          )}
        </div>
      </div>
    </div>
  );
}