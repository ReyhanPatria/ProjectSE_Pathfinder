export class Node {
    // Constructor
    constructor(x, y, cost) {
        this.x = x;
        this.y = y;
        this.cost = cost;
        this.id = "node";
        this.status = "unvisited";

        this.parent = null;
        this.g = Number.MAX_SAFE_INTEGER;
    }

    reset() {
        this.parent = null;
        this.g = Number.MAX_SAFE_INTEGER;
    }

    // Get the euclidean distance between 2 nodes
    getDistance(otherNode) {
        let xDistance = Math.pow(this.x - otherNode.x, 2);
        let yDistance = Math.pow(this.y - otherNode.y, 2);
        let distance = Math.pow(xDistance + yDistance, 0.5);

        return distance;
    }

    // Adds a parent attribute to node
    setParent(parentNode) {
        this.parent = parentNode;
    }

    // Render node to its corresponding cell on the table
    render() {
        // Get node element
        let nodeElement = document.getElementById(this.id);
       // Set node class as status
        nodeElement.className = this.status;
    }
}