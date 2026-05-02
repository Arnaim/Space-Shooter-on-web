export default class StageSelectScene extends Phaser.Scene {
    constructor() {
        super('StageSelectScene');
    }

    create() {
        const width = this.scale.width;
        const height = this.scale.height;

        this.add.text(width / 2, 100, 'SELECT STAGE', {
            fontSize: '48px',
            fill: '#ffffff',
            fontWeight: 'bold'
        }).setOrigin(0.5);

        const stages = [
            { name: 'Nebula Alpha', difficulty: 'Easy' },
            { name: 'Void Core', difficulty: 'Medium' },
            { name: 'Nautolan Prime', difficulty: 'Hard' }
        ];

        stages.forEach((stage, index) => {
            const btn = this.add.text(width / 2, 250 + (index * 80), `${stage.name} (${stage.difficulty})`, {
                fontSize: '32px',
                fill: '#00ff00'
            })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => btn.setStyle({ fill: '#ffff00' }))
            .on('pointerout', () => btn.setStyle({ fill: '#00ff00' }))
            .on('pointerdown', () => {
                this.scene.start('GameScene', { stage: stage });
            });
        });

        this.add.text(width / 2, height - 50, 'Back to Menu', {
            fontSize: '24px',
            fill: '#888888'
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => this.scene.start('MenuScene'));
    }
}