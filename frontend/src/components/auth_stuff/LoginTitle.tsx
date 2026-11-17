

// Komponent pro titulek na Login či Register
// Už proboha nevím, proč jsem to udělal - vždyť to tolik řádků neušetří
export function LoginTitle (
    {text}:{text:string})
{
    return (
        <p className="login-title">{text}</p>
    )
}