// UPDATE GAME PLAY
export function uptateGameProgress() {
    //tutorial
    if (!this.gameStart) {
        const items = this.itemsBtnGroup.getChildren().filter(v => v.name === "showMoreInfoBtn" || v.name === "closeModalBtn");
        items[0].setDepth(10);
        items[1].setDepth(10);
        let itemBucketBtn = this.itemsBtnGroup.getChildren().find(v => v.name === "bucketBtn");
        let itemMaskBtn = this.itemsBtnGroup.getChildren().find(v => v.name === "maskBtn");
        let itemHandBtn = this.itemsBtnGroup.getChildren().find(v => v.name === "handBtn");
        let itemBaterryBtn = this.itemsBtnGroup.getChildren().find(v => v.name === "batteryBtn");
        this.selectedItem.name = "";
        if (this.gamePlay.stepTutorialModal === 2) {
            itemBucketBtn.setDepth(11);
            updateCrossesOnTheFloor.call(this, "tutorial");

            this.arrowDown.setPosition(400, 308);
            this.arrowDown.setScale(1.5)
            this.arrowRight.setPosition(704, 64);

        } else if (this.gamePlay.stepTutorialModal === 3) {
            updateCrossesOnTheFloor.call(this);
            itemBucketBtn.setDepth(1);
            itemMaskBtn.setDepth(11);

            this.arrowRight.setPosition(this.arrowRight.x, this.arrowRight.y + 64);
            this.selectedCross.setPosition(-100, -100);
            this.selectedItem.setPosition(-100, -100);

            const guest = this.physics.add.sprite(350, 300, "ada").setOrigin(.5).setInteractive({ cursor: "pointer" });;
            guest.name = "guest-tutorial";
            guest.setDepth(11);
            guest.play("walking-ada");

            guest.body.setSize(24, 32);
            this.arrowDown.setPosition(guest.x, guest.y - 48);
            this.guestsGrp.add(guest);

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
            const wilmer = this.wilmersGrp.getChildren().find(v => v.name === "wilmer2");
            const liveBarWilmer = this.liveBarWilmerGrp.getChildren().find(v => v.name === "liveBarWilmer2");
            liveBarWilmer.setDepth(11);
            wilmer.setDepth(11);
        }
    }
}
// UPDATE GAME PLAY

// CAll BACK COLLISION
export function collideGuests(guest1, guest2) {
    guest1.setVelocity(0);
    guest2.setVelocity(0);
}

export function overlapAreas(memok, area) {
    if (memok.x > area.x - 8 &&
        memok.x < area.x + 8 &&
        memok.y > area.y - 8 &&
        memok.y < area.y + 8 &&
        area.name === "memok-area")
        memok.setVelocity(0);
}

export function overlapAPlaceInLine(guest, cross) {
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
export function showRules(showMainText) {
    this.textLayer.visible = showMainText;
    this.infoTextMain.visible = showMainText;
    this.rectBackground.visible = showMainText;
    this.helpAlerTxt.visible = !showMainText;
    this.manager.visible = !showMainText;
    this.manager2.visible = showMainText;

    this.itemsBtnGroup.children.each(function (child) {
        if (child.name === "closeModalBtn" || child.name === "showMoreInfoBtn") {
            child.visible = showMainText;
            child.setDepth(10);
        }
        else if (child.name === "helpAlertBtn") {
            child.visible = !showMainText;
            child.setDepth(1);
        }
    });
}

export function typeWriterHandler(infoObj) {
    const textInfoList = [
        {
            name: "rules",
            "desc1": [
                "Hello Memok, welcome to your first day of work,",
                "I am the manager of the Evergreen hotel, below",
                "I will explain how you are going to help our guests.\n",
                "On the right side there are items that you can use."
            ],
            "desc2": [
                "The bucket will serve you to prevent that guests",
                "bunch up highlighting the X marks on the floor, just",
                "select the bucket and paint the X with the mouse."
            ],
            "desc3": [
                "The masks will serve to reduce infections, so you",
                "can also put them on the guests. Select the mask",
                "and put on the guest with the mouse."
            ],
            "desc4": [
                "You could also kindly instruct guests to stand on",
                "an ​​mark x selecting the hand and then to the guest.",
                "Remember the guest can't stand on an unpainted x mark",
            ],
            "desc5": [
                "The batteries help to charge the receptionist",
                "robots, thus expediting the entry of guests.",
                "Select the battery element with the mouse and",
                "put them on the receptionist."
            ],
        }
    ];
    this.gamePlay.infoTutorialIsTyping = true;
    const textInfoItem = textInfoList.find(x => x.name === infoObj.name);
    this.infoTextMain.text = "";
    let index = 0
    const time = this.time.addEvent({
        delay: 250,
        loop: false,
        repeat: textInfoItem[infoObj.desc].length - 1,
        callback: function () {
            this.infoTextMain.text += textInfoItem[infoObj.desc][index] + "\n";
            index++;
            if (time.getRepeatCount() <= 0)
                this.gamePlay.infoTutorialIsTyping = false;
        }.bind(this),
    });

}
// RULES

// GUEST ACTION
export function spawnGuest(time) {
    const guestChose = Phaser.Math.Between(0, 1);
    const guest = this.physics.add.sprite(368, 0, guestChose == 0 ? "ada" : "evan").setOrigin(.5).setInteractive({ cursor: "pointer" });;
    guest.name = "guest-" + parseInt((time / 1000));
    guest.isOverlaping = false;
    guest.throughACross = false;
    guest.isOnTheCross = false;
    guest.setDepth(2);
    guest.play("walking-" + (guestChose == 0 ? "ada" : "evan"));
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

export function findAplaceOnTheLine(guest) {
    const availableCrosses = placesAvailableOnTheLine.call(this);
    const value = Phaser.Math.Between(0, availableCrosses.length - 1);
    const cross = this.crossesGrp.getChildren().find(v => v.name === availableCrosses[value].name);
    this.physics.moveToObject(guest, cross, 50);
}
// GUEST ACTION

// SCENE ACTIONS
function updateCrossesOnTheFloor(action) {
    if (!action) {
        let posX = 208;
        let posY = this.height - 96;
        let crossIndex = 0;
        const timer = this.time.addEvent({
            delay: 100,
            loop: false,
            repeat: 14,
            callback: function () {
                const cross = this.physics.add.sprite(posX, posY, "cross").setOrigin(.5).setInteractive({ cursor: "pointer" });;
                cross.setDepth(1);
                cross.setFrame(4);
                cross.setName("cross-" + timer.getRepeatCount());
                cross.footsteps = 0;
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
            }.bind(this),
        });
    } else if (action === "tutorial") {
        const cross = this.physics.add.sprite(400, 356, "cross").setOrigin(.5).setInteractive({ cursor: "pointer" });;
        cross.name = "cross-tutorial";
        cross.setDepth(11);
        cross.setFrame(2);
        cross.footsteps = 2;
        cross.body.setSize(16, 16);
        this.crossesGrp.add(cross);
    }
}

export function moveMemok(coordinates) {
    if (!coordinates) {
        const areaMemok = this.areaGrp.getChildren().find(v => v.name === "memok-area");
        this.physics.moveToObject(this.memok, areaMemok, 150);
    } else {
        this.physics.moveTo(this.memok, coordinates.x, coordinates.y, 150);
    }
}
// SCENE ACTIONS