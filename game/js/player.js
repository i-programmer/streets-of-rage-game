function Player() {
	this.phaserGameClass = theGame.getPhaserGameClass();
	
	Player.HIT_TYPE_UPPERCUT = 'uppercut';
	Player.HIT_TYPE_LOW_PUNCH = 'lowPunch';
	Player.HIT_TYPE_DEFAULT = 'default';

	this.HP = this.HPDefault = 86;
	this.hitNum = 1;
	this.SCALE = 1.94;
	this.direction = 'right';
	this.isGrounded = true;
	this.isLowPunched = true;
	this.hpBar = null;
	this.sprite = null;
	this.enemyLastHitSide = null;
	this.isMovementComplete = false;
	
	this.setup = function() {
		var player = theGame.gameLayers.player.create(this.phaserGameClass.world.centerX - 30, 355, 'char_atlas', 'axel_001');
		player.scale.set(this.SCALE, this.SCALE);
		player.anchor.set(0.45, 1);

		this.setAnimations(player);
		player.play('idle');

		this.sprite = player;
		this.setPlayerGUI();
	};

	this.setAnimations = function(sprite) {
		sprite.animations.add('idle', [64, 63, 62, 63], 8, true);
		sprite.animations.add('lowPunch', [0, 1, 2, 3, 4, 5, 6], 17, false);
		sprite.animations.add('punch1', [30, 31, 30], 20, false);
		sprite.animations.add('punch2', [30, 31, 32, 33, 32], 13, false);
		sprite.animations.add('kick', [30, 34, 35, 36, 37, 38, 39, 30], 15, false);
		sprite.animations.add('uppercut', [49, 50, 50, 51, 52, 53, 54, 55], 19, false);
		sprite.animations.add('missPunch', [59], 5, false);
		sprite.animations.add('deadFligh', [60], 5, false);
		sprite.animations.add('deathPose', [61], 10, false);
		sprite.animations.add('death', [59, 60, 61 ], 7, false);

		sprite.events.onAnimationComplete.add(function(){
			this.isMovementComplete = true;
		}, this);
	};

	this.setPlayerGUI = function() {
		this.hpBar = { inner: this.phaserGameClass.add.sprite(10, 25, 'hp_bar_inner'), outer: this.phaserGameClass.add.sprite(14, 28, 'hp_bar_outer')};
		this.hpBar.inner.scale.set(0.75);
		this.hpBar.outer.scale.set(0.748, 0.72);
		this.phaserGameClass.add.sprite(14, 8, 'char_name')
		this.hpBar.outer.widthDefault = this.hpBar.outer.width;
	};

	this.startIdleAnim = function() {
		this.checkAndSetPlayerDirection();

		this.sprite.play('idle');
	};

	this.hitPlay = function(hitType) {
		if (!(this.isGrounded && this.isLowPunched))
			return;
	
		this.isMovementComplete = false;

		if (hitType == Player.HIT_TYPE_UPPERCUT) {
			this.isGrounded = false;
			this.sprite.body.gravity.y = 5000;
			this.sprite.play('uppercut');
			this.phaserGameClass.add.audio('sfx_uppercut_voice', Phaser.SoundManager.volume).play();
			this.sprite.body.velocity.y = -1300;
			this.sprite.y = 320;
			
			return;
		}

		if (hitType == Player.HIT_TYPE_LOW_PUNCH) {
			this.isLowPunched = false;
			this.sprite.play('lowPunch');
			this.phaserGameClass.add.audio('sfx_lowhit_sound', Phaser.SoundManager.volume).play();
			this.sprite.events.onAnimationComplete.add(function(){
				this.isLowPunched = true;
			}, this);

			return;
		}

		if (this.hitNum <= 7) {
			this.sprite.play('punch1');
			this.phaserGameClass.add.audio('sfx_hit1_sound', Phaser.SoundManager.volume).play();
			this.sprite.events.onAnimationComplete.add(function(){
				this.hitNum++;
			}, this);
		}
		if (this.hitNum > 7 && this.hitNum <= 11) {
			this.sprite.play('punch2');
			this.phaserGameClass.add.audio('sfx_hit2_sound', Phaser.SoundManager.volume).play();
			this.sprite.events.onAnimationComplete.add(function(){
				this.hitNum++;
			}, this);
		}
		if (this.hitNum > 11 && this.hitNum <= 15) {
			this.sprite.play('punch1');
			this.phaserGameClass.add.audio('sfx_hit1_sound', Phaser.SoundManager.volume).play();
			this.sprite.events.onAnimationComplete.add(function(){
				this.hitNum++;
			}, this);
		}

		if (this.hitNum > 15) {
			this.sprite.play('kick');
			this.phaserGameClass.add.audio('sfx_kick_sound', Phaser.SoundManager.volume).play();
			this.sprite.events.onAnimationComplete.add(function(){
				this.hitNum = 1;
			}, this);
		}
	};

	this.checkAndSetPlayerDirection = function() {
		if (this.direction == 'right')
			this.sprite.scale.x = this.SCALE;
		else
			this.sprite.scale.x = -this.SCALE;
	};

	this.setHP = function(adj) {
		this.HP += adj;	
	};

	this.isCanFight = function() {
		if (this.HP <= 0) {
			this.HP = 0;
			return false
		}

		return true;
	};
	
	this.updade = function() {
		if (this.isGrounded) {
			this.sprite.body.gravity.y = 0;
			this.sprite.body.velocity.y = 0;
		}
		
		this.checkAndSetPlayerDirection();
	}

	// create sprites of char, add animations for him
	this.setup();
}
