// تهيئة المتغيرات
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

// أسماء الأشهر بالعربية
const months = [
    'يناير', 'فبراير', 'مارس', 'إبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
];

// المناسبات المهمة
const events = [
    { date: '2025-02-14', title: 'عيد الحب', type: 'love', description: 'احتفل مع من تحب بهذه المناسبة الخاصة' },
    { date: '2025-03-21', title: 'عيد الأم', type: 'family', description: 'عبر عن حبك وتقديرك لأمك في يومها الخاص' },
    // يمكن إضافة المزيد من المناسبات هنا
];

// تهيئة التقويم عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    initializeCalendar();
    setupEventListeners();
    renderCalendar();
    updateUpcomingEvents();
});

// تهيئة التقويم
function initializeCalendar() {
    const prevButton = document.getElementById('prevMonth');
    const nextButton = document.getElementById('nextMonth');
    
    if (prevButton && nextButton) {
        prevButton.addEventListener('click', () => navigateMonth(-1));
        nextButton.addEventListener('click', () => navigateMonth(1));
    }
}

// إعداد مستمعي الأحداث
function setupEventListeners() {
    // زر إضافة مناسبة جديدة
    const addEventButton = document.querySelector('[onclick="addNewEvent()"]');
    if (addEventButton) {
        addEventButton.addEventListener('click', addNewEvent);
    }

    // زر تصفية المناسبات
    const filterButton = document.querySelector('[onclick="showCategories()"]');
    if (filterButton) {
        filterButton.addEventListener('click', showCategories);
    }

    // أزرار التذكير وأفكار الهدايا
    document.querySelectorAll('.event-actions .btn').forEach(button => {
        button.addEventListener('click', handleEventAction);
    });
}

// التنقل بين الأشهر
function navigateMonth(direction) {
    currentMonth += direction;
    
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    } else if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    
    renderCalendar();
}

// عرض التقويم
function renderCalendar() {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDayIndex = firstDay.getDay();
    const totalDays = lastDay.getDate();
    
    // تحديث عنوان الشهر
    const monthTitle = document.getElementById('currentMonth');
    if (monthTitle) {
        monthTitle.textContent = `${months[currentMonth]} ${currentYear}`;
    }
    
    // تجهيز أيام التقويم
    const calendarDates = document.getElementById('calendarDates');
    if (!calendarDates) return;

    let datesHTML = '';
    
    // الأيام الفارغة في بداية الشهر
    for (let i = 0; i < startDayIndex; i++) {
        datesHTML += '<div class="date-cell empty"></div>';
    }
    
    // أيام الشهر
    for (let day = 1; day <= totalDays; day++) {
        const date = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const event = events.find(e => e.date === date);
        const isToday = isCurrentDate(day);
        
        datesHTML += `
            <div class="date-cell ${isToday ? 'today' : ''} ${event ? 'has-event' : ''}" 
                 data-date="${date}" 
                 onclick="showEventDetails('${date}')">
                ${day}
                ${event ? '<div class="event-indicator"></div>' : ''}
            </div>
        `;
    }
    
    calendarDates.innerHTML = datesHTML;
}

// التحقق من اليوم الحالي
function isCurrentDate(day) {
    const today = new Date();
    return day === today.getDate() && 
           currentMonth === today.getMonth() && 
           currentYear === today.getFullYear();
}

// إضافة مناسبة جديدة
function addNewEvent() {
    const modal = createModal({
        title: 'إضافة مناسبة جديدة',
        content: `
            <form id="newEventForm" class="event-form">
                <div class="form-group">
                    <label>عنوان المناسبة</label>
                    <input type="text" name="title" required>
                </div>
                <div class="form-group">
                    <label>التاريخ</label>
                    <input type="date" name="date" required>
                </div>
                <div class="form-group">
                    <label>النوع</label>
                    <select name="type">
                        <option value="love">رومانسي</option>
                        <option value="family">عائلي</option>
                        <option value="love">عيد الحب</option>
                        <option value="love">عيد الام</option>
                        <option value="personal">شخصي</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>الوصف</label>
                    <textarea name="description"></textarea>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn primary">حفظ</button>
                    <button type="button" class="btn" onclick="closeModal()">إلغاء</button>
                </div>
            </form>
        `
    });

    const form = modal.querySelector('#newEventForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        events.push({
            title: formData.get('title'),
            date: formData.get('date'),
            type: formData.get('type'),
            description: formData.get('description')
        });
        closeModal();
        renderCalendar();
        updateUpcomingEvents();
        showMessage('تمت إضافة المناسبة بنجاح');
    });
}

// عرض تصنيفات المناسبات
function showCategories() {
    const modal = createModal({
        title: 'تصفية المناسبات',
        content: `
            <div class="categories-list">
                <label class="category-item">
                    <input type="checkbox" value="love" checked> مناسبات رومانسية
                </label>
                <label class="category-item">
                    <input type="checkbox" value="family" checked> مناسبات عائلية
                </label>
                                <label class="category-item">
                    <input type="checkbox" value="family" checked> مناسبات عيد الحب
                </label>
                                <label class="category-item">
                    <input type="checkbox" value="family" checked> مناسبات عيد الام
                </label>
                <label class="category-item">
                    <input type="checkbox" value="personal" checked> مناسبات شخصية
                </label>
            </div>
            <div class="modal-actions">
                <button class="btn primary" onclick="applyFilters()">تطبيق</button>
                <button class="btn" onclick="closeModal()">إلغاء</button>
            </div>
        `
    });
}

// معالجة أحداث الأزرار
function handleEventAction(e) {
    const button = e.target.closest('.btn');
    if (!button) return;

    const eventCard = button.closest('.event-card');
    const eventTitle = eventCard.querySelector('h3').textContent;
    
    if (button.innerHTML.includes('fa-bell')) {
        toggleReminder(eventTitle);
    } else if (button.innerHTML.includes('fa-gift') || button.innerHTML.includes('fa-heart')) {
        showIdeasModal(eventTitle);
    } else if (button.innerHTML.includes('fa-trash')) {
        deleteEvent(e);
    }
}

// إنشاء نافذة منبثقة
function createModal({ title, content }) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="close-btn" onclick="closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    return modal;
}

// تبديل حالة التذكير
function toggleReminder(eventTitle) {
    const isSet = localStorage.getItem(`reminder_${eventTitle}`);
    
    if (isSet) {
        localStorage.removeItem(`reminder_${eventTitle}`);
        showMessage('تم إلغاء التذكير');
    } else {
        localStorage.setItem(`reminder_${eventTitle}`, 'true');
        showMessage('سيتم تذكيرك بهذه المناسبة');
    }
}

// عرض نافذة الأفكار
function showIdeasModal(eventTitle) {
    const modal = createModal({
        title: `أفكار ل${eventTitle}`,
        content: `
            <div class="ideas-list">
                <div class="idea-item">
                    <h4>فكرة رومانسية</h4>
                    <p>نزهة تحت ضوء القمر</p>
                </div>
                <div class="idea-item">
                    <h4>هدية مميزة</h4>
                    <p>ألبوم صور مخصص</p>
                </div>
                <div class="idea-item">
                    <h4>نشاط ممتع</h4>
                    <p>طبخ وجبة خاصة معاً</p>
                </div>
            </div>
            <button class="btn primary" onclick="closeModal()">إغلاق</button>
        `
    });
}

// عرض تفاصيل المناسبة
function showEventDetails(date) {
    const event = events.find(e => e.date === date);
    if (!event) return;

    const modal = createModal({
        title: event.title,
        content: `
            <div class="event-details">
                <div class="event-category ${event.type}">${event.type === 'love' ? 'رومانسي' : 'عائلي'}</div>
                <p>${event.description}</p>
                <div class="event-actions">
                    <button class="btn secondary" onclick="showIdeasModal('${event.title}')">
                        <i class="fas fa-gift"></i> أفكار للاحتفال
                    </button>
                    <button class="btn primary" onclick="toggleReminder('${event.title}')">
                        <i class="fas fa-bell"></i> تذكير
                    </button>
                    <button class="btn danger" onclick="handleEventAction(event)">
                        <i class="fas fa-trash"></i> حذف
                    </button>
                </div>
            </div>
        `
    });
}

// حذف المناسبة
function deleteEvent(event) {
    event.preventDefault();
    const eventCard = event.target.closest('.event-card');
    const eventId = eventCard.dataset.eventId;
    
    if (confirm('هل أنت متأكد من حذف هذه المناسبة؟')) {
        // إضافة تأثير حركي قبل الحذف
        eventCard.classList.add('removing');
        
        // حذف المناسبة من التخزين المحلي
        let events = JSON.parse(localStorage.getItem('events') || '[]');
        events = events.filter(e => e.id !== eventId);
        localStorage.setItem('events', JSON.stringify(events));
        
        // حذف التذكيرات المرتبطة بالمناسبة
        let reminders = JSON.parse(localStorage.getItem('reminders') || '[]');
        reminders = reminders.filter(r => r.eventId !== eventId);
        localStorage.setItem('reminders', JSON.stringify(reminders));
        
        // إزالة العنصر من DOM بعد انتهاء التأثير الحركي
        setTimeout(() => {
            eventCard.remove();
            updateUpcomingEvents();
            showMessage('تم حذف المناسبة بنجاح');
        }, 300);
    }
}

// إغلاق النوافذ المنبثقة
function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

// عرض رسالة للمستخدم
function showMessage(text, isError = false) {
    const message = document.createElement('div');
    message.className = `message ${isError ? 'error' : ''}`;
    message.textContent = text;
    document.body.appendChild(message);
    
    // إزالة الرسالة بعد 3 ثواني
    setTimeout(() => {
        message.remove();
    }, 3000);
}

// معالجة تحميل الصور
document.getElementById('eventImage').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('imagePreview');
            preview.innerHTML = `<img src="${e.target.result}" alt="معاينة الصورة">`;
            preview.classList.remove('empty');
        };
        reader.readAsDataURL(file);
    }
});

// مصفوفة لتخزين الأفكار
let eventIdeas = [];

// إضافة فكرة جديدة
function addNewIdea() {
    const ideaInput = document.getElementById('eventIdeas');
    const idea = ideaInput.value.trim();
    
    if (idea) {
        eventIdeas.push(idea);
        updateIdeasList();
        ideaInput.value = '';
    }
}

// تحديث قائمة الأفكار
function updateIdeasList() {
    const ideasList = document.getElementById('ideasList');
    ideasList.innerHTML = eventIdeas.map((idea, index) => `
        <div class="idea-item">
            <span>${idea}</span>
            <button type="button" class="delete-idea" onclick="deleteIdea(${index})">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
}

// حذف فكرة
function deleteIdea(index) {
    eventIdeas.splice(index, 1);
    updateIdeasList();
}

// تحديث معالج نموذج إضافة المناسبة
document.getElementById('addEventForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const imageFile = document.getElementById('eventImage').files[0];
    let imageData = null;
    
    if (imageFile) {
        imageData = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(imageFile);
        });
    }
    
    const event = {
        id: Date.now().toString(),
        title: document.getElementById('eventTitle').value,
        date: document.getElementById('eventDate').value,
        description: document.getElementById('eventDescription').value,
        type: document.getElementById('eventType').value,
        image: imageData,
        ideas: [...eventIdeas]
    };
    
    // حفظ المناسبة في التخزين المحلي
    let events = JSON.parse(localStorage.getItem('events') || '[]');
    events.push(event);
    localStorage.setItem('events', JSON.stringify(events));
    
    // تحديث عرض المناسبات
    renderEvents();
    
    // إعادة تعيين النموذج
    this.reset();
    document.getElementById('imagePreview').innerHTML = '';
    document.getElementById('imagePreview').classList.add('empty');
    eventIdeas = [];
    updateIdeasList();
    
    // إغلاق النافذة المنبثقة
    closeModal('addEventModal');
    updateUpcomingEvents();
    showMessage('تم إضافة المناسبة بنجاح');
});

// تحديث دالة عرض المناسبات لتشمل الصورة والأفكار
function renderEventCard(event) {
    return `
        <div class="event-card" data-event-id="${event.id}">
            ${event.image ? `
                <div class="event-image">
                    <img src="${event.image}" alt="${event.title}">
                </div>
            ` : ''}
            <h3>${event.title}</h3>
            <p>${event.description}</p>
            ${event.ideas && event.ideas.length > 0 ? `
                <div class="event-ideas">
                    <h4>الأفكار:</h4>
                    <ul>
                        ${event.ideas.map(idea => `<li>${idea}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
            <div class="event-actions">
                <button class="btn btn-reminder" onclick="toggleReminder(event)">
                    <i class="fas fa-bell"></i>
                    تذكير
                </button>
                <button class="btn btn-ideas" onclick="showIdeas(event)">
                    <i class="fas fa-gift"></i>
                    أفكار
                </button>
                <button class="btn btn-delete" onclick="deleteEvent(event)">
                    <i class="fas fa-trash"></i>
                    حذف
                </button>
            </div>
        </div>
    `;
}

// تحديث المناسبات القادمة
function updateUpcomingEvents() {
    const upcomingEventsList = document.getElementById('upcomingEventsList');
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    const today = new Date();
    
    // ترتيب المناسبات حسب التاريخ
    const upcomingEvents = events
        .filter(event => new Date(event.date) >= today)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5); // عرض أقرب 5 مناسبات
    
    if (upcomingEvents.length === 0) {
        upcomingEventsList.innerHTML = '<p class="no-events">لا توجد مناسبات قادمة</p>';
        return;
    }
    
    upcomingEventsList.innerHTML = upcomingEvents.map(event => {
        const eventDate = new Date(event.date);
        const daysUntil = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));
        
        return `
            <div class="upcoming-event-card">
                ${event.image ? `
                    <div class="event-image">
                        <img src="${event.image}" alt="${event.title}">
                    </div>
                ` : ''}
                <div class="event-date">${formatDate(eventDate)}</div>
                <h3>${event.title}</h3>
                <p>${event.description}</p>
                <div class="countdown">
                    متبقي: ${formatDaysUntil(daysUntil)}
                </div>
                <span class="event-type">${getEventTypeText(event.type)}</span>
                <div class="event-actions">
                    <button class="btn btn-reminder" onclick="toggleReminder(event)">
                        <i class="fas fa-bell"></i>
                        تذكير
                    </button>
                    ${event.ideas && event.ideas.length > 0 ? `
                        <button class="btn btn-ideas" onclick="showIdeas(event)">
                            <i class="fas fa-gift"></i>
                            أفكار (${event.ideas.length})
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}

// تنسيق عدد الأيام المتبقية
function formatDaysUntil(days) {
    if (days === 0) return 'اليوم!';
    if (days === 1) return 'غداً';
    return `${days} يوم`;
}

// تحويل نوع المناسبة إلى نص
function getEventTypeText(type) {
    const types = {
        'love': 'رومانسي',
        'family': 'عائلي',
        'personal': 'شخصي',
        'valentines': 'عيد الحب',
        'mothers': 'عيد الأم'
    };
    return types[type] || type;
}
