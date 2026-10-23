export class Board extends Phaser.GameObjects.Sprite {
    constructor(scene, width, height) {
        super(scene, width, height);
        scene.add.existing(this);
        this.setPosition(0,0);
    }

    preUpdate(time, delta) {

    }
}