/*
	yuu 2016/3/21
	mvc版
	fwq 2016/3/21
	mvc版
	switch 组件：
	若在input上使用disabled也可以禁用开关
	事件:changeBefor 状态改变前，传递checkbox对象作为回掉参数
	事件:changeAfter 状态改变后，传递checkbox对象作为回掉参数
	方法:setEnable(true/false) 是否禁用开关
	方法:setState(true/false)  设置开关状态，开启||关闭
 */
;
( function ( $ ) {

	$.fn.extend( {

		switchs: function () {

			var
				method,
				$element = $( this ),
				Config = {

					//controller
					controller: {
						start: function ( options ) {
							Config.controller.view.init();
							Config.controller.view.start( options );
						},
						set: function () {
							this.model.setState();
						}
					},
					setEnable: function () {
						$element
							.children( 'input' )
							.prop( 'disabled', arguments[ 1 ] );
					},
					setState: function () {
						$element
							.children( 'input' )
							.prop( 'checked', arguments[ 1 ] );
						Config.controller.view.update( arguments[ 1 ] );
					}
				};

			//view
			Config.controller.view = {
				init: function () {
					var
						$input = $element.children( 'input' ),
						flag = $input.is( ":checked" );
					if ( !$element.hasClass( 'switchState' ) ) {
						Config.controller.view.update( flag );
					}
				},
				start: function ( options ) {
					var
						defaults = {
							changeBefor: function ( $input ) {},
							changeAfter: function ( $input ) {}
						},
						options = $.extend( true, defaults, options || {} );

					$element.unbind( 'click' );

					$element.on( {
						click: function ( event ) {

							event.stopPropagation();

							var $input = $element.children( 'input' );
							options.changeBefor( $input );
							Config.controller.view.change();
							options.changeAfter( $input );

						}
					} );
				},

				change: function () {
					Config.controller.set();
				},

				update: function () {

					var $input, flag, _icon, stateClass;

					if ( 1 == arguments.length ) {
						flag = arguments[ 0 ];
					} else if ( 2 == arguments.length ) {
						$input = arguments[ 0 ],
							flag = arguments[ 1 ];
						if ( $input.prop( "disabled" ) ) return;
						$input.prop( 'checked', flag );
					}

					$element.find( 'i' )
						.remove();
					$element.removeClass( 'on off' );
					flag ? _icon = '<i class="iconfont ">&#xe61c;</i>' : _icon = '<i class="iconfont ">&#xe61d;</i>';
					flag ? stateClass = 'on' : stateClass = 'off';
					$element.addClass( stateClass )
						.append( _icon )
						.addClass( 'switchState' );
				}
			};

			//model
			Config.controller.model = {
				setState: function () {

					var
						$input = $element.children( 'input' ),
						flag = $input.is( ":checked" );
					Config.controller.model.change( $input, !flag );
				},
				change: function ( $input, flag ) {
					Config.controller.view.update( $input, flag );
				}
			};

			method = arguments[ 0 ];
			if ( Config[ method ] ) {
				method = Config[ method ];
			} else if ( typeof ( method ) == 'object' || !method ) {
				method = Config.controller.start;
			} else {
				$.error( "Something bad happened" );
				return this;
			}
			return method.apply( this, arguments );

		}
	} )
} )( jQuery );
