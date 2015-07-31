<?php
/*
Plugin Name: Canvas Extension - Sticky Header
Plugin URI: http://pootlepress.com/canvas-extensions/
Description: An extension for WooThemes Canvas that makes the header 'stick' at the top of the page.
Version: 2.1.4
Author: PootlePress
Author URI: http://pootlepress.com/
License: GPL version 2 or later - http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
*/

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

require_once( 'classes/class-pootlepress-sticky-header.php' );
require_once( 'classes/class-pootlepress-canvas-options.php');
require_once('pootlepress-sticky-header-functions.php');

$GLOBALS['pootlepress_sticky_header'] = new Pootlepress_Sticky_Header( __FILE__ );
$GLOBALS['pootlepress_sticky_header']->version = '2.1.4';

//CX API
require 'pp-cx/class-pp-cx-init.php';
new PP_Canvas_Extensions_Init(
	array(
		'key'          => 'sticky-header',
		'label'        => 'Sticky Header',
		'url'          => 'http://www.pootlepress.com/shop/sticky-header-woothemes-canvas/',
		'description'  => "Sticky header, allows you to stick the whole header and navigation of your site to the top of the page, including the logo.",
		'img'          => 'http://www.pootlepress.com/wp-content/uploads/2014/02/sticky-header-icon.png',
		'installed'    => true,
		'settings_url' => admin_url( 'admin.php?page=pp-extensions&cx=sticky-header' ),
	),
	array(
		//Tabs coming soon
	),
	'pp_cx_sticky_header',
	'Canvas Extension - Sticky Header',
	$GLOBALS['pootlepress_sticky_header']->version,
	__FILE__
);
