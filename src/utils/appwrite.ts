import {Client, Account, Teams, Databases,} from 'appwrite';

export const client = new Client();

client
    .setEndpoint('http://localhost/v1')
    .setProject('67ee2731001981539fcb');

export const account = new Account(client);
export const teams = new Teams(client);
export const databases = new Databases(client);

export {ID} from 'appwrite';
