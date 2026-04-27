export default class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        this.add.text(this.scale.width / 2 - 130, 200, 'SPACE GAME', {
            fontSize: '42px',
            fill: '#ffffff'
        });

        this.add.text(this.scale.width / 2 - 110, 300, 'Click to Start', {
            fontSize: '24px',
            fill: '#aaaaaa'
        });

        this.input.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
    }
}