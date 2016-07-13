var boot = function(game){
	console.log("%cStarting boot...", "color:white; background: #450f78; padding: 2px 10px;");
};

boot.prototype = {

	preload: function(){
		this.load.image('preload_bg', 'img/common/bg_big_6.gif');		
		this.load.spritesheet('loadBarBlue', 'img/common/load_bar_blue.png', 120, 10);
		this.load.bitmapFont('fontSOR', 'fonts/fontSOR.png', 'fonts/fontSOR.xml');
	},

	create: function(){
		this.state.start("Preload");
	}
}