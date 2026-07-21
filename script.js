/* ---------- Player / auth ---------- */
function getPlayer() {
  return localStorage.getItem('mm_player');
}
function setPlayer(name) {
  localStorage.setItem('mm_player', name);
}
function logout() {
  localStorage.removeItem('mm_player');
  location.href = 'login.html';
}
function requirePlayer() {
  const p = getPlayer();
  if (!p) { location.href = 'login.html'; }
  return p;
}
function renderNavPlayer() {
  const el = document.getElementById('navPlayer');
  if (!el) return;
  const p = getPlayer();
  el.innerHTML = p ? `PLAYER <span>${p}</span> · <a href="#" onclick="logout()" style="color:var(--muted)">logout</a>` : `<a href="login.html">login</a>`;
}

/* ---------- Score storage ---------- */
function getScores() {
  return JSON.parse(localStorage.getItem('mm_scores') || '{"you":0,"ai":0,"draw":0}');
}
function saveScores(s) {
  localStorage.setItem('mm_scores', JSON.stringify(s));
}
function getHistory() {
  return JSON.parse(localStorage.getItem('mm_history') || '[]');
}
function pushHistory(entry) {
  const h = getHistory();
  h.unshift(entry);
  localStorage.setItem('mm_history', JSON.stringify(h.slice(0, 20)));
}
function resetAll() {
  localStorage.removeItem('mm_scores');
  localStorage.removeItem('mm_history');
}

/* ---------- Minimax engine ---------- */
const LINES = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

function getWinner(b) {
  for (const line of LINES) {
    const [a, c, d] = line;
    if (b[a] && b[a] === b[c] && b[a] === b[d]) return { player: b[a], line };
  }
  return null;
}

function minimax(b, isAI) {
  const w = getWinner(b);
  if (w) return w.player === 'X' ? 1 : -1;
  if (b.every(c => c)) return 0;

  let best = isAI ? -Infinity : Infinity;
  for (let i = 0; i < 9; i++) {
    if (!b[i]) {
      b[i] = isAI ? 'X' : 'O';
      const score = minimax(b, !isAI);
      b[i] = null;
      best = isAI ? Math.max(best, score) : Math.min(best, score);
    }
  }
  return best;
}

function bestMove(b) {
  let move = -1, bestScore = -Infinity;
  for (let i = 0; i < 9; i++) {
    if (!b[i]) {
      b[i] = 'X';
      const score = minimax(b, false);
      b[i] = null;
      if (score > bestScore) { bestScore = score; move = i; }
    }
  }
  return move;
}
