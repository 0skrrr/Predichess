import { useReducer } from "react";
import { EditorTopbar } from "./EditorTopbar";
import { EditorLeftBar } from "./EditorLeftBar";
import { EditorMainScreen } from "./EditorMainScreen";
import { EditorRightMenu } from "./EditorRightMenu";
import { LessonContext } from "../../support_scripts/lessonContext";
import { lessonOperations, intialState } from "../../support_scripts/lessonEditingLogic";
import { BoardEditorProvider} from "./BoardEditorContext";

export function EditorLayout() {
    // Render s prázdným obsahem, vytvoření kontextu lekce
    // Plus render komponentu BoardEditorProvider
    const [state, dispatch] = useReducer(lessonOperations, intialState);


    return (
        <LessonContext.Provider value={{ state, dispatch }}>
            <BoardEditorProvider>
                <div className="editor-div">
                    <EditorTopbar />
                    <div className="editor-lower-div">
                        <EditorLeftBar />
                        <EditorMainScreen />
                        <EditorRightMenu />
                    </div>
                </div>
            </BoardEditorProvider>
        </LessonContext.Provider>
    );
}