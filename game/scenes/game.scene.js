import * as action from "./scene.actions.js"
import CONST from "./const.js"
const gameScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:
        function gameScene() {
            Phaser.Scene.call(this, "gameScene");
        },
    preload: function () {

        // binding actions to thins scene
        this.createAnimations = action.createAnimations.bind(this);
        this.showModalInfo = action.showModalInfo.bind(this);
        this.typeWriterHandler = action.typeWriterHandler.bind(this);
        this.uptateGameProgress = action.uptateGameProgress.bind(this);
        this.findAplaceOnTheLine = action.findAplaceOnTheLine.bind(this);
        this.moveMemok = action.moveMemok.bind(this);
        this.spawnGuest = action.spawnGuest.bind(this);
        this.resetGamePlay = action.resetGamePlay.bind(this);
        this.updateCrossesOnTheFloor = action.updateCrossesOnTheFloor.bind(this);

        // game config
        this.width = this.cameras.main.width;
        this.height = this.cameras.main.height;
        this.mouse = this.input.mousePointer;
        this.gamePlay = this.resetGamePlay();

        // tutorial has been showed for first time
        this.firstTimeTutorial = true;
    },
    create: function () {
        // // MUSIC
        // this.sound.play("pleasant-creek-loop", {
        //     volume: .5,
        //     loop: true,
        // });
        // // MUSIC        

        // GROUPS
        const itemsBtnGroupNamesList = ['bucket', 'mask', 'hand', 'battery'];
        this.itemsBtnGroup = this.add.group();
        this.rechargeTimeBarGrp = this.add.group();
        this.wilmersGrp = this.add.group();
        this.liveBarWilmerGrp = this.add.group();
        this.waitingTextGrp = this.add.group();
        this.waitingGearGrp = this.add.group();
        this.guestsGrp = this.add.group();
        this.crossesGrp = this.add.group();
        this.areaGrp = this.physics.add.staticGroup();
        const areaGrpNamesList = [
            { name: 'memok-area', x: 112, y: 294 },
            { name: 'exit-left', x: 120, y: 362 },
            { name: 'exit-right', x: 648, y: 362 }];
        // GROUPS

        // BACKGROUND        
        this.cameras.main.setBackgroundColor("#55648C")
        const map = this.make.tilemap({ key: "map" });
        const tileSet = map.addTilesetImage("tileSet", "tileSetImg");
        map.createDynamicLayer("staticObjects", tileSet, 0, 0);
        this.add.bitmapText(this.width - 32, 16, "gem", "items", 22).setOrigin(.5);

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
            rechargeTimeBar.setDepth(5);
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

        /// graphic indicators
        this.selectedItem = this.add.sprite(-100, -100, "selected-item").setOrigin(.5);
        this.selectedItem.setDepth(4);
        this.selectedItem.play(CONST.ANIM.BLINK + "-selected-item");

        this.selectedCross = this.add.sprite(-100, -100, "selected-item").setOrigin(.5);
        this.selectedCross.setDepth(1);
        this.selectedCross.play(CONST.ANIM.BLINK + "-selected-item");
        this.selectedCross.setScale(.7);

        this.selectedGuest = this.add.sprite(-100, -100, "selected-guest").setOrigin(.5);
        this.selectedGuest.setDepth(1);
        this.selectedGuest.play(CONST.ANIM.BLINK + "-selected-guest");

        this.arrowDown = this.add.sprite(-100, -100, "arrow-down").setOrigin(.5);
        this.arrowDown.setDepth(11);
        this.arrowDown.play(CONST.ANIM.BLINK + "-arrow-down");

        this.arrowRight = this.add.sprite(-100, -100, "arrow-down").setOrigin(0.5);
        this.arrowRight.setDepth(11);
        this.arrowRight.play(CONST.ANIM.BLINK + "-arrow-down");
        this.arrowRight.angle = -90;

        this.graphics = this.add.graphics({ lineStyle: { width: 2, color: 0x00D998 } });
        this.moveToLine = new Phaser.Geom.Line(0, 0, 0, 0);
        /// graphic indicators
        // BACKGROUND

        // GAME OBJECTS
        this.memok = this.physics.add.sprite(this.width / 2, this.height / 2, "memok").setOrigin(0.5);
        this.memok.play(CONST.ANIM.FLY + "-memok");
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

        let item = this.add.sprite(this.manager.x, this.manager.y - 48, "help-alert").setOrigin(0.5).setInteractive({ cursor: "pointer" });
        item.name = "helpAlertBtn";
        item.visible = false;
        item.play(CONST.ANIM.BLINK + "-help-alert");
        item.setDepth(2);
        this.itemsBtnGroup.add(item);

        item = this.add.sprite(624, this.manager2.y + 32, "show-more-text").setOrigin(0.5).setInteractive({ cursor: "pointer" });
        item.name = "showMoreInfoBtn";
        item.play(CONST.ANIM.BLINK + "-show-more-text");
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
            const wilmer = this.add.sprite(posWilmerX - 16, this.height - 30, "wilmer").setInteractive({ cursor: "pointer" });
            wilmer.name = "wilmer-" + i;
            wilmer.anims.play(CONST.ANIM.IDLE + "-wilmer");
            this.wilmersGrp.add(wilmer);
            posWilmerX += 96;

            this.add.rectangle(wilmer.x + 14, wilmer.y - 9, 10, 18, 0x000).setOrigin(0);
            let liveBarWilmer = this.add.rectangle(wilmer.x + 22, wilmer.y + 8, 6, i === 2 ? 8 : 16, 0x05DA73).setOrigin(0);
            liveBarWilmer.setDepth(1);
            liveBarWilmer.name = "liveBarWilmer-" + i;
            liveBarWilmer.delay = 10000;
            liveBarWilmer.delayConst = 10000;
            liveBarWilmer.angle = 180;
            this.liveBarWilmerGrp.add(liveBarWilmer);

            let waitingGear = this.add.sprite(wilmer.x, this.height - 64, "gears");
            waitingGear.setScale(.5);
            waitingGear.setDepth(5);
            waitingGear.name = "waitingGear-" + i;
            waitingGear.play(CONST.ANIM.WAIT + "-arrow-gears");
            waitingGear.visible = false;
            this.waitingGearGrp.add(waitingGear);

            let waitingText = this.add.bitmapText(wilmer.x, this.height - 64, "gem", "0", 15).setOrigin(.5);
            waitingText.setDepth(5);
            waitingText.name = "waitingText-" + i;
            waitingText.visible = false;
            this.waitingTextGrp.add(waitingText);
        }

        this.helpAlerTxt = this.add.bitmapText(this.width - 30, this.height - 80, "gem", "HELP", 14).setOrigin(0.5);
        this.helpAlerTxt.setTint(0x000);
        this.helpAlerTxt.visible = false;
        this.helpAlerTxt.setDepth(4)

        this.infoMainTxt = this.add.bitmapText(this.manager2.x + 32, this.manager2.y - 40, "gem", "", 16);
        this.infoMainTxt.visible = false;
        this.infoMainTxt.setDepth(10);
        // GAME OBJECTS

        //  COLLISIONS
        this.physics.add.overlap(this.guestsGrp, this.guestsGrp, action.overlapGuests, null, this);
        this.physics.add.overlap(this.guestsGrp, this.crossesGrp, action.overlapAPlaceInLine, null, this);
        this.physics.add.overlap(this.memok, this.areaGrp, action.overlapAreas, null, this);
        this.physics.add.overlap(this.guestsGrp, this.areaGrp, action.overlapAreas, null, this);
        //  COLLISIONS

        // EVENTS
        this.input.on('gameobjectdown', (pointer, child) => {
            if (child.name === "helpAlertBtn") {
                this.gamePlay.stepTutorialModal = 1;
                this.showModalInfo(true);
                this.typeWriterHandler({ arrayText: CONST.TUTORIAL.RULES[this.gamePlay.stepTutorialModal], textObj: this.infoMainTxt });
            }
            else if (child.name === "closeModalBtn") {
                this.gamePlay.stepTutorialModal = -1;
                this.showModalInfo(false);
                if (!this.gamePlay.gameStart) {
                    this.warningIcon.play(CONST.ANIM.BLINK + "-warning");
                    this.updateCrossesOnTheFloor();
                    this.gamePlay.gameStart = true;
                    this.moveMemok();
                }
            }
            else if (child.name === "showMoreInfoBtn" && !this.gamePlay.infoTutorialIsTyping) {
                if (this.gamePlay.stepTutorialModal < CONST.TUTORIAL_COMPLETED) {
                    this.warningIcon.play(CONST.ANIM.BLINK + "-warning");
                    this.showModalInfo(true);
                    this.gamePlay.stepTutorialModal++;
                    this.uptateGameProgress();
                    this.typeWriterHandler({ arrayText: CONST.TUTORIAL.RULES[this.gamePlay.stepTutorialModal], textObj: this.infoMainTxt });
                } else {
                    this.gamePlay.stepTutorialModal = -1;
                    this.showModalInfo(false);
                    if (!this.gamePlay.gameStart) {
                        this.warningIcon.play(CONST.ANIM.BLINK + "-warning");
                        this.time.addEvent({
                            delay: this.gamePlay.delayGeneral,
                            callback: () => {
                                this.gamePlay.gameStart = true;
                                this.moveMemok();
                            },
                            loop: false
                        });
                    }
                }
            }
            else if (child.name === "bucketBtn" && (this.gamePlay.stepTutorialModal === 2 || this.gamePlay.stepTutorialModal === -1)) {
                this.selectedItem.setPosition(child.x, child.y);
                this.selectedItem.name = "bucketBtn";
            }
            else if (child.name === "maskBtn" && (this.gamePlay.stepTutorialModal === 3 || this.gamePlay.stepTutorialModal === -1)) {
                this.selectedItem.setPosition(child.x, child.y);
                this.selectedItem.name = "maskBtn";
            }
            else if (child.name === "handBtn" && (this.gamePlay.stepTutorialModal === 4 || this.gamePlay.stepTutorialModal === -1)) {
                this.selectedItem.setPosition(child.x, child.y);
                this.selectedItem.name = "handBtn";
            }
            else if (child.name === "batteryBtn" && (this.gamePlay.stepTutorialModal === 5 || this.gamePlay.stepTutorialModal === -1)) {
                this.selectedItem.setPosition(child.x, child.y);
                this.selectedItem.name = "batteryBtn";
            } else if (child.name.includes("cross") && this.selectedItem.name === "bucketBtn")
                child.setFrame(0);
            else if (child.name.includes("cross") && this.selectedItem.name === "handBtn" && this.selectedItem.touchedItem) {
                if (child.footsteps < 4) {
                    this.physics.moveToObject(this.selectedItem.touchedItem, child, 50);
                    this.selectedItem.touchedItem = null;
                }
            } else if (child.name.includes("guest") && this.selectedItem.name === "handBtn") {
                this.selectedGuest.setPosition(child.x, child.y);
                this.selectedItem.touchedItem = child;
                if (this.gamePlay.stepTutorialModal > 0) {
                    this.selectedGuest.setDepth(11);
                    this.graphics.setDepth(10)
                }
            } else if (child.name.includes("guest") && this.selectedItem.name === "maskBtn") {
                const currentAnimation = child.anims.getCurrentKey();
                const animationMask = !currentAnimation.includes("mask") ? currentAnimation + "-mask" : currentAnimation;
                child.play(animationMask);
            } else if (child.name.includes("wilmer") && this.selectedItem.name === "batteryBtn") {
                const liveBarWilmer = this.liveBarWilmerGrp.getChildren().find(v => v.name === "liveBarWilmer-" + child.name.split("-")[1]);
                liveBarWilmer.height = 16;
            }
        });

        this.input.on('pointerover', (pointer, children) => {
            if (this.selectedItem.name === "bucketBtn" || (this.selectedItem.name === "handBtn" && this.selectedGuest.x > 0))
                children.forEach((child) => {
                    if (child.name.includes("cross") && child.footsteps < 4)
                        this.selectedCross.setPosition(child.x, child.y);
                    if (this.gamePlay.stepTutorialModal > 0)
                        this.selectedCross.setDepth(11);
                });
            if (this.selectedItem.name === "maskBtn" || this.selectedItem.name === "handBtn")
                children.forEach((child) => {
                    if (child.name.includes("guest")) {
                        this.selectedGuest.setPosition(child.x, child.y);
                        this.selectedGuest.child = child;
                        if (this.gamePlay.stepTutorialModal > 0)
                            this.selectedGuest.setDepth(11);
                    }
                });
            if (this.selectedItem.name === "batteryBtn")
                children.forEach((child) => {
                    if (child.name.includes("wilmer")) {
                        this.selectedGuest.setPosition(child.x, child.y);
                        if (this.gamePlay.stepTutorialModal > 0)
                            this.selectedGuest.setDepth(11);
                    }
                });
        });

        this.input.on('pointerout', (pointer, children) => {
            this.selectedCross.setPosition(-100, -100);
            this.selectedCross.setDepth(1);
            if (this.selectedItem.name !== "handBtn" || (this.selectedItem.name === "handBtn" && !this.selectedItem.touchedItem)) {
                this.selectedGuest.setPosition(-100, -100);
                this.selectedGuest.setDepth(1);
            }
        });

        // EVENTS

        // START GAME
        this.time.addEvent({
            delay: this.gamePlay.delayGeneral,
            callback: () => {
                this.gamePlay.stepTutorialModal = 1;
                this.showModalInfo(true);
                this.typeWriterHandler({ arrayText: CONST.TUTORIAL.RULES[this.gamePlay.stepTutorialModal], textObj: this.infoMainTxt });
                this.warningIcon.setFrame(0);
            },
            loop: false
        });
        // START GAME
    },
    update: function (time, delta) {

        //GAME LOOP
        if (!this.gamePlay.gameOver && this.gamePlay.gameStart && this.gamePlay.pause === CONST.PAUSE.FALSE) {

            this.gamePlay.delaySpawnGuest -= delta;
            if (this.gamePlay.delaySpawnGuest < 0) {
                this.gamePlay.delaySpawnGuest = this.gamePlay.delaySpawnGuestConst;
                const guest = this.spawnGuest(time);
                guest.name = "guest-" + parseInt((time / 1000));
                this.warningIcon.setFrame(0);
                this.warningIcon.play(CONST.ANIM.BLINK + "-warning");
                this.findAplaceOnTheLine(guest);
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
        }

        if (this.selectedItem.name === "handBtn" && this.selectedGuest.x > 0 && this.selectedGuest.child)
            this.selectedGuest.setPosition(this.selectedGuest.child.x, this.selectedGuest.child.y);

        this.waitingTextGrp.children.each((child) => {
            if (child.visible) {
                child.delay -= delta;
                if (child.delay <= 0) {
                    child.delay = 0;
                    const areaDir = Phaser.Math.Between(0, 1) === 1 ? "left" : "right";
                    let area = this.areaGrp.getChildren().find(v => v.name === "exit-" + areaDir);
                    child.registeredGuest.exit = area.name;
                    this.physics.moveToObject(child.registeredGuest, area, 50);
                    child.visible = false;
                    let waitingGear = this.waitingGearGrp.getChildren().find(v => v.name === "waitingGear" + "-" + child.name.split("-")[1]);
                    waitingGear.visible = false;
                }
                else {
                    child.text = parseInt(child.delay / 1000);
                }
            }
        });

        this.graphics.clear();
        if (this.selectedGuest.x > 0 && this.selectedItem.name === "handBtn" && this.selectedItem.touchedItem) {
            let lastPost = {
                x: this.mouse.position.x < this.selectedGuest.x ? 192 : this.width - 192,
                y: this.mouse.position.y < this.selectedGuest.y ? 160 : this.height - 64
            };
            if (this.mouse.position.x > 192 && this.mouse.position.x < this.width - 192)
                lastPost.x = this.mouse.position.x;
            if (this.mouse.position.y > 160 && this.mouse.position.y < this.height - 64)
                lastPost.y = this.mouse.position.y;

            this.graphics.clear();
            this.graphics.strokeLineShape(this.moveToLine);
            this.moveToLine.setTo(this.selectedGuest.x, this.selectedGuest.y, lastPost.x, lastPost.y);
        }

        this.guestsGrp.children.each(function (child) {

            if (child.status === CONST.GUEST_STATUS.REGISTERED)
                child.setVelocityY(20);

            if (!child.isOverlaping)
                child.throughACross = false;

            child.isOverlaping = false;
        });
        //GAME LOOP
    }
});

export default gameScene;