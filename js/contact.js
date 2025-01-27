// عنوان الـ webhook
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1333194093274333226/vswwc4q3D7easRU_r2gGR583ogqZ-U0ElokvfN275saqSM0grV4IbsbrEcwJSpuIuVY6';

// معالجة إرسال النموذج
document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // الحصول على بيانات النموذج
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    // إنشاء محتوى الرسالة لـ Discord
    const discordMessage = {
        embeds: [{
            title: `رسالة جديدة من: ${name}`,
            color: 0xff6b6b, // لون وردي
            fields: [
                {
                    name: 'الموضوع',
                    value: subject,
                    inline: true
                },
                {
                    name: 'البريد الإلكتروني',
                    value: email,
                    inline: true
                },
                {
                    name: 'الرسالة',
                    value: message
                }
            ],
            timestamp: new Date().toISOString()
        }]
    };
    
    try {
        // إظهار رسالة التحميل
        showMessage('جاري إرسال رسالتك...', 'info');
        
        // إرسال الرسالة إلى Discord
        const response = await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(discordMessage)
        });
        
        if (response.ok) {
            // إظهار رسالة نجاح
            showMessage('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.', 'success');
            // إعادة تعيين النموذج
            this.reset();
        } else {
            throw new Error('فشل في إرسال الرسالة');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('عذراً، حدث خطأ أثناء إرسال رسالتك. يرجى المحاولة مرة أخرى.', 'error');
    }
});

// دالة إظهار الرسائل
function showMessage(text, type = 'info') {
    const messageContainer = document.createElement('div');
    messageContainer.className = `message ${type}`;
    messageContainer.textContent = text;
    
    document.body.appendChild(messageContainer);
    
    // إزالة الرسالة بعد 3 ثواني
    setTimeout(() => {
        messageContainer.remove();
    }, 3000);
}
