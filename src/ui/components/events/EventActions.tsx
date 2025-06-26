import { h } from 'preact';
import '/src/ui/styles/EventActions.css';

export function EventActions({ 
  onApprove, 
  onReject 
}: {
  onApprove: () => void;
  onReject: () => void;
}) {
  return (
    <div className="event-actions">
      <button 
        onClick={onReject} 
        className="reject-button"
        title="דחה את האירוע"
      >
        דחה
      </button>
      <button 
        onClick={onApprove} 
        className="approve-button"
        title="הוסף את האירוע ליומן"
      >
        אשר והוסף ליומן
      </button>
    </div>
  );
}