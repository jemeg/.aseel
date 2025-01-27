// استيراد قاعدة البيانات
import db from './database.js';

// معالجة تسجيل الدخول
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const terms = document.getElementById('terms').checked;
    
    if (!terms) {
        showMessage('يجب الموافقة على الشروط والأحكام أولاً', 'error');
        return;
    }
    
    try {
        const result = await db.login(email, password);
        
        if (result.success) {
            // حفظ معرف الجلسة في localStorage
            localStorage.setItem('sessionId', result.sessionId);
            localStorage.setItem('userData', JSON.stringify(result.user));
            
            showMessage('تم تسجيل الدخول بنجاح! جاري تحويلك للصفحة الرئيسية...', 'success');
            
            // تحويل المستخدم إلى الصفحة الرئيسية
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            showMessage(result.message, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('حدث خطأ أثناء تسجيل الدخول', 'error');
    }
});

// عرض نافذة الشروط والأحكام
function showTerms() {
    const modal = document.getElementById('termsModal');
    modal.style.display = 'flex';
}

// إغلاق النافذة المنبثقة
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
}

// الموافقة على الشروط والأحكام
function acceptTerms() {
    const termsCheckbox = document.getElementById('terms');
    termsCheckbox.checked = true;
    closeModal('termsModal');
}

// عرض نموذج التسجيل
function showRegistration() {
    window.location.href = 'register.html';
}

// إظهار رسائل للمستخدم
function showMessage(text, type = 'info') {
    const messageContainer = document.createElement('div');
    messageContainer.className = `message ${type}`;
    messageContainer.textContent = text;
    
    document.body.appendChild(messageContainer);
    
    setTimeout(() => {
        messageContainer.remove();
    }, 3000);
}

// التحقق من وجود جلسة نشطة عند تحميل الصفحة
window.addEventListener('load', async () => {
    const sessionId = localStorage.getItem('sessionId');
    if (sessionId) {
        window.location.href = 'index.html';
    }
});

// إغلاق النافذة المنبثقة عند النقر خارجها
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', function() {
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

    // إضافة مستمع الحدث لنموذج تسجيل الدخول
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }
});

function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;

    // التحقق من إدخال البيانات
    if (!username) {
        alert('يرجى إدخال اسم المستخدم');
        return;
    }

    if (!password) {
        alert('يرجى إدخال كلمة المرور');
        return;
    }

    // هنا يمكنك إضافة التحقق من صحة بيانات تسجيل الدخول
    // مثال بسيط للتوضيح
    if (validateCredentials(username, password)) {
        if (remember) {
            // حفظ بيانات تسجيل الدخول إذا تم اختيار "تذكرني"
            localStorage.setItem('rememberedUser', username);
        }

        // عرض رسالة نجاح وتوجيه المستخدم إلى الصفحة الرئيسية
        alert('تم تسجيل الدخول بنجاح!');
        window.location.href = 'index.html';
    } else {
        alert('اسم المستخدم أو كلمة المرور غير صحيحة');
    }
}

function validateCredentials(username, password) {
    // هنا يمكنك إضافة التحقق الفعلي من قاعدة البيانات
    // هذا مجرد مثال للتوضيح
    return true;
}

function showForgotPassword() {
    alert('سيتم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني');
}

function handleGoogleLogin() {
    // تنفيذ تسجيل الدخول باستخدام Google
    console.log('جاري تسجيل الدخول باستخدام Google...');
    // بعد نجاح تسجيل الدخول
    window.location.href = 'index.html';
}
