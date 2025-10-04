const messages = [
  "Hey beautiful 💕",
  "You’re the calm after my storms 🌈",
  "You make everything brighter ✨",
  "Your hugs are my favorite place 🤗",
  "Now open your letter 💌"
];

const msgArea = document.getElementById('msgArea');
const autoBtn = document.getElementById('autoBtn');
const heartsContainer = document.getElementById('hearts');
const playBtn = document.getElementById('playBtn');
const bgAudio = document.getElementById('bgAudio');
const envelope = document.getElementById('envelope');
const letterSection = document.getElementById('letterSection');

let idx = -1;
let auto = false;
let timer = null;

autoBtn.addEventListener('click', ()=>{
  auto = !auto;
  autoBtn.textContent = auto ? 'Auto: ON' : 'Auto';
  if(auto){ startAuto(); } else { stopAuto(); }
});

function startAuto(){
  stopAuto();
  // faster auto: every 1.8 seconds instead of 2.5
  timer = setInterval(showNext, 1800);
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
  } else {
    stopAuto();
    revealLetter();
  }
}

// reveal and open letter
function revealLetter(){
  letterSection.classList.add('show');
  envelope.classList.add('open');
  spawnHearts(30);
  letterSection.scrollIntoView({behavior:'smooth'});
}

// hearts
function spawnHearts(count=20){
  for(let i=0;i<count;i++) createHeart();
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

// Music control
playBtn.addEventListener('click', ()=>{
  if(bgAudio.paused){
    bgAudio.play().catch(()=>{});
    playBtn.textContent='⏸ Pause';
  } else {
    bgAudio.pause();
    playBtn.textContent='▶ Play';
  }
});
