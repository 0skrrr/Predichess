
import { useBoardEditor } from "./BoardEditorContext";
import { useState, useEffect } from "react";

const PIECE_SYMBOLS: Record<string, string> = {
    "p": "♟", "n": "♞", "b": "♝", "r": "♜", "q": "♛", "k": "♚",
    "P": "♙", "N": "♘", "B": "♗", "R": "♖", "Q": "♕", "K": "♔",
};

interface EditorProps {
    content: Record<string, any>;
    onUpdate: (updates: Record<string, any>) => void;
}

export function BoardEditor({ content, onUpdate }: EditorProps) {
    const { selectedPiece, setSelectedPiece, editorMode, setEditorMode } = useBoardEditor();
    const [fenInput, setFenInput] = useState(
        content.fen || "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
    );

    useEffect(() => {
        setFenInput(content.fen || "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    }, [content.fen]);

    const handleManualUpdate = () => {
        onUpdate({ fen: fenInput });
    };

    const handleSetStartPosition = () => {
        const startFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
        setFenInput(startFen);
        onUpdate({ fen: startFen });
    };

    const handleClearBoard = () => {
        const emptyFen = "8/8/8/8/8/8/8/8 w KQkq - 0 1";
        setFenInput(emptyFen);
        onUpdate({ fen: emptyFen });
    };

    return (
        <div className="board-editor">
            <h4>Board Editor</h4>

            <div className="piece-selector">
                <div className="piece-selector-title">Select Piece to Place:</div>
                <div className="piece-selector-grid">
                    <div className="piece-group">
                        <span className="group-label">White:</span>
                        {(["P", "N", "B", "R", "Q", "K"] as const).map(piece => (
                            <button
                                key={piece}
                                className={`piece-btn ${selectedPiece === piece ? "selected" : ""}`}
                                onClick={() => {
                                    setSelectedPiece(piece);
                                    setEditorMode("place");
                                }}
                            >
                                {PIECE_SYMBOLS[piece]}
                            </button>
                        ))}
                    </div>

                    <div className="piece-group">
                        <span className="group-label">Black:</span>
                        {(["p", "n", "b", "r", "q", "k"] as const).map(piece => (
                            <button
                                key={piece}
                                className={`piece-btn ${selectedPiece === piece ? "selected" : ""}`}
                                onClick={() => {
                                    setSelectedPiece(piece);
                                    setEditorMode("place");
                                }}
                            >
                                {PIECE_SYMBOLS[piece]}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mode-controls">
                    <button
                        className={`mode-btn ${editorMode === "clear" ? "active" : ""}`}
                        onClick={() => {
                            setEditorMode("clear");
                            setSelectedPiece(null);
                        }}
                    >
                        Clear Mode
                    </button>
                </div>
            </div>

            <div className="editor-instruction">
                <p>
                    {editorMode === "place" && selectedPiece
                        ? `Click on the board above to place ${PIECE_SYMBOLS[selectedPiece]}`
                        : editorMode === "clear"
                            ? "Click on the board above to remove pieces"
                            : "Select a piece to start editing"
                    }
                </p>
            </div>

            <div className="board-actions">
                <button onClick={handleSetStartPosition} className="action-btn">
                    Starting Position
                </button>
                <button onClick={handleClearBoard} className="action-btn danger">
                    Clear Board
                </button>
            </div>

            <div className="form-group">
                <label>Manual FEN Input</label>
                <textarea
                    value={fenInput}
                    onChange={(e) => setFenInput(e.target.value)}
                    placeholder="Enter FEN notation"
                    rows={2}
                />
                <button onClick={handleManualUpdate} className="btn-update">
                    Apply Manual FEN
                </button>
            </div>
        </div>
    );
}