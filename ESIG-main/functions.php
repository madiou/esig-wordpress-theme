<?php
function esig_assets() {
  wp_enqueue_style(
    'esig-style',
    get_stylesheet_directory_uri() . '/assets/css/style.css',
    array(),
    '1.0'
  );

  wp_enqueue_script(
    'esig-main',
    get_stylesheet_directory_uri() . '/assets/js/main.js',
    array(),
    '1.0',
    true
  );
}
add_action('wp_enqueue_scripts', 'esig_assets');
