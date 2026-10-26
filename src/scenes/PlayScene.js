export class PlayScene extends Phaser.Scene {
    constructor() {
        super('PlayScene');
        this.rows = 4;
        this.cols = 3;
        this.tileSize = 90;
        this.boardOffsetX = 180;
        this.boardOffsetY = 180;
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

        this.add.text(660, 20, 'WANDERER REF CARD', {
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

        // TODO: spawn monument at top and player at bottom
    }

    update() {

    }
}