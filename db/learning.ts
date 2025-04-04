import {Models} from 'appwrite'

export interface Learning extends Models.Document {
    courseID: string;
    duration: number;
    stepGongqing: string;
    stepDingyi: string;
    stepChuangyi: string;
    stepYuanxing: string;
    stepCeshi: string;
    answerResult: string;
}