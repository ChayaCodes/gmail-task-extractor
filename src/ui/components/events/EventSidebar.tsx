import { h } from 'preact';
import { useState } from 'preact/hooks';
import { Event } from '/src/types/event.types';
import { EventForm } from './EventForm';
import { EventActions } from './EventActions';
import '/src/ui/styles/EventSidebar.css';

// אין צורך בinterfaces חדשים - נשתמש רק בprops
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
  const activeEvent = events[activeEventIndex];
  const [editedEvent, setEditedEvent] = useState<Event>({...activeEvent});
  
  const handleEventChange = (updatedEvent: Event) => {

        onEventUpdate(updatedEvent);
  };
  
  const handleNextEvent = () => {
    if (activeEventIndex < events.length - 1) {
      setActiveEventIndex(activeEventIndex + 1);
      setEditedEvent({...events[activeEventIndex + 1]});
    }
  };

  const handlePrevEvent = () => {
    if (activeEventIndex > 0) {
      setActiveEventIndex(activeEventIndex - 1);
      setEditedEvent({...events[activeEventIndex - 1]});
    }
  };

  return (
    <div className="event-sidebar">
      <div className="event-sidebar-header">
        <h2>משימות מזוהות ({events.length})</h2>
        <button onClick={onClose} className="close-button">×</button>
      </div>

      {events.length > 1 && (
        <div className="event-navigation">
          <span>אירוע {activeEventIndex + 1} מתוך {events.length}</span>
          <div className="navigation-buttons">
            <button 
              onClick={handlePrevEvent} 
              disabled={activeEventIndex === 0}
              className="nav-button"
            >
              הקודם
            </button>
            <button 
              onClick={handleNextEvent} 
              disabled={activeEventIndex === events.length - 1}
              className="nav-button"
            >
              הבא
            </button>
          </div>
        </div>
      )}

      <EventForm 
        event={activeEvent} 
        onEventChange={handleEventChange} 
      />

      <EventActions 
        onApprove={() => onEventApprove({
          ...editedEvent,
          status: 'confirmed'
        })} 
        onReject={() => onEventReject({
          ...editedEvent,
          status: 'rejected'
        })} 
      />
    </div>
  );
}