# 📊 איך להוציא Dataset מהתוסף

## 3 דרכים לקבל את הנתונים:

### 🎯 דרך 1: באמצעות ה-Popup (הכי קל!)

1. לחץ על אייקון התוסף ב-Chrome 
2. תראה את הסטטיסטיקות של הדאטא שלך
3. לחץ על "📁 הורדת Dataset" - הקובץ יתורד מיד!

### 💻 דרך 2: קונסול הדפדפן

```javascript
// פתח F12 → Console ובצע:
const data = localStorage.getItem('gmail-event-extractor-dataset');
console.log(JSON.parse(data));

// או להוריד כקובץ:
const dataset = JSON.parse(localStorage.getItem('gmail-event-extractor-dataset'));
const blob = new Blob([JSON.stringify(dataset, null, 2)], {type: 'application/json'});
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'my-dataset.json';
a.click();
```

### 🐍 דרך 3: עיבוד עם Python

אחרי שהורדת את הקובץ:

```bash
# התקן dependencies
pip install -r scripts/requirements.txt

# רוץ את המעבד
python scripts/process_dataset.py dataset.json --export --sample 5
```

## 📁 מבנה הקובץ שתקבל:

```json
{
  "metadata": {
    "exportDate": "2025-07-11T...",
    "totalEntries": 42,
    "exportedBy": "Gmail Event Extractor v1.0"
  },
  "entries": [
    {
      "emailSubject": "פגישה מחר",
      "emailBody": "היי, בואו ניפגש מחר בשעה 15:00...",
      "emailSender": "John Doe <john@example.com>",
      "emailDate": "2025-07-11T09:30:00Z",
      "events": [
        {
          "title": "פגישה עם John",
          "startDate": "2025-07-12",
          "startTime": "15:00",
          "description": "...",
          "location": "..."
        }
      ],
      "action": "approved",
      "timestamp": "2025-07-11T09:35:00Z"
    }
  ]
}
```

## 🤖 שימוש ב-Machine Learning:

הסקריפט Python יפיק לך קובץ CSV מוכן לאימון:

| email_subject_length | has_time_keywords | has_date_pattern | label |
|---------------------|-------------------|------------------|-------|
| 25                  | True              | True             | 1     |
| 45                  | False             | False            | 0     |

- `label = 1` = אושר (approved)
- `label = 0` = נדחה (rejected)

## 🎯 עצות לאיסוף נתונים טובים:

1. **השתמש בתוסף באופן רגיל** - אשר או דחה אירועים לפי הצורך האמיתי שלך
2. **גוון במקורות** - השתמש עם אימיילים מסוגים שונים
3. **היה עקבי** - תנהגותך צריכה להיות עקבית (לא לאשר היום ולדחות מחר אותו דבר)
4. **צבור מספיק דוגמאות** - לפחות 50-100 דוגמאות לכל קטגוריה

## 🔒 פרטיות:

✅ כל הנתונים נשמרים רק במחשב שלך  
✅ שום דבר לא נשלח לשרתים חיצוניים  
✅ אתה שולט לחלוטין על המידע  
✅ ניתן למחוק הכל בכל רגע
