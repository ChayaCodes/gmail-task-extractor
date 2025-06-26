import { GroqService } from '../../../../src/services/ai/groq-service';
import { EmailDetails } from '../../../../src/types/email.types';
import axios from 'axios';
import { jest } from '@jest/globals';


// מוק עבור אקסיוס לבדיקות
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('GroqService', () => {
  let groqService: GroqService;
  
  // קלט לדוגמה
  const mockEmailDetails: EmailDetails = {
    senderName: 'John Doe',
    senderEmail: 'john@example.com',
    subject: 'Meeting Tomorrow',
    body: 'Let\'s meet tomorrow at 2:00 PM in the conference room.',
    dateTime: '2023-10-31T14:00:00Z'
  };

  // תשובה מדומה מה-API
  const mockApiResponse = {
    data: {
      choices: [
        {
          message: {
            content: JSON.stringify([
              {
                title: 'Meeting with John',
                description: 'Conference room meeting',
                startDate: '2023-11-01',
                startTime: '14:00',
                endDate: '2023-11-01',
                endTime: '15:00',
                location: 'Conference room'
              }
            ])
          }
        }
      ]
    }
  };

  beforeEach(() => {
    groqService = new GroqService();
    jest.clearAllMocks();
  });

  test('should extract events from email successfully', async () => {

    mockedAxios.post.mockResolvedValueOnce(mockApiResponse);

    const events = await groqService.getEventSuggestions(mockEmailDetails);

    expect(events).toHaveLength(1);
    expect(events[0].title).toBe('Meeting with John');
    expect(events[0].startDate).toBe('2023-11-01');
    expect(events[0].location).toBe('Conference room');

    expect(mockedAxios.post).toHaveBeenCalledTimes(1);
    expect(mockedAxios.post.mock.calls[0][0]).toBe('https://api.groq.com/openai/v1/chat/completions');
  });

  test('should handle empty response', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        choices: [{ message: { content: '[]' } }]
      }
    });

    const events = await groqService.getEventSuggestions(mockEmailDetails);
    expect(events).toHaveLength(0);
  });

  test('should handle API errors gracefully', async () => {
    // הגדרת שגיאה
    mockedAxios.post.mockRejectedValueOnce(new Error('API Error'));

    const events = await groqService.getEventSuggestions(mockEmailDetails);
    expect(events).toHaveLength(0);
  });
});