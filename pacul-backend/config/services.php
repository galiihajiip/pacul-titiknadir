<?php

return [

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    // Google Services
    'google' => [
        'maps_api_key'       => env('GOOGLE_MAPS_API_KEY'),
        'project_id'         => env('GOOGLE_CLOUD_PROJECT_ID'),
        'vision_credentials' => env('GOOGLE_VISION_CREDENTIALS'),
    ],

    // VAPID for Web Push Notifications
    'vapid' => [
        'public_key'  => env('VAPID_PUBLIC_KEY'),
        'private_key' => env('VAPID_PRIVATE_KEY'),
        'subject'     => env('VAPID_SUBJECT', 'mailto:admin@pacul.id'),
    ],

];
