import { fenToBoard } from "../../support_scripts/FENConvert";
import { ChessPiece} from "../chess/ChessPiece";
// import type { ChessPiece as PieceType} from "../../support_scripts/types";

interface LessonBoardProps {
    data: string;
}
// Šachovnice pro otevřenou lekci
export function LessonBoard({ data}: LessonBoardProps) {
    const board = fenToBoard(data);

    /*
    const handleSquareClick = (row: number, col: number, piece: PieceType) => {

        console.log(`Square clicked: [${row}, ${col}]. Piece: ${piece}`);
    };
    */

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
                                    ... {}
                                }}
                                /*onClick={() => handleSquareClick(rowIdx, colIdx, piece)}*/
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