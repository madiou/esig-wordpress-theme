<?php
function esig_assets() {
  // CSS principal
  wp_enqueue_style(
    'esig-css',
    get_stylesheet_directory_uri() . '/css/style.css',
    array(),
    '1.0'
  );

  // JS principal
  wp_enqueue_script(
    'esig-js',
    get_stylesheet_directory_uri() . '/js/main.js',
    array(),
    '1.0',
    true
  );
}
add_action('wp_enqueue_scripts', 'esig_assets');
