

// Funkce pro získání hodnoty jakéhokoliv cookie na základě čistě jména


export function getCookie(name: string) {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith(name + "=")) {
            return cookie.substring(name.length + 1);
        }
    }
    return null;
}