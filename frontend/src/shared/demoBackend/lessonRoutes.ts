import {loadDatabase, nowIso, saveDatabase} from "./database";
import type {LessonContentData, StoredLesson} from "./database";
import {
    HTTP_BAD_REQUEST, HTTP_FORBIDDEN, HTTP_NOT_FOUND,
    failure, isRecord, jsonResponse, noContent, readNumber, readString,
} from "./jsonResponse";

const MIN_ELO = 100;
const MAX_ELO = 3000;
const DEFAULT_RECENT_LIMIT = 20;
const STARTING_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

function toLessonRow(lesson: StoredLesson) {
    return {
        id: lesson.id, creator_id: lesson.creatorId, title: lesson.title, description: lesson.description,
        status: lesson.status, difficulty: lesson.difficulty, is_work_in_progress: lesson.status === "draft" ? 1 : 0,
        created_at: lesson.createdAt, last_saved_at: lesson.lastSavedAt, published_at: lesson.publishedAt,
    };
}

function toContentData(value: unknown): LessonContentData {
    if (!isRecord(value)) return {steps: [], tasks: []};
    return {
        steps: Array.isArray(value.steps) ? value.steps : [],
        tasks: Array.isArray(value.tasks) ? value.tasks : [],
    };
}

function thumbnailFen(data: LessonContentData): string {
    const boardStep = data.steps.find(step => isRecord(step) && step.type === "board" && isRecord(step.content) && typeof step.content.fen === "string");
    return isRecord(boardStep) && isRecord(boardStep.content) ? String(boardStep.content.fen) : STARTING_FEN;
}

function updateLesson(lessonId: number, changes: Partial<StoredLesson>): void {
    const database = loadDatabase();
    const lessons = database.lessons.map(lesson => lesson.id === lessonId ? {...lesson, ...changes} : lesson);
    saveDatabase({...database, lessons});
}

function findOwnedLesson(lessonId: number, creatorId: number | null): StoredLesson | Response {
    const lesson = loadDatabase().lessons.find(candidate => candidate.id === lessonId);
    if (!lesson) return failure("lessonNotFound", HTTP_NOT_FOUND);
    if (lesson.creatorId !== creatorId) return failure("notLessonCreator", HTTP_FORBIDDEN);
    return lesson;
}

export function addLesson(body: Record<string, unknown>): Response {
    const title = readString(body, "title")?.trim();
    const creatorId = readNumber(body, "creator_id");
    if (!title || creatorId === null) return failure("invalidRequest", HTTP_BAD_REQUEST);

    const database = loadDatabase();
    if (database.lessons.some(lesson => lesson.creatorId === creatorId && lesson.title === title)) {
        return failure("lessonTitleTaken", HTTP_BAD_REQUEST);
    }
    const timestamp = nowIso();
    const lesson: StoredLesson = {
        id: database.nextLessonId, creatorId, title, description: readString(body, "description") ?? "",
        status: "draft", difficulty: 0, category: null, averageRating: null,
        createdAt: timestamp, lastSavedAt: timestamp, publishedAt: null, data: toContentData(body.data),
    };
    saveDatabase({...database, nextLessonId: lesson.id + 1, lessons: [...database.lessons, lesson]});
    return jsonResponse({success: true, lesson: {id: lesson.id, title, creator_id: creatorId, status: "draft"}});
}

export function userDrafts(creatorId: number): Response {
    const lessons = loadDatabase().lessons
        .filter(lesson => lesson.creatorId === creatorId && lesson.status === "draft")
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
        .map(toLessonRow);
    return jsonResponse({success: true, lessons});
}

export function lessonData(lessonId: number): Response {
    const lesson = loadDatabase().lessons.find(candidate => candidate.id === lessonId);
    if (!lesson) return failure("lessonNotFound", HTTP_NOT_FOUND);
    return jsonResponse({success: true, lesson: toLessonRow(lesson), steps: lesson.data.steps, tasks: lesson.data.tasks});
}

export function saveLessonData(lessonId: number, body: Record<string, unknown>): Response {
    const owned = findOwnedLesson(lessonId, readNumber(body, "creator_id"));
    if (owned instanceof Response) return owned;
    updateLesson(lessonId, {data: toContentData(body.data), lastSavedAt: nowIso()});
    return jsonResponse({success: true});
}

export function publishLesson(lessonId: number, body: Record<string, unknown>): Response {
    const elo = readNumber(body, "elo");
    const description = readString(body, "description");
    if (elo === null || elo < MIN_ELO || elo > MAX_ELO) return failure("invalidElo", HTTP_BAD_REQUEST);
    if (!description) return failure("invalidRequest", HTTP_BAD_REQUEST);

    const owned = findOwnedLesson(lessonId, readNumber(body, "creator_id"));
    if (owned instanceof Response) return owned;
    updateLesson(lessonId, {status: "published", publishedAt: nowIso(), difficulty: elo, description});
    return noContent();
}

export function completeLesson(body: Record<string, unknown>): Response {
    const lessonId = readNumber(body, "lesson_id");
    const accountId = readNumber(body, "account_id");
    if (lessonId === null || accountId === null) return failure("invalidRequest", HTTP_BAD_REQUEST);

    const database = loadDatabase();
    if (!database.accounts.some(account => account.id === accountId)) return failure("accountNotFound", HTTP_NOT_FOUND);
    const eloChange = readNumber(body, "elo_change") ?? 0;
    const xpGained = readNumber(body, "xp_gained") ?? 0;
    const accounts = database.accounts.map(account => account.id === accountId
        ? {...account, elo: account.elo + eloChange, xp: account.xp + xpGained}
        : account);
    const completion = {lessonId, accountId, score: readNumber(body, "score") ?? 0, completedAt: nowIso()};
    saveDatabase({...database, accounts, completions: [...database.completions, completion]});
    return jsonResponse({success: true});
}

export function recentLessons(limitParam: string | null): Response {
    const limit = Number(limitParam) > 0 ? Number(limitParam) : DEFAULT_RECENT_LIMIT;
    const database = loadDatabase();
    const lessons = database.lessons
        .filter(lesson => lesson.status === "published")
        .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""))
        .slice(0, limit)
        .map(lesson => ({
            id: lesson.id, title: lesson.title, description: lesson.description, creator_id: lesson.creatorId,
            created_at: lesson.createdAt, published_at: lesson.publishedAt,
            creator_name: database.accounts.find(account => account.id === lesson.creatorId)?.username ?? "",
            thumbnail_fen: thumbnailFen(lesson.data),
        }));
    return jsonResponse({success: true, lessons});
}
