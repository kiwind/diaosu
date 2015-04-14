var DS = DS || {};
DS.competition = {};
DS.competition.work = {
	init:function(){
		//评委操作作品入围
		this.enterWork();
		//评委投票
		this.voteWork();
		//显示投票评委名单
		this.showVoters();
	},
	enterWork:function(){
		var _box = $("#competitionWork");

		_box.delegate(".btn-enter-cur","mouseenter",function(){
			$(this).text("取消入围");
		});

		_box.delegate(".btn-enter-cur","mouseleave",function(){
			$(this).text("已入围");
		});

		_box.delegate(".btn-enter-cur","click",function(){
			alert("取消")
			$(this).text("入围");
			$(this).removeClass("btn-enter-cur");
			return false;
		});

		_box.delegate(".btn-enter","click",function(){
			alert("入围");
			return false;
		});
	},
	voteWork:function(){
		var _box = $("#competitionEnterWork");

		_box.delegate(".btn-enter-cur","mouseenter",function(){
			$(this).text("取消投票");
		});

		_box.delegate(".btn-enter-cur","mouseleave",function(){
			$(this).text("已投票");
		});

		_box.delegate(".btn-enter-cur","click",function(){
			alert("取消")
			$(this).text("投票");
			$(this).removeClass("btn-enter-cur");
			return false;
		});

		_box.delegate(".btn-enter","click",function(){
			alert("投票");
			return false;
		});
	},
	showVoters:function(){
		var _items = $(".judge-vote");
		if(_items.length < 1) return;
		_items.hover(function(){
			$(this).parent().parent().css("z-index",100);
			$(this).find(".voters").show();
		},function(){
			$(this).parent().parent().css("z-index",1);
			$(this).find(".voters").hide();
		});
	}
};

DS.competition.rank = {
	init:function(){
		this.rankHover();
	},
	rankHover:function(){
		$(".judge-rank").find("tbody").find("tr").on("mouseenter",function(){
			$(this).addClass("hover").siblings().removeClass("hover");
		});
	}
};