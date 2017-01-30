define(['jquery'],function($){
	var Squee = function($ct){
		var $ele;
		var flag = false;
		$ct.find('li').on('mouseenter',function(){
			// console.log(this)
			if(flag) return;
			flag = true;
			$(this).siblings().css({
				width: 50
			});
			$(this).animate({
				width: 800
			},500,()=>{
				flag = false;
			});
		});
		$ct.find('ul').on('mouseleave',function(){
			if(flag) return;
			$(this).children().animate({
				width: 200
			},500);
		});
	};

	return	Squee;
});