var menu = function(game){
	this.isGameOverrr = false;
	this.titleMusic;
	this.gamePoints = 0;
	this.aliveTime = 0;
};

menu.prototype = {

	init: function(gameOver, points, aliveTime){
		this.isGameOverrr = gameOver;
		this.gamePoints = points;
		this.aliveTime = aliveTime;
	},

	create: function(){		
		console.log("%cStarting menu...", "color:white; background: #450f78; padding: 2px 10px;");
		this.stage.disableVisibilityChange = true;

		var bgGameOver = this.add.image(this.world.x, this.world.y, 'bg_game_over');
		bgGameOver.scale.set(0.55, 0.44);
		
		this.titleMusic = this.add.audio('startMusic');
		this.titleMusic.loopFull();

		var startBtn = this.add.button(this.world.centerX, this.world.height - 80, 'start_btn', this.playTheGame, this);
		startBtn.scale.set(0.31)
		startBtn.inputEnabled = true;
		startBtn.input.useHandCursor = true;
		
		// my sign
		this.add.bitmapText(this.world.width - 225, this.world.height - 50, 'fontSOR', 'remake by', 20);
		this.add.bitmapText(this.world.width - 250, this.world.height - 22, 'fontSOR', 'iprogrammer', 20);

		if (this.isGameOverrr) {
			console.log("%cGame Over...", "color:white; background: #450f78; padding: 2px 10px;");
			var style = { font: "18px Arial", fill: "#fff", align: "center" };
			this.add.text(this.world.centerX - 54, this.world.height - 60, 'Game', style);
			this.add.text(this.world.centerX + 63, this.world.height - 60, 'Over', style);

			this.pointsText = this.add.bitmapText(this.world.width - 30, this.world.y + 40, 'fontSOR', 'score ' + this.gamePoints + '', 20);
			this.pointsText.anchor.set(1, 0.5);
			var aliveText = this.add.bitmapText(this.world.width - 30, this.world.y + 70, 'fontSOR', 'was alive for ' + this.aliveTime + ' sec.', 20);
			aliveText.anchor.set(1, 0.5);
		}
	},

	update: function() {
		this.titleMusic.volume = Phaser.SoundManager.volume;
	},

	playTheGame: function(){
		this.isGameOverrr = false;
		this.titleMusic.stop();
		this.state.start("Game");
	}
}