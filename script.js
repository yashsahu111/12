/* Full-page romantic experience
   Sections:
   1) Auto messages
   2) Music player with lyrics (replace song.mp3 and timestamps)
   3) Heart tapping game
*/

/* ---------------- SETTINGS ---------------- */
const messages = [
  "Hey beautiful 💕",
  "You’re the calm after my storms 🌈",
  "You make everything brighter ✨",
  "Your hugs are my favorite place 🤗",
  "Open the music and enjoy... 🎵"
];

// --- Lyrics and timestamps (seconds) ---
// Replace these with your real lyrics and timestamps for exact sync.
// timestamps array must have same length as lyrics array.
// Example: [0, 8.5, 16, 26] meaning show line 0 at 0s, line1 at 8.5s, etc.
const lyrics = [
  "Line 1 of the lyrics — gentle start",
  "Line 2 — the chorus begins",
  "Line 3 — bridge that hugs",
  "Line 4 — the heart chorus",
  "Line 5 — tender ending"
];
const timestamps = [0, 8, 16, 26, 36]; // seconds — edit to match your song

/* ---------------- DOM ---------------- */
const msgArea = document.getElementById('msgArea');
const autoBtn = document.getElementById('autoBtn');
const stopAutoBtn = document.getElementById('stopAutoBtn');
const playBtn = document.getElementById('playBtn');
const bgAudio = document.getElementById('bgAudio');

const playerSection = document.getElementById('playerSection');
const lyricsInner = document.getElementById('lyricsInner');
const playPause = document.getElementById('playPause');
const progressBar = document.getElementById('progressBar');
const timeCur = document.getElementById('timeCur');
const timeTotal = document.getElementById('timeTotal');
const heartsContainer = document.getElementById('hearts');

const startGameBtn = document.getElementById('startGame');
const replayGameBtn = document.getElementById('replayGame');
const gameArea = document.getElementById('gameArea');
const scoreEl = document.getElementById('score');
const gameTimerEl = document.getElementById('gameTimer');

/* ---------------- MESSAGES (AUTO) ---------------- */
let msgIndex = -1;
let autoMode = false;
let autoTimer = null;

autoBtn.addEventListener('click', () => {
  autoMode = !autoMode;
  autoBtn.textContent = autoMode ? 'Auto: ON' : 'Auto';
  if (autoMode) startAutoMessages(); else stopAutoMessages();
});
stopAutoBtn && stopAutoBtn.addEventListener('click', () => { stopAutoMessages(); });

function startAutoMessages(){
  stopAutoMessages();
  // faster than before — 1.6s
  autoTimer = setInterval(showNextMessage, 1600);
}
function stopAutoMessages(){
  if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  autoMode = false;
  autoBtn.textContent = 'Auto';
}
function showNextMessage(){
  msgIndex++;
  if (msgIndex < messages.length){
    msgArea.innerHTML = '';
    const el = document.createElement('div');
    el.className = 'message';
    el.textContent = messages[msgIndex];
    msgArea.appendChild(el);
    requestAnimationFrame(()=> el.classList.add('show'));
    // scroll to player if next is the last message
    if (msgIndex === messages.length - 1){
      // after a short pause, reveal player section and scroll
      setTimeout(()=> {
        revealPlayerSection();
      }, 800);
    }
  } else {
    stopAutoMessages();
  }
}

/* -------------- PLAYER & LYRICS -------------- */
function revealPlayerSection(){
  // ensure playerSection is in view
  playerSection.scrollIntoView({behavior:'smooth', block:'start'});
  // populate lyrics lines
  populateLyrics();
}

function populateLyrics(){
  lyricsInner.innerHTML = '';
  for (let i=0;i<lyrics.length;i++){
    const l = document.createElement('div');
    l.className = 'lyric';
    l.dataset.index = i;
    l.textContent = lyrics[i];
    lyricsInner.appendChild(l);
  }
}

/* Play button at top (allows mobile play) */
playBtn.addEventListener('click', async () => {
  try {
    await bgAudio.play();
    playBtn.textContent = '⏸ Pause song';
    playPause.textContent = '❚❚';
  } catch (err) {
    console.warn('Play blocked or error', err);
  }
});

/* Play/Pause big button inside player (if user wants) */
playPause.addEventListener('click', async () => {
  if (bgAudio.paused){
    try { await bgAudio.play(); } catch(e){ }
  } else {
    bgAudio.pause();
  }
});

/* Update UI on play/pause */
bgAudio.addEventListener('play', ()=> { playPause.textContent='❚❚'; playBtn.textContent='⏸ Pause song'; });
bgAudio.addEventListener('pause', ()=> { playPause.textContent='▶'; playBtn.textContent='▶ Play song'; });

/* Update duration & progress */
bgAudio.addEventListener('loadedmetadata', ()=> {
  timeTotal.textContent = formatTime(bgAudio.duration || 0);
});
bgAudio.addEventListener('timeupdate', onTimeUpdate);

/* Seek on progress click */
document.getElementById('progressWrap').addEventListener('click', (e)=>{
  const rect = document.getElementById('progressWrap').getBoundingClientRect();
  const progressDiv = document.getElementById('progress');
  const clickX = e.clientX - rect.left - (document.getElementById('timeCur').offsetWidth + 8);
  const width = progressDiv.clientWidth;
  const pct = Math.max(0, Math.min(1, clickX / width));
  bgAudio.currentTime = pct * bgAudio.duration;
});

/* timeupdate handler — progress + lyric sync */
function onTimeUpdate(){
  const cur = bgAudio.currentTime || 0;
  const dur = bgAudio.duration || 1;
  timeCur.textContent = formatTime(cur);
  // update progress bar percent
  const pct = Math.max(0, Math.min(1, cur / dur));
  progressBar.style.width = (pct * 100) + '%';

  // sync lyrics using timestamps
  for (let i = 0; i < timestamps.length; i++){
    const start = timestamps[i];
    const end = timestamps[i+1] || Number.POSITIVE_INFINITY;
    const lyricEl = document.querySelector(`.lyric[data-index="${i}"]`);
    if (!lyricEl) continue;
    if (cur >= start && cur < end){
      if (!lyricEl.classList.contains('active')){
        document.querySelectorAll('.lyric.active').forEach(x=>x.classList.remove('active'));
        lyricEl.classList.add('active');
        // ensure lyric is visible in lyrics box
        lyricEl.scrollIntoView({behavior:'smooth', block:'center'});
      }
    } else {
      lyricEl.classList.remove('active');
    }
  }
}

function formatTime(t){
  if (!t || isNaN(t)) return '0:00';
  const minutes = Math.floor(t / 60);
  const seconds = Math.floor(t % 60).toString().padStart(2,'0');
  return `${minutes}:${seconds}`;
}

/* ---------------- GAME: Tap hearts ---------------- */
let gameRunning = false;
let gameScore = 0;
let gameTimer = 20;
let gameInterval = null;
let spawnInterval = null;

startGameBtn.addEventListener('click', startGame);
replayGameBtn.addEventListener('click', () => {
  replayGameBtn.style.display = 'none';
  startGameBtn.style.display = 'inline-block';
  resetGame();
});

function startGame(){
  if (gameRunning) return;
  gameRunning = true;
  gameScore = 0;
  gameTimer = 20;
  scoreEl.textContent = gameScore;
  document.getElementById('startGame').style.display = 'none';
  replayGameBtn.style.display = 'none';
  gameTimerEl && (gameTimerEl.textContent = gameTimer);

  // spawn hearts every 650ms
  spawnInterval = setInterval(spawnHeartInGame, 650);
  // countdown every 1s
  gameInterval = setInterval(()=>{
    gameTimer--;
    gameTimerEl && (gameTimerEl.textContent = gameTimer);
    if (gameTimer <= 0) endGame();
  }, 1000);
}

function resetGame(){
  gameRunning = false;
  gameScore = 0;
  gameTimer = 20;
  clearInterval(spawnInterval); clearInterval(gameInterval);
  spawnInterval = null; gameInterval = null;
  gameArea.innerHTML = '';
  scoreEl.textContent = '0';
  gameTimerEl && (gameTimerEl.textContent = gameTimer);
}

function endGame(){
  gameRunning = false;
  clearInterval(spawnInterval); clearInterval(gameInterval);
  spawnInterval = null; gameInterval = null;
  // remove remaining hearts
  setTimeout(()=>gameArea.innerHTML='', 400);
  // show replay and celebrate
  replayGameBtn.style.display = 'inline-block';
  // spawn celebratory hearts on page
  spawnHearts(30);
}

/* spawn a clickable heart inside game area */
function spawnHeartInGame(){
  const h = document.createElement('div');
  h.className = 'heart-game';
  h.innerText = '💖';
  const areaRect = gameArea.getBoundingClientRect();
  // random position inside area
  const size = 28 + Math.random()*22;
  const left = Math.random() * (areaRect.width - size);
  const top = Math.random() * (areaRect.height - size);
  h.style.left = left + 'px';
  h.style.top = top + 'px';
  h.style.fontSize = size + 'px';
  // click handler
  h.addEventListener('click', () => {
    if (!gameRunning) return;
    gameScore++;
    scoreEl.textContent = gameScore;
    // small pop animation
    h.style.transform = 'scale(1.25)';
    h.style.opacity = '0.2';
    setTimeout(()=> h.remove(), 220);
  });
  gameArea.appendChild(h);
  // auto-remove after 3s if not clicked
  setTimeout(()=> { if (h.parentElement) h.remove(); }, 3200);
}

/* small celebratory hearts across page */
function spawnHearts(count=20){
  for (let i=0;i<count;i++){
    const el = document.createElement('div');
    el.className = 'heart';
    el.innerText = '❤️';
    el.style.left = (5 + Math.random()*90) + 'vw';
    el.style.fontSize = (16 + Math.random()*28) + 'px';
    el.style.animationDuration = (3 + Math.random()*2) + 's';
    heartsContainer.appendChild(el);
    setTimeout(()=> el.remove(), 5200);
  }
}

/* Initialize lyrics UI so lines exist */
populateLyrics();

/* Ensure playerSection is visible when messages finish; we already call revealPlayerSection on last message */

/* Accessibility: allow tapping the lyric to jump to that timestamp */
lyricsInner.addEventListener('click', (e)=>{
  const target = e.target.closest('.lyric');
  if (!target) return;
  const idx = Number(target.dataset.index || 0);
  const t = timestamps[idx] || 0;
  bgAudio.currentTime = t;
});

/* Safety: if user never presses play, clicking Player big play also tries to play */
playPause.addEventListener('click', async ()=>{
  if (bgAudio.paused){
    try { await bgAudio.play(); } catch(e) {}
  } else {
    bgAudio.pause();
  }
});

/* When the song ends, optionally spawn a few hearts */
bgAudio.addEventListener('ended', ()=> spawnHearts(12));

/* On page unload, clear timers */
window.addEventListener('beforeunload', ()=> {
  stopAutoMessages(); resetGame();
});
