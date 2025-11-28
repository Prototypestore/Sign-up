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

  // Obtain eyes (may be ellipse initially)
  let leftEye = document.getElementById('leftEye');
  let rightEye = document.getElementById('rightEye');

  // SVG namespace helper
  const SVG_NS = 'http://www.w3.org/2000/svg';

  // Replace an eye node with a new node (safe in SVG)
  function replaceEye(side, newNode) {
    const current = side === 'left' ? leftEye : rightEye;
    if (!current || !current.parentNode) return;
    current.parentNode.replaceChild(newNode, current);
    if (side === 'left') leftEye = newNode;
    else rightEye = newNode;
  }

  // Create a black ellipse eye at given position
  function createEllipseEye(cx, cy) {
    const el = document.createElementNS(SVG_NS, 'ellipse');
    el.setAttribute('id', el === leftEye ? 'leftEye' : 'rightEye'); // not reliable; set explicitly later
    el.setAttribute('class', 'eye');
    el.setAttribute('cx', cx);
    el.setAttribute('cy', cy);
    el.setAttribute('rx', 10);
    el.setAttribute('ry', 14);
    el.setAttribute('fill', 'black');
    return el;
  }

  // Create a heart eye <text>
  function createHeartEye(x, y) {
    const t = document.createElementNS(SVG_NS, 'text');
    t.setAttribute('class', 'eye');
    t.setAttribute('font-size', '20');
    t.setAttribute('x', x);
    t.setAttribute('y', y);
    t.textContent = '❤️';
    return t;
  }

  // Reset eyes to neutral black ellipses
  function resetEyes() {
    const left = createEllipseEye(80, 90);
    left.setAttribute('id', 'leftEye');
    const right = createEllipseEye(120, 90);
    right.setAttribute('id', 'rightEye');
    replaceEye('left', left);
    replaceEye('right', right);
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
    // Position hearts near original eye locations
    const left = createHeartEye(75, 95);
    left.setAttribute('id', 'leftEye');
    const right = createHeartEye(115, 95);
    right.setAttribute('id', 'rightEye');

    replaceEye('left', left);
    replaceEye('right', right);

    wiggleEars();
    bounceHearts();
  }

  // Constant cursor tracking
  const isDesktop = window.matchMedia('(min-width: 768px)').matches;
  if (isDesktop) {
    document.addEventListener('mousemove', (e) => {
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
        // Eyes track cursor normally outside form
        const left = createEllipseEye(80 + dx, 90 + dy);
        left.setAttribute('id', 'leftEye');
        const right = createEllipseEye(120 + dx, 90 + dy);
        right.setAttribute('id', 'rightEye');
        replaceEye('left', left);
        replaceEye('right', right);
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

  // Login button listeners (single declaration, no duplicates)
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

// mobile-layout.js
// Select elements
const form = document.querySelector('form');
const leftEye = document.getElementById('leftEye');
const rightEye = document.getElementById('rightEye');
const ears = document.querySelectorAll('.ear');

// Function to trigger hearts + wiggle
function activateMobileAnimation() {
  // Eyes turn into hearts
  leftEye.setAttribute('fill', 'red');
  rightEye.setAttribute('fill', 'red');

  // Add wiggle class to ears
  ears.forEach(ear => ear.classList.add('wiggle'));
}

// Function to reset (optional)
function resetMobileAnimation() {
  leftEye.setAttribute('fill', '#000');   // back to normal
  rightEye.setAttribute('fill', '#000');
  ears.forEach(ear => ear.classList.remove('wiggle'));
}

// Mobile-specific trigger
form.addEventListener('focusin', activateMobileAnimation);
form.addEventListener('focusout', resetMobileAnimation);
