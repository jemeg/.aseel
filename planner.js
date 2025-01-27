// تهيئة المتغيرات
let currentMood = '';
let goals = [];
let events = [];

// يوميات المشاعر
document.querySelectorAll('.mood-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentMood = btn.dataset.mood;
    });
});

// حفظ اليوميات
document.querySelector('.mood-tracker .btn-primary').addEventListener('click', () => {
    const notes = document.querySelector('.mood-tracker textarea').value;
    if (currentMood && notes) {
        saveMoodEntry(currentMood, notes);
        showMessage('تم حفظ مشاعرك بنجاح!');
        updateMoodChart();
    } else {
        showMessage('الرجاء اختيار حالتك المزاجية وكتابة ملاحظاتك', 'error');
    }
});

// حفظ بيانات المشاعر
function saveMoodEntry(mood, notes) {
    const entry = {
        date: new Date(),
        mood: mood,
        notes: notes
    };
    
    let moodEntries = JSON.parse(localStorage.getItem('moodEntries') || '[]');
    moodEntries.push(entry);
    localStorage.setItem('moodEntries', JSON.stringify(moodEntries));
}

// تحديث الرسم البياني للمشاعر
function updateMoodChart() {
    const ctx = document.getElementById('moodChart').getContext('2d');
    const moodEntries = JSON.parse(localStorage.getItem('moodEntries') || '[]');
    
    const moodCounts = {
        happy: 0,
        neutral: 0,
        sad: 0,
        excited: 0,
        angry: 0
    };
    
    moodEntries.forEach(entry => {
        moodCounts[entry.mood]++;
    });
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['سعيد', 'محايد', 'حزين', 'متحمس', 'غاضب'],
            datasets: [{
                label: 'المشاعر الأسبوعية',
                data: Object.values(moodCounts),
                backgroundColor: [
                    '#4CAF50',
                    '#9E9E9E',
                    '#2196F3',
                    '#FF9800',
                    '#F44336'
                ]
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// تتبع الأهداف
document.querySelector('.goals-tracker .btn-secondary').addEventListener('click', () => {
    showGoalModal();
});

// إضافة هدف جديد
function showGoalModal() {
    const modal = document.createElement('div');
    modal.className = 'modal goal-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>إضافة هدف جديد</h3>
            <form id="goal-form">
                <div class="form-group">
                    <label>الهدف</label>
                    <input type="text" required>
                </div>
                <div class="form-group">
                    <label>التاريخ المستهدف</label>
                    <input type="date" required>
                </div>
                <button type="submit" class="btn btn-primary">إضافة</button>
            </form>
            <button class="btn btn-secondary" onclick="closeModal()">إغلاق</button>
        </div>
    `;
    document.body.appendChild(modal);
    
    modal.querySelector('form').addEventListener('submit', (e) => {
        e.preventDefault();
        const goal = {
            text: e.target.querySelector('input[type="text"]').value,
            date: e.target.querySelector('input[type="date"]').value,
            progress: 0
        };
        addGoal(goal);
        closeModal();
    });
}

// إضافة هدف
function addGoal(goal) {
    goals.push(goal);
    updateGoals();
    showMessage('تم إضافة الهدف بنجاح!');
}

// تحديث قائمة الأهداف
function updateGoals() {
    const container = document.querySelector('.goals-tracker');
    container.innerHTML = goals.map((goal, index) => `
        <div class="goal-item">
            <input type="checkbox" id="goal${index}" ${goal.progress === 100 ? 'checked' : ''}>
            <label for="goal${index}">${goal.text}</label>
            <div class="progress-bar">
                <div class="progress" style="width: ${goal.progress}%"></div>
            </div>
        </div>
    `).join('') + '<button class="btn btn-secondary">إضافة هدف جديد</button>';
    
    // إعادة تعيين مستمع الحدث لزر الإضافة
    container.querySelector('.btn-secondary').addEventListener('click', showGoalModal);
}

// تقويم المواعيد
function initCalendar() {
    const calendar = document.querySelector('.calendar-grid');
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days = [];
    for (let i = 0; i < firstDay.getDay(); i++) {
        days.push('');
    }
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
        days.push(i);
    }
    
    calendar.innerHTML = days.map(day => `
        <div class="calendar-day ${day ? 'has-date' : ''}" data-date="${day}">
            ${day}
        </div>
    `).join('');
}

// إضافة موعد
document.querySelector('.dates-calendar .btn-secondary').addEventListener('click', () => {
    showEventModal();
});

// عرض نافذة إضافة موعد
function showEventModal() {
    const modal = document.createElement('div');
    modal.className = 'modal event-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>إضافة موعد جديد</h3>
            <form id="event-form">
                <div class="form-group">
                    <label>العنوان</label>
                    <input type="text" required>
                </div>
                <div class="form-group">
                    <label>التاريخ</label>
                    <input type="date" required>
                </div>
                <div class="form-group">
                    <label>الوقت</label>
                    <input type="time" required>
                </div>
                <button type="submit" class="btn btn-primary">إضافة</button>
            </form>
            <button class="btn btn-secondary" onclick="closeModal()">إغلاق</button>
        </div>
    `;
    document.body.appendChild(modal);
    
    modal.querySelector('form').addEventListener('submit', (e) => {
        e.preventDefault();
        const event = {
            title: e.target.querySelector('input[type="text"]').value,
            date: e.target.querySelector('input[type="date"]').value,
            time: e.target.querySelector('input[type="time"]').value
        };
        addEvent(event);
        closeModal();
    });
}

// إضافة موعد
function addEvent(event) {
    events.push(event);
    updateCalendar();
    showMessage('تم إضافة الموعد بنجاح!');
}

// تحديث التقويم
function updateCalendar() {
    initCalendar();
    events.forEach(event => {
        const date = new Date(event.date);
        const day = date.getDate();
        const dayElement = document.querySelector(`.calendar-day[data-date="${day}"]`);
        if (dayElement) {
            dayElement.classList.add('has-event');
            dayElement.setAttribute('title', event.title);
        }
    });
}

// تحليل الأنشطة
function updateActivitiesChart() {
    const ctx = document.getElementById('activitiesChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['وقت نوعي', 'محادثات', 'أنشطة مشتركة', 'مواعيد'],
            datasets: [{
                data: [30, 25, 20, 25],
                backgroundColor: [
                    '#4CAF50',
                    '#2196F3',
                    '#FF9800',
                    '#9C27B0'
                ]
            }]
        },
        options: {
            responsive: true
        }
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

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', () => {
    initCalendar();
    updateMoodChart();
    updateActivitiesChart();
});
