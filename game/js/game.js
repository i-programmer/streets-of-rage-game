var theGame = function(game){
	theGame.phaserGameClass = game;
	theGame.getPhaserGameClass = function() {
		return theGame.phaserGameClass;
	};
	theGame.getLayers = function() {
		return theGame.gameLayers;
	};
	
	this.player;
	this.enemies = [];
			
	this.points = 0;
	this.aliveTime = 0;
	this.timeStart = Date.now();
	this.isGameOver = false;

	this.cursors; this.wasd; // Control via W A S D and standart cursors

	this.pointsText;
	this.aliveTimeText;
	this.collisionArea;

	this.startBtn;
	this.bgGameOver;
	this.titleMusic;
	this.stageMusic;
	//this.stageMusicList = ['stageMusic_1', 'stageMusic_2', 'stageMusic_3', 'stageMusic_4', 'stageMusic_5', 'stageMusic_6', 'stageMusic_7', 'stageMusic_8'];
	this.stageMusicList = ['stageMusic_1', 'stageMusic_2', 'stageMusic_3', 'stageMusic_5', 'stageMusic_7', 'stageMusic_8'];	
	this.stageMusicListTmp = this.stageMusicList.slice();

	theGame.gameLayers = {bgMain: null, collisionArea: null, foreground: null, enemies: null, player: null};
};

theGame.prototype = {

	preload: function() {

	},

	create: function() {
		theGame.gameLayers.collisionArea = this.add.group();
		theGame.gameLayers.bgMain = this.add.group();
		theGame.gameLayers.player = this.add.group();
		theGame.gameLayers.enemies = this.add.group();

		theGame.gameLayers.foreground = this.add.group();


		console.log("%cStarting game...", "color:white; background: #450f78; padding: 2px 10px;");
		// advanced profiling, including the fps rate, fps min/max, suggestedFps and msMin/msMax
		// needed for deltaTime calculations
		this.time.advancedTiming = true;
		
		this.stage.disableVisibilityChange = true;
		this.points = 0;
		this.aliveTime = 0;

		Enemy.phaserGameClass = this.game;
		Enemy.gameClass = this;

		this.physics.startSystem(Phaser.Physics.ARCADE);

		// make bg
		this.createStageBg();

		// create player
		this.player = new Player();

		// Enable physics on those sprites
		this.physics.enable( [ this.player.sprite, this.collisionArea ], Phaser.Physics.ARCADE);
		this.collisionArea.body.down = false;
		this.collisionArea.body.immovable = true;

		//  Game input
		this.cursors = this.input.keyboard.createCursorKeys();
		//  Stop the following keys from propagating up to the browser
		this.input.keyboard.addKeyCapture([ Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.UP, Phaser.Keyboard.DOWN, Phaser.Keyboard.SPACEBAR ]);
		this.wasd = {
			W: this.input.keyboard.addKey(Phaser.Keyboard.W),
			A: this.input.keyboard.addKey(Phaser.Keyboard.A),
			S: this.input.keyboard.addKey(Phaser.Keyboard.S),
			D: this.input.keyboard.addKey(Phaser.Keyboard.D)
		};

		this.startStageMusic();

		this.pointsText = this.add.bitmapText(this.world.width - 40, this.world.y + 40, 'fontSOR', 'score ' + this.points + '', 20);
		this.pointsText.anchor.set(1, 0.5);
		this.aliveTimeText = this.add.bitmapText(this.world.width - 40, this.world.y + 70, 'fontSOR', 'alive ' + this.aliveTime + '', 20);
		this.aliveTimeText.anchor.set(1, 0.5);

		this.timeStart = Date.now();
	},

	update: function() {
		this.stageMusic.volume = Phaser.SoundManager.volume;

		if (this.isGameOver) {
			this.state.start("GameOver", false, false, this);
		}

		this.pointsText.setText('score ' + this.points + '');
		this.aliveTime = Math.round(this.time.elapsedSecondsSince(this.timeStart));
		this.aliveTimeText.setText('alive ' + this.aliveTime + ' sec.');
		this.player.hpBar.outer.width =  (this.player.hpBar.outer.widthDefault * this.player.HP) / this.player.HPDefault;

		// A little hack to see player sprite rectange using sprite width and heigh
		this.player.sprite.body.width = this.player.sprite.width;
		this.player.sprite.body.height = this.player.sprite.height;
		//-----------------------------------
		this.player.isGrounded = this.checkOverlap(this.player.sprite, this.collisionArea);
		this.player.updade();

		var enemy = Enemy.spawn();
		if (enemy)
			this.enemies.push(enemy);

		for (var i = 0; i < this.enemies.length; ++i) {
			if (!Enemy.killEnemy(this.enemies, i)) {
				this.enemies[i].AI();
				if (this.checkOverlap(this.player.sprite, this.enemies[i].sprite)) {
					this.overlapHandler(this.player.sprite, this.enemies[i]);
				}
			}
		}

		if (this.wasd.W.justDown || this.cursors.up.justDown){
				this.player.hitPlay(Player.HIT_TYPE_UPPERCUT);
		}

		if (this.wasd.A.justDown || this.cursors.left.justDown){
				this.player.direction = 'left';
				this.player.hitPlay(Player.HIT_TYPE_DEFAULT);
		}

		if (this.wasd.S.justDown || this.cursors.down.justDown){
				this.player.hitPlay(Player.HIT_TYPE_LOW_PUNCH)
		}

		if (this.wasd.D.justDown || this.cursors.right.justDown){
				this.player.direction = 'right';
				this.player.hitPlay(Player.HIT_TYPE_DEFAULT);
		}

		if (this.player.isMovementComplete)
			this.player.startIdleAnim();
	},

	createStageBg: function() {
		this.collisionArea = theGame.gameLayers.collisionArea.create(1, 330, 'collision_area_BIG');
		this.collisionArea.width = 998;

		var backdrop_bg = theGame.gameLayers.bgMain.create(0, 0, 'backdrop_bg');
		backdrop_bg.width = 1000;
		backdrop_bg.height = 240;

		var backdrop = theGame.gameLayers.bgMain.create(0, 105, 'backdrop');
		backdrop.width = 1000;
		backdrop.height = 138;

		var bg_main = theGame.gameLayers.bgMain.create(this.world.centerX, this.world.centerY, 'bg_main');
		bg_main.anchor.setTo(0.5, 0.5);
		bg_main.scale.set(1.28, 1.15);

		// add chains sprite 3 times (on full scene width)
		var chains = this.add.sprite(10, 0, 'chains');
		chains.scale.set(1, 1.25);
		chains.animations.add('swing');
		chains.animations.play('swing', 2.8, true);

		var chains2 = theGame.gameLayers.bgMain.create(336, 0, 'chains');
		chains2.scale.set(1, 1.25);
		chains2.animations.add('swing');
		chains2.animations.play('swing', 2.8, true);

		var chains3 = this.add.sprite(642, 1, 'chains');
		chains3.scale.set(1, 1.25);
		chains3.animations.add('swing');
		chains3.animations.play('swing', 2.8, true);

		var lights1 = theGame.gameLayers.bgMain.create(175, 164, 'lights_1');
		lights1.scale.set(1.1, 1);
		lights1.animations.add('rotation');
		lights1.animations.play('rotation', 5.2, true);

		var lights2 = theGame.gameLayers.bgMain.create(759, 162.1, 'lights_2');
		lights2.scale.set(1.1, 1);
		lights2.animations.add('rotation');
		lights2.animations.play('rotation', 5.2, true);

		var foreground = theGame.gameLayers.foreground.create(450, 439, 'foreground');
		foreground.anchor.setTo(0.5, 0.5);
	},

	startStageMusic: function() {
		var musicNum = this.randMusic();
		this.stageMusic = this.add.audio(this.stageMusicList[musicNum], Phaser.SoundManager.volume);
		this.stageMusic.play();
		this.deleteUsedMusic(musicNum);
		
		this.stageMusic.onStop.add(function(){
			if (!this.isGameOver){				
				this.startStageMusic();
			}
		}, this);		
	},

	randMusic: function() {		
		var randInt = Math.round(Math.random() * (this.stageMusicList.length - 1)) + 1;
		//console.log(this.stageMusicList[int - 1] + ' - ' + this.stageMusicList);
		return randInt - 1 ;
	},

	deleteUsedMusic: function(idx) {
		this.stageMusicList.splice(idx, 1);
		
		if (this.stageMusicList.length == 0)
			this.stageMusicList = this.stageMusicListTmp.slice();						
	},

	checkOverlap: function(spriteA, spriteB) {
		var boundsA = spriteA.getBounds();
		var boundsB = spriteB.getBounds();
		return Phaser.Rectangle.intersects(boundsA, boundsB);
	},

	overlapHandler: function(obj1, obj2) {
		// If key has been pressed - hit the enemy
		if(!this.isMovementComplete) {
			if (this.wasd.W.isDown || this.cursors.up.isDown){
				if (obj2.properties.side == 'left' && obj2.properties.type == 'top' && this.player.direction == 'left' ||
						obj2.properties.side == 'right' && obj2.properties.type == 'top' && this.player.direction == 'right') {
					Enemy.markAnEnemyToKill(obj2);
					this.add.audio('sfx_uppercut_hit', Phaser.SoundManager.volume).play();
				}
			}
			if (this.wasd.A.isDown || this.cursors.left.isDown){
				if (obj2.properties.side == 'left' && obj2.properties.type == 'side') {
					Enemy.markAnEnemyToKill(obj2);
					if (this.hitNum > 15)
						this.add.audio('sfx_kick', Phaser.SoundManager.volume).play();
					else
						this.add.audio('sfx_hit1', Phaser.SoundManager.volume).play();
				}
			}
			if (this.wasd.S.isDown || this.cursors.down.isDown){
				if (obj2.properties.side == 'left' && obj2.properties.type == 'bottom' && this.player.direction == 'left' ||
						obj2.properties.side == 'right' && obj2.properties.type == 'bottom' && this.player.direction == 'right') {
					Enemy.markAnEnemyToKill(obj2);
					this.add.audio('sfx_lowhit_hit', Phaser.SoundManager.volume).play();
				}
			}

			if (this.wasd.D.isDown || this.cursors.right.isDown) {
				if (obj2.properties.side == 'right' && obj2.properties.type == 'side') {
					Enemy.markAnEnemyToKill(obj2);
					if (this.hitNum > 15)
						this.add.audio('sfx_kick', Phaser.SoundManager.volume).play();
					else
						this.add.audio('sfx_hit1', Phaser.SoundManager.volume).play();
				}
			}
		}
	},

	render: function() {
	//	this.game.debug.text('Sprite z-depth: ' + this.player.sprite.z, 10, 20);
	//	this.game.debug.text('Sprite z-depth: ' + this.player.sprite.z, 10, 20);
		//this.debug.spriteBounds(this.player.sprite);  // rectanfle around a sprite
		//this.debug.body(this.player.sprite);            // physics debug

/*
		 for(var i = 0; i < this.enemies.length; i++) {
		    //this.debug.body(this.enemies[i].sprite);
		   // console.log(('Sprite z-depth: ' + this.enemies[i].sprite.z, 10, 20));
		    //this.debug.spriteBounds(this.enemies[i].sprite);
		 }*/


		// this.debug.spriteInfo(player, 32, 32);
		// this.debug.inputInfo(32, 122);
	}
}

