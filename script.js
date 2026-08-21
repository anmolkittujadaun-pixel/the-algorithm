const audio = new Audio();
audio.volume = 0.7;

let songs = [
    { title: "Gawah Hai Chand Tare", artist: "Moon Radio", audio: "1.mp3" },
    { title: "Jeena Sirf Merre Liye", artist: "Moon Radio", audio: "2.mp3" },
    { title: "Jo Bhi Kasmein", artist: "Moon Radio", audio: "3.mp3" }
];
let currentSong = 0;

const playButton = document.getElementById("play");
const previousButton = document.getElementById("previous");
const nextButton = document.getElementById("next");

const songTitle = document.querySelector(".song");
const artistName = document.querySelector(".artist");

const progress = document.querySelector(".progress");
const progressBar = document.querySelector(".progress-bar");

const timeBoxes = document.querySelectorAll(".time span");
const currentTimeBox = timeBoxes[0];
const durationBox = timeBoxes[1];

const volume = document.querySelector(".volume input");
const playlistBox = document.getElementById("playlist");

/* SELECT SONGS BUTTON */
const filePicker = document.createElement("input");
filePicker.type = "file";
filePicker.multiple = true;
filePicker.accept = "audio/*";
filePicker.style.display = "none";

const selectButton = document.createElement("button");
selectButton.textContent = "＋ Select Songs";
selectButton.style.margin = "15px 0";
selectButton.style.padding = "8px 14px";
selectButton.style.cursor = "pointer";

document.body.insertBefore(selectButton, document.body.firstChild);
document.body.appendChild(filePicker);

selectButton.onclick = () => filePicker.click();

filePicker.onchange = () => {
  songs = Array.from(filePicker.files).map(file => ({
    title: file.name.replace(/\.[^/.]+$/, ""),
    artist: "Moon Radio",
    audio: URL.createObjectURL(file)
  }));

  currentSong = 0;
  createPlaylist();

createplaylist();
  if (songs.length > 0) {
    loadSong(0);
  }
};

function formatTime(seconds) {
  if (!isFinite(seconds)) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return minutes + ":" + secs.toString().padStart(2, "0");
}

function loadSong(index) {
  if (!songs.length) return;

  const song = songs[index];

  songTitle.textContent = song.title;
  artistName.textContent = song.artist;

  audio.src = song.audio;
  audio.load();

  currentTimeBox.textContent = "0:00";
  durationBox.textContent = "0:00";
  progressBar.style.width = "0%";
}

function playSong() {
  if (!songs.length) return;

  audio.play().then(() => {
    playButton.textContent = "⏸";
  }).catch(() => {});
}

function pauseSong() {
  audio.pause();
  playButton.textContent = "▶";
}

playButton.onclick = () => {
  if (!songs.length) return;

  if (audio.paused) {
    playSong();
  } else {
    pauseSong();
  }
};

nextButton.onclick = () => {
  if (!songs.length) return;

  currentSong++;

  if (currentSong >= songs.length) {
    currentSong = 0;
  }

  loadSong(currentSong);
  playSong();
};

previousButton.onclick = () => {
  if (!songs.length) return;

  currentSong--;

  if (currentSong < 0) {
    currentSong = songs.length - 1;
  }

  loadSong(currentSong);
  playSong();
};

audio.ontimeupdate = () => {
  if (!audio.duration) return;

  const percent = (audio.currentTime / audio.duration) * 100;

  progressBar.style.width = percent + "%";
  currentTimeBox.textContent = formatTime(audio.currentTime);
};

audio.onloadedmetadata = () => {
  durationBox.textContent = formatTime(audio.duration);
};

audio.onended = () => {
  nextButton.click();
};

progress.onclick = (event) => {
  if (!audio.duration) return;

  const rect = progress.getBoundingClientRect();
  const position = event.clientX - rect.left;

  audio.currentTime = (position / rect.width) * audio.duration;
};

if (volume) {
  volume.oninput = () => {
    audio.volume = volume.value / 100;
  };
}

function createPlaylist() {
  if (!playlistBox) return;

  playlistBox.innerHTML = "";

  songs.forEach((song, index) => {
    const item = document.createElement("button");

    item.className = "playlist-item";

    item.innerHTML = `
      <span>${String(index + 1).padStart(2, "0")}</span>
      <strong>${song.title}</strong>
    `;

    item.onclick = () => {
      currentSong = index;
      loadSong(currentSong);
      playSong();
    };

    playlistBox.appendChild(item);
  });
}