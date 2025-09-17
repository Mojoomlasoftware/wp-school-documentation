/*
	By Osvaldas Valutis, www.osvaldas.info
	Available for use under the MIT License
*/
(function( $, window, document, undefined )
{
	$.fn.doubleTapToGo = function( params )
	{
		if (!('ontouchstart' in window) && !navigator.msMaxTouchPoints && !navigator.userAgent.toLowerCase().match(/windows phone os 7/i))
			return false;
		this.each( function()
		{
			var curItem = false;
			jQuery( this ).on( 'click', function( e )
			{
				var item = jQuery( this );
				if( item[ 0 ] != curItem[ 0 ] )
				{
					e.preventDefault();
					curItem = item;
				}
			});
			jQuery( document ).on( 'click touchstart MSPointerDown', function( e )
			{
				var resetItem = true,
				parents	  = jQuery( e.target ).parents();
				for( var i = 0; i < parents.length; i++ )
					if( parents[ i ] == curItem[ 0 ] )
						resetItem = false;
				if( resetItem )
					curItem = false;
			});
		});
		return this;
	};
})( jQuery, window, document );