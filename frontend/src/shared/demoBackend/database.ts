import {createSeedDatabase} from "./seedLessons";

export const DEFAULT_ELO = 1200;
const STORAGE_KEY = "predichess.demoDatabase.v1";

export interface Account {
    id: number;
    username: string;
    email: string;
    passwordHash: string;
    passwordSalt: string;
    createdAt: string;
    elo: number;
    xp: number;
    countryCode: string;
    bio: string;
}

export type LessonStatus = "draft" | "published";

export interface StoredLesson {
    id: number;
    creatorId: number;
    title: string;
    description: string;
    status: LessonStatus;
    difficulty: number;
    category: string | null;
    averageRating: number | null;
    createdAt: string;
    lastSavedAt: string;
    publishedAt: string | null;
    data: LessonContentData;
}

export interface LessonContentData {
    steps: unknown[];
    tasks: unknown[];
}

export interface LessonCompletion {
    lessonId: number;
    accountId: number;
    score: number;
    completedAt: string;
}

export interface DemoDatabase {
    nextAccountId: number;
    nextLessonId: number;
    accounts: Account[];
    lessons: StoredLesson[];
    completions: LessonCompletion[];
}

let cachedDatabase: DemoDatabase | null = null;

function readStoredDatabase(): DemoDatabase | null {
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as DemoDatabase) : null;
    } catch {
        return null;
    }
}

export function loadDatabase(): DemoDatabase {
    if (cachedDatabase) return cachedDatabase;
    cachedDatabase = readStoredDatabase() ?? createSeedDatabase();
    return cachedDatabase;
}

export function saveDatabase(database: DemoDatabase): void {
    cachedDatabase = database;
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(database));
    } catch {
        return;
    }
}

export function nowIso(): string {
    return new Date().toISOString();
}
