import type {LessonState, Lesson, Step, Task} from "./types";
import {backendURL} from "./url";
import {getTranslations} from "./languages";

const URL= backendURL();

export interface LessonWithDifficulty extends Lesson {
    difficulty: number;
}

export interface PlayerStats {
    elo: number;
    xp: number;
}

// Funkce pro komunikaci mezi editorem a backendem



// Získání všech lekcí uživatele
export async function fetchUserLessons (userId: number) : Promise<Lesson[]> {
    const response = await fetch(URL + "/lessons/user/" + userId)
    const result = await response.json()
    if (Array.isArray(result)) {
        return result.map((lesson: any) => ({
            id:lesson.id.toString(),
            title:lesson.title,
            description:lesson.description || "",
            stepIds: []
        }));
    }
    if (!result.success) {
        throw new Error(result.message);
    }
    if (result.success && result.lessons) {
        return result.lessons.map((lesson: any) => ({
            id: lesson.id.toString(),
            title: lesson.title,
            description: lesson.description || "",
            stepIds: [],
        }));
    }
    throw new Error(getTranslations().errors.invalidResponseFormat);

}


// Vytvoření lekce, uložení do databáze
export async function createLesson (title: string, userId: number) : Promise<Lesson> {
    const response = await fetch(URL + "/addLesson", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            title,
            creator_id:userId,
            description:"",
            data:{steps:[], tasks:[]},
        })
    })
    const result = await response.json()
    if (!result.success) {
        throw new Error(result.message);
    }
    return {
        id: result.lesson.id.toString(),
        title: result.lesson.title,
        description: "",
        stepIds: [],
    }
}


// Získání dat jedné konkrétní lekce

export async function fetchLessonData (lessonId:string) : Promise<{
    lesson: LessonWithDifficulty,
    steps: Step[],
    tasks: Task[]
}> {
    const response = await fetch(URL + "/lessons/" + lessonId + "/data")
    const result = await response.json()
    if (!result.success) {
        throw new Error(result.message);
    }

    const lessonData = result.lesson;
    const difficulty = parseInt(lessonData.difficulty, 10) || 1200;

    return {
        lesson: {
            id: lessonData.id.toString(),
            title: lessonData.title,
            description: lessonData.description || "",
            stepIds: result.steps.map((s: Step) => s.id),
            difficulty: difficulty,
        },
        steps: result.steps,
        tasks: result.tasks,
    }
}


// Získání dat o hráči

export async function fetchPlayerStats(accountId: number): Promise<PlayerStats> {
    const response = await fetch(URL + "/account/"+accountId+"/stats");
    const result = await response.json();

    if (!result.success) {
        throw new Error(result.message || getTranslations().errors.failedToFetchPlayerStats);
    }

    return {
        elo: parseInt(result.elo, 10) || 1200,
        xp: parseInt(result.xp, 10) || 0,
    };
}


// Uložení dat lekce

export async function saveLessonData (
    lessonId: string,
    state: LessonState,
    userId: number
) : Promise<boolean> {
    const response = await fetch(URL + "/lessons/" + lessonId + "/data", {
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify({
            data: {
                steps: state.steps,
                tasks: state.tasks,
            },
            creator_id: userId,
        })
    })
    const result = await response.json()
    if (!result.success) {
        throw new Error(result.message);
    }
    return result.success;
}


// Publikování lekce - změna stavu v databázi

export async function publishLesson (
    lessonId: string,
    userId: number,
    elo: number,
    description: string
) : Promise<boolean> {
    const response = await fetch(URL + "/lessons/" + lessonId + "/publish", {
        method: "PATCH",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify({
            creator_id: userId,
            elo: elo,
            description: description
        })
    });

    if (!response.ok) {
        let errorBody;
        try {
            errorBody = await response.json();
        } catch {
            throw new Error("Failed to publish lesson. Server returned status:" + response.status + response.statusText);
        }
        throw new Error(errorBody.message || getTranslations().errors.failedToPublishLesson + response.status);
    }

    if (response.status === 204) {
        return true;
    }

    try {
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || getTranslations().errors.failedToPublishLesson);
        }
        return result.success;
    } catch (e) {
        throw new Error(getTranslations().errors.failedToPublishLesson + e);
    }
}

// Uložení dohrání lekce uživatelem
export async function saveLessonCompletion (
    lessonId: string,
    accountId: number | null,
    points: number,
    timeSeconds: number,
    xpGained: number,
    eloChange: number
) : Promise<boolean> {
    const response = await fetch(URL + "/lessons/complete", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            lesson_id: lessonId,
            account_id: accountId,
            score: points,
            time_spent: timeSeconds,
            xp_gained: xpGained,
            elo_change: eloChange
        })
    });

    if (!response.ok) {
        let errorBody;
        try {
            errorBody = await response.json();
        } catch {
            throw new Error(getTranslations().errors.failedToSaveCompletion + response.status);
        }
        throw new Error(errorBody.message || getTranslations().errors.failedToSaveCompletion + response.status);
    }

    const result = await response.json();
    if (!result.success) {
        throw new Error(result.message || getTranslations().errors.failedToSaveCompletion);
    }
    return result.success;
}


export interface PublicLesson {
    id: number;
    title: string;
    description: string;
    creator_id: number;
    creator_name: string;
    created_at: string;
    published_at: string;
    thumbnail_fen?: string;
}


// Získání posledních publikovaných lekcí komunity

export async function fetchRecentLessons(limit: number = 40): Promise<PublicLesson[]> {
    const response = await fetch(`${URL}/lessons/recent?limit=${limit}`);
    const result = await response.json();
    if (!result.success) throw new Error(result.message);
    return result.lessons;
}