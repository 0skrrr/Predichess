import crypto from "crypto";

// Funkce pro hashnutí hesel
export function hashPassword(inputPassword:string) {
    const hash = crypto.createHash("sha256").update(inputPassword).digest("hex");
    return hash;
}