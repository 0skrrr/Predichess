
// Nevyužité importy, ale nechci to mazat
import editor from "../assets/icons/sidebar/editor.png";
import account from "../assets/icons/sidebar/account.png";
import settings from "../assets/icons/sidebar/settings.png";
import profile from "../assets/icons/sidebar/profile.png";
import learn from "../assets/icons/sidebar/learn.png";
import play from "../assets/icons/sidebar/play.png";
import home from "../assets/icons/sidebar/home.png";


// Výběr typu zobrazení, plus ikon.
export function SidebarButton(
    {text, src, onClick}:{text:string, src:string, onClick:() => void}
) {
    let sourc:string = editor;
    switch(src){
        case"editor":
            sourc = editor;
            break;
        case "account":
            sourc = account;
            break;
        case "profile":
            sourc = profile;
            break;
        case "settings":
            sourc = settings;
            break;
        case "learn":
            sourc = learn;
            break;
        case "play":
            sourc = play;
            break;
        case "home":
            sourc = home;

    }
    return (
        <button className="sidebar-button" onClick={onClick}>
            <img className="sidebar-button-image" src={sourc} alt="icon"></img>
            <p className="sidebar-button-text">{text}</p>
        </button>
    )
}