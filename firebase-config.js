// تكوين Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAjeulOb7WkBrIOfBQEmtZwYT6mJDfbKeo",
    authDomain: "aseel-39ed8.firebaseapp.com",
    projectId: "aseel-39ed8",
    storageBucket: "aseel-39ed8.firebasestorage.app",
    messagingSenderId: "795587792082",
    appId: "1:795587792082:web:c2c20183f78394a35e710b",
    measurementId: "G-CZ9X60Z8F3"
};

// تهيئة Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
const analytics = firebase.analytics();

// دالة لإضافة مستخدم جديد
async function addUser(userData) {
    try {
        const docRef = await db.collection('users').add({
            name: userData.name,
            age: userData.age,
            city: userData.city,
            status: userData.status,
            bio: userData.bio,
            interests: userData.interests,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        console.log("تم إضافة المستخدم بنجاح مع المعرف:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("خطأ في إضافة المستخدم:", error);
        throw error;
    }
}

// دالة لتحديث بيانات المستخدم
async function updateUser(userId, userData) {
    try {
        await db.collection('users').doc(userId).update({
            ...userData,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        console.log("تم تحديث بيانات المستخدم بنجاح");
    } catch (error) {
        console.error("خطأ في تحديث بيانات المستخدم:", error);
        throw error;
    }
}

// دالة لرفع صورة
async function uploadImage(file, userId, type = 'profile') {
    try {
        const storageRef = storage.ref();
        const fileRef = storageRef.child(`users/${userId}/${type}/${file.name}`);
        await fileRef.put(file);
        const url = await fileRef.getDownloadURL();
        return url;
    } catch (error) {
        console.error("خطأ في رفع الصورة:", error);
        throw error;
    }
}

// دالة للبحث عن المستخدمين
async function searchUsers(filters) {
    try {
        let query = db.collection('users');

        if (filters.city) {
            query = query.where('city', '==', filters.city);
        }
        if (filters.status) {
            query = query.where('status', '==', filters.status);
        }
        if (filters.minAge) {
            query = query.where('age', '>=', parseInt(filters.minAge));
        }
        if (filters.maxAge) {
            query = query.where('age', '<=', parseInt(filters.maxAge));
        }

        const snapshot = await query.get();
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("خطأ في البحث عن المستخدمين:", error);
        throw error;
    }
}

// دالة اختبار لفحص Firebase
async function testFirebase() {
    try {
        console.log('بدء اختبار Firebase...');

        // 1. إضافة مستخدم جديد
        const testUser = {
            name: "أحمد محمد",
            age: 28,
            city: "طرابلس",
            status: "أعزب",
            bio: "مهندس برمجيات، أحب القراءة والسفر",
            interests: ["البرمجة", "السفر", "القراءة"]
        };

        console.log('جاري إضافة مستخدم تجريبي...');
        const userId = await addUser(testUser);
        console.log('تم إضافة المستخدم بنجاح:', userId);

        // 2. البحث عن المستخدم
        console.log('جاري البحث عن المستخدم...');
        const searchResults = await searchUsers({
            city: "طرابلس",
            status: "أعزب",
            minAge: 25,
            maxAge: 30
        });
        console.log('نتائج البحث:', searchResults);

        // 3. تحديث بيانات المستخدم
        console.log('جاري تحديث بيانات المستخدم...');
        await updateUser(userId, {
            bio: "مهندس برمجيات، أحب القراءة والسفر والتصوير",
            interests: [...testUser.interests, "التصوير"]
        });
        console.log('تم تحديث البيانات بنجاح');

        // 4. التحقق من التحديث
        const updatedResults = await db.collection('users').doc(userId).get();
        console.log('البيانات المحدثة:', updatedResults.data());

        console.log('تم اكتمال الاختبار بنجاح!');
        return true;
    } catch (error) {
        console.error('حدث خطأ أثناء الاختبار:', error);
        return false;
    }
}

// دالة لمراقبة تغييرات مستخدم معين
function watchUserChanges(userId, callback) {
    return db.collection('users').doc(userId)
        .onSnapshot((doc) => {
            if (doc.exists) {
                callback({
                    id: doc.id,
                    ...doc.data()
                });
            }
        }, (error) => {
            console.error("خطأ في مراقبة تغييرات المستخدم:", error);
        });
}

// دالة لمراقبة تغييرات جميع المستخدمين
function watchAllUsers(callback) {
    return db.collection('users')
        .onSnapshot((snapshot) => {
            const users = [];
            snapshot.forEach((doc) => {
                users.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            callback(users);
        }, (error) => {
            console.error("خطأ في مراقبة تغييرات المستخدمين:", error);
        });
}

// دالة لمراقبة نتائج البحث
function watchFilteredUsers(filters, callback) {
    let query = db.collection('users');

    if (filters.city) {
        query = query.where('city', '==', filters.city);
    }
    if (filters.status) {
        query = query.where('status', '==', filters.status);
    }
    if (filters.minAge) {
        query = query.where('age', '>=', parseInt(filters.minAge));
    }
    if (filters.maxAge) {
        query = query.where('age', '<=', parseInt(filters.maxAge));
    }

    return query.onSnapshot((snapshot) => {
        const users = [];
        snapshot.forEach((doc) => {
            users.push({
                id: doc.id,
                ...doc.data()
            });
        });
        callback(users);
    }, (error) => {
        console.error("خطأ في مراقبة نتائج البحث:", error);
    });
}

// تصدير الدوال
window.firebaseApp = {
    db,
    auth,
    storage,
    addUser,
    updateUser,
    uploadImage,
    searchUsers,
    testFirebase,
    watchUserChanges,
    watchAllUsers,
    watchFilteredUsers
};
