// تهيئة المتغيرات
const searchInput = document.querySelector('.search-input');
const mediaFilter = document.querySelector('.media-filter');
const searchBtn = document.querySelector('.search-btn');
const videoCards = document.querySelectorAll('.video-card');
const audioCards = document.querySelectorAll('.audio-card');
const galleryItems = document.querySelectorAll('.gallery-item');
const playlistCards = document.querySelectorAll('.playlist-card');

// البحث وتصفية المحتوى
searchBtn.addEventListener('click', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filterType = mediaFilter.value;
    
    filterContent(searchTerm, filterType);
});

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filterType = mediaFilter.value;
    
    filterContent(searchTerm, filterType);
});

mediaFilter.addEventListener('change', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filterType = mediaFilter.value;
    
    filterContent(searchTerm, filterType);
});

// تصفية المحتوى
function filterContent(searchTerm, filterType) {
    // تصفية الفيديوهات
    if (filterType === 'all' || filterType === 'videos') {
        videoCards.forEach(card => {
            const title = card.querySelector('h4').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    // تصفية الملفات الصوتية
    if (filterType === 'all' || filterType === 'audio') {
        audioCards.forEach(card => {
            const title = card.querySelector('h4').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    // تصفية الصور
    if (filterType === 'all' || filterType === 'images') {
        galleryItems.forEach(item => {
            const title = item.querySelector('h4').textContent.toLowerCase();
            
            if (title.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }
}

// معالجة تشغيل الفيديو
videoCards.forEach(card => {
    const playBtn = card.querySelector('.play-btn');
    
    playBtn.addEventListener('click', () => {
        const videoTitle = card.querySelector('h4').textContent;
        showVideoPlayer(videoTitle);
    });
});

// عرض مشغل الفيديو
function showVideoPlayer(videoTitle) {
    const modal = document.createElement('div');
    modal.className = 'modal video-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>${videoTitle}</h3>
            <div class="video-player">
                <video controls>
                    <source src="videos/sample.mp4" type="video/mp4">
                    متصفحك لا يدعم تشغيل الفيديو.
                </video>
            </div>
            <button class="btn btn-primary" onclick="closeModal()">إغلاق</button>
        </div>
    `;
    document.body.appendChild(modal);
}

// تحميل الصور
document.querySelectorAll('.download-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const galleryItem = e.target.closest('.gallery-item');
        const imgSrc = galleryItem.querySelector('img').src;
        const title = galleryItem.querySelector('h4').textContent;
        
        downloadImage(imgSrc, title);
    });
});

// تحميل الصورة
function downloadImage(imgSrc, title) {
    const link = document.createElement('a');
    link.href = imgSrc;
    link.download = `${title}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// عرض المجموعة
document.querySelectorAll('.playlist-card .btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const playlistCard = e.target.closest('.playlist-card');
        const playlistTitle = playlistCard.querySelector('h4').textContent;
        
        showPlaylist(playlistTitle);
    });
});

// عرض محتوى المجموعة
function showPlaylist(playlistTitle) {
    const modal = document.createElement('div');
    modal.className = 'modal playlist-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>${playlistTitle}</h3>
            <div class="playlist-content">
                <div class="playlist-videos">
                    <h4>الفيديوهات</h4>
                    <ul>
                        <li>
                            <span>فيديو 1</span>
                            <button class="btn play-btn">تشغيل</button>
                        </li>
                        <li>
                            <span>فيديو 2</span>
                            <button class="btn play-btn">تشغيل</button>
                        </li>
                    </ul>
                </div>
                <div class="playlist-audio">
                    <h4>التسجيلات الصوتية</h4>
                    <ul>
                        <li>
                            <span>تسجيل 1</span>
                            <button class="btn play-btn">تشغيل</button>
                        </li>
                        <li>
                            <span>تسجيل 2</span>
                            <button class="btn play-btn">تشغيل</button>
                        </li>
                    </ul>
                </div>
            </div>
            <button class="btn btn-primary" onclick="closeModal()">إغلاق</button>
        </div>
    `;
    document.body.appendChild(modal);
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
