import { Board } from "./board/board.js";
import { bfs } from "./algorithm/bfs.js";
import { dfs } from "./algorithm/dfs.js";

// Define board properties
let width = 50;
let height = 25;
let defaultEnd = {x: 4, y: 12};
let defaultStart = {x: 45, y: 12};

// Create board instance
Board.createInstance(width, height);
// Set starting node location
Board.getInstance().setStartNodeLocation(defaultStart.x, defaultStart.y);
// Set ending node location
Board.getInstance().setEndNodeLocation(defaultEnd.x, defaultEnd.y);
// Render board onto the page
Board.getInstance().render();

let algorithm = null;

let startButton = document.getElementById("startButton");
startButton.onclick = function() {
    if(Board.getInstance().getState() == Board.DEFAULT_STATE) {
        if(algorithm != null) {
            Board.getInstance().animatePathFinding(algorithm);
        }
        else {
            window.alert("Pick an algorithm first!");
        }
    }
}

let resetButton = document.getElementById("resetButton");
resetButton.onclick = function() {
    if(Board.getInstance().getState() != Board.ANIMATING_STATE) {
        Board.getInstance().reset();
    }
}

let algorithmComboBox = document.getElementById("algorithmOption");
algorithmComboBox.onchange = function() {
    let value = algorithmComboBox.value;
    switch(value) {
        case "bfs":
            algorithm = bfs;
            break;

        case "dfs":
            algorithm = dfs;
            break;
        
        default:
            algorithm = bfs;
            break;
    }
}