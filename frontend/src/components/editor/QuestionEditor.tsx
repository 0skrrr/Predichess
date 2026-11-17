import {useState, useEffect} from "react";
import type{EditorProps} from "../../support_scripts/types";
import React from "react";

export function QuestionEditor({ content, onUpdate }: EditorProps) {
    const [question, setQuestion] = useState(content.question || "");
    const [correctAnswer, setCorrectAnswer] = useState(content.correctAnswer || "");
    const [points, setPoints] = useState(content.points || 20);

    // Původní stav
    useEffect(() => {
        setQuestion(content.question || "");
        setCorrectAnswer(content.correctAnswer || "");
        setPoints(content.points || 20);
    }, [content]);


    // Funkce pro změny parametrů otázky

    const handleUpdate = () => {
        const pointsValue = typeof points === "number" ? points : parseInt(points, 10) || 0;
        onUpdate({ question, correctAnswer, points: pointsValue });
    };

    const handleQuestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setQuestion(e.target.value);
    };

    const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCorrectAnswer(e.target.value);
    };

    const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPoints(parseInt(e.target.value, 10) || 0);
    };


    // Render
    return (
        <div className="question-editor">
            <h4>Question Step</h4>
            <div className="form-group">
                <label>Question</label>
                <textarea
                    value={question}
                    onChange={handleQuestionChange}
                    placeholder="What should the student answer?"
                    rows={3}
                />
            </div>
            <div className="form-group">
                <label>Correct Answer</label>
                <input
                    type="text"
                    value={correctAnswer}
                    onChange={handleAnswerChange}
                    placeholder="e.g., e4, Nf3, etc."
                />
            </div>
            <div className="form-group">
                <label>Points Awarded</label>
                <input
                    className="points-editor"
                    type="number"
                    value={points}
                    onChange={handlePointsChange}
                    placeholder="Points to award"
                    min="0"
                />
            </div>
            <button onClick={handleUpdate} className="btn-update">
                Update Question
            </button>
        </div>
    );
}