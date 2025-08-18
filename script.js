let highestZ = 1;
class Paper {
  holdingPaper = false;
  mouseTouchX = 0;
  mouseTouchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    // Handle both mouse and touch movement
    const moveHandler = (x, y) => {
      if (!this.rotating) {
        this.mouseX = x;
        this.mouseY = y;
        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
      }

      const dirX = x - this.mouseTouchX;
      const dirY = y - this.mouseTouchY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;
      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = 180 * angle / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;

      if (this.rotating) {
        this.rotation = degrees;
      }

      if (this.holdingPaper) {
        if (!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;
        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    };

    // Mouse move
    document.addEventListener('mousemove', (e) => {
      moveHandler(e.clientX, e.clientY);
    });

    // Touch move
    document.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      moveHandler(touch.clientX, touch.clientY);
    });

    // Mouse down
    paper.addEventListener('mousedown', (e) => {
      this.startDrag(e.clientX, e.clientY, paper, e.button);
    });

    // Touch start
    paper.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      this.startDrag(touch.clientX, touch.clientY, paper, 0);
    });

    // Mouse up
    window.addEventListener('mouseup', () => this.endDrag());
    // Touch end
    window.addEventListener('touchend', () => this.endDrag());
  }

  startDrag(x, y, paper, button) {
    if (this.holdingPaper) return;
    this.holdingPaper = true;
    paper.style.zIndex = highestZ;
    highestZ += 1;

    if (button === 0) {
      this.mouseTouchX = x;
      this.mouseTouchY = y;
      this.prevMouseX = x;
      this.prevMouseY = y;
    }
    if (button === 2) {
      this.rotating = true;
    }
  }

  endDrag() {
    this.holdingPaper = false;
    this.rotating = false;
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));
papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});
