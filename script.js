/* Full-page romantic experience
   Sections:
   1) Auto messages
   2) Music player with LRC lyrics
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
    if (msgIndex === messages.length - 1){
      setTimeout(()=> { revealPlayerSection(); }, 800);
    }
  } else {
    stopAutoMessages();
  }
}

/* -------------- PLAYER & LYRICS (LRC) -------------- */
let lrcLines = [];

function revealPlayerSection(){
  playerSection.scrollIntoView({behavior:'smooth', block:'start'});
  loadLyricsLRC();
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

/* Play/Pause big button inside player */
playPause.addEventListener('click', async () => {
  if (bgAudio.paused){
    try { await bgAudio.play(); } catch(e){ }
  } else {
    bgAudio.pause();
  }
});

bgAudio.addEventListener('play', ()=> { playPause.textContent='❚❚'; playBtn.textContent='⏸ Pause song'; });
bgAudio.addEventListener('pause', ()=> { playPause.textContent='▶'; playBtn.textContent='▶ Play song'; });

/* Update duration & progress */
bgAudio.addEventListener('loadedmetadata', ()=> {
  timeTotal.textContent = formatTime(bgAudio.duration || 0);
});
bgAudio.addEventListener('timeupdate', onTimeUpdate);

document.getElementById('progressWrap').addEventListener('click', (e)=>{
  const rect = document.getElementById('progressWrap').getBoundingClientRect();
  const progressDiv = document.getElementById('progress');
  const clickX = e.clientX - rect.left - (document.getElementById('timeCur').offsetWidth + 8);
  const width = progressDiv.clientWidth;
  const pct = Math.max(0, Math.min(1, clickX / width));
  bgAudio.currentTime = pct * bgAudio.duration;
});

function onTimeUpdate(){
  const cur = bgAudio.currentTime || 0;
  const dur = bgAudio.duration || 1;
  timeCur.textContent = formatTime(cur);
  const pct = Math.max(0, Math.min(1, cur / dur));
  progressBar.style.width = (pct * 100) + '%';

  // LRC sync
  if (!lrcLines || lrcLines.length === 0) return;
  let currentIndex = 0;
  for (let i=0;i<lrcLines.length;i++){
    if (cur >= lrcLines[i].time) currentIndex = i;
    else break;
  }
  lrcLines.forEach((line, idx)=>{
    const el = document.getElementById('lrc-'+idx);
    if (!el) return;
    el.classList.toggle('active', idx===currentIndex);
  });
  const activeEl = document.getElementById('lrc-'+currentIndex);
  if (activeEl) activeEl.scrollIntoView({behavior:'smooth', block:'center'});
}

function formatTime(t){
  if (!t || isNaN(t)) return '0:00';
  const minutes = Math.floor(t / 60);
  const seconds = Math.floor(t % 60).toString().padStart(2,'0');
  return `${minutes}:${seconds}`;
}

/* ---------------- LRC LOADING ---------------- */
function loadLyricsLRC(){
  fetch('For_A_Reason.lrc')
    .then(res => res.text())
    .then(text => {
      lrcLines = text.split('\n').map(line=>{
        const match = line.match(/\[(\d+):(\d+\.\d+)\](.*)/);
        if (!match) return null;
        return {time: parseInt(match[1])*60 + parseFloat(match[2]), text: match[3]};
      }).filter(Boolean);

      lyricsInner.innerHTML = '';
      lrcLines.forEach((line, idx)=>{
        const div = document.createElement('div');
        div.className = 'lyric';
        div.id = 'lrc-'+idx;
        div.textContent = line.text;
        lyricsInner.appendChild(div);
      });
    });
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
  startGameBtn.style.display = 'none';
  replayGameBtn.style.display = 'none';
  gameTimerEl && (gameTimerEl.textContent = gameTimer);

  spawnInterval = setInterval(spawnHeartInGame, 650);
  gameInterval = setInterval(()=>{
    gameTimer--;
    gameTimerEl && (gameTimerEl.textContent = gameTimer);
    if (gameTimer <= 0) endGame();
  },1000);
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
  setTimeout(()=>gameArea.innerHTML='', 400);
  replayGameBtn.style.display = 'inline-block';
  spawnHearts(30);
}

function spawnHeartInGame(){
  const h = document.createElement('div');
  h.className = 'heart-game';
  h.innerText = '💖';
  const areaRect = gameArea.getBoundingClientRect();
  const size = 28 + Math.random()*22;
  const left = Math.random() * (areaRect.width - size);
  const top = Math.random() * (areaRect.height - size);
  h.style.left = left + 'px';
  h.style.top = top + 'px';
  h.style.fontSize = size + 'px';
  h.addEventListener('click', () => {
    if (!gameRunning) return;
    gameScore++;
    scoreEl.textContent = gameScore;
    h.style.transform = 'scale(1.25)';
    h.style.opacity = '0.2';
    setTimeout(()=> h.remove(), 220);
  });
  gameArea.appendChild(h);
  setTimeout(()=> { if (h.parentElement) h.remove(); }, 3200);
}

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

/* Accessibility: click lyric to jump */
lyricsInner.addEventListener('click', (e)=>{
  const target = e.target.closest('.lyric');
  if (!target) return;
  const idx = Number(target.id.replace('lrc-','') || 0);
  const t = lrcLines[idx]?.time || 0;
  bgAudio.currentTime = t;
});

bgAudio.addEventListener('ended', ()=> spawnHearts(12));
window.addEventListener('beforeunload', ()=> { stopAutoMessages(); resetGame(); });
