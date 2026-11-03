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
        let letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                let isLight = (r + c) % 2 === 0; // even or odd trick
                let color = isLight ?  this.colorLight : this.colorDark; // like post-it notes orange shades

                if(c == 0) {
                    let rowLabel = this.scene.add.text(c - this.tileSize + 45, r * this.tileSize + 30, letters[r], { fontSize: '32px'});
                    this.add(rowLabel);
                }

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

                if(r == this.rows - 1) {
                    for (let c = 0; c < this.cols; c++) {
                        let colLabel = this.scene.add.text(c  * this.tileSize + 30, this.tileSize * (r+1) + 20, c + 1, { fontSize: '32px'});
                        this.add(colLabel);
                    }
                }
            }
        }
    }

    getOffset() {
        return [this.x, this.y];
    }

    getTileSize() {
        return this.tileSize;
    }
}