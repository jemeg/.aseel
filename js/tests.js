// تهيئة المتغيرات
const startButtons = document.querySelectorAll('.start-test-btn');
const testCards = document.querySelectorAll('.test-card');

// بيانات الاختبارات
const tests = {
    personality: {
        title: 'اختبار نمط الشخصية',
        questions: [
            {
                question: 'كيف تفضل قضاء وقت فراغك؟',
                options: [
                    'مع الأصدقاء في مكان عام',
                    'في المنزل مع كتاب جيد',
                    'ممارسة الرياضة',
                    'العمل على مشروع إبداعي'
                ]
            },
            {
                question: 'كيف تتعامل مع المواقف العاطفية؟',
                options: [
                    'أعبر عن مشاعري مباشرة',
                    'أحتاج وقتاً للتفكير أولاً',
                    'أحاول فهم مشاعر الآخر',
                    'أتجنب المواجهة'
                ]
            },
            // يمكن إضافة المزيد من الأسئلة
        ]
    },
    loveLanguages: {
        title: 'اختبار لغات الحب',
        questions: [
            {
                question: 'ما الذي يجعلك تشعر بالحب أكثر؟',
                options: [
                    'الكلمات اللطيفة والمديح',
                    'الهدايا والمفاجآت',
                    'قضاء وقت خاص معاً',
                    'المساعدة في الأعمال اليومية'
                ]
            },
            {
                question: 'كيف تعبر عن حبك للآخرين؟',
                options: [
                    'أخبرهم مباشرة عن مشاعري',
                    'أقدم لهم الهدايا',
                    'أقضي معهم وقتاً نوعياً',
                    'أساعدهم في احتياجاتهم'
                ]
            },
            // يمكن إضافة المزيد من الأسئلة
        ]
    }
};

// بدء الاختبار
startButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const testCard = e.target.closest('.test-card');
        const testType = getTestType(testCard);
        
        if (testType && tests[testType]) {
            startTest(testType);
        }
    });
});

// تحديد نوع الاختبار
function getTestType(card) {
    for (const type in tests) {
        if (card.classList.contains(type)) {
            return type;
        }
    }
    return null;
}

// بدء الاختبار
function startTest(testType) {
    const test = tests[testType];
    const modal = createTestModal(test);
    document.body.appendChild(modal);
    
    // تهيئة الاختبار
    let currentQuestion = 0;
    const answers = [];
    
    showQuestion(currentQuestion, test.questions, answers);
}

// إنشاء نافذة الاختبار
function createTestModal(test) {
    const modal = document.createElement('div');
    modal.className = 'modal test-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>${test.title}</h3>
            <div id="questionContainer"></div>
        </div>
    `;
    return modal;
}

// عرض السؤال
function showQuestion(index, questions, answers) {
    const container = document.getElementById('questionContainer');
    const question = questions[index];
    
    if (index >= questions.length) {
        showResults(answers);
        return;
    }
    
    container.innerHTML = `
        <div class="question">
            <h4>${question.question}</h4>
            <div class="options">
                ${question.options.map((option, i) => `
                    <button class="option-btn" data-index="${i}">${option}</button>
                `).join('')}
            </div>
            <div class="progress">
                السؤال ${index + 1} من ${questions.length}
            </div>
        </div>
    `;
    
    // إضافة مستمعي الأحداث للخيارات
    const optionButtons = container.querySelectorAll('.option-btn');
    optionButtons.forEach(button => {
        button.addEventListener('click', () => {
            answers.push(parseInt(button.dataset.index));
            showQuestion(index + 1, questions, answers);
        });
    });
}

// عرض النتائج
function showResults(answers) {
    const container = document.getElementById('questionContainer');
    
    // هنا يمكن إضافة منطق تحليل الإجابات
    const result = analyzeAnswers(answers);
    
    container.innerHTML = `
        <div class="results">
            <h4>نتائج الاختبار</h4>
            <p>${result}</p>
            <button class="btn btn-primary" onclick="closeModal()">إغلاق</button>
        </div>
    `;
}

// تحليل الإجابات
function analyzeAnswers(answers) {
    // هنا يمكن إضافة منطق تحليل الإجابات وإرجاع النتيجة
    return 'شكراً لإكمال الاختبار! سيتم تحليل إجاباتك وعرض النتائج قريباً.';
}

// إغلاق النافذة المنبثقة
function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

// حفظ النتائج
function saveResults(results) {
    if (isLoggedIn()) {
        // يمكن إضافة كود حفظ النتائج هنا
        console.log('حفظ النتائج:', results);
    }
}

// التحقق من تسجيل الدخول
function isLoggedIn() {
    // يمكن إضافة كود التحقق من تسجيل الدخول هنا
    return false;
}
