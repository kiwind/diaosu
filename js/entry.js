var DS = DS || {};
DS.entry = {
	init:function(){
		this.changeVerifyImg();
		this.agreeCheck();
		this.validateLogin();
		this.validateIdentity();
		this.validateChangePwd();
		this.registPerson();
		this.registSchool();
	},
	changeVerifyImg:function(){
		var _img = $(".verify-img").find("img");
		var _osrc = _img.attr("src");
		if(_img.length < 1) return;
		_img.on("click",function(){
			_img.attr("src",_osrc+"?t="+new Date().getTime());
		});
	},
	agreeCheck:function(){
		var _box = $(".regist-form").find(".agree");
		if(_box.length < 1) return;
		var _checkbox = _box.find("input[type=checkbox]");
		var _ck1 = _box.find("#xy");
		var _ck2 = _box.find("#dy");
		var _btn = $(".regist-form").find(".btn-login");
		_ck1.on("click",function(){
			_ck1[0].checked ? _btn.removeClass("btn-login-disabled"):_btn.addClass("btn-login-disabled");
		});
	},
	validateLogin:function(){
		var _form = $("#loginForm");
		if(_form.length < 1) return;
		_form.Validform({
			tiptype:function(msg,o,cssctl){
				var _p = o.obj.parent().parent();
				var _err;
				var _prompt;
				switch(o.type)
				{
					case 3:
						_prompt = "×"
						break;
					case 2:
						_prompt = "√"
						break;
				}
				if(_p.hasClass("verify-box"))
				{
					_err = _p.parent().find(".err");
					_p.parent().find(".prompt").text(_prompt);
				}
				else
				{
					_err = _p.find(".err");
					_p.find(".prompt").text(_prompt);
				}
				cssctl(_err,o.type);
				_err.text(msg);
			}
		});
	},
	validateIdentity:function(){
		var _form = $("#validateIdentity");
		if(_form.length < 1) return;
		_form.Validform({
			tiptype:function(msg,o,cssctl){
				var _p = o.obj.parent().parent();
				var _err;
				var _prompt;
				switch(o.type)
				{
					case 3:
						_prompt = "×"
						break;
					case 2:
						_prompt = "√"
						break;
				}
				if(_p.hasClass("verify-box"))
				{
					_err = _p.parent().find(".err");
					_p.parent().find(".prompt").text(_prompt);
				}
				else
				{
					_err = _p.find(".err");
					_p.find(".prompt").text(_prompt);
				}
				cssctl(_err,o.type);
				_err.text(msg);
			}
		});
	},
	validateChangePwd:function(){
		var _form = $("#validateChangePwd");
		if(_form.length < 1) return;
		var _getVerifyBtn = _form.find(".getverify-btn"),
			_coutnDownBox = _form.find(".count-down"),
			_ajaxUrl = _form.find("#verifyMsg").attr("data-url"),
			_verifyErr = _form.find(".verify-code").find(".err");
		var _countDown = DS.widget("CountDown",{
			box:_coutnDownBox,
			seconds:120,
			txt:_coutnDownBox.find(".s"),
			callback:function(){
				_coutnDownBox.addClass("hide");
				_getVerifyBtn.removeClass("hide").text("重发");

				_getVerifyBtn.off().on("click",function(){
					//添加获取手机验证码ajax
					$.ajax({
			            url: _ajaxUrl,
			            type: "GET",
			            beforeSend: function() {
			               
			            },
			            success: function(data) {
			            	if(data.status == "y")
			            	{
			            		_coutnDownBox.removeClass("hide");
								_getVerifyBtn.addClass("hide");
								_countDown.reset(120);
			            	}
			            	else if(data.status == "n")
			            	{
			            		_verifyErr.text(data.info);
			            	}
			            	else
			            	{
			            		_verifyErr.text("未知错误");
			            	}
			            	
			            },
			            error: function(req,status,err) {
			            	alert("网络连接失败，请检测您的网络环境稍后重试");
			            },
			            complete: function() {
			            }
			        });
					return false;
				});
			}
		});
		_form.Validform({
			tiptype:function(msg,o,cssctl){
				var _p = o.obj.parent().parent();
				var _err;
				var _prompt;
				switch(o.type)
				{
					case 3:
						_prompt = "×"
						break;
					case 2:
						_prompt = "√"
						break;
				}
				if(_p.hasClass("verify-box"))
				{
					_err = _p.parent().find(".err");
					_p.parent().find(".prompt").text(_prompt);
				}
				else
				{
					_err = _p.find(".err");
					_p.find(".prompt").text(_prompt);
				}
				cssctl(_err,o.type);
				_err.text(msg);
			}
		});
	},
	registPerson:function(){
		var _form = $("#registPerson"),
			_verifyBox = _form.find(".get-verify"),
			_btn = _form.find(".getverify-btn"),
			_verifyCloseBtn = _verifyBox.find(".close-btn"),
			_input = _verifyBox.find("input"),
			_coutnDownBox = _form.find(".count-down"),
			_mobile = _form.find("input[name=mobile]");
		if(_form.length < 1) return;
		_form.find("input").on({
			focusin:function(){
				var _p = $(this).parent().parent();
				_p.find(".err").addClass("hide");
				_p.find(".info").removeClass("hide");
			},
			focusout:function(){
				var _p = $(this).parent().parent();
				_p.find(".err").removeClass("hide");
				_p.find(".info").addClass("hide");
			}
		});

		_btn.off().on("click",function(e){
			if(_mobile.val()=="")
			{
				_mobile.focus();
				_mobile.parent().parent().find(".prompt").text("×");
				return;
			}
			var _verifyImgInput = _verifyBox.find(".placeholder").find("input");
			var _verifyImgErr= _verifyBox.find(".err");
			var _ajaxUrl = _form.find("#verifyMsg").attr("data-url");
			_verifyBox.removeClass("hide");
			_input.val('');
			_verifyImgErr.text('');
			_input.prev().removeClass("hide");
			_verifyBox.find(".get-verify-btn").off().on("click",function(){
				if(_verifyImgInput.val()=="")
				{
					_verifyImgErr.text("请输入验证码");
					_verifyImgInput.focus();
					return false;
				}
				$.ajax({
		            url: _ajaxUrl,
		            type: "POST",
		            data: "mobile="+_mobile.val()+"&captcha="+_input.val(),
		            beforeSend: function() {
		               
		            },
		            success: function(data) {
		            	if(data.status == "y")
		            	{
		            		_verifyBox.addClass("hide");
			            	_btn.addClass("hide");
			            	_coutnDownBox.removeClass("hide");
			            	var _countDown = DS.widget("CountDown",{
								box:_coutnDownBox,
								seconds:120,
								txt:_coutnDownBox.find(".s"),
								callback:function(){
									_coutnDownBox.addClass("hide");
									_btn.removeClass("hide").text("重发");
								}
							});
		            	}
		            	else if(data.status == "n")
		            	{
		            		_verifyImgErr.text(data.info);
		            	}
		            	else
		            	{
		            		_verifyImgErr.text("未知错误");
		            	}
		            	
		            },
		            error: function(req,status,err) {
		            	alert("网络连接失败，请检测您的网络环境稍后重试");
		            },
		            complete: function() {
		            }
		        });
		        return false;
			});
			return false;
		});

		_verifyCloseBtn.on("click",function(){
			_verifyBox.addClass("hide");
		});
		_form.Validform({
			btnSubmit:".btn-login",
			tiptype:function(msg,o,cssctl){
				var _p = o.obj.parent().parent();
				var _err;
				var _prompt;
				switch(o.type)
				{
					case 3:
						_prompt = "×"
						break;
					case 2:
						_prompt = "√"
						break;
				}
				if(_p.hasClass("verify-box"))
				{
					_err = _p.parent().find(".err");
					_p.parent().find(".prompt").text(_prompt);
				}
				else
				{
					_err = _p.find(".err");
					_p.find(".prompt").text(_prompt);
				}
				cssctl(_err,o.type);
				_err.text(msg);
			},
			beforeSubmit:function(form){
				var _this = this;
				if(form.find(".btn-login").hasClass("btn-login-disabled")) return false;
			}
		});
	},
	registSchool:function(){
		var _form = $("#registSchool");
		if(_form.length < 1) return;
		_form.find("input").on({
			focusin:function(){
				var _p = $(this).parent().parent();
				_p.find(".err").addClass("hide");
				_p.find(".info").removeClass("hide");
			},
			focusout:function(){
				var _p = $(this).parent().parent();
				_p.find(".err").removeClass("hide");
				_p.find(".info").addClass("hide");
			}
		});

		_form.Validform({
			btnSubmit:".btn-login",
			tiptype:function(msg,o,cssctl){
				var _p = o.obj.parent().parent();
				var _err;
				var _prompt;
				switch(o.type)
				{
					case 3:
						_prompt = "×"
						break;
					case 2:
						_prompt = "√"
						break;
				}
				if(_p.hasClass("verify-box"))
				{
					_err = _p.parent().find(".err");
					_p.parent().find(".prompt").text(_prompt);
				}
				else
				{
					_err = _p.find(".err");
					_p.find(".prompt").text(_prompt);
				}
				cssctl(_err,o.type);
				_err.text(msg);
			},
			beforeSubmit:function(form){
				var _this = this;
				if(form.find(".btn-login").hasClass("btn-login-disabled")) return false;
			}
		});
	}
}


$(function(){
	DS.entry.init();
});