<?php

namespace olleksi\FlarumSwipe;

use Flarum\Extend;
use Flarum\Frontend\Document;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__ . '/js/dist/forum.js')
        ->content(function (Document $document) {
            $document->head[] = '<style>
                .swipe-indicator {
                    position: absolute;
                    top: 6px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 40px;
                    height: 4px;
                    border-radius: 2px;
                    z-index: 1001;
                    cursor: grab;
                }
                
                @media (max-width: 768px) {
                    .swipe-indicator {
                        background-color: var(--primary-color) !important;
                    }
                    
                    @media (prefers-color-scheme: dark) {
                        .swipe-indicator {
                            background-color: var(--primary-color) !important;
                        }
                    }
                }
                
                .swipe-indicator:active {
                    cursor: grabbing;
                }
                
                .Dropdown-menu {
                    padding-top: 20px !important;
                }
            </style>';
        }),
        
];
