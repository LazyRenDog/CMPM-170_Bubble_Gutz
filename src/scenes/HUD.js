export class HUD extends Phaser.Scene {
    //HUD for displaying/keeping track of player health (& other constants important to display)
    constructor(){
        super("HUD");
    }

    preload() {

    }

    create() {
        //---- variables ----
        this.health = 3; //guessing on what we want this value to be
        this.playerWin = false; //turns true if/when reaches monument (triggering endgame state)
        this.playerLoss = false; //turns true if/when player dies (triggering endgame state)

        //---- setting up info displayers ----
        this.playerHealth = this.add.text(10, 100, "Health: 3",{ //guessing on loc + size values, can be changed later !
            fontSize: '30px',
            fontFamily: 'Courier New',
            color: '#ffffff', //white
            stroke: '#000000', //black outline
            strokeThickness: '5'
        }).setScrollFactor(0); //don't let text scroll

        //---- listeners ----
        // !! need to set up stuff that sends listeners in other parts of docs !!
        this.game.events.on('updateHealth', this.updateHealth, this);

    }

    updateHealth(newHealth){
        this.health = newHealth;
        this.playerHealth.setText("Health: " + newHealth);
    }

    update(time){
        if (this.health <= 0){
            this.playerLoss = true;
        }

        if (this.playerLoss == true){
            //something about endgame, show a losing screen
        }

        if (this.playerWin == true){
            //something about endgame, show a winning screen
        }
    }
}