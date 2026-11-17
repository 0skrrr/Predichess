import { createContext, useContext, useState} from "react";
import type{ReactNode} from "react";



type PieceType = "p" | "n" | "b" | "r" | "q" | "k" | "P" | "N" | "B" | "R" | "Q" | "K" | null;

interface BoardEditorContextType {
    selectedPiece: PieceType;
    setSelectedPiece: (piece: PieceType) => void;
    editorMode: "place" | "clear";
    setEditorMode: (mode: "place" | "clear") => void;
}

// Kontext pracující s daty Šachovnice v editoru
const BoardEditorContext = createContext<BoardEditorContextType | undefined>(undefined);

export function BoardEditorProvider({ children }: { children: ReactNode }) {
    const [selectedPiece, setSelectedPiece] = useState<PieceType>(null);
    const [editorMode, setEditorMode] = useState<"place" | "clear">("place");

    return (
        <BoardEditorContext.Provider value={{
            selectedPiece,
            setSelectedPiece,
            editorMode,
            setEditorMode
        }}>
            {children}
        </BoardEditorContext.Provider>
    );
}

export function useBoardEditor() {
    const context = useContext(BoardEditorContext);
    if (!context) {
        throw new Error("useBoardEditor must be used within BoardEditorProvider");
    }
    return context;
}