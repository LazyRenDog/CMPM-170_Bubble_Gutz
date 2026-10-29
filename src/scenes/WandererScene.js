export class WandererScene extends Phaser.Scene {
    constructor() {
        super('WandererScene');
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
            { col: 1, row: 1, token: null },
        ];
    }

    preload() {
    }

    // TO DO
        // ENEMY DATA LOCATION NEEDS TO BE SCOPED AND ACCESSIBLE TO BOTH WANDERERSCENE AND PLAYSCENE
        // PLAYER CANNOT MOVE IN THIS SCENE
    create() {
        // SCENE INTRODUCTION
        this.add.text(
            this.cameras.main.centerX - 150,
            this.cameras.main.centerY - 50,
            'Wanderer Sees',
            {
                fontFamily: 'Arial, sans-serif',
                fontSize: '48px',
                color: '#ffffff',
            },
        ).setOrigin(0.5);

        // BACK TO PREVIOUS SCENE
            // SCENE DOES NOT RESET, THE MOVEMENT OF ENEMIES IS SAVED SWITCHING BETWEEN SCENES
        const seerButton = this.add.text(
            this.cameras.main.centerX - 150,
            this.cameras.main.centerY + 25,
            'End Turn',
            {
                fontFamily: 'Courier New',
                fontSize: '28px',
                color: '#888a88',
                padding: { x: 10, y: 5 }
            }
        ).setOrigin(0.5).setInteractive();

        seerButton.on('pointerdown', () => {
            this.scene.start('PlayScene');
        });

        
        // BOARD CREATION
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
                    { fontSize: '32px', color: '#000000' }
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

    update() {
    }

    // HELPER FUNCTIONS
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
}