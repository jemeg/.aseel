// تكوين Discord Webhook
const DATABASE_WEBHOOK = 'https://discord.com/api/webhooks/1333197916566720594/KPIt4NqVJX7laRjGXGuZKQdimczA5Ff2WzR-ON_lKZGarJjrMUL8S1VlbtS6a63gIs1A';

class Database {
    constructor() {
        this.dbName = 'SouliDB';
        this.dbVersion = 1;
        this.db = null;
        this.initDatabase();
    }

    // تهيئة قاعدة البيانات
    async initDatabase() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = (event) => {
                console.error('Database error:', event.target.error);
                reject(event.target.error);
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                console.log('Database opened successfully');
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // إنشاء جدول المستخدمين
                if (!db.objectStoreNames.contains('users')) {
                    const usersStore = db.createObjectStore('users', { keyPath: 'username' });
                    usersStore.createIndex('email', 'email', { unique: true });
                    usersStore.createIndex('phone', 'phone', { unique: true });
                    usersStore.createIndex('githubId', 'githubId', { unique: true });
                    usersStore.createIndex('fullName', 'fullName', { unique: false });
                }

                // إنشاء جدول الجلسات
                if (!db.objectStoreNames.contains('sessions')) {
                    const sessionsStore = db.createObjectStore('sessions', { keyPath: 'sessionId' });
                    sessionsStore.createIndex('username', 'username', { unique: false });
                    sessionsStore.createIndex('createdAt', 'createdAt', { unique: false });
                }

                // إنشاء جدول المحتوى
                if (!db.objectStoreNames.contains('content')) {
                    const contentStore = db.createObjectStore('content', { keyPath: 'id', autoIncrement: true });
                    contentStore.createIndex('username', 'username', { unique: false });
                    contentStore.createIndex('type', 'type', { unique: false });
                    contentStore.createIndex('createdAt', 'createdAt', { unique: false });
                }
            };
        });
    }

    // إضافة مستخدم جديد
    async addUser(userData) {
        try {
            const transaction = this.db.transaction(['users'], 'readwrite');
            const store = transaction.objectStore('users');

            // إضافة حقول إضافية
            userData.createdAt = new Date().toISOString();
            userData.lastLogin = null;
            userData.status = 'active';
            userData.verifiedEmail = false;

            await this.promisifyRequest(store.add(userData));
            
            // نسخ احتياطي للبيانات في Discord
            await this.backupToDiscord('add_user', userData);
            
            return { success: true, message: 'تم إضافة المستخدم بنجاح' };
        } catch (error) {
            console.error('Error adding user:', error);
            return { success: false, message: error.message };
        }
    }

    // تحديث بيانات المستخدم
    async updateUser(username, updates) {
        try {
            const transaction = this.db.transaction(['users'], 'readwrite');
            const store = transaction.objectStore('users');

            const user = await this.promisifyRequest(store.get(username));
            if (!user) {
                throw new Error('المستخدم غير موجود');
            }

            const updatedUser = { ...user, ...updates, updatedAt: new Date().toISOString() };
            await this.promisifyRequest(store.put(updatedUser));
            
            // نسخ احتياطي للتحديثات في Discord
            await this.backupToDiscord('update_user', updatedUser);
            
            return { success: true, message: 'تم تحديث البيانات بنجاح' };
        } catch (error) {
            console.error('Error updating user:', error);
            return { success: false, message: error.message };
        }
    }

    // التحقق من وجود اسم المستخدم
    async checkUsername(username) {
        try {
            const transaction = this.db.transaction(['users'], 'readonly');
            const store = transaction.objectStore('users');
            const user = await this.promisifyRequest(store.get(username));
            return !!user;
        } catch (error) {
            console.error('Error checking username:', error);
            return false;
        }
    }

    // التحقق من وجود البريد الإلكتروني
    async checkEmail(email) {
        try {
            const transaction = this.db.transaction(['users'], 'readonly');
            const store = transaction.objectStore('users');
            const index = store.index('email');
            const user = await this.promisifyRequest(index.get(email));
            return !!user;
        } catch (error) {
            console.error('Error checking email:', error);
            return false;
        }
    }

    // التحقق من وجود رقم الهاتف
    async checkPhone(phone) {
        try {
            const transaction = this.db.transaction(['users'], 'readonly');
            const store = transaction.objectStore('users');
            const index = store.index('phone');
            const user = await this.promisifyRequest(index.get(phone));
            return !!user;
        } catch (error) {
            console.error('Error checking phone:', error);
            return false;
        }
    }

    // تسجيل الدخول باسم المستخدم
    async login(username, password) {
        try {
            const transaction = this.db.transaction(['users', 'sessions'], 'readwrite');
            const usersStore = transaction.objectStore('users');
            const sessionsStore = transaction.objectStore('sessions');

            const user = await this.promisifyRequest(usersStore.get(username));
            
            if (!user || user.password !== password) {
                throw new Error('اسم المستخدم أو كلمة المرور غير صحيحة');
            }

            // إنشاء جلسة جديدة
            const sessionId = this.generateSessionId();
            const session = {
                sessionId,
                username: user.username,
                createdAt: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 ساعة
            };

            await this.promisifyRequest(sessionsStore.add(session));
            
            // تحديث آخر تسجيل دخول
            await this.updateUser(username, { lastLogin: new Date().toISOString() });
            
            // نسخ احتياطي لبيانات الجلسة في Discord
            await this.backupToDiscord('new_session', session);
            
            return { 
                success: true, 
                message: 'تم تسجيل الدخول بنجاح',
                sessionId,
                user: {
                    username: user.username,
                    fullName: user.fullName,
                    email: user.email,
                    phone: user.phone
                }
            };
        } catch (error) {
            console.error('Error during login:', error);
            return { success: false, message: error.message };
        }
    }

    // تسجيل الخروج
    async logout(sessionId) {
        try {
            const transaction = this.db.transaction(['sessions'], 'readwrite');
            const store = transaction.objectStore('sessions');
            
            await this.promisifyRequest(store.delete(sessionId));
            await this.backupToDiscord('logout', { sessionId });
            
            return { success: true, message: 'تم تسجيل الخروج بنجاح' };
        } catch (error) {
            console.error('Error during logout:', error);
            return { success: false, message: error.message };
        }
    }

    // إضافة محتوى
    async addContent(content) {
        try {
            const transaction = this.db.transaction(['content'], 'readwrite');
            const store = transaction.objectStore('content');

            content.createdAt = new Date().toISOString();
            const result = await this.promisifyRequest(store.add(content));
            
            // نسخ احتياطي للمحتوى في Discord
            await this.backupToDiscord('add_content', { ...content, id: result });
            
            return { success: true, message: 'تم إضافة المحتوى بنجاح', contentId: result };
        } catch (error) {
            console.error('Error adding content:', error);
            return { success: false, message: error.message };
        }
    }

    // إضافة أو تحديث مستخدم GitHub
    async addOrUpdateGitHubUser(userData) {
        try {
            const transaction = this.db.transaction(['users', 'sessions'], 'readwrite');
            const usersStore = transaction.objectStore('users');
            const sessionsStore = transaction.objectStore('sessions');

            // التحقق من وجود المستخدم
            const existingUser = await this.promisifyRequest(usersStore.get(userData.username));

            if (existingUser) {
                // تحديث بيانات المستخدم الموجود
                const updatedUser = { ...existingUser, ...userData };
                await this.promisifyRequest(usersStore.put(updatedUser));
            } else {
                // إضافة مستخدم جديد
                await this.promisifyRequest(usersStore.add(userData));
            }

            // إنشاء جلسة جديدة
            const sessionId = this.generateSessionId();
            const session = {
                sessionId,
                username: userData.username,
                createdAt: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                isGitHub: true
            };

            await this.promisifyRequest(sessionsStore.add(session));
            
            // نسخ احتياطي للبيانات في Discord
            await this.backupToDiscord('github_user_sync', {
                username: userData.username,
                githubId: userData.githubId,
                gistId: userData.gistId
            });

            return {
                success: true,
                message: 'تم تسجيل الدخول باستخدام GitHub بنجاح',
                sessionId,
                user: {
                    username: userData.username,
                    fullName: userData.fullName,
                    email: userData.email,
                    avatarUrl: userData.avatarUrl,
                    githubId: userData.githubId
                }
            };
        } catch (error) {
            console.error('Error adding/updating GitHub user:', error);
            return { success: false, message: error.message };
        }
    }

    // التحقق من وجود مستخدم GitHub
    async checkGitHubUser(githubId) {
        try {
            const transaction = this.db.transaction(['users'], 'readonly');
            const store = transaction.objectStore('users');
            const index = store.index('githubId');
            const user = await this.promisifyRequest(index.get(githubId));
            return !!user;
        } catch (error) {
            console.error('Error checking GitHub user:', error);
            return false;
        }
    }

    // تحويل طلبات IndexedDB إلى Promises
    promisifyRequest(request) {
        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // إنشاء معرف جلسة فريد
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // نسخ احتياطي للبيانات في Discord
    async backupToDiscord(action, data) {
        try {
            const backupData = {
                action,
                data,
                timestamp: new Date().toISOString(),
                environment: {
                    userAgent: navigator.userAgent,
                    platform: navigator.platform
                }
            };

            const response = await fetch(DATABASE_WEBHOOK, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: '```json\n' + JSON.stringify(backupData, null, 2) + '\n```'
                })
            });

            if (!response.ok) {
                throw new Error(`Discord API error: ${response.status}`);
            }
        } catch (error) {
            console.error('Backup to Discord failed:', error);
            // نستمر في التنفيذ حتى لو فشل النسخ الاحتياطي
        }
    }
}

// تصدير كائن قاعدة البيانات
const db = new Database();
export default db;
