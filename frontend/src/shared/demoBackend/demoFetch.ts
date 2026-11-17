import {login, playerStats, register, userOverview} from "./accountRoutes";
import {
    addLesson, completeLesson, lessonData, publishLesson, recentLessons, saveLessonData, userDrafts,
} from "./lessonRoutes";
import {HTTP_BAD_REQUEST, HTTP_NOT_FOUND, failure, isRecord} from "./jsonResponse";

type Body = Record<string, unknown>;

interface Route {
    method: string;
    pattern: RegExp;
    handle: (params: number[], body: Body, query: URLSearchParams) => Response | Promise<Response>;
}

const ROUTES: Route[] = [
    {method: "POST", pattern: /^\/register$/, handle: (_, body) => register(body)},
    {method: "POST", pattern: /^\/login$/, handle: (_, body) => login(body)},
    {method: "POST", pattern: /^\/addlesson$/i, handle: (_, body) => addLesson(body)},
    {method: "GET", pattern: /^\/lessons\/recent$/, handle: (_, __, query) => recentLessons(query.get("limit"))},
    {method: "POST", pattern: /^\/lessons\/complete$/, handle: (_, body) => completeLesson(body)},
    {method: "GET", pattern: /^\/lessons\/user\/(\d+)$/, handle: ([id]) => userDrafts(id)},
    {method: "GET", pattern: /^\/lessons\/(\d+)\/data$/, handle: ([id]) => lessonData(id)},
    {method: "POST", pattern: /^\/lessons\/(\d+)\/data$/, handle: ([id], body) => saveLessonData(id, body)},
    {method: "PATCH", pattern: /^\/lessons\/(\d+)\/publish$/, handle: ([id], body) => publishLesson(id, body)},
    {method: "GET", pattern: /^\/account\/(\d+)\/stats$/, handle: ([id]) => playerStats(id)},
    {method: "GET", pattern: /^\/user\/(\d+)$/, handle: ([id]) => userOverview(id)},
];

function parseBody(init?: RequestInit): Body | null {
    if (typeof init?.body !== "string") return {};
    try {
        const parsed: unknown = JSON.parse(init.body);
        return isRecord(parsed) ? parsed : null;
    } catch {
        return null;
    }
}

export async function demoFetch(path: string, init?: RequestInit): Promise<Response> {
    const url = new URL(path, "https://demo.invalid");
    const method = (init?.method ?? "GET").toUpperCase();
    const body = parseBody(init);
    if (body === null) return failure("invalidRequest", HTTP_BAD_REQUEST);

    for (const route of ROUTES) {
        const match = route.method === method ? route.pattern.exec(url.pathname) : null;
        if (!match) continue;
        return route.handle(match.slice(1).map(Number), body, url.searchParams);
    }
    return failure("routeNotFound", HTTP_NOT_FOUND);
}
