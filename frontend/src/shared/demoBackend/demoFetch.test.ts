import {beforeEach, describe, expect, it, vi} from "vitest";

async function freshDemoFetch() {
    vi.resetModules();
    return (await import("./demoFetch")).demoFetch;
}

function post(path: string, body: unknown, method = "POST") {
    return {path, init: {method, body: JSON.stringify(body)}};
}

describe("demoFetch", () => {
    let demoFetch: Awaited<ReturnType<typeof freshDemoFetch>>;

    beforeEach(async () => {
        demoFetch = await freshDemoFetch();
    });

    async function registerUser(username = "alice", email = "alice@example.test", password = "secret123") {
        const {path, init} = post("/register", {username, email, password});
        return (await demoFetch(path, init)).json();
    }

    it("lists the seeded community lessons", async () => {
        const result = await (await demoFetch("/lessons/recent?limit=2")).json();
        expect(result.success).toBe(true);
        expect(result.lessons).toHaveLength(2);
        expect(result.lessons[0].thumbnail_fen).toMatch(/\//);
    });

    it("registers and logs in with the right password only", async () => {
        const registered = await registerUser();
        expect(registered).toMatchObject({success: true, value: expect.any(Number)});

        const wrong = post("/login", {email: "alice@example.test", password: "nope"});
        expect(await (await demoFetch(wrong.path, wrong.init)).json()).toMatchObject({success: false, field: "password"});

        const right = post("/login", {email: "ALICE@example.test", password: "secret123"});
        expect(await (await demoFetch(right.path, right.init)).json()).toEqual({success: true, value: registered.value});
    });

    it("rejects a duplicate username", async () => {
        await registerUser();
        expect(await registerUser("Alice", "other@example.test")).toMatchObject({success: false, field: "username"});
    });

    it("only lets the creator save and publish a lesson", async () => {
        const owner = (await registerUser()).value;
        const stranger = (await registerUser("bob", "bob@example.test")).value;
        const created = post("/addLesson", {title: "Pins", creator_id: owner, data: {steps: [], tasks: []}});
        const lessonId = (await (await demoFetch(created.path, created.init)).json()).lesson.id;

        const hijack = post(`/lessons/${lessonId}/data`, {creator_id: stranger, data: {steps: [1], tasks: []}});
        expect((await demoFetch(hijack.path, hijack.init)).status).toBe(403);

        const publish = post(`/lessons/${lessonId}/publish`, {creator_id: owner, elo: 1300, description: "Pin it"}, "PATCH");
        expect((await demoFetch(publish.path, publish.init)).status).toBe(204);

        const recent = await (await demoFetch("/lessons/recent")).json();
        expect(recent.lessons[0]).toMatchObject({title: "Pins", creator_name: "alice"});
    });

    it("adds xp and elo when a lesson is completed", async () => {
        const accountId = (await registerUser()).value;
        const done = post("/lessons/complete", {lesson_id: 1, account_id: accountId, score: 20, xp_gained: 50, elo_change: 4});
        await demoFetch(done.path, done.init);

        expect(await (await demoFetch(`/account/${accountId}/stats`)).json()).toEqual({success: true, elo: 1204, xp: 50});
        const overview = await (await demoFetch(`/user/${accountId}`)).json();
        expect(overview.recentlyCompletedLessons[0]).toMatchObject({id: 1, score: 20});
    });

    it("rejects invalid json and unknown routes", async () => {
        expect((await demoFetch("/login", {method: "POST", body: "{"})).status).toBe(400);
        expect((await demoFetch("/nope")).status).toBe(404);
    });
});
