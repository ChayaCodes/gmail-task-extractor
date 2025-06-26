import { h } from 'preact';
import { useState } from 'preact/hooks';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || '';
const SCOPES = process.env.GOOGLE_SCOPES || '';

export function SignInButton({ onSignIn }: any) {
    const [isLoading, setIsLoading] = useState(false);

    const handleSignInClick = () => {
        setIsLoading(true);

        const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=token&scope=${SCOPES}`;

        const authWindow = window.open(authUrl, '_blank', 'width=500,height=600');

        const checkWindow = setInterval(() => {
            if (authWindow?.closed) {
                clearInterval(checkWindow);
                setIsLoading(false);

                const token = localStorage.getItem('google_access_token');
                if (token && onSignIn) {
                    onSignIn(token);
                }
            }
        }, 500);
    };

    return (
        <div className="sign-in-container">
            <button
                onClick={handleSignInClick}
                disabled={isLoading}
                className={`sign-in-button ${isLoading ? 'loading' : ''}`}
            >
                {isLoading ? 'מתחבר...' : 'התחברות לגוגל'}
            </button>

            <p className="sign-in-hint">
                התחבר לחשבון Google כדי לסנכרן משימות ואירועים
            </p>
        </div>
    );
}