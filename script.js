const envelope = document.getElementById('envelope');

envelope.addEventListener('click', () => {
  envelope.classList.toggle('open');
  document.body.classList.toggle('noscroll', envelope.classList.contains('open'));
});
