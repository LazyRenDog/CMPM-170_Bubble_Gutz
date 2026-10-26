import { WandererCard } from "../gameobjects/WandererCard.js";

class WandererCardScene extends Phaser.Scene {
    constructor() {
        super("WandererCardScene");

        //--- vars for WandererCard setup ---
        this.x = 0; //x/y coord locs
        this.y = 0;
        this.rows = 4; //i forgot how many we have
        this.cols = 3; //forgor how many (guessing)
        this.cellSize = 50; //guesstimating on good size
    }
    
    preload() {

    }

    create() {
        this.wandererCard = new WandererCard(this, this.x, this.y, this.cols, this.rows, this.cellSize);
        
    }
}