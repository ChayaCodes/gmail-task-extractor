import { GoogleCalendar } from '../../../../src/services/calendar/google-calendar';
import {Event} from  '../../../../src/types/event.types';


// Mock GoogleAuthService
jest.mock('/src/services/auth/oauth-service', () => ({
  GoogleAuthService: jest.fn().mockImplementation(() => ({
    getAuthToken: jest.fn().mockResolvedValue('mock-token'),
  })),
}));

describe('GoogleCalendar', () => {
  let calendar: GoogleCalendar;
  const event: Event = {
    title: 'Test Event',
    description: 'Test Description',
    startDateTime: new Date('2023-10-01T10:00:00Z'),
    endDateTime: new Date('2023-10-01T11:00:00Z'),
    location: 'Test Location',
  };

  beforeEach(() => {
    jest.spyOn(require('/src/services/auth/oauth-service'), 'GoogleAuthService')
      .mockImplementation(() => ({
        getAuthToken: jest.fn().mockResolvedValue('mock-token'),
      }));
    calendar = new GoogleCalendar();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should send a POST request to Google Calendar API and return event id', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: '12345' }),
    });

    const id = await calendar.addEvent(event);

    expect(global.fetch).toHaveBeenCalledWith(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer mock-token',
          'Content-Type': 'application/json',
        }),
        body: expect.any(String),
      })
    );
    expect(id).toBe('12345');
  });

  it('should throw an error if response is not ok', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: { message: 'API error' } }),
      statusText: 'Bad Request',
    });

    await expect(calendar.addEvent(event)).rejects.toThrow('Failed to add event: API error');
  });
});