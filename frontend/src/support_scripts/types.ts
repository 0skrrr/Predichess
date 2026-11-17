
// Potřebné typy na práci s lekcemi

export type StepType = "board" | "question" | "text" | "animation" | "multiboard";
export interface Step {
    id: string;
    title:string;
    type: StepType;
    taskId: string;
    content: Record<string, any>;
    order: number;
}
export interface Task {
    id: string;
    title:string;
    description?: string;
    stepIds: string[];
}
export interface Lesson {
    id: string;
    title: string;
    description?: string;
    stepIds: string[];
}
export interface LessonState {
    lessons: Lesson[];
    currentLessonId: string | null;
    selectedStepId: string | null;
    selectedTaskId: string;
    steps: Step[];
    tasks: Task[];
}

// Typ určující každou možnou akci s lekcí

export type LessonAction =
    | {
    type: "UPDATE_STEP";
    stepId: string;
    updates: Partial<Step>;
}
    | {
    type: "DELETE_STEP";
    stepId: string;
}
    | {
    type: "ADD_STEP";
    taskId: string;
    stepType: StepType;
}
    | {
    type: "DUPLICATE_STEP";
    stepId: string;
}
    | {
    type: "REORDER_STEPS";
    newOrder: Step[];
}


    | {
    type: "SELECT_STEP";
    stepId: string;
}
    | {
    type: "SET_ALL_LESSONS";
    lessons: Lesson[];
}

    | {
    type: "UPDATE_LESSON";
    lessonId: string;
    updates: Partial<Lesson>;
}
    | {
    type: "ADD_LESSON";
}
    | {
    type: "LOAD_LESSON";
    lessonId: string;
}
    | {
    type: "DELETE_LESSON";
    lessonId: string;
}


    | {
    type: "UPDATE_TASK";
    taskId: string;
    updates: Partial<Task>;
}
    | {
    type: "ADD_TASK";
}
    | {
    type: "DELETE_TASK";
    taskId: string;
}
    | {
    type: "LOAD_LESSON_WITH_DATA";
    lessonId: string;
    steps: Step[];
    tasks: Task[];
}
    | {
    type: "SELECT_TASK";
    taskId: string;
}



export type ChessPiece =
    | "P" | "N" | "B" | "R" | "Q" | "K"
    | "p" | "n" | "b" | "r" | "q" | "k"
    | null;


export interface EditorProps {
    content: Record<string, any>;
    onUpdate: (updates: Record<string, any>) => void;
}