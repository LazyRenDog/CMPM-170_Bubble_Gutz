export class Board extends Phaser.GameObjects.Container {
    constructor(scene, rows, cols, tileSize, options = {}) {
        super(scene, scene.scale.width/3 - 60, scene.scale.height/4 - 35);
        scene.add.existing(this);

        this.scene = scene;
        this.rows = rows;
        this.cols = cols;
        this.tileSize = tileSize;
        this.colorLight = options.colorLight ?? 0x575aad;
        this.colorDark = options.colorDark ?? 0x2227a8;
        this.boardOffset = options.boardOffset ?? 0;
        this.seer = options.seer ?? false;
    }

    build() {
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                let isLight = (r + c) % 2 === 0; // even or odd trick
                let color = isLight ?  this.colorLight : this.colorDark; // like post-it notes orange shades

                let cell = this.scene.add.rectangle(
                    c * this.tileSize,
                    r * this.tileSize,
                    this.tileSize - 4,
                    this.tileSize - 4,
                    color
                ).setOrigin(0).setInteractive();

                this.add(cell);

                if(!this.seer) {
                    let markText = this.scene.add.text(
                        cell.x + 33,
                        cell.y + 28,
                        '',
                        {fontSize: '32px', color: '#000000'}
                    );

                    cell.on('pointerdown', () => {
                        if (markText.text === '') markText.setText('?');
                        else if (markText.text === '?') markText.setText('X');
                        else if (markText.text === 'X') markText.setText('P');
                        else markText.setText('');
                    });

                    this.add(markText);
                }
            }
        }
    }

    getOffset() {
        return [this.x, this.y];
    }
}