// ===================================================================
// 💖 LUXURY ROMANTIC INTERACTIVE SCRIPT 💖
// Features: Ambient Canvas (Hearts & Petals), Web Audio API Synthesized
// Chimes, Confetti Explosions, Password System, Video & Music Control.
// ===================================================================

document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

// Global state
let audioCtx = null;
let isMusicPlaying = false;
let loveReactionCount = 0;
let isLetterOpened = false;

function initApp() {
  applyConfigData();
  setupAmbientCanvas();
  setupPasswordEvents();
  setupMusicController();
  setupVideoHandling();
  startLoveCounter();
  spawnFloatingWords();
  loadSavedVideoIfExists();
}

function loadSavedVideoIfExists() {
  loadVideoFromDB().then((blob) => {
    if (blob) {
      const video = document.getElementById("main-video");
      const placeholder = document.getElementById("video-placeholder");
      if (video) {
        video.src = URL.createObjectURL(blob);
        if (placeholder) placeholder.classList.add("hidden");
      }
    }
  });
}

// ===================================================================
// 1. APPLY DATA FROM CONFIG.JS
// ===================================================================
function applyConfigData() {
  if (typeof LOVELY_CONFIG === "undefined") return;

  const herNameElem = document.getElementById("display-her-name");
  const hisNameElem = document.getElementById("display-his-name");
  const letterSig = document.getElementById("letter-signature");
  const hintText = document.getElementById("hint-text");
  const letterTitle = document.getElementById("letter-title");

  if (herNameElem) herNameElem.textContent = LOVELY_CONFIG.herName;
  if (hisNameElem) hisNameElem.textContent = LOVELY_CONFIG.hisName;
  if (letterSig) letterSig.textContent = `${LOVELY_CONFIG.hisName} ❤️`;
  if (hintText) hintText.textContent = LOVELY_CONFIG.passwordHint;
  if (letterTitle) letterTitle.textContent = LOVELY_CONFIG.letterTitle;
}

// ===================================================================
// 2. SYNTHESIZED SOUND EFFECTS (Web Audio API - No external SFX files!)
// ===================================================================
function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

// Magical Romantic Harp/Chime on Unlock
function playMagicalChime() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51]; // C5, E5, G5, C6, E6
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);

    gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.1);
    gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + idx * 0.1 + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.1 + 1.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime + idx * 0.1);
    osc.stop(ctx.currentTime + idx * 0.1 + 1.3);
  });
}

// Sweet Heart Click Pop
function playHeartPop() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = "triangle";
  osc.frequency.setValueAtTime(440, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);

  gain.gain.setValueAtTime(0.18, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.22);
}

// ===================================================================
// 3. PASSWORD & UNLOCK LOGIC
// ===================================================================
function setupPasswordEvents() {
  const pwdInput = document.getElementById("password-input");
  const toggleBtn = document.getElementById("toggle-pwd-btn");
  const eyeIcon = document.getElementById("eye-icon");
  const hintBtn = document.getElementById("hint-btn");
  const hintText = document.getElementById("hint-text");
  const heartDots = document.querySelectorAll(".dot-heart");

  // Show/Hide Password
  if (toggleBtn && pwdInput) {
    toggleBtn.addEventListener("click", () => {
      const isPassword = pwdInput.type === "password";
      pwdInput.type = isPassword ? "text" : "password";
      eyeIcon.className = isPassword ? "fa-regular fa-eye-slash" : "fa-regular fa-eye";
    });
  }

  // Heart dots filling animation as user types
  if (pwdInput) {
    pwdInput.addEventListener("input", (e) => {
      const len = e.target.value.length;
      heartDots.forEach((dot, index) => {
        if (index < len) {
          dot.classList.add("active");
        } else {
          dot.classList.remove("active");
        }
      });
    });
  }

  // Toggle Hint
  if (hintBtn && hintText) {
    hintBtn.addEventListener("click", () => {
      hintText.classList.toggle("hidden");
    });
  }
}

// Normalize Arabic/Persian digits to western digits and trim
function normalizeText(text) {
  if (!text) return "";
  const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  let res = text.trim().toLowerCase();
  for (let i = 0; i < 10; i++) {
    res = res.split(arabicDigits[i]).join(i.toString());
  }
  return res;
}

function handleUnlock() {
  const pwdInput = document.getElementById("password-input");
  const errorToast = document.getElementById("error-toast");
  const enteredVal = normalizeText(pwdInput.value);

  // Check against accepted passwords
  const allowed = (LOVELY_CONFIG.passwords || ["بحبك", "2024", "1234"]).map(p => normalizeText(p));
  const isMatch = allowed.some(pass => pass === enteredVal || enteredVal.includes(pass));

  if (isMatch) {
    // SUCCESS UNLOCK!
    errorToast.classList.add("hidden");
    playMagicalChime();
    celebrateWithConfetti();

    // Unlock Animation
    const lockScreen = document.getElementById("lock-screen");
    const mainScreen = document.getElementById("main-screen");
    const musicPill = document.getElementById("music-pill");

    lockScreen.style.transform = "scale(1.08)";
    lockScreen.style.opacity = "0";

    setTimeout(() => {
      lockScreen.classList.add("hidden");
      mainScreen.classList.remove("hidden");
      if (musicPill) musicPill.classList.add("visible");

      // Auto start video and music
      startMediaAfterUnlock();
    }, 600);

  } else {
    // WRONG PASSWORD
    pwdInput.classList.add("shake-input");
    setTimeout(() => pwdInput.classList.remove("shake-input"), 500);

    const msgs = LOVELY_CONFIG.wrongPasswordMessages || ["كلمة سر غير صحيحة، حاولي تاني يا قمر ❤️"];
    const randomMsg = msgs[Math.floor(Math.random() * msgs.length)];

    errorToast.textContent = randomMsg;
    errorToast.classList.remove("hidden");
  }
}

// Double Confetti Celebration
function celebrateWithConfetti() {
  if (typeof confetti !== "function") return;

  const duration = 3.5 * 1000;
  const animationEnd = Date.now() + duration;

  const interval = setInterval(function() {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) {
      return clearInterval(interval);
    }
    const particleCount = 40 * (timeLeft / duration);
    
    // Confetti from left and right
    confetti({
      particleCount,
      spread: 70,
      origin: { x: 0.15, y: 0.65 },
      colors: ['#e11d48', '#fb7185', '#f59e0b', '#ffffff']
    });
    confetti({
      particleCount,
      spread: 70,
      origin: { x: 0.85, y: 0.65 },
      colors: ['#e11d48', '#fb7185', '#f59e0b', '#ffffff']
    });
  }, 250);
}

// ===================================================================
// 4. MEDIA (VIDEO & MUSIC) HANDLING
// ===================================================================
function setupMusicController() {
  const musicBtn = document.getElementById("music-btn");
  const musicPill = document.getElementById("music-pill");
  const bgMusic = document.getElementById("bg-music");
  const musicDisc = document.getElementById("music-disc");
  const musicStatus = document.getElementById("music-status");
  const musicIcon = document.getElementById("music-icon");

  if (!bgMusic) return;

  const toggleMusic = () => {
    if (isMusicPlaying) {
      bgMusic.pause();
      isMusicPlaying = false;
      musicDisc.classList.remove("playing");
      musicStatus.textContent = "متوقف";
      musicIcon.className = "fa-solid fa-play";
    } else {
      bgMusic.play().then(() => {
        isMusicPlaying = true;
        musicDisc.classList.add("playing");
        musicStatus.textContent = "يعمل الآن 🎵";
        musicIcon.className = "fa-solid fa-pause";
      }).catch(err => {
        console.log("Audio play error:", err);
      });
    }
  };

  if (musicPill) musicPill.addEventListener("click", toggleMusic);
}

function startMediaAfterUnlock() {
  const video = document.getElementById("main-video");
  const bgMusic = document.getElementById("bg-music");
  const musicDisc = document.getElementById("music-disc");
  const musicStatus = document.getElementById("music-status");
  const musicIcon = document.getElementById("music-icon");

  // Attempt to play music
  if (bgMusic) {
    bgMusic.play().then(() => {
      isMusicPlaying = true;
      if (musicDisc) musicDisc.classList.add("playing");
      if (musicStatus) musicStatus.textContent = "يعمل الآن 🎵";
      if (musicIcon) musicIcon.className = "fa-solid fa-pause";
    }).catch(e => {
      console.log("Browser prevented autoplay:", e);
    });
  }

  // Play video
  if (video) {
    video.play().catch(e => {
      console.log("Video autoplay prevented:", e);
    });
  }
}

function playHeroVideo() {
  const video = document.getElementById("main-video");
  const playOverlay = document.getElementById("video-play-overlay");
  const bgMusic = document.getElementById("bg-music");

  if (playOverlay) playOverlay.classList.add("hidden");

  if (video) {
    video.play().then(() => {
      // Pause background music while video is playing
      if (bgMusic && isMusicPlaying) {
        bgMusic.pause();
        const musicStatus = document.getElementById("music-status");
        const musicIcon = document.getElementById("music-icon");
        const musicDisc = document.getElementById("music-disc");
        if (musicStatus) musicStatus.textContent = "مؤقت (الفيديو يعمل)";
        if (musicIcon) musicIcon.className = "fa-solid fa-play";
        if (musicDisc) musicDisc.classList.remove("playing");
      }
    }).catch(err => {
      console.log("Video playback error:", err);
      // If error (e.g. no video file yet), show placeholder
      const placeholder = document.getElementById("video-placeholder");
      if (placeholder) placeholder.classList.remove("hidden");
    });
  }
}

// ===================================================================
// INDEXEDDB VIDEO PERSISTENCE
// Keeps the uploaded long video permanently stored in browser memory
// ===================================================================
function openVideoDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("LovelySurpriseDB", 1);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains("media")) {
        db.createObjectStore("media");
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveVideoToDB(blob) {
  try {
    const db = await openVideoDB();
    const tx = db.transaction("media", "readwrite");
    tx.objectStore("media").put(blob, "fianceeVideo");
  } catch (err) {
    console.log("IndexedDB save error:", err);
  }
}

async function loadVideoFromDB() {
  try {
    const db = await openVideoDB();
    return new Promise((resolve) => {
      const tx = db.transaction("media", "readonly");
      const req = tx.objectStore("media").get("fianceeVideo");
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    });
  } catch (err) {
    return null;
  }
}

async function handleLocalVideoUpload(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const video = document.getElementById("main-video");
  const placeholder = document.getElementById("video-placeholder");
  const playOverlay = document.getElementById("video-play-overlay");

  const objectUrl = URL.createObjectURL(file);
  if (video) {
    video.src = objectUrl;
    if (placeholder) placeholder.classList.add("hidden");
    if (playOverlay) playOverlay.classList.add("hidden");
    video.play().catch(e => console.log(e));
  }

  // 1. Save locally to browser IndexedDB so it never disappears on refresh/mobile
  await saveVideoToDB(file);

  // 2. Try background upload to disk if server.py is running
  try {
    const formData = new FormData();
    formData.append("video", file);
    fetch("/upload", { method: "POST", body: formData }).catch(() => {});
  } catch (e) {}
}

function setupVideoHandling() {
  const video = document.getElementById("main-video");
  const placeholder = document.getElementById("video-placeholder");
  const playOverlay = document.getElementById("video-play-overlay");

  if (!video) return;

  // When video ends, show overlay again or resume background music
  video.addEventListener("ended", () => {
    if (playOverlay) playOverlay.classList.remove("hidden");
    const bgMusic = document.getElementById("bg-music");
    if (bgMusic && isMusicPlaying) {
      bgMusic.play();
    }
  });

  // If video error, show placeholder and hide overlay
  video.addEventListener("error", () => {
    if (placeholder) placeholder.classList.remove("hidden");
    if (playOverlay) playOverlay.classList.add("hidden");
  });

  // If video starts playing
  video.addEventListener("play", () => {
    if (playOverlay) playOverlay.classList.add("hidden");
  });
}

// Love Reaction Heart Bursts
document.addEventListener("DOMContentLoaded", () => {
  const reactionBtn = document.getElementById("love-reaction-btn");
  if (reactionBtn) {
    reactionBtn.addEventListener("click", () => {
      loveReactionCount++;
      const counter = document.getElementById("love-counter");
      if (counter) counter.textContent = loveReactionCount;

      playHeartPop();
      sendHeartBurst("❤️");

      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    });
  }
});

function sendHeartBurst(symbol = "❤️") {
  const burstCount = 12;
  for (let i = 0; i < burstCount; i++) {
    const heart = document.createElement("div");
    heart.textContent = symbol;
    heart.style.position = "fixed";
    heart.style.left = `${50 + (Math.random() * 40 - 20)}%`;
    heart.style.bottom = "80px";
    heart.style.fontSize = `${Math.random() * 24 + 18}px`;
    heart.style.pointerEvents = "none";
    heart.style.zIndex = "9999";
    heart.style.transition = `all ${Math.random() * 1.5 + 1.2}s cubic-bezier(0.16, 1, 0.3, 1)`;

    document.body.appendChild(heart);

    setTimeout(() => {
      const offsetX = (Math.random() - 0.5) * 350;
      const offsetY = -(Math.random() * 500 + 200);
      heart.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(1.4) rotate(${Math.random() * 60 - 30}deg)`;
      heart.style.opacity = "0";
    }, 20);

    setTimeout(() => {
      heart.remove();
    }, 2500);
  }
}

// ===================================================================
// 5. ENVELOPE & LOVE LETTER LOGIC
// ===================================================================
function toggleLetter() {
  const envelope = document.getElementById("envelope");
  const letterPaper = document.getElementById("letter-paper");
  const letterContent = document.getElementById("letter-content");

  if (!isLetterOpened) {
    isLetterOpened = true;
    envelope.classList.add("hidden");
    letterPaper.classList.remove("hidden");

    // Typewriter effect
    typewriterEffect(letterContent, LOVELY_CONFIG.letterText || "");
    playMagicalChime();
  } else {
    isLetterOpened = false;
    letterPaper.classList.add("hidden");
    envelope.classList.remove("hidden");
  }
}

function typewriterEffect(element, text) {
  element.textContent = "";
  let i = 0;
  const speed = 25; // ms per char

  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

// ===================================================================
// 6. LOVE JOURNEY COUNTER
// ===================================================================
function startLoveCounter() {
  const startDateStr = (LOVELY_CONFIG && LOVELY_CONFIG.startDate) || "2024-01-01";
  const startDateTime = new Date(startDateStr).getTime();

  function updateTimer() {
    const now = new Date().getTime();
    const diff = Math.max(0, now - startDateTime);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const daysElem = document.getElementById("days-count");
    const hoursElem = document.getElementById("hours-count");
    const minElem = document.getElementById("minutes-count");
    const secElem = document.getElementById("seconds-count");

    if (daysElem) daysElem.textContent = days;
    if (hoursElem) hoursElem.textContent = hours;
    if (minElem) minElem.textContent = minutes;
    if (secElem) secElem.textContent = seconds;
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

// ===================================================================
// 7. FLOATING ROMANTIC WORDS CLOUD
// ===================================================================
function spawnFloatingWords() {
  const container = document.getElementById("floating-words-container");
  if (!container || !LOVELY_CONFIG.floatingLoveWords) return;

  const words = LOVELY_CONFIG.floatingLoveWords;
  words.forEach((word, index) => {
    const tag = document.createElement("div");
    tag.className = "floating-word-tag";
    tag.textContent = word;
    tag.style.left = `${(index * 12 + 6) % 90}%`;
    tag.style.animationDelay = `${index * 1.6}s`;
    tag.style.animationDuration = `${Math.random() * 6 + 10}s`;
    container.appendChild(tag);
  });
}

// ===================================================================
// 8. AMBIENT CANVAS (Hearts, Stars & Falling Petals)
// ===================================================================
function setupAmbientCanvas() {
  const canvas = document.getElementById("ambient-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = 45;

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 12 + 8;
      this.speedY = Math.random() * 0.8 + 0.3;
      this.speedX = Math.sin(Math.random() * Math.PI * 2) * 0.4;
      this.opacity = Math.random() * 0.6 + 0.2;
      this.type = Math.random() > 0.4 ? "heart" : "petal";
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.02;
    }

    update() {
      this.y += this.speedY;
      this.x += Math.sin(this.y * 0.01) * 0.5;
      this.rotation += this.rotSpeed;

      if (this.y > height + 20) {
        this.y = -20;
        this.x = Math.random() * width;
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.opacity;

      if (this.type === "heart") {
        ctx.fillStyle = "#e11d48";
        // Draw heart shape
        const s = this.size * 0.08;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-10 * s, -10 * s, -20 * s, 5 * s, 0, 20 * s);
        ctx.bezierCurveTo(20 * s, 5 * s, 10 * s, -10 * s, 0, 0);
        ctx.fill();
      } else {
        // Draw rose petal
        ctx.fillStyle = "#fda4af";
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size * 0.4, this.size * 0.8, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }

  animate();
}
