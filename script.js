console.log("JS LOADED");
document.addEventListener('DOMContentLoaded', () => {
  const face = document.querySelector('svg');
  const loginForm = document.querySelector('form');
  const leftEarOuter = document.getElementById('leftEarOuter');
  const rightEarOuter = document.getElementById('rightEarOuter');

  if (!face || !loginForm || !leftEarOuter || !rightEarOuter) {
    console.warn('Required elements not found. Check SVG IDs and form structure.');
    return;
  }

  let leftEye = document.getElementById('leftEye');
  let rightEye = document.getElementById('rightEye');
  const SVG_NS = 'http://www.w3.org/2000/svg';

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

  function createHeartEye(x, y, side) {
    const t = document.createElementNS(SVG_NS, 'text');
    t.setAttribute('id', side === 'left' ? 'leftEye' : 'rightEye');
    t.setAttribute('class', 'eye bounce');
    t.setAttribute('font-size', '20');
    t.setAttribute('x', x);
    t.setAttribute('y', y);
    // keep emoji simple; some devices need a font — emoji usually works
    t.textContent = '❤️';
    return t;
  }

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

  function activateHeartsMobile() {
    const left = createHeartEye(75, 95, 'left');
    const right = createHeartEye(115, 95, 'right');
    face.querySelector('#leftEye')?.replaceWith(left);
    face.querySelector('#rightEye')?.replaceWith(right);
    leftEye = left;
    rightEye = right;

    leftEarOuter.classList.add('wiggle');
    rightEarOuter.classList.add('wiggle');

    // Reset after 1 second
    setTimeout(() => {
      leftEarOuter.classList.remove('wiggle');
      rightEarOuter.classList.remove('wiggle');
      resetEyes();
    }, 1000);
  }

  // Desktop logic
  const isDesktop = window.matchMedia('(min-width: 768px)').matches;
  console.log('Desktop branch active:', isDesktop);
  if (isDesktop) {
    document.addEventListener('mousemove', (e) => {
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
        if (leftEye.tagName.toLowerCase() !== 'text') {
          const left = createHeartEye(75, 95, 'left');
          const right = createHeartEye(115, 95, 'right');
          face.querySelector('#leftEye')?.replaceWith(left);
          face.querySelector('#rightEye')?.replaceWith(right);
          leftEye = left;
          rightEye = right;

          leftEarOuter.classList.add('wiggle');
          rightEarOuter.classList.add('wiggle');

          setTimeout(() => {
            leftEarOuter.classList.remove('wiggle');
            rightEarOuter.classList.remove('wiggle');
            resetEyes();
          }, 1000);
        }
      } else {
        leftEye.setAttribute('transform', `translate(${dx}, ${dy})`);
        rightEye.setAttribute('transform', `translate(${dx}, ${dy})`);
      }
    });
  }

  // Mobile logic
  const isMobile = window.matchMedia('(max-width: 767px)').matches;
  console.log('Mobile branch active:', isMobile);
  if (isMobile) {
    ['username', 'email', 'password', 'loginButton'].forEach((id) => {
      const input = document.getElementById(id);
      console.log('Hooking input:', id, '=>', !!input);
      if (!input) return;
      input.addEventListener('focus', activateHeartsMobile);
      input.addEventListener('click', activateHeartsMobile);
    });
  }

  // Initialize eyes
  if (!leftEye || !rightEye) {
    resetEyes();
  }

  console.log('Interaction script initialized.');
}); // <-- this closing brace was missing before
