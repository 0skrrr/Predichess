import { UserContext, getInitialAuthState, getUserId, clearUserIdCookie,setUserCookie } from "../support_scripts/auth";
import {useState} from "react";
import {LoginLayout} from "./auth_stuff/LoginLayout";
import {NormalLayout} from "./NormalLayout";

export function App() {

    // Zjištění, jestli je uživatel přihlášen či ne
    // Na základě toho se
    const { initialLoggedIn, initialUserId } = getInitialAuthState();
    const [loggedIn, setLoggedIn] = useState(initialLoggedIn);
    const [userId, setUserId] = useState<number | null>(initialUserId);

    // Změna cookie hodnoty na základě stavu přihlášení
    // Plus aktualizování hodnot stavů
    function setLoggedCookie(value: boolean) {
        if (!value) {
            clearUserIdCookie();
            setUserId(null);
        } else {
            const newUserId = getUserId();
            if (newUserId !== null) {
                setUserCookie(newUserId);
                setUserId(newUserId);
            } else {
                document.cookie = "loggedIn=false";
                clearUserIdCookie();
                setUserId(null);
            }
        }

        document.cookie = "loggedIn=" + value;
        setLoggedIn(value);
    }

    // Vrácení správného layoutu
    return (
        <UserContext.Provider value={{ userId }}>
            {loggedIn && userId ? (
                <NormalLayout onLogout={setLoggedCookie} />
            ) : (
                <LoginLayout onLogin={setLoggedCookie} />
            )}
        </UserContext.Provider>
    );
}
