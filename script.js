const openBtn = document.getElementById('openBtn');
const modal = document.getElementById('modal');
const backdrop = document.getElementById('backdrop');
const closeBtn = document.getElementById('closeBtn');
const bgAudio = document.getElementById('bgAudio');
const heartsContainer = document.getElementById('hearts');

// open modal
openBtn.addEventListener('click', () => {
  modal.classList.add('show');
  bgAudio.play().catch(()=>{});
  spawnHearts(10);
});

// close modal
backdrop.addEventListener('click', closeModal);
closeBtn.addEventListener('click', closeModal);
function closeModal(){
  modal.classList.remove('show');
  bgAudio.pause();
}

// hearts
function spawnHearts(count=8){
  for(let i=0;i<count;i++) createHeart();
}
function createHeart(){
  const heart=document.createElement('div');
  heart.className='heart';
  heart.innerText='❤️';
  heart.style.left=(5+Math.random()*90)+'vw';
  heart.style.fontSize=(14+Math.random()*26)+'px';
  heart.style.animationDuration=(3+Math.random()*2)+'s';
  heartsContainer.appendChild(heart);
  setTimeout(()=>heart.remove(),5000);
}
