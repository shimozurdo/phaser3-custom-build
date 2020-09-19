var preloadScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

        function PreloadScene() {
            Phaser.Scene.call(this, 'preloadScene');
        },

    preload: function () {
        // fonts
        this.load.bitmapFont('gem', 'assets/gem.png', 'assets/gem.xml');
        // static images
        this.load.image('logo', 'assets/logo.png');
        this.load.image('title-background', 'assets/title-background.png');
        this.load.image('highway', 'assets/highway.png');
        this.load.image('button', 'assets/button.png');
        // sprite sheets
        this.load.spritesheet('memok1', 'assets/memok1.png', { frameWidth: 48, frameHeight: 64 });

        var width = this.cameras.main.width;
        var height = this.cameras.main.height;

        var progressBar = this.add.graphics();
        var progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect((width / 2) - (320 / 2), (height / 2) - (50 / 2), 320, 50);

        var loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                font: '28px monospace',
                fill: '#ffffff'
            }
        });

        loadingText.setOrigin(0.5, 0.5);

        var percentText = this.make.text({
            x: width / 2,
            y: height / 2 - 5,
            text: '0%',
            style: {
                font: '28px monospace',
                fill: '#ffffff'
            }
        });
        percentText.setOrigin(0.5, 0.5);

        var assetText = this.make.text({
            x: width / 2,
            y: height / 2 + 50,
            text: '',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });
        assetText.setOrigin(0.5, 0.5);

        this.load.on('progress', function (value) {
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect((width / 2) - (300 / 2), (height / 2) - (30 / 2), 300 * value, 30);
        }, this);

        this.load.on('fileprogress', function (file) {
            assetText.setText('Loading asset: ' + file.key);
        }, this);

        this.load.on('complete', function () {
            var logo = this.add.image(width / 2, height / 2, 'logo');
            logo.setScale(.5);

            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
            assetText.destroy();

            this.time.addEvent({
                delay: 2000,
                callback: () => {
                    this.scene.sleep("preload");
                    this.scene.start("titleScene");
                },
                loop: false
            });
        }, this);
    }
});

var titleScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:
        function PreloadScene() {
            Phaser.Scene.call(this, 'titleScene');
        },
    preload: function () {
        this.width = this.cameras.main.width;
        this.height = this.cameras.main.height;
    },
    create: function () {
        this.titleBg = this.add.tileSprite(topBackgroundXOrigin, topBackgroundYOrigin, imageBaseWidth, imageBaseHeight, 'title-background');
        this.titleBg.setScrollFactor(0);

        this.highwayBg = this.add.tileSprite(topBackgroundXOrigin, this.height - 40, imageBaseWidth, 96, 'highway');
        this.highwayBg.setScrollFactor(0);

        var titleText = this.add.bitmapText(this.width / 2, (this.height / 2) - 100, "gem", "Saving the day", 40).setOrigin(0.5);
        titleText.setTint(0xFEAE34);

        var titleTextB = this.add.bitmapText(this.width / 2, (this.height / 2) - 102, "gem", "Saving the day", 40).setOrigin(0.5);
        titleTextB.setTint(0x353D56);

        this.tweens.add({
            targets: titleText,
            alpha: { from: .2, to: 1 },
            props: {
                y: { value: '+=10', duration: 2000, ease: 'Sine.easeInOut' },
            },
            ease: 'Linear',
            duration: 2000,
            repeat: -1,
            yoyo: true
        });

        this.tweens.add({
            targets: titleTextB,
            props: {
                y: { value: '+=10', duration: 2000, ease: 'Sine.easeInOut' },
            },
            duration: 2000,
            repeat: -1,
            yoyo: true
        });

        this.anims.create({
            key: 'fliying',
            frames: this.anims.generateFrameNumbers('memok1'),
            frameRate: 10,
            repeat: -1
        });

        var playBtn = this.add.sprite(this.width / 2, this.height / 2, 'button').setOrigin(0.5).setInteractive({ cursor: 'pointer' });;
        var playTxt = this.add.bitmapText(playBtn.x, playBtn.y - 10, "gem", "Play", 34).setOrigin(.5);
        playTxt.setTint(0x353D56);

        playBtn.on('pointerover', function () {
            this.setTint(0xFEAE34);
        });

        playBtn.on('pointerout', function () {
            this.clearTint();
        });

        playBtn.on('pointerup', function () {

        }, this);

        this.memok1 = this.add.sprite(this.width / 2, this.height - 80, 'memok1').setOrigin(0.5);
        this.memok1.play('fliying');

        this.add.bitmapText(this.width / 2, this.height - 10, "gem", "A game by shimozurdo", 18).setOrigin(.5);
    }, update: function () {
        this.titleBg.tilePositionX += .5;
        this.highwayBg.tilePositionX += .3;
    }
});

var config = {
    title: "Saving the day",
    version: '0.0.2',
    type: Phaser.AUTO,
    pixelArt: true,
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'game',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 450
    },
    scene: [preloadScene, titleScene],
    dom: {
        createContainer: true
    },
};

var game = new Phaser.Game(config);

// Config for paralax backgrounds

// Get the window sizes
var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;

// Find the center of the top space
var topBackgroundXOrigin = windowWidth / 2;
var topBackgroundYOrigin = (windowHeight / 5) * 1.5;
var topBackgroundHeight = (windowHeight / 5) * 3;

// Base width and height of the images
var imageBaseWidth = 1280;
var imageBaseHeight = 720;
var heightRatio = topBackgroundHeight / imageBaseHeight;
