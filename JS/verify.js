/**

 *验证插件

 *冯文祺

 *联系方式

 *2016/1/20
 **/
;
( function ( $ ) {
	$.fn.an_verify2 = function () {
		var $this = $( this );

		//验证规则，规则与提示信息
		var msgAndRules = {

			/**
			 * 验证规则主程，是否正确，返回提示信息
			 * @method function
			 * @param  {String} str   输入的字符串
			 * @param  {String} type  验证类型
			 * @param  {String} msg   提示信息
			 * @param  {Number} minL  最小值
			 * @param  {Number} maxL  最大值
			 * @return {[Array]}				[true&&false 提示信息]
			 */

			RUEL: function ( str, type, msg, minL, maxL ) {
				var flag, errmsg = "";
				flag = msgAndRules.RULES[ type ]( str, minL, maxL );
				if ( '' == $.trim( msg ) || undefined == msg || null == msg ) {
					errmsg = msgAndRules.MSG[ type ];
				} else {
					errmsg = msg;
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
				isNumber: "不是正整数",
				isNumberOr_Letter: "只能由英文和数字下划线组成",
				isAvaiableLength: "字符长度不在规定范围内"
			},

			//验证规则配置
			RULES: {

				//必填项
				isNotEmpty: function ( str ) {
					return null == str && typeof str == 'undefined' || "" == str.trim() ? false : true;
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

		var plugin = {

			/**
			 * 验证方法封装
			 * @method function
			 * @param  {Object} $target  操作的DOM,jquery对象
			 * @param  {Object} options  配置对象
			 * @return {Void}
			 */
			verifyType: function ( $target, options ) {
				var type, index = "";
				if ( index == $.trim( $target.val() ) ) {
					if ( $target.parent()
						.hasClass( 'outerdiv' ) ) {
						$target.nextAll()
							.remove();
						$target.unwrap()
							.attr( 'data-result', "success" );
					}
					return;
				}
				for ( type in options.type ) {
					var arr = msgAndRules.RUEL( $target.val(), type, options.type[ type ], options.minL, options.maxL );
					plugin.showMsg( $target, arr[ 1 ], arr[ 0 ] );
					if ( !arr[ 0 ] ) {
						return;
					}
				}
			},


			/**
			 * 验证后，正确||错误状态显示
			 * @method function
			 * @param  {Object} $target 操作的DOM,jQuery对象
			 * @param  {String} msg     提示信息
			 * @param  {Booleam} flag   正确&&错误
			 * @return {Void}
			 */
			showMsg: function ( $target, msg, flag ) {
				var outerdiv = '<div class="outerdiv"></div>';
				var innerdiv = '<i class="icon-close  error"></i><div class="innerdiv">';
				innerdiv += msg + '</div>';
				var icon = '<i class="fa fa-check correct"></i>';
				if ( $target.parent()
					.hasClass( "outerdiv" ) ) {
					$target.nextAll()
						.remove();
					$target.unwrap();
				}

				if ( flag ) {
					$target.attr( 'data-result', "success" );
					$target.wrap( outerdiv )
						.parent()
						.append( icon );

				} else {
					$target.attr( 'data-result', "error" );
					$target.wrap( outerdiv )
						.parent()
						.append( innerdiv );
				}
			},

			/**
			 * 对html属性[data-type]进行转换
			 * @method function
			 * @param  {Object} $target 操作的DOM,jQuery对象
			 * @return {Object}         返回验证类型对象
			 */
			typeConvert: function ( $target ) {
				var type = $target.attr( "data-type" );
				var parm = "parm=" + type;
				eval( parm );
				return parm;
			},

			/**
			 * 对html属性[data-minl]进行转换
			 * @method function
			 * @param  {Object} $target
			 * @return {Number}
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
			 * @param  {Object} $target
			 * @return {Number}
			 */
			defaultMaxL: function ( $target ) {
				var maxL = $target.attr( 'data-maxl;' );
				if ( '' == maxL || undefined == maxL || null == maxL ) {
					return maxL = 99;
				}
				return maxL;
			},

			/**
			 * 必填项数据处理，是否通过，必填项提示信息
			 * @method requireMethod
			 * @param  {Object}      $target
			 * @return {Void}
			 */
			requireMethod: function ( $target ) {
				var reqmsg = $target.attr( "data-reqmsg" );
				if ( undefined == reqmsg || "" == reqmsg.trim() || null == reqmsg ) {
					reqmsg = "这里必填项"
				}
				var arr = msgAndRules.RUEL( $target.val(), "isNotEmpty", reqmsg );
				if ( arr[ 0 ] ) {
					plugin.showMsg( $target, arr[ 1 ], arr[ 0 ] );
				} else {
					plugin.showMsg( $target, arr[ 1 ], arr[ 0 ] );
				}
			}
		};

		var config = {

			//封装ajax
			Ajax: function () {
				var callback = arguments[ 2 ];
				var defaults = {
					async: true,
					type: "get",
					url: "",
					data: "",
					success: function () {},
					error: function () {},
				};

				var options = $.extend( defaults, arguments[ 1 ] );
				$.ajax( {
					async: options.async,
					type: options.type,
					url: options.url,
					data: options.data,
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
				var dataVerifyList = $( arguments[ 1 ] )
					.find( ".data-verify" );
				var isOK = true;
				dataVerifyList.each( function ( index ) {
					var $target = $( dataVerifyList[ index ] );
					var flag = $target.attr( "data-required" );
					//必填验证
					var status = $target.attr( 'data-result' );
					if ( eval( flag ) && ( "success" == status || undefined == status ) ) {
						plugin.requireMethod( $target );
					}
					status = $target.attr( 'data-result' );
					if ( "error" == status ) {
						isOK = false;
					}

				} );
				return isOK;
			},


			showMsg: function () {
				var msg = arguments[ 1 ];
				var flag = arguments[ 2 ];
			},

			//程序主体
			init: function ( options ) {

				var

				//默认参数配置
					defaults = {
					required: this.attr( "data-required" ),
					minL: plugin.defaultMinL( $this ),
					maxL: plugin.defaultMaxL( $this ),
					type: plugin.typeConvert( $this ),
					requiredMsg: this.attr( "data-requiredMsg" ),
				};

				var options = $.extend( defaults, options||{} );

				this.addClass( "data-verify" );

				if ( eval( options.required ) ) {

					this.attr( {

						'data-required': true,

						'data-requiredMsg': options.requiredMsg

					} );

				} else {

					this.attr( 'data-required', false );

				}


				//获取当前DOM的nodename select为change事件，input为blur事件，【预留出radio】
				switch ( this[ 0 ].nodeName.toLocaleLowerCase() ) {

				case "select":

					this.change( function () {

						plugin.verifyType( $( this ), options );

					} );

					break;

				default:

					this.blur( function () {

						plugin.verifyType( $( this ), options );

					} );
				}

			}
		};

		var method = arguments[ 0 ];
		if ( config[ method ] ) {
			method = config[ method ];
		} else if ( typeof ( method ) == 'object' || !method ) {
			method = config.init;
		} else {
			$.error( 'Method ' + method + ' does not exist on jQuery.an_ verify Plugin' );
			return this;
		}
		return method.apply( this, arguments );
		//    }
	};
} )( jQuery );
