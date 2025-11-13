<?php

/*
 * This file is part of olleksi/flarum-swipe.
 *
 * Copyright (c) 2024 Olleksi.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Olleksi\Swipe;

use Flarum\Extend;
use Flarum\Frontend\Document;

return [
    // Extend the forum frontend
    (new Extend\Frontend('forum'))
        ->content(function (Document $document) {
            // Get paths to resources
            $extensionDir = __DIR__;
            $jsPath = $extensionDir . '/resources/swipe.js';
            $cssPath = $extensionDir . '/resources/swipe.css';
            
            // Debug info - always show in console
            $document->head[] = '<script>console.log("🔵 [Swipe] Extension directory: ' . addslashes($extensionDir) . '");</script>';
            $document->head[] = '<script>console.log("🔵 [Swipe] JS path: ' . addslashes($jsPath) . '");</script>';
            $document->head[] = '<script>console.log("🔵 [Swipe] CSS path: ' . addslashes($cssPath) . '");</script>';
            
            // Check and load CSS
            if (file_exists($cssPath)) {
                try {
                    $css = file_get_contents($cssPath);
                    if ($css !== false && !empty($css)) {
                        $document->head[] = '<style type="text/css" id="swipe-extension-css">' . $css . '</style>';
                        $document->head[] = '<script>console.log("✅ [Swipe] CSS loaded successfully (' . strlen($css) . ' bytes)");</script>';
                    } else {
                        $document->head[] = '<script>console.error("❌ [Swipe] CSS file is empty");</script>';
                    }
                } catch (\Exception $e) {
                    $document->head[] = '<script>console.error("❌ [Swipe] CSS load error: ' . addslashes($e->getMessage()) . '");</script>';
                }
            } else {
                $document->head[] = '<script>console.error("❌ [Swipe] CSS file not found at: ' . addslashes($cssPath) . '");</script>';
            }
            
            // Check and load JavaScript
            if (file_exists($jsPath)) {
                try {
                    $js = file_get_contents($jsPath);
                    if ($js !== false && !empty($js)) {
                        $document->head[] = '<script type="text/javascript" id="swipe-extension-js">' . $js . '</script>';
                        $document->head[] = '<script>console.log("✅ [Swipe] JavaScript loaded successfully (' . strlen($js) . ' bytes)");</script>';
                    } else {
                        $document->head[] = '<script>console.error("❌ [Swipe] JavaScript file is empty");</script>';
                    }
                } catch (\Exception $e) {
                    $document->head[] = '<script>console.error("❌ [Swipe] JavaScript load error: ' . addslashes($e->getMessage()) . '");</script>';
                }
            } else {
                $document->head[] = '<script>console.error("❌ [Swipe] JavaScript file not found at: ' . addslashes($jsPath) . '");</script>';
            }
            
            // Final confirmation
            $document->head[] = '<script>console.log("🏁 [Swipe] Extension initialization completed");</script>';
        }),
];
