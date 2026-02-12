(() => {
  // ── Elements ──────────────────────────────────────────────
  const textInput      = document.getElementById('text-input');
  const wpmSlider      = document.getElementById('wpm-slider');
  const wpmDisplay     = document.getElementById('wpm-display');
  const startBtn       = document.getElementById('start-btn');

  const inputSection   = document.getElementById('input-section');
  const readerSection  = document.getElementById('reader-section');
  const currentWord    = document.getElementById('current-word');
  const wpmSliderR     = document.getElementById('wpm-slider-reader');
  const wpmDisplayR    = document.getElementById('wpm-display-reader');
  const pauseBtn       = document.getElementById('pause-btn');
  const stopBtn        = document.getElementById('stop-btn');
  const progressBar    = document.getElementById('progress-bar');
  const wordIndex      = document.getElementById('word-index');
  const wordTotal      = document.getElementById('word-total');

  // ── State ─────────────────────────────────────────────────
  let words    = [];
  let index    = 0;
  let wpm      = 300;
  let timer    = null;
  let paused   = false;

  // ── Helpers ───────────────────────────────────────────────
  function msPerWord(w) {
    return Math.round(60_000 / w);
  }

  function showWord() {
    if (index >= words.length) {
      finish();
      return;
    }
    currentWord.textContent = words[index];
    wordIndex.textContent   = index + 1;
    const pct = ((index + 1) / words.length) * 100;
    progressBar.style.width = pct + '%';
    index++;
  }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(showWord, msPerWord(wpm));
  }

  function finish() {
    clearInterval(timer);
    timer  = null;
    paused = false;
    currentWord.textContent = '✓';
    pauseBtn.textContent    = 'Pause';
    progressBar.style.width = '100%';
    // Return to input after a short delay
    setTimeout(returnToInput, 1200);
  }

  function returnToInput() {
    clearInterval(timer);
    timer  = null;
    paused = false;
    readerSection.classList.add('hidden');
    inputSection.classList.remove('hidden');
    progressBar.style.width = '0%';
    pauseBtn.textContent = 'Pause';
  }

  function syncSliders(value) {
    wpm = parseInt(value, 10);
    wpmDisplay.textContent  = wpm;
    wpmDisplayR.textContent = wpm;
    wpmSlider.value  = wpm;
    wpmSliderR.value = wpm;
    if (timer) startTimer(); // restart interval at new speed
  }

  // ── Event: input-screen slider ────────────────────────────
  wpmSlider.addEventListener('input', () => syncSliders(wpmSlider.value));

  // ── Event: reader-screen slider ──────────────────────────
  wpmSliderR.addEventListener('input', () => syncSliders(wpmSliderR.value));

  // ── Event: Start ─────────────────────────────────────────
  startBtn.addEventListener('click', () => {
    const raw = textInput.value.trim();
    if (!raw) return;

    words  = raw.split(/\s+/).filter(Boolean);
    index  = 0;
    paused = false;

    wordTotal.textContent = words.length;
    wordIndex.textContent = 0;
    progressBar.style.width = '0%';
    pauseBtn.textContent = 'Pause';

    inputSection.classList.add('hidden');
    readerSection.classList.remove('hidden');

    showWord();
    startTimer();
  });

  // ── Event: Pause / Resume ────────────────────────────────
  pauseBtn.addEventListener('click', () => {
    if (!paused) {
      clearInterval(timer);
      timer  = null;
      paused = true;
      pauseBtn.textContent = 'Resume';
    } else {
      paused = false;
      pauseBtn.textContent = 'Pause';
      showWord();
      startTimer();
    }
  });

  // ── Event: Stop ──────────────────────────────────────────
  stopBtn.addEventListener('click', returnToInput);
})();
