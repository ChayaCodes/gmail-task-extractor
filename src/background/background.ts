import * as InboxSDK from '@inboxsdk/core';
import { EmailParser } from '../services/email/email-parser';
import '@inboxsdk/core/background';


const emailProcessor = new EmailParser();

console.log('Background script initialized');

