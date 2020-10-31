import CONST from './const.js'
// UPDATE GAME PLAY
function uptateGameProgress() {
    //tutorial
    if (!this.gameStart) {

        const items = this.itemsBtnGroup.getChildren().filter(v => v.name === "showMoreInfoBtn" || v.name === "closeModalBtn");
        items[0].setDepth(10);
        items[1].setDepth(10);
        let itemBucketBtn = this.itemsBtnGroup.getChildren().find(v => v.name === "bucketBtn");
        let itemMaskBtn = this.itemsBtnGroup.getChildren().find(v => v.name === "maskBtn");
        let itemHandBtn = this.itemsBtnGroup.getChildren().find(v => v.name === "handBtn");
        let itemBaterryBtn = this.itemsBtnGroup.getChildren().find(v => v.name === "batteryBtn");

        this.selectedItem.name = null;
        this.selectedItem.setDepth(11);
        this.selectedCross.setPosition(-100, -100);
        this.selectedItem.setPosition(-100, -100);

        this.arrowDown.visible = true;
        this.arrowRight.visible = true;

        if (this.gamePlay.stepTutorialModal === 2) {

            itemBucketBtn.setDepth(11);
            this.arrowRight.setPosition(704, 64);
            this.arrowDown.setPosition(-100, -100);

            if (this.firstTimeTutorial) {

                this.arrowDown.setPosition(400, 308);
                this.arrowDown.setScale(1.5);
                const cross = this.physics.add.sprite(403, 370, "cross").setOrigin(.5).setInteractive({ cursor: "pointer" });
                cross.name = "cross-tutorial";
                cross.setDepth(11);
                cross.setFrame(2);
                cross.footsteps = 2;
                cross.body.setSize(16, 16);
                this.crossesGrp.add(cross);
            }

        } else if (this.gamePlay.stepTutorialModal === 3) {

            itemBucketBtn.setDepth(1);
            itemMaskBtn.setDepth(11);

            this.arrowRight.setPosition(this.arrowRight.x, this.arrowRight.y + 64);

            if (this.firstTimeTutorial) {

                this.updateCrossesOnTheFloor();
                const guest = this.physics.add.sprite(350, 300, "ada").setOrigin(.5).setInteractive({ cursor: "pointer" });;
                guest.name = "guest-tutorial";
                guest.status = CONST.GUEST_STATUS.OK;
                guest.setDepth(11);
                guest.play(CONST.ANIM.WALK + "-ada");

                guest.body.setSize(24, 32);
                this.arrowDown.setPosition(guest.x, guest.y - 48);
                this.guestsGrp.add(guest);
            }

        } else if (this.gamePlay.stepTutorialModal === 4) {

            this.selectedItem.setPosition(-100, -100);
            itemMaskBtn.setDepth(1);
            itemHandBtn.setDepth(11);
            this.arrowRight.setPosition(this.arrowRight.x, this.arrowRight.y + 64);

        } else if (this.gamePlay.stepTutorialModal === 5) {

            this.selectedItem.setPosition(-100, -100);
            itemHandBtn.setDepth(1);
            itemBaterryBtn.setDepth(11);
            this.arrowRight.setPosition(this.arrowRight.x, this.arrowRight.y + 64);

            if (this.firstTimeTutorial) {

                const wilmer = this.wilmersGrp.getChildren().find(v => v.name === "wilmer-2");
                const liveBarWilmer = this.liveBarWilmerGrp.getChildren().find(v => v.name === "liveBarWilmer-2");
                liveBarWilmer.setDepth(11);
                wilmer.setDepth(11);
                this.arrowDown.setPosition(wilmer.x + 30, wilmer.y - 50);
                this.arrowDown.angle = 25;
                const guest = this.guestsGrp.getChildren().find(v => v.name === "guest-tutorial");
                if (guest.status !== CONST.GUEST_STATUS.WAITING) {
                    guest.status = CONST.GUEST_STATUS.WAITING;
                    const cross = this.crossesGrp.getChildren().find(v => v.name === "cross-tutorial");
                    guest.setPosition(cross.x, cross.y);
                }

            }

        } else if (this.gamePlay.stepTutorialModal === 6) {
            this.arrowDown.setPosition(-100, -100);
            if (this.firstTimeTutorial) {

                const waitingText = this.waitingTextGrp.getChildren().find(v => v.name === "waitingText-2");
                waitingText.setDepth(12);
                waitingText.visible = true;
                waitingText.delay = 2000;
                waitingText.delayConst = 2000;

                const waitingGear = this.waitingGearGrp.getChildren().find(v => v.name === "waitingGear-2");
                waitingGear.setDepth(12);
                waitingGear.visible = true;

                const guest = this.guestsGrp.getChildren().find(v => v.name === "guest-tutorial");
                waitingText.registeredGuest = guest;
            } else
                this.arrowRight.setPosition(-100, -100);

        }
    }
    //tutorial
}
// UPDATE GAME PLAY

// CAll BACK COLLISION
function overlapGuests(guest1, guest2) {
    guest1.setVelocity(0);
    guest2.setVelocity(0);
}

function overlapAreas(child, area) {
    if (child.x > area.x - 8 &&
        child.x < area.x + 8 &&
        child.y > area.y - 8 &&
        child.y < area.y + 8) {
        child.setVelocity(0);
        if (child.status !== CONST.GUEST_STATUS.REGISTERED) {
            child.status = CONST.GUEST_STATUS.REGISTERED;
        }
    }
}

function overlapAPlaceInLine(guest, cross) {

    guest.isOverlaping = true;

    if (guest.status === CONST.GUEST_STATUS.WAITING || guest.status === CONST.GUEST_STATUS.REGISTERED)
        return;

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
            guest.status = CONST.GUEST_STATUS.WAITING;

            cross.isBusyPlace = true;
            if (this.gamePlay.stepTutorialModal == -1) {
                let waitingText = this.waitingTextGrp.getChildren().find(v => v.x > cross.x - 16 && v.x < cross.x + 16 && cross.y > this.height - 96);
                waitingText.registeredGuest = guest;
            }

        }
    }
}
// CAll BACK COLLISION

// RULES
function showModalInfo(showTutorial) {

    this.textLayer.visible = showTutorial;
    this.infoMainTxt.visible = showTutorial;
    this.rectBackground.visible = showTutorial;
    this.helpAlerTxt.visible = !showTutorial;
    this.manager.visible = !showTutorial;
    this.manager2.visible = showTutorial;

    this.itemsBtnGroup.children.each(function (child) {
        if (child.name === "closeModalBtn" || child.name === "showMoreInfoBtn") {
            child.visible = showTutorial;
            child.setDepth(10);
        }
        else if (child.name === "helpAlertBtn") {
            child.visible = !showTutorial;
            child.setDepth(1);
        }
    });

    if (showTutorial) {
        this.gamePlay.pause = CONST.PAUSE.BY_TUTORIAL;
        if (!this.firstTimeTutorial)
            this.physics.pause();
    }
    else if (!showTutorial) {
        this.gamePlay.pause = CONST.PAUSE.FALSE;
        if (!this.firstTimeTutorial)
            this.physics.resume();

        this.firstTimeTutorial = false;
        this.selectedItem.name = null;
        this.selectedItem.setDepth(4);
        this.selectedItem.touchedItem = null;
        this.arrowDown.visible = false;
        this.arrowRight.visible = false;
        let guest = this.guestsGrp.getChildren().find(v => v.name === "guest-tutorial");
        this.guestsGrp.remove(guest, true, true);

        this.itemsBtnGroup.children.each(child => {
            child.setDepth(4);
        });

        let cross = this.crossesGrp.getChildren().find(v => v.name === "cross-tutorial");
        this.crossesGrp.remove(cross, true, true);

        const waitingText = this.waitingTextGrp.getChildren().find(v => v.name === "waitingText-2");
        waitingText.registeredGuest = null;
        waitingText.setDepth(5);

        const liveBarWilmer = this.liveBarWilmerGrp.getChildren().find(v => v.name === "liveBarWilmer-2");
        liveBarWilmer.setDepth(5);

        const waitingGear = this.waitingGearGrp.getChildren().find(v => v.name === "waitingGear-2");
        waitingGear.setDepth(5);

        this.gamePlay.stepTutorialModal = -1;
    }
}

function typeWriterHandler(data) {

    this.gamePlay.infoTutorialIsTyping = true;
    data.textObj.text = "";
    let index = 0
    const time = this.time.addEvent({
        delay: 250,
        loop: false,
        repeat: data.arrayText.length - 1,
        callback: () => {
            data.textObj.text += data.arrayText[index] + "\n";
            index++;
            if (time.getRepeatCount() <= 0)
                this.gamePlay.infoTutorialIsTyping = false;
        },
    });

}
// RULES

// GUEST ACTION
function spawnGuest(time) {
    const guestChose = Phaser.Math.Between(0, 1);
    const guest = this.physics.add.sprite(368, 0, guestChose == 0 ? "ada" : "evan").setOrigin(.5).setInteractive({ cursor: "pointer" });
    guest.name = "guest-" + parseInt((time / 1000));
    guest.isOverlaping = false;
    guest.throughACross = false;
    guest.status = CONST.GUEST_STATUS.OK;
    guest.setDepth(2);
    guest.play(CONST.ANIM.WALK + (guestChose == 0 ? "-ada" : "-evan"));
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
            isBusyPlace: child.isBusyPlace,
            footsteps: child.footsteps
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

    const firtsElement = crossesPosList.find(v => v.isBusyPlace === false && v.footsteps < 4);
    if (!firtsElement) {

        let cross = this.crossesGrp.getChildren().find(v => v.name === "cross-tutorial");
        this.crossesGrp.remove(cross, true, true);

        return null;
    

    }
    const availableCrosses = crossesPosList.filter(function (cross) {
        return cross.y === firtsElement.y && !cross.isBusyPlace;
    });

    return availableCrosses;
}

function isThePlaceIsAvailable(cross) {
    const availableCrosses = placesAvailableOnTheLine.call(this);
    if (!availableCrosses)
        return false;
    const place = availableCrosses.find(v => v.name === cross.name);
    return place ? true : false;
}

function findAplaceOnTheLine(guest) {
    const availableCrosses = placesAvailableOnTheLine.call(this);
    if (!availableCrosses)
        return false;
    const value = Phaser.Math.Between(0, availableCrosses.length - 1);
    const cross = this.crossesGrp.getChildren().find(v => v.name === availableCrosses[value].name);
    this.physics.moveToObject(guest, cross, 50);
    return true;
}
// GUEST ACTION

// SCENE ACTIONS
function createAnimations(key, texture, frameRate, repeat) {
    this.anims.create({
        key: key,
        frames: this.anims.generateFrameNumbers(texture),
        frameRate: frameRate,
        repeat: repeat
    });
}

function updateCrossesOnTheFloor(update) {
    if (!update) {
        let posX = 208;
        let posY = this.height - 80;
        let crossIndex = 0;
        const timer = this.time.addEvent({
            delay: 100,
            loop: false,
            repeat: 14,
            callback: () => {
                const cross = this.physics.add.sprite(posX, posY, "cross").setOrigin(.5).setInteractive({ cursor: "pointer" });;
                cross.setDepth(1);
                cross.setName("cross-" + timer.getRepeatCount());
                if (timer.getRepeatCount() >= 10) {
                    cross.footsteps = 0;
                    cross.setFrame(0);
                } else {
                    cross.footsteps = 4;
                    cross.setFrame(4);
                }
                cross.isBusyPlace = false;
                cross.body.setSize(16, 16)
                this.crossesGrp.add(cross);
                posX += 96;
                crossIndex++;
                if (crossIndex >= 5) {
                    crossIndex = 0;
                    posY -= 96;
                    posX = 208;
                }
            },
        });
    }
}

function moveMemok(coordinates) {
    if (!coordinates) {
        const areaMemok = this.areaGrp.getChildren().find(v => v.name === "memok-area");
        this.physics.moveToObject(this.memok, areaMemok, 150);
    } else {
        this.physics.moveTo(this.memok, coordinates.x, coordinates.y, 150);
    }
}

function resetGamePlay() {
    return {
        delayGeneral: 500,
        level: 1,
        score: 0,
        registeredGuests: 0,
        delaySpawnGuest: 400,
        delaySpawnGuestConst: 4000,
        stepTutorialModal: -1,
        gameOver: false,
        gameStart: false,
        infoTutorialIsTyping: false,
        pause: 0
    }
}
// SCENE ACTIONS

export {
    moveMemok,
    createAnimations,
    findAplaceOnTheLine,
    spawnGuest,
    typeWriterHandler,
    showModalInfo,
    overlapAPlaceInLine,
    overlapAreas,
    overlapGuests,
    uptateGameProgress,
    resetGamePlay,
    updateCrossesOnTheFloor
}
