import {getTranslations} from "../../support_scripts/languages";

export const HTTP_OK = 200;
export const HTTP_NO_CONTENT = 204;
export const HTTP_BAD_REQUEST = 400;
export const HTTP_FORBIDDEN = 403;
export const HTTP_NOT_FOUND = 404;

export type DemoMessageKey = keyof ReturnType<typeof getTranslations>["demoBackend"];

export function jsonResponse(body: unknown, status: number = HTTP_OK): Response {
    return new Response(JSON.stringify(body), {status, headers: {"Content-Type": "application/json"}});
}

export function failure(messageKey: DemoMessageKey, status: number, field?: string): Response {
    const message = getTranslations().demoBackend[messageKey];
    return jsonResponse({success: false, message, ...(field ? {field} : {})}, status);
}

export function noContent(): Response {
    return new Response(null, {status: HTTP_NO_CONTENT});
}

export function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function readString(body: Record<string, unknown>, key: string): string | null {
    const value = body[key];
    return typeof value === "string" ? value : null;
}

export function readNumber(body: Record<string, unknown>, key: string): number | null {
    const value = typeof body[key] === "string" ? Number(body[key]) : body[key];
    return typeof value === "number" && Number.isFinite(value) ? value : null;
}
