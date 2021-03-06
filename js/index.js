//首页
DS.Index = {
	init:function(){
		this.initFloatAd();
		this.initCarousel();
		this.initTab();
		this.sculpturerImgScroll();
		//this.sculpturerScroll();
		this.indexLastedNewsScroll();
		this.indexUsernameScroll();
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
	sculpturerImgScroll:function(){
		var _box = $("#indexSculpturerList"),
			_scrollBox = _box.find(".img-list-box"),
			_h = _scrollBox.find("a").height(),
			_timer = null,
			_index = 0,
			_len = Math.ceil(_scrollBox.height() / _h );

		_timer = setInterval(function(){
			onTimer();
		},3000);

		function onTimer(){
			_index++;
			if(_index > _len - 1)
			{
				_index = 0;
			}
			_scrollBox.animate({marginTop:-_index * _h});
		}

		_box.hover(function(){
			clearInterval(_timer);
		},function(){
			_timer = setInterval(function(){
				onTimer();
			},3000);
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

		_scroll.hover(function(){
			clearInterval(_timer);
		},function(){
			_timer = setInterval(function(){
				onTimer();
			},3000);
		});
	},
	indexLastedNewsScroll:function(){
		var p = $("#indexLastedNews");
     	var srollBox = p.find(".news-list");
     	var box = p.find(".news-list-box");
     	var html = box.html();
     	var list = p.find("li");
     	var timer;
     	var index = 0;
     	if(list.length <= 14) return false;
     	box.append(html);
     	var _st = p.find("ul").eq(1).position().top;
     	auto();
     	function auto(){
     		timer=setInterval(onTimer,30);
     	}
     	function onTimer(){			
     		var t = box.position().top - 1;			
     		if( _st<=-t ){
     			t = 0;
     		}
     		box.css({top:t});
     	}
     	box.hover(function(){
     		clearInterval(timer);
     	},function(){
     		auto();
     	});
		             
	},
	indexUsernameScroll:function(){
		var p = $("#sculpturerScroll");
     	var srollBox = p.find("#rolllink");
     	var box = p.find(".sculpturer-scroll-box");
     	var html = box.html();
     	var list = p.find("li");
		var height=box.height()-1;
     	var timer;
     	var index = 0;
     	if(list.length <= 14) return false;
     	box.append(html);
     	var _st = p.find("ul").eq(1).position().top;
		p.find("ul").css("clear","both");
     	auto_();
     	function auto_(){
     		timer=setInterval(onTimer_,60);
     	}
     	function onTimer_(){			
     		var t = box.position().top - 1;	
     		if( -t>=height ){
     			t = 0;
     		}
     		box.css({top:t});
     	}
     	box.hover(function(){
     		clearInterval(timer);
     	},function(){
     		auto_();
     	});
		             
	}
};