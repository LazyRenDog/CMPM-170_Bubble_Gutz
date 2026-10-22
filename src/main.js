import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene.js';

// Game window configuration
const config = {
  type: Phaser.AUTO,
  parent: 'game',
  width: 1280,
  height: 720,
  backgroundColor: '#1a1a2e',
  scene: [BootScene],
};

new Phaser.Game(config);