
// Import všech json files s jazyky
import englishTranslations from "../assets/languagues/englishLanguageFrontend.json"


//Získání konkrétního jazyka
// V tomto případě se nic nevybírá, v budoucnu by tu bylo třeba odkázání na cookies
function language() {
    const language = "English"
    return language;
}

// Funkce pro vrácení správného jazyka.
export function getTranslations () {
    const lang = language();
    switch (lang) {
        case "English":
            return englishTranslations;
        default:
            return englishTranslations;
    }
}