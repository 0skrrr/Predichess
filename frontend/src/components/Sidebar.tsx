import {getTranslations} from "../support_scripts/languages";
import {SidebarButton} from "./SidebarButton";
interface SidebarProps {
    onNavigate: (contentType: string) => void;
    onLogout: () => void;
}
// Sidebar, mírná ukázka pro drillingu
export function Sidebar({onNavigate, onLogout} : SidebarProps) {
    return(
        <div className="sidebar">
            <SidebarButton
                text={getTranslations().sidebar.homeButton}
                src ="home"
                onClick={() => onNavigate("home")}
            />
            <SidebarButton
                text={getTranslations().sidebar.learnButton}
                src ="learn"
                onClick={() => onNavigate("learn")}
            />
            <SidebarButton
                text={getTranslations().sidebar.editorButton}
                src ="editor"
                onClick={() => onNavigate("editor")}
            />
            <SidebarButton
                text={getTranslations().sidebar.logoutButton}
                src ="account"
                onClick={onLogout}
            />
        </div>
    );
}