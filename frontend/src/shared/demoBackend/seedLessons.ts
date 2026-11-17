import type {DemoDatabase, StoredLesson} from "./database";
import {getTranslations} from "../../support_scripts/languages";

const SEED_AUTHOR_ID = 1;
const SEED_PUBLISHED_AT = "2025-12-01T10:00:00.000Z";
const UNUSABLE_PASSWORD = "!";

interface SeedStep {
    id: string;
    taskId: string;
    title: string;
    type: string;
    content: Record<string, unknown>;
    order: number;
}

const ITALIAN_GAME_FEN = "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3";
const BACK_RANK_FEN = "6k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1";
const KNIGHT_FORK_FEN = "r3k3/8/8/3N4/8/8/8/4K3 w - - 0 1";

function boardStep(id: string, taskId: string, title: string, fen: string, order: number): SeedStep {
    return {id, taskId, title, type: "board", content: {fen}, order};
}

function textStep(id: string, taskId: string, title: string, text: string, order: number): SeedStep {
    return {id, taskId, title, type: "text", content: {text}, order};
}

function questionStep(id: string, taskId: string, title: string, question: string, correctAnswer: string, order: number): SeedStep {
    return {id, taskId, title, type: "question", content: {question, correctAnswer, points: 20}, order};
}

function seedLesson(id: number, title: string, description: string, difficulty: number, steps: SeedStep[]): StoredLesson {
    const taskId = "task-seed-" + id;
    return {
        id,
        creatorId: SEED_AUTHOR_ID,
        title,
        description,
        status: "published",
        difficulty,
        category: null,
        averageRating: null,
        createdAt: SEED_PUBLISHED_AT,
        lastSavedAt: SEED_PUBLISHED_AT,
        publishedAt: SEED_PUBLISHED_AT,
        data: {
            steps: steps.map(step => ({...step, taskId})),
            tasks: [{id: taskId, title, stepIds: steps.map(step => step.id)}],
        },
    };
}

function createSeedLessons(): StoredLesson[] {
    return [
        seedLesson(1, "The Italian Game", "Develop fast and aim at f7.", 900, [
            boardStep("s1-1", "", "Starting position", ITALIAN_GAME_FEN, 0),
            textStep("s1-2", "", "The idea", "White's bishop on c4 eyes the weak f7 square, defended only by the king.", 1),
            questionStep("s1-3", "", "Check yourself", "Which square does the c4 bishop target?", "f7", 2),
        ]),
        seedLesson(2, "Back Rank Mate", "Punish a king with no escape squares.", 1100, [
            boardStep("s2-1", "", "The trap", BACK_RANK_FEN, 0),
            textStep("s2-2", "", "Why it works", "Black's own pawns block the king. A rook on the eighth rank is mate.", 1),
            questionStep("s2-3", "", "Find the move", "What move mates? (e.g. Ra8)", "Ra8", 2),
        ]),
        seedLesson(3, "Knight Forks", "Attack two pieces at once.", 1000, [
            boardStep("s3-1", "", "Spot the fork", KNIGHT_FORK_FEN, 0),
            questionStep("s3-2", "", "Your move", "Which knight move forks king and rook?", "Nc7", 1),
        ]),
    ];
}

export function createSeedDatabase(): DemoDatabase {
    const lessons = createSeedLessons();
    return {
        nextAccountId: SEED_AUTHOR_ID + 1,
        nextLessonId: lessons.length + 1,
        accounts: [{
            id: SEED_AUTHOR_ID,
            username: getTranslations().demoBackend.seedAuthorName,
            email: "",
            passwordHash: UNUSABLE_PASSWORD,
            passwordSalt: UNUSABLE_PASSWORD,
            createdAt: SEED_PUBLISHED_AT,
            elo: 1200,
            xp: 0,
            countryCode: "US",
            bio: "",
        }],
        lessons,
        completions: [],
    };
}
