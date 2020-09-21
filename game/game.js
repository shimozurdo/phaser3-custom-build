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
        this.load.image('tileSetImg', 'assets/tileSet.png');
        this.load.image('bucket', 'assets/bucket.png');
        this.load.image('mask', 'assets/mask.png');
        this.load.image('vaccine', 'assets/vaccine.png');
        this.load.image('ambulance', 'assets/ambulance.png');
        this.load.image('boss', 'assets/boss.png');
        // sprite sheets
        this.load.spritesheet('memok', 'assets/memok.png', { frameWidth: 48, frameHeight: 64 });
        this.load.spritesheet('wilmer', 'assets/wilmer.png', { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet('ada', 'assets/ada.png', { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet('evan', 'assets/evan.png', { frameWidth: 48, frameHeight: 48 });
        // Json
        this.load.tilemapTiledJSON('map', 'assets/tileMap.json');
        // audio
        this.load.audio('pleasant-creek-loop', ['assets/pleasant-creek-loop.mp3', 'assets/pleasant-creek-loop.ogg']);
        this.load.audio('intro-theme', ['assets/intro-theme.mp3', 'assets/intro-theme.ogg']);

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
            this.sound.play("intro-theme", {
                volume: .5,
                loop: true,
                delay: 0
            });
            this.time.addEvent({
                delay: 2000,
                callback: () => {
                    this.scene.stop("preload");
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
        function titleScene() {
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
            frames: this.anims.generateFrameNumbers('memok'),
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
            this.game.sound.stopAll();
            this.scene.start('gameScene');
        }, this);

        this.memok = this.add.sprite(this.width / 2, this.height - 80, 'memok').setOrigin(0.5);
        this.memok.play('fliying');

        this.add.bitmapText(this.width / 2, this.height - 10, "gem", "A game by shimozurdo", 18).setOrigin(.5);

    }, update: function () {
        this.titleBg.tilePositionX += .5;
        this.highwayBg.tilePositionX += .3;
    }
});

var gameScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:
        function gameScene() {
            Phaser.Scene.call(this, 'gameScene');
        },
    preload: function () {
        this.width = this.cameras.main.width;
        this.height = this.cameras.main.height;
        this.gameOver = false;
        this.gameStarted = false;
    },
    create: function () {
        //MUSIC
        this.sound.play("pleasant-creek-loop", {
            volume: .5,
            loop: true,
            delay: 0
        });

        // ANIMATIONS
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('ada'),
            frameRate: 4,
            repeat: -1
        });

        this.anims.create({
            key: 'fliying',
            frames: this.anims.generateFrameNumbers('memok'),
            frameRate: 4,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('wilmer'),
            frameRate: 4,
            repeat: -1
        });

        // GROUPS AND PLAYERS
        this.wilmersGrp = this.add.group();
        this.peopleGrp = this.add.group();

        // BACKGROUND
        this.cameras.main.setBackgroundColor('#55648C')
        var map = this.make.tilemap({ key: 'map' });
        var tileSet = map.addTilesetImage('tileSet', 'tileSetImg');
        map.createDynamicLayer('staticObjects', tileSet, 0, 0);

        var textLayer = map.createDynamicLayer('text', tileSet, 0, 0);
        textLayer.visible = false;

        this.add.bitmapText(this.width - 32, 16, "gem", "items", 22).setOrigin(.5);

        // GAME OBJECTS
        var bucketBtn = this.add.image(this.width - 32, 64, "bucket").setOrigin(.5).setInteractive({ cursor: 'pointer' });
        bucketBtn.on('pointerover', function () {
            this.setTint(0xfeae34);
        });
        bucketBtn.on('pointerout', function () {
            this.clearTint();
        });

        var maskBtn = this.add.image(this.width - 32, 128, "mask").setOrigin(.5).setInteractive({ cursor: 'pointer' });
        maskBtn.on('pointerover', function () {
            this.setTint(0xfeae34);
        });
        maskBtn.on('pointerout', function () {
            this.clearTint();
        });

        var vaccineBtn = this.add.image(this.width - 32, 192, "vaccine").setOrigin(.5).setInteractive({ cursor: 'pointer' });
        vaccineBtn.on('pointerover', function () {
            this.setTint(0xfeae34);
        });
        vaccineBtn.on('pointerout', function () {
            this.clearTint();
        });

        var ambulanceBtn = this.add.image(this.width - 32, 256, "ambulance").setOrigin(.5).setInteractive({ cursor: 'pointer' });
        ambulanceBtn.on('pointerover', function () {
            this.setTint(0xfeae34);
        });
        ambulanceBtn.on('pointerout', function () {
            this.clearTint();
        });

        var posWilmerX = 224;
        for (let i = 0; i < 5; i++) {
            var wilmer = this.add.sprite(posWilmerX - 16, this.height - 30, 'dude');
            wilmer.setName("Wilmer" + 1);
            wilmer.anims.play('idle');
            this.wilmersGrp.add(wilmer);
            posWilmerX += 96;
        }

        this.memok = this.add.sprite(this.width / 2, this.height / 2, 'memok').setOrigin(0.5);
        this.memok.play('fliying');

        this.boss = this.add.sprite(176, 80, 'boss').setOrigin(0.5);
        this.boss.visible = false;

        this.time.addEvent({
            delay: 2000,
            callback: () => {
                textLayer.visible = true;
                this.boss.visible = true;
            },
            loop: false
        });

    }
});

var config = {
    title: "Saving the day",
    type: Phaser.AUTO,
    pixelArt: true,
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'game',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 450
    },
    scene: [preloadScene, titleScene, gameScene],
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
