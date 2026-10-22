import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
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
  }
}