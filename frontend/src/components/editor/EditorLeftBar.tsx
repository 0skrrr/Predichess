import {getTranslations} from "../../support_scripts/languages";
import {useLessonContext} from "../../support_scripts/lessonContext";
import {EditorLeftBarButton} from "./EditorLeftBarButton";

export function EditorLeftBar () {
    const {state, dispatch} = useLessonContext();
    const {currentLessonId, selectedTaskId} = state;




    // 4 Funkce pro přidání konkrétních elementů, ať už kroků nebo celých úkolů
    const canAddStep = () => {
        if (!currentLessonId) {
            alert("Please create or load a lesson first!");
            return false;
        }
        if (!selectedTaskId || selectedTaskId === "") {
            alert("Please create a task first!");
            return false;
        }
        return true;
    }

    const handleAddTask = () => {
        if (!currentLessonId) {
            alert("Please create or load a lesson first before adding tasks!");
            return;
        }
        dispatch({
            type:"ADD_TASK"
        })
    }
    const handleAddBoard = () => {
        if (!canAddStep()) {
            return;
        }
        dispatch({
            type:"ADD_STEP",
            taskId: selectedTaskId,
            stepType:"board"
        })
    };
    const handleAddQuestion = () => {
        if (!canAddStep()) {
            return;
        }
        dispatch({
            type:"ADD_STEP",
            taskId: selectedTaskId,
            stepType:"question"
        });
    };
    const handleAddText = () => {
        if (!canAddStep()) {
            return;
        }
        dispatch({
            type:"ADD_STEP",
            taskId: selectedTaskId,
            stepType:"text"
        });
    };

    const isLessonSelected = !!currentLessonId;
    const isTaskSelected = !!selectedTaskId && selectedTaskId !== "";

    //Render
    return (
        <div className="editor-left-bar">
            <div className="editor-left-bar-separator-one">
                <p className="editor-left-bar-header">{getTranslations().editor.leftBar.leftBarTitle}</p>
                <EditorLeftBarButton
                    text={getTranslations().editor.leftBar.leftBarTask}
                    onClick={handleAddTask}
                    disabled={!isLessonSelected}
                />
            </div>
            <div className ="editor-left-bar-separator-two">
                <EditorLeftBarButton
                    text={getTranslations().editor.leftBar.leftBarBoard}
                    onClick={handleAddBoard}
                    disabled={!isTaskSelected}
                />
                <EditorLeftBarButton
                    text={getTranslations().editor.leftBar.leftBarText}
                    onClick={handleAddText}
                    disabled={!isTaskSelected}
                />
                <EditorLeftBarButton
                    text={getTranslations().editor.leftBar.leftBarQuestion}
                    onClick={handleAddQuestion}
                    disabled={!isTaskSelected}
                />
            </div>
        </div>
    )
}