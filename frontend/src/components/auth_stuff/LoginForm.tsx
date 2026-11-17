import {getTranslations} from "../../support_scripts/languages";
import {useState} from "react";
import {backendURL} from "../../support_scripts/url";
import {setUserCookie} from "../../support_scripts/auth";

// Commenty nejsou třeba, princip je stejný jak RegisterForm.tsx
export function LoginForm( {onSwitch, onLogin} : {
    onSwitch: (value: boolean) => void,
    onLogin: (value: boolean) => void
}) {
    const registerURL = backendURL() + "/login"
    const email = getTranslations().accountLogin.loginEmail;
    const password = getTranslations().accountLogin.loginPassword;
    interface ErrorFields {
        email?: string;
        password?: string;
        general?: string;
    }
    const [errors, setErrors] = useState<ErrorFields>({})
    const [submitted, setSubmitted] = useState(false);
    const [inputs, setInputs] = useState({
        email:"",
        password:""
    });
    const handleChange = (
        e:React.ChangeEvent<HTMLInputElement>
    ) => {
        const {name, value} = e.target;
        setInputs((prev) => ({
            ...prev,[name]:value
        }));
    }
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitted(false);
        const newErrors: ErrorFields = {}

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (!emailRegex.test(inputs.email)){
            newErrors.email = "Invalid email format";
        }
        if (inputs.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }
        if (Object.keys(newErrors).length > 0){
            setErrors(newErrors);
            return
        }
        try {
            const response = await fetch(registerURL, {
                method: "POST",
                headers:{"Content-Type" : "application/json"},
                body: JSON.stringify(inputs)
            })
            console.log(inputs)
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
                    email: "", password: ""
                })
                setUserCookie(data.value)
                document.cookie = "loggedIn=true"
                onLogin(true);
            }

        } catch (err) {
            setErrors({general:"some problemo try again: "})
        }

    }
    return (
        <>
            {!submitted? (
                <form className="register-form" onSubmit={handleSubmit}>
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
                    <div className="register-form-buttons-div">
                        <button
                            onClick={() => onSwitch(false)}
                            className="switch-form-button"
                            type="button"
                        >
                            <p>{getTranslations().accountLogin.switch}</p>
                        </button>
                        <button className="register-form-button" type="submit">
                            <p>{getTranslations().accountLogin.loginButton}</p>
                        </button>
                    </div>
                </form>
            ) : (
                <div></div>
            )}
        </>
    )
}