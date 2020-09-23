var preloadScene = new Phaser.Class({

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
        this.load.image("vaccine", "assets/vaccine.png");
        this.load.image("ambulance", "assets/ambulance.png");
        this.load.image("manager", "assets/manager.png");
        this.load.image("close", "assets/close.png");
        // sprite sheets
        this.load.spritesheet("more-text", "assets/more-text.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("cross", "assets/cross.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("help", "assets/help.png", { frameWidth: 64, frameHeight: 32 });
        this.load.spritesheet("memok", "assets/memok.png", { frameWidth: 48, frameHeight: 64 });
        this.load.spritesheet("wilmer", "assets/wilmer.png", { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet("ada", "assets/ada.png", { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet("evan", "assets/evan.png", { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet("warning", "assets/warning.png", { frameWidth: 8, frameHeight: 16 });
        // Json
        this.load.tilemapTiledJSON("map", "assets/tileMap.json");
        // audio
        this.load.audio("pleasant-creek-loop", ["assets/pleasant-creek-loop.mp3", "assets/pleasant-creek-loop.ogg"]);
        this.load.audio("intro-theme", ["assets/intro-theme.mp3", "assets/intro-theme.ogg"]);

        var width = this.cameras.main.width;
        var height = this.cameras.main.height;

        var progressBar = this.add.graphics();
        var progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect((width / 2) - (320 / 2), (height / 2) - (50 / 2), 320, 50);

        var loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: "Loading...",
            style: {
                font: "28px monospace",
                fill: "#ffffff"
            }
        });

        loadingText.setOrigin(0.5, 0.5);

        var percentText = this.make.text({
            x: width / 2,
            y: height / 2,
            text: "0%",
            style: {
                font: "28px monospace",
                fill: "#ffffff"
            }
        });
        percentText.setOrigin(0.5, 0.5);

        var assetText = this.make.text({
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
            var logo = this.add.image(width / 2, height / 2, "logo");
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
                callback: function () {
                    this.scene.stop("preload");
                    this.scene.start("titleScene");
                }.bind(this),
                loop: false
            });
        }, this);
    }
});

var titleScene = new Phaser.Class({
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

        this.titleBg = this.add.tileSprite(topBackgroundXOrigin, topBackgroundYOrigin, imageBaseWidth, imageBaseHeight, "title-background");
        this.titleBg.setScrollFactor(0);

        this.highwayBg = this.add.tileSprite(topBackgroundXOrigin, this.height - 40, imageBaseWidth, 96, "highway");
        this.highwayBg.setScrollFactor(0);

        var titleText = this.add.bitmapText(this.width / 2, (this.height / 2) - 100, "gem", "Saving the day", 40).setOrigin(0.5);
        titleText.setTint(0xFEAE34);

        var titleTextB = this.add.bitmapText(this.width / 2, (this.height / 2) - 102, "gem", "Saving the day", 40).setOrigin(0.5);
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

        var playBtn = this.add.sprite(this.width / 2, this.height / 2, "button").setOrigin(0.5).setInteractive({ cursor: "pointer" });;
        var playTxt = this.add.bitmapText(playBtn.x, playBtn.y - 10, "gem", "Play", 34).setOrigin(.5);
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

var gameScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:
        function gameScene() {
            Phaser.Scene.call(this, "gameScene");
        },
    preload: function () {
        this.width = this.cameras.main.width;
        this.height = this.cameras.main.height;
        this.delayGeneral = 200;
        this.gameOver = false;
        this.gameStart = false;
        this.delaySpawnPeople;
        this.delaySpawnPeopleMS;
    },
    create: function () {
        // MUSIC
        this.sound.play("pleasant-creek-loop", {
            volume: .5,
            loop: true,
            delay: 0
        });
        // MUSIC
        // ANIMATIONS
        this.anims.create({
            key: "walking",
            frames: this.anims.generateFrameNumbers("ada"),
            frameRate: 4,
            repeat: -1
        });

        this.anims.create({
            key: "fliying",
            frames: this.anims.generateFrameNumbers("memok"),
            frameRate: 4,
            repeat: -1
        });

        this.anims.create({
            key: "idle",
            frames: this.anims.generateFrameNumbers("wilmer"),
            frameRate: 4,
            repeat: -1
        });

        this.anims.create({
            key: "blinking",
            frames: this.anims.generateFrameNumbers("more-text"),
            frameRate: 4,
            repeat: -1
        });

        this.anims.create({
            key: "blinking-info",
            frames: this.anims.generateFrameNumbers("help"),
            frameRate: 4,
            repeat: -1
        });

        this.anims.create({
            key: "blinking-warning",
            frames: this.anims.generateFrameNumbers("warning"),
            frameRate: 2,
            loop: false
        });
        // ANIMATIONS
        // GROUPS AND PLAYERS
        this.progressBarGrp = this.add.group();
        this.wilmersGrp = this.add.group();
        this.peopleGrp = this.add.group();
        this.crossesGrp = this.add.group();
        this.itemsBtnGroup = this.add.group();
        // GROUPS AND PLAYERS
        // BACKGROUND        
        this.cameras.main.setBackgroundColor("#55648C")
        var map = this.make.tilemap({ key: "map" });
        var tileSet = map.addTilesetImage("tileSet", "tileSetImg");
        map.createDynamicLayer("staticObjects", tileSet, 0, 0);
        this.add.bitmapText(this.width - 32, 16, "gem", "items", 22).setOrigin(.5);

        this.rectBackground = this.add.rectangle(this.width / 2, this.height / 2, this.width, this.height, 0x000);
        this.rectBackground.alpha = 0.7;
        this.rectBackground.visible = false;
        this.rectBackground.setDepth(10);

        this.textLayer = map.createDynamicLayer("text", tileSet, 0, 0);
        this.textLayer.visible = false;
        this.textLayer.setDepth(10);

        var surplus = 4;
        var progressBar = this.add.rectangle(this.width - 64 + surplus, 32 + surplus, 56, 56, 0x000).setOrigin(0);
        progressBar.setDepth(4);
        progressBar.alpha = 0.7;
        progressBar.setData({ rechargeTime: 5000 });
        this.progressBarGrp.add(progressBar);

        progressBar = this.add.rectangle(this.width - 64 + surplus, 96 + surplus, 56, 56, 0x000).setOrigin(0);
        progressBar.setDepth(4);
        progressBar.alpha = 0.7;
        progressBar.setData({ rechargeTime: 10000 });
        this.progressBarGrp.add(progressBar);

        progressBar = this.add.rectangle(this.width - 64 + surplus, 160 + surplus, 56, 56, 0x000).setOrigin(0);
        progressBar.setDepth(4);
        progressBar.alpha = 0.7;
        progressBar.setData({ rechargeTime: 15000 });
        this.progressBarGrp.add(progressBar);

        progressBar = this.add.rectangle(this.width - 64 + surplus, 224 + surplus, 56, 56, 0x000).setOrigin(0);
        progressBar.setDepth(4);
        progressBar.alpha = 0.7;
        progressBar.setData({ rechargeTime: 20000 });
        this.progressBarGrp.add(progressBar);

        // BACKGROUND
        // GAME OBJECTS
        this.memok = this.physics.add.sprite(this.width / 2, this.height / 2, "memok").setOrigin(0.5);
        this.memok.play("fliying");
        this.memok.setDepth(9);

        this.warningIcon = this.add.sprite(this.memok.x, this.memok.y - 32, "warning").setOrigin(0.5);
        this.warningIcon.play("blinking-warning");
        this.warningIcon.setDepth(9);

        this.manager = this.add.image(this.width - 32, this.height - 32, "manager").setOrigin(0.5);
        this.manager.visible = false;

        this.manager2 = this.add.image(176, 80, "manager").setOrigin(0.5);
        this.manager2.visible = false;
        this.manager2.setDepth(10);

        var item = this.add.image(this.width - 32, 64, "bucket").setOrigin(.5);
        item.name = "bucketBtn";
        this.itemsBtnGroup.add(item);

        item = this.add.image(this.width - 32, 128, "mask").setOrigin(.5);
        item.name = "maskBtn";
        this.itemsBtnGroup.add(item);

        item = this.add.image(this.width - 32, 192, "vaccine").setOrigin(.5);
        item.name = "vaccineBtn";
        this.itemsBtnGroup.add(item);

        item = this.add.image(this.width - 32, 256, "ambulance").setOrigin(.5);
        item.name = "ambulanceBtn";
        this.itemsBtnGroup.add(item);

        item = this.add.sprite(this.manager.x, this.manager.y - 48, "help").setOrigin(0.5);
        item.name = "helpAlertBtn";
        item.visible = false;
        item.play("blinking-info");
        this.itemsBtnGroup.add(item);

        item = this.add.sprite(624, this.manager2.y + 32, "more-text").setOrigin(0.5);
        item.name = "moreInfoTextBtn";
        item.play("blinking");
        item.visible = false;
        item.setDepth(10);
        this.itemsBtnGroup.add(item);

        item = this.add.image(624, this.manager2.y - 32, "close").setOrigin(0.5);
        item.name = "closeBtn";
        item.visible = false;
        item.setDepth(10);
        this.itemsBtnGroup.add(item);

        this.input.setHitArea(this.itemsBtnGroup.getChildren()).on('pointerover', function (pointer, children) {
            children.forEach(function (child) {
                child.setTint(0xfeae34);
            });
        });

        this.input.setHitArea(this.itemsBtnGroup.getChildren()).on('pointerout', function (pointer, children) {
            children.forEach(function (child) {
                child.clearTint();
            });
        });

        this.input.setHitArea(this.itemsBtnGroup.getChildren()).on('gameobjectdown', function (pointer, child) {
            if (child.name === "helpAlertBtn")
                this.showInfo(true);
            else if (child.name === "closeBtn") {
                this.showInfo(false);
                if (!this.gameStart) {
                    this.updateCrossesOnTheFloor(false);
                    this.time.addEvent({
                        delay: this.delayGeneral,
                        callback: function () {
                            this.gameStart = true;
                            this.spawnPeopleConfig(
                                {
                                    delaySpawnPeople: 4000,
                                    delaySpawnPeopleMS: 4000
                                }
                            );
                        }.bind(this),
                        loop: false
                    });
                }
            }
        }, this);

        var posWilmerX = 224;
        for (var i = 0; i < 5; i++) {
            var wilmer = this.add.sprite(posWilmerX - 16, this.height - 30, "dude");
            wilmer.setName("Wilmer" + i);
            wilmer.anims.play("idle");
            this.wilmersGrp.add(wilmer);
            posWilmerX += 96;
        }

        this.helpAlerTxt = this.add.bitmapText(this.width - 30, this.height - 80, "gem", "INFO!", 14).setOrigin(0.5);
        this.helpAlerTxt.setTint(0x000);
        this.helpAlerTxt.visible = false;

        this.infoTextMain = this.add.bitmapText(this.manager2.x + 32, this.manager2.y - 40, "gem", "", 16);
        this.infoTextMain.visible = false;
        this.infoTextMain.setDepth(10);
        // GAME OBJECTS

        //  Collisions
        this.physics.add.overlap(this.peopleGrp, this.crossesGrp, this.overlapAPlaceInLine, null, this);

        this.time.addEvent({
            delay: this.delayGeneral,
            callback: function () {
                this.showInfo(true);
                this.typeWriterHandler("how to play");
            }.bind(this),
            loop: false
        });
    },
    updateCrossesOnTheFloor: function name(update) {
        if (!update) {
            var posX = 208;
            var posY = this.height - 96;
            var crossIndex = 0;
            var timer = this.time.addEvent({
                delay: 100,
                loop: false,
                repeat: 14,
                callback: function () {
                    var cross = this.physics.add.sprite(posX, posY, "cross").setOrigin(.5);
                    cross.setDepth(1);
                    cross.setFrame(0);
                    cross.setName("cross-" + timer.getRepeatCount());
                    cross.isBusyPlace = false;
                    this.crossesGrp.add(cross);
                    posX += 96;
                    crossIndex++;
                    if (crossIndex >= 5) {
                        crossIndex = 0;
                        posY -= 96;
                        posX = 208;
                    }
                }.bind(this),
            });
        } else {

        }
    },
    showInfo: function (showMainText) {
        this.textLayer.visible = showMainText;
        this.infoTextMain.visible = showMainText;
        this.rectBackground.visible = showMainText;
        this.helpAlerTxt.visible = !showMainText;
        this.manager.visible = !showMainText;
        this.manager2.visible = showMainText;

        this.itemsBtnGroup.children.each(function (child) {
            if (child.name === "closeBtn" || child.name === "moreInfoTextBtn") {
                child.visible = showMainText;
            }
            else if (child.name === "helpAlertBtn")
                child.visible = !showMainText;
        });
    },
    typeWriterHandler: function (action) {
        var textList = [
            {
                action: "how to play",
                text: [
                    "Lorem ipsum dolor sit amet, consectetur adipisci",
                    "aliqua. Ut enim ad minim veniam, quis nostrud ext",
                    "Duis aute irure dolor in reprehenderit in vo repr",
                    "in reprehenderit in voluptate velit esse cillum d",
                    "sunt in culpa qui officia deserunt mollit anim id"
                ]
            }
        ];

        var textIndex = textList.findIndex(x => x.action === action);
        textList[textIndex].text;

        for (var index = 0; index < textList[textIndex].text.length; index++) {
            this.infoTextMain.text += textList[textIndex].text[index] + "\n";
        }
    },
    spawnPeopleConfig: function (config) {
        this.delaySpawnPeopleMS = config.delaySpawnPeopleMS;
        this.delaySpawnPeople = config.delaySpawnPeople;
    },
    spawnPeople: function (time) {
        var person = this.physics.add.sprite(368, 0, "ada").setOrigin(.5);
        // var personChose = Phaser.Math.Between(0, 1);
        person.name = "name-" + parseInt((time / 1000));
        person.setDepth(2);
        person.play("walking");
        this.peopleGrp.add(person);
        return person;
    },
    placesAvailableOnTheLine: function () {
        var crossesPosList = [];
        this.crossesGrp.children.each(function (child) {
            crossesPosList.push({
                name: child.name,
                x: child.x,
                y: child.y,
                isBusyPlace: child.isBusyPlace
            })
        });
        crossesPosList.sort(function (a, b) {
            if (a.y < b.y) {
                return 1;
            }
            if (a.y > b.y) {
                return -1;
            }
            return 0;
        });

        var firtsElement = crossesPosList.find(v => v.isBusyPlace === false);

        var availableCrosses = crossesPosList.filter(function (cross) {
            return cross.y === firtsElement.y && !cross.isBusyPlace;
        });

        return availableCrosses;
    },
    isThePlaceIsAvailable: function (cross) {
        var availableCrosses = this.placesAvailableOnTheLine();
        var place = availableCrosses.find(v => v.name === cross.name);
        return place ? true : false;
    },
    findAplaceOnTheLine: function (person) {
        var availableCrosses = this.placesAvailableOnTheLine();
        var value = Phaser.Math.Between(0, availableCrosses.length - 1);
        var cross = this.crossesGrp.getChildren().find(v => v.name === availableCrosses[value].name);
        this.physics.moveToObject(person, cross, 100);
    },
    overlapAPlaceInLine: function (person, cross) {
        if (person.x > cross.x - 8 &&
            person.x < cross.x + 8 &&
            person.y > cross.y - 8 &&
            person.y < cross.y + 8 &&
            !cross.isBusyPlace) {
            if (this.isThePlaceIsAvailable(cross)) {
                person.setVelocity(0);
                cross.isBusyPlace = true;
            }
        }
    },
    update: function (time, delta) {
        if (this.gameOver || !this.gameStart)
            return;

        this.delaySpawnPeople -= delta;
        if (this.delaySpawnPeople < 0) {
            this.delaySpawnPeople = 40000;
            var person = this.spawnPeople(time);
            this.findAplaceOnTheLine(person);
        }

    }
});

var config = {
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
