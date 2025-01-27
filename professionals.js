// تهيئة المتغيرات
const searchInput = document.querySelector('.search-experts input');
const searchSelect = document.querySelector('.search-experts select');
const searchBtn = document.querySelector('.search-experts .btn');
const expertsGrid = document.querySelector('.experts-grid');
const experts = document.querySelectorAll('.expert-card');

// البحث عن المستشارين
searchBtn.addEventListener('click', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const specialty = searchSelect.value;
    
    filterExperts(searchTerm, specialty);
});

// البحث المباشر
searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const specialty = searchSelect.value;
    
    filterExperts(searchTerm, specialty);
});

// تصفية حسب التخصص
searchSelect.addEventListener('change', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const specialty = searchSelect.value;
    
    filterExperts(searchTerm, specialty);
});

// تصفية المستشارين
function filterExperts(searchTerm, specialty) {
    experts.forEach(expert => {
        const name = expert.querySelector('h3').textContent.toLowerCase();
        const title = expert.querySelector('.expert-title').textContent.toLowerCase();
        const bio = expert.querySelector('.expert-bio').textContent.toLowerCase();
        
        const matchesSearch = name.includes(searchTerm) || 
                            title.includes(searchTerm) || 
                            bio.includes(searchTerm);
        
        const matchesSpecialty = !specialty || title.includes(specialty);
        
        if (matchesSearch && matchesSpecialty) {
            expert.style.display = 'block';
        } else {
            expert.style.display = 'none';
        }
    });
}

// حجز استشارة
document.querySelectorAll('.expert-card .btn-primary').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const expertCard = e.target.closest('.expert-card');
        const expertName = expertCard.querySelector('h3').textContent;
        showBookingModal(expertName);
    });
});

// عرض نافذة الحجز
function showBookingModal(expertName) {
    const modal = document.createElement('div');
    modal.className = 'modal booking-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>حجز استشارة مع ${expertName}</h3>
            <form id="booking-form">
                <div class="form-group">
                    <label>نوع الاستشارة</label>
                    <select required>
                        <option value="">اختر نوع الاستشارة</option>
                        <option value="video">استشارة مرئية</option>
                        <option value="chat">محادثة كتابية</option>
                        <option value="workshop">ورشة عمل</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>التاريخ</label>
                    <input type="date" required min="${new Date().toISOString().split('T')[0]}">
                </div>
                <div class="form-group">
                    <label>الوقت</label>
                    <select required>
                        <option value="">اختر الوقت المناسب</option>
                        <option value="09:00">09:00 صباحاً</option>
                        <option value="11:00">11:00 صباحاً</option>
                        <option value="14:00">02:00 مساءً</option>
                        <option value="16:00">04:00 مساءً</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>ملاحظات إضافية</label>
                    <textarea placeholder="اكتب أي ملاحظات أو استفسارات..."></textarea>
                </div>
                <button type="submit" class="btn btn-primary">تأكيد الحجز</button>
            </form>
            <button class="btn btn-secondary" onclick="closeModal()">إغلاق</button>
        </div>
    `;
    document.body.appendChild(modal);
    
    // معالجة نموذج الحجز
    modal.querySelector('form').addEventListener('submit', (e) => {
        e.preventDefault();
        // هنا يتم إرسال بيانات الحجز للخادم
        showMessage('تم تأكيد حجزك بنجاح! سنرسل لك تفاصيل الموعد عبر البريد الإلكتروني.');
        closeModal();
    });
}

// معرفة المزيد عن الخدمات
document.querySelectorAll('.service-card .btn-secondary').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const serviceCard = e.target.closest('.service-card');
        const serviceTitle = serviceCard.querySelector('h3').textContent;
        showServiceDetails(serviceTitle);
    });
});

// عرض تفاصيل الخدمة
function showServiceDetails(serviceTitle) {
    const modal = document.createElement('div');
    modal.className = 'modal service-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>${serviceTitle}</h3>
            <div class="service-details">
                <h4>وصف الخدمة</h4>
                <p>وصف تفصيلي للخدمة وكيفية الاستفادة منها...</p>
                
                <h4>المميزات</h4>
                <ul>
                    <li>ميزة 1</li>
                    <li>ميزة 2</li>
                    <li>ميزة 3</li>
                </ul>
                
                <h4>الأسعار</h4>
                <p>تفاصيل الأسعار والباقات المتاحة...</p>
            </div>
            <button class="btn btn-primary">احجز الآن</button>
            <button class="btn btn-secondary" onclick="closeModal()">إغلاق</button>
        </div>
    `;
    document.body.appendChild(modal);
}

// الاشتراك في الباقات
document.querySelectorAll('.pricing-card .btn-primary').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const pricingCard = e.target.closest('.pricing-card');
        const planTitle = pricingCard.querySelector('h3').textContent;
        showSubscriptionModal(planTitle);
    });
});

// عرض نافذة الاشتراك
function showSubscriptionModal(planTitle) {
    const modal = document.createElement('div');
    modal.className = 'modal subscription-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>اشتراك في باقة ${planTitle}</h3>
            <form id="subscription-form">
                <div class="form-group">
                    <label>الاسم الكامل</label>
                    <input type="text" required>
                </div>
                <div class="form-group">
                    <label>البريد الإلكتروني</label>
                    <input type="email" required>
                </div>
                <div class="form-group">
                    <label>رقم الهاتف</label>
                    <input type="tel" required>
                </div>
                <div class="payment-details">
                    <h4>تفاصيل الدفع</h4>
                    <!-- هنا يتم إضافة نموذج الدفع -->
                </div>
                <button type="submit" class="btn btn-primary">تأكيد الاشتراك</button>
            </form>
            <button class="btn btn-secondary" onclick="closeModal()">إغلاق</button>
        </div>
    `;
    document.body.appendChild(modal);
    
    // معالجة نموذج الاشتراك
    modal.querySelector('form').addEventListener('submit', (e) => {
        e.preventDefault();
        // هنا يتم إرسال بيانات الاشتراك للخادم
        showMessage('تم تأكيد اشتراكك بنجاح! سنرسل لك تفاصيل الباقة عبر البريد الإلكتروني.');
        closeModal();
    });
}

// إغلاق النوافذ المنبثقة
function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

// عرض الرسائل
function showMessage(message, type = 'success') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}
