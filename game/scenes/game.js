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
            delayGeneral: 200,
            level: 1,
            score: 0,
            free: 0,
            delaySpawnGuest: 400,
            delaySpawnGuestConst: 4000
        }
        this.gameOver = false;
        this.gameStart = false;
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
            frameRate: 4
        });

        this.anims.create({
            key: "blinking-selected-item",
            frames: this.anims.generateFrameNumbers("selected-item"),
            frameRate: 4,
            repeat: -1
        });
        // ANIMATIONS

        // GROUPS AND PLAYERS
        this.rechargeTimeBarGrp = this.add.group();
        this.wilmersGrp = this.add.group();
        this.guestsGrp = this.add.group();
        this.crossesGrp = this.add.group();
        this.itemsBtnGroup = this.add.group();
        this.areaGrp = this.physics.add.staticGroup();
        // GROUPS AND PLAYERS

        // BACKGROUND        
        this.cameras.main.setBackgroundColor("#55648C")
        const map = this.make.tilemap({ key: "map" });
        const tileSet = map.addTilesetImage("tileSet", "tileSetImg");
        const a = map.createDynamicLayer("staticObjects", tileSet, 0, 0);
        this.add.bitmapText(this.width - 32, 16, "gem", "items", 22).setOrigin(.5);
        // map.setCollisionBetween(10, 15, true, null, 1);

        this.rectBackground = this.add.rectangle(this.width / 2, this.height / 2, this.width, this.height, 0x000);
        this.rectBackground.alpha = 0.7;
        this.rectBackground.visible = false;
        this.rectBackground.setDepth(10);

        this.textLayer = map.createDynamicLayer("text", tileSet, 0, 0);
        this.textLayer.visible = false;
        this.textLayer.setDepth(10);

        const surplus = 4;
        this.sizeRTB = 56;
        let rechargeTimeBar = this.add.rectangle(this.width - 64 + surplus, 32 + surplus, this.sizeRTB, this.sizeRTB, 0x000).setOrigin(0);
        rechargeTimeBar.setDepth(4);
        rechargeTimeBar.name = "bucketRTB";
        rechargeTimeBar.alpha = 0.7;
        rechargeTimeBar.delay = 5000;
        rechargeTimeBar.delayConst = 5000;
        this.rechargeTimeBarGrp.add(rechargeTimeBar);

        rechargeTimeBar = this.add.rectangle(this.width - 64 + surplus, 96 + surplus, this.sizeRTB, this.sizeRTB, 0x000).setOrigin(0);
        rechargeTimeBar.setDepth(4);
        rechargeTimeBar.name = "maskRTB";
        rechargeTimeBar.alpha = 0.7;
        rechargeTimeBar.delay = 20000;
        rechargeTimeBar.delayConst = 20000;
        this.rechargeTimeBarGrp.add(rechargeTimeBar);

        rechargeTimeBar = this.add.rectangle(this.width - 64 + surplus, 160 + surplus, this.sizeRTB, this.sizeRTB, 0x000).setOrigin(0);
        rechargeTimeBar.setDepth(4);
        rechargeTimeBar.name = "vaccineRTB";
        rechargeTimeBar.alpha = 0.7;
        rechargeTimeBar.delay = 30000;
        rechargeTimeBar.delayConst = 30000;
        this.rechargeTimeBarGrp.add(rechargeTimeBar);

        rechargeTimeBar = this.add.rectangle(this.width - 64 + surplus, 224 + surplus, this.sizeRTB, this.sizeRTB, 0x000).setOrigin(0);
        rechargeTimeBar.setDepth(4);
        rechargeTimeBar.name = "abmulanceRTB";
        rechargeTimeBar.alpha = 0.7;
        rechargeTimeBar.delay = 50000;
        rechargeTimeBar.delayConst = 50000;
        this.rechargeTimeBarGrp.add(rechargeTimeBar);

        let area = this.add.sprite(112, 294, "cross").setOrigin(.5);
        area.visible = false;
        area.name = "memok-area";
        this.areaGrp.add(area);

        area = this.add.sprite(120, 362, "cross").setOrigin(.5);
        area.visible = false;
        area.name = "exit-1";
        this.areaGrp.add(area);

        area = this.add.sprite(648, 362, "cross").setOrigin(.5);
        area.visible = false;
        area.name = "exit-2";
        this.areaGrp.add(area);

        this.selectedItem = this.add.sprite(-100, -100, "selected-item").setOrigin(.5);
        this.selectedItem.setDepth(4);
        this.selectedItem.play("blinking-selected-item");

        this.selectedCross = this.add.sprite(-100, -100, "selected-item").setOrigin(.5);
        this.selectedCross.setDepth(1);
        this.selectedCross.play("blinking-selected-item");
        this.selectedCross.setScale(.7);

        const block = this.physics.add.image(144, 384, "").setOrigin(0);
        block.scaleX = 15;
        block.visible = false;
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

        let item = this.add.image(this.width - 32, 64, "bucket").setOrigin(.5);
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

        this.input.setHitArea(this.itemsBtnGroup.getChildren()).on('pointerout', function (pointer, children) {
            children.forEach(function (child) {
                child.clearTint();
            });
        });

        this.input.setHitArea(this.itemsBtnGroup.getChildren()).on('gameobjectdown', function (pointer, child) {
            if (child.name === "helpAlertBtn")
                showRules.call(this, true);
            else if (child.name === "closeBtn") {
                showRules.call(this, false);
                if (!this.gameStart) {
                    updateCrossesOnTheFloor.call(this, false);
                    this.time.addEvent({
                        delay: this.gamePlay.delayGeneral,
                        callback: function () {
                            this.gameStart = true;
                            moveMemok.call(this);
                        }.bind(this),
                        loop: false
                    });
                }
            }
            else if (child.name === "bucketBtn") {
                this.selectedItem.setPosition(child.x, child.y);
                this.selectedItem.name = "bucketBtn";
            }
            else if (child.name === "maskBtn") {
                this.selectedItem.setPosition(child.x, child.y);
                this.selectedItem.name = "maskBtn";
            }
            else if (child.name === "vaccineBtn") {
                this.selectedItem.setPosition(child.x, child.y);
                this.selectedItem.name = "vaccineBtn";
            }
            else if (child.name === "ambulanceBtn") {
                this.selectedItem.setPosition(child.x, child.y);
                this.selectedItem.name = "ambulanceBtn";
            }
        }, this);

        let posWilmerX = 224;
        for (let i = 0; i < 5; i++) {
            const wilmer = this.add.sprite(posWilmerX - 16, this.height - 30, "dude");
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

        //  COLLISIONS
        this.physics.add.collider(this.guestsGrp, this.guestsGrp, collideGuests, null, this);
        this.physics.add.overlap(this.guestsGrp, this.crossesGrp, overlapAPlaceInLine, null, this);
        this.physics.add.overlap(this.memok, this.areaGrp, overlapAreas, null, this);
        this.physics.add.collider(this.guestsGrp, block);
        //  COLLISIONS

        this.time.addEvent({
            delay: this.gamePlay.delayGeneral,
            callback: function () {
                showRules.call(this, true);
                typeWriterHandler.call(this, "how to play");
            }.bind(this),
            loop: false
        });
    },
    update: function (time, delta) {
        if (this.gameOver || !this.gameStart)
            return;

        this.gamePlay.delaySpawnGuest -= delta;
        if (this.gamePlay.delaySpawnGuest < 0) {
            this.gamePlay.delaySpawnGuest = this.gamePlay.delaySpawnGuestConst;
            const guest = spawnGuest.call(this, time);
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

        // pinned sprites
        this.warningIcon.setPosition(this.memok.x, this.memok.y - 32);
        // pinned sprites

        if (this.crossesGrp) {
            this.input.setHitArea(this.crossesGrp.getChildren()).on('pointerover', function (pointer, children) {
                children.forEach(function (cross) {
                    if (cross.name.includes("cross"))
                        this.selectedCross.setPosition(cross.x, cross.y);
                }, this);
            }, this);

            this.input.setHitArea(this.crossesGrp.getChildren()).on('pointerout', function (pointer, children) {
                this.selectedCross.setPosition(-100, -100);
            }, this);
        }

        this.guestsGrp.children.each(function (guest) {
            if (!guest.isOverlaping)
                guest.throughACross = false;

            guest.isOverlaping = false;
        });
    }
});

// CAll BACK COLLISION
function collideGuests(guest1, guest2) {
    guest1.setVelocity(0);
    guest2.setVelocity(0);
}

function overlapAreas(memok, area) {
    if (memok.x > area.x - 8 &&
        memok.x < area.x + 8 &&
        memok.y > area.y - 8 &&
        memok.y < area.y + 8 &&
        area.name === "memok-area")
        memok.setVelocity(0);
}

function overlapAPlaceInLine(guest, cross) {
    if (guest.isOnTheCross)
        return;

    guest.isOverlaping = true;

    if (!guest.throughACross) {
        guest.throughACross = true;
        cross.footsteps += 1;
        if (cross.footsteps <= 4)
            cross.setFrame(cross.footsteps);
    }
    if (guest.x > cross.x - 8 &&
        guest.x < cross.x + 8 &&
        guest.y > cross.y - 8 &&
        guest.y < cross.y + 8 &&
        !cross.isBusyPlace) {
        if (isThePlaceIsAvailable.call(this, cross)) {
            guest.setVelocity(0);
            guest.isOnTheCross = true;
            cross.isBusyPlace = true;
        }
    }
}
// CAll BACK COLLISION

// RULES
function showRules(showMainText) {
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
}

function typeWriterHandler(action) {
    const textList = [
        {
            action: "how to play",
            desc: [
                "Lorem ipsum dolor sit amet, consectetur adipisci",
                "aliqua. Ut enim ad minim veniam, quis nostrud ext",
                "Duis aute irure dolor in reprehenderit in vo repr",
                "in reprehenderit in voluptate velit esse cillum d",
                "sunt in culpa qui officia deserunt mollit anim id"
            ]
        }
    ];

    const textItem = textList.find(x => x.action === action);
    textItem.desc;

    for (let index = 0; index < textItem.desc.length; index++) {
        this.infoTextMain.text += textItem.desc[index] + "\n";
    }
}
// RULES

// GUEST ACTION
function updateCrossesOnTheFloor(update) {
    if (!update) {
        let posX = 208;
        let posY = this.height - 96;
        let crossIndex = 0;
        const timer = this.time.addEvent({
            delay: 100,
            loop: false,
            repeat: 14,
            callback: function () {
                const cross = this.physics.add.sprite(posX, posY, "cross").setOrigin(.5);
                cross.setDepth(1);
                cross.setFrame(0);
                cross.setName("cross-" + timer.getRepeatCount());
                cross.footsteps = 0;
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
}

function spawnGuest(time) {
    const guest = this.physics.add.sprite(368, 0, "ada").setOrigin(.5);
    // const personChose = Phaser.Math.Between(0, 1);
    guest.name = "name-" + parseInt((time / 1000));
    guest.isOverlaping = false;
    guest.throughACross = false;
    guest.isOnTheCross = false;
    guest.setDepth(2);
    guest.play("walking");
    guest.body.setSize(24, 32);
    this.guestsGrp.add(guest);
    return guest;
}

function placesAvailableOnTheLine() {
    const crossesPosList = [];
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

    const firtsElement = crossesPosList.find(v => v.isBusyPlace === false);

    const availableCrosses = crossesPosList.filter(function (cross) {
        return cross.y === firtsElement.y && !cross.isBusyPlace;
    });

    return availableCrosses;
}

function isThePlaceIsAvailable(cross) {
    const availableCrosses = placesAvailableOnTheLine.call(this);
    const place = availableCrosses.find(v => v.name === cross.name);
    return place ? true : false;
}

function findAplaceOnTheLine(guest) {
    const availableCrosses = placesAvailableOnTheLine.call(this);
    const value = Phaser.Math.Between(0, availableCrosses.length - 1);
    const cross = this.crossesGrp.getChildren().find(v => v.name === availableCrosses[value].name);
    this.physics.moveToObject(guest, cross, 50);
}
// GUEST ACTION

function moveMemok(coordinates) {
    if (!coordinates) {
        const areaMemok = this.areaGrp.getChildren().find(v => v.name === "memok-area");
        this.physics.moveToObject(this.memok, areaMemok, 150);
    } else {
        this.physics.moveTo(this.memok, coordinates.x, coordinates.y, 150);
    }
}

export default gameScene;