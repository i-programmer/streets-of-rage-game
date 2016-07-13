function Enemy() {
	this.properties = {};
	this.horizontal = 1; // positive - from left to right, negative - from right to left

	this.AI = function() {
		var playerWidth = 90;
		var stopAndAttack = false;
		if (this.properties.side == 'left') {
			// magic number... For now it is the only way... :'(
			var magicOffset = (this.properties.type == 'side') ? 35 : ((this.properties.type == 'bottom') ? 5 : -10);
			if (Math.round(this.sprite.x) + this.sprite.body.width  >= Enemy.gameClass.player.sprite.x + magicOffset) {
				stopAndAttack = true;
			}
		} else {
			var magicOffset = (this.properties.type == 'side') ? -5 : ((this.properties.type == 'bottom') ? -20 : 20);
			if (Math.round(this.sprite.x)  <= Enemy.gameClass.player.sprite.x + playerWidth - magicOffset) {
				stopAndAttack = true;
			}
		}

		this.move();

		if (stopAndAttack) {
			this.sprite.body.velocity.x = 0;
			this.sprite.body.velocity.y = 0;
			this.attack();
		}
	};

	this.move = function() {
		var deltaTime = (Enemy.phaserGameClass.time.elapsedMS * Enemy.phaserGameClass.time.fps) / 1000;
		this.sprite.body.velocity.x = this.horizontal * this.properties.velocity.x * deltaTime;
		this.sprite.body.velocity.y = this.properties.velocity.y * deltaTime;
	};

	this.attack = function() {
		if (this.properties.cooldownTime == this.properties.cooldownTimeTmp) {
			// If an object has top type, get it down, and get it up after attack
			if (this.properties.type != 'top') {
				this.sprite.play('punch');
			}
			if (this.properties.type == 'top') {
				var objY = this.sprite.y;
				this.sprite.play('punch');
				this.sprite.y += 120;
				this.sprite.events.onAnimationComplete.add(function(){
					this.sprite.y = objY;
				}, this);
			}
			// play enemy hit
			Enemy.phaserGameClass.add.audio(this.properties.sfx.hit, Phaser.SoundManager.volume).play();

			this.sprite.events.onAnimationComplete.add(this.moveAnimPlay, this);

			Enemy.gameClass.player.setHP(-this.properties.hitDamage);
			if (!Enemy.gameClass.player.isCanFight()) {
				Enemy.gameClass.player.enemyLastHitSide = this.properties.side;
				Enemy.gameClass.isGameOver = true;
				Enemy.gameClass.add.audio('sfx_death', Phaser.SoundManager.volume).play();
			}
		}

		this.properties.cooldownTime -= Enemy.phaserGameClass.time.elapsedMS
		if (this.properties.cooldownTime <= 0) {
			this.properties.cooldownTime = this.properties.cooldownTimeTmp;
		}
	};

	this.moveAnimPlay = function(sprite) {
		sprite.play('move');
	};

	this.destroy = function(enemies, sprite, idx) {
		enemies.splice(idx, 1);
		sprite.sprite.kill();
	};

};

Enemy.phaserGameClass = null;
Enemy.gameClass = null;
Enemy.respawnTime = Enemy.respawnTimeTmp = 1400; // ms:  15000 ms - 1.5 sec
Enemy.levelReducingTime = 0.1;
Enemy.isSpawned = false;
Enemy.SIDES = ['top', 'side', 'bottom'];
Enemy.deathProps = {velocity :{x: 320, y: -800}, gravity: 3000};

Enemy.COMMON_PROPERTIES = {
	top: {
		type : 'top',
		velocity: {x: 290, y: 0},
		playAnimTime : 15,
		cooldownTime : 2000,
		cooldownTimeTmp: 2000,
		anchor: 0.59,
		scale: 1.64,
		kill: false,
		points: 7,
		hitDamage: 1,
		animation : [{name: 'move', frames: [4,5], speed: 4, loop: true}, {name: 'punch', frames: [30, 31, 32, 31], speed: 11, loop: false}, {name: 'death', frames: [15,14,17], speed: 3, loop: false}, {name: 'deathPose', frames: [17], speed: 10, loop: false}],
		sfx : {hit : 'sfx_enemy_hit_top', death: 'sfx_death_top'}
	},
	side: {
		type : 'side',
		velocity: {x: 290, y: 0},
		playAnimTime : 15,
		cooldownTime : 2000,
		cooldownTimeTmp: 2000,
		anchor: 0.5,
		scale: 1.9,
		kill: false,
		points: 3,
		hitDamage: 1,
		animation : [{name: 'move', frames: [4, 5, 6], speed: 4, loop: true}, {name: 'punch', frames: [5, 3, 2, 5], speed: 17, loop: false}, {name: 'death', frames: [8, 9, 12], speed: 5, loop: false}, {name: 'deathPose', frames: [12], speed: 10, loop: false}],
		sfx : {hit : 'sfx_enemy_hit_side', death: 'sfx_death_side'}
	},
	bottom: {
		type: 'bottom',
		velocity: {x: 290, y: -120},
		playAnimTime: 15,
		cooldownTime: 2000,
		cooldownTimeTmp: 2000,
		anchor: 0.52,
		scale: 1.64,
		kill: false,
		points: 5,
		hitDamage: 1,
		animation: [{name: 'move', frames: [3, 4, 5, 6], speed: 6, loop: true}, {name: 'punch', frames: [36, 37, 43, 38, 40], speed: 10, loop: false}, {name: 'death', frames: [16, 17, 19, 20], speed: 5, loop: false}, {name: 'deathPose', frames: [20], speed: 10, loop: false}],
		sfx : {hit : 'sfx_enemy_hit_btm', death: 'sfx_death_bottom'}
	}
};

Enemy.spawn = function() {
	// Infinity enemy respawn BEGIN
	Enemy.respawnTime -= Enemy.phaserGameClass.time.elapsedMS + Enemy.levelReducingTime;
	if (Enemy.respawnTime <= 0) {
		Enemy.respawnTime = Enemy.respawnTimeTmp;
		Enemy.isSpawned = false;
		Enemy.levelReducingTime += 0.13;
	}
	// Infinity enemy respawn END
	if (Enemy.isSpawned)
		return;

	// #region  BLOCK of enemy regeneration side, setting of properties
	var obj = new Enemy();
	var side = Enemy.getSpawnSide();
	var properiesData = Enemy.getProperties();

	// propertiesData TEST
	/* demo properiesData START
	//var properiesData = {type : 'side', playAnimTime : 15, cooldownTime : 2000, cooldownTimeTmp: 2000, anchor: 0.5, scale: 1.9, kill: false, animation : [{name: 'move', frames: [4, 5, 6], speed: 4, loop: true}, {name: 'punch', frames: [5, 3, 2, 5], speed: 17, loop: false}, {name: 'death', frames: [8, 9, 12], speed: 5, loop: false}, {name: 'deathPose', frames: [12], speed: 10, loop: false}]}; // НА БОЕВОМ ПОСТАВИТЬ var properiesData = Enemy.getProperties();
	//var properiesData = {type : 'top', playAnimTime : 15, cooldownTime : 2000, cooldownTimeTmp: 2000, anchor: 0.59, scale: 1.64, kill: false, animation : [{name: 'move', frames: [4,5], speed: 4, loop: true}, {name: 'punch', frames: [30, 31, 32, 31], speed: 11, loop: false}, {name: 'death', frames: [15,14,17], speed: 3, loop: false}, {name: 'deathPose', frames: [17], speed: 10, loop: false}]}; // НА БОЕВОМ ПОСТАВИТЬ var properiesData = Enemy.getProperties();
	//var properiesData = {type: 'bottom', playAnimTime: 15, cooldownTime: 2000, cooldownTimeTmp: 2000, anchor: 0.52, scale: 1.64, kill: false, animation: [{name: 'move', frames: [3, 4, 5, 6], speed: 6, loop: true}, {name: 'punch', frames: [36, 37, 43, 38, 40], speed: 10, loop: false}, {name: 'death', frames: [16, 17, 19, 20], speed: 5, loop: false}, {name: 'deathPose', frames: [20], speed: 10, loop: false}]}; // НА БОЕВОМ ПОСТАВИТЬ var properiesData = Enemy.getProperties();
	//demo properiesData END */


	properiesData.side = side;
	var spawnX = (side == 'left') ? -70 : Enemy.phaserGameClass.world.width + 45;
	var spawnY = (properiesData.type == 'side') ? 218 : (properiesData.type == 'top') ? 10 : Enemy.phaserGameClass.world.height;
	var enemyType = (properiesData.type == 'side') ? 'enemySide' : (properiesData.type == 'top') ? 'enemyTop' : 'enemyBtm';
	// #endregion

	obj.sprite = theGame.gameLayers.enemies.create(spawnX , spawnY, enemyType/*, Enemy.gameClass.layers.backgroundLayer*/);
	Enemy.setSpriteSettings(obj, properiesData);
	Enemy.setAnimations(obj);
	obj.sprite.play('move');

	Enemy.isSpawned = true;

	return obj;
};

Enemy.setSpriteSettings = function(obj, properiesData) {
	var scale = properiesData.scale;
	obj.sprite.scale.set(scale, scale);
	obj.sprite.anchor.set(properiesData.anchor, 0);
	obj.properties = properiesData;

	Enemy.phaserGameClass.physics.enable( obj.sprite , Phaser.Physics.ARCADE);

	if (properiesData.side == 'left') {
		obj.sprite.scale.x = scale;
	} else {
		obj.sprite.scale.x = -scale;
		obj.horizontal = -1;
	}
};

Enemy.setAnimations = function(sprite) {
	for (var i = 0; i < sprite.properties.animation.length; ++i) {
		var animData = sprite.properties.animation[i];
		sprite.sprite.animations.add(animData.name, animData.frames, animData.speed, animData.loop);
	}
};

Enemy.getSpawnSide = function() {
	num = Enemy.getRandomInt(1, 3);
	if (num == 1)
		return 'left';
	if (num == 2)
		return 'right';
};

// returns random integer value between min (incl.) and max (NOT incl.)
// Math.round() gives you not evenly allocation
Enemy.getRandomInt = function(min, max) {
	var randInt = Math.floor(Math.random() * (max - min)) + min;
	return randInt;
};

Enemy.getProperties = function() {
	var num = Enemy.getRandomInt(1, 4);
	return Object.assign({}, Enemy.COMMON_PROPERTIES[Enemy.SIDES[num - 1]]); // cloning property
};

Enemy.markAnEnemyToKill = function(obj) {
	obj.properties.kill = true;
	Enemy.gameClass.points += obj.properties.points;

	obj.sprite.body.velocity.x = obj.horizontal * -1 * Enemy.deathProps.velocity.x;
	obj.sprite.body.velocity.y = Enemy.deathProps.velocity.y;
	obj.sprite.body.gravity.y = Enemy.deathProps.gravity;

	Enemy.phaserGameClass.add.audio(obj.properties.sfx.death, Phaser.SoundManager.volume).play();

	obj.sprite.play('death');
	obj.sprite.events.onAnimationComplete.add(function(){
		obj.sprite.play('deathPose');
	}, this);
};

Enemy.killEnemy = function(enemies, idx) {
	var obj = enemies[idx];
	if (obj.properties.kill) {
		if (Enemy.checkGroundOverlap(obj) && obj.sprite.body.velocity.y > 100) {
			obj.sprite.body.velocity.x = 0;
			obj.sprite.body.velocity.y = 0;
			obj.sprite.body.gravity.y = 0;

			enemies.splice(idx, 1);
			obj.sprite.kill();
			//setTimeout(this.enemyDestroy, 100, Enemy.enemies, obj, idx);
		}

		return true;
	}
	
	return false;
};

Enemy.checkGroundOverlap = function(obj) {
	var boundsA = obj.sprite.getBounds();
	var boundsB = Enemy.gameClass.collisionArea.getBounds();

	return Phaser.Rectangle.intersects(boundsA, boundsB);
};