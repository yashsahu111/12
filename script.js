/* Mobile-friendly romantic page
   - Replace 'messages' array and the letter content below
   - Replace audio src in index.html with your song file (song.mp3 placeholder)
   - Music will play after user taps 'Play song' (browsers require user gesture)
*/

const messages = [
  "Hi love 💕 — I made this just for you.",
  "You’re the light in my life — your laugh, your eyes, your tiny quirks.",
  "Every day with you feels like a gentle dream.",
  "I miss your hand in mine and your warm hugs.",
  "Open the letter for a little secret from my heart..."
];

// ---------- elements ----------
const startBtn = document.getElementById('startBtn');
const messagesSection = document.getElementById('messages');
const msgArea = document.getElementById('msgArea');
const nextBtn = document.getElementById('nextBtn');
const autoBtn = document.getElementById('autoBtn');
const envelope = document.getElementById('envelope');
const letterWrapper = document.getElementById('letterWrapper');
const envCover = document.getElementById('envCover');
const letter = document.getElementById('letter');
const playBtn = document.getElementById('playBtn');
const bgAudio = document.getElementById('bgAudio');
const heartsContainer = document.getElementById('hearts');

let idx = 0;
let autoMode = false;
let autoTimer = null;

// start: reveal messages and show first message
startBtn.addEventListener('click', () => {
  // show messages area nicely
  messagesSection.scrollIntoView({behavior:'smooth', block:'center'});
  showMessage(0);
  startBtn.disabled = true;
});

// next button
nextBtn.addEventListener('click', () => {
  advanceMessage();
});

// toggle auto mode (auto-advance messages)
autoBtn.addEventListener('click', () => {
  autoMode = !autoMode;
  autoBtn.textContent = autoMode ? 'Auto: ON' : 'Auto';
  if (autoMode) startAuto(); else stopAuto();
});

function startAuto(){
  stopAuto();
  autoTimer = setInterval(() => {
    advanceMessage();
  }, 2500);
}
function stopAuto(){
  if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
}

// show a specific message
function showMessage(i){
  msgArea.innerHTML = '';
  if (i < 0 || i >= messages.length) return;
  idx = i;
  const el = document.createElement('div');
  el.className = 'message';
  el.innerHTML = messages[i];
  msgArea.appendChild(el);
  // small delay for animation class
  requestAnimationFrame(()=> el.classList.add('show'));
  // if last message, show "open letter" button instead of Next
  if (i === messages.length - 1) {
    nextBtn.textContent = 'Open Letter';
  } else {
    nextBtn.textContent = 'Next';
  }
}

// advance message or open letter if last
function advanceMessage(){
  if (idx < messages.length - 1){
    idx++;
    showMessage(idx);
  } else {
    // final: open letter
    openLetter();
  }
}

// open the letter (animation + hearts)
function openLetter(){
  letterWrapper.setAttribute('aria-hidden','false');
  envelope.classList.add('open');
  // disable page background interactions (if any)
  document.body.classList.add('noscroll');
  // spawn hearts
  spawnHearts(30);
}

// close letter
const closeBtn = document.getElementById('closeLetter');
closeBtn.addEventListener('click', () => {
  envelope.classList.remove('open');
  letterWrapper.setAttribute('aria-hidden','true');
  document.body.classList.remove('noscroll');
});

// audio play: browsers require user interaction; button toggles play/pause
playBtn.addEventListener('click', () => {
  if (bgAudio.paused){
    bgAudio.play().catch(()=>{/* play might fail if blocked */});
    playBtn.textContent = '⏸ Pause song';
  } else {
    bgAudio.pause();
    playBtn.textContent = '▶ Play song';
  }
});

// hearts helper
function spawnHearts(count = 20){
  for (let i=0;i<count;i++){
    createHeart();
  }
}

function createHeart(){
  const h = document.createElement('div');
  h.className = 'heart';
  h.innerText = '❤️';
  // horizontal start position (safe inside viewport)
  h.style.left = (5 + Math.random()*90) + 'vw';
  h.style.fontSize = (16 + Math.random()*28) + 'px';
  h.style.animationDuration = (3 + Math.random()*2) + 's';
  heartsContainer.appendChild(h);
  setTimeout(()=> h.remove(), 5200);
}

/* Optional: make tapping a message also go next (friendly UX) */
msgArea.addEventListener('click', () => {
  advanceMessage();
});

// --- initialize: create first empty slot so layout looks nice
showMessage(0);

// Allow editing messages via comments in this file or by changing `messages` array above.
