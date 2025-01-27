import { GOOGLE_CLIENT_ID } from './config.js';

// تهيئة Google API
let auth2;

export function initGoogleAuth() {
    return new Promise((resolve, reject) => {
        gapi.load('auth2', () => {
            gapi.auth2.init({
                client_id: GOOGLE_CLIENT_ID,
                prompt: 'select_account' // إضافة خيار اختيار الحساب
            }).then(authInstance => {
                auth2 = authInstance;
                resolve(auth2);
            }).catch(error => {
                console.error('Error initializing Google Auth:', error);
                reject(error);
            });
        });
    });
}

// تسجيل الدخول باستخدام Google
export function signInWithGoogle() {
    if (!auth2) {
        console.error('Google Auth not initialized');
        return Promise.reject(new Error('Google Auth not initialized'));
    }

    const options = {
        prompt: 'select_account' // إظهار نافذة اختيار الحساب دائماً
    };

    return auth2.signIn(options)
        .then(googleUser => {
            const profile = googleUser.getBasicProfile();
            const userData = {
                googleId: profile.getId(),
                email: profile.getEmail(),
                name: profile.getName(),
                imageUrl: profile.getImageUrl(),
                token: googleUser.getAuthResponse().id_token
            };
            return userData;
        })
        .catch(error => {
            console.error('Error signing in with Google:', error);
            throw error;
        });
}

// تسجيل الخروج
export function signOut() {
    if (!auth2) {
        console.error('Google Auth not initialized');
        return Promise.reject(new Error('Google Auth not initialized'));
    }

    return auth2.signOut()
        .then(() => {
            console.log('User signed out.');
        })
        .catch(error => {
            console.error('Error signing out:', error);
            throw error;
        });
}

// التحقق من حالة تسجيل الدخول
export function checkSignInStatus() {
    if (!auth2) {
        console.error('Google Auth not initialized');
        return Promise.reject(new Error('Google Auth not initialized'));
    }

    const isSignedIn = auth2.isSignedIn.get();
    if (isSignedIn) {
        const googleUser = auth2.currentUser.get();
        const profile = googleUser.getBasicProfile();
        return {
            isSignedIn: true,
            userData: {
                googleId: profile.getId(),
                email: profile.getEmail(),
                name: profile.getName(),
                imageUrl: profile.getImageUrl(),
                token: googleUser.getAuthResponse().id_token
            }
        };
    }

    return { isSignedIn: false };
}
