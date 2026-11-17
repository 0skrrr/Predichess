


import React from "react";
import ReactDOM from "react-dom/client";
import {App} from "./App";

// JS Co spustí react logiku
// Všechna vrácená html struktura se bude zobrazovat v "root"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
