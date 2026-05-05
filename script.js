
const state = {
  photos: [],
  videoFile: null,
  musicFile: null,
  galleryIndex: 0,
  musicPlaying: false,
  posterBg: 'sunset',
  posterStickers: [],
  countdownInterval: null,
  wishList: [],
};

document.addEventListener('DOMContentLoaded', () => {
  initConfetti();
  initBalloons();
  setupFormListeners();
  initPosterControls();
  checkURLHash();
  updatePoster();
  initScrollAnimations();
  hamburgerMenu();
});


function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

function hamburgerMenu() {
  const btn = document.getElementById('hamburger');
  btn?.addEventListener('click', () => {
    const nav = document.querySelector('.nav-links');
    nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
    nav.style.flexDirection = 'column';
    nav.style.position = 'absolute';
    nav.style.top = '70px';
    nav.style.right = '1.5rem';
    nav.style.background = 'rgba(26,5,51,0.97)';
    nav.style.padding = '1rem';
    nav.style.borderRadius = '14px';
    nav.style.border = '1px solid rgba(255,255,255,0.1)';
    nav.style.zIndex = '999';
  });
}

function initConfetti() {
  const container = document.getElementById('confetti-container');
  const colors = ['#ff6b9d', '#c44dff', '#ffb347', '#4facfe', '#43e97b', '#fee140', '#f5576c', '#00f2fe'];
  
  for (let i = 0; i < 40; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + '%';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.width = (Math.random() * 8 + 5) + 'px';
    piece.style.height = (Math.random() * 12 + 6) + 'px';
    piece.style.animationDuration = (Math.random() * 6 + 4) + 's';
    piece.style.animationDelay = (Math.random() * 8) + 's';
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    container.appendChild(piece);
  }
}

function burstConfetti() {
  const container = document.getElementById('confetti-container');
  const colors = ['#ff6b9d', '#c44dff', '#ffb347', '#4facfe', '#43e97b', '#fee140'];
  for (let i = 0; i < 60; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + '%';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.width = (Math.random() * 10 + 5) + 'px';
    piece.style.height = (Math.random() * 14 + 6) + 'px';
    piece.style.animationDuration = (Math.random() * 3 + 2) + 's';
    piece.style.animationDelay = (Math.random() * 1) + 's';
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '3px';
    container.appendChild(piece);
    setTimeout(() => piece.remove(), 5000);
  }
}


function initBalloons() {
  const container = document.getElementById('balloons-container');
  const balloonEmojis = ['🎈', '🎈', '🎈', '🎀'];
  
  for (let i = 0; i < 6; i++) {
    const b = document.createElement('div');
    b.className = 'balloon';
    b.textContent = balloonEmojis[Math.floor(Math.random() * balloonEmojis.length)];
    b.style.left = (Math.random() * 90 + 5) + '%';
    b.style.animationDuration = (Math.random() * 10 + 8) + 's';
    b.style.animationDelay = (Math.random() * 10) + 's';
    b.style.fontSize = (Math.random() * 1.5 + 2) + 'rem';
    container.appendChild(b);
  }
}
function celebrateBirthday() {
  burstConfetti();

  const container = document.getElementById('balloons-container');

  for (let i = 0; i < 12; i++) {
    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    balloon.textContent = '🎈';

    balloon.style.left = Math.random() * 100 + '%';

    balloon.style.animationDuration = (Math.random() * 5 + 5) + 's';
    balloon.style.animationIterationCount = "1";

    container.appendChild(balloon);

    setTimeout(() => {
      balloon.remove();
    }, 9000);
  }

  showToast("🎉 Let's Celebrate!");
}
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('fade-in');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  
  document.querySelectorAll('.feature-card, .form-group, .poster-controls, .group-form-box').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });
}

function setupFormListeners() {
  document.getElementById('photoUpload').addEventListener('change', handlePhotoUpload);
  document.getElementById('videoUpload').addEventListener('change', handleVideoUpload);
  document.getElementById('musicUpload').addEventListener('change', handleMusicUpload);
  document.getElementById('wishForm').addEventListener('submit', handleFormSubmit);
}

function validateForm() {
  let valid = true;

  const recipient = document.getElementById('recipientName').value.trim();
  const sender = document.getElementById('senderName').value.trim();
  const message = document.getElementById('wishMessage').value.trim();

  document.getElementById('err-recipient').textContent = '';
  document.getElementById('err-sender').textContent = '';
  document.getElementById('err-message').textContent = '';

  if (!recipient) {
    document.getElementById('err-recipient').textContent = '⚠️ Recipient name is required.';
    valid = false;
  }
  if (!sender) {
    document.getElementById('err-sender').textContent = '⚠️ Sender name is required.';
    valid = false;
  }
  if (!message) {
    document.getElementById('err-message').textContent = '⚠️ Birthday message cannot be empty.';
    valid = false;
  }

  return valid;
}

function handleFormSubmit(e) {
  e.preventDefault();
  if (!validateForm()) return;

  const recipient = document.getElementById('recipientName').value.trim();
  const sender = document.getElementById('senderName').value.trim();
  const message = document.getElementById('wishMessage').value.trim();
  const date = document.getElementById('birthdayDate').value;
  const giftEnabled = document.getElementById('giftReveal').checked;

  buildWishPage({ recipient, sender, message, date, giftEnabled });
  burstConfetti();
  showToast('🎉 Your wish page is ready! Share the link!');
}

function buildWishPage({ recipient, sender, message, date, giftEnabled }) {
  document.getElementById('create').style.display = 'none';
  const display = document.getElementById('wishDisplay');
  display.style.display = 'block';
  display.scrollIntoView({ behavior: 'smooth' });

  document.getElementById('displayName').textContent = recipient;
  document.getElementById('displayFrom').textContent = `From: ${sender} 💌`;
  document.getElementById('displayMessage').textContent = message;

  // Unique link
  const link = generateUniqueLink(recipient, sender);
  document.getElementById('generatedLink').value = link;

  if (giftEnabled) {
    document.getElementById('giftBoxSection').style.display = 'block';
    document.getElementById('giftMessage').textContent = message;
  } else {
    document.getElementById('giftBoxSection').style.display = 'none';
  }

  if (date) {
    startCountdown(date);
    document.getElementById('countdownBox').style.display = 'block';
  } else {
    document.getElementById('countdownBox').style.display = 'none';
  }

  // Gallery
  if (state.photos.length > 0) {
    buildGallery();
    document.getElementById('gallerySection').style.display = 'block';
  } else {
    document.getElementById('gallerySection').style.display = 'none';
  }

  if (state.videoFile) {
    const video = document.getElementById('wishVideo');
    video.src = URL.createObjectURL(state.videoFile);
    document.getElementById('videoSection').style.display = 'block';
  } else {
    document.getElementById('videoSection').style.display = 'none';
  }

  // Music
  if (state.musicFile) {
    const music = document.getElementById('wishMusic');
    music.src = URL.createObjectURL(state.musicFile);
    document.getElementById('musicPlayer').style.display = 'flex';
  } else {
    document.getElementById('musicPlayer').style.display = 'none';
  }

  // Reset wishes list
  document.getElementById('wishMessagesList').innerHTML = '';
  state.wishList = [];
}

function goBackToCreate() {
  document.getElementById('wishDisplay').style.display = 'none';
  document.getElementById('create').style.display = 'block';
  document.getElementById('create').scrollIntoView({ behavior: 'smooth' });
  // Clear countdown
  if (state.countdownInterval) clearInterval(state.countdownInterval);
}

// ── Unique Link Generator ─────────────────────────────────────
function generateUniqueLink(recipient, sender) {
  const base = window.location.origin + window.location.pathname;

  // Collect all current wish data
  const message  = document.getElementById('wishMessage').value.trim();
  const date     = document.getElementById('birthdayDate').value;
  const gift     = document.getElementById('giftReveal').checked ? '1' : '0';

  // Pack into a JSON string and base64-encode so it survives in a URL param
  const payload  = JSON.stringify({ r: recipient, s: sender, m: message, d: date, g: gift });
  const encoded  = btoa(unescape(encodeURIComponent(payload)));

  return `${base}?wishdata=${encodeURIComponent(encoded)}`;
}

function copyLink() {
  const link = document.getElementById('generatedLink');
  link.select();
  navigator.clipboard.writeText(link.value).then(() => {
    showToast('🔗 Link copied to clipboard!');
  }).catch(() => {
    document.execCommand('copy');
    showToast('🔗 Link copied!');
  });
}

function checkURLHash() {
  const params = new URLSearchParams(window.location.search);
  if (!params.has('wishdata')) return;

  try {
    const raw     = decodeURIComponent(params.get('wishdata'));
    const json    = decodeURIComponent(escape(atob(raw)));
    const data    = JSON.parse(json);

    const recipient  = data.r || 'Friend';
    const sender     = data.s || '';
    const message    = data.m || '';
    const date       = data.d || '';
    const giftEnabled = data.g === '1';

    // Hide the create form, show the wish display directly
    document.getElementById('create').style.display = 'none';

    // Show a nice "you received a wish" overlay first, then reveal the page
    showReceivedWishOverlay(recipient, sender, () => {
      buildWishPage({ recipient, sender, message, date, giftEnabled });
      // Scroll to top of wish display
      document.getElementById('wishDisplay').scrollIntoView({ behavior: 'smooth' });
      // Hide the share banner – the recipient doesn't need the link
      const banner = document.querySelector('.share-banner');
      if (banner) banner.style.display = 'none';
      // Hide the "back" button
      const backBtn = document.querySelector('.btn-back');
      if (backBtn) backBtn.style.display = 'none';
    });

  } catch (e) {
    console.warn('WishBloom: could not parse wish URL', e);
    showToast('🎉 Someone shared a birthday wish with you!');
  }
}

function showReceivedWishOverlay(recipient, sender, onReveal) {
  const overlay = document.createElement('div');
  overlay.id = 'receivedOverlay';
  overlay.style.cssText = `
    position: fixed; inset: 0; z-index: 9999;
    background: linear-gradient(135deg, #1a0533 0%, #2d0b6b 50%, #1a0533 100%);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    text-align: center; padding: 2rem;
    animation: overlayFadeIn 0.8s ease forwards;
  `;

  overlay.innerHTML = `
    <style>
      @keyframes overlayFadeIn { from { opacity:0 } to { opacity:1 } }
      @keyframes overlayFadeOut { from { opacity:1 } to { opacity:0; pointer-events:none } }
      @keyframes envelopePop { 0%{transform:scale(0) rotate(-15deg)} 60%{transform:scale(1.15) rotate(5deg)} 100%{transform:scale(1) rotate(0deg)} }
      @keyframes textSlideUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
      @keyframes pulseGlow { 0%,100%{box-shadow:0 0 30px rgba(196,77,255,0.4)} 50%{box-shadow:0 0 70px rgba(196,77,255,0.9), 0 0 120px rgba(255,107,157,0.4)} }
      #wishEnvelope { font-size: 6rem; animation: envelopePop 0.9s cubic-bezier(.36,1.8,.5,1) 0.3s both; display: block; }
      #overlayTitle { font-family: 'Pacifico', cursive; font-size: clamp(1.6rem, 5vw, 2.8rem); color: #fff; margin: 1.2rem 0 0.5rem; animation: textSlideUp 0.7s ease 1s both; }
      #overlaySubtitle { font-family: 'Nunito', sans-serif; font-size: clamp(1rem, 3vw, 1.3rem); color: rgba(255,255,255,0.75); margin-bottom: 2rem; animation: textSlideUp 0.7s ease 1.2s both; }
      #revealWishBtn {
        font-family: 'Nunito', sans-serif; font-weight: 800; font-size: 1.15rem;
        background: linear-gradient(135deg, #ff6b9d, #c44dff);
        color: #fff; border: none; border-radius: 50px; padding: 1rem 2.5rem;
        cursor: pointer; animation: textSlideUp 0.7s ease 1.4s both, pulseGlow 2s ease 2s infinite;
        transition: transform 0.2s;
      }
      #revealWishBtn:hover { transform: scale(1.07); }
      .overlay-sparkles { font-size: 2.5rem; margin-bottom: 0.5rem; animation: textSlideUp 0.7s ease 0.8s both; }
    </style>
    <span id="wishEnvelope">💌</span>
    <div class="overlay-sparkles">✨ 🎉 ✨</div>
    <div id="overlayTitle">You have a Birthday Wish!</div>
    <div id="overlaySubtitle">${sender ? `<strong style="color:#ff6b9d">${escapeHtml(sender)}</strong> sent a special wish for <strong style="color:#ffb347">${escapeHtml(recipient)}</strong>` : `A special birthday wish for <strong style="color:#ffb347">${escapeHtml(recipient)}</strong>`}!</div>
    <button id="revealWishBtn" onclick="document.getElementById('receivedOverlay').style.animation='overlayFadeOut 0.6s ease forwards'; setTimeout(()=>{document.getElementById('receivedOverlay').remove(); window._onRevealWish();},600);">
      🎁 Open Your Wish
    </button>
  `;

  document.body.appendChild(overlay);
  // Store callback globally so inline onclick can reach it
  window._onRevealWish = () => {
    onReveal();
    burstConfetti();
    celebrateBirthday();
  };
}

// ── Photo Upload ──────────────────────────────────────────────
function handlePhotoUpload(e) {
  const files = Array.from(e.target.files);
  state.photos = [];
  const grid = document.getElementById('photoPreviewGrid');
  grid.innerHTML = '';

  files.forEach(file => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      state.photos.push(ev.target.result);
      const item = document.createElement('div');
      item.className = 'preview-img-item';
      const img = document.createElement('img');
      img.src = ev.target.result;
      img.alt = 'Preview';
      item.appendChild(img);
      grid.appendChild(item);
    };
    reader.readAsDataURL(file);
  });
}

// ── Video Upload ──────────────────────────────────────────────
function handleVideoUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  state.videoFile = file;
  const preview = document.getElementById('videoPreview');
  preview.innerHTML = `<div style="margin-top:0.5rem;color:var(--green);font-weight:700;font-size:0.9rem;">✅ ${file.name}</div>`;
}

// ── Music Upload ──────────────────────────────────────────────
function handleMusicUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  state.musicFile = file;
  const preview = document.getElementById('musicPreview');
  preview.innerHTML = `<div style="margin-top:0.5rem;color:var(--green);font-weight:700;font-size:0.9rem;">🎵 ${file.name}</div>`;
}

// ── Gallery ───────────────────────────────────────────────────
function buildGallery() {
  const track = document.getElementById('galleryTrack');
  const dots = document.getElementById('galleryDots');
  track.innerHTML = '';
  dots.innerHTML = '';
  state.galleryIndex = 0;

  state.photos.forEach((src, i) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = `Memory ${i + 1}`;
    if (i !== 0) img.style.display = 'none';
    track.appendChild(img);

    const dot = document.createElement('div');
    dot.className = 'gallery-dot' + (i === 0 ? ' active' : '');
    dot.onclick = () => goToSlide(i);
    dots.appendChild(dot);
  });
}

function slideGallery(dir) {
  const images = document.querySelectorAll('#galleryTrack img');
  const dots = document.querySelectorAll('.gallery-dot');
  if (!images.length) return;

  images[state.galleryIndex].style.display = 'none';
  dots[state.galleryIndex].classList.remove('active');

  state.galleryIndex = (state.galleryIndex + dir + images.length) % images.length;

  images[state.galleryIndex].style.display = 'block';
  dots[state.galleryIndex].classList.add('active');
}

function goToSlide(index) {
  const images = document.querySelectorAll('#galleryTrack img');
  const dots = document.querySelectorAll('.gallery-dot');
  if (!images.length) return;

  images[state.galleryIndex].style.display = 'none';
  dots[state.galleryIndex].classList.remove('active');
  state.galleryIndex = index;
  images[state.galleryIndex].style.display = 'block';
  dots[state.galleryIndex].classList.add('active');
}

// ── Countdown Timer ───────────────────────────────────────────
function startCountdown(dateStr) {
  if (state.countdownInterval) clearInterval(state.countdownInterval);

  function tick() {
    const now = new Date();
    const target = new Date(dateStr);
    
    // Set to current year if passed
    if (target < now) {
      target.setFullYear(now.getFullYear() + 1);
    }

    const diff = target - now;

    if (diff <= 0) {
      document.getElementById('cdDays').textContent = '00';
      document.getElementById('cdHours').textContent = '00';
      document.getElementById('cdMins').textContent = '00';
      document.getElementById('cdSecs').textContent = '00';
      clearInterval(state.countdownInterval);
      document.querySelector('.countdown-box h3').textContent = '🎂 Happy Birthday! Today is the day!';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('cdDays').textContent = String(days).padStart(2, '0');
    document.getElementById('cdHours').textContent = String(hours).padStart(2, '0');
    document.getElementById('cdMins').textContent = String(mins).padStart(2, '0');
    document.getElementById('cdSecs').textContent = String(secs).padStart(2, '0');
  }

  tick();
  state.countdownInterval = setInterval(tick, 1000);
}

// ── Gift Reveal ───────────────────────────────────────────────
let giftOpened = false;

function revealGift() {
  if (giftOpened) return;
  giftOpened = true;

  const lid = document.getElementById('giftLid');
  const msg = document.getElementById('giftMessage');
  const hint = document.querySelector('.gift-hint');

  lid.classList.add('opened');
  setTimeout(() => {
    lid.style.display = 'none';
    msg.style.display = 'block';
    hint.textContent = '🎉 Gift revealed! Happy Birthday!';
    burstConfetti();
    showToast('🎁 Gift revealed!');
  }, 500);
}

// ── Music Player ──────────────────────────────────────────────
function toggleMusic() {
  const music = document.getElementById('wishMusic');
  const btn = document.getElementById('musicToggle');

  if (state.musicPlaying) {
    music.pause();
    btn.textContent = '▶ Play Music';
    state.musicPlaying = false;
  } else {
    music.play().catch(() => showToast('⚠️ Could not play music'));
    btn.textContent = '⏸ Pause Music';
    state.musicPlaying = true;
  }
}

// ── Group Wish (on Wish Display Page) ─────────────────────────
function addGroupWish() {
  const name = document.getElementById('commenterName').value.trim();
  const msg = document.getElementById('commenterMessage').value.trim();

  if (!name || !msg) {
    showToast('⚠️ Please enter your name and message');
    return;
  }

  const list = document.getElementById('wishMessagesList');
  const item = document.createElement('div');
  item.className = 'wish-item';
  item.innerHTML = `
    <div class="wish-item-name">💌 ${escapeHtml(name)}</div>
    <div class="wish-item-msg">${escapeHtml(msg)}</div>
  `;
  list.appendChild(item);

  document.getElementById('commenterName').value = '';
  document.getElementById('commenterMessage').value = '';
  showToast('💌 Your wish has been added!');
}

// ── Group Wish Board Section ───────────────────────────────────
function addToWishBoard() {
  const name = document.getElementById('groupName').value.trim();
  const msg = document.getElementById('groupMessage').value.trim();

  if (!name || !msg) {
    showToast('⚠️ Please fill in your name and message');
    return;
  }

  const board = document.getElementById('wishBoardItems');
  
  // Remove empty state
  const empty = board.querySelector('.wish-board-empty');
  if (empty) empty.remove();

  const item = document.createElement('div');
  item.className = 'board-item';
  item.innerHTML = `
    <div class="board-item-name">🌟 ${escapeHtml(name)}</div>
    <div class="board-item-msg">${escapeHtml(msg)}</div>
  `;
  board.prepend(item);

  document.getElementById('groupName').value = '';
  document.getElementById('groupMessage').value = '';

  burstConfetti();
  showToast('🎉 Wish added to the board!');
}

const aiWishes = [
  "May your birthday be as bright and beautiful as the smile you share with the world every single day! Wishing you endless joy, laughter, and love! 🎉",
  "On this special day, may all your dreams take flight and the universe shower you with blessings beyond imagination. You deserve every bit of happiness! ✨",
  "Another year older, a thousand times wiser and more wonderful! Here's to celebrating the incredible person you are and all the magic you bring into our lives! 🎂",
  "May your birthday be the start of a year filled with sweet surprises, warm memories, and all the love your heart can hold. You are truly one of a kind! 💖",
  "Wishing you a birthday as dazzling as fireworks, as sweet as birthday cake, and as warm as the love that surrounds you today and always! 🎆",
  "Today the world celebrates you — and honestly, every single day should! You make everything brighter just by being in it. Happy, happy birthday! 🌟",
  "May the candles on your cake light up not just the room, but your entire journey ahead — full of adventure, laughter, and moments that take your breath away! 🕯️",
  "Here's to you: the person who makes ordinary days extraordinary and turns every room into a celebration. Wishing you a birthday just as magical as you are! 🦋",
  "May every wish you blow out on your candles come true, every dream you've kept close finally bloom, and every day ahead shine brighter than the last! 🌸",
  "Sending you the biggest virtual hug, the warmest birthday wishes, and a reminder that you are so incredibly loved and cherished. Have the most amazing day! 🤗",
];

function generateAIWish() {
  const wish = aiWishes[Math.floor(Math.random() * aiWishes.length)];
  document.getElementById('aiWishText').textContent = wish;
  document.getElementById('aiModal').style.display = 'flex';
}

function useAIWish() {
  const text = document.getElementById('aiWishText').textContent;
  document.getElementById('wishMessage').value = text;
  closeAIModal();
  showToast('✅ AI wish added to your form!');
}

function closeAIModal(e) {
  if (e && e.target !== document.getElementById('aiModal')) return;
  document.getElementById('aiModal').style.display = 'none';
}

// ── Poster Maker ──────────────────────────────────────────────
function initPosterControls() {
  updatePoster();
}

function updatePoster() {
  const name = document.getElementById('posterName')?.value || 'Friend';
  const from = document.getElementById('posterFrom')?.value || 'Someone Special';
  const msg = document.getElementById('posterMessage')?.value || '';
  const font = document.getElementById('posterFont')?.value || 'Pacifico';

  const nameEl = document.getElementById('posterDisplayName');
  const fromEl = document.getElementById('posterDisplayFrom');
  const msgEl = document.getElementById('posterDisplayMsg');
  const preview = document.getElementById('posterPreview');

  if (nameEl) nameEl.textContent = name;
  if (fromEl) fromEl.textContent = '— ' + from;
  if (msgEl) msgEl.textContent = msg;
  if (preview) {
    preview.style.fontFamily = `'${font}', cursive`;
    const nameDisplay = document.getElementById('posterDisplayName');
    if (nameDisplay) nameDisplay.style.fontFamily = `'${font}', cursive`;
  }
}

function updatePosterPhoto() {
  const file = document.getElementById('posterPhoto').files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = document.getElementById('posterPhotoImg');
    const placeholder = document.getElementById('posterPhotoPlaceholder');
    img.src = e.target.result;
    img.style.display = 'block';
    placeholder.style.display = 'none';
  };
  reader.readAsDataURL(file);
}

function setPosterBg(el, bg) {
  document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
  el.classList.add('active');
  state.posterBg = bg;
  const preview = document.getElementById('posterPreview');
  preview.className = `poster-preview bg-${bg}`;
}

function addSticker(el) {
  const stickersLayer = document.getElementById('posterStickersLayer');
  const sticker = document.createElement('span');
  sticker.className = 'poster-sticker-item';
  sticker.textContent = el.textContent;
  sticker.style.left = (Math.random() * 70 + 5) + '%';
  sticker.style.top = (Math.random() * 70 + 5) + '%';
  sticker.style.animationDelay = (Math.random() * 2) + 's';
  stickersLayer.appendChild(sticker);
  showToast(`${el.textContent} sticker added!`);
}

// ── Poster Download ───────────────────────────────────────────
function downloadPoster() {
  showToast('📥 Preparing your poster…');

  // Use html2canvas if available, otherwise use SVG fallback
  if (typeof html2canvas !== 'undefined') {
    const poster = document.getElementById('posterPreview');
    html2canvas(poster, { scale: 2, useCORS: true, allowTaint: true }).then(canvas => {
      const link = document.createElement('a');
      link.download = 'birthday-poster.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      showToast('🎉 Poster downloaded!');
    });
  } else {
    // Fallback: generate canvas poster
    generateCanvasPoster();
  }
}

function generateCanvasPoster() {
  const canvas = document.createElement('canvas');
  canvas.width = 960;
  canvas.height = 1360;
  const ctx = canvas.getContext('2d');

  // Background gradient
  const bgMap = {
    sunset: ['#ff6b9d', '#c44dff', '#ffb347'],
    purple: ['#667eea', '#764ba2', '#667eea'],
    pink: ['#f093fb', '#f5576c', '#f093fb'],
    blue: ['#4facfe', '#00f2fe', '#4facfe'],
    green: ['#43e97b', '#38f9d7', '#43e97b'],
    gold: ['#fa709a', '#fee140', '#fa709a'],
  };

  const colors = bgMap[state.posterBg] || bgMap.sunset;
  const grd = ctx.createLinearGradient(0, 0, 960, 1360);
  grd.addColorStop(0, colors[0]);
  grd.addColorStop(0.5, colors[1]);
  grd.addColorStop(1, colors[2]);
  ctx.fillStyle = grd;
  ctx.roundRect(0, 0, 960, 1360, 48);
  ctx.fill();

  // White overlay circle for photo
  ctx.beginPath();
  ctx.arc(480, 320, 220, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.fill();

  // Photo if available
  const photoSrc = document.getElementById('posterPhotoImg').src;
  if (photoSrc && document.getElementById('posterPhotoImg').style.display !== 'none') {
    try {
      const img = document.getElementById('posterPhotoImg');
      ctx.save();
      ctx.beginPath();
      ctx.arc(480, 320, 200, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(img, 280, 120, 400, 400);
      ctx.restore();
    } catch (e) { /* skip */ }
  } else {
    ctx.font = '120px serif';
    ctx.textAlign = 'center';
    ctx.fillText('📸', 480, 360);
  }

  // Happy Birthday text
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.font = 'bold 36px Nunito, sans-serif';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '8px';
  ctx.fillText('HAPPY BIRTHDAY', 480, 600);

  // Name
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 96px Georgia, serif';
  ctx.fillText(document.getElementById('posterName').value || 'Friend', 480, 720);

  // Divider
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = '32px serif';
  ctx.fillText('— ✦ —', 480, 790);

  // Message
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.font = '28px Nunito, sans-serif';
  const msg = document.getElementById('posterMessage').value || '';
  wrapCanvasText(ctx, msg, 480, 870, 800, 40);

  // From
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.font = 'bold 30px Nunito, sans-serif';
  ctx.fillText('— ' + (document.getElementById('posterFrom').value || 'Someone Special'), 480, 1250);

  // Corner decorations
  ctx.font = '60px serif';
  ctx.fillText('🎈', 80, 110);
  ctx.fillText('🎊', 860, 110);
  ctx.fillText('🌟', 80, 1290);
  ctx.fillText('🎂', 860, 1290);

  const link = document.createElement('a');
  link.download = 'birthday-poster-wishbloom.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
  showToast('🎉 Poster downloaded!');
}

function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    if (ctx.measureText(testLine).width > maxWidth && i > 0) {
      ctx.fillText(line, x, y);
      line = words[i] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}

// ── Toast ──────────────────────────────────────────────────────
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ── Utility ────────────────────────────────────────────────────
function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

// ── Canvas roundRect polyfill ──────────────────────────────────
if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
    this.beginPath();
    this.moveTo(x + r, y);
    this.lineTo(x + w - r, y);
    this.quadraticCurveTo(x + w, y, x + w, y + r);
    this.lineTo(x + w, y + h - r);
    this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    this.lineTo(x + r, y + h);
    this.quadraticCurveTo(x, y + h, x, y + h - r);
    this.lineTo(x, y + r);
    this.quadraticCurveTo(x, y, x + r, y);
    this.closePath();
    return this;
  };
}
function startConfetti(){

  const container = document.getElementById("confetti-container")
  
  for(let i=0;i<80;i++){
  
  let confetti = document.createElement("div")
  
  confetti.style.position="fixed"
  confetti.style.width="10px"
  confetti.style.height="10px"
  confetti.style.background="hsl("+Math.random()*360+",100%,50%)"
  
  confetti.style.left=Math.random()*100+"vw"
  confetti.style.top="-10px"
  
  container.appendChild(confetti)
  
  let fall=setInterval(()=>{
  
  confetti.style.top=(confetti.offsetTop+5)+"px"
  
  if(confetti.offsetTop>window.innerHeight){
  
  confetti.remove()
  clearInterval(fall)
  
  }
  
  },30)
  
  }
  
  }
