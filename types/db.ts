/*
 * 根据 appwrite.json collections 块生成接口
 * 1. 所有接口继承自 Models.Models.Document（隐含 $id 等元数据字段）
 * 2. 关系字段统一定义为 string[] 类型
 * 3. 枚举类型单独抽离为 type
 */

// 枚举类型定义
export type Grade = '一年级' | '二年级' | '三年级' | '四年级' | '五年级' | '六年级';
export type Subject = 'S' | 'T' | 'E' | 'M';
export type Step = 'empathize' | 'define' | 'ideate' | 'prototype' | 'test';
export type InteractionType = 'choice' | 'gap' | 'file' | 'flow';

// 接口定义
import { Models } from 'appwrite';

// Active 集合
export interface Active extends Models.Document {
    name: string;
    description?: string;
    subject: Subject;
    course: Course[]; // 关系字段
}

// Course 集合
export interface Course extends Models.Document {
    name: string;
    description: string;
    duration: string;
    attachment: string; // URL格式
    active?: string; // 关系字段
    // chapter: Chapter[]; // 关系字段
}

// Chapter 集合
export interface Chapter extends Models.Document {
    content: string;
    step: Step;
    sort: number;
    course?: Course; // 关系字段
}

// Learning 集合
export interface Learning extends Models.Document {
    answer: string[]; // 数组类型
    chapter?: Chapter; // 关系字段
    interaction?: Interaction; // 关系字段
    complete: boolean;
}

// Interaction 集合
export interface Interaction extends Models.Document {
    title: string;
    options: string[]; // 数组类型
    answer: number[];
    content?: string;
    attachment?: string; // URL格式
    type: InteractionType;
    explain?: string;
    prompt: string[];
}
