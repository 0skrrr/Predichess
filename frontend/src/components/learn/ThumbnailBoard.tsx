
import { fenToBoard} from "../../support_scripts/FENConvert";
import {ChessPiece} from "../chess/ChessPiece";

interface ThumbnailBoardProps {
    fen: string;
}
// Zobrazení maličké šachovnice
export function ThumbnailBoard({ fen }: ThumbnailBoardProps) {
    const board = fenToBoard(fen);

    return (
        <div className="mini-board">
            {board.map((row, rowIdx) => (
                <div key={rowIdx} className="mini-board-row">
                    {row.map((piece, colIdx) => {
                        const isLight = (rowIdx + colIdx) % 2 === 0;
                        return (
                            <div
                                key={`${rowIdx}-${colIdx}`}
                                className="mini-board-square"
                                style={{
                                    background: isLight ? "rgba(245, 232, 216, 1)" : "rgba(28, 28, 28, 1)"
                                }}
                            >
                                {piece && <ChessPiece piece={piece} />}
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
}