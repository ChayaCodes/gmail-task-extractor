import * as InboxSDK from '@inboxsdk/core';

function init() {
    InboxSDK.load(2, 'YOUR_APP_ID_HERE').then(function(sdk) {
        console.log('InboxSDK has loaded successfully');
        

        sdk.Lists.registerThreadRowViewHandler(threadRowView => {
            threadRowView.on('selected', () => {
                const emailData = {
                    subject: threadRowView.getSubject(),
                };
                
            });
        });
    }).catch(err => {
        console.error('Failed to load InboxSDK:', err);
    });
}



init();