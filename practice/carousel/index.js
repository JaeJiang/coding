var Carousel = (function(){
	function init($node){
		this.$node = $node;
		$ct = this.$ct = $node.children().eq(0);//ul

		$ele = $ct.children();//li
		eleNum = $ele.length;
		this.imgW = $node.width();//get img width
		$node.find('img').width(this.imgW);//set img width

		this.curCnt = 1;
		this.clock;
		this.lock = false;

		$ct.append($ele.first().clone());//克隆第一个元素放最后
		$ct.prepend($ele.last().clone());//克隆最后一个元素放最前

		$ct.width((eleNum + 2) * this.imgW);//ul width

		$ct.css({
			'margin-left': - this.curCnt * this.imgW
		});//start position

		this.bindEvent();
		this.autoPlay();
		// this.stopAuto();
		console.log("如：var c1 = new Carousel.init($('.carousel'));\n则可以通过 c1.stopAuto(); 来停止自动播放\n通过 c1.autoPlay(); 再次开启自动播放")
	}

	init.prototype.playNext = function(i){
		var _this = this;
		var $ct = _this.$ct;
		if(_this.lock){
			return;
		}
		_this.lock = true;
		if(i){
			_this.curCnt = i;
		}else{
			_this.curCnt += 1;
		}
		$ct.animate({
			'margin-left': - _this.curCnt * _this.imgW
		},800,function(){
			if(_this.curCnt === 5){
				_this.curCnt = 1;
				
				_this.$ct.css({
					'margin-left': - _this.curCnt * _this.imgW
				});
			}
			_this.addSty(_this.curCnt);
			_this.lock = false;
		});
	};
	init.prototype.playPre = function(i){
		var _this = this;
		var $ct = _this.$ct;
		if(_this.lock){
			return;
		}
		_this.lock = true;
		if(i){
			_this.curCnt = i;
		}else{
			_this.curCnt -= 1;
		}
		$ct.animate({
			'margin-left': - _this.curCnt * _this.imgW
		},800,function(){
			if(_this.curCnt === 0){
				_this.curCnt = 4;
				
				_this.$ct.css({
					'margin-left': - _this.curCnt * _this.imgW
				});
			}
			_this.addSty(_this.curCnt);
			_this.lock = false;
		});
	};
	init.prototype.autoPlay = function(){
		var _this = this;
		_this.clock = setInterval(function(){
			_this.playNext();
		},3000);
	};
	init.prototype.stopAuto = function(){
		clearInterval(this.clock);
	};
	init.prototype.addSty = function(i){
		var $ct = this.$node.children().eq(2);//ul 2
		var num = i - 1;
		$ct.children().each(function(){
			$(this).children().removeClass('clicked');
		});
		$ct.children().eq(num).children().addClass('clicked');
	};
	init.prototype.bindEvent = function(){
		var $ct = this.$node.children().eq(1);//ul 1
		var $dire = this.$node.children().eq(2);
		var me = this;
		$ct.children().eq(0).on('click',function(){
			me.stopAuto();
			me.playPre();
			me.autoPlay();
		});
		$ct.children().eq(1).on('click',function(){
			me.stopAuto();
			me.playNext();
			me.autoPlay();
		});
		$dire.on('click','li',function(e){
			var i = $(e.target).parent().index() + 1;
			if(i > me.curCnt){
				me.stopAuto();
				me.playNext(i);
				me.autoPlay();
			}else if(i < me.curCnt){
				me.stopAuto();
				me.playPre(i);
				me.autoPlay();
			}
		});
	};

	return {
		init: init
	}
})();
var c1 = new Carousel.init($('.carousel'));