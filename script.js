document.addEventListener('DOMContentLoaded', () => {
  const buttons = Array.from(document.querySelectorAll('.play-btn'));
  console.log('Found play buttons:', buttons.length);
  let currentAudio = null;
  let currentBtn = null;

  function setPlaying(btn) {
    btn.classList.add('playing');
    const icon = btn.querySelector('i');
    if (icon) icon.className = 'fa-solid fa-pause';
  }

  function resetBtn(btn) {
    if (!btn) return;
    btn.classList.remove('playing');
    const icon = btn.querySelector('i');
    if (icon) icon.className = 'fa-solid fa-play';
  }

  buttons.forEach((btn, idx) => {
    const src = btn.dataset.src;
    console.log(`Button[${idx}] data-src:`, src);

    if (!src) {
      console.warn(`play-btn[${idx}] missing data-src`);
      return;
    }

    const audio = new Audio(src);
    audio.preload = 'metadata';

    audio.addEventListener('loadedmetadata', () => {
      console.log(`Audio[${idx}] loaded metadata — duration:`, audio.duration);
    });

    audio.addEventListener('canplay', () => {
      console.log(`Audio[${idx}] canplay`);
    });

    audio.addEventListener('error', (e) => {
      console.error(`Audio[${idx}] error loading src="${src}"`, e);
    });

    audio.addEventListener('ended', () => {
      console.log(`Audio[${idx}] ended`);
      resetBtn(btn);
      if (currentAudio === audio) {
        currentAudio = null;
        currentBtn = null;
      }
    });

    btn.addEventListener('click', (ev) => {
      ev.preventDefault();
      console.log(`Clicked button[${idx}] src=${src}`);

      // stop currently playing other audio
      if (currentAudio && currentAudio !== audio) {
        try {
          currentAudio.pause();
          currentAudio.currentTime = 0;
        } catch (err) { /* ignore */ }
        resetBtn(currentBtn);
        currentAudio = null;
        currentBtn = null;
      }

      // toggle this audio
      if (audio.paused) {
        audio.play()
          .then(() => {
            console.log(`Audio[${idx}] play() succeeded`);
            setPlaying(btn);
            currentAudio = audio;
            currentBtn = btn;
          })
          .catch(err => {
            console.warn(`Audio[${idx}] play() rejected:`, err);
          });
      } else {
        audio.pause();
        console.log(`Audio[${idx}] paused by user`);
        resetBtn(btn);
        if (currentAudio === audio) {
          currentAudio = null;
          currentBtn = null;
        }
      }
    });
  });
});
