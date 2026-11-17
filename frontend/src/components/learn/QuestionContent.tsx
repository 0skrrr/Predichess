import React, { useState } from "react";
import type { Step } from "../../support_scripts/types";
import {getTranslations} from "../../support_scripts/languages";

interface QuestionContentProps {
    step: Step;
    onComplete: () => void;
    onNextStep: () => void;
    isLastStep: boolean;
    addPoints: (p: number) => void;
}

export const QuestionContent: React.FC<QuestionContentProps> = ({ step, isLastStep, addPoints }) => {
    const { question, correctAnswer, points = 20 } = step.content;
    console.log("step",step.content);

    const [userInput, setUserInput] = useState("");
    const [feedback, setFeedback] = useState<"initial" | "correct" | "incorrect">("initial");
    const [submitted, setSubmitted] = useState(false);


    // Funkce zajišťujicí fungování odeslání formuláře se vším všudy (body a tak)
    const handleSubmit = () => {
        const normalizedInput = userInput.trim().toLowerCase();
        const normalizedAnswer = correctAnswer.trim().toLowerCase();

        if (normalizedInput === normalizedAnswer) {
            setFeedback("correct");
            addPoints(points);
            setSubmitted(true);
        } else {
            setFeedback("incorrect");
            setSubmitted(true);
        }
    };

    const isCorrect = feedback === "correct";

    const translations = getTranslations();
    
    const playerTranslations = translations.learn.player as any;

    return (
        <div className="lp-question-container">
            <h3 className="lp-question-text">{question}</h3>

            <div className="lp-answer-area">
                <input
                    type="text"
                    className={`lp-answer-input ${feedback === "correct" ? "lp-correct" : feedback === "incorrect" ? "lp-incorrect" : ""}`}
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Enter your answer (e.g., e4, Nf3, etc.)"
                    disabled={submitted}
                />

                {!submitted && (
                    <button className="lp-btn-submit" onClick={handleSubmit} disabled={!userInput.trim()}>
                        Submit Answer
                    </button>
                )}

                {submitted && isCorrect && (
                    <>
                        <div className="lp-feedback-correct">
                            Correct! You earned {points} points.
                        </div>
                    </>
                )}

                {submitted && !isCorrect && (
                    <div className="lp-feedback-incorrect">
                        Incorrect. The correct answer was: {correctAnswer}.
                    </div>
                )}
            </div>
        </div>
    );
};