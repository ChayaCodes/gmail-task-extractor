import { h } from 'preact';

interface EventNavigationProps {
    currentIndex: number;
    total: number;
    onPrev: () => void;
    onNext: () => void;
}

export function EventNavigation({ currentIndex, total, onPrev, onNext }: EventNavigationProps) {
    return (
        <div className="event-navigation">
            <span>אירוע {currentIndex + 1} מתוך {total}</span>
            <div className="navigation-buttons">
                <button className="nav-button" onClick={onPrev} disabled={currentIndex === 0}>הקודם</button>
                <button className="nav-button" onClick={onNext} disabled={currentIndex === total - 1}>הבא</button>
            </div>
        </div>
    );
}