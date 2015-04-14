//Copyright  All Rights Reserved
/**
 * DS base lib
 * created by author kiwind @ 2014-10-15 / kiwind.cn
 */
var DS = (function($){
    var _DS = function(Fn){
        this.Fn = Fn || [];
        var para = Array.prototype.slice.call(arguments);
        if (para.length === 0) {
            return this.Fn;
        }
        return new _DS.widget[para[0]](para[1]);
    };
    _DS.widget = _DS.prototype;
    /**
     * [选项卡]
     * @para opt: {object} 传入的对象参数
     * @para uid: {String} 总控制的id，为更好拓展而设，可选，默认为空
     * @para tabBtn: {String} 切换选项卡控制触发容器id，必须存在
     * @para tabBtnElem: {String} 选项卡控制触发器元素，默认为"li"
     * @para tabBtnClass: {String} 选项卡控制触发器当前样式，默认为"cur"
     * @para tabType: {String} 选项卡控制触发器触发事件，默认为"click"
     * @para tabBox: {String} 选项卡内容总控制id，初始为空，建议选项卡所有内容用id包裹
     * @para tabBoxClass: {String} 选项卡每块内容class，默认为".tabBox"
     * @para callback: {Fucntion} 选项卡触发容器元素，即tabBtnElem触发效果回调函数
     * @para ajaxData: {Array} ajax方法参数数组，如有ajax数据抓取，必须存在
     * @para ajaxType: {String} ajax获取数据方法，默认为GET
     * @para ajaxDataType: {String} ajax获取数据的格式，默认为html
     * @para delay: {Boolean} 是否延迟触发，默认false
     * @para delaytTime: {Number} 默认200
     */
    _DS.widget.Tab = function(opt) {
        this.opt = opt || {};
        this.uid = this.opt.uid || "";
        this.tabBtn = this.opt.tabBtn || ".tab";
        this.tabBtnElem = this.opt.tabBtnElem || "li";
        this.tabBtnClass = this.opt.tabBtnClass || "cur";
        this.tabType = this.opt.tabType || "click";
        this.tabBox = this.opt.tabBox || "";
        this.tabBoxClass = this.opt.tabBoxClass || ".tabBox";
        this.tabMore = this.opt.tabMore || ".tab-more";
        this.callback = this.opt.callback || function() {};
        this.ajaxData = this.opt.ajaxData || [];
        this.ajaxType = this.opt.ajaxType || "GET";
        this.ajaxDataType = this.opt.ajaxDataType || "html";
        this.delay = this.opt.delay;
        this.delayTime = this.opt.delayTime || 200;
        this.eq = this.opt.eq || 0;
        this.loadingText = this.opt.loadingText || "";
        this.init();
    };

    _DS.widget.Tab.prototype = {
        init: function() {
            this.startFn();
        },
        ajax: function(i) {
            var self = this;
            var ajax_self = this.ajaxPara;
            if (self.ajaxData.length === 0) {
                return;
            }
            var tabBox = $(self.tabBox) || $(self.uid);
            var selectedTab = tabBox.find(self.tabBoxClass).eq(i);
            var ajax_data_cur = self.ajaxData[i - 1];
            if (self.ajaxData.length > 0 && !selectedTab.hasClass("done") && i > 0) {
                $.ajax({
                    url: ajax_data_cur.ajaxUrl + "&" + new Date().getTime(),
                    type: self.ajaxType,
                    data: ajax_data_cur.data,
                    dataType: self.ajaxDataType,
                    beforeSend: function() {
                        selectedTab.html(self.loadingText).addClass("data-loading");
                    },
                    success: function(responseText) {
                        if(self.ajaxDataType != "html"){
                            if ( typeof ajax_data_cur.parseFn == "function" ) {
                                ajax_data_cur.parseFn(responseText,selectedTab);
                            }
                        }else{
                            selectedTab.html(responseText);
                        }
                    },
                    error: function() {
                        alert("网络连接失败，请检测您的网络环境稍后重试");
                    },
                    complete: function() {
                        selectedTab.addClass("done").removeClass("data-loading"); //.removeClass("loading")
                        if (typeof ajax_data_cur.callback == "function") {
                            ajax_data_cur.callback(selectedTab);
                        }
                    }
                });
            }
        },
        startFn: function() {
            this.bind();
            this.eqFn();
        },
        bind: function() {
            if (this.delay) {
                this.delayFn();
                return;
            }
            var self = this;
            var tabBox = $(self.tabBox) || $(self.uid);
            var tabBtn = tabBox.find(self.tabBtn);
            tabBtn.find(self.tabBtnElem).bind(self.tabType, function(e) {
                var $this = $(this);
                //var e = e.originalEvent;
                function isMouseLeaveOrEnter(_e, handler) {
                    if (e.type != 'mouseout' && e.type != 'mouseover') return false;
                    var reltg = e.relatedTarget ? e.relatedTarget : e.type == 'mouseout' ? e.toElement : e.fromElement;
                    while (reltg && reltg != handler)
                    reltg = reltg.parentNode;
                    return (reltg != handler);
                }
                if (isMouseLeaveOrEnter(e, this)) {
                    self.tabFn(self, $this, tabBox);
                }else{
                    self.tabFn(self, $(this), tabBox);
                }
            });
        },
        delayFn: function() {
            var self = this;
            var tabBox = $(self.tabBox) || $(self.uid);
            var tabBtn = tabBox.find(self.tabBtn);
            
            tabBtn.find(self.tabBtnElem).bind(self.tabType, function() {
                var $this = $(this);
                self.timer = setTimeout(function() {
                    self.tabFn(self, $this, tabBox);
                }, self.delayTime);
            });
            tabBtn.find(self.tabBtnElem).mouseout(function() {
                clearTimeout(self.timer);
            });
        },
        tabFn: function(self, $this, _tabBox) {
            var tabBtn = _tabBox.find(self.tabBtn);
            var index = tabBtn.find(self.tabBtnElem).index($this);
            var _tabBox_cur = _tabBox.find(self.tabBoxClass).eq(index);
            $this.addClass(self.tabBtnClass).siblings().removeClass(self.tabBtnClass);
            self.tabMore && tabBtn.find(self.tabMore).eq(index).show().siblings().hide();
            _tabBox_cur.show().siblings(self.tabBoxClass).hide();
            self.asyncLoad(_tabBox_cur);
            if (self.callback && Object.prototype.toString.call(self.callback) == "[object Function]") {
                self.callback(index, $this);
            }
            self.ajax(index);
        },
        eqFn: function() {
            if (this.eq === 0) {
                return;
            }
            if (this.eq !== 0) {
                var tabBox = $(self.tabBox) || $(self.uid);
                var tabBtn = tabBox.find(self.tabBtn);
                tabBtn.find(this.tabBtnElem).eq(this.eq).trigger(this.tabType);
            }
        },
        asyncLoad: function(_this){
            var _img = _this.find("img");
            _img.each(function(){
                $(this).addClass("blankbg");
                if($(this).attr("src3")){
                    $(this).attr("src",$(this).attr("src3")).removeAttr("src3");
                }
            });
        }
    };

    /**
     * [公用弹框]
     * @para opt: {object} 传入的对象参数
     * @para box: {String} 弹框容器id，必须存在
     * @para hasMask: {Boolean} 弹框是否有遮罩,默认为无
     * @para closeBtn: {String} 弹框关闭按钮class，默认为"close-btn"
     * @para sureBtn: {String} 弹框确定按钮class，默认为"sure-btn"
     * @para cancleBtn: {String} 弹框取消按钮class，默认为"cancle-btn"
     * @para saveBtn: {String} 弹框保存按钮class，默认为"save-btn"
     * @para msg: {String} 弹框文本内容，默认为空
     * @para title: {String} 弹框标题内容，默认为空
     * @para closecallback: {Fucntion} 关闭回调函数
     * @para surecallback: {Fucntion} 确定按钮回调函数
     * @para savecallback: {Fucntion} 保存按钮回调函数
     * @para initFn: {Fucntion} 初始化回调函数
     */
    _DS.widget.AlertBox = function(opt){
        this.opt = opt || {};
        this.box = this.opt.box || "";
        this.hasMask = this.opt.hasMask || false;
        this.closeBtn = this.opt.closeBtn || ".close-btn";
        this.sureBtn = this.opt.sureBtn || ".sure-btn";
        this.cancelBtn = this.opt.cancelBtn || ".cancle-btn";
        this.saveBtn = this.opt.saveBtn || ".save-btn";
        this.goBookShelfBtn = this.opt.goBookShelfBtn || ".goBs"
        this.msg = this.opt.msg || "";
        this.title = this.opt.title || "";
        this.closecallback = this.opt.closecallback || function(){};
        this.surecallback = this.opt.surecallback || function(){};
        this.savecallback = this.opt.savecallback || function(){};
        this.canclecallback = this.opt.canclecallback || function(){};
        this.goBsCallback = this.opt.goBsCallback || function(){};
        this.initFn = this.opt.initFn || function(){};
        this.init();
    };
    _DS.widget.AlertBox.prototype = {
        /**
         * 提取公共弹出框
         */
        init:function(){
            if($("#mask").length > 0)
            {
                $("#mask").remove();
            }
            this.show();
            this.bind();
        },
        show:function(){
            var _this = this;
            var winH = document.body.clientHeight;
            var winW = document.documentElement.clientWidth;
            var isIE=!!window.ActiveXObject; 
            this.isIE6=isIE&&!window.XMLHttpRequest;
            var _hasMask = this.hasMask==true ? 0.5 : 0;
            var mask = document.createElement("div");
            var box = $(this.box);
            $("body").append(box);
            mask.id = "mask";
            var boxL = winW / 2 - box.width() / 2;
            var boxT =  $(window).height()/2 - box.height() / 2 ;
            mask.style.cssText = "position:fixed;top:0;left:0;background:#333;height:100%;width:100%;z-index:9999;opacity:" + _hasMask + ";filter:alpha(opacity=" + _hasMask * 100 + ");";
            document.body.appendChild(mask);
            if(this.isIE6){
                mask.style.cssText = "position:absolute;top:0;left:0;background:#333;height:" + winH + "px;width:" + winW + "px;z-index:9999;opacity:" + _hasMask + ";filter:alpha(opacity=" + _hasMask * 100 + ");";
                var iframe = document.createElement("iframe");
                iframe.id="fixMask";
                iframe.style.position = "absolute";
                iframe.style.top = 0;
                iframe.style.left = 0;
                iframe.style.zIndex = "9999";
                iframe.style.height = winH + "px";
                iframe.style.width = winW - 10 + "px";
                iframe.style.filter = "alpha(opacity=0)";
                document.body.appendChild(iframe);
            }
            box[0].style.zIndex = "100000";
            box[0].style.cssText = "position:fixed;display:block;left:" + boxL + "px;top:" + boxT + "px;z-index:100000;";
            if(this.isIE6){
                boxT =  (document.body.scrollTop || document.documentElement.scrollTop) + window.screen.height/2 - box[0].clientHeight / 2 - 100;
                box[0].style.cssText = "position:absolute;display:block;left:" + boxL + "px;top:" + boxT + "px;z-index:100000;";
            }
            box.find(".tip-msg").text(_this.msg);
            if(this.title != "")
            {
                box.find("span.name").text(this.title);
            }
            this.initFn(this,box,$(mask));
        },
        bind:function(){
            var _this = this,
                box = $(this.box),
                _mask = $("#mask");

            box.find(this.closeBtn).unbind("click");
            box.find(this.closeBtn).click(function(){
                removeBox();
                _this.closecallback(_this);
                return false;
            })

            box.find(this.sureBtn).unbind("click");
            box.find(this.sureBtn).bind("click",function(){
                _this.surecallback();
                return false;
            })

            box.find(this.saveBtn).unbind("click");
            box.find(this.saveBtn).bind("click",function(){
                removeBox();
                _this.savecallback();
                return false;
            })

            box.find(this.cancelBtn).unbind("click");
            box.find(this.cancelBtn).bind("click",function(){
                //removeBox();
                _this.canclecallback();
                return false;
            })

            box.find(this.goBookShelfBtn).unbind("click");
            box.find(this.goBookShelfBtn).bind("click",function(){
                removeBox();
                _this.goBsCallback();
                return false;
            })

            function removeBox(){
                $(box).hide();
                _mask.remove();
                if(_this.isIE6){
                    $("#fixMask").remove();
                }
            }

        },
        hideBox:function(){
            var _this = this,
                box = $(this.box),
                _mask = $("#mask");
            $(box).hide();
            _mask.remove();
            if(_this.isIE6){
                $("#fixMask").remove();
            }

        }
    };

    _DS.widget.Popbox = function(opt){
       this.opt = opt || {};
       this.tip = this.opt.tip || '';
       this.btnText = this.opt.btnText || [];
       this.callback = this.opt.callback || [];
       this.initializer();
    };

    _DS.widget.Popbox.prototype = {
        initializer : function(){
            var self = this,
                _btnstr = "";
            var mask = document.createElement("div");
            mask.id = "mask";
            mask.style.cssText = "position:fixed;top:0;left:0;background:#333;height:100%;width:100%;z-index:9999;opacity:0.5;filter:alpha(opacity=50);";
            document.body.appendChild(mask);
            switch(self.btnText.length)
            {
                case 1:
                    _btnstr = '<a href="#" class="pbtn">'+ self.btnText[0] +'</a>';
                    break;
                case 2:
                    _btnstr = '<a href="#" class="pbtn pbtn-br">'+ self.btnText[0] +'</a>'+
                              '<a href="#" class="pbtn">'+ self.btnText[1] +'</a>';
                    break;
                default:
                    break;
            }
            var pop = '<div id="popBox" class="pop pop-order-sure pop-order-sit hide">'+
                            '<div class="p-content">'+
                                '<p class="p-tip">'+ self.tip +'</p>'+
                            '</div>'+
                            '<div class="p-btn wbox">'+ _btnstr +'</div>'+
                        '</div>';
            $("body").append(pop);
            var _popbox = $("#popBox");
            var boxL = $(window).width()*0.5 - _popbox.width()*0.5;
            var boxT = $(window).height()*0.5 - _popbox.height()*0.5;
            _popbox[0].style.zIndex = "100000";
            _popbox[0].style.cssText = "position:fixed;display:block;left:" + boxL + "px;top:" + boxT + "px;z-index:100000;";
            _popbox.find(".pbtn").each(function(index){
                $(this).bind("click",function(){
                    self.callback[index](self);
                    return false;
                });
            });
        },
        hideBox:function(){
            var _this = this,
                box = $("#popBox"),
                _mask = $("#mask");
            box.remove();
            _mask.remove();
        }
    };

    /**
     * [输入字数限制]
     * @para opt: {object} 传入的对象参数
     * @para box: {String} 输入容器，必须存在
     */
    _DS.widget.InputLimit = function(opt){
        this.opt = opt || {};
        this.box = this.opt.box || null;
        this.input = this.opt.input || "textarea";
        this.numTxt = this.opt.numTxt || ".count";
        this.limit = this.opt.limit || 30;
        var timer,
            _input = this.box.find(this.input),
            _numTxt = this.box.find(this.numTxt),
            _dstr = _input.val(),
            _limit = this.limit;

        _numTxt.text(_limit-_input.val().length);
        _input.bind({
            focusin:function(){
                var ta = $(this);
                timer = setInterval(function(){
                    var str = ta.val();
                    if(str.length > _limit)
                    {
                        str = str.substr(0,_limit);
                        ta.val(str);
                    }
                    _numTxt.text(_limit - str.length);
                },100);
            },
            focusout:function(){
                if($(this).val() == "")
                {
                    $(this).val(_dstr);
                    _numTxt.text(_limit);
                }
                clearInterval(timer);
            }
        })
    };

    

    _DS.widget.ChangeNum = function(opt){
        this.opt = opt || {};
        this.reduceBtn = this.opt.reduceBtn || null;
        this.addBtn = this.opt.addBtn || null;
        this.txt = this.opt.txt || null;
        this.count = 1;
        this.callback = this.opt.callback || function(){};
        this.init();
    };

    _DS.widget.ChangeNum.prototype = {
        init:function(){
            var _this = this;
            _this.count = parseInt(this.txt.val());
            _this.reduceBtn.bind("click",function(){
                _this.count--;
                if(_this.count<=0)
                {
                    _this.count=1;
                    _this.callback(true);
                }
                else
                {
                    _this.callback(false);
                }
                _this.showNum(_this.count);
                
                return false;
            });
            _this.addBtn.bind("click",function(){
                _this.count++;
               
                _this.showNum(_this.count);
                _this.callback();
                return false;
            });
        },
        showNum:function(n){
            this.txt.val(this.count);
        }
    };

    _DS.widget.SearchFilter = function(opt){
        this.opt = opt || {};
        this.box = this.opt.box;
        this.tab = this.opt.tab || ".tab";
        this.tabItem = this.opt.tabItem || "a";
        this.itemBox = this.opt.itemBox;
        this.item = this.opt.item || "a";
        this.init();
    };

    _DS.widget.SearchFilter.prototype = {
        init:function(){
            var _this = this,
                _box = $(_this.box),
                _tab = _box.find(_this.tab),
                _tabItem = _tab.find(_this.tabItem);

            _tabItem.on("click",function(){
                var _fv = $(this).text();
                $(this).addClass("cur").siblings().removeClass("cur");
                _this.filterItems(_fv);
            });
        },
        filterItems:function(v){
            var _this = this,
                _box = $(_this.box),
                _itemBox = _box.find(_this.itemBox),
                _item = _itemBox.find(_this.item);

            _item.each(function(){
                $(this).attr("sindex") == v ? $(this).show() : $(this).hide();
            });

        }
    };

    _DS.widget.CountDown = function(opt){
        this.opt = opt || {};
        this.box = this.opt.box;
        this.seconds = this.opt.seconds || 60;
        this.txt = this.opt.txt;
        this.callback = this.opt.callback || function(){};
        this.init();
    };

    _DS.widget.CountDown.prototype = {
        init:function(){
            var _this = this;
            _this.showTime(_this.seconds);
            _this.timer = setInterval(function(){
                _this.onTimer();
            },1000);
        },
        onTimer:function(){
            var _this = this;
            _this.seconds --;
            if(_this.seconds < 0)
            {
                _this.callback();
                clearInterval(_this.timer);
                _this.timer = null;
                return;
            }
            _this.showTime(_this.seconds);
        },
        showTime:function(t){
            var _this = this,
                _box = $(_this.box),
                _txt = _box.find(_this.txt);

            _txt.text(t);
        },
        reset:function(t){
            var _this = this;
            _this.seconds = t;
            _this.showTime(_this.seconds);
            _this.timer = setInterval(function(){
                _this.onTimer();
            },1000);
        }
    };


    _DS.common = {
        isIE6:!!window.ActiveXObject&&!window.XMLHttpRequest,
        init:function(){
            this.placeHolder();
            this.goTop();
            this.headerSearch();
            this.headerWx();
            this.competitionSearch();
        },
        placeHolder:function(){
            $(".placeholder").each(function(){
                var _ph = $(this).find("span");
                var _ipt = $(this).find("input");
                if(_ipt.val()!="")
                {
                    _ph.addClass("hide");
                }
                _ph.bind("click",function(){
                    _ph.addClass("hide");
                    _ipt.focus();
                });
                _ipt.bind({
                    focusin:function(){
                        _ph.addClass("hide");
                    },
                    blur:function(){
                        if(_ipt.val() == "")
                        {
                            _ph.removeClass("hide");
                        }
                    }
                })
            });
        },
        setHome:function(url){
            try{
                obj.style.behavior='url(#default#homepage)';
                obj.setHomePage(url);
            }
            catch(e){
                if(window.netscape){
                    try{
                        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
                    }catch(e){
                      alert("抱歉，此操作被浏览器拒绝！\n\n请在浏览器地址栏输入“about:config”并回车然后将[signed.applets.codebase_principal_support]设置为'true'");
                    }
                }else{
                    alert("抱歉，您所使用的浏览器无法完成此操作。\n\n您需要手动将【"+url+"】设置为首页。");
                }
            }
        },
        addToFavorite:function(){
            var a = window.location.href,
            b = "\u4eac\u4e1cJD.COM-\u7f51\u8d2d\u4e0a\u4eac\u4e1c\uff0c\u7701\u94b1\u53c8\u653e\u5fc3";
            document.all ? window.external.AddFavorite(a, b) : window.sidebar && window.sidebar.addPanel ? window.sidebar.addPanel(b, a, "") : alert("\u5bf9\u4e0d\u8d77\uff0c\u60a8\u7684\u6d4f\u89c8\u5668\u4e0d\u652f\u6301\u6b64\u64cd\u4f5c!\n\u8bf7\u60a8\u4f7f\u7528\u83dc\u5355\u680f\u6216Ctrl+D\u6536\u85cf\u672c\u7ad9\u3002");
        },
        goTop:function(){
            var _goTop = $("#goTop");
            $(window).scroll(function(){
                var topHide = $(document).scrollTop(); 
                if(topHide>20){
                    _goTop.show();
                }else{
                    _goTop.hide();
                }
            });
            
            _goTop.find(".code-box").hover(function(){
                _goTop.find(".code").show();
            },function(){
                _goTop.find(".code").hide();
            });
        },
        headerSearch:function(){
            var _box = $(".header").find(".search"),
                _searchChannel = _box.find("#searchChannel");
            _box.find(".search-channel").find("a").on("click",function(){
                $(this).addClass("cur").siblings().removeClass("cur");
                _searchChannel.val($(this).text());
            });

            _box.find(".placeholder").find("input").on({
                focusin:function(){
                    _box.addClass("search-focus");
                },
                focusout:function(){
                    _box.removeClass("search-focus");
                }
            });
        },
        headerWx:function(){
            var _box = $(".header-ht").find(".wx");
            _box.on("click",function(){
                _box.find("img").toggleClass("hide");
            });
        },
        competitionSearch:function(){
            var _box = $("#competitionSearch");
            if(_box.length < 1) return;
            var _sel = _box.find(".cs-select"),
                _sinput = _sel.find("input");
                _option = _sel.find(".css-list").find("li");

            _sel.on("click",function(){
                _box.toggleClass("focus");
            });

            _option.on("click",function(){
                _sinput.val($(this).data("value"));
            });

            $(document).on("click",function(e){
                e = e || window.event;
                if(!$.contains(_sel[0], e.target)){
                    _box.removeClass("focus");
                }
            });
        }
    }

    $(function(){
        _DS.common.init();
    })

    return {widget:_DS};
})(jQuery);