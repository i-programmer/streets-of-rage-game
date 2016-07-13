var preloader = function(game){
	this.preloadBar = null;
	this.ready = false;
};


preloader.prototype = {

	preload: function(){
		console.log("%cLoading images & sounds...", "color:white; background: #450f78; padding: 2px 10px;");
		this.stage.disableVisibilityChange = true;
		var bgGameOver = this.add.image(this.world.x, this.world.y, 'preload_bg');
		bgGameOver.anchor.set(0, 0);
		bgGameOver.scale.set(0.65, 0.52);

		this.add.bitmapText(this.world.centerX - 50, this.world.height - 250, 'fontSOR', "Loading", 20);
		var loadingBar = this.add.sprite(this.world.centerX + 19, this.world.height - 220, "loadBarBlue");
		loadingBar.scale.set(1.2, 1);
		loadingBar.anchor.setTo(0.5, 0.5);
		loadingBar.animations.add('loading');
		loadingBar.animations.play('loading', 8, true);
		// game bg images
		this.load.image('bg_main', 'img/common/bg_main.gif');
		this.load.image('backdrop_bg', 'img/common/backdrop_bg.jpg');
		this.load.image('backdrop', 'img/common/backdrop.png');
		this.load.image('bg_game_over', 'img/common/bg_game_over.jpg');
		this.load.image('restart_btn', 'img/common/restart.png');
		this.load.image('start_btn', 'img/common/startBtn.png');		
		this.load.image('collision_area_BIG', 'img/common/collision_area_BIG.jpg');

		this.load.spritesheet('chains', 'img/common/chains_sprite.png', 330, 68.8, 7);
		this.load.spritesheet('lights_1', 'img/common/lights_1_sprite.png', 36, 16, 8);
		this.load.spritesheet('lights_2', 'img/common/lights_2_sprite.png', 16, 16, 8);

		this.load.image('foreground', 'img/common/foreground.png');

		// player sprite
		this.load.atlas('char_atlas', 'img/chars/axel.png', 'img/chars/axel.json');

		this.load.image('hp_bar_inner', 'img/chars/hp_bar_inner.png');
		this.load.image('hp_bar_outer', 'img/chars/hp_bar_outer.png');
		this.load.image('char_name', 'img/chars/char_name.png');

		// enemies sprites
		this.load.atlas('enemySide', 'img/enemies/enemy_1.png', 'img/enemies/enemy_1.json');
		this.load.atlas('enemyTop', 'img/enemies/enemyTop.png', 'img/enemies/enemyTop.json');
		this.load.atlas('enemyBtm', 'img/enemies/enemyBtm.png', 'img/enemies/enemyBtm.json');		

		// music
		this.load.audio('stageMusic_1', ['sounds/1 - stageMusic_1.ogg']);
		this.load.audio('stageMusic_2', ['sounds/2 - stageMusic_2.ogg']);
		this.load.audio('stageMusic_3', ['sounds/3 - stageMusic_3.ogg']);
		//this.load.audio('stageMusic_4', ['sounds/4 - stageMusic_4.ogg']);
		this.load.audio('stageMusic_5', ['sounds/5 - stageMusic_5.ogg']);
		//this.load.audio('stageMusic_6', ['sounds/6 - stageMusic_6.ogg']);
		this.load.audio('stageMusic_7', ['sounds/7 - stageMusic_7.ogg']);
		this.load.audio('stageMusic_8', ['sounds/8 - stageMusic_8.ogg']);
		
	
		this.load.audio('startMusic', ['sounds/SORSuperMix.ogg']);
		var sfxPath = 'sounds/sfx/';
		this.load.audio('sfx_hit1_sound', [sfxPath + 'punch1.ogg']);
		this.load.audio('sfx_hit1', [sfxPath + 'V00.wav']);
		this.load.audio('sfx_hit2_sound', [sfxPath + 'punch2.ogg']);
		this.load.audio('sfx_hit2', [sfxPath + 'V01.wav']);

		this.load.audio('sfx_kick_sound', [sfxPath + 'punch3.ogg']);
		this.load.audio('sfx_kick', [sfxPath + 'V666.wav']);
		this.load.audio('sfx_kick2', [sfxPath + 'V03.wav']);

		this.load.audio('sfx_uppercut_voice', [sfxPath + 'V06.wav']);
		this.load.audio('sfx_uppercut_hit', [sfxPath + 'V03.wav']);
		this.load.audio('sfx_lowhit_sound', [sfxPath + '16.wav']);
		this.load.audio('sfx_lowhit_hit', [sfxPath + 'V01.wav']);

		this.load.audio('sfx_death', [sfxPath + 'char_death.wav']);

		this.load.audio('sfx_death_top', [sfxPath + 'V10.wav']);
		this.load.audio('sfx_death_side', [sfxPath + 'V10.wav']);
		this.load.audio('sfx_death_bottom', [sfxPath + 'V11.wav']);

		this.load.audio('sfx_enemy_hit', [sfxPath + 'V26.wav']);
		this.load.audio('sfx_enemy_hit_top', [sfxPath + 'V41.wav']);
		this.load.audio('sfx_enemy_hit_side', [sfxPath + 'V14.wav']);
		this.load.audio('sfx_enemy_hit_btm', [sfxPath + 'V32.wav']);
	},

	create: function() {

	},

	update: function () {
		if (this.checkDecoded() && this.ready == false) {
			console.log("%cMusic has been loaded...", "color:white; background: #450f78; padding: 2px 10px;");
			this.ready = true;
			this.state.start("Menu", true, false, false);
		}
	},

	checkDecoded: function() {
		var ret = true;

		ret &= this.cache.isSoundDecoded('stageMusic_1');
		ret &= this.cache.isSoundDecoded('stageMusic_2');
		ret &= this.cache.isSoundDecoded('stageMusic_3');
		//ret &= this.cache.isSoundDecoded('stageMusic_4');
		ret &= this.cache.isSoundDecoded('stageMusic_5');
		//ret &= this.cache.isSoundDecoded('stageMusic_6');
		ret &= this.cache.isSoundDecoded('stageMusic_7');
		ret &= this.cache.isSoundDecoded('stageMusic_8');

		ret &= this.cache.isSoundDecoded('startMusic');


		ret &= this.cache.isSoundDecoded('sfx_hit1_sound');
		ret &= this.cache.isSoundDecoded('sfx_hit1');
		ret &= this.cache.isSoundDecoded('sfx_hit2_sound');
		ret &= this.cache.isSoundDecoded('sfx_hit2');
		ret &= this.cache.isSoundDecoded('sfx_kick_sound');
		ret &= this.cache.isSoundDecoded('sfx_kick');
		ret &= this.cache.isSoundDecoded('sfx_kick2');
		ret &= this.cache.isSoundDecoded('sfx_uppercut_voice');
		ret &= this.cache.isSoundDecoded('sfx_uppercut_hit');
		ret &= this.cache.isSoundDecoded('sfx_lowhit_sound');
		ret &= this.cache.isSoundDecoded('sfx_lowhit_hit');
		ret &= this.cache.isSoundDecoded('sfx_enemy_hit');
		ret &= this.cache.isSoundDecoded('sfx_enemy_hit_top');
		ret &= this.cache.isSoundDecoded('sfx_enemy_hit_side');
		ret &= this.cache.isSoundDecoded('sfx_enemy_hit_btm');

		ret &= this.cache.isSoundDecoded('sfx_death');
		ret &= this.cache.isSoundDecoded('sfx_death_top');
		ret &= this.cache.isSoundDecoded('sfx_death_side');
		ret &= this.cache.isSoundDecoded('sfx_death_bottom');

		console.log('%cMusic loading: ' + Math.round(this.time.totalElapsedSeconds()) + ' sec.', "color:white; background: #450f78; padding: 2px 10px;");

		return ret;
	}
}
