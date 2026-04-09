
/* ---------------------------------------------------------------------- */
/* Menu Responsive Switcher
/* ---------------------------------------------------------------------- */ 

jQuery(document).ready(function($){

	/* prepend menu icon */
	$('#nav-wrap').prepend('<div id="menu-icon"><i class="icomoon-menu-6"></i> Menu - <span class="mn-clk">Navigation</span></div>');
	
	/* toggle nav */
	$("#menu-icon").on("click", function(){
		$("#nav").slideToggle();
		$(this).toggleClass("active");
	});

});

/* ---------------------------------------------------------------------- */
/*	Windows Phone 8 and Device-Width + Menu fix
/* ---------------------------------------------------------------------- */

jQuery(document).ready(function($){
if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
    var msViewportStyle = document.createElement("style");
    msViewportStyle.appendChild(
        document.createTextNode(
            "@-ms-viewport{width:auto!important}"
        )
    );
    document.getElementsByTagName("head")[0].
        appendChild(msViewportStyle);
	jQuery('ul#nav').addClass('ie10mfx');
}
});

/* ---------------------------------------------------------------------- */
/*	doubleTapToGo
/* ---------------------------------------------------------------------- */

jQuery(document).ready(function($){
    var deviceAgent = navigator.userAgent.toLowerCase();
    var agentID = deviceAgent.match(/(iphone|ipod|ipad)/);
    if (agentID) {

        var width = $(window).width();
	if (width > 768) {
		if(jQuery( '#mgmenu1 li:has(ul)' ).length)
		{
			jQuery( '#mgmenu1 li:has(ul)' ).doubleTapToGo();
		}
	}
 
    }
else {
	jQuery( '#mgmenu1 li:has(ul)' ).doubleTapToGo();
}
});




/* ---------------------------------------------------------------------- */
/*	Accordion
/* ---------------------------------------------------------------------- */
	
	(function() {

		var $container = $('.acc-container'),
			$trigger   = $('.acc-trigger');

		$container.hide();
		$trigger.first().addClass('active').next().show();

		var fullWidth = $container.outerWidth(true);
		$trigger.css('width', fullWidth);
		$container.css('width', fullWidth);
		
		$trigger.on('click', function(e) {
			if( $(this).next().is(':hidden') ) {
				$trigger.removeClass('active').next().slideUp(300);
				$(this).toggleClass('active').next().slideDown(300);
			}
			e.preventDefault();
		});

		// Resize
		$(window).on('resize', function() {
			fullWidth = $container.outerWidth(true)
			$trigger.css('width', $trigger.parent().width() );
			$container.css('width', $container.parent().width() );
		});

	})();


	
	
	$(document).ready(function() {
   $(window).resize();
});

$(window).resize(function() {
   if ($(this).width() > 480) {
      
	  
	  
	  
	  
	  
//<![CDATA[
$(window).load(function(){
// Cache selectors
var lastId,
topMenu = $("#top-menu"),
topMenuHeight = topMenu.outerHeight()+80,


// All list items
menuItems = topMenu.find("a"),
// Anchors corresponding to menu items
scrollItems = menuItems.map(function(){
var item = $($(this).attr("href"));
if (item.length) { return item; }
});
// Bind click handler to menu items
// so we can get a fancy scroll animation
menuItems.click(function(e){
var href = $(this).attr("href"),
offsetTop = href === "#" ? 0 : $(href).offset().top-20;
$('html, body').stop().animate({
scrollTop: offsetTop
}, 300);
e.preventDefault();
});
// Bind to scroll
$(window).scroll(function(){
// Get container scroll position
var fromTop = $(this).scrollTop()+topMenuHeight;
// Get id of current scroll item
var cur = scrollItems.map(function(){
if ($(this).offset().top < fromTop)
return this;
});
// Get the id of the current element
cur = cur[cur.length-1];
var id = cur && cur.length ? cur[0].id : "";
if (lastId !== id) {
lastId = id;
// Set/remove active class
menuItems
.parent().removeClass("active")
.end().filter("[href=#"+id+"]").parent().addClass("active");
}
});
});//]]> 
	  
	  
	  
	  
   }
});

/* ---------------------------------------------------------------------- */
/*	Scroll to top
/* ---------------------------------------------------------------------- */

  jQuery(document).ready(function(){ 
 
        jQuery(window).scroll(function(){
            if (jQuery(this).scrollTop() > 100) {
                jQuery('.scrollup').fadeIn();
            } else {
                jQuery('.scrollup').fadeOut();
            }
        }); 
 
        jQuery('.scrollup').click(function(){
            jQuery("html, body").animate({ scrollTop: 0 }, 700);
            return false;
        });
 
    });
  
  
 

	

/* ---------------------------------------------------------------------- */
/*		OurClient jCarousel Initialize
/* ---------------------------------------------------------------------- */

jQuery(document).ready(function() {
	if(jQuery('#our-clients').length){
		jQuery('#our-clients').jcarousel();
	}
	
	if(jQuery('#latest-projects').length){
		jQuery('#latest-projects').jcarousel();
	}
});	


	

/* ---------------------------------------------------------------------- */
/*		Sticky Menu
/* ---------------------------------------------------------------------- */

jQuery(document).ready(function(){
	var width = $(window).width();
	if (width > 768) {
		if(jQuery("#sticker").length)
		{
			jQuery("#sticker").sticky({ topSpacing: 0, getWidthFrom: jQuery('#boxed-wrap')});
	}
	}
});

jQuery(window).scroll(function(){
	var width = $(window).width();
	if (width < 768) {
		if(jQuery("#sticker").length)
		{
			jQuery("#sticker").css("position","relative"),
			jQuery(".is-sticky").css("position","relative"),
			jQuery(".is-sticky").css("height","auto");
		}		
	}
});

jQuery(document).ready(function(){
	var width = $(window).width();
	if (width > 768) {
		if(jQuery("#sticker").length)
		{
			jQuery("#side-nav").sticky({ bottomSpacing: 180});
	}
	}
});



/* ---------------------------------------------------------------------- */
/*		FlexSlider
/* ---------------------------------------------------------------------- */
jQuery(document).ready(function() {
      
	  if(jQuery('.flexslider').length){
		  jQuery('.flexslider').flexslider({
			animation: "slide",
			start: function(slider){
			  jQuery('body').removeClass('loading');
			}
		  });
	  }
});


/* ---------------------------------------------------------------------- */
/*		PrettyPhoto
/* ---------------------------------------------------------------------- */


jQuery(document).ready(function($){
    
	    /* --------- */
		/* Add PrettyPhoto */
		/* ------------------------ */
		
		var lightboxArgs = {			
						animation_speed: 'fast',
						overlay_gallery: true,
			autoplay_slideshow: false,
						slideshow: 5000, /* light_rounded / dark_rounded / light_square / dark_square / facebook */
									theme: 'pp_default', 
									opacity: 0.8,
						show_title: false,
			social_tools: "",			deeplinking: false,
			allow_resize: true, 			/* Resize the photos bigger than viewport. true/false */
			counter_separator_label: '/', 	/* The separator for the gallery counter 1 "of" 2 */
			default_width: 940,
			default_height: 529
		};

		if(jQuery('a[href$=jpg], a[href$=JPG], a[href$=jpeg], a[href$=JPEG], a[href$=png], a[href$=gif], a[href$=bmp]:has(img), a[class^="prettyPhoto"]').length){
			jQuery('a[href$=jpg], a[href$=JPG], a[href$=jpeg], a[href$=JPEG], a[href$=png], a[href$=gif], a[href$=bmp]:has(img), a[class^="prettyPhoto"]').prettyPhoto(lightboxArgs);
		}
		if(jQuery("a[rel^='prettyPhoto']").length){
			jQuery("a[rel^='prettyPhoto']").prettyPhoto({animation_speed:'normal',theme:'pp_default',slideshow:3000, autoplay_slideshow: false});
		}
		
});
