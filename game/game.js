var preloadScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

        function PreloadScene() {
            Phaser.Scene.call(this, 'preloadScene');

            this.pic;
        },

    preload: function () {
        this.load.image('logo', 'assets/logo.png');
        let progressBar = this.add.graphics();
        let progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect((this.game.config.width / 2) - (320 / 2), (this.game.config.height / 2) - (50 / 2), 320, 50);

        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        let loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                font: '28px monospace',
                fill: '#ffffff'
            }
        });

        loadingText.setOrigin(0.5, 0.5);

        let percentText = this.make.text({
            x: width / 2,
            y: height / 2 - 5,
            text: '0%',
            style: {
                font: '28px monospace',
                fill: '#ffffff'
            }
        });

        percentText.setOrigin(0.5, 0.5);

        let assetText = this.make.text({
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
            this.add.image(width / 2, height / 2, 'logo');
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
            assetText.destroy();

            this.time.addEvent({
                delay: 2000,
                callback: () => {
                    this.sceneStopped = true;
                    this.scene.sleep("preload");
                    this.scene.start("main.menu");
                },
                loop: false
            });
        }, this);
    }

});

var config = {
    title: "Saving the day",
    version: '0.0.1',
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'game',
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [preloadScene],
    dom: {
        createContainer: true
    },
};

var game = new Phaser.Game(config);
