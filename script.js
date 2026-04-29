// CONFIGURATION
const API_URL = 'https://script.google.com/macros/s/AKfycbzCNeQGWR9cWkY_Swn32tt0-i9l5TSMqmaVZmLiAEaH-J9Z16ExXnIqSK5ed_mFzWiJ/exec';
let RELEASE_DATE = new Date('2026-04-29T23:20:00+07:00'); // Default fallback

// DOM ELEMENTS
const countdownSection = document.getElementById('countdown-section');
const loginSection = document.getElementById('login-section');
const resultSection = document.getElementById('result-section');
const nisnInput = document.getElementById('nisn-input');
const cekButton = document.getElementById('cek-button');
const loader = document.getElementById('loader');
const loginError = document.getElementById('login-error');
const releaseInfo = document.getElementById('release-info');

const studentPhoto = document.getElementById('student-photo');
const studentName = document.getElementById('student-name');
const studentClass = document.getElementById('student-class');
const graduationStatus = document.getElementById('graduation-status');
const statusContainer = document.getElementById('status-container');
const gradesBody = document.getElementById('grades-body');
const totalScoreEl = document.getElementById('total-score');
const averageScoreEl = document.getElementById('average-score');
const downloadBtn = document.getElementById('download-btn');
const backBtn = document.getElementById('back-btn');

let allStudentsData = [];

// INITIALIZE: Fetch data from Google Sheets
async function fetchData() {
    try {
        loader.classList.remove('hidden');
        const response = await fetch(API_URL);
        const result = await response.json();
        
        allStudentsData = result.students;
        
        if (result.settings && result.settings.releaseDate) {
            // Convert 'YYYY-MM-DD HH:mm:ss' or Date object to JS Date
            RELEASE_DATE = new Date(result.settings.releaseDate);
            console.log("Release Date updated from API:", RELEASE_DATE);
            
            // Update the display label
            const options = { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' };
            const formattedDate = RELEASE_DATE.toLocaleDateString('id-ID', options);
            releaseInfo.innerHTML = `<i class="far fa-calendar-alt"></i> Buka pada: ${formattedDate} WIB`;
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        loginError.textContent = "Gagal memuat data. Periksa koneksi internet atau URL API.";
    } finally {
        loader.classList.add('hidden');
        updateCountdown(); // Run immediately after fetch
    }
}

// LOGIN LOGIC
function handleSearch() {
    const input = nisnInput.value.trim();
    if (!input) {
        loginError.textContent = "Silakan masukkan NISN!";
        return;
    }

    const student = allStudentsData.find(s => s.NISN.toString() === input);

    if (student) {
        showResult(student);
    } else {
        loginError.textContent = "NISN tidak ditemukan!";
    }
}

// DISPLAY RESULT
function showResult(student) {
    loginSection.classList.add('hidden');
    resultSection.classList.remove('hidden');
    loginError.textContent = "";

    studentName.textContent = student["Nama Siswa"];
    studentClass.textContent = student["Kelas"];
    studentPhoto.src = student["URL FOTO"] || "https://via.placeholder.com/150x180?text=No+Photo";

    graduationStatus.textContent = student["Status kelulusan"];
    statusContainer.className = "status-container";
    if (student["Status kelulusan"].toLowerCase() === "lulus") {
        graduationStatus.classList.add('status-lulus');
        graduationStatus.classList.remove('status-tidak-lulus');
        launchConfetti();
    } else {
        graduationStatus.classList.add('status-tidak-lulus');
        graduationStatus.classList.remove('status-lulus');
    }

    const mat = parseFloat(student["Nilai Matematika"]) || 0;
    const bin = parseFloat(student["Nilai Bahasa Indonesia"]) || 0;
    const ipas = parseFloat(student["Nilai IPAS"]) || 0;
    
    const total = mat + bin + ipas;
    const avg = (total / 3).toFixed(2);

    gradesBody.innerHTML = `
        <tr><td>Matematika</td><td>${mat}</td></tr>
        <tr><td>Bahasa Indonesia</td><td>${bin}</td></tr>
        <tr><td>IPAS</td><td>${ipas}</td></tr>
    `;

    totalScoreEl.textContent = total;
    averageScoreEl.textContent = avg;

    downloadBtn.onclick = () => {
        if (student["URL FILE"]) {
            window.open(student["URL FILE"], '_blank');
        } else {
            alert("File tidak tersedia untuk NISN ini.");
        }
    };
}

// CONFETTI EFFECT
function launchConfetti() {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#1a237e', '#ffd700', '#ffffff']
        });
        confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#1a237e', '#ffd700', '#ffffff']
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
}

// EVENTS
cekButton.addEventListener('click', handleSearch);

nisnInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

backBtn.addEventListener('click', () => {
    resultSection.classList.add('hidden');
    loginSection.classList.remove('hidden');
    nisnInput.value = "";
});

// COUNTDOWN LOGIC
function updateCountdown() {
    const now = new Date().getTime();
    const distance = RELEASE_DATE.getTime() - now;

    if (distance <= 0) {
        countdownSection.classList.add('hidden');
        loginSection.classList.remove('hidden');
        return true;
    }

    countdownSection.classList.remove('hidden');
    loginSection.classList.add('hidden');

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const elements = {
        'days': days,
        'hours': hours,
        'minutes': minutes,
        'seconds': seconds
    };

    for (const [id, value] of Object.entries(elements)) {
        const el = document.getElementById(id);
        const newVal = value.toString().padStart(2, '0');
        
        if (el.textContent !== newVal) {
            el.textContent = newVal;
            // Trigger pulse animation
            el.classList.remove('pulse');
            void el.offsetWidth; // Trigger reflow
            el.classList.add('pulse');
        }
    }

    return false;
}

const countdownInterval = setInterval(() => {
    const isFinished = updateCountdown();
    if (isFinished) {
        clearInterval(countdownInterval);
    }
}, 1000);

fetchData();
