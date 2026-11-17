import { useLessonContext } from "../../support_scripts/lessonContext";
import {Board} from "./Board";
import {useState} from "react";
import React from "react";




export function EditorMainScreen () {
    const {state,dispatch} = useLessonContext();
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

    const selectedStep = state.steps.find(s => s.id === state.selectedStepId)


    // Volání akcí na stav podle kliknutí na kroky
    const handleSelectStep = (stepId: string) => {
        dispatch({
            type: "SELECT_STEP",
            stepId
        })
    }
    const handleDeleteStep = (stepId: string) => {
        dispatch({
            type: "DELETE_STEP", stepId
        })
    }
    const handleSelectTask = (taskId: string) => {
        dispatch({
            type: "SELECT_TASK",taskId
        })
    }

    // Funkce zajišťující možnost přejmenování úkolu po kliknutí na něj
    const handleRenameTask = (e: React.FormEvent<HTMLFormElement> | React.FocusEvent<HTMLInputElement>, taskId: string) => {
        if ("preventDefault" in e) {
            e.preventDefault();
        }
        const form = ("currentTarget" in e && e.currentTarget instanceof HTMLFormElement)
            ? e.currentTarget

            : (e.target as HTMLInputElement).form;

        if (!form) {
            setEditingTaskId(null);
            return;
        }

        const input = form.elements.namedItem("taskTitle") as HTMLInputElement;
        const newTitle = input.value.trim();
        const currentTaskTitle = state.tasks.find(t => t.id === taskId)?.title;

        if (newTitle && newTitle !== currentTaskTitle) {
            dispatch({
                type: "UPDATE_TASK",
                taskId: taskId,
                updates: { title: newTitle }
            });
        }
        setEditingTaskId(null);
    };

    // Render
    return (
        <div className="editor-main-screen">
            <div className="editor-step-view">
                {selectedStep ? (
                    <div className="step-view-content">


                        <div className="step-content-preview">
                            {selectedStep.type === "board" && (
                                <Board data={selectedStep.content.fen || "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"} />
                            )}
                            {selectedStep.type === "text" && (
                                <div className="text-preview">
                                    {selectedStep.content.text || "No text yet"}
                                </div>
                            )}
                            {selectedStep.type === "question" && (
                                <div className="question-preview">
                                    <p>Correct Answer: {selectedStep.content.correctAnswer || "Not set"}</p>
                                </div>
                            )}
                        </div>


                    </div>
                ) : (
                    <div className="no-step-selected">
                        <p>Select a step to edit</p>
                    </div>
                )}
            </div>

            <div className="editor-steps-list">
                <div className="steps-horizontal-container">
                    {state.tasks.map(task => {
                        const taskSteps = state.steps.filter(s => s.taskId === task.id);

                        return (
                            <div key={task.id} className="task-group">
                                <button
                                    className={`task-divider ${task.id === state.selectedTaskId ? "selected-task" : ""}`}
                                    onClick={() => handleSelectTask(task.id)}
                                    onDoubleClick={() => setEditingTaskId(task.id)}
                                >
                                    {editingTaskId === task.id ? (
                                        <form
                                            onSubmit={(e) => handleRenameTask(e, task.id)}
                                        >
                                            <input
                                                type="text"
                                                name="taskTitle"
                                                defaultValue={task.title}
                                                onBlur={(e) => handleRenameTask(e, task.id)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Escape") {
                                                        setEditingTaskId(null);
                                                    }
                                                }}
                                                autoFocus
                                            />
                                        </form>
                                    ) : (
                                        <h4>{task.title}</h4>
                                    )}
                                </button>

                                <div className="task-steps-horizontal">
                                    {taskSteps.map((step, index) => (
                                        <div
                                            key={step.id}
                                            className={`step-card ${step.id === state.selectedStepId ? "selected" : ""}`}
                                            onClick={() => handleSelectStep(step.id)}
                                        >
                                            <div className="step-number">{index + 1}</div>
                                            <div className="step-info">
                                                <p className="step-title">{step.title}</p>
                                                <p className="step-type-badge">{step.type}</p>
                                            </div>
                                            <button
                                                className="step-delete-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteStep(step.id);
                                                }}
                                            >
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}