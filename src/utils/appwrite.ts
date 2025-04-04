import {Client, Account} from 'appwrite';

export const client = new Client();

client
    .setEndpoint('http://localhost/v1')
    .setProject('67ee2731001981539fcb');

export const account = new Account(client);

export {ID} from 'appwrite';
