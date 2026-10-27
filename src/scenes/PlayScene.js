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
    }

    preload() {

    }

    create() {
        // SPlit screen divider line
        this.add.line(0, 0, 640, 0, 640, 720, 0xffffff).setOrigin(0, 0);

        // Labels for each side of the split screen
        this.add.text(20, 20, 'SEER', {
            fontSize: '24px',
            color: '#ffffff'
        });

        this.add.text(660, 20, 'WANDERER REF CARD (Click to mark)', {
            fontSize: '24px',
            color: '#ffffff'
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

            // keep the buttons in the board only
            if (nextCol >= 0 && nextCol < this.cols && netRow >= 0 && netRow < this.rows) {
                this.playerCol = nextCol;
                this.playerRow = nextRow;
                this.playerToken.x = this.boardOffsetX + this.playerCol * this.tileSize + this.tileSize / 2;
                this.playerToken.y = this.boardOffsetY + this.playerRow * this.tileSize + this.tileSize / 2;
            }
        });
    }

    update() {

    }
}