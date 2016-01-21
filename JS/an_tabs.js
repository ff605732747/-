( function ( $ ) {
	$.fn.an_tabs = function ( options ) {

		var
		//获得当前对象并存储
			$this = $( this );

		//默认配置
		defaults = {

				//高度自适应
				fit: $this.attr( "data-fit" ),

				//头部ul(nav)样式
				navCss: "nav nav-tabs clearfix ",

				//内容框[content]样式
				tabCss: "tab-content b-b b-r b-l ",

				//标签页切换选中事件
				onSelect: function () {},

				//tabs渲染完毕时触发
				onLoad: function () {}
			},

			options = $.extend( defaults, options );

		//封装方法
		var plugin = {

			//获取html属性配置的方法
			ulConfig: function ( el ) {
				var
					$el = $( el ),
					config = {
						src: $el.attr( "data-src" ),
						title: $el.attr( "data-title" ),
						fun: $el.attr( "data-fun" ),
						href: $el.attr( "data-href" ),
						iconCls: $el.attr( "data-iconCls" )
					};
				return config;
			},

			//构建ul的方法
			greatUl: function ( obj ) { //生成ul的方法

				var
					tabs = obj.children( "[data-title]" ),
					_ul = "",
					_li = "",
					ulConfig,
					_src;

				//生成头部主体ul
				_ul = "<ul class= '" + options.navCss + " an_Tabs' ></ul>";

				obj.prepend( _ul );

				try {
					tabs.each( function ( index, el ) {
						ulConfig = plugin.ulConfig( el );

						//绑定ID
						$( el )
							.attr( "data-contentid", ulConfig.title );
						var divID = $( el )
							.attr( "id" );
						console.log( divID );
						//要生成的li，字符串
						if ( ulConfig.href ) {
							_li += "<li  class='clearfix' data-liID='" + ulConfig.title + "'>";
							_li += "<a href='" + ulConfig.href + "'>";
							_li += "<i class='" + ulConfig.iconCls + " m-r-xs'>";
							_li += "</i>" + ulConfig.title + "</a></li>";
						} else {
							_li += "<li class='clearfix' data-liID='" + ulConfig.title + "'><a >";
							_li += "<i class='" + ulConfig.iconCls + " m-r-xs'></i>";
							_li += ulConfig.title + "</a></li>";

							//取得src
							_src = ulConfig.src;

							//判断链接的真实性，通过后进ajax加载代片段
							if ( undefined !== _src && null !== _src && "" != $.trim( _src ) ) {
								$.ajax( {
									url: _src,
									async: true,
									success: function ( html ) {
										$( el )
											.html( html );
									},
									error: function ( e ) {
										console.error( e );
									}
								} );
							}
						}
					} );

					//添加li
					obj.find( ".an_Tabs" )
						.append( _li );
					var tabs = obj.children( "[data-contentid]" ),
						parentW = obj.parent()
						.width();

					tabs.width( parentW );
				} catch ( e ) {};

			},

			//对options.fit 的值进行处理，当值作为HTML属性获得时，是字符串，需要转换类型
			handhabenFIt: function ( str ) {
				if ( "true" == str ) {
					options.fit = true;
				} else if ( "false" == str ) {
					options.fit = false;
				}
			},

			//控制主体的方法
			hideContent: function ( obj ) {

				var tabs = obj.children( "[data-contentid]" );
				//父级 度

				//默认打开第一个li ，给第一个LI加上样式 active
				obj.find( ".an_Tabs" )
					.find( "li" )
					.first()
					.addClass( "active" );

				tabs.addClass( options.tabCss )
					.not( ":first" )
					.css( "visibility", "hidden" );

			},

			//标签页之间切换的方法
			greatSwitch: function ( obj ) {

				var
					_ul = obj.find( ".an_Tabs" ),
					el, //dom节点
					$el, //dom转jquery对象
					_text,
					panel,
					fun,
					_fun;

				_ul.on( {
					click: function ( e ) {
						el = e.target || e.srcElement;
						if ( "i" === el.nodeName.toLocaleLowerCase() ) {
							el = el.parentNode;
						}
						$el = $( el );

						//如果为选中状态就 return
						if ( $el.parent()
							.hasClass( 'active' ) ) return;

						_text = $( el )
							.text();
						$el.parent()
							.addClass( 'active' )
							.siblings()
							.removeClass( "active" );
						obj.find( '[data-contentid="' + _text + '"]' )
							.css( "visibility", "visible" )
							.siblings( "[data-contentid]" )
							.css( "visibility", "hidden" );
						panel = obj.find( '[data-contentid="' + _text + '"]' );
						fun = panel.attr( "data-fun" );

						options.onSelect( _text, panel );
						try {
							if ( "" != $.trim( fun ) && undefined != fun && null !== fun ) {
								_fun = new Function( fun + '()' );
								_fun();
								console.log( "执行完毕" );
							}
						} catch ( event ) {}
					}
				} );

			},

			//高度自适应
			fitHiehgt: function ( obj ) {

				var
					$ul, //将ul(dom)转为jquery对象
					ulHeight, //ul的高度
					parentObj, //父级对象
					dh = 0, //高度差
					tabs = null, //[data-contentid]对象
					parentH = 0; //父级的高度

				/**
				 *  1、得到nav高度
				 *  2-3、找到父级对象并获得其高度
				 *  4、用父级对象的高度-nav高度得到主体内容的高度
				 *  5、给content赋值
				 *  */
				$ul = obj.children( ".an_Tabs" );
				ulHeight = $ul.outerHeight();
				parentObj = obj.parent();
				parentH = parentObj.height();
				dh = parentH - ulHeight - 6;
				tabs = obj.children( "[data-contentid]" );
				tabs.height( dh )
					.css( "overflow-y", "auto" );

			},

			//延迟处理
			sett: function () {
				plugin.hideContent( $this );
				options.onLoad();
			}

		};

		/**
		 *      构建  start
		 *
		 *      1、构建ul
		 *      2、对fit的值进行处理
		 *      3、高度自适应
		 *      4、绑定切方法
		 *      5、延迟100毫秒隐藏主体内容，目的是让出easyui datagrid treegrid渲染时间
		 *
		 * */

		//$this.css("overflow-y","hidden")
		plugin.greatUl( $this );
		plugin.handhabenFIt( options.fit );
		if ( true == options.fit ) {
			plugin.fitHiehgt( $this );
		}
		plugin.greatSwitch( $this );
		plugin.sett();

		/**     构建 end   **/
	};
} )( jQuery )
