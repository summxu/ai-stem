export interface FunctionsReturn<T> {
    status: boolean;
    message: string;
    data: T;
}

export type Label = 'admin' | 'teachers' | 'students';

export type TeamRole = 'teacher' | 'student';