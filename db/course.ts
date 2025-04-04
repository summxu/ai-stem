import {Models} from "appwrite";
import {Grade, Step, Subject} from "./common";

export interface Active extends Models.Document {
    name: string;
    description?: string;
    grade: Grade;
    subject: Subject;
    courseIDs: string[];
}

export interface Course extends Models.Document {
    name: string;
    description: string;
    duration: string;
    attachment: Models.File;
    step: {
        stepName: Step;
        stepDescription: string;
    }[];
    activeID: string;
    leaningIDs: string[]
}

export interface Chapter extends Models.Document {
    content: string;
    courseID: string;
    step: Step;
}