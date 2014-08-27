/* ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- 
 * Document:	stickyheader2.js
 * Description:	PootlePress Sticky Header javascript module.
 * Author:		PootlePress
 * Author URI:	http://pootlepress.com
 * Version:		2.3.1
 * Date:		2-May-2014
 * ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- 
*/
(function( $ ) {

    $.fn.stickypoo = function(o) {
    	var debug	= false,
    		poo = {
    		options			:	o,
    		viewportW		:	window.innerWidth, // this is the width that media query in css is tested against
    		isMobile		:	(window.innerWidth < 768) ? true : false,
    		isFullWidth		:	($('body').hasClass("full-header")) ? true : false,
    		isBoxedLayout	:	($('body').hasClass("boxed-layout")) ? true : false,
    		isFixedMobile	:	($('body').hasClass("fixed-mobile")) ? true : false,
    		opacityLayers	:	false,
    		elm		:	0,
    		nav		:	0,
    		hdr		:	0,			// header element: #header-container if full width, otherwise #header
    		navSticky :	0,			// standard nav element used when not right aligned
    		alignRightNav : { clear : 'none', float : 'right', width : 'auto', marginBottom: 0 },
    		logoMods	:	{ clear : 'none', float : 'left',  width : 'auto' },    		
    		headerMods	:	{ paddingBottom : 0 },
    		stickyLayr	:	{ position : 'fixed', top : 0, display : 'block' },
    		stickyHdr	:	{ position : 'fixed', top : 0, display : 'block', zIndex : 9003 },
    		stickyNav 	: 	{ position : 'fixed', top : 0, display : 'block', zIndex : 10000 },
    		stickyTopNav: 	{ position : 'fixed', top : 0, display : 'block', zIndex : 9004, width : '100%' },
    		stickyMobileHdr	:	{ zIndex : 9003 },
    		hdrDims				:	{ width : 'auto', height : 'auto' },
    		// header layers for opacity 
    		hdrBackdropCss		:	{ position : 'absolute', top : 0, zIndex : '9001' },
    		hdrBackgroundCss	:	{ position : 'absolute', top : 0, zIndex : '9002', opacity : 0.2 },
    		hdrCss				: 	{ position : 'relative', display : 'block', background : 'none', zIndex : 9003 },
    		noTransparency		:	{ backgroundColor: '#ffffff' }
    			};
		return this.each(function() {
			if (debug) console.log( "viewWidth=" + poo.viewportW +"\n" +
                "Window Width: " + $(window).width() + "\n" +
                "Window Inner Width: " + window.innerWidth + "\n" +
                JSON.stringify(poo.options));
			// setup ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- -----
			pootlepress.stickyHdrOptions = o;		// save my presence in global variable
            pootlepress.poo = poo;
			poo.elm = $(this); poo.hdr = $(this);
			poo.nav = ( poo.isFullWidth ) ? $('#nav-container') : $('#navigation');
			poo.noTransparency.backgroundColor = $('body').css( 'background-color' );
			poo.hdrDims.height			= poo.hdr.height() + "px";
			poo.hdrDims.innerHeight		= poo.hdr.innerHeight() + "px";
			poo.hdrDims.outerHeight		= poo.hdr.outerHeight() + "px";
			poo.hdrDims.trueOuterHeight	= poo.hdr.outerHeight(true) + "px";
			poo.hdrDims.width			= poo.hdr.width() + "px";
			poo.hdrDims.innerWidth		= poo.hdr.innerWidth() + "px";
			poo.hdrDims.outerWidth		= poo.hdr.outerWidth() + "px";
			poo.hdrDims.trueOuterWidth	= poo.hdr.outerWidth(true) + "px";
			if (debug) console.log(JSON.stringify(poo.hdrDims));
			if ( poo.isFullWidth ) {
	 			poo.stickyHdr.width = '100%';
	 			poo.stickyNav.width = '100%';
				poo.hdr = poo.elm.parent();
//				poo.elm.css( { backgroundColor : 'rgba(0, 0, 0, 0)' } );	// conflict
//				poo.elm.css( { backgroundImage : 'none' } );				// avoidance
			} else if ( poo.isBoxedLayout ) {
				poo.stickyHdr.top += parseInt($('#inner-wrapper').css('border-top-width'));
				poo.stickyHdr.width = poo.hdrDims.width;
 				poo.stickyNav.width = poo.nav.css('width');
 			} else if ( poo.isFixedMobile && poo.isMobile ) {
    			poo.stickyNav.width = '100%';
			} else {
				poo.stickyHdr.width =  poo.hdrDims.trueOuterWidth;
 				poo.stickyNav.width = poo.options.layoutWidth;
				poo.nav.css('min-height', '0');
			}

            poo.hdr.attr('bg-color', poo.hdr.css('background-color'));

			// check for header background opacity setting
			if ( isNaN(poo.options.opacity) || poo.options.opacity < 0 || poo.options.opacity > 100 )
				poo.hdrBackgroundCss.opacity = '1'; else poo.hdrBackgroundCss.opacity = (poo.options.opacity / 100) +"";

			// check for mobile device ----- ----- ----- ----- ----- ----- ----- ----- ----- 
//			if ( poo.isMobile && !poo.options.mobile )		// mobile view but mobile option not selected
//				return; 									// Fahgettaboudit

			// move nav menu if align right option selected ----- ----- ----- ----- ----- 
			if ( poo.options.alignright && !poo.isMobile)				// not for mobile 
				$('#logo').css(poo.logoMods).after(poo.nav.css(poo.alignRightNav).detach());

			// set header background opacity if less that 100%
            // this function is obsolete
			//if ( poo.hdrBackgroundCss.opacity != '1') setBackgroundOpacity();

			// check for and set header sticky ----- ----- ----- ----- ----- ----- ----- 
			if ( poo.options.stickyhdr ) { //&& !(poo.isMobile && poo.options.responsive) ) {
				setHeaderSticky();
				if ( !poo.options.alignright )			// if nav menu wasn't moved 
					setNavbarSticky();					// make it sticky
			}

            if ( poo.isMobile && poo.options.responsive ) {	// mobile view and responsive layout
                if (poo.options.mobile) {
                    doStickyMobile();
                } else {
                    doNormalMobile();
                }
            }


		  // ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- -----  
			function setHeaderSticky() {
				if ( !poo.opacityLayers && isTransparent(poo.hdr) ) {
					if (debug) console.log("setHeaderSticky says hdr transparent test is true" +" " +poo.hdr.css('background-image') +" " + poo.hdr.css('background-color') );
					poo.hdr.css( poo.noTransparency );
				}
				// adjust for WP Admin Bar and Top Navbar 
 				poo.x = $('#wpadminbar:visible').height();
 				poo.x = ( poo.x == null || isNaN(poo.x)) ? 0 : poo.x;
 				poo.y = $('#top:visible').height();
 				poo.y = ( poo.y == null || isNaN(poo.y)) ? 0 : poo.y;

                poo.borderTopWidth = 0;
                if (poo.options.bordertop != false && parseInt(poo.options.bordertop['width']) > 0) {
                    var borderWidth = parseInt(poo.options.bordertop['width']);
                    var borderStyle = poo.options.bordertop['style'];
                    var borderColor = poo.options.bordertop['color'];
                    $('body').css('border-top', 'none');
                    var $newBorder = $('#body-border-top');
                    if ($newBorder.length == 0) {
                        $newBorder = $('<div id="body-border-top"></div>');
                    }
                    $newBorder.css('border-top-width', borderWidth + 'px');
                    $newBorder.css('border-top-style', borderStyle);
                    $newBorder.css('border-top-color', borderColor);
                    $newBorder.css('position', 'fixed')
                    $newBorder.css('width', '100%');
                    $newBorder.css('z-index', 10);
                    $('body').prepend($newBorder);

                    poo.borderTopWidth = borderWidth;
                }

 				poo.stickyHdr.top += poo.x + poo.y + poo.borderTopWidth;

 				poo.stickyTopNav.top += poo.x + poo.borderTopWidth;
 				poo.topNavH = poo.y;

 			 	// make it sticky
 				if ( poo.isFullWidth && poo.hdrBackgroundCss.opacity == '1' )
 			  		poo.stickyHdr.height = poo.hdrDims.outerHeight; 
 				if ( $('#top').length > 0 ) $('#top').css(poo.stickyTopNav);
				poo.hdr.css(poo.stickyHdr);
				if ( poo.opacityLayers ) {
 					poo.stickyLayr.top = poo.stickyHdr.top; 
					poo.hdrBackdrop.css(poo.stickyLayr);
					poo.hdrBackground.css(poo.stickyLayr);
				}

                var $headerAfterGap = $('#header-after-gap');
                if ($headerAfterGap.length == 0) {
                    $headerAfterGap = $('<div id="header-after-gap"></div>');
                    poo.hdr.after($headerAfterGap);					// mind the gap
                }

                var topHeight = $('#top:visible').height();
                topHeight = (isNaN(topHeight) ? 0 : topHeight);
                var h = poo.hdrDims.trueOuterHeight;
                h = parseInt(h.substr(0, h.length - 2));

                $headerAfterGap.height(h + topHeight + poo.borderTopWidth);
//                $headerAfterGap.height( poo.hdr.next().height() +  );
			}			
			function setNavbarSticky() {
                var $navOuterContainer = $('#nav-outer-container');
                if ($navOuterContainer.length == 0) {
                    $navOuterContainer = $('<div id="nav-outer-container"></div>');
                    poo.nav.before( $navOuterContainer );
                    poo.navSticky = $navOuterContainer;
                    poo.nav.detach().appendTo( poo.navSticky );		// move nav menu
                }

 				poo.stickyNav.top = $('#header-after-gap').offset().top + $('#header-after-gap').height();// + poo.topNavH;
//                console.log("poo.nav.offset().top: " + poo.nav.offset().top + "\n");
                poo.navSticky = $navOuterContainer;
 				poo.navSticky.css(poo.stickyNav);				// stick it

                var $navOuterContainerAfter = $('#nav-outer-container-after');
                if ($navOuterContainerAfter.length == 0) {
                    $navOuterContainerAfter = $('<div id="nav-outer-container-after"></div>');
                    poo.navSticky.after( $navOuterContainerAfter );			// mind with gap
                }
                $navOuterContainerAfter.height(poo.nav.outerHeight(true));
			}
			function setBackgroundOpacity() { // set header background opacity
				// create backdrop layer - hide stuff scrolling through stuck header
				poo.hdr.before( '<div class="pooOlayer"></div>' );
				poo.hdrBackdrop = poo.hdr.prev();
				if ( isTransparent(poo.hdr) ) {
					if (debug) console.log("setBackgroundOpacity says hdr transparent test is true" +" " +poo.hdr.css('background-image') +" " + poo.hdr.css('background-color') );
					poo.hdrBackdrop.css('background-color', $('body').css('background-color'));
				} else
					poo.hdrBackdrop.css('background-color', 'transparent');
				poo.hdrBackdropCss.height = poo.hdrDims.outerHeight; 
				poo.hdrBackdropCss.width = poo.hdrDims.width;
				if ( poo.isFullWidth ) poo.hdrBackdropCss.width = poo.hdrDims.trueOuterWidth;
				if ( poo.isBoxedLayout ) poo.hdrBackdropCss.width = poo.hdrDims.trueOuterWidth;
				poo.hdrBackdrop.css(poo.hdrBackdropCss);
				// create background layer ( color / image ) - opacity setting applied to this layer
				poo.hdr.before( '<div class="pooOlayer"></div>' );
				poo.hdrBackground = poo.hdr.prev();
				poo.hdrBackground.css('background', poo.hdr.css('background'));
				poo.hdrBackgroundCss.height = poo.hdrDims.outerHeight; 
				poo.hdrBackgroundCss.width = poo.hdrDims.width; 
				if ( poo.isFullWidth ) poo.hdrBackgroundCss.width = poo.hdrDims.trueOuterWidth;
				if ( poo.isBoxedLayout ) poo.hdrBackgroundCss.width = poo.hdrDims.trueOuterWidth;
				poo.hdrBackground.css(poo.hdrBackgroundCss);
				// wrapup
				poo.hdr.css( poo.hdrCss );		// this layer in the forefront 
				poo.opacityLayers = true;
			}

			function isTransparent(elm) {
				// is the background transparent - no image and no color
				if (debug) console.log("isTransparent says color is: " +elm.css('background-color') );
				if ( elm.css('background-image') == 'none' ) 					// then if
					if ( elm.css('background-color') == 'rgba(0, 0, 0, 0)' || elm.css('background-color') == 'transparent' )	
						return true;
				return false;
			}
			function doStickyMobile() {					// stickiness in canvas responsive layout
				var lNav, lHdr, lTog, headr;
				lNav = poo.viewportW * 0.8  + "px !important; "
				lHdr = poo.viewportW * 0.85 + "px; "
				lTog = poo.viewportW * 0.85 + "px; "
				nTop = $('#wpadminbar:visible').height();
				nTop = ( nTop == null || isNaN(nTop)) ? 0 : nTop;
				headr = "#header";
				if (poo.isFullWidth) {
					lNav = poo.viewportW * 0.8 + "px !important; "
					lHdr = poo.viewportW * 0.8 + "px; "
					lTog = poo.viewportW * 0.8 + "px; "
					headr = "#header-container";
				}
				$("head").append("<style>\n@media screen and (max-width: 767px) { \n" +
					"	body.show-nav #navigation	{ left : " + lNav + " }\n" +
					"	body.show-nav " +headr +"  		{ left : " + lHdr +" }\n" +
					"	body.show-nav .pooOlayer 	{ left : " + lHdr +" }\n" +
					"	body.show-nav .nav-toggle	{ position : fixed; width : 100%; left : " + lTog +" }\n" +
					"}\n</style>");
				$('#navigation').css( { position : 'fixed', zIndex : 9002, top : +nTop +"px" });
				poo.navToggle = $('.nav-toggle');
			//	poo.navToggle = poo.hdr.prev();

				if ( poo.hdrBackgroundCss.opacity != '1') {
					setBackgroundOpacity();
				 	poo.stickyLayr.top = poo.hdr.offset().top; 
					if (poo.isFullWidth) {
				 		poo.x = $('#wpadminbar:visible').height(); 
 						poo.x = ( poo.x == null || isNaN(poo.x)) ? 0 : poo.x;
 						poo.y = poo.navToggle.height();
 						poo.y = ( poo.y == null || isNaN(poo.y)) ? 0 : poo.y;
 						poo.stickyLayr.top = poo.x + poo.y;
					}
					$('.pooOlayer').css(poo.stickyLayr);
				}
							
				// make sticky
				if ( $('#wpadminbar:visible').height() > 0 ) {
 					sticky($('#wpadminbar:visible'));
 					poo.navToggle.css( { top : $('#wpadminbar:visible').height() +"px" });
 				}
 				sticky(poo.navToggle);
 				
 				sticky(poo.hdr);
				poo.navToggle.css(poo.stickyMobileHdr);
				poo.hdr.css(poo.stickyMobileHdr);
				return;
			}

            function doNormalMobile() {
                var mobileNavBarHeight = $('.nav-toogle').height();

                poo.x = $('#wpadminbar:visible').height();
                poo.x = ( poo.x == null || isNaN(poo.x)) ? 0 : poo.x;
                poo.y = $('#top:visible').height();
                poo.y = ( poo.y == null || isNaN(poo.y)) ? 0 : poo.y;

                poo.stickyHdr.top = poo.x + poo.y + poo.borderTopWidth + mobileNavBarHeight;

                $('#body-border-top').css('position', 'static');
                poo.hdr.css(poo.stickyHdr);
                poo.hdr.css('position', 'static');
                poo.hdr.css('height', 'auto');

                $('#nav-outer-container').css('position', 'static');

                $('#header-after-gap').css('height', '0');
                $('#nav-outer-container-after').css('height', '0');
                $('#top').hide();

                console.log('Do Normal Mobile');
            }

			function sticky(elm) {
				var	h = elm.outerHeight(),
					w = elm.width();
				if ( h == null || w == null ) return;
				elm.css( { position : 'fixed', width : w+"px" } );
				elm.after( "<div></div>" );							// create  gap 
				elm.next().height( h );								// mind the gap				
			}
    	});
    }

    $(document).ready(function () {
        $(window).resize(function () {
           $('#header').stickypoo(pootlepress.stickyHdrOptions);
        });

        $(window).scroll(function () {

            if (window.innerWidth >= 768) {
                // is normal screen
                if ($(window).scrollTop() == 0) {
                    var bgColor = pootlepress.poo.hdr.attr('bg-color');
                    pootlepress.poo.hdr.css('background-color', bgColor);
                } else {
                    var bgColor = pootlepress.poo.hdr.attr('bg-color');
                    var opacity = pootlepress.poo.options.opacity;

                    var rgba = convertRgbToRgba(bgColor, opacity);
                    pootlepress.poo.hdr.css('background-color', rgba);
                }
            } else {
                // is mobile view
                var bgColor = pootlepress.poo.hdr.attr('bg-color');
                pootlepress.poo.hdr.css('background-color', bgColor);
            }

        });
    });

    function convertHexToDec(s) {
        return parseInt(s, 16);
    }

    function convertRgbToRgba(rgb, opacityPercent) {
        var s = rgb.substr(0, rgb.length - 1);

        var opacityVal = opacityPercent / 100;

        s += ", " + opacityVal + ")";

        s = s.replace('rgb', 'rgba');

        return s;
    }

    function convertHexColorToRGBA(hexColor, opacityPercent) {
        var rHex = hexColor.substr(1, 2);
        var gHex = hexColor.substr(3, 2);
        var bHex = hexColor.substr(5, 2);

        var rDec = convertHexToDec(rHex);
        var gDec = convertHexToDec(gHex);
        var bDec = convertHexToDec(bHex);

        var opacityVal = opacityPercent / 100;

        return "rgba(" + rDec + ", " + gDec + ", " + bDec + ", " + opacityVal + ")";
    }
} ( jQuery ));
