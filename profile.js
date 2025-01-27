document.addEventListener('DOMContentLoaded', function() {
    // إضافة مستمع الحدث لأيقونة القائمة
    const menuIcon = document.querySelector('.menu-icon');
    const navMenu = document.querySelector('nav ul');
    
    menuIcon.addEventListener('click', function() {
        navMenu.classList.toggle('show');
        menuIcon.classList.toggle('active');
    });

    // إغلاق القائمة عند النقر خارجها
    document.addEventListener('click', function(event) {
        if (!event.target.closest('nav')) {
            navMenu.classList.remove('show');
            menuIcon.classList.remove('active');
        }
    });

    // تحميل بيانات المستخدم
    loadUserProfile();

    // إضافة مستمعي الأحداث للنماذج
    document.getElementById('personalInfoForm').addEventListener('submit', handlePersonalInfoSubmit);
    document.getElementById('securityForm').addEventListener('submit', handleSecuritySubmit);
    document.getElementById('settingsForm').addEventListener('change', handleSettingsChange);
    document.getElementById('avatarInput').addEventListener('change', handleAvatarChange);

    // إضافة مستمعي الأحداث لأزرار إظهار/إخفاء كلمة المرور
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
});

// تحميل بيانات المستخدم
function loadUserProfile() {
    // في الواقع، هذه البيانات ستأتي من الخادم
    const userData = {
        fullname: 'أحمد محمد',
        username: 'ahmed_m',
        email: 'ahmed@example.com',
        phone: '0123456789',
        bio: 'مرحباً، أنا أحمد. أحب مشاركة تجاربي وخبراتي مع الآخرين.',
        stats: {
            posts: 25,
            comments: 142,
            followers: 15
        }
    };

    // تحديث معلومات العرض
    document.getElementById('userDisplayName').textContent = userData.fullname;
    document.getElementById('fullname').value = userData.fullname;
    document.getElementById('username').value = userData.username;
    document.getElementById('email').value = userData.email;
    document.getElementById('phone').value = userData.phone;
    document.getElementById('bio').value = userData.bio;
}

// معالجة تغيير الصورة الشخصية
function handleAvatarChange(event) {
    const file = event.target.files[0];
    if (file) {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('profileImage').src = e.target.result;
                // هنا يمكنك رفع الصورة إلى الخادم
                showNotification('تم تحديث الصورة الشخصية بنجاح');
            };
            reader.readAsDataURL(file);
        } else {
            showNotification('الرجاء اختيار ملف صورة صالح', 'error');
        }
    }
}

// معالجة تحديث المعلومات الشخصية
function handlePersonalInfoSubmit(event) {
    event.preventDefault();
    
    const formData = {
        fullname: document.getElementById('fullname').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        bio: document.getElementById('bio').value
    };

    if (validatePersonalInfo(formData)) {
        // هنا يمكنك إرسال البيانات إلى الخادم
        showNotification('تم تحديث المعلومات الشخصية بنجاح');
    }
}

// معالجة تحديث كلمة المرور
function handleSecuritySubmit(event) {
    event.preventDefault();

    const formData = {
        currentPassword: document.getElementById('currentPassword').value,
        newPassword: document.getElementById('newPassword').value,
        confirmNewPassword: document.getElementById('confirmNewPassword').value
    };

    if (validatePasswordChange(formData)) {
        // هنا يمكنك إرسال البيانات إلى الخادم
        showNotification('تم تحديث كلمة المرور بنجاح');
        document.getElementById('securityForm').reset();
    }
}

// معالجة تغيير الإعدادات
function handleSettingsChange(event) {
    const setting = event.target;
    const settingName = setting.closest('.setting-item').querySelector('span').textContent;
    const isEnabled = setting.checked;

    // هنا يمكنك حفظ الإعدادات في الخادم
    showNotification(`تم تحديث إعداد ${settingName}`);
}

// التحقق من صحة المعلومات الشخصية
function validatePersonalInfo(data) {
    if (data.fullname.trim().length < 3) {
        showNotification('يجب أن يكون الاسم الكامل 3 أحرف على الأقل', 'error');
        return false;
    }

    if (!isValidEmail(data.email)) {
        showNotification('البريد الإلكتروني غير صالح', 'error');
        return false;
    }

    return true;
}

// التحقق من صحة تغيير كلمة المرور
function validatePasswordChange(data) {
    if (!data.currentPassword) {
        showNotification('يرجى إدخال كلمة المرور الحالية', 'error');
        return false;
    }

    if (data.newPassword.length < 8) {
        showNotification('يجب أن تكون كلمة المرور الجديدة 8 أحرف على الأقل', 'error');
        return false;
    }

    if (data.newPassword !== data.confirmNewPassword) {
        showNotification('كلمات المرور الجديدة غير متطابقة', 'error');
        return false;
    }

    return true;
}

// التحقق من صحة البريد الإلكتروني
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// عرض الإشعارات
function showNotification(message, type = 'success') {
    // يمكنك استخدام مكتبة للإشعارات أو إنشاء واحدة خاصة بك
    alert(message);
}

// تسجيل الخروج
function logout() {
    // هنا يمكنك تنفيذ عملية تسجيل الخروج
    window.location.href = 'login.html';
}
