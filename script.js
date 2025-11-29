console.log("JS LOADED");
document.addEventListener('DOMContentLoaded', () => {
  // Cache essential nodes
  const face = document.querySelector('svg');
  const loginForm = document.querySelector('form');
  const leftEarOuter = document.getElementById('leftEarOuter');
  const rightEarOuter = document.getElementById('rightEarOuter');

  // Guard: ensure required elements exist
  if (!face || !loginForm || !leftEarOuter || !rightEarOuter) {
    console.warn('Required elements not found. Check SVG IDs and form structure.');
    return;
  }

  // Eyes (must exist in SVG with class="eye")
  let leftEye = document.getElementById('leftEye');
  let rightEye = document.getElementById('rightEye');

  const SVG_NS = 'http://www.w3.org/2000/svg';

  // Create a black ellipse eye
  function createEllipseEye(cx, cy, side) {
    const el = document.createElementNS(SVG_NS, 'ellipse');
    el.setAttribute('id', side === 'left' ? 'leftEye' : 'rightEye');
    el.setAttribute('class', 'eye');
    el.setAttribute('cx', cx);
    el.setAttribute('cy', cy);
    el.setAttribute('rx', 10);
    el.setAttribute('ry', 14);
    el.setAttribute('fill', 'black');
    return el;
  }

  // Create a heart eye <text>
  function createHeartEye(x, y, side) {
    const t = document.createElementNS(SVG_NS, 'text');
    t.setAttribute('id', side === 'left' ? 'leftEye' : 'rightEye');
    t.setAttribute('class', 'eye');
    t.setAttribute('font-size', '20');
    t.setAttribute('x', x);
    t.setAttribute('y', y);
    t.textContent = '❤️';
    return t;
  }

  // Reset eyes to neutral black ellipses (and clear transforms)
  function resetEyes() {
    const left = createEllipseEye(80, 90, 'left');
    const right = createEllipseEye(120, 90, 'right');
    face.querySelector('#leftEye')?.replaceWith(left);
    face.querySelector('#rightEye')?.replaceWith(right);
    leftEye = left;
    rightEye = right;
    leftEye.removeAttribute('transform');
    rightEye.removeAttribute('transform');
  }

  // Wiggle ears briefly
  function wiggleEars() {
    leftEarOuter.classList.add('wiggle');
    rightEarOuter.classList.add('wiggle');
    setTimeout(() => {
      leftEarOuter.classList.remove('wiggle');
      rightEarOuter.classList.remove('wiggle');
    }, 500);
  }

  // Bounce animation for hearts
  function bounceHearts() {
    leftEye.classList.add('bounce');
    rightEye.classList.add('bounce');
    setTimeout(() => {
      leftEye.classList.remove('bounce');
      rightEye.classList.remove('bounce');
    }, 600);
  }

  // Switch eyes to hearts + wiggle
  function activateHearts() {
    const left = createHeartEye(75, 95, 'left');
    const right = createHeartEye(115, 95, 'right');
    face.querySelector('#leftEye')?.replaceWith(left);
    face.querySelector('#rightEye')?.replaceWith(right);
    leftEye = left;
    rightEye = right;
    // Clear any previous transform so bounce is centered
    leftEye.removeAttribute('transform');
    rightEye.removeAttribute('transform');
    wiggleEars();
    bounceHearts();
  }

  // Desktop cursor tracking (transform-based)
  const isDesktop = window.matchMedia('(min-width: 768px)').matches;
  if (isDesktop) {
    document.addEventListener('mousemove', (e) => {
      // Ensure references are fresh (in case eyes were replaced)
      leftEye = document.getElementById('leftEye');
      rightEye = document.getElementById('rightEye');
      if (!leftEye || !rightEye) return;

      const rect = face.getBoundingClientRect();
      const faceCenterX = rect.left + rect.width / 2;
      const faceCenterY = rect.top + rect.height / 2;

      const dx = (e.clientX - faceCenterX) / 40;
      const dy = (e.clientY - faceCenterY) / 40;

      const formRect = loginForm.getBoundingClientRect();
      const insideForm =
        e.clientX >= formRect.left &&
        e.clientX <= formRect.right &&
        e.clientY >= formRect.top &&
        e.clientY <= formRect.bottom;

      if (insideForm) {
        // Hearts + wiggle while cursor is inside form
        if (leftEye.tagName.toLowerCase() !== 'text') {
          activateHearts();
        }
      } else {
        // Eyes track cursor smoothly using transform
        leftEye.setAttribute('transform', `translate(${dx}, ${dy})`);
        rightEye.setAttribute('transform', `translate(${dx}, ${dy})`);
      }
    });
  }

  // Focus listeners for each input section
  ['username', 'email', 'password'].forEach((id) => {
    const input = document.getElementById(id);
    if (!input) return;
    input.addEventListener('focus', activateHearts);
    input.addEventListener('blur', resetEyes);
  });

  // Login button listeners
  const loginButton = document.getElementById('loginButton');
  if (loginButton) {
    loginButton.addEventListener('focus', activateHearts);
    loginButton.addEventListener('blur', resetEyes);
  }

  // Initialize to neutral eyes if not present
  if (!leftEye || !rightEye) {
    resetEyes();
  }

  console.log('Interaction script initialized.');
});

/* 📱 Mobile (no cursor tracking, compact form) */
@media only screen and (max-width: 767px) {
  svg {
    width: 200px;
    height: auto;
    margin: 0 auto;
  }

  .eye {
    transition: none; /* disable transitions on mobile */
  }

  form {
    max-width: 360px;
    padding: 20px;
  }
}

/* 🖥️ Desktop (cursor tracking, smooth animations) */
@media only screen and (min-width: 768px) {
  svg {
    width: 300px;
    height: auto;
    margin: 0 auto;
  }

  .eye {
    transition: transform 0.3s ease, fill 0.3s ease;
    transform-origin: center; /* ensures smooth pivot for bounce/wiggle */
  }

  form {
    max-width: 450px;
    padding: 30px;
  }
}
