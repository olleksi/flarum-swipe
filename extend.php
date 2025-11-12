<?php

use Flarum\Extend;

return [
    (new Extend\Frontend('forum'))
        ->content(function () {
            $js = @file_get_contents(__DIR__ . '/resources/swipe.js');
            $css = @file_get_contents(__DIR__ . '/resources/swipe.css');
            
            $output = '';
            
            if ($js !== false) {
                $output .= '<script type="text/javascript">' . $js . '</script>';
            }
            
            if ($css !== false) {
                $output .= '<style type="text/css">' . $css . '</style>';
            }
            
            return $output;
        }),
];
