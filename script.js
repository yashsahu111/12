const questions = document.querySelectorAll('.question');
const result = document.querySelector('.result');
const heartsContainer = document.getElementById('hearts');

questions.forEach((q, index) => {
  const buttons = q.querySelectorAll('button');
  const feedback = q.querySelector('.feedback');
  const correctAnswer = q.dataset.answer;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.textContent.trim() === correctAnswer) {
        // correct → next question
        feedback.textContent = "";
        q.classList.remove('active');
        if (index < questions.length - 1) {
          questions[index + 1].classList.add('active');
        } else {
          result.style.display = 'block';
          spawnHearts();
        }
      } else {
        // wrong → sarcasm
        const sarcasticLines = [
          "😏 Really? Try again.",
          "😂 Wrong answer, silly!",
          "🙄 You sure about that?",
          "🤣 Haha, nope!"
        ];
        feedback.textContent = sarcasticLines[Math.floor(Math.random() * sarcasticLines.length)];
      }
    });
  });
});

function spawnHearts() {
  for (let i = 0; i < 40; i++) {
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
