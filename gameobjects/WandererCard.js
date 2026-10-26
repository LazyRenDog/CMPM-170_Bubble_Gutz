export class WandererCard {
    constructor(scene, x, y, cols, rows, cellSize){
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.cols = cols;
        this.rows = rows;
        this.cellSize = cellSize;

        this.cardGrid =  scene.add.grid( //using phaser's built-in grid func as a base
            x, y, //x/y pos of grid
            cols * cellSize, //width of grid
            rows * cellSize, //height of grid
            cellSize, cellSize, //cellWidth/Height
            0xffffff, //fill color (white)
            1, //fill alpha 
            0x000000, //outline color
            1 //outline alpha
        ).setInteractive(); 
    }

    //couple of simple helper functions to convert from world coords -> row/col & vice versa
    coordsToGrid(coordX, coordY){
        const col = Math.floor((coordX - this.x) / this.cellSize);
        const row = Math.floor((coordY - this.y) / this.cellSize);
        if (col < 0 || col >= this.cols || row < 0 || row >= this.rows){
            return null; //out of bounds
        }
        return {col, row};
    }

    gridToCoords(col, row){
        const x = this.x + col * this.cellSize + this.cellSize / 2;
        const y = this.y + row * this.cellSize + this.cellSize / 2;
        return {x, y};
    }
}