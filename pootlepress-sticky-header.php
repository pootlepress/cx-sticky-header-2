<?php
    if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly
/*
Plugin Name: Canvas Extension - Sticky Header
Plugin URI: http://pootlepress.com/canvas-extensions/
Description: An extension for WooThemes Canvas that makes the header 'stick' at the top of the page.
Version: 2.1.6
Author: PootlePress
Author URI: http://pootlepress.com/
License: GPL version 2 or later - http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
*/
/*  Copyright 2012  Pootlepress  (email : jamie@pootlepress.co.uk)

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License, version 2, as 
    published by the Free Software Foundation.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/	  

	require_once( 'classes/class-pootlepress-sticky-header.php' );
    require_once( 'classes/class-pootlepress-updater.php');
    require_once( 'classes/class-pootlepress-canvas-options.php');
    require_once('pootlepress-sticky-header-functions.php');

    $GLOBALS['pootlepress_sticky_header'] = new Pootlepress_Sticky_Header( __FILE__ );
    $GLOBALS['pootlepress_sticky_header']->version = '2.1.6';
