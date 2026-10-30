export class TextButton extends Phaser.GameObjects.Text {
    constructor(scene, x, y, text, style, callback) {
        super(scene, x, y, text, style);

        if(style == 'default') {
            this.setStyle({
                fontFamily: 'sans-serif',
                fontSize: '16px',
                color: '#ffffff',
                align: 'center',
                fixedWidth: 100,
                backgroundColor: '#0c2a8cff'
            });
        } else if (style == 'dark') {
            this.setStyle({
                fontFamily: 'sans-serif',
                fontSize: '16px',
                color: '#ffffff',
                align: 'center',
                fixedWidth: 100,
                backgroundColor: '#383838'
            });
        }
        
        this.setInteractive({ useHandCursor: true})
            .on('pointerover', () => { this.setBackgroundColor('rgb(108, 156, 154)'); }) //change color when hover
            .on('pointerout', () => { this.setBackgroundColor('#383838'); }) //change back when not hovered
            .on('pointerdown', () => { this.setBackgroundColor('#8d8d8d'); }) //change purple when clicked
            .on('pointerup', () => { callback(); }); //run callback function when clicked

        this.setPadding(20);
        this.setDepth(10);
        this.setOrigin(1,1);
        this.setScrollFactor(0);
        scene.add.existing(this);
    }
}