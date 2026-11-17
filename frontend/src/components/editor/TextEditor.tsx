import {useState, useEffect} from "react";
import type {EditorProps} from "../../support_scripts/types";

export function TextEditor({ content, onUpdate }: EditorProps) {
    const [textInput, setTextInput] = useState(content.text || "");

    // Aby po spuštění obsahovalo textové pole něco
    useEffect(() => {
        setTextInput(content.text || "");
    }, [content]);

    const handleUpdate = () => {
        onUpdate({ text: textInput });
    };

    // Render
    return (
        <div className="text-editor">
            <h4>Text Content</h4>
            <div className="form-group">
                <label>Text</label>
                <textarea
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Enter text explanation"
                    rows={10}
                />
                <button onClick={handleUpdate} className="btn-update">
                    Update Text
                </button>
            </div>
        </div>
    );
}