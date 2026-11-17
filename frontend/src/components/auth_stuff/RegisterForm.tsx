import {getTranslations} from "../../support_scripts/languages";
import React, {useState} from "react";
import {apiFetch} from "../../support_scripts/url";
import {setUserCookie} from "../../support_scripts/auth";

export function RegisterForm( {onSwitch, onLogin} : {
    onSwitch: (value: boolean) => void,
    onLogin: (value: boolean) => void
}) {

    // Nastavení proměnných a stavových proměnných, prostě state nevím jak se to píše česky
    const registerURL = "/register"
    const username = getTranslations().accountRegister.registerUsername;
    const email = getTranslations().accountRegister.registerEmail;
    const password = getTranslations().accountRegister.registerPassword;
    interface ErrorFields {
        username?: string;
        email?: string;
        password?: string;
        general?: string;
    }
    const [errors, setErrors] = useState<ErrorFields>({})
    const [submitted, setSubmitted] = useState(false);
    const [inputs, setInputs] = useState({
        username:"",
        email:"",
        password:""
    });

    // Aktualizování textového pole po každém napsání charakteru
    const handleChange = (
        e:React.ChangeEvent<HTMLInputElement>
    ) => {
        const {name, value} = e.target;
        setInputs((prev) => ({
            ...prev,[name]:value
        }));
    }



    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        // Všemožné kontroly inputu
        e.preventDefault();
        setSubmitted(false);
        const newErrors: ErrorFields = {}
        if (!inputs.username.trim()){
            newErrors.username = getTranslations().errors.usernameIsRequired
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(inputs.email)){
            newErrors.email = getTranslations().errors.invalidEmailFormat;
        }
        if (inputs.password.length < 6) {
            newErrors.password = getTranslations().errors.passwordNotLongEnough;
        }
        if (Object.keys(newErrors).length > 0){
            setErrors(newErrors);
            return
        }

        // Zaslání registrovacího formuláře
        try {
            const response = await apiFetch(registerURL, {
                method: "POST",
                headers:{"Content-Type" : "application/json"},
                body: JSON.stringify(inputs)
            })

            const data = await response.json()

            if (!data.success) {
                setErrors({
                    [data.field]: data.message
                });
                return;
            } else if(data.success) {
                setSubmitted(true);
                setErrors({});
                setInputs({
                    username: "", email: "", password: ""
                })
                document.cookie = "loggedIn=true"
                setUserCookie(data.value)
                onLogin(true);
            }

        } catch (err) {
            setErrors({general:getTranslations().errors.generalLoginOrRegisterError + err})
        }

    }

    // Vrácení komponentů
    return (
        <>
            {!submitted? (
                <form className="register-form" onSubmit={handleSubmit}>

                    {errors.username && (
                        <div className="register-form-error-field">
                            <p>{errors.username}</p>
                        </div>
                    )}
                    <input
                        type="text"
                        name="username"
                        value={inputs.username}
                        onChange={handleChange}
                        placeholder={username}
                        className="register-form-input"
                    />

                    {errors.email && (
                        <div className="register-form-error-field">
                            <p>{errors.email}</p>
                        </div>
                    )}
                    <input
                        type="email"
                        name="email"
                        value={inputs.email}
                        onChange={handleChange}
                        placeholder={email}
                        className="register-form-input"
                    />
                    {errors.password && (
                        <div className="register-form-error-field">
                            <p>{errors.password}</p>
                        </div>
                    )}
                    <input
                        type="password"
                        name="password"
                        value={inputs.password}
                        onChange={handleChange}
                        placeholder={password}
                        className="register-form-input"
                    />
                    <div>
                        <div className="register-form-buttons-div">
                            <button
                                onClick={() => onSwitch(true)}
                                className="switch-form-button"
                                type="button"
                            >
                                <p>{getTranslations().accountRegister.switch}</p>
                            </button>
                            <button className="register-form-button" type="submit">
                                <p>{getTranslations().accountRegister.registerButton}</p>
                            </button>
                        </div>

                    </div>

                </form>
            ) : (
                <div></div>
            )}
        </>
    )
}