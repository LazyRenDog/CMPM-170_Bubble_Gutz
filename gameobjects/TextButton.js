export class TextButton extends Phaser.GameObjects.Text {
    constructor(scene, x, y, text, style, callback, options = {}) {
        super(scene, x, y, text, style);

        if(style == 'default') {
            this.setStyle({
                fontFamily: 'sans-serif',
                fontSize: '16px',
                color: '#ffffff',
                align: 'center',
                backgroundColor: '#0c2a8cff'
            });
        } else if (style == 'dark') {
            this.setStyle({
                fontFamily: 'Courier New',
                fontSize: '16px',
                color: '#ffffff',
                align: 'center',
                backgroundColor: '#383838'
            });
        }
        
        this.setInteractive({ useHandCursor: true})
            .on('pointerover', () => { this.setBackgroundColor('rgb(108, 156, 154)'); }) //change color when hover
            .on('pointerout', () => { this.setBackgroundColor('#383838'); }) //change back when not hovered
            .on('pointerdown', () => { this.setBackgroundColor('#8d8d8d'); }) //change purple when clicked
            .on('pointerup', () => { callback(); }); //run callback function when clicked

        this.setFixedSize(options.width ?? 0, 0);
        this.setPadding(options.height ?? 20);
        this.setDepth(10);
        this.setOrigin(options.origin ?? 0.5, options.origin ?? 0.5);
        this.setScrollFactor(0);
        scene.add.existing(this);
    }
}

/**
 * Example:
 * let button = new TextButton(this, 500, 500, () => {
 *   myFunction();
 * },
 * {
 *   width: 300,
 *   height: 30,
 *   origin: 1, //0 for top left corner, 0.5 is center which is default, 1 is bottom right
 * });
 */