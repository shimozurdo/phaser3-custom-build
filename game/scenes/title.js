const titleScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:
        function titleScene() {
            Phaser.Scene.call(this, "titleScene");
        },
    preload: function () {
        this.width = this.cameras.main.width;
        this.height = this.cameras.main.height;
    },
    create: function () {

        // Config for paralax backgrounds

        // Get the window sizes
        let windowWidth = window.innerWidth;
        let windowHeight = window.innerHeight;

        // Find the center of the top space
        let topBackgroundXOrigin = windowWidth / 2;
        let topBackgroundYOrigin = (windowHeight / 5) * 1.5;
        let topBackgroundHeight = (windowHeight / 5) * 3;

        // Base width and height of the images
        let imageBaseWidth = 1280;
        let imageBaseHeight = 720;
        let heightRatio = topBackgroundHeight / imageBaseHeight;

        this.titleBg = this.add.tileSprite(topBackgroundXOrigin, topBackgroundYOrigin, imageBaseWidth, imageBaseHeight, "title-background");
        this.titleBg.setScrollFactor(0);

        this.highwayBg = this.add.tileSprite(topBackgroundXOrigin, this.height - 40, imageBaseWidth, 96, "highway");
        this.highwayBg.setScrollFactor(0);

        let titleText = this.add.bitmapText(this.width / 2, (this.height / 2) - 100, "gem", "Saving the day", 40).setOrigin(0.5);
        titleText.setTint(0xFEAE34);

        let titleTextB = this.add.bitmapText(this.width / 2, (this.height / 2) - 102, "gem", "Saving the day", 40).setOrigin(0.5);
        titleTextB.setTint(0x353D56);

        this.tweens.add({
            targets: titleText,
            alpha: { from: .2, to: 1 },
            props: {
                y: { value: "+=10", duration: 2000, ease: "Sine.easeInOut" },
            },
            ease: "Linear",
            duration: 2000,
            repeat: -1,
            yoyo: true
        });

        this.tweens.add({
            targets: titleTextB,
            props: {
                y: { value: "+=10", duration: 2000, ease: "Sine.easeInOut" },
            },
            duration: 2000,
            repeat: -1,
            yoyo: true
        });

        this.anims.create({
            key: "fliying",
            frames: this.anims.generateFrameNumbers("memok"),
            frameRate: 10,
            repeat: -1
        });

        let playBtn = this.add.sprite(this.width / 2, this.height / 2, "button").setOrigin(0.5).setInteractive({ cursor: "pointer" });;
        let playTxt = this.add.bitmapText(playBtn.x, playBtn.y - 10, "gem", "Play", 34).setOrigin(.5);
        playTxt.setTint(0x353D56);

        playBtn.on("pointerover", function () {
            this.setTint(0xFEAE34);
        });

        playBtn.on("pointerout", function () {
            this.clearTint();
        });

        playBtn.on("pointerup", function () {
            this.game.sound.stopAll();
            this.scene.start("gameScene");
        }, this);

        this.memok = this.add.sprite(this.width / 2, this.height - 80, "memok").setOrigin(0.5);
        this.memok.play("fliying");

        this.add.bitmapText(this.width / 2, this.height - 10, "gem", "A game by shimozurdo", 18).setOrigin(.5);

    }, update: function () {
        this.titleBg.tilePositionX += .5;
        this.highwayBg.tilePositionX += .3;
    }
});

export default titleScene;