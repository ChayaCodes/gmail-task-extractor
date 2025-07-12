import { h, render, Fragment } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import './popup.css';

interface DatasetStats {
  totalEntries: number;
  approvedEntries: number;
  rejectedEntries: number;
  lastUpdated: string;
}

const PopupApp = () => {
  const [stats, setStats] = useState<DatasetStats>({
    totalEntries: 0,
    approvedEntries: 0,
    rejectedEntries: 0,
    lastUpdated: '-'
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const result = await chrome.storage.local.get(['gmail-event-extractor-dataset']);
      const data = result['gmail-event-extractor-dataset'];
      
      if (!data || !data.entries) {
        setStats({
          totalEntries: 0,
          approvedEntries: 0,
          rejectedEntries: 0,
          lastUpdated: 'אין נתונים'
        });
        return;
      }

      const entries = data.entries || [];
      const approved = entries.filter((e: any) => e.action === 'approved').length;
      const rejected = entries.filter((e: any) => e.action === 'rejected').length;
      const lastUpdated = entries.length > 0 
        ? new Date(entries[entries.length - 1].timestamp).toLocaleDateString('he-IL')
        : '-';

      setStats({
        totalEntries: entries.length,
        approvedEntries: approved,
        rejectedEntries: rejected,
        lastUpdated
      });
    } catch (error) {
      console.error('Error loading stats:', error);
      showMessage('שגיאה בטעינת הנתונים', 'error');
    } finally {
      setLoading(false);
    }
  };

  const exportDataset = () => {
    try {
      chrome.storage.local.get(['gmail-event-extractor-dataset'], (result) => {
        const data = result['gmail-event-extractor-dataset'];
        
        if (!data || !data.entries) {
          showMessage('אין נתונים לייצוא', 'error');
          return;
        }

        const exportData = {
          metadata: {
            exportDate: new Date().toISOString(),
            totalEntries: data.entries?.length || 0,
            exportedBy: 'Gmail Event Extractor v1.0'
          },
          entries: data.entries || []
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
          type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `gmail-events-dataset-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);

        showMessage('הקובץ הורד בהצלחה!', 'success');
      });
    } catch (error) {
      console.error('Export error:', error);
      showMessage('שגיאה בייצוא הקובץ', 'error');
    }
  };

  const copyToClipboard = async () => {
    try {
      const result = await chrome.storage.local.get(['gmail-event-extractor-dataset']);
      const data = result['gmail-event-extractor-dataset'];
      
      if (!data || !data.entries) {
        showMessage('אין נתונים להעתקה', 'error');
        return;
      }

      const exportData = {
        metadata: {
          exportDate: new Date().toISOString(),
          totalEntries: data.entries?.length || 0
        },
        entries: data.entries || []
      };

      await navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
      showMessage('הועתק ללוח בהצלחה!', 'success');
    } catch (error) {
      console.error('Copy error:', error);
      showMessage('שגיאה בהעתקה ללוח', 'error');
    }
  };

  const clearDataset = () => {
    if (confirm('האם אתה בטוח שברצונך למחוק את כל הנתונים?\nפעולה זו אינה ניתנת לביטול.')) {
      chrome.storage.local.remove(['gmail-event-extractor-dataset'], () => {
        loadStats();
        showMessage('הנתונים נמחקו בהצלחה', 'success');
      });
    }
  };

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  if (loading) {
    return h('div', { className: 'container' },
      h('div', { className: 'loading' }, 'טוען נתונים...')
    );
  }

  return h('div', { className: 'container' },
    h('h1', null, 'Gmail Event Extractor'),
    h('p', null, 'התוסף פועל ברקע ומזהה אירועים באימיילים שלך.'),
    
    // Message notification
    message && h('div', { 
      className: `message ${message.type}` 
    }, message.text),
    
    // Stats section
    h('div', { className: 'stats' },
      h('h3', null, 'סטטיסטיקות Dataset:'),
      h('div', { className: 'stat-item' },
        h('span', null, 'סך הכל רשומות:'),
        h('span', { className: 'stat-value' }, stats.totalEntries)
      ),
      h('div', { className: 'stat-item' },
        h('span', null, 'אירועים שאושרו:'),
        h('span', { className: 'stat-value success' }, stats.approvedEntries)
      ),
      h('div', { className: 'stat-item' },
        h('span', null, 'אירועים שנדחו:'),
        h('span', { className: 'stat-value rejected' }, stats.rejectedEntries)
      ),
      h('div', { className: 'stat-item' },
        h('span', null, 'עדכון אחרון:'),
        h('span', { className: 'stat-value' }, stats.lastUpdated)
      )
    ),
    
    // Action buttons
    h('div', { className: 'actions' },
      h('button', { onClick: exportDataset, className: 'btn-primary' },
        h('span', { className: 'icon' }, '📁'),
        'הורדת Dataset'
      ),
      h('button', { onClick: copyToClipboard, className: 'btn-primary' },
        h('span', { className: 'icon' }, '📋'),
        'העתקה ללוח'
      ),
      h('button', { onClick: clearDataset, className: 'btn-danger' },
        h('span', { className: 'icon' }, '🗑️'),
        'מחיקת Dataset'
      )
    )
  );
};

// Initialize Preact app
const container = document.getElementById('root');
if (container) {
  render(h(PopupApp, {}), container);
}

export default PopupApp;
