// تهيئة المتغيرات
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const authTabs = document.querySelectorAll('.auth-tab');
const passwordToggles = document.querySelectorAll('.toggle-password');

// تبديل بين نماذج تسجيل الدخول والتسجيل الجديد
authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // إزالة الفئة النشطة من جميع التبويبات والنماذج
        authTabs.forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
        
        // إضافة الفئة النشطة للتبويب المحدد والنموذج المرتبط به
        tab.classList.add('active');
        const formId = tab.dataset.tab + 'Form';
        document.getElementById(formId).classList.add('active');
    });
});

// إظهار/إخفاء كلمة المرور
passwordToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
        const input = e.target.closest('.password-input').querySelector('input');
        const icon = toggle.querySelector('i');
        
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

// معالجة تسجيل الدخول
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    try {
        // هنا يمكن إضافة كود الاتصال بالخادم
        console.log('تسجيل الدخول:', { email, password, rememberMe });
        
        // محاكاة نجاح تسجيل الدخول
        showMessage('تم تسجيل الدخول بنجاح!', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    } catch (error) {
        showMessage('حدث خطأ في تسجيل الدخول', 'error');
    }
});

// معالجة التسجيل الجديد
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        showMessage('كلمات المرور غير متطابقة', 'error');
        return;
    }

    try {
        // هنا يمكن إضافة كود الاتصال بالخادم
        console.log('تسجيل جديد:', { name, email, password });
        
        // محاكاة نجاح التسجيل
        showMessage('تم إنشاء الحساب بنجاح!', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    } catch (error) {
        showMessage('حدث خطأ في إنشاء الحساب', 'error');
    }
});

// دالة لعرض الرسائل
function showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// معالجة تسجيل الدخول بواسطة Google
document.querySelector('.social-btn.google').addEventListener('click', () => {
    // هنا يمكن إضافة كود تسجيل الدخول بواسطة Google
    console.log('تسجيل الدخول بواسطة Google');
});

// معالجة تسجيل الدخول بواسطة Facebook
document.querySelector('.social-btn.facebook').addEventListener('click', () => {
    // هنا يمكن إضافة كود تسجيل الدخول بواسطة Facebook
    console.log('تسجيل الدخول بواسطة Facebook');
});
