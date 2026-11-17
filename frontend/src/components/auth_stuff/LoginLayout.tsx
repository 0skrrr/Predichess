import {LoginTitle} from "./LoginTitle";
import {getTranslations} from "../../support_scripts/languages";
import {RegisterForm} from "./RegisterForm";
import {getCookie} from "../../support_scripts/getCookie";
import {LoginForm} from "./LoginForm";
import {useState} from "react";

export function LoginLayout( {onLogin} : {onLogin: (value: boolean) => void }) {
    const [showLogin, setShowLogin] = useState(
        getCookie("switchToLoginRegister") === "true"
    )
    const switchScreen = (value: boolean) => {
        document.cookie = "switchToLoginRegister=" + value;
        setShowLogin(value);
    }
    return (
        <div className="account-login-layout-div">
            <div className="account-login-layout-content">
                {showLogin ? (
                    <>
                        <LoginTitle text = {getTranslations().accountLogin.loginTitle}/>
                        <LoginForm onSwitch={switchScreen} onLogin={onLogin}></LoginForm>
                    </>
                ) : (
                    <>
                        <LoginTitle text = {getTranslations().accountRegister.registerTitle}/>
                        <RegisterForm onSwitch={switchScreen} onLogin = {onLogin}/>
                    </>
                )}
            </div>
        </div>
    );

}