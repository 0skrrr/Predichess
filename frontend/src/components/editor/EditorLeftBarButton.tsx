interface EditorLeftBarButtonProps {
    text: string;
    onClick?: () => void;
    disabled?: boolean;
}

export function EditorLeftBarButton ({text, onClick, disabled}: EditorLeftBarButtonProps) {
    return (
        <button
            className="editor-left-bar-button"
            onClick={onClick}
            disabled={disabled}
        >
            <img src ="" className="editor-left-bar-button-icon"></img>
            <p>{text}</p>
        </button>
    )
}