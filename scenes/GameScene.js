export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    preload() {
        // Player Ship & Weapons
        this.load.image('player_full', 'Foozle_2DS0011_Void_MainShip/Main Ship/Main Ship - Bases/PNGs/Main Ship - Base - Full health.png');
        this.load.image('player_slight', 'Foozle_2DS0011_Void_MainShip/Main Ship/Main Ship - Bases/PNGs/Main Ship - Base - Slight damage.png');
        this.load.image('player_damaged', 'Foozle_2DS0011_Void_MainShip/Main Ship/Main Ship - Bases/PNGs/Main Ship - Base - Damaged.png');
        this.load.image('player_very', 'Foozle_2DS0011_Void_MainShip/Main Ship/Main Ship - Bases/PNGs/Main Ship - Base - Very damaged.png');
        
        this.load.image('bullet', 'Foozle_2DS0011_Void_MainShip/Main ship weapons/PNGs/Main ship weapon - Projectile - Auto cannon bullet.png');
        
        // Engines (Spritesheets)
        this.load.spritesheet('engine_idle', 'Foozle_2DS0011_Void_MainShip/Main Ship/Main Ship - Engine Effects/PNGs/Main Ship - Engines - Base Engine - Idle.png', { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet('engine_powering', 'Foozle_2DS0011_Void_MainShip/Main Ship/Main Ship - Engine Effects/PNGs/Main Ship - Engines - Base Engine - Powering.png', { frameWidth: 48, frameHeight: 48 });

        // Enemies & Obstacles
        this.load.image('enemy', 'Foozle_2DS0014_Void_EnemyFleet_3/Nautolan/Designs - Base/PNGs/Nautolan Ship - Scout - Base.png');
        this.load.image('asteroid', 'Foozle_2DS0015_Void_EnvironmentPack/Asteroids/PNGs/Asteroid 01 - Base.png');
        this.load.spritesheet('explosion', 'Foozle_2DS0014_Void_EnemyFleet_3/Nautolan/Destruction/PNGs/Nautolan Ship - Scout.png', { frameWidth: 64, frameHeight: 64 });

        // Backgrounds (Parallax)
        this.load.image('bg_void', 'Foozle_2DS0015_Void_EnvironmentPack/Backgrounds/PNGs/Condesed/Starry background  - Layer 01 - Void.png');
        this.load.image('bg_stars', 'Foozle_2DS0015_Void_EnvironmentPack/Backgrounds/PNGs/Condesed/Starry background  - Layer 02 - Stars.png');

        // Audio
        this.load.audio('gameMusic', 'Loops/mp3/Sci-Fi 1 Loop.mp3');
    }

    create() {
        // screen size
        this.width = this.scale.width;
        this.height = this.scale.height;

        // Music
        this.music = this.sound.add('gameMusic', { loop: true, volume: 0.4 });
        this.music.play();

        // Parallax Backgrounds
        this.bgVoid = this.add.tileSprite(0, 0, this.width, this.height, 'bg_void').setOrigin(0);
        this.bgStars = this.add.tileSprite(0, 0, this.width, this.height, 'bg_stars').setOrigin(0);

        // Define Animations
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('engine_idle', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'powering',
            frames: this.anims.generateFrameNumbers('engine_powering', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        // Only create explosion anim if texture loaded correctly
        if (this.textures.exists('explosion')) {
            this.anims.create({
                key: 'explode',
                frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 8 }),
                frameRate: 15,
                hideOnComplete: true
            });
        }

        // Player (physics enabled)
        this.player = this.physics.add.sprite(this.width / 2, this.height - 100, 'player_full');
        this.player.setDepth(10);

        // Engine Animation (attached to player)
        this.engine = this.add.sprite(this.player.x, this.player.y + 25, 'engine_idle');
        this.engine.play('idle');
        this.engine.setDepth(9);

        // groups
        this.enemies = this.physics.add.group();
        this.asteroids = this.physics.add.group();
        this.bullets = this.physics.add.group();

        // lives
        this.lives = 3;
        this.livesText = this.add.text(this.width - 150, 20, 'Lives: 3', {
            fontSize: '24px',
            fill: '#ffffff'
        });

        // score system
        this.score = 0;
        this.scoreText = this.add.text(20, 20, 'Score: 0', {
            fontSize: '24px',
            fill: '#ffffff'
        });

        // Difficulty scaling & Spawning
        this.spawnDelay = 1000;
        this.enemySpeed = 200;
        
        this.spawnEvent = this.time.addEvent({
            delay: this.spawnDelay,
            callback: this.spawnEnemy,
            callbackScope: this,
            loop: true
        });

        this.time.addEvent({
            delay: 3000,
            callback: this.spawnAsteroid,
            callbackScope: this,
            loop: true
        });

        // Collisions
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        this.physics.add.overlap(this.bullets, this.enemies, this.hitBulletEnemy, null, this);
        this.physics.add.overlap(this.bullets, this.asteroids, (b, a) => { b.destroy(); }, null, this);
        this.physics.add.overlap(this.player, this.enemies, this.hitEnemy, null, this);
        this.physics.add.overlap(this.player, this.asteroids, this.hitEnemy, null, this);

        // WASD controls
        this.keys = this.input.keyboard.addKeys({
            up: 'W', down: 'S', left: 'A', right: 'D'
        });
    }

    update() {
        // Parallax Scrolling
        this.bgVoid.tilePositionY -= 0.5;
        this.bgStars.tilePositionY -= 2;

        // movement
        let isMoving = false;
        if (this.keys.left.isDown) { this.player.x -= 5; isMoving = true; }
        else if (this.keys.right.isDown) { this.player.x += 5; isMoving = true; }

        if (this.keys.up.isDown) { this.player.y -= 5; isMoving = true; }
        else if (this.keys.down.isDown) { this.player.y += 5; isMoving = true; }

        // clamp inside screen
        this.player.x = Phaser.Math.Clamp(this.player.x, 25, this.width - 25);
        this.player.y = Phaser.Math.Clamp(this.player.y, 25, this.height - 25);

        // Update Engine position and animation
        this.engine.x = this.player.x;
        this.engine.y = this.player.y + 25;

        if (isMoving) {
            if (this.engine.anims.currentAnim.key !== 'powering') this.engine.play('powering');
        } else {
            if (this.engine.anims.currentAnim.key !== 'idle') this.engine.play('idle');
        }

        // remove objects that go off screen
        this.enemies.children.iterate((enemy) => {
            if (enemy && enemy.y > this.height + 50) enemy.destroy();
        });
        this.asteroids.children.iterate((asteroid) => {
            if (asteroid && asteroid.y > this.height + 50) asteroid.destroy();
        });
        this.bullets.children.iterate((bullet) => {
            if (bullet && bullet.y < -50) bullet.destroy();
        });

        // shooting
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) this.fireBullet();
    }

    spawnEnemy() {
        let x = Phaser.Math.Between(50, this.width - 50);
        let enemy = this.enemies.create(x, -50, 'enemy');
        enemy.setVelocityY(this.enemySpeed);
    }

    spawnAsteroid() {
        let x = Phaser.Math.Between(50, this.width - 50);
        let asteroid = this.asteroids.create(x, -50, 'asteroid');
        asteroid.setVelocityY(this.enemySpeed * 0.5);
        asteroid.setAngularVelocity(Phaser.Math.Between(-100, 100));
    }

    fireBullet() {
        let bullet = this.bullets.create(this.player.x, this.player.y - 30, 'bullet');
        bullet.body.setVelocityY(-500);
    }

    hitBulletEnemy(bullet, enemy) {
        let x = enemy.x;
        let y = enemy.y;
        bullet.destroy();
        enemy.destroy();
        this.createExplosion(x, y);
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);

        if (this.score > 0 && this.score % 100 === 0) {
            this.spawnDelay = Math.max(200, this.spawnDelay - 50);
            this.enemySpeed += 10;
            this.spawnEvent.remove();
            this.spawnEvent = this.time.addEvent({
                delay: this.spawnDelay,
                callback: this.spawnEnemy,
                callbackScope: this,
                loop: true
            });
        }
    }

    hitEnemy(player, enemy) {
        if (this.isGameOver) return;

        let x = enemy.x;
        let y = enemy.y;
        enemy.destroy();
        this.createExplosion(x, y);

        this.lives -= 1;
        this.livesText.setText('Lives: ' + this.lives);

        // Update player texture based on health
        if (this.lives === 2) this.player.setTexture('player_slight');
        else if (this.lives === 1) this.player.setTexture('player_damaged');
        else if (this.lives === 0) this.player.setTexture('player_very');

        this.player.setTint(0xff0000);
        this.time.delayedCall(200, () => {
            this.player.clearTint();
        });

        if (this.lives <= 0) {
            this.isGameOver = true;
            this.physics.pause();
            this.music.stop();
            this.time.delayedCall(1000, () => {
                this.scene.start('GameOverScene', { score: this.score });
            });
        }
    }

    createExplosion(x, y) {
        let explosion = this.add.sprite(x, y, 'explosion');
        if (this.anims.exists('explode')) {
            explosion.play('explode');
        } else {
            // Fallback: just destroy the sprite if animation doesn't exist
            explosion.destroy();
        }
    }

}