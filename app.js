const app = document.getElementById('app');

const pages = [
  renderPage1,
  renderPage2,
  renderPage3,
  renderPage4
];

function setActiveNav(idx) {
  document.querySelectorAll('nav a').forEach((a, i) => {
    a.classList.toggle('active', i === idx);
  });
}

function addRainbowEffects() {
  // Titles
  document.querySelectorAll('h1, h2, h3').forEach(el => {
    el.classList.add('rainbow-text');
  });
  // Buttons
  document.querySelectorAll('button, .button').forEach(el => {
    el.classList.add('rainbow-btn');
  });
}

function navigate(pageIdx) {
  app.innerHTML = '';
  // Remove no-horizontal-padding class by default
  app.classList.remove('no-horizontal-padding');
  app.appendChild(renderNav(pageIdx));
  pages[pageIdx]();
  setActiveNav(pageIdx);
  // Add rainbow effects after rendering
  addRainbowEffects();
}

function renderNav(activeIdx) {
  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Fil d\'Ariane');
  // Breadcrumb: show only previous and current pages
  const labels = ['Début', 'Bouton farceur', 'Dans le texte', 'Anniversaire'];
  for (let i = 0; i <= activeIdx; i++) {
    if (i > 0) {
      const sep = document.createElement('span');
      sep.textContent = ' > ';
      nav.appendChild(sep);
    }
    const a = document.createElement('a');
    a.textContent = labels[i];
    a.href = '#';
    if (i === activeIdx) {
      a.className = 'active';
      a.style.pointerEvents = 'none';
      a.style.cursor = 'default';
    } else {
      a.onclick = e => {
        e.preventDefault();
        navigate(i);
      };
    }
    nav.appendChild(a);
  }
  return nav;
}

// Page 1: Scroll down, but button is hidden at the top
function renderPage1() {
  const container = document.createElement('div');
  container.innerHTML = `
    <h1>Bienvenue !</h1>
    <p>Descends pour trouver le bouton <b>Suivant</b>...</p>
    <div style="height: 400px;"></div>
    <div style="height: 400px;"></div>
    <div style="height: 400px;"></div>
    <button id="fake-next" class="button">Suivant</button>
    <div style="height: 40px;"></div>
    <div id="top-btn-container" style="position: absolute; top: 0; left: 0; width: 100%; display: flex; justify-content: center; pointer-events: none;">
      <button id="real-next" class="button" style="opacity:0; pointer-events: auto;">Suivant</button>
    </div>
  `;
  app.appendChild(container);
  // Fake button
  container.querySelector('#fake-next').onclick = () => {
    alert('Oups ! Le bouton était en haut depuis le début !');
    const realBtn = document.getElementById('real-next');
    realBtn.style.opacity = 1;
    realBtn.focus();
  };
  // Real button
  container.querySelector('#real-next').onclick = () => navigate(1);
}

// Page 2: Moving button
function renderPage2() {
  const container = document.createElement('div');
  container.innerHTML = `
    <h1>Attrape le bouton !</h1>
    <p>Clique sur le bouton pour arriver à la page suivante. Si tu peux...</p>
    <div id="move-btn-container" style="position: relative; height: 180px;">
      <button id="move-btn" class="button" style="position: absolute; left: 50px; top: 60px;">Clique-moi !</button>
    </div>
  `;
  app.appendChild(container);
  let moves = 0;
  const btn = container.querySelector('#move-btn');
  const moveBtnContainer = container.querySelector('#move-btn-container');
  function moveButton() {
    if (moves < 4) {
      const maxLeft = moveBtnContainer.offsetWidth - btn.offsetWidth - 10;
      const maxTop = moveBtnContainer.offsetHeight - btn.offsetHeight - 10;
      const left = Math.random() * maxLeft;
      const top = Math.random() * maxTop;
      btn.style.left = `${left}px`;
      btn.style.top = `${top}px`;
      moves++;
    }
  }
  btn.addEventListener('mouseenter', moveButton);
  btn.addEventListener('click', e => {
    if (moves < 4) {
      moveButton();
      e.preventDefault();
    } else {
      alert('Bravo, tu m\'as eu !');
      navigate(2);
    }
  });
}

// Page 3: Placeholder
function renderPage3() {
  const container = document.createElement('div');
  // Provided French monologue
  const monologue = "Mais, vous savez, moi je ne crois pas qu'il y ait de bonne ou de mauvaise situation. Moi, si je devais résumer ma vie aujourd'hui avec vous, je dirais que c'est d'abord des rencontres, des gens qui m'ont tendu la main, peut-être à un moment où je ne pouvais pas, où j'étais seul chez moi. Et c'est assez curieux de se dire que les hasards, les rencontres forgent une destinée... Parce que quand on a le goût de la chose, quand on a le goût de la chose bien faite, le beau geste, parfois on ne trouve pas l'interlocuteur en face, je dirais, le miroir qui vous aide à avancer. Alors ce n'est pas mon cas, comme je le disais là, puisque moi au contraire, j'ai pu ; et je dis merci à la vie, je lui dis merci, je chante la vie, je danse la vie... Je ne suis qu'amour ! Et finalement, quand beaucoup de gens aujourd'hui me disent : « Mais comment fais-tu pour avoir cette humanité ? » Eh bien je leur réponds très simplement, je leur dis que c'est ce goût de l'amour, ce goût donc qui m'a poussé aujourd'hui à entreprendre une construction mécanique, mais demain, qui sait, peut-être simplement à me mettre au service de la communauté, à faire le don, le don de soi...";
  // Split the text and insert the 'suivant' link in the middle
  const words = monologue.split(' ');
  const mid = Math.floor(words.length / 2);
  words.splice(mid, 0, '<a href="#" id="hidden-next" style="color:inherit;text-decoration:none;">suivant</a>');
  const textWithLink = words.join(' ');
  container.innerHTML = `
    <h1>Pour la dernière page, le lien se trouve dans le texte</h1>
    <div style="margin: 24px 0; line-height: 1.7; font-size: 1.08em;">
      <p>${textWithLink}</p>
    </div>
  `;
  app.appendChild(container);
  const next = container.querySelector('#hidden-next');
  if (next) {
    next.onclick = e => {
      e.preventDefault();
      navigate(3);
    };
  }
}

// Page 4: Giphy embed
function renderPage4() {
  // Add no-horizontal-padding class for the last page
  app.classList.add('no-horizontal-padding');
  const container = document.createElement('div');
  container.innerHTML = `
    <h1 style="text-align:center;">Joyeux Anniversaire Steph ! 🎉</h1>
    <p style="text-align:center;">Voici une surprise spéciale pour toi :</p>
    <div class="giphy-embed-outer">
      <div class="giphy-embed-container" style="width:80vw;max-width:400px;margin:0 auto;">
        <div style="width:100%;height:0;padding-bottom:100%;position:relative;max-width:400px;margin:0 auto;">
          <iframe src="https://giphy.com/embed/wel1vvgXM2a7hRWttF" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>
        </div>
      </div>
    </div>
    <p style="text-align:center;"><a href="https://giphy.com/gifs/happy-celebrate-birthday-wel1vvgXM2a7hRWttF">via GIPHY</a></p>
  `;
  app.appendChild(container);
}

// Initial load
navigate(0); 