import axios from "axios";
import { EventExtractor } from "../../interfaces/event-extractor.interface";
import { EmailDetails } from "../../types/email.types";
import { Event } from "../../types/event.types";

export class GroqService implements EventExtractor {
  private apiUrl = "https://api.groq.com/openai/v1/chat/completions";
  private apiKey = process.env.GROQ_API_KEY;
  private model = "llama3-8b-8192";

  async getEventSuggestions(emailDetails: EmailDetails): Promise<Event[]> {
    try {
      const MAX_BODY_LENGTH = 4000;
      let { body } = emailDetails;
      if (body.length > MAX_BODY_LENGTH) {
        body = body.slice(0, MAX_BODY_LENGTH) + "\n[...truncated]";
      }

      const messages = [
        {
          role: "system",
          content:
            "You are an AI assistant that extracts events from email content.",
        },
        {
          role: "user",
          content: `Extract events from the following email:
        
From: ${emailDetails.senderName} (${emailDetails.senderEmail})
Date: ${emailDetails.dateTime}
Subject: ${emailDetails.subject}
Body: ${body}

Return a JSON array of events with this exact structure:
[
  {
    "title": "Event title" use infurmative and descriptive short title.
    "description": "Detailed description, all relevant information from the email, return multi-line description. Use \\n to indicate a new line.",
    "startDate": "yyyy-MM-dd" (required),
    "startTime": "HH:mm" (required),
    "endDate": "yyyy-MM-dd" (required),
    "endTime": "HH:mm" (required),
    "location": "Optional location, if online, specify 'Online' and link if available. Don't include additional details.",
  }, 
  ...
]
  
Return only events array in JSON format, do not include any additional text or explanations. If you cannot find any events, return an empty array: [].`,
        },
      ];

      console.log("Sending request to Groq API for event extraction...", messages);
      const response = await this.sendChatRequest(messages);

      return this.parseResponse(response);
    } catch (error) {
      console.error("Error extracting events:", error);
      return [];
    }
  }

  private async sendChatRequest(messages: any[]): Promise<string> {
    try {
      const headers = {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      };

      const data = {
        model: this.model,
        messages: messages,
        response_format: { type: "json_object" },
      };

      const response = await axios.post(this.apiUrl, data, { headers });

      console.log("Groq API response received");
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error("Error communicating with Groq API:", error);
      throw new Error("Failed to communicate with AI model");
    }
  }

  private parseResponse(responseContent: string): Event[] {
    try {
      let events: any[];

      if (typeof responseContent === "string") {
        const parsedResponse = JSON.parse(responseContent);

        events = Array.isArray(parsedResponse)
          ? parsedResponse
          : parsedResponse.events || [];
      } else {
        events = responseContent;
      }

      // Helper to validate time in HH:mm format
      function isValidTime(time?: string) {
        return typeof time === "string" && /^\d{2}:\d{2}$/.test(time);
      }

      // Helper to validate date in yyyy-MM-dd format
      function isValidDate(date?: string) {
        return typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date);
      }

      return events.map((event) => {
        const startDate = isValidDate(event.startDate) ? event.startDate : new Date().toISOString().split("T")[0];
        const endDate = isValidDate(event.endDate) ? event.endDate : startDate;
        const startTime = isValidTime(event.startTime) ? event.startTime : "09:00";
        const endTime = isValidTime(event.endTime) ? event.endTime : "10:00";
        return {
          title: event.title || "Untitled Event",
          description: event.description || "",
          startDateTime: new Date(`${startDate}T${startTime}:00`),
          endDateTime: new Date(`${endDate}T${endTime}:00`),
          location: event.location || "",
          status: "suggested",
        };
      });
    } catch (error) {
      console.error("Error parsing AI response:", error);
      return [];
    }
  }
}
