// تهيئة المتغيرات
const signupBtn = document.querySelector('.signup-cta .btn');
const tipSlides = document.querySelectorAll('.tip-slide');
let currentSlide = 0;

// التسجيل
signupBtn.addEventListener('click', () => {
    if (!isLoggedIn()) {
        showSignupModal();
    } else {
        window.location.href = 'profile.html';
    }
});

// عرض نافذة التسجيل
function showSignupModal() {
    const modal = document.createElement('div');
    modal.className = 'modal signup-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>التسجيل في خدمة المواعدة</h3>
            <form id="signup-form">
                <div class="form-group">
                    <label>الاسم</label>
                    <input type="text" required>
                </div>
                <div class="form-group">
                    <label>البريد الإلكتروني</label>
                    <input type="email" required>
                </div>
                <div class="form-group">
                    <label>كلمة المرور</label>
                    <input type="password" required>
                </div>
                <div class="form-group">
                    <label>تاريخ الميلاد</label>
                    <input type="date" required>
                </div>
                <div class="form-group">
                    <label>الجنس</label>
                    <select required>
                        <option value="">اختر</option>
                        <option value="male">ذكر</option>
                        <option value="female">أنثى</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>المدينة</label>
                    <input type="text" required>
                </div>
                <button type="submit" class="btn btn-primary">تسجيل</button>
            </form>
            <button class="btn btn-secondary" onclick="closeModal()">إغلاق</button>
        </div>
    `;
    document.body.appendChild(modal);

    // معالجة نموذج التسجيل
    const form = modal.querySelector('#signup-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        // هنا يتم إرسال بيانات التسجيل للخادم
        showMessage('تم التسجيل بنجاح! سيتم تحويلك للملف الشخصي.', 'success');
        setTimeout(() => {
            window.location.href = 'profile.html';
        }, 2000);
    });
}

// شريط النصائح المتحرك
function showNextTip() {
    tipSlides[currentSlide].style.display = 'none';
    currentSlide = (currentSlide + 1) % tipSlides.length;
    tipSlides[currentSlide].style.display = 'block';
}

// تشغيل شريط النصائح
setInterval(showNextTip, 5000);

// التحقق من تسجيل الدخول
function isLoggedIn() {
    // هنا يتم التحقق من حالة تسجيل الدخول
    return false;
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

// تحميل البيانات عند بدء الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // إخفاء كل الشرائح ما عدا الأولى
    tipSlides.forEach((slide, index) => {
        if (index !== 0) {
            slide.style.display = 'none';
        }
    });

    // بيانات تجريبية للمحادثات
    const conversations = [
        {
            id: 1,
            name: "أحمد محمد",
            avatar: "images/default-avatar.png",
            lastMessage: "مرحباً، كيف حالك؟",
            time: "10:30",
            unread: 2
        },
        {
            id: 2,
            name: "سارة أحمد",
            avatar: "images/default-avatar.png",
            lastMessage: "شكراً جزيلاً",
            time: "09:15",
            unread: 0
        }
    ];

    // بيانات تجريبية للرسائل
    const messages = [
        {
            id: 1,
            senderId: 1,
            text: "مرحباً، كيف حالك؟",
            time: "10:30",
            type: "received"
        },
        {
            id: 2,
            senderId: "me",
            text: "الحمد لله، بخير. وأنت؟",
            time: "10:31",
            type: "sent"
        }
    ];

    // تهيئة المكونات
    initializeComponents();
    loadConversations();
    setupEventListeners();

    // تهيئة المكونات الرئيسية
    function initializeComponents() {
        // إضافة زر العودة للقائمة في الشاشات الصغيرة
        const chatHeader = document.querySelector('.chat-header');
        const backButton = document.createElement('button');
        backButton.className = 'back-btn action-btn d-md-none';
        backButton.innerHTML = '<i class="fas fa-arrow-right"></i>';
        backButton.addEventListener('click', () => {
            document.querySelector('.chat-list').classList.add('show');
            document.querySelector('.chat-window').style.display = 'none';
        });
        chatHeader.insertBefore(backButton, chatHeader.firstChild);
    }

    // تحميل المحادثات
    function loadConversations() {
        const conversationsContainer = document.querySelector('.conversations');
        conversationsContainer.innerHTML = '';

        conversations.forEach(conv => {
            const conversationElement = createConversationElement(conv);
            conversationsContainer.appendChild(conversationElement);
        });
    }

    // إنشاء عنصر محادثة
    function createConversationElement(conversation) {
        const div = document.createElement('div');
        div.className = 'conversation-item';
        div.dataset.id = conversation.id;

        div.innerHTML = `
            <img src="${conversation.avatar}" alt="${conversation.name}" class="user-avatar">
            <div class="conversation-info">
                <div class="conversation-header">
                    <span class="user-name">${conversation.name}</span>
                    <span class="last-message-time">${conversation.time}</span>
                </div>
                <div class="last-message">${conversation.lastMessage}</div>
            </div>
            ${conversation.unread ? `<span class="unread-count">${conversation.unread}</span>` : ''}
        `;

        div.addEventListener('click', () => loadChat(conversation));
        return div;
    }

    // تحميل المحادثة
    function loadChat(conversation) {
        // تحديث معلومات المستخدم في رأس المحادثة
        document.querySelector('.chat-user-info .user-details h3').textContent = conversation.name;
        document.querySelector('.chat-user-info .user-avatar').src = conversation.avatar;

        // تحميل الرسائل
        loadMessages();

        // في الشاشات الصغيرة
        if (window.innerWidth <= 768) {
            document.querySelector('.chat-list').classList.remove('show');
            document.querySelector('.chat-window').style.display = 'flex';
        }
    }

    // تحميل الرسائل
    function loadMessages() {
        const messagesContainer = document.querySelector('.chat-messages');
        messagesContainer.innerHTML = '';

        messages.forEach(message => {
            const messageElement = createMessageElement(message);
            messagesContainer.appendChild(messageElement);
        });

        // التمرير إلى آخر رسالة
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // إنشاء عنصر رسالة
    function createMessageElement(message) {
        const div = document.createElement('div');
        div.className = `message ${message.type}`;
        
        div.innerHTML = `
            <div class="message-content">${message.text}</div>
            <div class="message-time">${message.time}</div>
        `;

        return div;
    }

    // إعداد مستمعي الأحداث
    function setupEventListeners() {
        // زر إنشاء محادثة جديدة
        const newChatBtn = document.querySelector('.new-chat-btn');
        newChatBtn.addEventListener('click', showSearchWindow);

        // إغلاق نافذة البحث
        const closeSearchBtn = document.querySelector('.close-search');
        closeSearchBtn.addEventListener('click', hideSearchWindow);

        // إرسال رسالة جديدة
        const messageForm = document.querySelector('.message-input');
        const messageInput = messageForm.querySelector('input');
        const sendBtn = messageForm.querySelector('.send-btn');

        sendBtn.addEventListener('click', () => sendMessage(messageInput));
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage(messageInput);
            }
        });

        // البحث في المحادثات
        const searchInput = document.querySelector('.search-bar input');
        searchInput.addEventListener('input', searchConversations);
    }

    // إظهار نافذة البحث
    function showSearchWindow() {
        document.querySelector('.search-users-window').classList.add('show');
    }

    // إخفاء نافذة البحث
    function hideSearchWindow() {
        document.querySelector('.search-users-window').classList.remove('show');
    }

    // إرسال رسالة جديدة
    function sendMessage(input) {
        const text = input.value.trim();
        if (!text) return;

        const message = {
            id: messages.length + 1,
            senderId: "me",
            text: text,
            time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
            type: "sent"
        };

        messages.push(message);
        const messageElement = createMessageElement(message);
        const messagesContainer = document.querySelector('.chat-messages');
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        input.value = '';
    }

    // البحث في المحادثات
    function searchConversations(e) {
        const searchTerm = e.target.value.toLowerCase();
        const conversationItems = document.querySelectorAll('.conversation-item');

        conversationItems.forEach(item => {
            const userName = item.querySelector('.user-name').textContent.toLowerCase();
            const lastMessage = item.querySelector('.last-message').textContent.toLowerCase();

            if (userName.includes(searchTerm) || lastMessage.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }
});

// استيراد قاعدة البيانات
import { db } from './database.js';

// تهيئة Socket.io للمحادثات المباشرة
const socket = io('http://localhost:3000');

// المتغيرات العامة
let currentUser = null;
let currentChat = null;
let matches = [];
let conversations = [];

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', () => {
    initializeUser();
    setupEventListeners();
    loadMatches();
    loadConversations();
});

// تهيئة المستخدم
async function initializeUser() {
    try {
        // في الواقع، سيتم جلب بيانات المستخدم من قاعدة البيانات
        currentUser = {
            id: 'user123',
            name: 'أحمد محمد',
            age: 28,
            location: 'الرياض',
            status: 'أعزب',
            interests: ['السفر', 'القراءة', 'الرياضة'],
            bio: 'مهندس برمجيات، أحب التعلم واكتشاف أشياء جديدة.',
            preferences: 'أبحث عن شريكة حياة متفهمة ومثقفة'
        };
        updateUserProfile();
    } catch (error) {
        console.error('خطأ في تحميل بيانات المستخدم:', error);
    }
}

// تحديث الملف الشخصي
function updateUserProfile() {
    document.getElementById('user-name').textContent = currentUser.name;
    document.getElementById('user-location').innerHTML = `<i class="fas fa-map-marker-alt"></i> ${currentUser.location}`;
    document.getElementById('user-age').innerHTML = `<i class="fas fa-birthday-cake"></i> ${currentUser.age} سنة`;
    document.getElementById('user-status').innerHTML = `<i class="fas fa-heart"></i> ${currentUser.status}`;
    document.getElementById('user-bio').textContent = currentUser.bio;
    document.getElementById('user-preferences').textContent = currentUser.preferences;

    const interestsContainer = document.getElementById('user-interests');
    interestsContainer.innerHTML = currentUser.interests
        .map(interest => `<span class="interest-tag">${interest}</span>`)
        .join('');
}

// إعداد مستمعي الأحداث
function setupEventListeners() {
    // تحميل الصورة الشخصية
    const changeAvatarBtn = document.querySelector('.change-avatar-btn');
    if (changeAvatarBtn) {
        changeAvatarBtn.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        document.getElementById('profile-image').src = e.target.result;
                        // هنا سيتم رفع الصورة إلى الخادم
                    };
                    reader.readAsDataURL(file);
                }
            };
            input.click();
        });
    }

    // تعديل الملف الشخصي
    const editProfileBtn = document.querySelector('.edit-profile-btn');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', showEditProfileModal);
    }

    // البحث
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }

    // المحادثات
    setupChatEventListeners();
}

// إظهار نافذة تعديل الملف الشخصي
function showEditProfileModal() {
    const modal = document.getElementById('edit-profile-modal');
    modal.innerHTML = `
        <div class="modal-content">
            <h2>تعديل الملف الشخصي</h2>
            <form id="edit-profile-form">
                <div class="form-group">
                    <label>الاسم</label>
                    <input type="text" name="name" value="${currentUser.name}">
                </div>
                <div class="form-group">
                    <label>العمر</label>
                    <input type="number" name="age" value="${currentUser.age}">
                </div>
                <div class="form-group">
                    <label>المدينة</label>
                    <input type="text" name="location" value="${currentUser.location}">
                </div>
                <div class="form-group">
                    <label>الحالة الاجتماعية</label>
                    <select name="status">
                        <option value="أعزب" ${currentUser.status === 'أعزب' ? 'selected' : ''}>أعزب</option>
                        <option value="مرتبط" ${currentUser.status === 'مرتبط' ? 'selected' : ''}>مرتبط</option>
                        <option value="متزوج" ${currentUser.status === 'متزوج' ? 'selected' : ''}>متزوج</option>
                        <option value="مطلق" ${currentUser.status === 'مطلق' ? 'selected' : ''}>مطلق</option>
                        <option value="أرمل" ${currentUser.status === 'أرمل' ? 'selected' : ''}>أرمل</option>

                    </select>
                </div>
                <div class="form-group">
                    <label>نبذة عني</label>
                    <textarea name="bio">${currentUser.bio}</textarea>
                </div>
                <div class="form-group">
                    <label>ما أبحث عنه</label>
                    <textarea name="preferences">${currentUser.preferences}</textarea>
                </div>
                <div class="form-group">
                    <label>الاهتمامات</label>
                    <input type="text" name="interests" value="${currentUser.interests.join(', ')}">
                    <small>افصل بين الاهتمامات بفاصلة</small>
                </div>
                <div class="form-actions">
                    <button type="submit" class="save-btn">حفظ التغييرات</button>
                    <button type="button" class="cancel-btn">إلغاء</button>
                </div>
            </form>
        </div>
    `;
    modal.classList.add('active');

    // معالجة النموذج
    const form = document.getElementById('edit-profile-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        currentUser = {
            ...currentUser,
            name: formData.get('name'),
            age: parseInt(formData.get('age')),
            location: formData.get('location'),
            status: formData.get('status'),
            bio: formData.get('bio'),
            preferences: formData.get('preferences'),
            interests: formData.get('interests').split(',').map(i => i.trim())
        };
        updateUserProfile();
        modal.classList.remove('active');
    });

    // زر الإلغاء
    const cancelBtn = modal.querySelector('.cancel-btn');
    cancelBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });
}

// تنفيذ البحث
async function performSearch() {
    const minAge = document.getElementById('min-age').value;
    const maxAge = document.getElementById('max-age').value;
    const city = document.getElementById('city-filter').value;
    
    try {
        // في الواقع، سيتم البحث في قاعدة البيانات
        const results = await searchUsers({ minAge, maxAge, city });
        displaySearchResults(results);
    } catch (error) {
        console.error('خطأ في البحث:', error);
    }
}

// عرض نتائج البحث
function displaySearchResults(results) {
    const container = document.getElementById('matches-container');
    container.innerHTML = results.map(user => `
        <div class="match-card">
            <img src="${user.avatar || 'images/default-avatar.png'}" alt="${user.name}" class="match-avatar">
            <div class="match-info">
                <h3 class="match-name">${user.name}</h3>
                <p class="match-details">${user.age} سنة، ${user.location}</p>
                <p class="compatibility">نسبة التوافق: ${calculateCompatibility(user)}%</p>
                <button class="chat-btn" onclick="startChat('${user.id}')">
                    <i class="fas fa-comment"></i> محادثة
                </button>
            </div>
        </div>
    `).join('');
}

// حساب نسبة التوافق
function calculateCompatibility(user) {
    // في الواقع، سيتم حساب التوافق بناءً على عوامل متعددة
    const sharedInterests = currentUser.interests.filter(interest => 
        user.interests.includes(interest)
    ).length;
    const maxInterests = Math.max(currentUser.interests.length, user.interests.length);
    return Math.round((sharedInterests / maxInterests) * 100);
}

// إعداد مستمعي أحداث المحادثة
function setupChatEventListeners() {
    const messageInput = document.querySelector('.message-input input');
    const sendBtn = document.querySelector('.send-btn');
    const emojiBtn = document.querySelector('.emoji-btn');
    const attachBtn = document.querySelector('.attach-btn');

    // إرسال الرسائل
    sendBtn.addEventListener('click', () => {
        const message = messageInput.value.trim();
        if (message && currentChat) {
            sendMessage(message);
            messageInput.value = '';
        }
    });

    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendBtn.click();
        }
    });

    // إضافة الرموز التعبيرية
    const picker = new EmojiButton();
    picker.on('emoji', emoji => {
        messageInput.value += emoji;
    });

    emojiBtn.addEventListener('click', () => {
        picker.togglePicker(emojiBtn);
    });

    // إرفاق الملفات
    attachBtn.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.multiple = true;
        input.onchange = (e) => {
            Array.from(e.target.files).forEach(file => {
                // هنا سيتم رفع الملف إلى الخادم
                console.log('Uploading file:', file.name);
            });
        };
        input.click();
    });

    // استقبال الرسائل
    socket.on('message', (message) => {
        if (message.chatId === currentChat?.id) {
            displayMessage(message);
        }
        updateConversationsList();
    });
}

// إرسال رسالة
function sendMessage(content) {
    const message = {
        id: Date.now().toString(),
        sender: currentUser.id,
        receiver: currentChat.userId,
        content,
        timestamp: new Date(),
        type: 'text'
    };

    // إرسال الرسالة عبر Socket.io
    socket.emit('message', message);
    
    // عرض الرسالة في نافذة المحادثة
    displayMessage(message);
    
    // تحديث قائمة المحادثات
    updateConversationsList();
}

// عرض رسالة في نافذة المحادثة
function displayMessage(message) {
    const messagesContainer = document.getElementById('chat-messages');
    const isOwn = message.sender === currentUser.id;
    
    const messageElement = document.createElement('div');
    messageElement.className = `message ${isOwn ? 'sent' : 'received'}`;
    messageElement.innerHTML = `
        <div class="message-content">${message.content}</div>
        <div class="message-time">${formatTime(message.timestamp)}</div>
    `;
    
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// تنسيق الوقت
function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
}

// تحميل المحادثات
async function loadConversations() {
    try {
        // في الواقع، سيتم جلب المحادثات من قاعدة البيانات
        conversations = [
            {
                id: 'chat1',
                userId: 'user456',
                name: 'سارة أحمد',
                lastMessage: 'مرحباً، كيف حالك؟',
                timestamp: new Date(),
                unread: 2
            },
            // المزيد من المحادثات...
        ];
        updateConversationsList();
    } catch (error) {
        console.error('خطأ في تحميل المحادثات:', error);
    }
}

// تحديث قائمة المحادثات
function updateConversationsList() {
    const container = document.getElementById('conversations-list');
    container.innerHTML = conversations.map(chat => `
        <div class="conversation-item ${currentChat?.id === chat.id ? 'active' : ''}" 
             onclick="openChat('${chat.id}')">
            <img src="images/default-avatar.png" alt="${chat.name}" class="user-avatar">
            <div class="conversation-info">
                <div class="conversation-header">
                    <span class="user-name">${chat.name}</span>
                    <span class="last-message-time">${formatTime(chat.timestamp)}</span>
                </div>
                <p class="last-message">${chat.lastMessage}</p>
            </div>
            ${chat.unread ? `<span class="unread-count">${chat.unread}</span>` : ''}
        </div>
    `).join('');
}

// فتح محادثة
function openChat(chatId) {
    currentChat = conversations.find(chat => chat.id === chatId);
    if (currentChat) {
        // تحديث واجهة المحادثة
        const header = document.querySelector('.chat-header .user-details');
        header.innerHTML = `
            <h3>${currentChat.name}</h3>
            <span class="online-status">متصل الآن</span>
        `;

        // تحميل الرسائل السابقة
        loadChatHistory(chatId);

        // تحديث قائمة المحادثات
        currentChat.unread = 0;
        updateConversationsList();
    }
}

// تحميل سجل المحادثة
async function loadChatHistory(chatId) {
    try {
        // في الواقع، سيتم جلب سجل المحادثة من قاعدة البيانات
        const messages = [
            {
                id: 'msg1',
                sender: 'user456',
                content: 'مرحباً، كيف حالك؟',
                timestamp: new Date(Date.now() - 3600000)
            },
            {
                id: 'msg2',
                sender: currentUser.id,
                content: 'الحمد لله، بخير. وأنت؟',
                timestamp: new Date(Date.now() - 3500000)
            }
        ];

        // عرض الرسائل
        const container = document.getElementById('chat-messages');
        container.innerHTML = '';
        messages.forEach(displayMessage);
    } catch (error) {
        console.error('خطأ في تحميل سجل المحادثة:', error);
    }
}

// تحميل المطابقات
async function loadMatches() {
    try {
        // في الواقع، سيتم جلب المطابقات من قاعدة البيانات
        matches = [
            {
                id: 'user456',
                name: 'سارة أحمد',
                age: 26,
                location: 'جدة',
                interests: ['السفر', 'الطبخ', 'القراءة'],
                avatar: 'images/default-avatar.png'
            },
            // المزيد من المطابقات...
        ];
        displaySearchResults(matches);
    } catch (error) {
        console.error('خطأ في تحميل المطابقات:', error);
    }
}

// بدء محادثة جديدة
function startChat(userId) {
    const user = matches.find(m => m.id === userId);
    if (user) {
        // إنشاء محادثة جديدة
        const newChat = {
            id: `chat_${Date.now()}`,
            userId: user.id,
            name: user.name,
            lastMessage: '',
            timestamp: new Date(),
            unread: 0
        };

        conversations.unshift(newChat);
        updateConversationsList();
        openChat(newChat.id);
    }
}

// معرض الصور
function initializeGallery() {
    const gallery = document.getElementById('user-gallery');
    const addPhotoBtn = document.querySelector('.add-photo-btn');

    // تحميل الصور الحالية
    loadUserPhotos();

    // إضافة صور جديدة
    addPhotoBtn.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.multiple = true;
        input.onchange = handlePhotoUpload;
        input.click();
    });
}

async function loadUserPhotos() {
    try {
        // في الواقع، سيتم جلب الصور من قاعدة البيانات
        const photos = [
            { id: 'photo1', url: 'images/gallery/1.jpg' },
            { id: 'photo2', url: 'images/gallery/2.jpg' }
        ];
        
        const gallery = document.getElementById('user-gallery');
        gallery.innerHTML = photos.map(photo => createGalleryItem(photo)).join('');
    } catch (error) {
        console.error('خطأ في تحميل الصور:', error);
    }
}

function createGalleryItem(photo) {
    return `
        <div class="gallery-item" data-id="${photo.id}">
            <img src="${photo.url}" alt="صورة شخصية">
            <button class="remove-photo" onclick="removePhoto('${photo.id}')">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
}

async function handlePhotoUpload(event) {
    const files = Array.from(event.target.files);
    const gallery = document.getElementById('user-gallery');

    for (const file of files) {
        try {
            // في الواقع، سيتم رفع الصورة إلى الخادم
            const reader = new FileReader();
            reader.onload = (e) => {
                const photoId = `photo_${Date.now()}`;
                const photoUrl = e.target.result;
                const photoElement = createGalleryItem({ id: photoId, url: photoUrl });
                gallery.insertAdjacentHTML('beforeend', photoElement);
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('خطأ في رفع الصورة:', error);
        }
    }
}

async function removePhoto(photoId) {
    try {
        // في الواقع، سيتم حذف الصورة من الخادم
        const photoElement = document.querySelector(`.gallery-item[data-id="${photoId}"]`);
        if (photoElement) {
            photoElement.remove();
        }
    } catch (error) {
        console.error('خطأ في حذف الصورة:', error);
    }
}

// التقييمات
async function loadUserRatings() {
    try {
        // في الواقع، سيتم جلب التقييمات من قاعدة البيانات
        const ratings = [
            {
                id: 'rating1',
                user: {
                    name: 'محمد علي',
                    avatar: 'images/default-avatar.png'
                },
                rating: 5,
                comment: 'شخص محترم وصادق في التعامل',
                date: new Date(Date.now() - 86400000)
            }
        ];

        const container = document.getElementById('user-ratings');
        container.innerHTML = ratings.map(rating => `
            <div class="rating-item">
                <div class="rating-header">
                    <div class="rating-user">
                        <img src="${rating.user.avatar}" alt="${rating.user.name}">
                        <span>${rating.user.name}</span>
                    </div>
                    <div class="rating-stars">
                        ${createStarRating(rating.rating)}
                    </div>
                </div>
                <div class="rating-date">${formatDate(rating.date)}</div>
                <div class="rating-content">${rating.comment}</div>
            </div>
        `).join('');
    } catch (error) {
        console.error('خطأ في تحميل التقييمات:', error);
    }
}

function createStarRating(rating) {
    return Array(5).fill(0).map((_, index) => 
        `<i class="fas fa-star${index < rating ? '' : '-o'}"></i>`
    ).join('');
}

// نظام الإبلاغ
function setupReportSystem() {
    const reportButtons = document.querySelectorAll('.report-btn');
    const reportModal = document.getElementById('report-modal');
    const reportForm = document.getElementById('report-form');

    reportButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const userId = e.target.dataset.userId;
            showReportModal(userId);
        });
    });

    reportForm.addEventListener('submit', handleReportSubmission);
}

function showReportModal(userId) {
    const modal = document.getElementById('report-modal');
    modal.dataset.userId = userId;
    modal.classList.add('active');
}

async function handleReportSubmission(e) {
    e.preventDefault();
    const form = e.target;
    const userId = document.getElementById('report-modal').dataset.userId;
    const formData = new FormData(form);

    try {
        // في الواقع، سيتم إرسال البلاغ إلى الخادم
        await submitReport({
            userId,
            reason: formData.get('report-reason'),
            details: formData.get('report-details')
        });

        // إغلاق النافذة المنبثقة وإظهار رسالة نجاح
        document.getElementById('report-modal').classList.remove('active');
        showNotification('تم إرسال البلاغ بنجاح', 'success');
    } catch (error) {
        console.error('خطأ في إرسال البلاغ:', error);
        showNotification('حدث خطأ أثناء إرسال البلاغ', 'error');
    }
}

// تحسين نظام المطابقة
function calculateCompatibility(user) {
    let score = 0;
    let maxScore = 0;

    // التوافق في الاهتمامات
    const sharedInterests = currentUser.interests.filter(interest => 
        user.interests.includes(interest)
    ).length;
    score += (sharedInterests / Math.max(currentUser.interests.length, user.interests.length)) * 30;
    maxScore += 30;

    // التوافق في العمر
    const ageDiff = Math.abs(currentUser.age - user.age);
    score += (1 - (ageDiff / 20)) * 20; // أقصى فرق 20 سنة
    maxScore += 20;

    // التوافق في المستوى التعليمي
    if (currentUser.education === user.education) {
        score += 15;
    } else if (Math.abs(getEducationLevel(currentUser.education) - 
               getEducationLevel(user.education)) === 1) {
        score += 10;
    }
    maxScore += 15;

    // التوافق في الموقع
    if (currentUser.location === user.location) {
        score += 20;
    } else if (isNearbyCity(currentUser.location, user.location)) {
        score += 10;
    }
    maxScore += 20;

    // التوافق في الحالة الاجتماعية
    if (isCompatibleStatus(currentUser.status, user.status)) {
        score += 15;
    }
    maxScore += 15;

    return Math.round((score / maxScore) * 100);
}

function getEducationLevel(education) {
    const levels = {
        'high-school': 1,
        'bachelor': 2,
        'master': 3,
        'phd': 4
    };
    return levels[education] || 0;
}

function isNearbyCity(city1, city2) {
    // في الواقع، سيتم استخدام خريطة المدن القريبة
    const nearbyCities = {
        'الرياض': ['الدرعية', 'الخرج'],
        'جدة': ['مكة', 'الطائف'],
        // إضافة المزيد من المدن
    };
    return nearbyCities[city1]?.includes(city2) || nearbyCities[city2]?.includes(city1);
}

function isCompatibleStatus(status1, status2) {
    // تحديد التوافق بين الحالات الاجتماعية
    const compatibility = {
        'أعزب': ['أعزب', 'مطلق', 'أرمل'],
        'مطلق': ['أعزب', 'مطلق', 'أرمل'],
        'أرمل': ['أعزب', 'مطلق', 'أرمل']
    };
    return compatibility[status1]?.includes(status2);
}

// تحسين عرض النتائج
function displaySearchResults(results) {
    const container = document.getElementById('matches-container');
    container.innerHTML = results.map(user => `
        <div class="match-card">
            <img src="${user.avatar || 'images/default-avatar.png'}" alt="${user.name}" class="match-avatar">
            <div class="match-info">
                <h3 class="match-name">${user.name}</h3>
                <p class="match-details">
                    <span><i class="fas fa-birthday-cake"></i> ${user.age} سنة</span>
                    <span><i class="fas fa-map-marker-alt"></i> ${user.location}</span>
                </p>
                <p class="match-education">
                    <i class="fas fa-graduation-cap"></i> ${getEducationLabel(user.education)}
                </p>
                <div class="match-interests">
                    ${user.interests.slice(0, 3).map(interest => 
                        `<span class="interest-tag">${interest}</span>`
                    ).join('')}
                    ${user.interests.length > 3 ? `<span class="more-interests">+${user.interests.length - 3}</span>` : ''}
                </div>
                <div class="match-actions">
                    <p class="compatibility">
                        <i class="fas fa-heart"></i>
                        نسبة التوافق: ${calculateCompatibility(user)}%
                    </p>
                    <button class="chat-btn" onclick="startChat('${user.id}')">
                        <i class="fas fa-comment"></i> محادثة
                    </button>
                    <button class="report-btn" data-user-id="${user.id}">
                        <i class="fas fa-flag"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // تفعيل أزرار الإبلاغ
    setupReportSystem();
}

// تهيئة جميع الوظائف
document.addEventListener('DOMContentLoaded', () => {
    initializeUser();
    setupEventListeners();
    initializeGallery();
    loadUserRatings();
    loadMatches();
    loadConversations();
    setupReportSystem();
});

// تهيئة WebRTC
let peerConnection;
let localStream;
let remoteStream;
let callType = 'video'; // 'video' or 'voice'
let currentCall = null;

// تهيئة المكالمات
async function initializeCalls() {
    setupCallControls();
    setupIncomingCallHandlers();
}

// إعداد أزرار التحكم في المكالمة
function setupCallControls() {
    const micBtn = document.getElementById('toggle-mic');
    const videoBtn = document.getElementById('toggle-video');
    const endCallBtn = document.getElementById('end-call');
    const screenShareBtn = document.getElementById('screen-share');

    micBtn.addEventListener('click', toggleMic);
    videoBtn.addEventListener('click', toggleVideo);
    endCallBtn.addEventListener('click', endCall);
    screenShareBtn.addEventListener('click', toggleScreenShare);
}

// بدء مكالمة فيديو
async function startVideoCall(userId) {
    try {
        callType = 'video';
        await initializeMediaStream(true);
        await createPeerConnection(userId);
        showCallModal(userId);
    } catch (error) {
        console.error('خطأ في بدء مكالمة الفيديو:', error);
        showNotification('حدث خطأ أثناء بدء المكالمة', 'error');
    }
}

// بدء مكالمة صوتية
async function startVoiceCall(userId) {
    try {
        callType = 'voice';
        await initializeMediaStream(false);
        await createPeerConnection(userId);
        showCallModal(userId);
    } catch (error) {
        console.error('خطأ في بدء المكالمة الصوتية:', error);
        showNotification('حدث خطأ أثناء بدء المكالمة', 'error');
    }
}

// تهيئة بث الوسائط
async function initializeMediaStream(withVideo) {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: withVideo
        });
        
        const localVideo = document.getElementById('local-video');
        localVideo.srcObject = localStream;
        
        return localStream;
    } catch (error) {
        console.error('خطأ في الوصول إلى الكاميرا/الميكروفون:', error);
        throw error;
    }
}

// إنشاء اتصال الند للند
async function createPeerConnection(userId) {
    const configuration = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' }
        ]
    };

    peerConnection = new RTCPeerConnection(configuration);

    // إضافة المسارات المحلية
    localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
    });

    // استقبال المسارات البعيدة
    peerConnection.ontrack = (event) => {
        const remoteVideo = document.getElementById('remote-video');
        if (!remoteStream) {
            remoteStream = new MediaStream();
            remoteVideo.srcObject = remoteStream;
        }
        remoteStream.addTrack(event.track);
    };

    // معالجة ICE candidates
    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            // إرسال ICE candidate إلى المستخدم الآخر عبر السيرفر
            sendIceCandidate(userId, event.candidate);
        }
    };

    // إنشاء عرض المكالمة
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    // إرسال العرض إلى المستخدم الآخر
    sendCallOffer(userId, offer);
}

// التحكم في الميكروفون
function toggleMic() {
    const micBtn = document.getElementById('toggle-mic');
    const audioTrack = localStream.getAudioTracks()[0];
    
    if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        micBtn.classList.toggle('muted');
        micBtn.querySelector('i').className = 
            audioTrack.enabled ? 'fas fa-microphone' : 'fas fa-microphone-slash';
    }
}

// التحكم في الكاميرا
function toggleVideo() {
    const videoBtn = document.getElementById('toggle-video');
    const videoTrack = localStream.getVideoTracks()[0];
    
    if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        videoBtn.classList.toggle('video-off');
        videoBtn.querySelector('i').className = 
            videoTrack.enabled ? 'fas fa-video' : 'fas fa-video-slash';
    }
}

// مشاركة الشاشة
async function toggleScreenShare() {
    try {
        if (!localStream.getVideoTracks().some(track => track.label.includes('screen'))) {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({
                video: true
            });
            
            const videoTrack = screenStream.getVideoTracks()[0];
            const sender = peerConnection.getSenders().find(s => 
                s.track.kind === 'video'
            );
            
            if (sender) {
                sender.replaceTrack(videoTrack);
            }
            
            videoTrack.onended = () => {
                const cameraTrack = localStream.getVideoTracks()[0];
                if (sender && cameraTrack) {
                    sender.replaceTrack(cameraTrack);
                }
            };
        }
    } catch (error) {
        console.error('خطأ في مشاركة الشاشة:', error);
        showNotification('حدث خطأ أثناء مشاركة الشاشة', 'error');
    }
}

// إنهاء المكالمة
function endCall() {
    if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
    }
    
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        localStream = null;
    }
    
    if (remoteStream) {
        remoteStream.getTracks().forEach(track => track.stop());
        remoteStream = null;
    }
    
    hideCallModal();
    currentCall = null;
}

// عرض نافذة المكالمة
function showCallModal(userId) {
    const modal = document.getElementById('call-modal');
    const callerAvatar = document.getElementById('caller-avatar');
    const callerName = document.getElementById('caller-name');
    
    // تحديث معلومات المتصل
    const user = getUserById(userId);
    if (user) {
        callerAvatar.src = user.avatar || 'images/default-avatar.png';
        callerName.textContent = user.name;
    }
    
    modal.classList.add('active');
    startCallTimer();
}

// إخفاء نافذة المكالمة
function hideCallModal() {
    const modal = document.getElementById('call-modal');
    modal.classList.remove('active');
    stopCallTimer();
}

// مؤقت المكالمة
let callTimer;
function startCallTimer() {
    const durationElement = document.getElementById('call-duration');
    let seconds = 0;
    
    callTimer = setInterval(() => {
        seconds++;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        durationElement.textContent = 
            `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }, 1000);
}

function stopCallTimer() {
    if (callTimer) {
        clearInterval(callTimer);
        callTimer = null;
    }
}

// معالجة المكالمات الواردة
function handleIncomingCall(callData) {
    const { callerId, type } = callData;
    const user = getUserById(callerId);
    
    if (user) {
        showIncomingCallModal(user, type);
    }
}

// عرض نافذة المكالمة الواردة
function showIncomingCallModal(caller, type) {
    const modal = document.getElementById('incoming-call-modal');
    const avatar = document.getElementById('incoming-caller-avatar');
    const name = document.getElementById('incoming-caller-name');
    
    avatar.src = caller.avatar || 'images/default-avatar.png';
    name.textContent = caller.name;
    
    modal.classList.add('active');
    playRingtone();
}

// تشغيل نغمة الرنين
let ringtone;
function playRingtone() {
    ringtone = new Audio('sounds/ringtone.mp3');
    ringtone.loop = true;
    ringtone.play();
}

function stopRingtone() {
    if (ringtone) {
        ringtone.pause();
        ringtone.currentTime = 0;
    }
}

// إعداد معالجات المكالمات الواردة
function setupIncomingCallHandlers() {
    const acceptVideoBtn = document.querySelector('.accept-video-call');
    const acceptVoiceBtn = document.querySelector('.accept-voice-call');
    const rejectBtn = document.querySelector('.reject-call');
    
    acceptVideoBtn.addEventListener('click', () => acceptCall('video'));
    acceptVoiceBtn.addEventListener('click', () => acceptCall('voice'));
    rejectBtn.addEventListener('click', rejectCall);
}

// قبول المكالمة
async function acceptCall(type) {
    try {
        stopRingtone();
        document.getElementById('incoming-call-modal').classList.remove('active');
        
        callType = type;
        await initializeMediaStream(type === 'video');
        await createPeerConnection(currentCall.callerId);
        showCallModal(currentCall.callerId);
    } catch (error) {
        console.error('خطأ في قبول المكالمة:', error);
        showNotification('حدث خطأ أثناء قبول المكالمة', 'error');
    }
}

// رفض المكالمة
function rejectCall() {
    stopRingtone();
    document.getElementById('incoming-call-modal').classList.remove('active');
    sendCallRejection(currentCall.callerId);
    currentCall = null;
}

// تهيئة وظائف المكالمات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    initializeCalls();
});

// قائمة الهدايا المتوفرة
const availableGifts = [
    {
        id: 'gift1',
        name: 'باقة ورد حمراء',
        price: 50,
        image: 'images/gifts/red-roses.png',
        category: 'flowers'
    },
    {
        id: 'gift2',
        name: 'شوكولاتة فاخرة',
        price: 75,
        image: 'images/gifts/luxury-chocolate.png',
        category: 'chocolates'
    },
    {
        id: 'gift3',
        name: 'دب كبير',
        price: 100,
        image: 'images/gifts/teddy-bear.png',
        category: 'teddy'
    },
    {
        id: 'gift4',
        name: 'قلادة ذهبية',
        price: 200,
        image: 'images/gifts/gold-necklace.png',
        category: 'jewelry'
    }
];

// تهيئة متجر الهدايا
function initializeGiftsShop() {
    const categoriesContainer = document.querySelector('.gifts-categories');
    const giftsGrid = document.getElementById('gifts-grid');
    
    // إضافة مستمعي الأحداث لأزرار التصنيف
    categoriesContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('category-btn')) {
            const category = e.target.dataset.category;
            filterGifts(category);
            
            // تحديث الزر النشط
            document.querySelectorAll('.category-btn').forEach(btn => 
                btn.classList.remove('active')
            );
            e.target.classList.add('active');
        }
    });
    
    // عرض جميع الهدايا مبدئياً
    displayGifts(availableGifts);
}

// عرض الهدايا في الشبكة
function displayGifts(gifts) {
    const giftsGrid = document.getElementById('gifts-grid');
    giftsGrid.innerHTML = gifts.map(gift => `
        <div class="gift-item" onclick="selectGift('${gift.id}')">
            <img src="${gift.image}" alt="${gift.name}">
            <h4 class="gift-name">${gift.name}</h4>
            <p class="gift-price">${gift.price} نقطة</p>
        </div>
    `).join('');
}

// تصفية الهدايا حسب التصنيف
function filterGifts(category) {
    if (category === 'all') {
        displayGifts(availableGifts);
    } else {
        const filteredGifts = availableGifts.filter(gift => 
            gift.category === category
        );
        displayGifts(filteredGifts);
    }
}

// اختيار هدية للإرسال
function selectGift(giftId) {
    const gift = availableGifts.find(g => g.id === giftId);
    if (gift) {
        const previewImg = document.getElementById('gift-preview-img');
        const giftName = document.getElementById('gift-name');
        const giftPrice = document.getElementById('gift-price');
        
        previewImg.src = gift.image;
        giftName.textContent = gift.name;
        giftPrice.textContent = `${gift.price} نقطة`;
        
        document.getElementById('gifts-shop-modal').classList.remove('active');
        document.getElementById('send-gift-modal').classList.add('active');
    }
}

// إرسال هدية
async function sendGift(userId, giftId, message) {
    try {
        // في الواقع، سيتم إرسال الهدية إلى الخادم
        const gift = {
            id: giftId,
            senderId: currentUser.id,
            receiverId: userId,
            message: message,
            date: new Date()
        };
        
        // إضافة الهدية إلى قائمة الهدايا المستلمة للمستخدم
        await addGiftToUser(userId, gift);
        
        showNotification('تم إرسال الهديه بنجاح!', 'success');
        document.getElementById('send-gift-modal').classList.remove('active');
    } catch (error) {
        console.error('خطأ في إرسال الهدية:', error);
        showNotification('حدث خطأ أثناء إرسال الهدية', 'error');
    }
}

// تحميل الهدايا المستلمة
async function loadReceivedGifts(userId) {
    try {
        // في الواقع، سيتم جلب الهدايا من قاعدة البيانات
        const gifts = [
            {
                id: 'gift1',
                senderId: 'user1',
                message: 'هدية جميلة لشخص جميل',
                date: new Date(Date.now() - 86400000),
                gift: availableGifts[0]
            }
        ];
        
        const container = document.getElementById('received-gifts');
        container.innerHTML = gifts.map(gift => `
            <div class="received-gift">
                <img src="${gift.gift.image}" alt="${gift.gift.name}">
                <div class="gift-sender">${getUserById(gift.senderId).name}</div>
                <div class="gift-date">${formatDate(gift.date)}</div>
                ${gift.message ? `
                    <div class="gift-message-preview">${gift.message}</div>
                ` : ''}
            </div>
        `).join('');
    } catch (error) {
        console.error('خطأ في تحميل الهدايا:', error);
    }
}

// فتح متجر الهدايا
function openGiftsShop(userId) {
    const modal = document.getElementById('gifts-shop-modal');
    modal.dataset.userId = userId;
    modal.classList.add('active');
}

// إعداد معالجات الأحداث للهدايا
function setupGiftHandlers() {
    const sendGiftForm = document.querySelector('.send-gift-btn');
    sendGiftForm.addEventListener('click', async () => {
        const userId = document.getElementById('gifts-shop-modal').dataset.userId;
        const message = document.getElementById('gift-message').value;
        const giftId = document.getElementById('gift-preview-img').dataset.giftId;
        
        await sendGift(userId, giftId, message);
    });
}

// تهيئة نظام الهدايا عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    initializeGiftsShop();
    setupGiftHandlers();
});

// نظام التحقق من الهوية
let currentStep = 1;
let verificationData = {
    idType: '',
    idNumber: '',
    birthDate: '',
    selfieImage: null,
    phoneNumber: '',
    verificationCode: ''
};

// بدء عملية التحقق
function startVerification() {
    currentStep = 1;
    updateVerificationProgress();
    showVerificationStep(1);
    document.getElementById('verification-modal').classList.add('active');
}

// تحديث شريط التقدم
function updateVerificationProgress() {
    const progressFill = document.querySelector('.progress-fill');
    const progress = ((currentStep - 1) / 2) * 100;
    progressFill.style.width = `${progress}%`;

    // تحديث الخطوات
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        if (index + 1 < currentStep) {
            step.classList.add('completed');
        } else if (index + 1 === currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active', 'completed');
        }
    });
}

// عرض خطوة معينة
function showVerificationStep(step) {
    document.querySelectorAll('.verification-step').forEach(s => 
        s.classList.remove('active')
    );
    document.getElementById(`step-${getStepId(step)}`).classList.add('active');

    // تحديث أزرار التنقل
    const prevBtn = document.querySelector('.prev-step-btn');
    const nextBtn = document.querySelector('.next-step-btn');
    
    prevBtn.disabled = step === 1;
    if (step === 3) {
        nextBtn.textContent = 'إنهاء';
    } else {
        nextBtn.textContent = 'التالي';
    }
}

// الحصول على معرف الخطوة
function getStepId(step) {
    switch(step) {
        case 1: return 'identity';
        case 2: return 'photo';
        case 3: return 'phone';
        default: return '';
    }
}

// التنقل بين الخطوات
function navigateVerificationStep(direction) {
    if (direction === 'next' && !validateCurrentStep()) {
        return;
    }

    currentStep += direction === 'next' ? 1 : -1;
    
    if (currentStep < 1) currentStep = 1;
    if (currentStep > 3) {
        submitVerification();
        return;
    }

    updateVerificationProgress();
    showVerificationStep(currentStep);

    if (currentStep === 2) {
        initializeCamera();
    }
}

// التحقق من الخطوة الحالية
function validateCurrentStep() {
    switch(currentStep) {
        case 1:
            const idType = document.getElementById('id-type').value;
            const idNumber = document.getElementById('id-number').value;
            const birthDate = document.getElementById('birth-date').value;

            if (!idType || !idNumber || !birthDate) {
                showNotification('يرجى إكمال جميع الحقول المطلوبة', 'error');
                return false;
            }

            verificationData.idType = idType;
            verificationData.idNumber = idNumber;
            verificationData.birthDate = birthDate;
            return true;

        case 2:
            if (!verificationData.selfieImage) {
                showNotification('يرجى التقاط صورة شخصية', 'error');
                return false;
            }
            return true;

        case 3:
            const phoneNumber = document.getElementById('phone-number').value;
            const code = Array.from(document.querySelectorAll('.code-digit'))
                .map(input => input.value)
                .join('');

            if (!phoneNumber || code.length !== 4) {
                showNotification('يرجى إدخال رقم الهاتف ورمز التحقق', 'error');
                return false;
            }

            verificationData.phoneNumber = phoneNumber;
            verificationData.verificationCode = code;
            return true;
    }
    return true;
}

// تهيئة الكاميرا
async function initializeCamera() {
    try {
        const video = document.getElementById('selfie-camera');
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'user' } 
        });
        video.srcObject = stream;
    } catch (error) {
        console.error('خطأ في الوصول إلى الكاميرا:', error);
        showNotification('لا يمكن الوصول إلى الكاميرا', 'error');
    }
}

// التقاط صورة
function takeSelfie() {
    const video = document.getElementById('selfie-camera');
    const canvas = document.getElementById('selfie-canvas');
    const preview = document.getElementById('selfie-preview');
    const context = canvas.getContext('2d');

    // رسم الصورة على الكانفاس
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    // تحويل الصورة إلى Base64
    const imageData = canvas.toDataURL('image/jpeg');
    verificationData.selfieImage = imageData;

    // عرض المعاينة
    preview.src = imageData;
    preview.style.display = 'block';
    video.style.display = 'none';

    // تحديث الأزرار
    document.querySelector('.take-photo-btn').style.display = 'none';
    document.querySelector('.retake-photo-btn').style.display = 'inline-flex';
}

// إعادة التقاط الصورة
function retakeSelfie() {
    const video = document.getElementById('selfie-camera');
    const preview = document.getElementById('selfie-preview');

    // إعادة عرض الفيديو
    video.style.display = 'block';
    preview.style.display = 'none';

    // إعادة تعيين البيانات
    verificationData.selfieImage = null;

    // تحديث الأزرار
    document.querySelector('.take-photo-btn').style.display = 'inline-flex';
    document.querySelector('.retake-photo-btn').style.display = 'none';
}

// إرسال رمز التحقق
let codeCountdown;
function sendVerificationCode() {
    const phoneNumber = document.getElementById('phone-number').value;
    if (!phoneNumber) {
        showNotification('يرجى إدخال رقم الهاتف', 'error');
        return;
    }

    // في الواقع، سيتم إرسال الرمز عبر SMS
    showNotification('تم إرسال رمز التحقق', 'success');

    // بدء العد التنازلي
    let seconds = 60;
    document.querySelector('.send-code-btn').disabled = true;
    
    codeCountdown = setInterval(() => {
        seconds--;
        document.getElementById('code-countdown').textContent = seconds;
        
        if (seconds <= 0) {
            clearInterval(codeCountdown);
            document.querySelector('.send-code-btn').disabled = false;
            document.getElementById('code-countdown').textContent = '60';
        }
    }, 1000);
}

// التنقل التلقائي بين حقول رمز التحقق
function setupCodeInputs() {
    const inputs = document.querySelectorAll('.code-digit');
    
    inputs.forEach((input, index) => {
        input.addEventListener('keyup', (e) => {
            if (e.key >= '0' && e.key <= '9') {
                input.value = e.key;
                if (index < inputs.length - 1) {
                    inputs[index + 1].focus();
                }
            } else if (e.key === 'Backspace') {
                input.value = '';
                if (index > 0) {
                    inputs[index - 1].focus();
                }
            }
        });
    });
}

// إرسال بيانات التحقق
async function submitVerification() {
    try {
        // في الواقع، سيتم إرسال البيانات إلى الخادم
        await verifyUser(verificationData);
        
        showNotification('تم التحقق من حسابك بنجاح!', 'success');
        document.getElementById('verification-modal').classList.remove('active');
        
        // تحديث واجهة المستخدم
        updateUserVerificationStatus(true);
    } catch (error) {
        console.error('خطأ في عملية التحقق:', error);
        showNotification('حدث خطأ أثناء عملية التحقق', 'error');
    }
}

// تحديث حالة التحقق في واجهة المستخدم
function updateUserVerificationStatus(isVerified) {
    const badge = document.querySelector('.verification-badge');
    const requestBtn = document.querySelector('.request-verification-btn');
    
    if (isVerified) {
        badge.style.display = 'block';
        requestBtn.style.display = 'none';
    } else {
        badge.style.display = 'none';
        requestBtn.style.display = 'inline-flex';
    }
}

// تهيئة نظام التحقق
document.addEventListener('DOMContentLoaded', () => {
    setupCodeInputs();
    
    // إضافة مستمعي الأحداث للأزرار
    document.querySelector('.prev-step-btn').addEventListener('click', () => 
        navigateVerificationStep('prev')
    );
    
    document.querySelector('.next-step-btn').addEventListener('click', () => 
        navigateVerificationStep('next')
    );
    
    document.querySelector('.take-photo-btn').addEventListener('click', takeSelfie);
    document.querySelector('.retake-photo-btn').addEventListener('click', retakeSelfie);
    document.querySelector('.send-code-btn').addEventListener('click', sendVerificationCode);
});

// مزايا الحسابات الموثقة
const VERIFIED_FEATURES = {
    MAX_DAILY_MESSAGES: 100,
    MAX_DAILY_GIFTS: 20,
    PROFILE_BOOST_HOURS: 24,
    EXCLUSIVE_GIFTS: ['diamond_ring', 'luxury_car', 'private_jet'],
    SUPPORT_PRIORITY: 1
};

// تحديث حالة المزايا
function updateVerifiedFeatures(userId) {
    if (!isUserVerified(userId)) return;

    // تحديث عدادات الملف الشخصي
    updateProfileCounters(userId);
    
    // تمييز المستخدم في نتائج البحث
    highlightVerifiedUser(userId);
    
    // تفعيل المزايا الحصرية
    enableExclusiveFeatures(userId);
}

// تحديث عدادات الملف الشخصي
async function updateProfileCounters(userId) {
    try {
        const stats = await getUserStats(userId);
        
        document.getElementById('profile-views').textContent = stats.views;
        document.getElementById('profile-likes').textContent = stats.likes;
        
        // تحديث مؤشر النشاط
        updateActivityStatus(userId, stats.lastActive);
    } catch (error) {
        console.error('خطأ في تحديث إحصائيات الملف الشخصي:', error);
    }
}

// تمييز المستخدم الموثق في نتائج البحث
function highlightVerifiedUser(userId) {
    const userCards = document.querySelectorAll(`.user-card[data-user-id="${userId}"]`);
    userCards.forEach(card => {
        card.classList.add('verified');
        
        // إضافة مؤشر النشاط
        const indicator = document.createElement('div');
        indicator.className = 'activity-indicator';
        card.appendChild(indicator);
    });
}

// تفعيل المزايا الحصرية
function enableExclusiveFeatures(userId) {
    // تفعيل الهدايا الحصرية
    enableExclusiveGifts(userId);
    
    // تفعيل الفلترة المتقدمة
    enableAdvancedFilters(userId);
    
    // تفعيل المحادثات غير المحدودة
    enableUnlimitedChats(userId);
}

// تفعيل الهدايا الحصرية
function enableExclusiveGifts(userId) {
    const giftsGrid = document.getElementById('gifts-grid');
    if (!giftsGrid) return;

    // إضافة الهدايا الحصرية
    VERIFIED_FEATURES.EXCLUSIVE_GIFTS.forEach(giftId => {
        const gift = getGiftDetails(giftId);
        const giftElement = createGiftElement(gift);
        giftElement.classList.add('exclusive-gift');
        giftsGrid.prepend(giftElement);
    });
}

// تفعيل الفلترة المتقدمة
function enableAdvancedFilters(userId) {
    const searchFilters = document.querySelector('.search-filters');
    if (!searchFilters) return;

    // إضافة فلاتر متقدمة
    const advancedFilters = `
        <div class="filter-group advanced">
            <h4>فلاتر متقدمة</h4>
            <label>
                <input type="checkbox" name="verified_only">
                الحسابات الموثقة فقط
            </label>
            <label>
                <input type="checkbox" name="active_recently">
                نشط خلال 24 ساعة
            </label>
            <label>
                <input type="checkbox" name="with_photo">
                لديه صور شخصية
            </label>
        </div>
    `;
    
    searchFilters.insertAdjacentHTML('beforeend', advancedFilters);
}

// تفعيل المحادثات غير المحدودة
function enableUnlimitedChats(userId) {
    // إزالة حد المحادثات اليومي
    localStorage.removeItem(`chat_limit_${userId}`);
    
    // تحديث واجهة المحادثات
    const chatLimitIndicator = document.querySelector('.chat-limit');
    if (chatLimitIndicator) {
        chatLimitIndicator.innerHTML = `
            <i class="fas fa-infinity"></i>
            محادثات غير محدودة
        `;
    }
}

// تحديث مؤشر النشاط
function updateActivityStatus(userId, lastActive) {
    const indicator = document.querySelector(`.activity-indicator[data-user-id="${userId}"]`);
    if (!indicator) return;

    const now = new Date();
    const lastActiveTime = new Date(lastActive);
    const diffMinutes = Math.floor((now - lastActiveTime) / 1000 / 60);

    if (diffMinutes < 5) {
        indicator.style.background = '#4CAF50'; // أخضر - نشط الآن
    } else if (diffMinutes < 60) {
        indicator.style.background = '#FFC107'; // أصفر - نشط خلال الساعة
    } else {
        indicator.style.background = '#9E9E9E'; // رمادي - غير نشط
    }
}

// التحقق من حالة التوثيق
function isUserVerified(userId) {
    // في الواقع، سيتم التحقق من قاعدة البيانات
    return localStorage.getItem(`verified_${userId}`) === 'true';
}

// الحصول على إحصائيات المستخدم
async function getUserStats(userId) {
    // في الواقع، سيتم جلب الإحصائيات من الخادم
    return {
        views: Math.floor(Math.random() * 1000),
        likes: Math.floor(Math.random() * 500),
        lastActive: new Date()
    };
}

// تحديث المزايا عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    const currentUserId = getCurrentUserId();
    if (isUserVerified(currentUserId)) {
        updateVerifiedFeatures(currentUserId);
    }
});

// تحسين نظام التقارير
function setupReportSystem() {
    const reportForm = document.getElementById('report-form');
    const reportModal = document.getElementById('report-modal');
    
    if (reportForm) {
        reportForm.addEventListener('submit', handleReportSubmission);
    }

    // إضافة زر التقرير لكل مستخدم
    document.querySelectorAll('.user-card').forEach(card => {
        const reportBtn = document.createElement('button');
        reportBtn.className = 'report-btn';
        reportBtn.innerHTML = '<i class="fas fa-flag"></i>';
        reportBtn.onclick = () => showReportModal(card.dataset.userId);
        card.appendChild(reportBtn);
    });
}

// معالجة تقديم التقرير
async function handleReportSubmission(e) {
    e.preventDefault();
    
    const reportType = document.getElementById('report-type').value;
    const description = document.getElementById('report-description').value;
    const evidence = document.getElementById('report-evidence').files[0];

    try {
        const formData = new FormData();
        formData.append('type', reportType);
        formData.append('description', description);
        if (evidence) {
            formData.append('evidence', evidence);
        }

        const response = await fetch('/api/reports/submit', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            showNotification('تم تقديم البلاغ بنجاح', 'success');
            closeModal('report-modal');
        } else {
            throw new Error('فشل تقديم البلاغ');
        }
    } catch (error) {
        showNotification('حدث خطأ أثناء تقديم البلاغ', 'error');
        console.error('خطأ في تقديم البلاغ:', error);
    }
}

// نظام الحظر
function blockUser(userId) {
    const blockModal = document.getElementById('block-modal');
    const confirmBlockBtn = document.getElementById('confirm-block');
    
    if (blockModal && confirmBlockBtn) {
        blockModal.style.display = 'block';
        confirmBlockBtn.onclick = async () => {
            try {
                const response = await fetch('/api/users/block', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ userId })
                });

                if (response.ok) {
                    showNotification('تم حظر المستخدم بنجاح', 'success');
                    closeModal('block-modal');
                    // تحديث واجهة المستخدم
                    updateUIAfterBlock(userId);
                } else {
                    throw new Error('فشل حظر المستخدم');
                }
            } catch (error) {
                showNotification('حدث خطأ أثناء حظر المستخدم', 'error');
                console.error('خطأ في حظر المستخدم:', error);
            }
        };
    }
}

// تحديث واجهة المستخدم بعد الحظر
function updateUIAfterBlock(userId) {
    // إزالة المستخدم من قائمة المحادثات
    const conversationItem = document.querySelector(`.conversation-item[data-id="${userId}"]`);
    if (conversationItem) {
        conversationItem.remove();
    }

    // إزالة المستخدم من نتائج البحث
    const userCard = document.querySelector(`.user-card[data-user-id="${userId}"]`);
    if (userCard) {
        userCard.remove();
    }

    // إغلاق نافذة المحادثة إذا كانت مفتوحة
    const chatWindow = document.querySelector('.chat-window');
    if (chatWindow && chatWindow.dataset.userId === userId) {
        chatWindow.style.display = 'none';
    }
}

// نظام الإشعارات
function showNotification(message, type = 'info') {
    Toastify({
        text: message,
        duration: 3000,
        gravity: "top",
        position: 'left',
        className: `notification-${type}`,
        style: {
            background: type === 'success' ? '#4CAF50' : 
                       type === 'error' ? '#f44336' : 
                       type === 'warning' ? '#ff9800' : '#2196F3'
        }
    }).showToast();
}

// تحسين نظام المحادثات
function setupChatSystem() {
    const socket = io();
    
    socket.on('connect', () => {
        console.log('تم الاتصال بالخادم');
    });

    socket.on('new_message', (data) => {
        displayMessage(data);
        updateConversationsList();
        showNotification('رسالة جديدة من ' + data.senderName);
    });

    socket.on('user_blocked', (data) => {
        updateUIAfterBlock(data.userId);
        showNotification('تم حظر المستخدم ' + data.userName);
    });

    socket.on('user_reported', (data) => {
        showNotification('تم استلام بلاغك وسيتم مراجعته', 'info');
    });
}

// تحسين نظام التحقق من الهوية
function enhanceVerification() {
    const verificationBadge = document.querySelector('.verification-badge');
    if (verificationBadge) {
        verificationBadge.addEventListener('click', () => {
            if (!isVerified) {
                startVerification();
            }
        });
    }
}

// تهيئة جميع الأنظمة
document.addEventListener('DOMContentLoaded', () => {
    setupReportSystem();
    setupChatSystem();
    enhanceVerification();
    
    // إضافة مستمعي الأحداث للأزرار
    document.querySelectorAll('.block-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const userId = e.target.closest('[data-user-id]').dataset.userId;
            blockUser(userId);
        });
    });
});
