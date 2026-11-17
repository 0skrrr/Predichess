const PBKDF2_ITERATIONS = 210_000;
const SALT_BYTES = 16;
const HASH_BITS = 256;

function toHex(bytes: Uint8Array): string {
    return Array.from(bytes, byte => byte.toString(16).padStart(2, "0")).join("");
}

function fromHex(hex: string): Uint8Array<ArrayBuffer> {
    const pairs = hex.match(/.{2}/g) ?? [];
    return new Uint8Array(pairs.map(pair => parseInt(pair, 16)));
}

async function derive(password: string, salt: Uint8Array<ArrayBuffer>): Promise<string> {
    const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
    const bits = await crypto.subtle.deriveBits(
        {name: "PBKDF2", hash: "SHA-256", salt, iterations: PBKDF2_ITERATIONS},
        key,
        HASH_BITS,
    );
    return toHex(new Uint8Array(bits));
}

export async function hashNewPassword(password: string): Promise<{hash: string; salt: string}> {
    const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
    return {hash: await derive(password, salt), salt: toHex(salt)};
}

export async function isPasswordCorrect(password: string, hash: string, salt: string): Promise<boolean> {
    if (salt.length !== SALT_BYTES * 2) return false;
    return (await derive(password, fromHex(salt))) === hash;
}
