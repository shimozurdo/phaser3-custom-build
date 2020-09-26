import { uptateGameProgress, collideGuests, overlapAreas, overlapAPlaceInLine, showRules, typeWriterHandler, spawnGuest, findAplaceOnTheLine, moveMemok } from "./gameActions.js"
const gameScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:
        function gameScene() {
            Phaser.Scene.call(this, "gameScene");
        },
    preload: function () {
        this.width = this.cameras.main.width;
        this.height = this.cameras.main.height;
        this.gamePlay = {
            delayGeneral: 500,
            level: 1,
            score: 0,
            registeredGuests: 0,
            delaySpawnGuest: 400,
            delaySpawnGuestConst: 4000,
            stepTutorialModal: -1,
            gameOver: false,
            gameStart: false,
            infoTutorialIsTyping: false
        }
        this.mouse = this.input.mousePointer;
    },
    create: function () {
        // // MUSIC
        // this.sound.play("pleasant-creek-loop", {
        //     volume: .5,
        //     loop: true,
        // });
        // // MUSIC

        // ANIMATIONS
        //It will improve

        this.anims.create({
            key: "walking-ada",
            frames: this.anims.generateFrameNumbers("ada"),
            frameRate: 4,
            repeat: -1
        });

        this.anims.create({
            key: "walking-ada-mask",
            frames: this.anims.generateFrameNumbers("ada-mask"),
            frameRate: 4,
            repeat: -1
        });

        this.anims.create({
            key: "walking-ada-sick",
            frames: this.anims.generateFrameNumbers("ada-sick"),
            frameRate: 4,
            repeat: -1
        });

        this.anims.create({
            key: "walking-ada-sick-mask",
            frames: this.anims.generateFrameNumbers("ada-sick-mask"),
            frameRate: 4,
            repeat: -1
        });

        this.anims.create({
            key: "walking-evan",
            frames: this.anims.generateFrameNumbers("evan"),
            frameRate: 4,
            repeat: -1
        });

        this.anims.create({
            key: "walking-evan-mask",
            frames: this.anims.generateFrameNumbers("evan-mask"),
            frameRate: 4,
            repeat: -1
        });

        this.anims.create({
            key: "walking-evan-sick",
            frames: this.anims.generateFrameNumbers("evan-sick"),
            frameRate: 4,
            repeat: -1
        });

        this.anims.create({
            key: "walking-evan-sick-mask",
            frames: this.anims.generateFrameNumbers("evan-sick-mask"),
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
            frames: this.anims.generateFrameNumbers("help-alert"),
            frameRate: 4,
            repeat: -1
        });

        this.anims.create({
            key: "blinking-warning",
            frames: this.anims.generateFrameNumbers("warning"),
            frameRate: 8
        });

        this.anims.create({
            key: "blinking-selected-item",
            frames: this.anims.generateFrameNumbers("selected-item"),
            frameRate: 4,
            repeat: -1
        });

        this.anims.create({
            key: "blinking-selected-guest",
            frames: this.anims.generateFrameNumbers("selected-guest"),
            frameRate: 4,
            repeat: -1
        });

        this.anims.create({
            key: "blinking-arrow-down",
            frames: this.anims.generateFrameNumbers("arrow-down"),
            frameRate: 4,
            repeat: -1
        });
        // ANIMATIONS

        // GROUPS
        const itemsBtnGroupNamesList = ['bucket', 'mask', 'hand', 'battery'];
        this.itemsBtnGroup = this.add.group();
        this.rechargeTimeBarGrp = this.add.group();
        this.wilmersGrp = this.add.group();
        this.liveBarWilmerGrp = this.add.group();
        this.guestsGrp = this.add.group();
        this.crossesGrp = this.add.group();
        this.areaGrp = this.physics.add.staticGroup();
        this.areaGrp.name = "areaGrp";
        const areaGrpNamesList = [{ name: 'memok-area', x: 112, y: 294 }, { name: 'exit-1', x: 120, y: 362 }, { name: 'exit-2', x: 648, y: 362 }];
        // GROUPS

        // BACKGROUND        
        this.cameras.main.setBackgroundColor("#55648C")
        const map = this.make.tilemap({ key: "map" });
        const tileSet = map.addTilesetImage("tileSet", "tileSetImg");
        map.createDynamicLayer("staticObjects", tileSet, 0, 0);
        this.add.bitmapText(this.width - 32, 16, "gem", "items", 22).setOrigin(.5);
        // map.setCollisionBetween(10, 15, true, null, 1);

        this.rectBackground = this.add.rectangle(this.width / 2, this.height / 2, this.width, this.height, 0x000);
        this.rectBackground.alpha = 0.5;
        this.rectBackground.visible = false;
        this.rectBackground.setDepth(9);

        this.textLayer = map.createDynamicLayer("text", tileSet, 0, 0);
        this.textLayer.visible = false;
        this.textLayer.setDepth(9);

        const surplus = 4;
        this.sizeRTB = 56;

        for (let i = 0; i < itemsBtnGroupNamesList.length; i++) {
            let posY = 32;
            let rechargeTimeBar = this.add.rectangle(this.width - 64 + surplus, (i === 0 ? posY : posY + (i * 64)) + surplus, this.sizeRTB, this.sizeRTB, 0x000).setOrigin(0);
            rechargeTimeBar.setDepth(4);
            rechargeTimeBar.name = itemsBtnGroupNamesList[i] + "RTB";
            rechargeTimeBar.alpha = 0.7;
            rechargeTimeBar.delay = 10000;
            rechargeTimeBar.delayConst = 10000;
            this.rechargeTimeBarGrp.add(rechargeTimeBar);
        }

        areaGrpNamesList.forEach(element => {
            let area = this.add.sprite(element.x, element.y, "cross").setOrigin(.5);
            area.visible = false;
            area.name = element.name;
            this.areaGrp.add(area);
        });

        // graphic indicators
        this.selectedItem = this.add.sprite(-100, -100, "selected-item").setOrigin(.5);
        this.selectedItem.setDepth(4);
        this.selectedItem.play("blinking-selected-item");

        this.selectedCross = this.add.sprite(-100, -100, "selected-item").setOrigin(.5);
        this.selectedCross.setDepth(1);
        this.selectedCross.play("blinking-selected-item");
        this.selectedCross.setScale(.7);

        this.selectedGuest = this.add.sprite(-100, -100, "selected-guest").setOrigin(.5);
        this.selectedGuest.setDepth(1);
        this.selectedGuest.play("blinking-selected-guest");

        this.arrowDown = this.add.sprite(-100, -100, "arrow-down").setOrigin(.5);
        this.arrowDown.setDepth(11);
        this.arrowDown.play("blinking-arrow-down");

        this.arrowRight = this.add.sprite(-100, -100, "arrow-down").setOrigin(0.5);
        this.arrowRight.setDepth(11);
        this.arrowRight.play("blinking-arrow-down");
        this.arrowRight.angle = -90;

        const block = this.physics.add.image(144, 384, "").setOrigin(0);
        block.scaleX = 15;
        block.visible = false;

        this.graphics = this.add.graphics({ lineStyle: { width: 2, color: 0x00D998 } });
        this.moveToLine = new Phaser.Geom.Line(0, 0, 0, 0);
        // BACKGROUND

        // GAME OBJECTS
        this.memok = this.physics.add.sprite(this.width / 2, this.height / 2, "memok").setOrigin(0.5);
        this.memok.play("fliying");
        this.memok.setDepth(9);

        this.warningIcon = this.add.sprite(this.memok.x, this.memok.y - 32, "warning").setOrigin(0.5);
        this.warningIcon.setFrame(4);
        this.warningIcon.setDepth(9);

        this.manager = this.add.image(this.width - 32, this.height - 32, "manager").setOrigin(0.5);
        this.manager.visible = false;

        this.manager2 = this.add.image(176, 80, "manager").setOrigin(0.5);
        this.manager2.visible = false;
        this.manager2.setDepth(10);

        for (let i = 0; i < itemsBtnGroupNamesList.length; i++) {
            let posY = 64;
            let item = this.add.image(this.width - 32, (i === 0 ? posY : posY + (i * 64)), itemsBtnGroupNamesList[i]).setOrigin(.5).setInteractive({ cursor: "pointer" });
            item.name = itemsBtnGroupNamesList[i] + "Btn";
            this.itemsBtnGroup.add(item);
        }

        let item = this.add.sprite(this.manager.x, this.manager.y - 48, "help-alert").setOrigin(0.5);
        item.name = "helpAlertBtn";
        item.visible = false;
        item.play("blinking-info");
        this.itemsBtnGroup.add(item);

        item = this.add.sprite(624, this.manager2.y + 32, "more-text").setOrigin(0.5).setInteractive({ cursor: "pointer" });
        item.name = "showMoreInfoBtn";
        item.play("blinking");
        item.visible = false;
        item.setDepth(10);
        this.itemsBtnGroup.add(item);

        item = this.add.image(624, this.manager2.y - 32, "close").setOrigin(0.5).setInteractive({ cursor: "pointer" });
        item.name = "closeModalBtn";
        item.visible = false;
        item.setDepth(10);
        this.itemsBtnGroup.add(item);

        let posWilmerX = 224;
        for (let i = 0; i < 5; i++) {
            const wilmer = this.add.sprite(posWilmerX - 16, this.height - 30, "dude");
            wilmer.name = "wilmer";
            wilmer.anims.play("idle");
            this.wilmersGrp.add(wilmer);
            posWilmerX += 96;

            this.add.rectangle(wilmer.x + 14, wilmer.y - 9, 10, 18, 0x000).setOrigin(0);
            let liveBarWilmer = this.add.rectangle(wilmer.x + 22, wilmer.y + 8, 6, i === 2 ? 8 : 16, 0x05DA73).setOrigin(0);
            liveBarWilmer.setDepth(1);
            liveBarWilmer.name = "liveBarWilmer" + i;
            liveBarWilmer.delay = 10000;
            liveBarWilmer.delayConst = 10000;
            liveBarWilmer.angle = 180;
            this.liveBarWilmerGrp.add(liveBarWilmer);
        }

        this.helpAlerTxt = this.add.bitmapText(this.width - 30, this.height - 80, "gem", "INFO!", 14).setOrigin(0.5);
        this.helpAlerTxt.setTint(0x000);
        this.helpAlerTxt.visible = false;

        this.infoTextMain = this.add.bitmapText(this.manager2.x + 32, this.manager2.y - 40, "gem", "", 16);
        this.infoTextMain.visible = false;
        this.infoTextMain.setDepth(10);
        // GAME OBJECTS

        //  COLLISIONS
        this.physics.add.collider(this.guestsGrp, this.guestsGrp, collideGuests, null, this);
        this.physics.add.overlap(this.guestsGrp, this.crossesGrp, overlapAPlaceInLine, null, this);
        this.physics.add.overlap(this.memok, this.areaGrp, overlapAreas, null, this);
        this.physics.add.collider(this.guestsGrp, block);
        //  COLLISIONS

        // EVENTS
        this.input.on('gameobjectdown', function (pointer, child) {
            if (child.name === "helpAlertBtn")
                showRules.call(this, true);
            else if (child.name === "closeModalBtn") {
                this.warningIcon.play("blinking-warning");
                this.gamePlay.stepTutorialModal = 1;
                showRules.call(this, false);
                if (!this.gamePlay.gameStart) {
                    this.time.addEvent({
                        delay: this.gamePlay.delayGeneral,
                        callback: function () {
                            this.gamePlay.gameStart = true;
                            moveMemok.call(this);
                        }.bind(this),
                        loop: false
                    });
                }
            }
            else if (child.name === "showMoreInfoBtn" && !this.gamePlay.infoTutorialIsTyping) {
                this.warningIcon.play("blinking-warning");
                showRules.call(this, true);
                this.gamePlay.stepTutorialModal++;
                uptateGameProgress.call(this);
                typeWriterHandler.call(this, { name: "rules", desc: "desc" + this.gamePlay.stepTutorialModal });
            }
            else if (child.name === "bucketBtn" && (this.gamePlay.stepTutorialModal === 2 || this.gamePlay.stepTutorialModal === -1)) {
                this.selectedItem.setPosition(child.x, child.y);
                this.selectedItem.name = "bucketBtn";
                if (this.gamePlay.stepTutorialModal === 2)
                    this.selectedItem.setDepth(11);
            }
            else if (child.name === "maskBtn" && (this.gamePlay.stepTutorialModal === 3 || this.gamePlay.stepTutorialModal === -1)) {
                this.selectedItem.setPosition(child.x, child.y);
                this.selectedItem.name = "maskBtn";
                if (this.gamePlay.stepTutorialModal === 3)
                    this.selectedItem.setDepth(11);
            }
            else if (child.name === "handBtn" && (this.gamePlay.stepTutorialModal === 4 || this.gamePlay.stepTutorialModal === -1)) {
                this.selectedItem.setPosition(child.x, child.y);
                this.selectedItem.name = "handBtn";
                if (this.gamePlay.stepTutorialModal === 4)
                    this.selectedItem.setDepth(11);
            }
            if (child.name.includes("cross") && this.selectedItem.name === "bucketBtn")
                child.setFrame(0);
            if (child.name.includes("cross") && this.selectedItem.name === "handBtn" && this.selectedItem.touchedItem) {
                this.physics.moveToObject(this.selectedItem.touchedItem, child, 50);
                this.selectedItem.touchedItem = null;
                this.arrowDown.setPosition(-100, -100);
            }
            if (child.name.includes("guest") && this.selectedItem.name === "handBtn") {
                this.selectedGuest.setPosition(child.x, child.y);
                this.selectedItem.touchedItem = child;
                if (this.gamePlay.stepTutorialModal > 0) {
                    this.selectedGuest.setDepth(11);
                    this.graphics.setDepth(10)
                }
            }
            if (child.name.includes("guest") && this.selectedItem.name === "maskBtn") {
                const currentAnimation = child.anims.getCurrentKey();
                const animationMask = !currentAnimation.includes("mask") ? currentAnimation + "-mask" : currentAnimation;
                child.play(animationMask);
            }
        }, this);

        this.input.on('pointerover', function (pointer, children) {
            if (this.selectedItem.name === "bucketBtn" || (this.selectedItem.name === "handBtn" && this.selectedGuest.x > 0))
                children.forEach(function (cross) {
                    if (cross.name.includes("cross") && cross.footsteps > 0)
                        this.selectedCross.setPosition(cross.x, cross.y);
                    if (this.gamePlay.stepTutorialModal > 0)
                        this.selectedCross.setDepth(11);
                }, this);
            if (this.selectedItem.name === "maskBtn" || this.selectedItem.name === "handBtn")
                children.forEach(function (guest) {
                    if (guest.name.includes("guest")) {
                        this.selectedGuest.setPosition(guest.x, guest.y);
                        if (this.gamePlay.stepTutorialModal > 0)
                            this.selectedGuest.setDepth(11);
                    }
                }, this);
        }, this);

        this.input.on('pointerout', function (pointer, children) {
            this.selectedCross.setPosition(-100, -100);
            this.selectedCross.setDepth(1);
            if (this.selectedItem.name !== "handBtn" || (this.selectedItem.name === "handBtn" && !this.selectedItem.touchedItem)) {
                this.selectedGuest.setPosition(-100, -100);
                this.selectedGuest.setDepth(1);
            }
        }, this);

        // EVENTS

        // START GAME
        this.time.addEvent({
            delay: this.gamePlay.delayGeneral,
            callback: function () {
                this.gamePlay.stepTutorialModal = 1;
                showRules.call(this, true);
                typeWriterHandler.call(this, { name: "rules", desc: "desc" + this.gamePlay.stepTutorialModal });
                this.warningIcon.setFrame(0);
            }.bind(this),
            loop: false
        });
        // START GAME
    },
    update: function (time, delta) {
        this.graphics.clear();
        if (this.selectedGuest.x > 0 && this.selectedItem.name === "handBtn" && this.selectedItem.touchedItem) {
            let lastPost = {
                x: this.mouse.position.x < this.selectedGuest.x ? 200 : this.width - 200,
                y: this.mouse.position.y < this.selectedGuest.y ? 150 : this.height - 80
            };
            if (this.mouse.position.x > 200 && this.mouse.position.x < this.width - 200)
                lastPost.x = this.mouse.position.x;
            if (this.mouse.position.y > 150 && this.mouse.position.y < this.height - 80)
                lastPost.y = this.mouse.position.y;

            this.graphics.clear();
            this.graphics.strokeLineShape(this.moveToLine);
            this.moveToLine.setTo(this.selectedGuest.x, this.selectedGuest.y, lastPost.x, lastPost.y);
        }

        //GAME LOOP
        if (this.gamePlay.gameOver || !this.gamePlay.gameStart)
            return;

        this.gamePlay.delaySpawnGuest -= delta;
        if (this.gamePlay.delaySpawnGuest < 0) {
            this.gamePlay.delaySpawnGuest = this.gamePlay.delaySpawnGuestConst;
            const guest = spawnGuest.call(this, time);
            guest.name = "guest-" + parseInt((time / 1000));
            this.warningIcon.setFrame(0);
            this.warningIcon.play("blinking-warning");
            findAplaceOnTheLine.call(this, guest);
        }

        this.rechargeTimeBarGrp.children.each((rechargeTimeBar) => {
            rechargeTimeBar.delay -= delta;
            if (rechargeTimeBar.delay <= 0)
                rechargeTimeBar.width = 0;
            else {
                rechargeTimeBar.width = this.sizeRTB * rechargeTimeBar.delay / rechargeTimeBar.delayConst;
            }
        });

        this.liveBarWilmerGrp.children.each((liveBarWilmer) => {
            liveBarWilmer.delay -= delta;
            if (liveBarWilmer.delay <= 0)
                liveBarWilmer.height = 0;
            else {
                liveBarWilmer.height = 16 * liveBarWilmer.delay / liveBarWilmer.delayConst;
            }
        });

        // pinned sprites
        this.warningIcon.setPosition(this.memok.x, this.memok.y - 32);
        // pinned sprites   

        this.guestsGrp.children.each(function (guest) {
            if (!guest.isOverlaping)
                guest.throughACross = false;

            guest.isOverlaping = false;
        });
        //GAME LOOP
    }
});

export default gameScene;