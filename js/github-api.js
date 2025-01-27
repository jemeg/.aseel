import { GITHUB_CONFIG } from './config.js';

class GitHubAPI {
    constructor() {
        this.accessToken = localStorage.getItem('github_token');
    }

    // تهيئة عملية تسجيل الدخول باستخدام GitHub
    initiateLogin() {
        const params = new URLSearchParams({
            client_id: GITHUB_CONFIG.CLIENT_ID,
            redirect_uri: GITHUB_CONFIG.REDIRECT_URI,
            scope: GITHUB_CONFIG.SCOPE,
            state: this.generateState()
        });

        window.location.href = `${GITHUB_CONFIG.AUTH_URL}?${params.toString()}`;
    }

    // إنشاء حالة عشوائية للأمان
    generateState() {
        const state = Math.random().toString(36).substring(2);
        localStorage.setItem('github_state', state);
        return state;
    }

    // التحقق من رمز التفويض
    async handleCallback(code, state) {
        const savedState = localStorage.getItem('github_state');
        if (state !== savedState) {
            throw new Error('حالة غير صالحة');
        }

        const response = await fetch('/api/github/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ code })
        });

        const data = await response.json();
        if (data.access_token) {
            this.accessToken = data.access_token;
            localStorage.setItem('github_token', data.access_token);
            return true;
        }
        return false;
    }

    // جلب بيانات المستخدم من GitHub
    async getUserData() {
        if (!this.accessToken) return null;

        const response = await fetch(`${GITHUB_CONFIG.API_URL}/user`, {
            headers: {
                'Authorization': `token ${this.accessToken}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        return response.json();
    }

    // إنشاء Gist جديد
    async createGist(content, description = 'Souli User Data', isPublic = false) {
        if (!this.accessToken) throw new Error('يجب تسجيل الدخول أولاً');

        const response = await fetch(`${GITHUB_CONFIG.API_URL}/gists`, {
            method: 'POST',
            headers: {
                'Authorization': `token ${this.accessToken}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                description,
                public: isPublic,
                files: {
                    'user_data.json': {
                        content: JSON.stringify(content, null, 2)
                    }
                }
            })
        });

        return response.json();
    }

    // تحديث Gist موجود
    async updateGist(gistId, content) {
        if (!this.accessToken) throw new Error('يجب تسجيل الدخول أولاً');

        const response = await fetch(`${GITHUB_CONFIG.API_URL}/gists/${gistId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `token ${this.accessToken}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                files: {
                    'user_data.json': {
                        content: JSON.stringify(content, null, 2)
                    }
                }
            })
        });

        return response.json();
    }

    // جلب Gist
    async getGist(gistId) {
        if (!this.accessToken) throw new Error('يجب تسجيل الدخول أولاً');

        const response = await fetch(`${GITHUB_CONFIG.API_URL}/gists/${gistId}`, {
            headers: {
                'Authorization': `token ${this.accessToken}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        const data = await response.json();
        if (data.files['user_data.json']) {
            return JSON.parse(data.files['user_data.json'].content);
        }
        return null;
    }

    // حذف Gist
    async deleteGist(gistId) {
        if (!this.accessToken) throw new Error('يجب تسجيل الدخول أولاً');

        const response = await fetch(`${GITHUB_CONFIG.API_URL}/gists/${gistId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `token ${this.accessToken}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        return response.status === 204;
    }

    // تسجيل الخروج
    logout() {
        localStorage.removeItem('github_token');
        localStorage.removeItem('github_state');
        this.accessToken = null;
    }
}

export default new GitHubAPI();
