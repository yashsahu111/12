// Messages before the letter
const messages = [
  "Hey beautiful 💕",
  "You’re the calm after my storms 🌈",
  "You make everything brighter ✨",
  "Your hugs are my favorite place 🤗",
  "Now open your letter 💌"
];

const startBtn = document.getElementById('startBtn');
const msgArea = document.getElementById('msgArea');
const nextBtn = document.getElementById('nextBtn');
const autoBtn = document.getElementById('autoBtn');
const heartsContainer = document.getElementById('hearts');
const playBtn = document.getElementById('playBtn');
const bgAudio = document.getElementById('bgAudio');

let idx = -1;
let auto = false;
let timer = null;

startBtn.addEventListener('click', () => {
  showNext();
  startBtn.disabled = true;
  window.scrollTo({top:document.getElementById('messages').offsetTop,behavior:'smooth'});
});

nextBtn.addEventListener('click', showNext);
autoBtn.addEventListener('click', ()=>{
  auto = !auto;
  autoBtn.textContent = auto ? 'Auto: ON' : 'Auto';
  if(auto){ startAuto(); } else { stopAuto(); }
});

function startAuto(){
  stopAuto();
  timer = setInterval(showNext, 2500);
}
function stopAuto(){
  if(timer){ clearInterval(timer); timer=null; }
}

function showNext(){
  idx++;
  if(idx < messages.length){
    const m = document.createElement('div');
    m.className='message';
    m.textContent=messages[idx];
    msgArea.innerHTML='';
    msgArea.appendChild(m);
    requestAnimationFrame(()=>m.classList.add('show'));

    // scroll into view
    msgArea.scrollIntoView({behavior:'smooth',block:'center'});
  } else {
    spawnHearts(40);
    document.getElementById('letterWrapper').scrollIntoView({behavior:'smooth'});
    stopAuto();
  }
}

// hearts floating
function spawnHearts(count=20){
  for(let i=0;i<count;i++){
    createHeart();
  }
}
function createHeart(){
  const h=document.createElement('div');
  h.className='heart';
  h.innerText='❤️';
  h.style.left=(5+Math.random()*90)+'vw';
  h.style.fontSize=(16+Math.random()*28)+'px';
  h.style.animationDuration=(3+Math.random()*2)+'s';
  heartsContainer.appendChild(h);
  setTimeout(()=>h.remove(),5200);
}

// play/pause music
playBtn.addEventListener('click', ()=>{
  if(bgAudio.paused){
    bgAudio.play().catch(()=>{});
    playBtn.textContent='⏸ Pause song';
  } else {
    bgAudio.pause();
    playBtn.textContent='▶ Play song';
  }
});
