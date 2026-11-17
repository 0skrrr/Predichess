import type {LessonState, LessonAction, Step, Lesson, Task} from "./types";
import {getTranslations} from "./languages";

// Defaultní hodnota po otevření editoru
export const intialState: LessonState = {
    lessons: [
        {
            id: "",
            title:"",
            description:"",
            stepIds:[]
        },
    ],
    currentLessonId: null,
    selectedStepId: null,
    selectedTaskId: "",
    steps: [],
    tasks: []
}

// Každá možná operace lekce
// Self explanatory, dělá to to co má v názvu
export function lessonOperations(state: LessonState, action: LessonAction) : LessonState {
    switch (action.type) {


        case "UPDATE_STEP": {
            const updatedSteps = state.steps.map(s => {
                if (s.id === action.stepId) {
                    return {...s, ...action.updates};
                }
                else
                {
                    return s;
                }
            });
            return {
                ...state,
                steps: updatedSteps,
            }
        }


        case "DELETE_STEP": {
            const filteredSteps = state.steps.filter(s => s.id !== action.stepId)
            let newSelectedStepId: string | null = state.selectedStepId;
            if (state.selectedStepId === action.stepId) {
                const currentTaskSteps = filteredSteps.filter(s => s.taskId === state.selectedTaskId);
                newSelectedStepId = currentTaskSteps[0]?.id || filteredSteps[0]?.id || null;
            }
            return {
                ...state,
                steps:filteredSteps,
                selectedStepId: newSelectedStepId,
            }
        }


        case "ADD_STEP": {
            let stepContent: any = {};

            if (action.stepType === "board" || action.stepType === "multiboard") {
                stepContent = {
                    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
                };
            } else if (action.stepType === "text") {
                stepContent = {
                    text: getTranslations().editor.rightBar.textEditor.placeholderMessage
                };
            }

            const newStep: Step = {
                id: "step-" + Date.now(),
                title: getTranslations().editor.downBar.stepTitleTemplate,
                type: action.stepType,
                taskId: action.taskId,
                content: stepContent,
                order: state.steps.filter(s => s.taskId === action.taskId).length
            }

            const newSteps = [...state.steps, newStep];

            const taskIndex = state.tasks.findIndex(t => t.id === action.taskId);

            if (taskIndex === -1) {
                return { ...state, steps: newSteps, selectedStepId: newStep.id };
            }

            const newTasks = state.tasks.map((task, index) =>
                index === taskIndex
                    ? { ...task, stepIds: [...task.stepIds, newStep.id] }
                    : task
            );

            return {
                ...state,
                steps: newSteps,
                tasks: newTasks,
                selectedStepId: newStep.id,
            }
        }


        case "DUPLICATE_STEP": {
            const stepToDupe = state.steps.find(s => s.id === action.stepId)
            if (!stepToDupe) {
                return state;
            }
            const newStep: Step = {
                ...stepToDupe,
                id:"step-"+ Date.now(),
                title: stepToDupe.title + getTranslations().editor.downBar.duplicateTitle,
            }
            const newSteps = [...state.steps, newStep];
            return {
                ...state,
                steps: newSteps,
                selectedStepId: newStep.id,
            }
        }
        case "REORDER_STEPS": {
            return {
                ...state,
                steps: action.newOrder,
            }
        }
        case "SELECT_STEP": {
            return {
                ...state,
                selectedStepId: action.stepId,
            }
        }
        case "SELECT_TASK": {
            return {
                ...state,
                selectedTaskId: action.taskId,
                selectedStepId: state.steps.find(s => s.taskId === action.taskId)?.id ?? null,
            }
        }



        case "UPDATE_LESSON": {
            const updatedLessons = state.lessons.map(l => {
                if (l.id === action.lessonId) {
                    return{...l, ...action.updates}
                }
                else {
                    return l;
                }
            })
            return {
                ...state,
                lessons: updatedLessons,
            }
        }
        case "LOAD_LESSON_WITH_DATA": {
            const initialTaskId = action.tasks[0]?.id || "";
            return {
                ...state,
                currentLessonId: action.lessonId,
                steps: action.steps,
                tasks: action.tasks,
                selectedStepId: action.steps[0]?.id || null,
                selectedTaskId: initialTaskId,
            };
        }


        case "ADD_LESSON": {
            const newLesson: Lesson = {
                id: "lesson-" + Date.now(),
                title:getTranslations().editor.downBar.lessonTitleTemplate,
                description: "",
                stepIds:[],
            };
            const newLessons = [...state.lessons, newLesson];
            return {
                ...state,
                lessons:newLessons,
                currentLessonId: newLesson.id,
                steps: [],
                tasks: [],
                selectedStepId: null,
                selectedTaskId: "",
            }
        }
        case "LOAD_LESSON": {
            const lesson = state.lessons.find(l => l.id === action.lessonId);
            if (!lesson) {
                return state;
            }
            const lessonSteps = state.steps.filter(s => lesson.stepIds.includes(s.id));
            return {
                ...state,
                currentLessonId: action.lessonId,
                steps: lessonSteps,
                selectedStepId: lessonSteps[0]?.id || null,
            };
        }

        case "DELETE_LESSON": {
            const filteredLessons = state.lessons.filter(s => s.id !== action.lessonId);
            let newCurrentLessonId: string | null = state.currentLessonId;
            if (state.currentLessonId == action.lessonId) {
                newCurrentLessonId = filteredLessons[0]?.id || null;
            }
            return {
                ...state,
                lessons: filteredLessons,
                currentLessonId: newCurrentLessonId,
                steps: [],
                tasks: [],
                selectedStepId: null,
                selectedTaskId: "",
            }
        }

        case "UPDATE_TASK": {
            const updatedTasks = state.tasks.map(t => {
                if (t.id === action.taskId) {
                    return {...t, ...action.updates};
                }
                else {
                    return t;
                }
            })
            return {
                ...state,
                tasks: updatedTasks,
            }
        }
        case "ADD_TASK": {
            const newTask: Task = {
                id:"task-" + Date.now(),
                title:getTranslations().editor.downBar.taskTitleTemplate,
                stepIds:[],
            }
            const newTasks = [...state.tasks, newTask];
            return {
                ...state,
                tasks:newTasks,
                selectedTaskId: newTask.id,
            }
        }
        case "SET_ALL_LESSONS": {
            return {
                ...state,
                lessons: action.lessons,
                currentLessonId: action.lessons[0]?.id || null,
                selectedTaskId: "",
                selectedStepId: null,
            };
        }


        case "DELETE_TASK": {
            const filteredTasks = state.tasks.filter(t => t.id !== action.taskId);

            const taskToDelete = state.tasks.find(t => t.id === action.taskId);
            let newSteps = state.steps;
            if (taskToDelete) {
                newSteps = state.steps.filter(s => s.taskId !== action.taskId);
            }

            let newSelectedStepId: string | null = state.selectedStepId;
            let newSelectedTaskId: string = state.selectedTaskId;

            if (state.selectedTaskId === action.taskId) {
                newSelectedTaskId = filteredTasks[0]?.id || "";

                if (newSelectedTaskId) {
                    newSelectedStepId = newSteps.find(s => s.taskId === newSelectedTaskId)?.id || null;
                } else {
                    newSelectedStepId = null;
                }
            } else if (!newSteps.find(s => s.id === state.selectedStepId)) {
                newSelectedStepId = newSteps.find(s => s.taskId === state.selectedTaskId)?.id || null;
            }

            return {
                ...state,
                tasks: filteredTasks,
                steps: newSteps,
                selectedStepId: newSelectedStepId,
                selectedTaskId: newSelectedTaskId,
            }
        }
        default:
            return state;
    }
}