<?php
if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly
/**
 * Pootlepress_Sticky_Header Class
 *
 * Plugin PHP functionality to collect option settings and call a jQuery function.
 *
 * @package WordPress
 * @subpackage Pootlepress_Sticky_Header
 * @category Plugin
 * @author Pootlepress
 * @since 1.0.0
 *
 */
class Pootlepress_Sticky_Header {
	public $token = 'pootlepress-sticky-header';
	public $version;
	private $file;

	/**
	 * Constructor.
	 * @param string $file The base file of the plugin.
	 * @access public
	 * @since  1.0.0
	 * @return  void
	 */
	public function __construct ( $file ) {
		// setup
		$this->file = $file;
		$this->load_plugin_textdomain();
		add_action( 'init', array( &$this, 'load_localisation' ), 0 );

		add_action( 'admin_init', 'poo_commit_suicide' );

        // this is not needed
//		add_action( 'admin_init', array( &$this, 'poo_shutdown_others') );

		// Run on activation.
		register_activation_hook( $file, array( &$this, 'activation' ) );

		// scripts and styles
	//	add_action( 'wp_enqueue_scripts', array( &$this, 'poo_hookup_styles' ));
		add_action( 'wp_enqueue_scripts', array( &$this, 'poo_hookup_scripts'));
		add_action( 'woothemes_wp_head_after', array( &$this, 'poo_inline_javascript'), 10 );
		
		// add custom theme options
		$this->add_theme_options();

		// sticky header options processing
		add_action('init', array( &$this, 'process_sticky_header_options' ) );
	} // End __construct()

	// plugin javascript	
	public function poo_hookup_scripts() {
	//	wp_enqueue_script('jquery-mobile',
	//		plugins_url( '../jquery.mobile-1.4.2.min.js' , __FILE__ ),
	//		array( 'jquery' ),
	//		false, false );
		wp_enqueue_script('stickyheader2_js',
			plugins_url( '../stickyheader2.js' , __FILE__ ),
			array( 'jquery' ),
			false, false
		);
	}

	// plugin css	
	public function poo_hookup_styles() {
		wp_enqueue_style('jquery-mobile',
			plugins_url('../jquery.mobile-1.4.2.min.css', __FILE__)
		);
	}

	// generate plugin custom inline javascript - driven by theme options
	public function poo_inline_javascript() {
		echo "\n" . '<!-- Sticky Header Inline Javascript -->' . "\n";
		echo '<script>' . "\n";
		echo "	/* set global variable for pootlepress common component area  */\n";
		echo '	if (typeof pootlepress === "undefined") { var pootlepress = {} }' . "\n";
		echo '	jQuery(document).ready(function($) {' . "\n";
		echo $this->poo_inline_styling_javascript();
		echo '	});' . "\n";
		echo '</script>' . "\n";
	}

	/**
	 * Add theme options to the WooFramework.
	 * @access public
	 * @since  2.0.1
	 * @param array $o The array of options, as stored in the database.
	 */	
	public function add_theme_options () {
        $options = array();

        $options[] = array(
            'name' => 'Sticky Header',
            'type' => 'heading' );

		$options[] = array(
			'name' => 'Sticky Header Settings',
			'type' => 'subheading' );

		$options[] = array(
			'id' => 'pootlepress-sticky-header-option', 
			'name' => __( 'Sticky Header', 'pootlepress-sticky-header' ), 
			'desc' => __( 'Enable sticky header', 'pootlepress-sticky-header' ), 
			'std' => 'true',
			'type' => 'checkbox' );

		$options[] = array(
			'id' => 'pootlepress-sticky-header-wpadminbar', 
			'name' => __( 'Wordpress Admin Bar', 'pootlepress-sticky-header' ), 
			'desc' => __( 'Disable the Wordpress Admin Bar (so the Wordpress admin bar will not hide the sticky header).', 'pootlepress-sticky-header' ), 
			'std' => 'false',
			'type' => 'checkbox' );

		$options[] = array(
			'id' => 'pootlepress-sticky-header-align-right-option', 
			'name' => __( 'Align Nav Menu Right', 'pootlepress-sticky-header-align-right-option' ), 
			'desc' => __( 'Align the nav menu to the right of the logo. Please make sure you are not using any other plugins to align the menu right as this can cause issues. When align menu right is enabled the primary nav bottom margin in Canvas will not have a visible effect. To add a margin under the header for space between the header and the content use the a header bottom margin', 'pootlepress-sticky-header' ),
			'std' => 'false',
			'type' => 'checkbox' );

//        $options[] = array(
//           	'id' => 'pootlepress-sticky-header-sticky-mobile',
//			'name' => __( 'Enable Sticky in Mobile View', 'pootlepress-sticky-header' ),
//			'desc' => __( 'Enable Sticky in Mobile View', 'pootlepress-sticky-header' ),
//           	'std' => 'false',
//           	'type' => 'checkbox' );
        $options[] = array(
         	'id' => 'pootlepress-sticky-header-opacity',
           	'name' => __( 'Header Opacity', 'pootlepress-sticky-header' ),
           	'desc' => __( 'Header Background ( color / image ) Opacity (%)', 'pootlepress-sticky-header' ),
           	'std' => '100',
           	'type' => 'text' );

        $afterName = 'Map Callout Text';
        $afterType = 'textarea';

        global $PCO;
        $PCO->add_options($afterName, $afterType, $options);
	} 		// End add_theme_options()
	
	/**
	 * Load the plugin's localisation file.
	 * @access public
	 * @since 1.0.0
	 * @return void
	 */
	public function load_localisation () {
		load_plugin_textdomain( $this->token, false, dirname( plugin_basename( $this->file ) ) . '/lang/' );
	} // End load_localisation()
	
	/**
	 * Load the plugin textdomain from the main WordPress "languages" folder.
	 * @access public
	 * @since  1.0.0
	 * @return  void
	 */
	public function load_plugin_textdomain () {
	    $domain = $this->token;
	    // The "plugin_locale" filter is also used in load_plugin_textdomain()
	    $locale = apply_filters( 'plugin_locale', get_locale(), $domain );
	 
	    load_textdomain( $domain, WP_LANG_DIR . '/' . $domain . '/' . $domain . '-' . $locale . '.mo' );
	    load_plugin_textdomain( $domain, FALSE, dirname( plugin_basename( $this->file ) ) . '/lang/' );
	} // End load_plugin_textdomain()

	/**
	 * Run on activation.
	 * @access public
	 * @since 1.0.0
	 * @return void
	 */
	public function activation () {
		$this->register_plugin_version();
	} // End activation()

	/**
	 * Register the plugin's version.
	 * @access public
	 * @since 1.0.0
	 * @return void
	 */
	private function register_plugin_version () {
		if ( $this->version != '' ) {
			update_option( $this->token . '-version', $this->version );
		}
	} // End register_plugin_version()

	public function process_sticky_header_options () {
		$_wpadminbarhide 	= get_option('pootlepress-sticky-header-wpadminbar');
		if ($_wpadminbarhide == 'true') {
			add_filter('show_admin_bar', '__return_false');
		}
	}

	function poo_shutdown_others() {
		$plugin = plugin_basename( __FILE__ );
		$plugin_data = get_plugin_data( __FILE__, false );
		$all_plugins = get_plugins();
		foreach ( $all_plugins as $k => $v )
			if ( substr( $k, 0, 11) == 'cx-sticky-n' ||
				substr( $k, 0, 19) == 'cx-align-menu-right' ) {
				if ( is_plugin_active($k) )
					deactivate_plugins( $k );
			}		
	}
	
	/**
	 * Generate the javascript statement to invoke the Sticky Header jQuery function 
	 * with the options based on the settings of the theme options.
	 * @access private
	 * @since  2.0.1
	 * @return  (String) javascript command to embed in the HTML document
	 */
	private function poo_inline_styling_javascript() {
		global $woo_options;
		$output = '    ';
	/* ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- */
	/* ----- Sticky Header Options   ----- ----- ----- ----- ----- ----- ----- ----- ----- */
		$_stickyenabled  	= get_option('pootlepress-sticky-header-option', 'false');
		$_wpadminbarhide 	= get_option('pootlepress-sticky-header-wpadminbar', 'false');
		$_alignr = get_option('pootlepress-sticky-header-align-right-option', 'false');
//        $_stickyMobileEnabled = get_option('pootlepress-sticky-header-sticky-mobile', 'false');
        $_stickyMobileEnabled = 'false';
		$_fixed_mobile_layout = get_option('woo_remove_responsive', 'false');
		if ($_fixed_mobile_layout == 'true')				// if responsive disabled 
			$_responsive = 'false'; else $_responsive = 'true';
        $_opacity = get_option('pootlepress-sticky-header-opacity', '100');
		if ( $_opacity != '100' ) {
			$v = trim( str_replace('%', '', $_opacity ));
			if ( is_numeric( $v ))
				$_opacity = intval($v); else $_opacity = 100;
		}

        $borderTop = get_option('woo_border_top');
        if ($borderTop && isset($borderTop['width']) && $borderTop['width'] > 0) {
            $borderTopJson = json_encode($borderTop);
        } else {
            $borderTopJson = json_encode(false);
        }

        $layoutWidth = get_option('woo_layout_width');

		$output .= "    $('#header').stickypoo( { stickyhdr : $_stickyenabled";
		$output .= ", stickynav : $_stickyenabled";
		$output .= ", alignright : $_alignr";
		$output .= ", mobile : $_stickyMobileEnabled";
		$output .= ", responsive : $_responsive";
		$output .= ", opacity : $_opacity";
		$output .= ", wpadminbar : $_wpadminbarhide";
        $output .= ", bordertop : $borderTopJson";
        $output .= ", layoutWidth: $layoutWidth";
		$output .= ' });' . "\n";

        $output .= "if (typeof window.setSubMenuWidth != 'undefined') {\n";
        $output .= "\t" . "window.setSubMenuWidth();\n";
        $output .= "}\n";

		return $output;
	}
} // End Class
