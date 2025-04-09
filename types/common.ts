export interface FunctionsReturn<T> {
    status: boolean;
    message: string;
    data: T;
}

export type Label = 'admin' | 'teachers' | 'students';

export type TeamRole = 'teacher' | 'student';

export type InteractionType = 'choice' | 'gap' | 'file' | 'flow'