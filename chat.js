// تهيئة المتغيرات
const chatMessages = document.getElementById('chatMessages');
const userMessageInput = document.getElementById('userMessage');
const sendMessageButton = document.getElementById('sendMessage');
const suggestionButtons = document.querySelectorAll('.suggestion-btn');

// رسائل الترحيب
const welcomeMessages = [
    'مرحباً بك في دردشة القلوب! كيف يمكنني مساعدتك اليوم؟',
    'أهلاً! أنا هنا للإجابة على أسئلتك حول المشاعر والعلاقات',
    'مرحباً! دعنا نتحدث عن كل ما يخص القلب والمشاعر'
];

// قائمة الردود الذكية
const smartResponses = {
    'كيف أعبر عن مشاعري؟': [
        'التعبير عن المشاعر يبدأ بالصدق مع النفس أولاً',
        'يمكنك البدء بكتابة ما تشعر به في رسالة',
        'أحياناً الأفعال البسيطة تعبر أكثر من الكلمات'
    ],
    'نصائح للعلاقات الناجحة': [
        'الصدق والشفافية هما أساس العلاقات الناجحة',
        'التواصل المستمر والاحترام المتبادل مهمان جداً',
        'تقبل الاختلافات وفهم وجهة نظر الطرف الآخر'
    ],
    'كيف أتجاوز الخجل؟': [
        'ابدأ بخطوات صغيرة وتدرج في بناء ثقتك',
        'تذكر أن الجميع يمر بلحظات خجل، هذا أمر طبيعي',
        'ركز على نقاط قوتك وما يميزك'
    ],
    'علامات الحب الحقيقي': [
        'الحب الحقيقي يظهر في الأفعال قبل الكلمات',
        'الاهتمام بتفاصيل الطرف الآخر وسعادته',
        'القدرة على التضحية والعطاء دون انتظار المقابل'
    ]
};

// إضافة رسالة للمحادثة
function addMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// معالجة رسالة المستخدم
function handleUserMessage(message) {
    addMessage(message, true);
    
    // تأخير قصير قبل الرد
    setTimeout(() => {
        let response = '';
        
        // البحث عن رد مناسب
        for (const [key, responses] of Object.entries(smartResponses)) {
            if (message.includes(key) || message.toLowerCase().includes(key.toLowerCase())) {
                response = responses[Math.floor(Math.random() * responses.length)];
                break;
            }
        }
        
        // إذا لم يجد رداً مناسباً
        if (!response) {
            const defaultResponses = [
                'شكراً لمشاركتك مشاعرك. هل تريد أن تخبرني المزيد؟',
                'أفهم ما تقصد. كيف تشعر حيال ذلك؟',
                'هذا مثير للاهتمام. هل يمكنك أن تشارك المزيد من تجربتك؟'
            ];
            response = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
        }
        
        addMessage(response);
    }, 1000);
}

// إضافة رسالة ترحيب عند تحميل الصفحة
window.addEventListener('load', () => {
    const welcomeMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
    addMessage(welcomeMessage);
});

// معالجة النقر على زر الإرسال
sendMessageButton.addEventListener('click', () => {
    const message = userMessageInput.value.trim();
    if (message) {
        handleUserMessage(message);
        userMessageInput.value = '';
    }
});

// معالجة ضغط Enter
userMessageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const message = userMessageInput.value.trim();
        if (message) {
            handleUserMessage(message);
            userMessageInput.value = '';
        }
    }
});

// معالجة النقر على الأزرار المقترحة
suggestionButtons.forEach(button => {
    button.addEventListener('click', () => {
        const message = button.textContent;
        handleUserMessage(message);
    });
});
