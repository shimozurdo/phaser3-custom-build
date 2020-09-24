import preloadScene from './scenes/preload.js'
import titleScene from './scenes/title.js'
import gameScene from './scenes/game.js'

const config = {
    title: "Saving the day",
    type: Phaser.AUTO,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: { debug: false }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        parent: "game",
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 450
    },
    scene: [preloadScene, titleScene, gameScene],
    dom: {
        createContainer: true
    },
};

new Phaser.Game(config);


