var DS = DS || {};
DS.member = {};
DS.member.index = {
	init:function(){
		this.initCarousel();
		this.initTab();
		this.workShow();
	},
	initCarousel:function(){
		$("#banner").owlCarousel({
			autoPlay: true,
			navigation : false, 
			slideSpeed : 300,
			paginationSpeed : 400,
			paginationNumbers : true,
			singleItem:true
		});
	},
	initTab:function(){
		DS.widget("Tab",{
			tabBox:"#sculpturerTabBox",
			tabBtn:"#sculpturerTab",
			tabBoxClass:".img-list"
		});

		DS.widget("Tab",{
			tabBox:"#sculpSchoolTabBox",
			tabBtn:"#sculpSchoolTab",
			tabBoxClass:".school-list"
		});
	},
	workShow:function(){
		var _box = $("#workShow"),
			_items = _box.find(".sl-item");

		_items.hover(function(){
			$(this).addClass("sl-item-hover");
		},function(){
			$(this).removeClass("sl-item-hover");
		});
	}
};

DS.member.sculpturer = {
	init:function(){
		this.showMoreSchool();
		this.searchFilter();
	},
	showMoreSchool:function(){
		var _box = $("#ftSchool"),
			_schoolTag = _box.find(".ft-tag"),
			_moreBtn = _box.find(".more");

		_moreBtn.on("click",function(){
			_moreBtn.find(".ico").toggleClass("ico-arrow-up");
			_moreBtn.find(".ico").hasClass("ico-arrow-up") ? _moreBtn.find("span").text("收起") : _moreBtn.find("span").text("更多");
			_schoolTag.toggleClass("ft-tag-more");
			if(!_moreBtn.find(".ico").hasClass("ico-arrow-up"))
			{
				$("#ftSchool").find(".fts").find("a").show();
				$("#ftSchool").find(".fts-tab").find("a").removeClass("cur");
			}
		});
	},
	searchFilter:function(){
		DS.widget("SearchFilter",{
			box: "#ftSchool",
			tab: ".fts-tab",
			itemBox: ".fts"
		});
	}
};

DS.member.artSchool = {
	init:function(){
		this.listHover();
	},
	listHover:function(){
		var _box = $("#artSchool"),
			_rankBox = $("#articleRank");

		_box.find(".sculpturer-list").find("li").hover(function(){
			$(this).addClass("cur");
		},function(){
			$(this).removeClass("cur");
		});

		_rankBox.find("li").hover(function(){
			$(this).addClass("cur");
		},function(){
			$(this).removeClass("cur");
		});
	}
};

DS.member.work = {
	init:function(){
		this.workShow();
	},
	workShow:function(){
		var _box = $("#workShow"),
			_items = _box.find(".sl-item");

		_items.hover(function(){
			$(this).addClass("sl-item-hover");
		},function(){
			$(this).removeClass("sl-item-hover");
		});
	}
};