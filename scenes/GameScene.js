export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    preload() {
        this.load.image('player', 'assets/sprites/player.png');
        this.load.image('enemy', 'assets/sprites/enemy.png');
        this.load.image('background', 'assets/sprites/bg1.png');
    }

    create() {
        // screen size
        this.width = this.scale.width;
        this.height = this.scale.height;

        //background
        this.add.tileSprite(0, 0, this.width, this.height, 'background').setOrigin(0);

        // player (physics enabled)
        this.player = this.physics.add.image(this.width / 2, this.height / 2, 'player');

        // enemy group
        this.enemies = this.physics.add.group();

        // spawn enemies every 1 second
        this.time.addEvent({
            delay: 1000,
            callback: this.spawnEnemy,
            callbackScope: this,
            loop: true
        });

        // lives
        this.lives = 3;
        this.livesText = this.add.text(this.width - 150, 20, 'Lives: 3', {
            fontSize: '24px',
            fill: '#ffffff'
        });

        // shooting system
        this.bullets = this.physics.add.group();
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.physics.add.overlap(
        this.bullets,
        this.enemies,
        this.hitBulletEnemy,
        null,
        this
    );

        // Difficulty scaling
        this.spawnDelay = 1000;
        this.enemySpeed = 200;
        this.spawnEvent = this.time.addEvent({
        delay: this.spawnDelay,
        callback: this.spawnEnemy,
        callbackScope: this,
        loop: true
    });

        // score system
        this.score = 0;
        this.scoreText = this.add.text(20, 20, 'Score: 0', {
            fontSize: '24px',
            fill: '#ffffff'
        });

        // collision
        this.physics.add.overlap(
            this.player,
            this.enemies,
            this.hitEnemy,
            null,
            this
        );

        // WASD controls
        this.keys = this.input.keyboard.addKeys({
            up: 'W',
            down: 'S',
            left: 'A',
            right: 'D'
        });
    }

    update() {
        // movement
        if (this.keys.left.isDown) this.player.x -= 5;
        else if (this.keys.right.isDown) this.player.x += 5;

        if (this.keys.up.isDown) this.player.y -= 5;
        else if (this.keys.down.isDown) this.player.y += 5;

        // clamp inside screen
        this.player.x = Phaser.Math.Clamp(this.player.x, 0, this.width);
        this.player.y = Phaser.Math.Clamp(this.player.y, 0, this.height);



        // remove enemies that go off screen
        this.enemies.children.iterate((enemy) => {
            if (!enemy) return;

            if (enemy.y > this.height) {
                enemy.destroy();
            }
        });

        // shooting function 
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
        this.fireBullet();
        this.bullets.children.iterate((bullet) => {
        if (bullet && bullet.y < 0) {
            bullet.destroy();
        }
    });
    }
    }

spawnEnemy() {
    let x = Phaser.Math.Between(50, this.width - 50);

    let enemy = this.enemies.create(x, 0, 'enemy');
    enemy.setVelocityY(this.enemySpeed);
}

    fireBullet() {
    let bullet = this.bullets.create(this.player.x, this.player.y - 20, null);

    // simple bullet (no image needed yet)
    bullet.setDisplaySize(5, 15);
    bullet.setTint(0xffff00);
    bullet.body.setVelocityY(-400);
}

hitBulletEnemy(bullet, enemy) {

    this.score += 10;
this.scoreText.setText('Score: ' + this.score);

// increase difficulty every 50 points
if (this.score % 50 === 0) {

    // faster spawning (minimum cap)
    this.spawnDelay = Math.max(300, this.spawnDelay - 100);

    // faster enemies
    this.enemySpeed += 20;

    // restart spawn timer with new delay
    this.spawnEvent.remove();

    this.spawnEvent = this.time.addEvent({
        delay: this.spawnDelay,
        callback: this.spawnEnemy,
        callbackScope: this,
        loop: true
    });
}

    let x = enemy.x;
    let y = enemy.y;

    bullet.destroy();
    enemy.destroy();

    this.createExplosion(x, y);

    this.score += 10;
    this.scoreText.setText('Score: ' + this.score);
}

   hitEnemy(player, enemy) {

    if (this.isGameOver) return;

    enemy.destroy();

    // reduce life
    this.lives -= 1;
    this.livesText.setText('Lives: ' + this.lives);

    // visual feedback
    this.player.setTint(0xff0000);

    this.time.delayedCall(200, () => {
        this.player.clearTint();
    });

    // GAME OVER CHECK
    if (this.lives <= 0) {

        this.isGameOver = true;

        this.physics.pause();

        this.time.delayedCall(300, () => {
            this.scene.start('GameOverScene', {
                score: this.score
            });
        });
    }
}

createExplosion(x, y) {
    let circle = this.add.circle(x, y, 10, 0xffaa00);

    this.tweens.add({
        targets: circle,
        radius: 40,
        alpha: 0,
        duration: 200,
        onComplete: () => {
            circle.destroy();
        }
    });
}

}