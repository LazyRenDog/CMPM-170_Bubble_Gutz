export class PlayScene extends Phaser.Scene {
    constructor() {
        super('PlayScene');
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

        // TODO: add board grid and wanderer cheat sheet here.
    }

    update() {

    }
}