var DS = DS || {};
DS.exhibition = {};
DS.exhibition.online = {
	init:function(){
		//作品介绍显示
		this.showAllText();
		//回复按钮
		this.showReplyBtn();
	},
	showAllText:function(){
		var _box = $("#introText"),
			_txtBox = _box.find(".uintro-text"),
			_txt = _box.find(".uintro-text-box"),
			_btn = _box.find(".show-all");

		if(_txt.height() > 263)
		{
			_btn.removeClass("hide");
			_btn.toggle(function(){
				_btn.find("i").addClass("ico-up");
				_btn.find("span").text("收起");
				_txtBox.css("height","auto");
			},function(){
				_btn.find("i").removeClass("ico-up");
				_btn.find("span").text("展开");
				_txtBox.css("height","263px");
			});
		}
	},
	showReplyBtn:function(){
		var _box = $("#userComment");
		_box.find("li").hover(function(){
			$(this).addClass("cur");
		},function(){
			$(this).removeClass("cur");
		});
	}
};