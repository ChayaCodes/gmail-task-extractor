import * as InboxSDK from '@inboxsdk/core';

console.log('Content script loaded');

function init() {
    console.log('InboxSDK initializing...');
    
    const appId = 'sdk_email-to-task_8bfd604b40'; 
    
    InboxSDK.load(2, appId).then((sdk) => {
        console.log('InboxSDK loaded successfully');
        
        sdk.Lists.registerThreadRowViewHandler((threadRowView) => {
            console.log('Thread row handler registered');
            
            threadRowView.on('selected', () => {
                console.log('Thread selected event fired');
                try {
                    const emailSubject = threadRowView.getSubject();
                    console.log('Email selected:', { subject: emailSubject });
                } catch (err) {
                    console.error('Error in thread selection handler:', err);
                }
            });
        });
        
        // רישום ל-message view handler לתפיסת פתיחת אימייל
        sdk.Conversations.registerMessageViewHandler((messageView) => {
            console.log('Message view handler registered');
            console.log('Message opened:', { subject: messageView.getBodyElement().innerText });
        });
        
    }).catch(err => {
        console.error('Failed to load InboxSDK:', err);
    });
}

// הפעל את הקוד
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing InboxSDK');
    init();
});

// גיבוי במקרה שהאירוע כבר עבר
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    console.log('Document already ready, initializing InboxSDK');
    setTimeout(init, 500);
}