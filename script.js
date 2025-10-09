// Elements
const openBtn = document.getElementById('openBtn');
const modal = document.getElementById('modal');
const backdrop = document.getElementById('backdrop');
const closeBtn = document.getElementById('closeBtn');
const bgAudio = document.getElementById('bgAudio');
const playPauseBtn = document.getElementById('playPauseBtn');
const heartsContainer = document.getElementById('hearts');

// Open modal: show, play audio, spawn some hearts
openBtn.addEventListener('click', () => {
  showModal();
  // user gesture -> play audio allowed on mobile
  bgAudio.play().catch(()=>{ /* ignore if blocked */ });
  // change play button text
  if (playPauseBtn) playPauseBtn.textContent = '⏸ Pause song';
});

// Close modal when clicking close or backdrop
closeBtn.addEventListener('click', hideModal);
backdrop.addEventListener('click', hideModal);

// show modal function
function showModal(){
  modal.classList.add('show');
  modal.setAttribute('aria-hidden','false');
  // spawn a few hearts for effect
  spawnHearts(12);
  // focus the letter content for scroll/keyboard
  const content = document.getElementById('letterContent');
  if (content) content.focus();
}

// hide modal function
function hideModal(){
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden','true');
  // pause music when closed (optional)
  if (!bgAudio.paused) { bgAudio.pause(); if (playPauseBtn) playPauseBtn.textContent='▶ Play song'; }
}

// play/pause control inside modal
if (playPauseBtn){
  playPauseBtn.addEventListener('click', () => {
    if (bgAudio.paused) {
      bgAudio.play().catch(()=>{});
      playPauseBtn.textContent = '⏸ Pause song';
    } else {
      bgAudio.pause();
      playPauseBtn.textContent = '▶ Play song';
    }
  });
}

// spawn floating hearts
function spawnHearts(count = 10){
  for (let i=0;i<count;i++){
    createHeart();
  }
}
function createHeart(){
  const el = document.createElement('div');
  el.className = 'heart';
  el.innerText = '❤️';
  el.style.left = (5 + Math.random()*90) + 'vw';
  el.style.fontSize = (14 + Math.random()*24) + 'px';
  el.style.animationDuration = (3 + Math.random()*2) + 's';
  heartsContainer.appendChild(el);
  setTimeout(()=> el.remove(), 5200);
}

/* Accessibility: close modal on ESC */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('show')) hideModal();
});
