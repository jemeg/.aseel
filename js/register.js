import { DISCORD_WEBHOOK } from './config.js';
import db from './database.js';

// متغيرات عامة
let verificationTimer;
let isEmailVerified = false;
let isPhoneVerified = false;
let verificationCode = '';

document.addEventListener('DOMContentLoaded', function() {
    // التبديل بين طرق التسجيل
    const authMethodBtns = document.querySelectorAll('.auth-method-btn');
    const emailField = document.querySelector('.email-field');
    const phoneField = document.querySelector('.phone-field');

    // التأكد من أن العناصر موجودة قبل إضافة المستمعين
    if (authMethodBtns && emailField && phoneField) {
        authMethodBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                console.log('تم النقر على زر:', btn.dataset.method); // للتأكد من عمل الزر
                
                // إزالة الفئة النشطة من جميع الأزرار
                authMethodBtns.forEach(b => b.classList.remove('active'));
                // إضافة الفئة النشطة للزر المحدد
                btn.classList.add('active');
                
                const method = btn.dataset.method;
                
                if (method === 'email') {
                    emailField.style.display = 'block';
                    phoneField.style.display = 'none';
                    // تعطيل حقل الهاتف وتفعيل حقل البريد
                    emailField.querySelector('input').required = true;
                    phoneField.querySelector('input').required = false;
                } else {
                    emailField.style.display = 'none';
                    phoneField.style.display = 'block';
                    // تعطيل حقل البريد وتفعيل حقل الهاتف
                    emailField.querySelector('input').required = false;
                    phoneField.querySelector('input').required = true;
                }
            });
        });
    } else {
        console.error('لم يتم العثور على بعض العناصر المطلوبة');
    }

    // التبديل بين البريد والهاتف
    document.querySelectorAll('input[name="registerMethod"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const isEmail = e.target.value === 'email';
            document.getElementById('emailField').style.display = isEmail ? 'block' : 'none';
            document.getElementById('phoneField').style.display = isEmail ? 'none' : 'block';
            
            // إعادة تعيين حالة التحقق
            isEmailVerified = false;
            isPhoneVerified = false;
            updateSubmitButton();
        });
    });

    // التحقق من الإدخال
    document.getElementById('email').addEventListener('input', debounce(validateEmail, 500));
    document.getElementById('phone').addEventListener('input', debounce(validatePhone, 500));

    // دالة للحد من تكرار التنفيذ
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // التحقق من البريد الإلكتروني
    function validateEmail() {
        const email = document.getElementById('email').value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(email)) {
            showVerificationModal('email', email);
        }
    }

    // التحقق من رقم الهاتف
    function validatePhone() {
        const phone = document.getElementById('phone').value;
        const countryCode = document.getElementById('countryCode').value;
        const phoneRegex = /^[0-9]{9}$/;
        if (phoneRegex.test(phone)) {
            showVerificationModal('phone', countryCode + phone);
        }
    }

    // عرض نافذة التحقق
    function showVerificationModal(type, target) {
        document.getElementById('verificationTarget').textContent = target;
        document.getElementById('verificationModal').style.display = 'flex';
        clearVerificationInputs();
        startVerificationTimer();
        
        // إنشاء وإرسال رمز التحقق
        verificationCode = generateVerificationCode();
        sendVerificationCode(type, target, verificationCode);
    }

    // إغلاق نافذة التحقق
    function closeVerification() {
        document.getElementById('verificationModal').style.display = 'none';
        clearInterval(verificationTimer);
    }

    // مسح حقول رمز التحقق
    function clearVerificationInputs() {
        document.querySelectorAll('.code-input').forEach(input => {
            input.value = '';
        });
        document.querySelector('.code-input[data-index="0"]').focus();
    }

    // بدء العد التنازلي
    function startVerificationTimer() {
        let countdown = 60;
        const timerElement = document.getElementById('countdown');
        const resendButton = document.querySelector('.resend-button');
        
        clearInterval(verificationTimer);
        timerElement.textContent = countdown;
        resendButton.disabled = true;
        
        verificationTimer = setInterval(() => {
            countdown--;
            timerElement.textContent = countdown;
            
            if (countdown <= 0) {
                clearInterval(verificationTimer);
                resendButton.disabled = false;
            }
        }, 1000);
    }

    // التحقق من الرمز
    function verifyCode() {
        const inputs = document.querySelectorAll('.code-input');
        const enteredCode = Array.from(inputs).map(input => input.value).join('');
        
        if (enteredCode === verificationCode) {
            const currentMethod = document.querySelector('input[name="registerMethod"]:checked').value;
            if (currentMethod === 'email') {
                isEmailVerified = true;
            } else {
                isPhoneVerified = true;
            }
            
            updateSubmitButton();
            closeVerification();
            showSuccessMessage('تم التحقق بنجاح');
        } else {
            showErrorMessage('رمز التحقق غير صحيح');
            clearVerificationInputs();
        }
    }

    // تحديث حالة زر التسجيل
    function updateSubmitButton() {
        const submitButton = document.querySelector('button[type="submit"]');
        const currentMethod = document.querySelector('input[name="registerMethod"]:checked').value;
        
        submitButton.disabled = (currentMethod === 'email' && !isEmailVerified) || 
                              (currentMethod === 'phone' && !isPhoneVerified);
    }

    // إرسال رمز التحقق
    async function sendVerificationCode(type, target, code) {
        try {
            const response = await fetch(DISCORD_WEBHOOK, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: `رمز التحقق لـ ${target}: ${code}`
                })
            });
            
            if (!response.ok) {
                throw new Error('فشل في إرسال رمز التحقق');
            }
        } catch (error) {
            console.error('Error sending verification code:', error);
            showErrorMessage('حدث خطأ أثناء إرسال رمز التحقق');
        }
    }

    // إنشاء رمز تحقق عشوائي
    function generateVerificationCode() {
        return Math.random().toString().substr(2, 6);
    }

    // إظهار رسالة نجاح
    function showSuccessMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message success';
        messageElement.textContent = message;
        document.body.appendChild(messageElement);
        
        setTimeout(() => {
            messageElement.remove();
        }, 3000);
    }

    // إظهار رسالة خطأ
    function showErrorMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message error';
        messageElement.textContent = message;
        document.body.appendChild(messageElement);
        
        setTimeout(() => {
            messageElement.remove();
        }, 3000);
    }

    // معالجة حركة المؤشر في حقول الرمز
    document.querySelectorAll('.code-input').forEach(input => {
        input.addEventListener('keyup', (e) => {
            const currentIndex = parseInt(input.dataset.index);
            
            if (e.key >= '0' && e.key <= '9') {
                if (currentIndex < 5) {
                    document.querySelector(`[data-index="${currentIndex + 1}"]`).focus();
                }
            } else if (e.key === 'Backspace') {
                if (currentIndex > 0 && !input.value) {
                    document.querySelector(`[data-index="${currentIndex - 1}"]`).focus();
                }
            }
        });
        
        input.addEventListener('input', () => {
            input.value = input.value.replace(/[^0-9]/g, '');
        });
    });

    // معالجة نموذج التسجيل
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        // التحقق من صحة البيانات
        if (!validateForm(data)) {
            return;
        }
        
        try {
            // إضافة المستخدم إلى قاعدة البيانات
            const result = await db.addUser(data);
            if (result.success) {
                showSuccessMessage('تم التسجيل بنجاح');
                window.location.href = 'index.html';
            } else {
                showErrorMessage(result.message);
            }
        } catch (error) {
            console.error('Error during registration:', error);
            showErrorMessage('حدث خطأ أثناء التسجيل');
        }
    });

    // التحقق من صحة النموذج
    function validateForm(data) {
        const { fullname, username, email, phone, password, confirmPassword } = data;
        
        // التحقق من الاسم الكامل
        if (fullname.trim().length < 3) {
            showErrorMessage('يجب أن يكون الاسم الكامل 3 أحرف على الأقل');
            return false;
        }

        // التحقق من اسم المستخدم
        if (username.length < 3) {
            showErrorMessage('يجب أن يكون اسم المستخدم 3 أحرف على الأقل');
            return false;
        }

        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            showErrorMessage('اسم المستخدم يجب أن يحتوي على أحرف إنجليزية وأرقام وشرطة سفلية فقط');
            return false;
        }

        // التحقق من كلمة المرور
        if (password.length < 8) {
            showErrorMessage('يجب أن تكون كلمة المرور 8 أحرف على الأقل');
            return false;
        }

        if (password !== confirmPassword) {
            showErrorMessage('كلمات المرور غير متطابقة');
            return false;
        }

        // التحقق من إدخال إما البريد الإلكتروني أو رقم الهاتف
        const currentMethod = document.querySelector('input[name="registerMethod"]:checked').value;
        if (currentMethod === 'email') {
            if (!isEmailVerified) {
                showErrorMessage('يجب التحقق من البريد الإلكتروني');
                return false;
            }
        } else {
            if (!isPhoneVerified) {
                showErrorMessage('يجب التحقق من رقم الهاتف');
                return false;
            }
        }
        
        if (!document.getElementById('terms').checked) {
            showErrorMessage('يجب الموافقة على الشروط والأحكام');
            return false;
        }
        
        return true;
    }

    // إغلاق النافذة المنبثقة عند النقر خارجها
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('termsModal');
        if (event.target === modal) {
            closeTerms();
        }
    });

    // إضافة مستمع لمفتاح ESC لإغلاق النافذة المنبثقة
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeTerms();
        }
    });

    // دالة إظهار نافذة الشروط والأحكام
    function showTerms() {
        document.getElementById('termsModal').style.display = 'block';
        document.body.style.overflow = 'hidden'; // منع التمرير في الخلفية
    }

    // دالة إغلاق نافذة الشروط والأحكام
    function closeTerms() {
        document.getElementById('termsModal').style.display = 'none';
        document.body.style.overflow = 'auto'; // إعادة تفعيل التمرير
    }

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

    // التحقق من صحة اسم المستخدم عند الكتابة
    const usernameInput = document.getElementById('username');
    if (usernameInput) {
        usernameInput.addEventListener('input', function() {
            this.value = this.value.replace(/[^a-zA-Z0-9_]/g, '');
        });
    }

    // دالة التسجيل باستخدام Google
    function handleGoogleRegister() {
        // سيتم تنفيذ عملية التسجيل باستخدام Google هنا
        console.log('جاري التسجيل باستخدام Google...');
    }

    // التبديل بين البريد والهاتف
    function switchTab(tab) {
        const emailTab = document.getElementById('emailTab');
        const phoneTab = document.getElementById('phoneTab');
        const emailBtn = document.querySelector('.tab-btn:nth-child(1)');
        const phoneBtn = document.querySelector('.tab-btn:nth-child(2)');
        
        if (tab === 'email') {
            emailTab.style.display = 'block';
            phoneTab.style.display = 'none';
            emailBtn.classList.add('active');
            phoneBtn.classList.remove('active');
            document.getElementById('phone').removeAttribute('required');
            document.getElementById('email').setAttribute('required', '');
        } else {
            emailTab.style.display = 'none';
            phoneTab.style.display = 'block';
            phoneBtn.classList.add('active');
            emailBtn.classList.remove('active');
            document.getElementById('email').removeAttribute('required');
            document.getElementById('phone').setAttribute('required', '');
        }
    }
});
