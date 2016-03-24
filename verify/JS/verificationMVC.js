/**
 * fwq
 * 2016/3/22
 * 验证插件,基于bootstrap3.35 JQuery
 */
;
( function () {
	$.fn.verify = function () {

		var
			$element = $( this ),
			$val = '',
			Config = {
				controller: {
					start: function ( options ) {
						Config.controller.view.start( options );
					},
					set: function ( value, options ) {
						Config.controller.model.setState( value, options );
					}
				},
				checkAll: function () {
					var flag = true;
					$element.find( '.verify' )
						.trigger( 'blur' )
						.each( function ( index, el ) {
							if ( 'false' === $( el )
								.attr( 'data-result' ) ) {
								return flag = false;
							}
						} );
					return flag;
				}
			};

		Config.controller.view = {

			start: function ( options ) {
				var eventType;
				$element.addClass( 'verify' )
					.attr( 'data-result', true );;
				'input' === $element[ 0 ].nodeName.toLocaleLowerCase() ? eventType = 'blur' : eventType = 'change';
				$element.on( 'focus', function () {
					Config.controller.view.clearState();
				} );
				$element.on( eventType, function () {
					Config.controller.view.change( options );
				} );
			},
			clearState: function () {

				$element
					.parent()
					.removeClass( 'has-success has-error' );

				$element.nextAll()
					.remove();
			},
			change: function ( options ) {

				Config.controller.set( $element.val(), options );

			},
			update: function ( flag, msg ) {

				Config.controller.view.clearState();
				var
					className = '',
					iconStr = '<span class="glyphicon {StateClass} form-control-feedback"></span>',
					tip = '<div class="verify-tip">{text}</div>',
					iconClass = '';
				flag ? iconClass = 'glyphicon-ok >' : iconClass = '  glyphicon-remove ';
				iconStr = iconStr.replace( '{StateClass}', iconClass );
				flag ? className = 'has-success' : className = 'has-error ';

				if ( !flag ) {
					tip = tip.replace( "{text}", msg );
					$element.parent()
						.append( tip );
				}

				$element.parent()
					.addClass( className )
					.append( iconStr );
				$element.attr( 'data-result', flag );

			}
		}

		Config.controller.model = {

			SETTING: {
				customType: {},
				required: false,
				minL: 0,
				maxL: 99,
				requiredMsg: "这是必填项",
				type: {}
			},
			checkRules: {
				onlyZh: {
					msg: "只能输入中文而已",
					check: function ( str ) {
						var pattern = /^[\u0391-\uFFE5]+$/g;
						return pattern.test( str );
					}
				},
				required: {
					msg: "这里是必填项",
					check: function ( str ) {
						return null == str && typeof str == 'undefined' || "" == str.trim() ? true : false;
					}
				},
				checkMobile: {
					msg: "非法手机号",
					check: function ( str ) {
						var regu = /^(13[0-9]|14[57]|15[012356789]|17[0678]|18[0-9])\d{8}$/;
						var re = new RegExp( regu );
						return re.test( str );
					}
				},
				checkIdCard: {
					msg: "身份证号格式错误",
					check: function ( num ) {
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
				}
			},
			setState: function ( value, options ) {

				var
					options = $.extend( true, this.SETTING, options ),
					flag = true,
					message = '',
					type;

				/**
				 * 判断是否为必填项，若是必填项,value值传入验证，若验证回返true，则表示未通过。
				 * 则判断是否传入提示语句，没传入的话就使用默认提示语
				 * 终断程序执行;
				 * 若不是必填则验证value是否为""，为""则终断程序执行
				 * @method if
				 * @param  {[type]} options.required 是否为必填项
				 * @return {[void]}
				 */
				if ( options.required ) {
					if ( this.checkRules[ 'required' ].check( value ) ) {
						options.requiredMsg ? message = options.requiredMsg : message = this.checkRules[ 'required' ].msg;
						Config.controller.model.change( false, message );
						return;

					};
				} else if ( '' == $element.val() ) return;

				/**
				 * 根据传入的验证类型 循环遍历
				 * 若未通过验证 则终断循环，返回提示语 和false
				 */
				for ( type in options.type ) {

					flag = this.checkRules[ type ].check( value );

					if ( !flag ) {

						$.trim( options.type[ type ] ) ? message = options.type[ type ] : message = this.checkRules[ type ].msg;
						return Config.controller.model.change( false, message );
					}
				}
				Config.controller.model.change( true, message );
			},
			change: function ( flag, msg ) {
				Config.controller.view.update( flag, msg );
			}
		}

		var method = arguments[ 0 ];
		if ( Config[ method ] ) {
			method = Config[ method ];
		} else if ( typeof ( method ) == 'object' || !method ) {
			method = Config.controller.start;
		} else {
			$.error( 'Something bad happened' );
			return this;
		}
		return method.apply( this, arguments );

	}
} )( jQuery )
