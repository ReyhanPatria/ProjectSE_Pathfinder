import { Board } from "./board/board.js";
import { bfs } from "./algorithm/bfs.js";
import { dfs } from "./algorithm/dfs.js";

// Create board instance
Board.createInstance(Board.DEFAULT_WIDTH, Board.DEFAULT_HEIGHT);
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

let clearWallButton = document.getElementById("clearWallButton");
clearWallButton.onclick = function() {
    Board.getInstance().clearWall();
}

let clearPathButton = document.getElementById("clearPathButton");
clearPathButton.onclick = function() {
    Board.getInstance().clearPath();
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