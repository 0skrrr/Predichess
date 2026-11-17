import React from "react";
import type { Step, StepType} from "../../support_scripts/types";

interface SidebarProps {
    steps: Step[];
    activeStepId: string | null;
    onSelectStep: (id: string) => void;
}

// Získání ikony, ať jde poznat typ každého kroku
// Původně to dávalo více smysl, bylo více jak 3 typy

const getIconForType = (type: StepType) => {
    switch(type) {
        case "board": return "♟️";
        case "question": return "❓";
        case "text": return "📄";
        default: return "•";
    }
};

export const StepSidebar: React.FC<SidebarProps> = ({ steps, activeStepId, onSelectStep }) => {
    return (
        <aside className="lp-sidebar">
            <h3 className="lp-sidebar-title">Steps</h3>
            <div className="lp-step-list">
                {steps.map((step, index) => (
                    <button
                        key={step.id}
                        className={`lp-step-item ${step.id === activeStepId ? "active" : ""}`}
                        onClick={() => onSelectStep(step.id)}
                    >
                        <span className="lp-step-icon">{getIconForType(step.type)}</span>
                        <div className="lp-step-info">
                            <span className="lp-step-number">Step {index + 1}</span>
                            <span className="lp-step-name">{step.title}</span>
                        </div>
                    </button>
                ))}
            </div>
        </aside>
    );
};