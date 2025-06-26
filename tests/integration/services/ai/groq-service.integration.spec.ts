import { GroqService } from '../../../../src/services/ai/groq-service';
import { EmailDetails } from '../../../../src/types/email.types';
import * as dotenv from 'dotenv';

dotenv.config();

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const hasApiKey = !!process.env.GROQ_API_KEY;
const testSuite = hasApiKey ? describe : describe.skip;

testSuite('GroqService Integration Tests', () => {

    jest.setTimeout(45000);
  
  let groqService: GroqService;
  
  beforeEach(async () => {
    console.log('Waiting between API calls to avoid rate limiting...');
    await delay(2000);
    groqService = new GroqService();
  });
  
  test('should extract meeting event from clear email', async () => {
    console.log('Running meeting extraction test...');
    
    const emailDetails: EmailDetails = {
      senderName: 'Business Contact',
      senderEmail: 'contact@example.com',
      subject: 'Meeting Next Wednesday',
      body: `Hi there,

Let's schedule a meeting for next Wednesday, June 30, 2023, at 2:00 PM.
We will discuss the quarterly report in the main conference room.

Best regards,
Business Contact`,
      dateTime: '2023-06-25T10:30:00Z'
    };
    
    const events = await groqService.getEventSuggestions(emailDetails);
    console.log('Events extracted:', events);
    
    expect(events.length).toBeGreaterThan(0);
    
    const meetingEvent = events[0];
    expect(meetingEvent.title).toContain('Meeting');
    expect(meetingEvent.startDate).toBe('2023-06-30');
    expect(meetingEvent.startTime).toBe('14:00');
    expect(meetingEvent.location).toContain('conference room');
  });
  
  
  test('should handle email with no events', async () => {
    console.log('Running no-events email test...');
    
    const emailDetails: EmailDetails = {
      senderName: 'Newsletter',
      senderEmail: 'news@example.com',
      subject: 'Weekly Company Newsletter',
      body: `Check out what happened this week:
- New product launch was successful
- HR published revised holiday schedule
- Cafeteria menu updated

Have a great weekend!`,
      dateTime: '2023-06-23T16:00:00Z'
    };
    
    const events = await groqService.getEventSuggestions(emailDetails);
    expect(events).toHaveLength(0);
  });
});