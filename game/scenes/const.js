const CONST = {
    ANIM: {
        WALK: "walk",
        FLY: "fly",
        IDLE: "idle",
        BLINK: "blink",
        WAIT: "wait"
    },
    TUTORIAL: {
        RULES: {
            1: [
                "Hello!, I am the manager of the Evergreen hotel.",
                "Today your mission will be to help our robot ,Memok,",
                "to guide our hotel guests to avoid them bunch up.",
                "I will explain how you are going to achieve this:",
                "On the right side there are items that you can use."
            ],
            2: [
                "The bucket will serve you to prevent that guests",
                "bunch up highlighting the X marks on the floor,",
                "just select the bucket item and paint the X with",
                "mouse."
            ],
            3: [
                "The mask item will serve to reduce possible",
                "COVID-19 infections, so you can also put them on",
                "the guests. Select the mask and put it on the",
                "guest with the mouse."
            ],
            4: [
                "You could also kindly instruct to a guest to stand",
                "on an X ​​mark selecting the hand item and then to",
                "the guest. Remember, the guest can't stand on an",
                "unpainted X mark."
            ],
            5: [
                "Remember to continuously charge the batteries of the",
                "Wilmer robot, our receptionist, in this way you will",
                "speed up the entry of guests to the hotel.",
                "Select the battery item with the mouse and put to",
                "Wilmer."
            ],
            6: [
                "Once this is done, the guest will only have to wait,",
                "until he has been registered to enter the hotel.",
                "Your mission will be to let in the largest number of",
                "healthy guests, simple right? Have fun.",
                "Get ready!"
            ]
        }
    },
    GUEST_STATUS: {
        OK: 0,
        SICK: 1,
        WAITING: 2,
        REGISTERED: 4
    },
    TUTORIAL_COMPLETED: 6,
    PAUSE: {
        FALSE: 0,
        BY_TUTORIAL: 1
    }
}

export default CONST;