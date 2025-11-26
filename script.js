console.log("JS LOADED");
let leftEye = document.getElementById('leftEye');
let rightEye = document.getElementById('rightEye');
const leftEarOuter = document.getElementById('leftEarOuter');
const rightEarOuter = document.getElementById('rightEarOuter');
const loginForm = document.querySelector('form');
const face = document.querySelector('svg');

// Reset eyes to neutral black ellipses
function resetEyes() {
  leftEye.outerHTML = '<ellipse id="leftEye" class="eye" cx="80" cy="90" rx="10" ry="14" fill="black"/>';
  rightEye.outerHTML = '<ellipse id="rightEye" class="eye" cx="120" cy="90" rx="10" ry="14" fill="black"/>';
  leftEye = document.getElementById('leftEye');
  rightEye = document.getElementById('rightEye');
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
  leftEye.outerHTML = '<text id="leftEye" class="eye" x="75" y="95" font-size="20">❤️</text>';
  rightEye.outerHTML = '<text id="rightEye" class="eye" x="115" y="95" font-size="20">❤️</text>';
  leftEye = document.getElementById('leftEye');
  rightEye = document.getElementById('rightEye');
  wiggleEars();
  bounceHearts();
}

// Desktop-only mouse tracking
const isDesktop = window.matchMedia("(min-width: 768px)").matches;
if (isDesktop) {
  document.addEventListener('mousemove', (e) => {
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
      leftEye.outerHTML = `<ellipse id="leftEye" class="eye" cx="${80 + dx}" cy="${90 + dy}" rx="10" ry="14" fill="black"/>`;
      rightEye.outerHTML = `<ellipse id="rightEye" class="eye" cx="${120 + dx}" cy="${90 + dy}" rx="10" ry="14" fill="black"/>`;
      leftEye = document.getElementById('leftEye');
      rightEye = document.getElementById('rightEye');
    }
  });
}

// Focus listeners for each input section
['username', 'email', 'password'].forEach(id => {
  const input = document.getElementById(id);
  input.addEventListener('focus', activateHearts);
  input.addEventListener('blur', resetEyes);
});

// Also track the login button
const loginButton = document.getElementById('loginButton');
loginButton.addEventListener('focus', activateHearts);
loginButton.addEventListener('blur', resetEyes);

// Also track the login button
const loginButton = document.getElementById('loginButton');
loginButton.addEventListener('focus', () => lookAt(loginButton));
loginButton.addEventListener('blur', resetEyes);
