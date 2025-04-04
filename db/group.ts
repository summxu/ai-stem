import {Models} from 'appwrite'
import {Grade} from "./common";

export interface Group extends Models.Document {
    name: string
    description?: string
    school: string;
    grade: Grade;
    userIDs: string[];
}