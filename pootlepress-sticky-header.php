<?php
    if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly
/*
Plugin Name: Canvas Extension - Sticky Header
Plugin URI: http://pootlepress.com/canvas-extensions/
Description: An extension for WooThemes Canvas that makes the header 'stick' at the top of the page.
Version: 2.3.2
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
	$health = "ok";
	require_once( 'classes/class-pootlepress-sticky-header.php' );
    $GLOBALS['pootlepress_sticky_header'] = new Pootlepress_Sticky_Header( __FILE__ );
    $GLOBALS['pootlepress_sticky_header']->version = '2.3.2';

	if (!function_exists('check_main_heading')) {
		function check_main_heading() {
			global $health;
			if (!function_exists('woo_options_add') ) {
				function woo_options_add($options) {
					$cx_heading = array( 'name' => __('Canvas Extensions', 'pootlepress-canvas-extensions' ), 
						'icon' => 'favorite', 'type' => 'heading' );
					if (!in_array($cx_heading, $options))
						$options[] = $cx_heading;
					return $options;
				}
			} else {	// another ( unknown ) child-theme or plugin has defined woo_options_add
				$health = 'ng';
			}
		}
	}
    if (!function_exists('poo_commit_suicide')) {
        function poo_commit_suicide() {
            global $health;
            $plugin = plugin_basename( __FILE__ );
            $plugin_data = get_plugin_data( __FILE__, false );
            if ( $health == 'ng' && is_plugin_active($plugin) ) {
                deactivate_plugins( $plugin );
                wp_die( "ERROR: <strong>woo_options_add</strong> function already defined by another plugin. " .
                    $plugin_data['Name']. " is unable to continue and has been deactivated. " .
                    "<br /><br />Please contact PootlePress at <a href=\"mailto:support@pootlepress.com?subject=Woo_Options_Add Conflict\"> support@pootlepress.com</a> for additional information / assistance." .
                    "<br /><br />Back to the WordPress <a href='".get_admin_url(null, 'plugins.php')."'>Plugins page</a>." );
            }
        }
    }

?>