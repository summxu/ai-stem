/*
 * 根据 appwrite.json collections 块生成接口
 * 1. 所有接口继承自 Models.Models.Document（隐含 $id 等元数据字段）
 * 2. 关系字段统一定义为 string[] 类型
 * 3. 枚举类型单独抽离为 type
 */

// 枚举类型定义
export type Grade = '一年级' | '二年级' | '三年级' | '四年级' | '五年级' | '六年级';
export type Subject = 'S' | 'T' | 'E' | 'M';
export type InteractionType = 'choice' | 'gap' | 'file' | 'flow';

// 接口定义
import { Models } from 'appwrite';

// Group 集合
export interface Group extends Models.Document {
    name: string;
    description?: string;
    school: string;
    grade: Grade;
    groupUser?: string[]; // 关系字段
}

// GroupUser 集合
export interface GroupUser extends Models.Document {
    group?: string[]; // 关系字段
    learning?: string[]; // 关系字段
}

// Active 集合
export interface Active extends Models.Document {
    name: string;
    description?: string;
    grade: Grade;
    subject: Subject;
    course?: string[]; // 关系字段
}

// Course 集合
export interface Course extends Models.Document {
    name: string;
    description: string;
    duration: string;
    attachment: string; // URL格式
    active?: string[]; // 关系字段
    step?: string[]; // 关系字段
}

// Chapter 集合
export interface Chapter extends Models.Document {
    content: string;
    step?: string[]; // 关系字段
    name: string;
    interaction?: string[]; // 关系字段
    learning?: string[]; // 关系字段
}

// Step 集合
export interface Step extends Models.Document {
    name: string;
    description: string;
    course?: string[]; // 关系字段
    code: string;
    chapter?: string[]; // 关系字段
}

// Learning 集合
export interface Learning extends Models.Document {
    completed?: boolean;
    answer?: string[]; // 数组类型
    chapter?: string[]; // 关系字段
    interaction?: string[]; // 关系字段
}

// Interaction 集合
export interface Interaction extends Models.Document {
    title: string;
    options?: string[]; // 数组类型
    answer?: number;
    content?: string;
    attachment?: string; // URL格式
    type: InteractionType;
    chapter?: string[]; // 关系字段
    explain?: string;
    learning?: string[]; // 关系字段
}
