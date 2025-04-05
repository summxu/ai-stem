/*
 * 数据库集合类型定义（基于 appwrite.json 配置）
 * 1. 所有接口继承自 Models.Document（隐含 $id 等元数据字段）
 * 2. 关系字段统一定义为 string[] 类型
 * 3. 枚举类型单独抽离为 type
 */

import {Models} from 'appwrite';

// --- 枚举类型 ---
export type GradeLevel =
    | "一年级"
    | "二年级"
    | "三年级"
    | "四年级"
    | "五年级"
    | "六年级";

export type SubjectType = "S" | "T" | "E" | "M";

// --- 集合接口 ---
export interface Group extends Models.Document {
    name: string; // 必填（size:24）
    school: string; // 必填（size:36）
    grade: GradeLevel;
    description?: string; // 可选（size:500）
    groupUser?: string[]; // 关系字段
}

export interface GroupUser extends Models.Document {
    group?: string[]; // 关联到 group 集合
    leaning?: string[]; // 关联到 leaning 集合
}

export interface Active extends Models.Document {
    name: string; // 必填（size:36）
    grade: GradeLevel;
    subject: SubjectType;
    description?: string; // 可选（size:500）
    course?: string[]; // 关系字段
}

export interface Course extends Models.Document {
    name: string; // 必填（size:36）
    description: string; // 必填（size:500）
    duration: string; // 必填（size:12）
    attachment: string; // URL 格式
    active?: string[]; // 关联到 active 集合
    step?: string[]; // 关联到 step 集合
}

export interface Chapter extends Models.Document {
    content: string; // 必填（最大长度99999）
    step?: string[]; // 关联到 step 集合
    leaning?: string[]; // 关联到 leaning 集合
}

export interface Step extends Models.Document {
    name: string; // 必填（size:12）
    description: string; // 必填（size:500）
    course?: string[]; // 关联到 course 集合
    code: string; // 必填（size:12）
    chapter?: string[]; // 关联到 chapter 集合
}

export interface Learning extends Models.Document {
    duration: number; // 必填整数
    completed?: boolean; // 默认false
    groupUser?: string[]; // 关联到 group_user
    chapter?: string[]; // 关联到 chapter
    testContent?: string[]; // 数组类型
    aiContent?: string[]; // 数组类型
}
