//首页
DS.Index = {
	init:function(){
		this.initFloatAd();
		this.initCarousel();
		this.initTab();
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
	}
};