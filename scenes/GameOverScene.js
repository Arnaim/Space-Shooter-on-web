export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }

    init(data) {
        this.finalScore = data.score;
    }

    create() {
        this.add.text(this.scale.width / 2 - 130, 200, 'GAME OVER', {
            fontSize: '42px',
            fill: '#ff0000'
        });

        this.add.text(this.scale.width / 2 - 130, 280, 
            'Score: ' + this.finalScore, {
            fontSize: '24px',
            fill: '#ffffff'
        });

        this.add.text(this.scale.width / 2 - 130, 350, 
            'Click to Restart', {
            fontSize: '20px',
            fill: '#aaaaaa'
        });

        this.input.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
    }
}