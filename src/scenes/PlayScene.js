export class PlayScene extends Phaser.Scene {
    constructor() {
        super('PlayScene');
        this.rows = 4;
        this.cols = 3;
        this.tileSize = 90;
        this.boardOffsetX = 180;
        this.boardOffsetY = 180;
        this.refOffsetX = 820; // right side of the screen

        // label parameters
        this.labelRowOffsetX = this.boardOffsetX - 60
        this.labelRowOffsetY = this.boardOffsetY + 29 // half of tilesize - fontsize

        this.labelColOffsetX = this.labelRowOffsetX + 89
        this.labelColOffSetY = this.labelRowOffsetY + this.tileSize * 4  - 20// multiply by amount of rows
        
        this.refLabelOffsetX = this.refOffsetX - 60 // right side row labels
        this.refColLabelOffsetX = this.refLabelOffsetX + 89

        // player grid position (bottom middle)
        this.playerCol = 1;
        this.playerRow = 3;

        //checking for diceroll
        this.isRolling = false;

        // enemies controlled by seer currently
        this.enemies = [
            { col: 0, row: 0, token: null },
            { col: 1, row: 1, token: null }
        ];
    }

    preload() {

    }

    create() {
        // Split screen divider line
        this.add.line(0, 0, 640, 0, 640, 720, 0xffffff).setOrigin(0, 0);

        // Labels for each side of the split screen
        this.add.text(20, 20, 'SEER (DM Currently)', {
            fontSize: '24px',
            color: '#ffffff'
        });

        this.add.text(660, 20, 'WANDERER REF CARD (Click to mark)', {
            fontSize: '24px',
            color: '#ffffff'
        });

        // status message for seer phrases
        this.statusText = this.add.text(660, 60, 'Status: Fog Covers the Board (Wanderer Turn)', {
            fontSize: '16px',
            color: '#f87d02'
        });

        // Labels for left board
        // row labels
        this.leftRowA = this.add.text(this.labelRowOffsetX, this.labelRowOffsetY, 'A', {
            fontSize: '32px',
            color: '#ffffff'
        });
        this.leftRowB = this.add.text(this.labelRowOffsetX, this.labelRowOffsetY + this.tileSize, 'B', { fontSize: '32px'});
        this.leftRowC = this.add.text(this.labelRowOffsetX, this.labelRowOffsetY + this.tileSize*2, 'C', {fontSize: '32px'});
        this.leftRowD = this.add.text(this.labelRowOffsetX, this.labelRowOffsetY + this.tileSize*3, 'D', {fontSize: '32px'});
        
        // column labels
        this.leftCol1 = this.add.text(this.labelColOffsetX, this.labelColOffSetY, '1', {
            fontSize: '32px',
            color: '#ffffff'
        });
        this.leftCol2 = this.add.text(this.labelColOffsetX + this.tileSize, this.labelColOffSetY, '2', {fontSize: '32px'});
        this.leftCol3 = this.add.text(this.labelColOffsetX + this.tileSize*2, this.labelColOffSetY, '3', {fontSize: '32px'});


        // Draw board on the left side
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                let isLight = (r + c) % 2 === 0; // even or odd trick
                let color = isLight ? 0xff9966 : 0xcc6633; // like post-it notes orange shades

                this.add.rectangle(
                    this.boardOffsetX + c * this.tileSize,
                    this.boardOffsetY + r * this.tileSize,
                    this.tileSize - 4,
                    this.tileSize - 4,
                    color
                ).setOrigin(0);
            }
        }

        // Left side: Monument at the top of the board
        this.monument = this.add.rectangle(
            this.boardOffsetX + 1 * this.tileSize + 10,
            this.boardOffsetY - 80,
            this.tileSize - 20, 65, 0xd2b48c // wooden block color
        ).setOrigin(0);
        this.add.text(this.monument.x + 5, this.monument.y + 20, 'MONUMENT', {
            fontSize: '12px',
            color: '#000000'
        });

            // Player at the bottom of the board
        this.playerToken = this.add.circle(
            this.boardOffsetX + this.playerCol * this.tileSize + this.tileSize / 2,
            this.boardOffsetY + this.playerRow * this.tileSize + this.tileSize / 2,
            25,
            0x0e03ad
        );

        // spawn 2 Enemy tokens (click them to cycle row position just for now)
        this.enemies.forEach((enemy) => {
            enemy.token = this.add.rectangle(
                this.boardOffsetX + enemy.col * this.tileSize + 25,
                this.boardOffsetY + enemy.row * this.tileSize + 25,
                40, 40, 0xff0000
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
                let newCol = Math.floor((enemy.token.x - this.boardOffsetX) / this.tileSize);
                let newRow = Math.floor((enemy.token.y - this.boardOffsetY) / this.tileSize);
                //make sure to keep enemy in the bounds of the board
                enemy.col = Phaser.Math.Clamp(newCol, 0, this.cols - 1);
                enemy.row = Phaser.Math.Clamp(newRow, 0, this.rows - 1);
                enemy.token.x = this.boardOffsetX + enemy.col * this.tileSize + 25;
                enemy.token.y = this.boardOffsetY + enemy.row * this.tileSize + 25;
            });
            //OLD CODE:
            /*enemy.token.on('pointerdown', () => {
                enemy.row = (enemy.row + 1) % this.rows;
                enemy.token.y = this.boardOffsetY + enemy.row * this.tileSize + 25;
                // TODO: add rule that DM can't move same enemy pice twice in a row
            });*/
        });

        // Fog implementation to hide DM/Seer side when Wanderer is looking
        this.fogCover = this.add.rectangle(0, 60, 635, 660, 0x000000, 1).setOrigin(0);
        this.fogCover.visible = false;

        let toggleFogButton = this.add.text(20, 650, 'TOGGLE DM FOG COVER', {
            fontSize: '18px',
            color: '#000000',
            backgroundColor: '#ffffff'
        }).setInteractive();

        toggleFogButton.on('pointerdown', () => {
            this.fogCover.visible = !this.fogCover.visible;
        });

        // Right Side: Wanderer reference card (Blank chess grid for marking)
        this.add.rectangle(
            this.refOffsetX + 1 * this.tileSize + 10,
            this.boardOffsetY - 80,
            this.tileSize - 20, 65, 0x888888
        ).setOrigin(0);
        this.add.text(this.refOffsetX + 1 * this.tileSize + 25, this.boardOffsetY - 60, 'GOAL', {
            fontSize: '14px',
            color: '#ffffff', 
        });

            // blank grid for wanderer
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                let color = (r + c) % 2 === 0 ? 0xdddddd : 0xaaaaaa;
                let cell = this.add.rectangle(
                    this.refOffsetX + c * this.tileSize,
                    this.boardOffsetY + r * this.tileSize,
                    this.tileSize - 4,
                    this.tileSize - 4,
                    color
                ).setOrigin(0).setInteractive();
                
                let markText = this.add.text(
                    cell.x + 30,
                    cell.y + 25,
                    '',
                    {fontSize: '32px', color: '#000000'}
                );

                // empty -> ? (maybe) -> X (for sure) -> P (player guess)
                cell.on('pointerdown', () => {
                    if (markText.text === '') markText.setText('?');
                    else if (markText.text === '?') markText.setText('X');
                    else if (markText.text === 'X') markText.setText('P');
                    else markText.setText('');
                });
            }
        }

        // Control Panel at bottom (no diagonnal movement YET)
        this.add.text(this.refOffsetX + 1 * this.tileSize, 688, 'CONTROLS', {
            fontSize: '18px',
            color: '#ffffff'
        });
        this.createMoveBtn(930, 600, '↑', 0, -1);
        this.createMoveBtn(930, 640, '↓', 0, 1);
        this.createMoveBtn(870, 620, '←', -1, 0);
        this.createMoveBtn(990, 620, '→', 1, 0);

        // TODO: add diagonal movement or tp spots

        // row labels for right board
        this.rightA = this.add.text(this.refLabelOffsetX, this.labelRowOffsetY, 'A', {
            fontSize: '32px',
            color: '#ffffff'
        });
        this.rightB = this.add.text(this.refLabelOffsetX, this.labelRowOffsetY + this.tileSize, 'B', {fontSize: '32px'});
        this.rightC = this.add.text(this.refLabelOffsetX, this.labelRowOffsetY + this.tileSize*2, 'C', {fontSize: '32px',});
        this.rightC = this.add.text(this.refLabelOffsetX, this.labelRowOffsetY + this.tileSize*3, 'D', {fontSize: '32px',});

        this.leftCol1 = this.add.text(this.refColLabelOffsetX, this.labelColOffSetY, '1', {
            fontSize: '32px',
            color: '#ffffff'
        });
        this.leftCol2 = this.add.text(this.refColLabelOffsetX + this.tileSize, this.labelColOffSetY, '2', {fontSize: '32px'});
        this.leftCol3 = this.add.text(this.refColLabelOffsetX + this.tileSize*2, this.labelColOffSetY, '3', {fontSize: '32px'});

        //creating instructions button
        // Instructions button
        let instructionsBtn = this.add.text(20, 100, '[ INSTRUCTIONS ]', {
            fontSize: '18px',
            color: '#ffffff',
            backgroundColor: '#444444',
            padding: { x: 10, y: 8 }
        }).setInteractive();

        instructionsBtn.on('pointerdown', () => {
            this.showInstructions();
        });
    }

    createMoveBtn(x, y, label, dCol, dRow) {
        let button = this.add.text(x, y, `[${label}]`, {
            fontSize: '25px',
            color: '#000000',
            backgroundColor: '#ffffff'
        }).setInteractive();

        button.on('pointerdown', () => {
            if (this.isRolling) return;
            let nextCol = this.playerCol + dCol;
            let nextRow = this.playerRow + dRow;

            button.setBackgroundColor('blue')   // visual feedback that buttonw as pressed

            // check if player moves into the monument from top middle tile 
            // (col 1, row 0) -> (col 1, row -1)
            if (nextCol === 1 && nextRow === -1) {
                this.playerToken.y = this.monument.y + 30;
                this.statusText.setText('Status: YOU WIN! YOU REACHED THE MONUMENT!');
                // TODO: go to HUD win screen here
                return;
            }

            // keep the buttons in the board only
            if (nextCol >= 0 && nextCol < this.cols && nextRow >= 0 && nextRow < this.rows) {
                this.playerCol = nextCol;
                this.playerRow = nextRow;
                this.playerToken.x = this.boardOffsetX + this.playerCol * this.tileSize + this.tileSize / 2;
                this.playerToken.y = this.boardOffsetY + this.playerRow * this.tileSize + this.tileSize / 2;
                this.checkCollisions();
            }
        });

        // Visual feedback when button is pressed
        button.on('pointerover', () => {
            button.setBackgroundColor('#000000')
            button.setColor('#ffffff')
        })
        //reset coloring when not hovering
        button.on('pointerout', () => {
            button.setBackgroundColor('#ffffff')
            button.setColor('#000000')
        })
    }

    //Instructions for the game
    showInstructions() {
    // Dark popup background
        let popup = this.add.rectangle(
            640, 360, 750, 500, 0x222222
        ).setStrokeStyle(3, 0xffffff)
        .setInteractive();

        // Instructions text
        let instructions = this.add.text(320, 150,
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
    - Each player moves once per turn.
    - Move one tile up, down, left, or right.
    - No diagonal movement.`,
            {
                fontSize: '18px',
                color: '#ffffff',
                lineSpacing: 8
            }
        );

        // Close button
        let closeBtn = this.add.text(960, 125, '[ X ]', {
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
        //old code for collision detection with enemies
        /*
        this.enemies.forEach((enemy) => {
            if (enemy.col === this.playerCol && enemy.row === this.playerRow) {
                this.statusText.setText('Status: You have fainted! YOU WAKE UP BACK AT THE START');
                // just added a simple back to start
                this.playerRow = 3;
                this.playerToken.y = this.boardOffsetY + this.playerRow * this.tileSize + this.tileSize / 2;
                // TODO: roll dice to move player back random spaces and update heaalth to HUD
            }
        });
        */
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
                
                this.playerToken.x = this.boardOffsetX + this.playerCol * this.tileSize + this.tileSize / 2;
                this.playerToken.y = this.boardOffsetY + this.playerRow * this.tileSize + this.tileSize / 2;
                moves++;

                if (moves >= steps) {
                    this.isRolling = false;
                    //check on landing on other enemy
                    this.checkCollisions();
                }
            }
        });
    }

    update() {
    }
}