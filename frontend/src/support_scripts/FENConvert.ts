import type {ChessPiece as PieceType} from "./types";


// Funkce pro převedení FEN anotace na dvojrozměrné pole

export function fenToBoard(fen: string): PieceType[][] {
    const fenBoard = fen.split(" ")[0];
    const rows = fenBoard.split("/");

    const board: PieceType[][] = [];

    for (const row of rows) {
        const boardRow: PieceType[] = [];
        for (const char of row) {
            if (isNaN(parseInt(char))) {
                boardRow.push(char as PieceType);
            } else {
                const emptySquares = parseInt(char);
                for (let i = 0; i < emptySquares; i++) {
                    boardRow.push(null);
                }
            }
        }
        board.push(boardRow);
    }

    return board;
}



// Opačná funkce, pole na FEN
export function boardToFen(board: PieceType[][]): string {
    const fenRows: string[] = [];

    for (const row of board) {
        let fenRow = "";
        let emptyCount = 0;

        for (const piece of row) {
            if (piece === null) {
                emptyCount++;
            } else {
                if (emptyCount > 0) {
                    fenRow += emptyCount.toString();
                    emptyCount = 0;
                }
                fenRow += piece;
            }
        }

        if (emptyCount > 0) {
            fenRow += emptyCount.toString();
        }

        fenRows.push(fenRow);
    }

    return fenRows.join("/") + " w KQkq - 0 1";
}