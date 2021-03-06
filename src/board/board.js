import { Node } from "./node.js";

export class Board {
    // Constant variables of board states
    static DEFAULT_STATE = 101;
    static ANIMATING_STATE = 102;
    static POST_ANIMATING_STATE = 103;

    // Constant variable of default values
    static DEFAULT_WIDTH = 50;
    static DEFAULT_HEIGHT = 25;
    static DEFAULT_START = {x: 13, y: 12};
    static DEFAULT_END = {x: 36, y: 12};

    // Instance of board
    static instance = null;

    // Create a new board instance
    static createInstance(width, height) {
        this.instance = new Board(width, height);
    }

    // Get board instance
    static getInstance() {
        // Check if instance exist
        if(this.instance == null) {
            // If not exist throw ReferenceError
            throw new ReferenceError("No board instance exist");
        }
        // If exist return board instace
        return this.instance;
    }

    // Delete board isntance
    static deleteInstance() {
        this.instance = null;
    }





    // Constructor
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.initializeArray();
        this.createGrid();
        this.addMouseDownHandler();

        this.currentState = Board.DEFAULT_STATE;

        this.setStartNodeLocation(Board.DEFAULT_START.x, Board.DEFAULT_START.y);
        this.setEndNodeLocation(Board.DEFAULT_END.x, Board.DEFAULT_END.y);
        this.mouseDown = false;
        this.selectedNode = null;
    }

    // Function to set board's state
    setState(state) {
        this.currentState = state;
    }

    // Function to get board's state
    getState() {
        return this.currentState;
    }

    // Function to reset board
    reset() {
        let width = this.width;
        let height = this.height;
        let startNode = this.startNode;
        let endNode = this.endNode;
        
        Board.createInstance(width, height);
        Board.getInstance().render();
    }

    // Function to clear path on board
    clearPath() {
        // Check board state, if state is not post animating state then return
        if(this.getState() != Board.POST_ANIMATING_STATE) {
            return;
        }

        // Loop through all nodes
        for(let i = 0; i < this.height; i++) {
            for(let j = 0; j < this.width; j++) {
                let nodeObject = this.array[i][j];
                // Reset node's parent
                nodeObject.reset();

                // Change all visited and path nodes to unvisited
                if(nodeObject.status == "visited" || nodeObject.status == "pathNode") {
                    nodeObject.status = "unvisited";
                    nodeObject.render();
                }
            }
        }

        // Change board state to default state
        this.setState(Board.DEFAULT_STATE);
    }

    // Function to clear walls on board
    clearWall() {
        // Check board state, if state is animating state then return
        if(this.getState() == Board.ANIMATING_STATE) {
            return;
        }

        // Loop through all nodes
        for(let i = 0; i < this.height; i++) {
            for(let j = 0; j < this.width; j++) {
                let nodeObject = this.array[i][j];
                // Reset node's parent
                nodeObject.reset();
                

                // Change all nodes except for start and end node to unvisited node
                if(nodeObject.status != "startNode" && nodeObject.status != "endNode") {
                    nodeObject.status = "unvisited";
                    nodeObject.render();
                }
            }
        }

        // Change board state to default state
        this.setState(Board.DEFAULT_STATE);
    }

    // Set starting node location
    setStartNodeLocation(x, y) {
        // Set node at x and y to be the start node
        this.startNode = this.array[y][x];
        this.array[y][x].status = "startNode";
    }

    // Set ending node location
    setEndNodeLocation(x, y) {
        // Set node at x and y to be the end node
        this.endNode = this.array[y][x];
        this.array[y][x].status = "endNode";
    }

    // Initialize board array
    initializeArray() {
        // Create a 2D array of Node objects
        this.array = new Array(this.height);
        for(let i = 0; i < this.height; i++) {
            this.array[i] = new Array(this.width);

            for(let j = 0; j < this.width; j++) {
                this.array[i][j] = new Node(j, i, 1);
            }
        }
    }

    // Create table to represent the board on the page
    createGrid() {
        // HTML to put inside table tag on the page
        let tableHTML = "";

        for(let y = 0; y < this.height; y++) {
            // HTML for each table row
            let rowHTML = `<tr>`;

            for(let x = 0; x < this.width; x++) {
                // ID for each cell to associate it with its node
                this.array[y][x].id += `-${x}-${y}`;

                // HTML for each cell on the page
                let cellHTML = `<td id="${this.array[y][x].id }"></td>`;

                // Adds it onto the row
                rowHTML += cellHTML;
            }

            // Closing row tag
            rowHTML += `</tr>`;
            // Adds row HTML into table HTML
            tableHTML += rowHTML;
        }

        // Puts the table HTML into the table tag
        let table = document.getElementById("board");
        table.innerHTML = tableHTML;
    }

    // Run path finding algorithm algorithm
    findPath(algorithmCallback) {
        this.visitedNodes = algorithmCallback(this);
        return this.visitedNodes;
    }

    // Create path from endNode to startNode
    createPath() {
        let path = [];
        let currentNode = this.endNode;

        // Recursively iterate through the parents of each node from end node
        while(currentNode != null) {
            // Adds the current node to path list
            path.push(currentNode);

            // Set the nodes status as a path node
            if(currentNode.status != "startNode" &&
                currentNode.status != "endNode") {
                currentNode.status = "pathNode";
            }

            currentNode = currentNode.parent;
        }
        
        this.pathNodes = path;
        return this.pathNodes;
    }

    // Function to start path finding and then animate it
    animatePathFinding(algorithmCallback) {
        // Set board's state to animating state
        this.setState(Board.ANIMATING_STATE);

        // Run path finding algorithm
        // Gets a list of visited nodes to animate
        let nodesToAnimate = this.findPath(algorithmCallback);

        // Boolean to determine path is found
        let pathFound = true;

        // Loop for animating visited nodes
        let animationLoop = setInterval(function() {
            // Render current node in node list
            let currentNode = nodesToAnimate.shift();
            currentNode.render();

            // Check if all visited nodes have been rendered
            if(nodesToAnimate.length <= 0) {
                // Clear animation loop
                clearInterval(animationLoop);

                // Run algorithm to create path
                // Gets a list of path nodes to animate
                nodesToAnimate = Board.getInstance().createPath();

                // Show alert when no path is found
                if(nodesToAnimate.length <= 1) {
                    pathFound = false;
                    window.alert("Path is not found");
                }

                // Loop for animation path nodes
                animationLoop = setInterval(function() {
                    // Render current node in node list
                    let currentNode = nodesToAnimate.shift();
                    currentNode.render();

                    // Check if all path nodes have been rendered
                    if(nodesToAnimate.length <= 0) {
                        // Clear animation loop
                        clearInterval(animationLoop);

                        // Set board state to post animation state
                        Board.getInstance().setState(Board.POST_ANIMATING_STATE);

                        if(pathFound == true) {
                            window.alert("Path is found!");
                        }
                    }
                }, 5);
            }
        }, 5);
    }

    // Draw nodes onto the table
    render() {
        for(let y = 0; y < this.height; y++) {
            for(let x = 0; x < this.width; x++) {
                this.array[y][x].render();
            }
        }
    }

    // Add mouse down handlers
    addMouseDownHandler() {
        for(let y = 0; y < this.height; y++) {
            for(let x = 0; x < this.width; x++) {
                let nodeObject = this.array[y][x];
                let nodeElement = document.getElementById(nodeObject.id);

                // Define function to run on mouse down on node
                nodeElement.onmousedown = function(e) {
                    // Prevent default action of event
                    e.preventDefault();

                    // Check state of board, if state is not default then return
                    if(Board.getInstance().getState() != Board.DEFAULT_STATE) {
                        return;
                    }

                    Board.getInstance().mouseDown = true;
                    Board.getInstance().selectedNode = nodeObject;

                    // Check if node isn't a start node and an end node
                    // If true then turn the node into a wall node or unvisited node
                    if(nodeObject.status != "startNode" && nodeObject.status != "endNode") {
                        // Flip between wall or unvisited node
                        nodeObject.status = (nodeObject.status == "wall") ? "unvisited" : "wall";
                        nodeObject.render();
                    }
                }

                // Define function to run on mouse enter node
                nodeElement.onmouseenter = function(e) {
                    // Prevent default action of event
                    e.preventDefault();

                    // Check state of board, if state is not default then return
                    if(Board.getInstance().getState() != Board.DEFAULT_STATE) {
                        return;
                    }

                    // Check if mouse button is down and there is a selected node
                    if(Board.getInstance().mouseDown == true && Board.getInstance().selectedNode != null) {
                        // Check selected node status
                        switch(Board.getInstance().selectedNode.status) {
                            case "startNode":
                                if(nodeObject.status != "startNode" && nodeObject.status != "endNode" ) {
                                    // Set current node as starting node
                                    Board.getInstance().setStartNodeLocation(nodeObject.x, nodeObject.y);
                                    nodeObject.render();

                                    // Set previously starting node to unvisited node
                                    Board.getInstance().selectedNode.status = "unvisited";
                                    Board.getInstance().selectedNode.render();

                                    // Changed selected node to current node
                                    Board.getInstance().selectedNode = nodeObject;
                                }
                                break;

                            case "endNode":
                                if(nodeObject.status != "startNode" && nodeObject.status != "endNode" ) {
                                    // Set current node as ending node
                                    Board.getInstance().setEndNodeLocation(nodeObject.x, nodeObject.y);
                                    nodeObject.render();
                                
                                    // Set previously ending node to unvisited node
                                    Board.getInstance().selectedNode.status = "unvisited";
                                    Board.getInstance().selectedNode.render();

                                    // Changed selected node to current node
                                    Board.getInstance().selectedNode = nodeObject;
                                }
                                break;

                            default:
                                if(nodeObject.status != "startNode" && nodeObject.status != "endNode") {
                                    // Flip between wall or unvisited node
                                    nodeObject.status = (nodeObject.status == "wall") ? "unvisited" : "wall";
                                    nodeObject.render();
                                }
                                break;
                        }
                    }
                }

                // Define function to run on mouse up
                nodeElement.onmouseup = function(e) {
                    // Prevent default action of event
                    e.preventDefault();

                    // Check state of board, if state is not default then return
                    if(Board.getInstance().getState() != Board.DEFAULT_STATE) {
                        return;
                    }

                    // Set mout button boolean to false
                    Board.getInstance().mouseDown = false;
                }
            }
        }
    }
}