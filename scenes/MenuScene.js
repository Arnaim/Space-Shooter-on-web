export default class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    preload() {
        this.load.audio('menuMusic', 'Loops/mp3/Sci-Fi 8 Loop.mp3');
    }

    create() {
        this.width = this.scale.width;
        this.height = this.scale.height;

        // Play music
        this.music = this.sound.add('menuMusic', { loop: true, volume: 0.5 });
        this.music.play();

        this.add.text(this.width / 2, 200, 'VOID SHOOTER', {
            fontSize: '64px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            fontWeight: 'bold'
        }).setOrigin(0.5);

        this.add.text(this.width / 2, 350, 'Click to Start', {
            fontSize: '28px',
            fill: '#00ff00',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        this.input.on('pointerdown', () => {
            this.music.stop();
            this.scene.start('StageSelectScene');
        });
    }
}