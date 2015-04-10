//首页
DS.Index = {
	init:function(){
		this.initFloatAd();
		this.initCarousel();
		this.initTab();
		this.sculpturerScroll();
	},
	initFloatAd:function(){
		$(".float-ad").find(".ad-close").on("click",function(){
			$(this).parent().remove();
		});
	},
	initCarousel:function(){
		$("#indexBanner").owlCarousel({
			autoPlay: true,
			slideSpeed : 300,
			paginationSpeed : 400,
			pagination : true,
			paginationNumbers : false,
			singleItem:true
		});
	},
	initTab:function(){
		DS.widget("Tab",{
			tabBox:"#workShow",
			tabBtn:".tab",
			tabBoxClass:".school-list"
		});
	},
	sculpturerScroll:function(){
		var _box = $("#sculpturerScroll"),
			_downBtn = _box.find(".down"),
			_upBtn = _box.find(".up"),
			_scroll = _box.find(".sculpturer-scroll"),
			_scrollBox = _box.find(".sculpturer-scroll-box"),
			_h = _scroll.height(),
			_scrollh = _scrollBox.height(),
			_len = Math.ceil(_scrollh / _h ),
			_index = 0,
			_dirt = -1,
			_timer = null;

		if(_len <= 1) return;

		_timer = setInterval(function(){
			onTimer();
		},3000);


		function onTimer(){
			if(_dirt == -1)
			{
				_index++;
				if(_index == _len - 1)
				{
					_dirt = 1;
					_downBtn.addClass("disabled");
					_upBtn.removeClass("disabled");
				}
			}
			else if(_dirt == 1)
			{
				_index--;
				if(_index == 0)
				{
					_dirt = -1;
					_upBtn.addClass("disabled");
					_downBtn.removeClass("disabled");
				}
			}

			if(_index > 0 && _index < _len - 1)
			{
				_downBtn.removeClass("disabled");
				_upBtn.removeClass("disabled");
			}
			_scrollBox.animate({marginTop:-_index*_h},1000);
		}

		_box.find(".sculpturer-scroll-control").hover(function(){
			clearInterval(_timer);
		},function(){
			_timer = setInterval(function(){
				onTimer();
			},3000);
		});

		_downBtn.on("click",function(){
			if(_downBtn.hasClass("disabled")) return;
			_index++;
			_dirt = -1;
			if(_index == _len - 1)
			{
				_dirt = 1;
				_downBtn.addClass("disabled");
				_upBtn.removeClass("disabled");
			}
			_scrollBox.animate({marginTop:-_index*_h},1000);
		});

		_upBtn.on("click",function(){
			if(_upBtn.hasClass("disabled")) return;
			_index--;
			_dirt = 1;
			if(_index == 0)
			{
				_dirt = -1;
				_upBtn.addClass("disabled");
				_downBtn.removeClass("disabled");
			}
			_scrollBox.animate({marginTop:-_index*_h},1000);
		});
	}
};