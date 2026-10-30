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
    }

    create() {
        let wandererBoard = new Board(this, this.rows, this.cols, 90);
        wandererBoard.build();
        let seerBoard = new Board(this, this.rows, this.cols, 90, {boarddOffset: 180, colorDark: 0x053808, colorLight: 0x428c77, seer: true});
        seerBoard.build();
        seerBoard.setVisible(false);

        let wandererSwitch = new TextButton(this, this.scale.width - 100, this.scale.height/2, "Wanderer", 'dark',
            () => {
                wandererBoard.setVisible(true);
                seerBoard.setVisible(false);
                GameManager.Instance.set('moves', 1);
            }
        );
        let seerSwitch = new TextButton(this, this.scale.width - 100, this.scale.height/2 + 70, "Seer", 'dark',
            () => {
                wandererBoard.setVisible(false);
                seerBoard.setVisible(true);
                GameManager.Instance.set('moves', 1);
            }
        );

        this.cursors = this.input.keyboard.createCursorKeys();

        let [boardOffsetX, boardOffsetY] = wandererBoard.getOffset();
        this.playerToken = this.add.circle(
            boardOffsetX + this.playerCol * 90 + 45,
            boardOffsetY + this.playerRow * 90 + 45,
            25,
            0xda4343
        );
    }

    update(time) {
        let left = Phaser.Input.Keyboard.JustDown(this.cursors.left);
        let right = Phaser.Input.Keyboard.JustDown(this.cursors.right);
        let up = Phaser.Input.Keyboard.JustDown(this.cursors.up);
        let down = Phaser.Input.Keyboard.JustDown(this.cursors.down);

        if(GameManager.Instance.get('moves') > 0) { //GameManager.Instance.get('moves') >= 1
            if(left) {
                if(this.playerCol > 0) this.playerCol--;
                GameManager.Instance.set('moves', 0);
            }
            if(right) {
                if(this.playerCol < this.cols-1) this.playerCol++;
                GameManager.Instance.set('moves', 0);
            }
            if(up) {
                if(this.playerRow > 0) this.playerRow--;
                GameManager.Instance.set('moves', 0);
            }
            if(down) {
                if(this.playerRow < this.rows-1) this.playerRow++;
                GameManager.Instance.set('moves', 0);
            }
        }
        this.playerToken.x = this.scale.width/3 - 60 + this.playerCol * 90 + 45;
        this.playerToken.y = this.scale.height/4 - 35 + this.playerRow * 90 + 45;
    }
}