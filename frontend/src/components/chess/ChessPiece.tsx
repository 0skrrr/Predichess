import type { ChessPiece as ChessPieceType } from "../../support_scripts/types";
import pawn from "../../assets/icons/pieces/Chess_pdt45.svg.png";
import bishop from "../../assets/icons/pieces/Chess_bdt45.svg.png";
import knight from "../../assets/icons/pieces/Chess_ndt45.svg.png";
import rook from "../../assets/icons/pieces/Chess_rdt45.svg.png";
import queen from "../../assets/icons/pieces/Chess_qdt45.svg.png";
import king from "../../assets/icons/pieces/Chess_klt45.svg.png";
import wpawn from "../../assets/icons/pieces/Chess_plt45.svg.png";
import wbishop from "../../assets/icons/pieces/Chess_blt45.svg.png";
import wknight from "../../assets/icons/pieces/Chess_nlt45.svg.png";
import wrook from "../../assets/icons/pieces/Chess_rlt45.svg.png";
import wqueen from "../../assets/icons/pieces/Chess_qlt45.svg.png";
import wking from "../../assets/icons/pieces/Chess_klt45.svg.png";

interface ChessPieceProps {
    piece: ChessPieceType;
}
// Výběr src obrázku
export function ChessPiece({ piece }: ChessPieceProps) {
    if (piece === null) {
        return <div className="chess-piece" />;
    }

    let figure: string = "";
    let isBlack = false;

    switch (piece) {
        case "p":
            figure = pawn;
            isBlack = true;
            break;
        case "P":
            figure = wpawn;
            break;
        case "b":
            figure = bishop;
            isBlack = true;
            break;
        case "B":
            figure = wbishop;
            break;
        case "n":
            figure = knight;
            isBlack = true;
            break;
        case "N":
            figure = wknight;
            break;
        case "k":
            figure = king;
            isBlack = true;
            break;
        case "K":
            figure = wking;
            break;
        case "r":
            figure = rook;
            isBlack = true;
            break;
        case "R":
            figure = wrook;
            break;
        case "q":
            figure = queen;
            isBlack = true;
            break;
        case "Q":
            figure = wqueen;
            break;
        default:
            return <div className="chess-piece" />;
    }

    return (
        <img
            className={`chess-piece ${isBlack ? 'black-piece' : 'white-piece'}`}
            src={figure}
            alt={piece}
        />
    );
}