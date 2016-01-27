;
( function ( $ ) {
	/**
	 * 开关按钮控制
	 * @method function
	 * @return {void}
	 */
	$.fn.extend( {
		switchs: function () {
			var $switchList = $( ".u-switch" );
			$switchList.each( function ( index, el ) {
				var
					$input = $( el )
					.children(),
					$el = $( el ),
					flag = $input.is( ':checked' ) ? true : false,
					_i_on = '<i class="iconfont ">&#xe61c;</i> ',
					_i_off = '<i class="iconfont ">&#xe61d;</i> ';
				if ( flag ) {
					$el.addClass( "on" )
						.append( _i_on );
				} else {
					$el.addClass( 'off' )
						.append( _i_off );
				}

				$el.on( {
					click: function ( event ) {
						var element = event.target || event.srcElement;
						if ( $el.hasClass( 'on' ) ) {
							$input.removeAttr( 'checked' );
						} else if ( $el.hasClass( 'off' ) ) {
							$input.attr( "checked", "checked" );
						}
						$el.toggleClass( 'on off' );
						flag = $input.attr( 'checked' ) ? true : false;
						$el.find( "i" )
							.remove();
						if ( flag ) {
							$el.append( _i_on );
						} else {
							$el.append( _i_off );
						}
					}
				} );
			} );
		}

	} )


} )( jQuery );
