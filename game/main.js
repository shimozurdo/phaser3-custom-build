import preloadScene from './scenes/preload.scene.js'
import titleScene from './scenes/title.scene.js'
import gameScene from './scenes/game.scene.js'

const config = {
    title: "Saving the day",
    type: Phaser.AUTO,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: { debug: true }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        parent: "game",
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 450
    },
    scene: [preloadScene, gameScene],
    dom: {
        createContainer: true
    },
};

new Phaser.Game(config);


