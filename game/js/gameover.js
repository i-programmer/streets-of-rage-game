var gameOver = function(game){
	this.gameClass;
};


gameOver.prototype = {
	init: function(gameClass){
		this.gameClass = gameClass;
	},

	create: function(){
		console.log("%cGame over.", "color:white; background: #450f78; padding: 2px 10px;");

		this.gameClass.stageMusic.stop();

		this.gameClass.player.sprite.body.velocity.x = (this.gameClass.player.enemyLastHitSide == 'right') ? -400 : 400;
		this.gameClass.player.sprite.scale.x = (this.gameClass.player.enemyLastHitSide == 'right') ? this.gameClass.player.SCALE : -this.gameClass.player.SCALE;
		this.gameClass.player.sprite.body.velocity.y = -1000;
		this.gameClass.player.sprite.body.gravity.y = 2600;
		this.gameClass.player.sprite.play('death');
		this.gameClass.player.sprite.events.onAnimationComplete.add(function(){
			this.gameClass.player.sprite.play('deathPose');
			this.gameClass.player.sprite.events.onAnimationComplete.add(function(){

			}, this);
		}, this);
	},

	update: function() {
		if (this.gameClass.checkOverlap(this.gameClass.player.sprite, this.gameClass.collisionArea) && this.gameClass.player.sprite.body.velocity.y > 100) {

			this.gameClass.player.sprite.body.velocity.x = 0;
			this.gameClass.player.sprite.body.velocity.y = 0;
			this.gameClass.player.sprite.body.gravity.y = 0;

			this.gameClass.enemies = [];

			this.gameClass.player.sprite.y = 305;
			this.gameClass.player.HP = this.gameClass.player.HPDefault;

			this.gameClass.isGameOver = false;

			this.state.start("Menu", true, false, true, this.gameClass.points, this.gameClass.aliveTime);
		}
	}
}