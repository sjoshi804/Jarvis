// src/services/googleCalendarService.ts
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI!;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN!;

// Initialize OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// Set credentials with refresh token
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// Initialize Google Calendar API
const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

interface GoogleCalendarEvent {
  summary: string;
  description: string;
  start: { dateTime: string };
  end: { dateTime: string };
}

export const addEventsToCalendar = async (events: GoogleCalendarEvent[]) => {
  try {
    for (const event of events) {
      await calendar.events.insert({
        calendarId: 'primary',
        requestBody: event,
      });
    }
    console.log('All events added to Google Calendar successfully');
  } catch (error: any) {
    console.error('Error adding events to Google Calendar:', error.message);
    throw new Error('Failed to add events to Google Calendar');
  }
};
