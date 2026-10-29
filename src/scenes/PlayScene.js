export class PlayScene extends Phaser.Scene {
    constructor() {
        super('PlayScene');
        this.rows = 4;
        this.cols = 3;
        this.tileSize = 90;
        this.boardOffsetX = 180;
        this.boardOffsetY = 180;
        this.refOffsetX = 820; // right side of the screen

        // player grid position (bottom middle)
        this.playerCol = 1;
        this.playerRow = 3;

        // enemies controlled by seer currently
        this.enemies = [
            { col: 0, row: 0, token: null },
            { col: 1, row: 1, token: null }
        ];
    }

    preload() {

    }

    create() {
        // SPlit screen divider line
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

        // Draw board on theh left side
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
                let newCol = Math.floor((dragX - this.boardOffsetX) / this.tileSize);
                let newRow = Math.floor((dragY - this.boardOffsetY) / this.tileSize);
                enemy.col = Phaser.Math.Clamp(newCol, 0, this.cols - 1);
                enemy.row = Phaser.Math.Clamp(newRow, 0, this.rows - 1);
                enemy.token.x = this.boardOffsetX + enemy.col * this.tileSize + 25;
                enemy.token.y = this.boardOffsetY + enemy.row * this.tileSize + 25;
            });


            /*enemy.token.on('pointerdown', () => {
                enemy.row = (enemy.row + 1) % this.rows;
                enemy.token.y = this.boardOffsetY + enemy.row * this.tileSize + 25;
                // TODO: add rule that DM can't move same enemy pice twice in a row
            });*/
        });

        // Fog implementation to hide DM/Seer side when Wanderer is looking
        this.fogCover = this.add.rectangle(0, 60, 635, 660, 0x000000, 0.95).setOrigin(0);
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
        this.add.text(this.refOffsetX + 1 * this.tileSize + 15, this.boardOffsetY - 60, 'GOAL', {
            fontSize: '14px',
            color: '#ffffff'
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
        this.add.text(780, 560, 'CONTROLS', {
            fontSize: '18px',
            color: '#ffffff'
        });
        this.createMoveBtn(930, 600, '↑', 0, -1);
        this.createMoveBtn(930, 640, '↓', 0, 1);
        this.createMoveBtn(870, 620, '←', -1, 0);
        this.createMoveBtn(990, 620, '→', 1, 0);

        // TODO: add diagonal movement or tp spots
    }

    createMoveBtn(x, y, label, dCol, dRow) {
        let button = this.add.text(x, y, `[${label}]`, {
            fontSize: '25px',
            color: '#000000',
            backgroundColor: '#ffffff'
        }).setInteractive();

        button.on('pointerdown', () => {
            let nextCol = this.playerCol + dCol;
            let nextRow = this.playerRow + dRow;

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
                this.checkCollisiions();
            }
        });
    }

    checkCollisiions() {
        this.enemies.forEach((enemy) => {
            if (enemy.col === this.playerCol && enemy.row === this.playerRow) {
                this.statusText.setText('Status: You have fainted! YOU WAKE UP BACK AT THE START');
                // just added a simple back to start
                this.playerRow = 3;
                this.playerToken.y = this.boardOffsetY + this.playerRow * this.tileSize + this.tileSize / 2;
                // TODO: roll dice to move player back random spaces and update heaalth to HUD
            }
        });
    }

    update() {

    }
}