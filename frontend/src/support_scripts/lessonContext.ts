import React, { createContext, useContext } from 'react';
import type {LessonState, LessonAction} from "./types";
import {getTranslations} from "./languages";

// Funkce pro veškerou úpravu state lekce

interface LessonContextType {
    state: LessonState;
    dispatch: React.Dispatch<LessonAction>;
}

// Vytvoření kontextu lekce
export const LessonContext = createContext<LessonContextType | undefined>(undefined);

export function useLessonContext() : LessonContextType {
    const context = useContext(LessonContext);
    if (!context) {
        throw new Error(getTranslations().errors.useLessonContextNotWithinEditorLayout);
    }
    return context
}