import {NormalContent} from "./NormalContent";
import {Sidebar} from "./Sidebar";
import {useState} from "react";

//Komponent pro render Sidebaru a NormalContent plus navigace

export function NormalLayout( {onLogout} : {onLogout: (value: boolean) => void }) {
    const [activeContent, setActiveContent] = useState<string>("home");
    return (
        <div className="normal-layout-div">
            <Sidebar onNavigate={setActiveContent} onLogout={() => onLogout(false)}/>
            <NormalContent contentType={activeContent}></NormalContent>
        </div>
    )
}