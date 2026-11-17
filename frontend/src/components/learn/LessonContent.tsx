

import React from 'react';
import type { Step} from "../../support_scripts/types";
import {LessonBoard} from "./LessonBoard";
import { QuestionContent } from "./QuestionContent";

interface ContentProps {
    step: Step | null;
    onComplete: () => void;
    onNextStep: () => void;
    isLastStep: boolean;
    addPoints: (p: number) => void;
}

// Výběr toho, který z obsahů se bude zobrazovat.
// Text nemá component, je moc jednoduchý

export const LessonContent: React.FC<ContentProps> = ({ step, onComplete, onNextStep, isLastStep, addPoints }) => {
    if (!step) return <div className="lp-empty-state">Select a step to begin</div>;

    const renderInnerContent = () => {
        switch(step.type) {
            case "board":
                return (
                    <div className="lp-board-layout">
                        <LessonBoard
                            data={step.content.fen}
                        />
                    </div>
                );
            case "question":
                return (
                    <QuestionContent
                        step={step}
                        onComplete={onComplete}
                        onNextStep={onNextStep}
                        isLastStep={isLastStep}
                        addPoints={addPoints}
                    />
                );
            case "text":
                return (
                    <div className="lp-text-content">
                        <h3>{step.title}</h3>
                        <p>{step.content.text || "No text content provided."}</p>
                    </div>
                )
        }
    };


    const nextButtonText = isLastStep
        ? "Finish Lesson"
        : "Next Step";

    return (
        <div className="lp-content-container">
            {renderInnerContent()}

            {(step.type === 'board' || step.type === 'text' || step.type === "question") && (
                <div className="lp-navigation-area">
                    <button className="lp-btn-next-step" onClick={onNextStep}>
                        {nextButtonText}
                    </button>
                </div>
            )}
        </div>
    );
};