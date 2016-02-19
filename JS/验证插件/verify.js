/**

 *验证插件

 *冯文祺

 *联系方式

 *2016/1/20
 **/
;
( function ( $ ) {
	$.fn.verify = function () {

		var $this = $( this );

		//验证规则，规则与提示信息
		var MsgAndRules = {

			/**
			 * 验证过程主程，
			 * @method RUEL
			 * @param  {Object} options 参数对象
			 * @return {Array}
			 */
			RUEL: function ( options ) {
				var flag, errmsg = "";

				flag = MsgAndRules.RULES[ options.type ]( options.str, options.minL, options.maxL );
				if ( '' == $.trim( options.msg ) || undefined == options.msg || null == options.msg ) {
					errmsg = MsgAndRules.MSG[ options.type ];
				} else {
					errmsg = options.msg;
				}
				var arr = [ flag, errmsg ];
				return arr;
			},

			//默认提示信息
			MSG: {
				isNotEmpty: "这里为必填项",
				onlyZh: "只能输入中文",
				checkMobile: "手机号码格式错误",
				checkIdCard: "身份证格式错误",
				checkQuote: "含有特殊字符",
				checkURL: "URL格式错误",
				checkPhone: "座机号码格式错误",
				postOffice: "邮编错误",
				checkEmail: "邮箱错误",
				isNumber: "不是正整数",
				isNumberOr_Letter: "只能由英文和数字下划线组成",
				isAvaiableLength: "字符长度不在规定范围内"
			},

			//验证规则配置
			RULES: {

				//必填项
				isNotEmpty: function ( str ) {
					return null == str && typeof str == 'undefined' || "" == $.trim( str ) ? false : true;
				},

				//只能输入中文
				onlyZh: function ( str ) {
					var pattern = /^[\u0391-\uFFE5]+$/g;
					return pattern.test( str );
				},

				//检测手机号
				checkMobile: function ( str ) {
					var regu = /^(13[0-9]|14[57]|15[012356789]|17[0678]|18[0-9])\d{8}$/;
					var re = new RegExp( regu );
					return re.test( str );
				},

				//身份证
				checkIdCard: function ( num ) {
					num = num.toUpperCase();
					var cityCode = {
						11: "北京",
						12: "天津",
						13: "河北",
						14: "山西",
						15: "内蒙古",
						21: "辽宁",
						22: "吉林",
						23: "黑龙江 ",
						31: "上海",
						32: "江苏",
						33: "浙江",
						34: "安徽",
						35: "福建",
						36: "江西",
						37: "山东",
						41: "河南",
						42: "湖北 ",
						43: "湖南",
						44: "广东",
						45: "广西",
						46: "海南",
						50: "重庆",
						51: "四川",
						52: "贵州",
						53: "云南",
						54: "西藏 ",
						61: "陕西",
						62: "甘肃",
						63: "青海",
						64: "宁夏",
						65: "新疆",
						71: "台湾",
						81: "香港",
						82: "澳门",
						91: "国外 "
					};
					if ( !cityCode[ num.substr( 0, 2 ) ] ) {
						//alert("地址编码错误");
						return false;
					}
					//身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
					if ( !( /(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test( num ) ) ) {
						//alert('输入的身份证号长度不对，或者号码不符合规定！\n15位号码应全为数字，18位号码末位可以为数字或X。');
						return false;
					}

					//校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
					//下面分别分析出生日期和校验位
					var len, re;
					len = num.length;
					if ( len == 15 ) {
						re = new RegExp( /^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/ );
						var arrSplit = num.match( re );
						//检查生日日期是否正确
						var dtmBirth = new Date( '19' + arrSplit[ 2 ] + '/' + arrSplit[ 3 ] + '/' + arrSplit[ 4 ] );
						var bGoodDay;
						bGoodDay = ( dtmBirth.getYear() == Number( arrSplit[ 2 ] ) ) && ( ( dtmBirth.getMonth() + 1 ) == Number( arrSplit[ 3 ] ) ) && ( dtmBirth.getDate() == Number( arrSplit[ 4 ] ) );
						if ( !bGoodDay ) {
							//alert('输入的身份证号里出生日期不对！');
							return false;
						} else {
							//将15位身份证转成18位
							//校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
							var arrInt = new Array( 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 );
							var arrCh = new Array( '1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2' );
							var nTemp = 0,
								k;
							num = num.substr( 0, 6 ) + '19' + num.substr( 6, num.length - 6 );
							for ( k = 0; k < 17; k++ ) {
								nTemp += num.substr( k, 1 ) * arrInt[ k ];
							}
							num += arrCh[ nTemp % 11 ];
							return true;
						}
					}
					if ( len == 18 ) {
						re = new RegExp( /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/ );
						var arrSplit = num.match( re );
						//检查生日日期是否正确
						var dtmBirth = new Date( arrSplit[ 2 ] + "/" + arrSplit[ 3 ] + "/" + arrSplit[ 4 ] );
						var bGoodDay;
						bGoodDay = ( dtmBirth.getFullYear() == Number( arrSplit[ 2 ] ) ) && ( ( dtmBirth.getMonth() + 1 ) == Number( arrSplit[ 3 ] ) ) && ( dtmBirth.getDate() == Number( arrSplit[ 4 ] ) );
						if ( !bGoodDay ) {
							//alert(dtmBirth.getYear());
							//alert(arrSplit[2]);
							//alert('输入的身份证号里出生日期不对！');
							return false;
						} else {
							//检验18位身份证的校验码是否正确。
							//校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
							var valnum;
							var arrInt = new Array( 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 );
							var arrCh = new Array( '1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2' );
							var nTemp = 0,
								k;
							for ( k = 0; k < 17; k++ ) {
								nTemp += num.substr( k, 1 ) * arrInt[ k ];
							}
							valnum = arrCh[ nTemp % 11 ];
							if ( valnum != num.substr( 17, 1 ) ) {
								//alert('18位身份证的校验码不正确！应该为：' + valnum);
								return false;
							}
							return true;
						}
					}
					return false;
				},

				//特殊字符
				checkQuote: function ( str ) {
					var items = new Array( "~", "`", "!", "@", "#", "$", "%", "^", "&", "*", "{", "}", "[", "]", "(", ")" );
					items.push( ":", ";", "'", "|", "\\", "<", ">", "?", "/", "<<", ">>", "||", "//" );
					items.push( "admin", "administrators", "administrator", "管理员", "系统管理员" );
					items.push( "select", "delete", "update", "insert", "create", "drop", "alter", "trancate" );
					str = str.toLowerCase();
					for ( var i = 0; i < items.length; i++ ) {
						if ( str.indexOf( items[ i ] ) >= 0 ) {
							return false;
						}
					}
					return true;
				},

				//检查URL地址
				checkURL: function ( str ) {
					var strRegex = "^((https|http|ftp|rtsp|mms)?://)" + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp的user@
						+ "(([0-9]{1,3}.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184
						+ "|" // 允许IP和DOMAIN（域名）
						+ "([0-9a-z_!~*'()-]+.)*" // 域名- www.
						+ "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]." // 二级域名
						+ "[a-z]{2,6})" // first level domain- .com or .museum
						+ "(:[0-9]{1,4})?" // 端口- :80
						+ "((/?)|" + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
					var re = new RegExp( strRegex );
					if ( re.test( str ) ) {
						return true;
					} else {
						return false;
					}
				},

				//检查座机号
				checkPhone: function ( strPhone ) {
					var phoneRegWithArea = /^[0][1-9]{2,3}-[0-9]{5,10}$/;
					var phoneRegNoArea = /^[1-9]{1}[0-9]{5,8}$/;
					var prompt = "您输入的电话号码不正确!";
					if ( strPhone.length > 9 ) {
						if ( phoneRegWithArea.test( strPhone ) ) {
							return true;
						} else {
							//alert(prompt);
							return false;
						}
					} else {
						if ( phoneRegNoArea.test( strPhone ) ) {
							return true;
						} else {
							//alert(prompt);
							return false;
						}
					}
				},

				//检查邮编
				postOffice: function ( str ) {
					var re = /^[1-9][0-9]{5}$/;
					return re.test( str );
				},
				checkEmail: function ( str ) {
					var myReg = /^[-_A-Za-z0-9]+@([_A-Za-z0-9]+\.)+[A-Za-z0-9]{2,3}$/;
					if ( myReg.test( str ) ) return true;
					return false;
				},

				//检查输入字符串是否符合正整数格式
				isNumber: function ( s ) {
					var regu = "^[0-9]+$";
					var re = new RegExp( regu );
					if ( s.search( re ) != -1 ) {
						return true;
					} else {
						return false;
					}
				},

				//判断字符串是否只由英文和数字下划线组成
				isNumberOr_Letter: function ( s ) {
					var regu = "^[0-9a-zA-Z\_]+$";
					var re = new RegExp( regu );
					if ( re.test( s ) ) {
						return true;
					} else {
						return false;
					}
				},

				//判断传入参数的长度是否在给定的范围内
				isAvaiableLength: function ( str, minL, maxL ) {
					return ( str.length >= minL && str.length <= maxL ) ? true : false;
				}

			}

		};

		var Plugin = {

			defaultPrompty: function ( $target ) {

				var flag = $target.attr( 'data-promptly' );

				if ( 'true' === flag ) {

					return true;

				}

				return false;
			},

			ajaxConfigConvert: function ( $target ) {

				var
					conifg = $target.attr( 'data-ajaxConfig' ),
					parm = 'parm=' + conifg;

				return eval( parm );
			},

			/**
			 * 对当前input拥有的类名进行判断，用于获得焦点时清除之前的样式
			 * 若为成功样式则input u-input-cor样式清除
			 * 若为错误样式不仅清除input样式u-input-err并将data-result设置为success
			 * @method clearClassNameSetAttr
			 * @param  Object $target
			 * @return Void
			 */
			clearClassNameSetAttr: function ( $target ) {

				if ( $target.hasClass( 'u-input-cor' ) ) {

					$target.removeClass( 'u-input-cor' );

				} else if ( $target.hasClass( 'u-input-err' ) ) {

					$target.removeClass( 'u-input-err' );

					$target.prev()
						.remove();
				}

				$target.attr( 'data-result', "success" );

			},

			/**
			 * 验证方法封装
			 * 判断 值是否为空，若为空，则清除样式 return
			 *
			 * @method function
			 * @param  Object $target  操作的DOM,jquery对象
			 * @param  Object options  配置对象
			 * @return Void
			 */
			verifyType: function ( $target, options ) {

				var
					type,
					defaultValue = '',
					value = $target.val();

				if ( defaultValue == value ) return;

				for ( type in options.type ) {

					var _options = {
						str: value,
						type: type,
						msg: options.type[ type ],
						minL: options.minL,
						maxL: options.maxL
					};

					var arr = MsgAndRules.RUEL( _options );

					Plugin.showMsg( $target, arr[ 1 ], arr[ 0 ], options.hoverMsg );

					if ( !arr[ 0 ] ) return;

				}
				if ( options.promptly ) {

					Config.ajax( options.ajaxConfig );

				}
			},

			/**
			 * 验证后，正确||错误状态显示
			 * @method function
			 * @param  Object $target 操作的DOM,jQuery对象
			 * @param  String msg     提示信息
			 * @param  Booleam flag   正确&&错误
			 * @return Void
			 */
			showMsg: function ( $target, msg, flag, test ) {

				Plugin.clearClassNameSetAttr( $target );

				if ( flag ) {

					$target.attr( 'data-result', 'success' );

					$target.addClass( 'u-input-cor' );

				} else {
					$target.attr( 'data-result', 'error' );

					$target.before( '<div class="combo-box r f-bg-danger-lt">' + msg + '</div>' )
						.addClass( 'u-input-err' );

				}
				if ( test && 'error' === $target.attr( 'data-result' ) ) {

					var $msg = $target.siblings( '.f-bg-danger-lt' );

					$msg.hide();

					$target.hover( function () {

						$msg.show();

					}, function () {

						$msg.hide();

					} );
				}
			},

			hoverMsg: function ( $target ) {

				var flag = $target.attr( 'data-hoverMsg' );

				if ( 'true' === flag ) {

					return true;

				}
				return false;
			},

			/**
			 * 对html属性[data-type]进行转换
			 * @method function
			 * @param  Object $target 操作的DOM,jQuery对象
			 * @return Object         返回验证类型对象
			 */
			typeConvert: function ( $target ) {

				var
					type = $target.attr( 'data-type' ),
					parm = 'parm=' + type;

				return eval( parm );
			},

			/**
			 * 对html属性[data-minl]进行转换
			 * @method function
			 * @param  Object $target
			 * @return Number
			 */
			defaultMinL: function ( $target ) {

				var minL = $target.attr( 'data-minl' );

				if ( '' == minL || undefined == minL || null == minL ) {

					return minL = 0;

				}

				return minL;
			},

			/**
			 * 对html属性[data-maxl]进行转换
			 * @method function
			 * @param  Object $target
			 * @return Number
			 */
			defaultMaxL: function ( $target ) {
				var maxL = $target.attr( 'data-maxl' );
				if ( '' == maxL || undefined == maxL || null == maxL ) {
					return maxL = 99;
				}
				return maxL;
			},

			/**
			 * 必填项数据处理，是否通过，必填项提示信息
			 * @method requireMethod
			 * @param  Object    $target
			 * @return Void
			 */
			requireMethod: function ( $target ) {
				var reqmsg = $target.attr( 'data-reqmsg' );
				if ( undefined == reqmsg || "" == reqmsg.trim() || null == reqmsg ) {

					reqmsg = '这里必填项';

				}

				var options = {
					str: $target.val(),
					type: 'isNotEmpty',
					msg: reqmsg
				};

				var arr = MsgAndRules.RUEL( options );

				if ( arr[ 0 ] ) {

					Plugin.showMsg( $target, arr[ 1 ], arr[ 0 ] );

					$target.attr( 'data-result', 'success' );

				} else {

					Plugin.showMsg( $target, arr[ 1 ], arr[ 0 ] );

				}
			}
		};

		var Config = {

			//封装ajax
			ajax: function () {

				var
					defaults = {
						async: true,
						type: 'get',
						url: '',
						data: '',
						dataType: 'json',
						success: function () {},
						error: function () {}
					},
					options;

				if ( arguments.length == 1 ) {

					options = $.extend( defaults, arguments[ 0 ] || {} );

				} else {

					options = $.extend( defaults, arguments[ 1 ] || {} );

				}

				$.ajax( {
					async: options.async,
					type: options.type,
					url: options.url,
					data: options.data,
					dataType: options.dataType,
					success: options.success,
					error: options.error
				} );
			},

			/**
			 * 验证所有必填项是否通过
			 * @method function
			 * @return {type} Booleam
			 */
			required: function () {

				var

					dataVerifyList = $( arguments[ 1 ] )
					.find( '.data-verify' ),

					isOK = true;

				dataVerifyList.each( function ( index ) {

					var
						$target = $( dataVerifyList[ index ] ),
						flag = $target.attr( 'data-required' ),
						status = $target.attr( 'data-result' );

					if ( 'true' === flag && ( 'success' == status || undefined == status ) ) {

						Plugin.requireMethod( $target );

					}

					status = $target.attr( 'data-result' );

					if ( 'error' == status ) {

						isOK = false;

					}

				} );

				return isOK;
			},

			/**
			 * 单独显示状态 正确&&错误
			 * @method status
			 * @return void
			 */
			setStatus: function () {

				var
					options = arguments[ 1 ],
					$target = $( this );

				if ( !$target.hasClass( 'data-verify' ) ) {

					$target.addClass( 'data-verify' );

				}
				if ( options.flag ) {

					Plugin.showMsg( $target, options.msg, options.flag );

				} else {

					Plugin.showMsg( $target, options.msg, options.flag );

				}
			},

			//程序主体
			init: function ( options ) {

				var

				//默认参数配置
					defaults = {
					promptly: Plugin.defaultPrompty( $this ),
					ajaxConfig: Plugin.ajaxConfigConvert( $this ),
					required: $this.attr( 'data-required' ),
					minL: Plugin.defaultMinL( $this ),
					maxL: Plugin.defaultMaxL( $this ),
					type: Plugin.typeConvert( $this ),
					requiredMsg: this.attr( 'data-requiredMsg' ),
					hoverMsg: Plugin.hoverMsg( $this )
				};

				var options = $.extend( defaults, options || {} );

				$this.addClass( 'data-verify' );

				$this.attr( 'data-result', 'success' );

				if ( eval( options.required ) ) {

					$this.attr( {

						'data-required': true,

						'data-requiredMsg': options.requiredMsg

					} );

				} else {

					$this.attr( 'data-required', false );

				}

				//获取当前DOM的nodename select为change事件，input为blur事件，【预留出radio】
				switch ( $this[ 0 ].nodeName.toLocaleLowerCase() ) {

				case 'select':

					$this.change( function () {

						Plugin.verifyType( $this, options );

					} );

					break;

				default:

					$this.focus( function ( event ) {

						Plugin.clearClassNameSetAttr( $this );

					} );

					$this.blur( function () {

						Plugin.verifyType( $this, options );

					} );
				}

			}
		};

		var method = arguments[ 0 ];
		if ( Config[ method ] ) {
			method = Config[ method ];
		} else if ( typeof ( method ) == 'object' || !method ) {
			method = Config.init;
		} else {
			$.error( 'Method ' + method + ' does not exist on jQuery.verify Config' );
			return this;
		}
		return method.apply( this, arguments );
	};
} )( jQuery );
