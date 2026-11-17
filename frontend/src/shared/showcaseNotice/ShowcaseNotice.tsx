import {useEffect, useRef, useState} from "react";
import {getTranslations} from "../../support_scripts/languages";

const DISMISSED_KEY = "predichess.showcaseNoticeDismissed";

function wasDismissed(): boolean {
    try {
        return window.localStorage.getItem(DISMISSED_KEY) === "true";
    } catch {
        return false;
    }
}

function rememberDismissal(): void {
    try {
        window.localStorage.setItem(DISMISSED_KEY, "true");
    } catch {
        return;
    }
}

export function ShowcaseNotice() {
    const [isOpen, setIsOpen] = useState(() => !wasDismissed());
    const dismissButton = useRef<HTMLButtonElement>(null);
    const text = getTranslations().showcaseNotice;

    useEffect(() => {
        if (isOpen) dismissButton.current?.focus();
    }, [isOpen]);

    if (!isOpen) return null;

    const dismiss = () => {
        rememberDismissal();
        setIsOpen(false);
    };

    return (
        <div className="showcase-backdrop" onKeyDown={event => event.key === "Escape" && dismiss()}>
            <div className="showcase-dialog" role="dialog" aria-modal="true" aria-labelledby="showcase-title">
                <h2 id="showcase-title" className="showcase-title">{text.title}</h2>
                <p className="showcase-body">{text.body}</p>
                <p className="showcase-note">{text.dataNote}</p>
                <button ref={dismissButton} className="showcase-button" onClick={dismiss}>
                    {text.dismissButton}
                </button>
            </div>
        </div>
    );
}
