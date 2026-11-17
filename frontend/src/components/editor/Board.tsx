import { useBoardEditor} from "./BoardEditorContext";
import { useLessonContext } from "../../support_scripts/lessonContext";
import { fenToBoard, boardToFen } from "../../support_scripts/FENConvert";
import { ChessPiece } from "../chess/ChessPiece";

interface BoardProps {
    data: string;
}

export function Board({ data }: BoardProps) {
    const { selectedPiece, editorMode } = useBoardEditor();
    const { state, dispatch } = useLessonContext();
    const board = fenToBoard(data);

    
    // Zas... self explanatory. Prostě když klikne hráč co bude dál
    const handleSquareClick = (row: number, col: number) => {
        const selectedStep = state.steps.find(s => s.id === state.selectedStepId);
        if (!selectedStep) return;

        const newBoard = board.map(r => [...r]);

        if (editorMode === "clear") {
            newBoard[row][col] = null;
        } else if (selectedPiece) {
            newBoard[row][col] = selectedPiece;
        } else {
            return;
        }

        const newFen = boardToFen(newBoard);
        dispatch({
            type: "UPDATE_STEP",
            stepId: selectedStep.id,
            updates: {
                content: {
                    ...selectedStep.content,
                    fen: newFen
                }
            }
        });
    };

    //Render každého čtverečku
    return (
        <div className="chess-board">
            {board.map((row, rowIdx) => (
                <div key={rowIdx} className="board-row">
                    {row.map((piece, colIdx) => {
                        const isLight = (rowIdx + colIdx) % 2 === 0;
                        return (
                            <div
                                key={`${rowIdx}-${colIdx}`}
                                className="chess-board-tile"
                                style={{
                                    background: isLight ? "rgba(245, 232, 216, 1)" : "rgba(28, 28, 28, 1)",
                                    cursor: selectedPiece || editorMode === "clear" ? "pointer" : "default"
                                }}
                                onClick={() => handleSquareClick(rowIdx, colIdx)}
                            >
                                <ChessPiece piece={piece} />
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
}