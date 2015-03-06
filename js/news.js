//新闻
DS.news = {};
DS.news.index = {
	init:function(){
		this.initCarousel();
		this.initTab();
	},
	initCarousel:function(){
		$("#topNewsCarousel").owlCarousel({
			autoPlay: true,
			navigation : true,
			navigationText : ['&lt;',"&gt;"],
			slideSpeed : 300,
			paginationSpeed : 400,
			paginationNumbers : false,
			singleItem:true
		});
	},
	initTab:function(){
		DS.widget("Tab",{
			tabBox:"#hotnewsTabBox",
			tabBtn:".tab",
			tabBoxClass:".hotnews-list"
		});
	}
}