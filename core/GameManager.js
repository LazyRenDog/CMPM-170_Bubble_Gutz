class TheGameManager extends Phaser.Events.EventEmitter {
    //using https://youtu.be/HPdgr23yP_M?si=gwfanzcXJyUk59II as an example of javascript Singleton
    //https://docs.phaser.io/phaser/concepts/data-manager is a good resource to look at as well
    /** @type {Phaser.Data.DataManager} */
    #Instance;

    constructor() {
        super();
        this.#Instance = new Phaser.Data.DataManager(this);
        this.#setup();
    }

    /** @type {Phaser.Data.DataManager} */
    get Instance() {
        return this.#Instance;
    }

    #setup() { //insert any "global" variables you want here
        this.#Instance.set({
            moves: 1
        });
    }
}

export const GameManager = new TheGameManager();