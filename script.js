const audio = document.getElementById('audio');
const vinyl = document.getElementById('vinyl');
const songTitle = document.getElementById('songTitle');
const songArtist = document.getElementById('songArtist');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const seekBar = document.getElementById('seekBar');
const curTime = document.getElementById('curTime');
const durTime = document.getElementById('durTime');
const volBar = document.getElementById('volBar');
const playlistEl = document.getElementById('playlist');

let currentIndex = 0;
let isPlaying = false;

function formatTime(sec) {
  if (!isFinite(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function renderPlaylist() {
  playlistEl.innerHTML = "";
  SONGS.forEach((song, i) => {
    const item = document.createElement('div');
    item.className = 'song-item' + (i === currentIndex ? ' active' : '');
    item.innerHTML = `
      <div class="meta">
        <div class="s-title"><span class="s-index">${i + 1}.</span>${song.title}</div>
        <div class="s-artist">${song.artist}</div>
      </div>
    `;
    item.addEventListener('click', () => loadSong(i, true));
    playlistEl.appendChild(item);
  });
}

function loadSong(index, autoplay) {
  if (index < 0 || index >= SONGS.length) return;
  currentIndex = index;
  const song = SONGS[currentIndex];
  audio.src = song.src;
  songTitle.textContent = song.title;
  songArtist.textContent = song.artist;
  renderPlaylist();
  if (autoplay) play();
}

function play() {
  audio.play().catch(() => {});
  isPlaying = true;
  playBtn.textContent = "⏸";
  vinyl.classList.add('spinning');
}

function pause() {
  audio.pause();
  isPlaying = false;
  playBtn.textContent = "▶";
  vinyl.classList.remove('spinning');
}

playBtn.addEventListener('click', () => {
  if (!audio.src) { loadSong(0, true); return; }
  isPlaying ? pause() : play();
});

prevBtn.addEventListener('click', () => {
  loadSong((currentIndex - 1 + SONGS.length) % SONGS.length, true);
});

nextBtn.addEventListener('click', () => {
  loadSong((currentIndex + 1) % SONGS.length, true);
});

audio.addEventListener('ended', () => {
  loadSong((currentIndex + 1) % SONGS.length, true);
});

audio.addEventListener('timeupdate', () => {
  if (audio.duration) {
    seekBar.value = (audio.currentTime / audio.duration) * 100;
    curTime.textContent = formatTime(audio.currentTime);
    durTime.textContent = formatTime(audio.duration);
  }
});

seekBar.addEventListener('input', () => {
  if (audio.duration) {
    audio.currentTime = (seekBar.value / 100) * audio.duration;
  }
});

volBar.addEventListener('input', () => {
  audio.volume = volBar.value;
});

// Initial setup
if (SONGS.length > 0) {
  loadSong(0, false);
}
