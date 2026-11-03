import { Board } from "../../gameobjects/board.js";
import { TextButton } from "../../gameobjects/TextButton.js";
import { GameManager } from "../../core/GameManager.js";

export class TurnMode extends Phaser.Scene {
    constructor() {
        super('TurnMode');
        this.playerRow = 4;
        this.playerCol = 3;
        this.rows = 5;
        this.cols = 6;
        this.cursors = null;
        
        this.enemies = [
            { col: 0, row: 0, token: null },
            { col: 1, row: 1, token: null }
        ];
    }

    create() {
        //set board
        let wandererBoard = new Board(this, this.rows, this.cols, 90);
        wandererBoard.build();
        let seerBoard = new Board(this, this.rows, this.cols, 90, {boarddOffset: 180, colorDark: 0x053808, colorLight: 0x428c77, seer: true});
        seerBoard.build();
        seerBoard.setVisible(false);

        this.statusText = this.add.text(this.scale.width/2, 60, 'Status: Fog Covers the Board (Wanderer Turn)', {
            fontSize: '16px',
            color: '#f87d02',
            align: 'center'
        }).setOrigin(0.5,0.5);

        //other game pieces
        let [boardOffsetX, boardOffsetY] = wandererBoard.getOffset();
        this.tileSize = wandererBoard.getTileSize();

        this.playerToken = this.add.circle(
            boardOffsetX + this.playerCol * 90 + 45,
            boardOffsetY + this.playerRow * 90 + 45,
            25,
            0xda4343
        );
        this.playerToken.setVisible(false);

        this.monument = this.add.rectangle(
            boardOffsetX,
            boardOffsetY - 65,
            90*6 - 5, 65, 0xd2b48c // wooden block color
        ).setOrigin(0);
        this.add.text(this.monument.x + 90*1 + 45, this.monument.y + 25, 'MONUMENT (go here)', {
            fontSize: '24px',
            color: '#000000'
        });

        this.enemies.forEach((enemy) => {
            enemy.token = this.add.rectangle(
                enemy.col * this.tileSize + 25,
                enemy.row * this.tileSize + 25,
                40, 40, 0x272222
            ).setOrigin(0).setInteractive();

            // movement (click enemy to move it down/up columns
            //changing movement to drag and drop instead of click to move down/up columns
            this.input.setDraggable(enemy.token);
            enemy.token.on('drag', (pointer, dragX, dragY) => {
                // Calculate the new column and row based on drag position
                enemy.token.x = dragX;
                enemy.token.y = dragY;
            });

            //snap to grid on drag end
            enemy.token.on('dragend', () => {
                let newCol = Math.floor((enemy.token.x) / this.tileSize);
                let newRow = Math.floor((enemy.token.y) / this.tileSize);
                //make sure to keep enemy in the bounds of the board
                enemy.col = Phaser.Math.Clamp(newCol, 0, this.cols - 1);
                enemy.row = Phaser.Math.Clamp(newRow, 0, this.rows - 1);
                enemy.token.x = enemy.col * this.tileSize + 25;
                enemy.token.y = enemy.row * this.tileSize + 25;
            });

            seerBoard.add(enemy.token);
        });

        //make buttons
        let wandererSwitch = new TextButton(this, this.scale.width - 250, this.scale.height/2 - 32, "Wanderer", 'dark',
            () => {
                wandererBoard.setVisible(true);
                seerBoard.setVisible(false);
                this.playerToken.setVisible(false);
                GameManager.Instance.set('moves', 1);
                this.statusText.setText('Status: Wanderer\'s Turn');
            }
        );
        let seerSwitch = new TextButton(this, this.scale.width - 250, this.scale.height/2 + 32, "Seer", 'dark',
            () => {
                wandererBoard.setVisible(false);
                seerBoard.setVisible(true);
                this.playerToken.setVisible(true);
                GameManager.Instance.set('moves', 1);
                this.statusText.setText('Status: Seer\'s Turn');
            }, {width: 85});

        let instructionsBtn = new TextButton(this, 180, 100, '[ INSTRUCTIONS ]', 'dark',
            () => {this.showInstructions();},
        {
            fontSize: '18px',
            color: '#ffffff',
            backgroundColor: '#444444',
            height: 8,
        });

        //controls
        this.cursors = this.input.keyboard.createCursorKeys();

        //let controlMsg = this.add.text(this.scale.width/2 - 80, this.scale.height - 60, "Arrow Keys to move.", {align: 'center'});
    }

    update(time) {
        let left = Phaser.Input.Keyboard.JustDown(this.cursors.left);
        let right = Phaser.Input.Keyboard.JustDown(this.cursors.right);
        let up = Phaser.Input.Keyboard.JustDown(this.cursors.up);
        let down = Phaser.Input.Keyboard.JustDown(this.cursors.down);

        if(GameManager.Instance.get('moves') > 0) { //GameManager.Instance.get('moves') >= 1
            if(left) {
                if(this.playerCol > 0) {
                    this.playerCol--;
                    GameManager.Instance.set('moves', 0);
                    this.checkCollisions();
                }
            }
            if(right) {
                if(this.playerCol < this.cols-1) {
                    this.playerCol++;
                    GameManager.Instance.set('moves', 0);
                    this.checkCollisions();
                }
            }
            if(up) {
                if(this.playerRow > 0) {
                    this.playerRow--;
                    GameManager.Instance.set('moves', 0);
                    this.checkCollisions();
                }
            }
            if(down) {
                if(this.playerRow < this.rows-1) {
                    this.playerRow++;
                    GameManager.Instance.set('moves', 0);
                    this.checkCollisions();
                }
            }
        }
        this.playerToken.x = this.scale.width/3 - 60 + this.playerCol * 90 + 45;
        this.playerToken.y = this.scale.height/4 - 35 + this.playerRow * 90 + 45;
    }

    //Instructions for the game
    showInstructions() {
    // Dark popup background
        let popup = this.add.rectangle(
            640, 360, 750, 700, 0x222222
        ).setStrokeStyle(3, 0xffffff)
        .setInteractive();

        // Instructions text
        let instructions = this.add.text(320, 70,
            `PROTOTYPE INSTRUCTIONS

    PLAYER 1: SEER
    - View the board and control enemy pieces.
    - Answer 3 yes/no questions truthfully.
    - Goal: Catch the Wanderer.

    PLAYER 2: WANDERER
    - Use the reference card to track the board.
    - Ask 3 yes/no questions each turn.
    - Goal: Reach the monument without being caught.

    MOVEMENT RULES
    General:
    - Each player moves once per turn.
    - Move one tile up, down, left, or right.
    - No diagonal movement.
    
    Wanderer: Click on tiles to place markers on the board
    Arrow Keys to "move".
    - X = enemy, P = player
    Seer:
    - Click and drag squares to place them. (no diagonals!)
    `,
            {
                fontSize: '18px',
                color: '#ffffff',
                lineSpacing: 8
            }
        );

        // Close button
        let closeBtn = this.add.text(960, 30, '[ X ]', {
            fontSize: '22px',
            color: '#ff5555',
            backgroundColor: '#444444'
        }).setInteractive();

        closeBtn.on('pointerdown', () => {
            popup.destroy();
            instructions.destroy();
            closeBtn.destroy();
        });
    }

    checkCollisions() {
        if (this.isRolling) return;

        let collision = this.enemies.some((enemy) => enemy.col === this.playerCol && enemy.row === this.playerRow);

        if (collision) {
            let diceRoll = Phaser.Math.Between(1, 6);

            this.statusText.setText(`Status: You have fainted! You rolled a ${diceRoll}`);
            this.movePlayerRandomly(diceRoll);
        }
    }
    //more to the dice roll
    movePlayerRandomly(steps) {
        this.isRolling = true;
        const directions = [
            { col: 0, row: -1 }, // up
            { col: 0, row: 1 },  // down
            { col: -1, row: 0 }, // left
            { col: 1, row: 0 }  // right
        ];
        let moves = 0;
        this.time.addEvent({
            delay: 300,
            repeat: steps - 1,
            
            callback: () => {
                let validMoves = directions.filter(direction => {
                    let newCol = this.playerCol + direction.col;
                    let newRow = this.playerRow + direction.row;
                    return newCol >= 0 && newCol < this.cols && newRow >= 0 && newRow < this.rows;
                });

                if (validMoves.length === 0) {
                    return;
                }
                let direction = Phaser.Utils.Array.GetRandom(validMoves);
                
                this.playerCol += direction.col;
                this.playerRow += direction.row;
                
                this.playerToken.x = this.playerCol * this.tileSize + this.tileSize / 2;
                this.playerToken.y = this.playerRow * this.tileSize + this.tileSize / 2;
                moves++;

                if (moves >= steps) {
                    this.isRolling = false;
                    //check on landing on other enemy
                    this.checkCollisions();
                }
            }
        });
    }
}