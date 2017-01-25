define(['jquery','randomplay','app/event'],function($,getSongsFM,eventCenter){
	var bindEvent = (function(){

		var flag = false;

		$('.play').on('click',function(){
			$('.play').toggle();
			$('.pause').toggle();
			document.getElementsByTagName('audio')[0].play();
			flag = true;
			eventCenter.triggerEvent('playOrStop',flag);
		});

		$('.pause').on('click',function(){
			flag = false;
			$('.pause').toggle();
			$('.play').toggle();
			document.getElementsByTagName('audio')[0].pause();
			flag = false;
			eventCenter.triggerEvent('playOrStop',flag);
		});

		$('.side').on('click',function(){
			$('#fm article').toggle();
			$('#fm aside.fm-classify').toggle();
		});

		$('.right').on('click',function(){
			$('audio').removeAttr('src');

			getSongsFM.getRandomSongs();
			setTimeout(function(){
				document.getElementsByTagName('audio')[0].play();
				flag = true;
				eventCenter.triggerEvent('playOrStop',flag);
			},2000)
			$('.play').hide();
			$('.pause').show();
			
		});

		$('.fm-classify').on('click','a',function(e){
			$('audio').removeAttr('src');

			var fm = $(e.target).data('channel');

			getSongsFM.getRandomSongs(fm);
			setTimeout(function(){
				document.getElementsByTagName('audio')[0].play();
				
			},1000)
			$('#fm article').toggle();
			$('#fm aside.fm-classify').toggle();
		});

	})();

	return bindEvent;
});