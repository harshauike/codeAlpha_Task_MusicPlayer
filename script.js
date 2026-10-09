
const audio = document.getElementById("audio");
const title = document.getElementById("title");
const artist = document.getElementById("artist");

const playBtn = document.getElementById("play");
const progress = document.getElementById("progress");
const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");

const volume = document.getElementById("volume");
const volumeValue = document.getElementById("volumeValue");

const playlist = document.getElementById("playlist");
const autoplay = document.getElementById("autoplay");


const songs = [
    {
        title: "Red Yellow",
        artist: "Unknown Band",
        src: "songs/English_Song_-_Red_Yellow.mp3"
    },
    {
        title: "Mad English",
        artist: "Robert Art",
        src: "songs/Mad_English_Song.mp3"
    },
    {
        title: "Miles More",
        artist: "Rony Spain",
        src: "songs/Miles_More_-_English.mp3"
    }
];

let songIndex = 0;

// Format seconds as minutes:seconds
function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "0:00";

    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);

    return min + ":" + String(sec).padStart(2, "0");
}

// Load a song
function loadSong(index) {
    songIndex = (index + songs.length) % songs.length;

    const song = songs[songIndex];

    audio.src = song.src;
    title.textContent = song.title;
    artist.textContent = song.artist;

    progress.value = 0;
    currentTime.textContent = "0:00";
    duration.textContent = "0:00";

    renderPlaylist();
}

// Play song
async function playSong() {
    try {
        await audio.play();
    } catch (error) {
        console.error("Could not play song:", audio.src, error);
        alert(
            "Song could not play. Check the MP3 filename and songs folder."
        );
    }
}

// Play / Pause button
playBtn.addEventListener("click", () => {
    if (audio.paused) {
        playSong();
    } else {
        audio.pause();
    }
});

// Update play button
audio.addEventListener("play", () => {
    playBtn.textContent = "⏸";
});

audio.addEventListener("pause", () => {
    playBtn.textContent = "▶";
});

// Next song
document.getElementById("next").addEventListener("click", () => {
    loadSong(songIndex + 1);
    playSong();
});

// Previous song
document.getElementById("prev").addEventListener("click", () => {
    loadSong(songIndex - 1);
    playSong();
});

// Update progress bar and current time
audio.addEventListener("timeupdate", () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
        progress.value = (audio.currentTime / audio.duration) * 100;
        currentTime.textContent = formatTime(audio.currentTime);
    }
});

// Show song duration
audio.addEventListener("loadedmetadata", () => {
    duration.textContent = formatTime(audio.duration);
});

// Seek through song
progress.addEventListener("input", () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
        audio.currentTime = (progress.value / 100) * audio.duration;
    }
});

// Volume control
audio.volume = Number(volume.value);

volume.addEventListener("input", () => {
    audio.volume = Number(volume.value);
    volumeValue.textContent =
        Math.round(audio.volume * 100) + "%";
});

// Automatically play the next song
audio.addEventListener("ended", () => {
    if (autoplay.checked) {
        loadSong(songIndex + 1);
        playSong();
    } else {
        playBtn.textContent = "▶";
    }
});

// Display playlist
function renderPlaylist() {
    playlist.innerHTML = "";

    songs.forEach((song, index) => {
        const item = document.createElement("li");
        const songName = document.createElement("span");
        const number = document.createElement("span");

        songName.textContent = song.title + " - " + song.artist;
        number.textContent = index + 1;

        item.append(songName, number);

        if (index === songIndex) {
            item.classList.add("active");
        }

        item.addEventListener("click", () => {
            loadSong(index);
            playSong();
        });

        playlist.appendChild(item);
    });
}

// Report audio loading errors
audio.addEventListener("error", () => {
    console.error("Could not load audio:", audio.src);
});

// Initialize player
loadSong(0);

volumeValue.textContent = Math.round(audio.volume * 100) + "%";