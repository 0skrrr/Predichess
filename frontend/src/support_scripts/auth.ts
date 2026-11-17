import { createContext, useContext } from "react";
import { getTranslations } from "./languages";


// Funkce pro získání hodnot loggedIn a userId cookies
export function getInitialAuthState() {
    const loggedIn =
        document.cookie.includes("loggedIn=true") &&
        getUserId() !== null;

    return {
        initialLoggedIn: loggedIn,
        initialUserId: loggedIn ? getUserId() : null,
    };
}


// Funkce pro získání userId na základě userId cookie
export function getUserId(): number | null {
    const cookie = document.cookie
        .split("; ")
        .find(row => row.startsWith("userId="));

    if (!cookie) return null;

    const idStr = cookie.split("=")[1];
    const id = parseInt(idStr, 10);

    return isNaN(id) ? null : id;
}


// Resetování hodnot cookies
export function clearUserIdCookie() {
    document.cookie = "userId=; path=/;";
}


// Nastavení UserId cookie
export function setUserCookie(userId: number) {
    document.cookie = "userId="+ userId + "; path=/";
}


// Definování typu hodnoty - pojištění, kdyby to bylo null
type UserContextType = {
    userId: number | null;
};

export const UserContext = createContext<UserContextType | undefined>(
    undefined
);

export function useUserId() {
    const context = useContext(UserContext);

    if (!context) {
        throw new Error(
            getTranslations().errors.useUserIdNotUsedInUserProvider
        );
    }

    return context.userId;
}
