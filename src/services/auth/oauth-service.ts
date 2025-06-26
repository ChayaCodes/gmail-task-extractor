import { google } from "googleapis";

export class GoogleAuthService {
    private apiKey: string;

    constructor() {
        const apiKey = process.env.GOOGLE_CREDENTIALS_API_KEY;
        if (!apiKey) {
            throw new Error("Google API key is not set in environment variables");
        }
        this.apiKey = apiKey;
    }

    public getAuthToken(interactive = true): Promise<string> {
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
