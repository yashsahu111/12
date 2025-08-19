const card = document.getElementById('card');
const heartsContainer = document.getElementById('hearts');

card.addEventListener('click', () => {
  card.classList.toggle('open');

  // When card opens, trigger hearts
  if (card.classList.contains('open')) {
    for (let i = 0; i < 15; i++) {
      createHeart();
    }
  }
});

function createHeart() {
  const heart = document.createElement('div');
  heart.classList.add('heart');
  heart.innerHTML = '❤️';

  // random horizontal position
  heart.style.left = Math.random() * 100 + 'vw';
  // random animation duration
  heart.style.animationDuration = (3 + Math.random() * 2) + 's';
  // random size
  heart.style.fontSize = (20 + Math.random() * 20) + 'px';

  heartsContainer.appendChild(heart);

  // remove after animation ends
  setTimeout(() => {
    heart.remove();
  }, 5000);
}
