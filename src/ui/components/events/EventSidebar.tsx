import { h, Fragment } from 'preact';
import { useState } from 'preact/hooks';
import { Event } from '/src/types/event.types';
import { EventForm } from './EventForm';
import { EventActions } from './EventActions';
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
  const [isAddMode, setIsAddMode] = useState(events.length === 0);
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
    if (events.length > 1 && activeEventIndex < events.length - 1) {
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

  return (
    <div className="event-sidebar">
      <div className="event-sidebar-header">
        <h2>{`אירועים שזוהו (${events.length})`}</h2>
        <button onClick={handleClose} className="close-button">×</button>
      </div>

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

          {/* הודעות שגיאה וטעינה בתחתית */}
          <div style={{ minHeight: 32, marginTop: 8 }}>
            {errorMsg && (
              <div className="event-error-msg">{errorMsg}</div>
            )}
            {loading && <div className="loading-msg">מוסיף ליומן...</div>}
          </div>
        </>
      )}
    </div>
  );
}