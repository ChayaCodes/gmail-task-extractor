import { google } from "googleapis";

export class GoogleAuthService {
    private static apiKey: string = process.env.GOOGLE_CREDENTIALS_API_KEY || '';

    public static getApiKey(): string {
        if (!this.apiKey) {
            throw new Error('Google API key is not set. Please set the GOOGLE_CREDENTIALS_API_KEY environment variable.');
        }
        return this.apiKey;
    }


    public static getAuthToken(interactive = true): Promise<string> {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(
                { type: 'GET_GOOGLE_AUTH_TOKEN', interactive },
                (response) => {
                    if (chrome.runtime.lastError || !response?.success) {
                        reject(new Error(response?.error || chrome.runtime.lastError?.message));
                    } else {
                        resolve(response.token);
                    }
                }
            );
        });
    }

}
