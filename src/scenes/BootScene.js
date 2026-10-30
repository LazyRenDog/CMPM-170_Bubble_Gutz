import { GameManager } from "../../core/GameManager.js";

export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() { //load assets here
  }

  create() {
    // Title text, centered in the game window
    this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      'Bubble Gutz',
      {
        fontFamily: 'Arial, sans-serif',
        fontSize: '48px',
        color: '#ffffff',
      },
    ).setOrigin(0.5);

    // Start button to the board scene
    const startButton = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY + 50,
      'Split Screen Mode',
      {
        fontFamily: 'Courier New',
        fontSize: '28px',
        color: '#888a88',
        padding: { x: 10, y: 5 }
      }
    ).setOrigin(0.5).setInteractive();

    // move to Playscene using the button
    startButton.on('pointerdown', () => {
      this.scene.start('PlayScene');
    });

    const otherMode = this.add.text( this.scale.width/2, this.scale.height/2 + 80, 'Turn-Based Mode',
      {
        fontFamily: 'Courier New',
        fontSize: '28px',
        color: '#888a88',
        padding: { x: 10, y: 5 }
      }
    ).setOrigin(0.5).setInteractive();

    // move to Playscene using the button
    startButton.on('pointerdown', () => {
      this.scene.start('PlayScene');
    });

    otherMode.on('pointerdown', () => {
      this.scene.start('TurnMode');
    })

    console.log(GameManager.Instance.get("moves"));
  }

  update(time) {
    
  }
}