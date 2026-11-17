import { useLessonContext } from "../../support_scripts/lessonContext";
import type { StepType } from "../../support_scripts/types";
import { BoardEditor } from "./BoardEditor";
import{QuestionEditor} from "./QuestionEditor";
import{TextEditor} from "./TextEditor";



export function EditorRightMenu() {
    const { state, dispatch } = useLessonContext();
    const selectedStep = state.steps.find(s => s.id === state.selectedStepId);

    if (!selectedStep) {
        return (
            <div className="editor-right-menu">
                <div className="no-step-selected">
                    <p>Select a step</p>
                </div>
            </div>
        );
    }


    // Obecná funkce pro změnu titulku kroku
    const handleTitleChange = (newTitle: string) => {
        dispatch({
            type: "UPDATE_STEP",
            stepId: selectedStep.id,
            updates: { title: newTitle }
        });
    };

    // Obecná funkce pro změnu typu kroku
    const handleTypeChange = (newType: StepType) => {
        dispatch({
            type: "UPDATE_STEP",
            stepId: selectedStep.id,
            updates: { type: newType }
        });
    };

    // Funkce pro aktualizaci kroku
    const handleContentUpdate = (updates: Record<string, any>) => {
        dispatch({
            type: "UPDATE_STEP",
            stepId: selectedStep.id,
            updates: { content: { ...selectedStep.content, ...updates } }
        });
    };

    return (
        <div className="editor-right-menu">
            <div className="right-menu-header">
                <h3>Edit Step</h3>
                <span className="step-type-badge">
                    {selectedStep.type}
                </span>
            </div>

            <div className="form-group">
                <label>Step Title</label>
                <input
                    type="text"
                    value={selectedStep.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Title"
                />
            </div>

            <div className="form-group">
                <label>Step Type</label>
                <select
                    value={selectedStep.type}
                    onChange={(e) => handleTypeChange(e.target.value as StepType)}
                >
                    <option value="board">Board</option>
                    <option value="text">Text</option>
                    <option value="question">Question</option>
                </select>
            </div>

            <hr />

            {
                // Podmíněný render
            }
            {selectedStep.type === "board" && (
                <BoardEditor
                    content={selectedStep.content}
                    onUpdate={handleContentUpdate}
                />
            )}

            {selectedStep.type === "text" && (
                <TextEditor
                    content={selectedStep.content}
                    onUpdate={handleContentUpdate}
                />
            )}

            {selectedStep.type === "question" && (
                <QuestionEditor
                    content={selectedStep.content}
                    onUpdate={handleContentUpdate}
                />
            )}
        </div>
    );
}