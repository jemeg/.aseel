// تهيئة المتغيرات
const searchInput = document.querySelector('.search-input');
const createTopicBtn = document.querySelector('.create-topic-btn');
const followButtons = document.querySelectorAll('.follow-btn');
const joinButtons = document.querySelectorAll('.join-btn');

// البحث في المنتدى
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const topics = document.querySelectorAll('.topic-card');
    
    topics.forEach(topic => {
        const title = topic.querySelector('h4').textContent.toLowerCase();
        const author = topic.querySelector('.author').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || author.includes(searchTerm)) {
            topic.style.display = 'flex';
        } else {
            topic.style.display = 'none';
        }
    });
});

// إنشاء موضوع جديد
createTopicBtn.addEventListener('click', () => {
    if (!isLoggedIn()) {
        showLoginPrompt();
        return;
    }
    
    showCreateTopicModal();
});

// متابعة/إلغاء متابعة المواضيع
followButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        if (!isLoggedIn()) {
            showLoginPrompt();
            return;
        }
        
        const isFollowing = e.target.classList.contains('following');
        if (isFollowing) {
            e.target.classList.remove('following');
            e.target.textContent = 'متابعة';
        } else {
            e.target.classList.add('following');
            e.target.textContent = 'إلغاء المتابعة';
        }
    });
});

// الانضمام/مغادرة المجموعات
joinButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        if (!isLoggedIn()) {
            showLoginPrompt();
            return;
        }
        
        const isJoined = e.target.classList.contains('joined');
        if (isJoined) {
            e.target.classList.remove('joined');
            e.target.textContent = 'انضمام';
        } else {
            e.target.classList.add('joined');
            e.target.textContent = 'مغادرة';
        }
    });
});

// التحقق من تسجيل الدخول
function isLoggedIn() {
    // يمكن تنفيذ التحقق من تسجيل الدخول هنا
    return false; // مؤقتاً نفترض أن المستخدم غير مسجل
}

// عرض نافذة تسجيل الدخول
function showLoginPrompt() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>تسجيل الدخول مطلوب</h3>
            <p>يرجى تسجيل الدخول للمشاركة في المنتدى</p>
            <div class="modal-buttons">
                <button onclick="window.location.href='login.html'" class="btn btn-primary">تسجيل الدخول</button>
                <button onclick="closeModal()" class="btn">إلغاء</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// عرض نافذة إنشاء موضوع جديد
function showCreateTopicModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>موضوع جديد</h3>
            <form id="newTopicForm">
                <div class="form-group">
                    <label for="topicTitle">عنوان الموضوع</label>
                    <input type="text" id="topicTitle" required>
                </div>
                <div class="form-group">
                    <label for="topicCategory">الفئة</label>
                    <select id="topicCategory" required>
                        <option value="relationships">العلاقات العاطفية</option>
                        <option value="support">مجموعات الدعم</option>
                        <option value="success">قصص النجاح</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="topicContent">المحتوى</label>
                    <textarea id="topicContent" rows="5" required></textarea>
                </div>
                <div class="modal-buttons">
                    <button type="submit" class="btn btn-primary">نشر</button>
                    <button type="button" onclick="closeModal()" class="btn">إلغاء</button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
    
    document.getElementById('newTopicForm').addEventListener('submit', handleNewTopic);
}

// معالجة إنشاء موضوع جديد
function handleNewTopic(e) {
    e.preventDefault();
    // يمكن إضافة كود معالجة إنشاء الموضوع هنا
    closeModal();
    showMessage('تم نشر الموضوع بنجاح!');
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
