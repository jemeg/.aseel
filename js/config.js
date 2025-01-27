// تكوين GitHub OAuth
export const GITHUB_CONFIG = {
    CLIENT_ID: 'YOUR_GITHUB_CLIENT_ID', // يجب استبداله بمعرف العميل الخاص بك
    REDIRECT_URI: 'http://localhost:5500/auth.html', // يجب تحديثه حسب عنوان موقعك
    SCOPE: 'gist user',
    AUTH_URL: 'https://github.com/login/oauth/authorize',
    TOKEN_URL: 'https://github.com/login/oauth/access_token',
    API_URL: 'https://api.github.com'
};

// تكوين Google OAuth
export const GOOGLE_CONFIG = {
    CLIENT_ID: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com', // يجب استبداله بمعرف العميل الخاص بك
    SCOPE: 'profile email'
};

// تكوين Discord Webhook
export const DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/1333197147709116438/-xVECI_fwvzjxPEJ_bdxCXh44frVsOn9P17N-gptuybp9sJ5d7LyMaYeC4eNcfO3v2Gg';

// تكوين Google OAuth
export const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID';

// إعدادات أخرى
export const APP_CONFIG = {
    APP_NAME: 'سولي',
    API_VERSION: '1.0.0',
    DEBUG_MODE: false
};
