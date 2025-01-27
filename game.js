document.addEventListener('DOMContentLoaded', () => {
    const characters = document.querySelectorAll('.character');
    const chatContainer = document.querySelector('.chat-container');
    const chatMessages = document.querySelector('.chat-messages');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendMessage');
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'typing-indicator';
    typingIndicator.innerHTML = '<span></span><span></span><span></span>';
    
    let selectedCharacter = null;
    let botCharacter = null;
    let conversationContext = [];

    // قاعدة بيانات الردود المحسنة
    const responses = {
        aseel: {
            greetings: [
                'أهلاً وسهلاً! 🌸 كيف حالك اليوم؟',
                'مرحباً! يسعدني جداً التحدث معك 💝',
                'أهلاً! أتمنى أن يكون يومك مليئاً بالسعادة ✨'
            ],
            love: [
                'الحب هو أجمل ما في الوجود 💕 يجعل كل شيء أكثر جمالاً',
                'عندما نحب بصدق، نرى العالم بألوان مختلفة وأجمل 🌈',
                'الحب يجعل القلب ينبض بسعادة لا توصف 💝'
            ],
            hobbies: [
                'أحب القراءة والرسم، وأستمتع بالموسيقى الهادئة 🎨',
                'أقضي وقتاً ممتعاً في تعلم أشياء جديدة كل يوم 📚',
                'أحب التنزه في الحدائق وتأمل جمال الطبيعة 🌸'
            ],
            life: [
                'الحياة مليئة بالفرص الجميلة، علينا فقط أن نراها 🌟',
                'كل يوم جديد هو فرصة لتحقيق أحلامنا ✨',
                'أؤمن أن السعادة تكمن في الأشياء البسيطة 💫'
            ],
            compliments: [
                'شكراً لك! كلماتك تسعدني كثيراً 💝',
                'أنت شخص رائع! أسعد كثيراً بالحديث معك ✨',
                'كم أنت لطيف! تجعل يومي أجمل 🌸'
            ],
            default: [
                'هذا رائع! أخبرني المزيد 💫',
                'ما تقوله يثير اهتمامي كثيراً ✨',
                'يسعدني سماع أفكارك الجميلة 🌟'
            ]
        },
        mohammed: {
            greetings: [
                'السلام عليكم! 😊 كيف حالك اليوم؟',
                'مرحباً! يسعدني التحدث معك 🌟',
                'أهلاً بك! أتمنى أن يكون يومك رائعاً ✨'
            ],
            love: [
                'الحب شعور نبيل يجعلنا أشخاصاً أفضل 💫',
                'عندما نحب بصدق، نرى جمال الحياة بشكل مختلف 💝',
                'الحب يملأ القلب بالسعادة والأمل ✨'
            ],
            hobbies: [
                'أحب الرياضة والقراءة، وأستمتع بالسفر واكتشاف أماكن جديدة 🌍',
                'أقضي وقتاً ممتعاً في تطوير مهاراتي وتعلم أشياء جديدة 📚',
                'أحب الموسيقى والفن، وأستمتع بالطبيعة 🎨'
            ],
            life: [
                'الحياة رحلة جميلة نتعلم منها كل يوم 🌟',
                'أؤمن أن النجاح يأتي مع المثابرة والعمل الجاد ✨',
                'كل تحدٍ هو فرصة للنمو والتطور 💫'
            ],
            compliments: [
                'شكراً جزيلاً! كلماتك تعني الكثير 💫',
                'أنت شخص مميز! أسعد بالحديث معك ✨',
                'كم أنت رائع! تجعل المحادثة أجمل 🌟'
            ],
            default: [
                'هذا رائع! أخبرني المزيد عن تجربتك 💫',
                'ما تشاركه معي مثير للاهتمام ✨',
                'يسعدني سماع وجهة نظرك 🌟'
            ]
        }
    };

    // إضافة تأثيرات صوتية
    const messageSound = new Audio('message-sound.mp3');
    messageSound.volume = 0.5;

    // اختيار الشخصية
    characters.forEach(char => {
        char.addEventListener('click', () => {
            characters.forEach(c => c.classList.remove('selected'));
            char.classList.add('selected');
            selectedCharacter = char.dataset.character;
            botCharacter = selectedCharacter === 'aseel' ? 'mohammed' : 'aseel';
            chatContainer.style.display = 'block';
            
            // رسالة ترحيب مع إيموجي
            const greeting = getRandomResponse('greetings');
            showTypingIndicator();
            setTimeout(() => {
                removeTypingIndicator();
                addMessage(greeting, 'bot');
                playMessageSound();
            }, 1500);
        });
    });

    // إرسال رسالة
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const message = messageInput.value.trim();
        if (message && selectedCharacter) {
            addMessage(message, 'user');
            playMessageSound();
            messageInput.value = '';

            // إضافة مؤشر الكتابة
            showTypingIndicator();

            // تحليل السياق وإنشاء رد مناسب
            setTimeout(() => {
                const responseType = detectMessageType(message);
                const response = getSmartResponse(message, responseType);
                removeTypingIndicator();
                addMessage(response, 'bot');
                playMessageSound();
            }, 1500 + Math.random() * 1000);
        }
    }

    function addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', type);
        
        // إضافة الصورة المصغرة
        const avatar = document.createElement('img');
        avatar.className = 'message-avatar';
        avatar.src = type === 'bot' ? 
            `${botCharacter}-avatar.png` : 
            `${selectedCharacter}-avatar.png`;
        
        const textDiv = document.createElement('div');
        textDiv.className = 'message-text';
        textDiv.textContent = text;

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(textDiv);
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showTypingIndicator() {
        chatMessages.appendChild(typingIndicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function removeTypingIndicator() {
        if (typingIndicator.parentNode === chatMessages) {
            chatMessages.removeChild(typingIndicator);
        }
    }

    function getSmartResponse(message, type) {
        const characterResponses = responses[botCharacter];
        const responseArray = characterResponses[type] || characterResponses.default;
        
        // حفظ سياق المحادثة
        conversationContext.push({ message, type });
        if (conversationContext.length > 5) conversationContext.shift();

        return responseArray[Math.floor(Math.random() * responseArray.length)];
    }

    function detectMessageType(message) {
        message = message.toLowerCase();
        
        // تحسين الكشف عن نوع الرسالة
        if (message.match(/(مرحبا|اهلا|السلام|صباح|مساء)/)) {
            return 'greetings';
        }
        if (message.match(/(حب|قلب|مشاعر|عاطفة|غرام|عشق)/)) {
            return 'love';
        }
        if (message.match(/(هواية|تحب|تفعل|تستمتع)/)) {
            return 'hobbies';
        }
        if (message.match(/(حياة|مستقبل|حلم|هدف|طموح)/)) {
            return 'life';
        }
        if (message.match(/(جميل|رائع|ممتاز|احسنت|شكرا)/)) {
            return 'compliments';
        }
        return 'default';
    }

    function playMessageSound() {
        messageSound.currentTime = 0;
        messageSound.play().catch(() => {});
    }

    function getRandomResponse(type) {
        const characterResponses = responses[botCharacter];
        const responseArray = characterResponses[type] || characterResponses.default;
        return responseArray[Math.floor(Math.random() * responseArray.length)];
    }
});
