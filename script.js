const readingProgressBar = document.getElementById('progress-bar');

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (scrollHeight > 0 && readingProgressBar) {
        const progress = (scrollTop / scrollHeight) * 100;
        readingProgressBar.style.width = progress + '%';
    }
});

const menuToggle = document.getElementById('menu-toggle');
const menuClose = document.getElementById('menu-close');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebar-overlay');
const sidebarLinks = document.querySelectorAll('.sidebar-link');

function openSidebar() {
    sidebar.classList.add('active');
    overlay.classList.add('active');
}
function closeSidebar() {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
}

if (menuToggle) menuToggle.addEventListener('click', openSidebar);
if (menuClose) menuClose.addEventListener('click', closeSidebar);
if (overlay) overlay.addEventListener('click', closeSidebar);
sidebarLinks.forEach(link => {
    link.addEventListener('click', closeSidebar);
});

const musicToggle = document.getElementById('music-toggle');
const musicClose = document.getElementById('music-close');
const musicSidebar = document.getElementById('music-sidebar');

function openMusicSidebar() {
    closeSidebar();
    musicSidebar.classList.add('active');
    overlay.classList.add('active');
}

function closeMusicSidebar() {
    musicSidebar.classList.remove('active');
    overlay.classList.remove('active');
}

if (musicToggle) musicToggle.addEventListener('click', openMusicSidebar);
if (musicClose) musicClose.addEventListener('click', closeMusicSidebar);
if (overlay) overlay.addEventListener('click', closeMusicSidebar);

const audio = document.getElementById('main-audio');
const playBtn = document.getElementById('player-play-btn');
const playerSlider = document.getElementById('player-progress');
const currentTimeEl = document.getElementById('player-current-time');
const totalTimeEl = document.getElementById('player-total-time');
const musicItems = document.querySelectorAll('.music-item');

const playlist = [
    {
        title: "Science Documentary",
        author: "leberch",
        duration: "2:04",
        src: "/audio/leberch.mp3"
    },
    {
        title: "Atmosphere Documentary",
        author: "leberch",
        duration: "2:46",
        src: "/audio/leberch2.mp3"
    },
    {
        title: "Documentary",
        author: "leberch",
        duration: "2:30",
        src: "/audio/leberch3.mp3"
    },
    {
        title: "Ambient",
        author: "leberch",
        duration: "2:32",
        src: "/audio/leberch4.mp3"
    }
];

let currentTrack = 0;
let isSeeking = false;

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

function loadTrack(index) {
    currentTrack = index;
    audio.src = playlist[currentTrack].src;
    totalTimeEl.textContent = playlist[currentTrack].duration;
    currentTimeEl.textContent = '0:00';
    if (playerSlider) playerSlider.value = 0;
    
    musicItems.forEach((item, i) => {
        item.classList.toggle('active', i === currentTrack);
    });
}

if (audio) {
    loadTrack(0);
    audio.volume = 0.4;

    audio.addEventListener('timeupdate', () => {
        if (!isSeeking && audio.duration) {
            playerSlider.value = (audio.currentTime / audio.duration) * 100;
            currentTimeEl.textContent = formatTime(audio.currentTime);
        }
    });

    audio.addEventListener('ended', () => {
        currentTrack++;
        if (currentTrack < playlist.length) {
            loadTrack(currentTrack);
            audio.play();
        } else {
            playBtn.textContent = '▶';
            musicToggle.classList.remove('playing');
            loadTrack(0);
        }
    });
}

if (playBtn) {
    playBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play().then(() => {
                playBtn.textContent = '⏸';
                musicToggle.classList.add('playing');
            }).catch(err => console.warn(err));
        } else {
            audio.pause();
            playBtn.textContent = '▶';
            musicToggle.classList.remove('playing');
        }
    });
}

musicItems.forEach(item => {
    item.addEventListener('click', () => {
        const idx = parseInt(item.getAttribute('data-index'), 10);
        loadTrack(idx);
        audio.play().then(() => {
            playBtn.textContent = '⏸';
            musicToggle.classList.add('playing');
        }).catch(err => console.warn(err));
    });
});

if (playerSlider) {
    playerSlider.addEventListener('input', () => {
        isSeeking = true;
        if (audio.duration) {
            currentTimeEl.textContent = formatTime((playerSlider.value / 100) * audio.duration);
        }
    });
    playerSlider.addEventListener('change', () => {
        if (audio.duration) {
            audio.currentTime = (playerSlider.value / 100) * audio.duration;
        }
        isSeeking = false;
    });
}