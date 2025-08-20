const questions = document.querySelectorAll('.question');
const result = document.querySelector('.result');
const heartsContainer = document.getElementById('hearts');

let current = 0;

questions.forEach((q, index) => {
  const buttons = q.querySelectorAll('button');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      q.classList.remove('active');
      if (index < questions.length - 1) {
        questions[index + 1].classList.add('active');
      } else {
        result.style.display = 'block';
        spawnHearts();
      }
    });
  });
});

function spawnHearts() {
  for (let i = 0; i < 30; i++) {
    createHeart();
  }
}

function createHeart() {
  const heart = document.createElement('div');
  heart.classList.add('heart');
  heart.innerHTML = '❤️';

  heart.style.left = Math.random() * 100 + 'vw';
  heart.style.animationDuration = (3 + Math.random() * 2) + 's';
  heart.style.fontSize = (20 + Math.random() * 20) + 'px';

  heartsContainer.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 5000);
}
