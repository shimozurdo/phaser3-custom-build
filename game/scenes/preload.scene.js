import { createAnimations } from "./scene.actions.js"
import CONST from './const.js'

// console.log(actions)
const preloadScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

        function PreloadScene() {
            Phaser.Scene.call(this, "preloadScene");
        },

    preload: function () {
        // font
        this.load.bitmapFont("gem", "assets/gem.png", "assets/gem.xml");
        // static images
        this.load.image("logo", "assets/logo.png");
        this.load.image("title-background", "assets/title-background.png");
        this.load.image("highway", "assets/highway.png");
        this.load.image("button", "assets/button.png");
        this.load.image("tileSetImg", "assets/tileSet.png");
        this.load.image("bucket", "assets/bucket.png");
        this.load.image("mask", "assets/mask.png");
        this.load.image("hand", "assets/hand.png");
        this.load.image("vaccine", "assets/vaccine.png");
        this.load.image("ambulance", "assets/ambulance.png");
        this.load.image("manager", "assets/manager.png");
        this.load.image("close", "assets/close.png");
        this.load.image("battery", "assets/battery.png");
        // sprite sheets
        this.load.spritesheet("show-more-text", "assets/show-more-text.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("cross", "assets/cross.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("help-alert", "assets/help-alert.png", { frameWidth: 64, frameHeight: 32 });
        this.load.spritesheet("memok", "assets/memok.png", { frameWidth: 48, frameHeight: 64 });
        this.load.spritesheet("wilmer", "assets/wilmer.png", { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet("ada", "assets/ada.png", { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet("ada-mask", "assets/ada-mask.png", { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet("ada-sick", "assets/ada-mask.png", { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet("ada-sick-mask", "assets/ada-sick-mask.png", { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet("evan", "assets/evan.png", { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet("evan-mask", "assets/evan-mask.png", { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet("evan-sick", "assets/evan-sick.png", { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet("evan-sick-mask", "assets/evan-sick-mask.png", { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet("warning", "assets/warning.png", { frameWidth: 8, frameHeight: 16 });
        this.load.spritesheet("selected-item", "assets/selected-item.png", { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet("arrow-down", "assets/arrow-down.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("selected-guest", "assets/selected-guest.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("gears", "assets/gears.png", { frameWidth: 32, frameHeight: 32 });
        // Json
        this.load.tilemapTiledJSON("map", "assets/tileMap.json");
        // audio
        this.load.audio("pleasant-creek-loop", ["assets/pleasant-creek-loop.mp3", "assets/pleasant-creek-loop.ogg"]);
        this.load.audio("intro-theme", ["assets/intro-theme.mp3", "assets/intro-theme.ogg"]);

        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect((width / 2) - (320 / 2), (height / 2) - (50 / 2), 320, 50);

        const loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: "Loading...",
            style: {
                font: "28px monospace",
                fill: "#ffffff"
            }
        });

        loadingText.setOrigin(0.5, 0.5);

        const percentText = this.make.text({
            x: width / 2,
            y: height / 2,
            text: "0%",
            style: {
                font: "28px monospace",
                fill: "#ffffff"
            }
        });
        percentText.setOrigin(0.5, 0.5);

        const assetText = this.make.text({
            x: width / 2,
            y: height / 2 + 50,
            text: "",
            style: {
                font: "18px monospace",
                fill: "#ffffff"
            }
        });
        assetText.setOrigin(0.5, 0.5);

        this.load.on("progress", function (value) {
            percentText.setText(parseInt(value * 100) + "%");
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect((width / 2) - (300 / 2), (height / 2) - (30 / 2), 300 * value, 30);
        }, this);

        this.load.on("fileprogress", function (file) {
            assetText.setText("Loading asset: " + file.key);
        }, this);

        this.load.on("complete", function () {
            let logo = this.add.image(width / 2, height / 2, "logo");
            logo.setScale(.5);

            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
            assetText.destroy();
            // this.sound.play("intro-theme", {
            //     volume: .5,
            //     loop: true,
            //     delay: 0
            // });            
        }, this);

        //binding actions to thins scene
        this.createAnimations = createAnimations.bind(this);
    },
    create: function () {

        // ANIMATIONS       
        this.createAnimations(CONST.ANIM.WALK + "-ada", "ada", 4, -1);
        this.createAnimations(CONST.ANIM.WALK + "-ada-mask", "ada-mask", 4, -1);
        this.createAnimations(CONST.ANIM.WALK + "-ada-sick", "ada-sick", 4, -1);
        this.createAnimations(CONST.ANIM.WALK + "-ada-sick", "-ada-sick", 4, -1);
        this.createAnimations(CONST.ANIM.WALK + "-ada-sick-mask", "ada-sick-mask", 4, -1);
        this.createAnimations(CONST.ANIM.WALK + "-evan", "evan", 4, -1);
        this.createAnimations(CONST.ANIM.WALK + "-evan-mask", "evan-mask", 4, -1);
        this.createAnimations(CONST.ANIM.WALK + "-evan-sick", "evan-sick", 4, -1);
        this.createAnimations(CONST.ANIM.WALK + "-evan-sick", "-evan-sick", 4, -1);
        this.createAnimations(CONST.ANIM.WALK + "-evan-sick-mask", "evan-sick-mask", 4, -1);
        this.createAnimations(CONST.ANIM.FLY + "-memok", "memok", 4, -1);
        this.createAnimations(CONST.ANIM.IDLE + "-wilmer", "wilmer", 4, -1);
        this.createAnimations(CONST.ANIM.BLINK + "-show-more-text", "show-more-text", 4, -1);
        this.createAnimations(CONST.ANIM.BLINK + "-help-alert", "help-alert", 4, -1);
        this.createAnimations(CONST.ANIM.BLINK + "-selected-item", "selected-item", 4, -1);
        this.createAnimations(CONST.ANIM.BLINK + "-selected-guest", "selected-guest", 4, -1);
        this.createAnimations(CONST.ANIM.BLINK + "-arrow-down", "arrow-down", 4, -1);
        this.createAnimations(CONST.ANIM.BLINK + "-warning", "warning", 4, 1);
        this.createAnimations(CONST.ANIM.WAIT + "-arrow-gears", "gears", 4, -1);
        // ANIMATIONS

        this.time.addEvent({
            delay: 2000,
            callback: function () {
                this.scene.stop("preload");
                this.scene.start("gameScene");
            }.bind(this),
            loop: false
        });

    }
});

export default preloadScene;