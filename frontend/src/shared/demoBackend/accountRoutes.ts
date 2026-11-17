import {DEFAULT_ELO, loadDatabase, nowIso, saveDatabase} from "./database";
import type {Account} from "./database";
import {hashNewPassword, isPasswordCorrect} from "./passwordHashing";
import {HTTP_BAD_REQUEST, HTTP_NOT_FOUND, failure, jsonResponse, readString} from "./jsonResponse";

const COMPLETED_LESSONS_SHOWN = 2;
const DRAFTS_SHOWN = 2;

function sameText(a: string, b: string): boolean {
    return a.trim().toLowerCase() === b.trim().toLowerCase();
}

export async function register(body: Record<string, unknown>): Promise<Response> {
    const username = readString(body, "username")?.trim();
    const email = readString(body, "email")?.trim();
    const password = readString(body, "password");
    if (!username || !email || !password) return failure("invalidRequest", HTTP_BAD_REQUEST, "general");

    const database = loadDatabase();
    if (database.accounts.some(account => sameText(account.username, username))) {
        return failure("usernameTaken", HTTP_BAD_REQUEST, "username");
    }
    if (database.accounts.some(account => sameText(account.email, email))) {
        return failure("emailTaken", HTTP_BAD_REQUEST, "email");
    }

    const {hash, salt} = await hashNewPassword(password);
    const account: Account = {
        id: database.nextAccountId,
        username,
        email,
        passwordHash: hash,
        passwordSalt: salt,
        createdAt: nowIso(),
        elo: DEFAULT_ELO,
        xp: 0,
        countryCode: "US",
        bio: "",
    };
    saveDatabase({...database, nextAccountId: account.id + 1, accounts: [...database.accounts, account]});
    return jsonResponse({success: true, value: account.id});
}

export async function login(body: Record<string, unknown>): Promise<Response> {
    const email = readString(body, "email") ?? "";
    const password = readString(body, "password") ?? "";
    const account = loadDatabase().accounts.find(candidate => candidate.email && sameText(candidate.email, email));
    if (!account) return failure("userNotFound", HTTP_BAD_REQUEST, "email");

    const isCorrect = await isPasswordCorrect(password, account.passwordHash, account.passwordSalt);
    if (!isCorrect) return failure("wrongPassword", HTTP_BAD_REQUEST, "password");
    return jsonResponse({success: true, value: account.id});
}

export function playerStats(accountId: number): Response {
    const account = loadDatabase().accounts.find(candidate => candidate.id === accountId);
    if (!account) return failure("accountNotFound", HTTP_NOT_FOUND);
    return jsonResponse({success: true, elo: account.elo, xp: account.xp});
}

export function userOverview(accountId: number): Response {
    const database = loadDatabase();
    const account = database.accounts.find(candidate => candidate.id === accountId);
    if (!account) return failure("accountNotFound", HTTP_NOT_FOUND);

    const recentlyCompletedLessons = database.completions
        .filter(completion => completion.accountId === accountId)
        .sort((a, b) => b.completedAt.localeCompare(a.completedAt))
        .slice(0, COMPLETED_LESSONS_SHOWN)
        .flatMap(completion => {
            const lesson = database.lessons.find(candidate => candidate.id === completion.lessonId);
            if (!lesson) return [];
            return [{
                id: lesson.id, title: lesson.title, description: lesson.description,
                difficulty: lesson.difficulty, category: lesson.category, average_rating: lesson.averageRating,
                completed_at: completion.completedAt, score: completion.score,
            }];
        });

    const recentlyWorkedOnLessons = database.lessons
        .filter(lesson => lesson.creatorId === accountId && lesson.status === "draft")
        .sort((a, b) => b.lastSavedAt.localeCompare(a.lastSavedAt))
        .slice(0, DRAFTS_SHOWN)
        .map(lesson => ({
            id: lesson.id, title: lesson.title, description: lesson.description,
            difficulty: lesson.difficulty, category: lesson.category, average_rating: lesson.averageRating,
            status: lesson.status, is_work_in_progress: 1, last_saved_at: lesson.lastSavedAt,
            published_at: lesson.publishedAt,
        }));

    return jsonResponse({
        success: true,
        userProfileData: {
            username: account.username, created_at: account.createdAt, elo: account.elo,
            xp: account.xp, country_code: account.countryCode, bio: account.bio,
        },
        recentlyCompletedLessons,
        recentlyWorkedOnLessons,
    });
}
