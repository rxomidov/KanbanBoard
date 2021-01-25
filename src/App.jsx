import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import KanbanBoard from "./components/KanbanBoard";

function App() {
    return (
        <div className="App">
            <h1>Kanban board</h1>
            <KanbanBoard/>
        </div>
    );
}

export default App;
