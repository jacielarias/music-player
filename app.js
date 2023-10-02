const musicList = [
    {
        songName: 'BackWards - Cannons',
        audioUrl: 'BackWards - Cannons.mp3',
        cover: 'img-1.jpg',
        artist: 'Cannons',
    },
    {
        songName: 'Hurricane - Cannons',
        audioUrl: 'Hurricane - Cannons.mp3',
        cover: 'img-2.jpg',
        artist: 'Cannons',
    },
    {
        songName: 'Miracle - Cannons',
        audioUrl: 'Miracle - Cannons.mp3',
        cover: 'img-3.jpg',
        artist: 'Cannons',
    },
    {
        songName: 'Purple Sun - Cannons',
        audioUrl: 'Purple Sun - Cannons.mp3',
        cover: 'img-4.jpg',
        artist: 'Cannons',
    },
    {
        songName: 'Pretty Boy - Cannons',
        audioUrl: 'Pretty Boy - Cannons.mp3',
        cover: 'img-5.jpg',
        artist: 'Cannons',
    },
    {
        songName: 'Eat Your Young - Hozier',
        audioUrl: 'Eat Your Young - Hozier.mp3',
        cover: 'img-6.jpg',
        artist: 'Hozier',
    },
    {
        songName: 'Take Me To Church - Hozier',
        audioUrl: 'Take Me To Church - Hozier.mp3',
        cover: 'img-7.jpg',
        artist: 'Hozier',
    },
    {
        songName: 'Francesca - Hozier',
        audioUrl: 'Francesca - Hozier.mp3',
        cover: 'img-8.jpg',
        artist: 'Hozier',
    },
]

// Elements
const songs = document.getElementById("songs");

const audio = document.getElementById("audio");
const coverTop = document.querySelector(".cover-top");
const cover = document.querySelectorAll(".cover");
const titleTop = document.querySelector(".title-top");

// Controls
const play = document.getElementById("play");
const prev = document.getElementById("prev");   
const next = document.getElementById("next");
const controls = document.querySelector('.controls')
const soundIcon = document.querySelector('.sound-icon')
const volumeBar = document.querySelector(".volume-bar");
const volumeSlider = document.querySelector(".volume-slider");
const progressBar = document.getElementById("progress");
const progressContainer = document.getElementById("progress-container");

const actualTime = document.querySelector('.actualTime');
const duration = document.querySelector('.duration');

// Global
let currentSong = null;
let dragging = false;
const volumenPredeterminado = 0.5; 
volumeSlider.style.width = `${volumenPredeterminado * 100}%`;

// Load music list
async function initializeMusicList() {
    for (let i = 0; i < musicList.length; i++) {
        const song = musicList[i];
        const audio = new Audio(`./audio/${song.audioUrl}`);
        const duration = await setDurationSong(audio);

        // Display songs
        const li = `<li class="link">
                <img src="img/${song.cover}" alt="" class="cover-top cover" id="cover-top-${i}">
                <a href="#">${song.songName}</a>
                <p class="artist">${song.artist}</p>
                <p class="duration">${duration}</p> 
            </li>`;

        songs.insertAdjacentHTML('beforeend', li);
        const liElements = document.querySelectorAll('.link');
        const currentLi = liElements[liElements.length - 1];

        currentLi.addEventListener('click', () => {
            loadSong(i);
            playSong(); // Play the song when it's clicked
        });
    }
    // Load the first song
    loadSong(0);
}

// Load song
async function loadSong(songIndex){
    if(songIndex !== currentSong){
        activeClass(songIndex)
        currentSong = songIndex;
        audio.src = "./audio/" +  musicList[songIndex].audioUrl;

        playSong();
        loadImageSong(songIndex);
        loadSongName(songIndex);

        // Utiliza await dentro de una función async
        const calculatedDuration = await setDurationSong(audio);
        duration.innerHTML = calculatedDuration;
    }
};

// Load image
function loadImageSong(songIndex){
    coverTop.src = "img/" + musicList[songIndex].cover;
};

// Load name song
function loadSongName(songIndex){
    titleTop.textContent = musicList[songIndex].songName;
};

//  Song with active class
function activeClass(songIndex){
    const links = document.querySelectorAll('a');
    const li = document.querySelectorAll('li');

    li.forEach((li) => li.classList.remove('active'));

    links.forEach((link) =>{
        link.classList.remove('active');
    });
    links[songIndex].classList.add('active');
    li[songIndex].classList.add('active');
};

/* ---- Controls ---- */

// Update Controls
function updateControls(){
    if(audio.paused){
        play.classList.remove('fa-pause');
        play.classList.add('fa-play');
    }else{
        play.classList.remove('fa-play');
        play.classList.add('fa-pause');
    }
};

// Next song
function nextSong(){
    if(currentSong < musicList.length - 1){
        loadSong(currentSong + 1);
    }else{
        loadSong(0)
    }
    setTimer();
}

// Prev song
function prevSong(){
    if(currentSong > 0 ){
        loadSong(currentSong - 1)
    }else{
        loadSong(musicList.length - 1)
    }
    setTimer();
}

// Play song
function playSong(){
    if(currentSong !== null){
        audio.play();
        updateControls();
        setTimer();
    }
};

// Pause song
function pauseSong(){
    audio.pause()
    updateControls();
}

// Volume
function volume(e) {
    if (dragging) {
        const bar = volumeBar.getBoundingClientRect();
        const updateVolume = (e.clientX - bar.left) / bar.width;
        const volumeMinMax = Math.max(0, Math.min(1, updateVolume));
        audio.volume = volumeMinMax;
        volumeSlider.style.width = `${volumeMinMax * 100}%`;
        updateVolumeIcon();
    }
}

//Mute audio
function UpdateMute() {
    if (audio.muted) {
        audio.muted = false;
        audio.volume = 0.5; 
        volumeSlider.style.width = "50%"; 
    } else {
        audio.muted = true;
        audio.volume = 0; 
        volumeSlider.style.width = "0"; 
    }
    updateVolumeIcon();
}

// Set progress bar
function setProgressBar(e){
    const barWidth = this.offsetWidth;
    const progressWidth = e.offsetX; 
    const current = (progressWidth / barWidth) * audio.duration;
    audio.currentTime = current;
}

// Update ProgressBar
function updateProgressBar(e){
    const {duration, currentTime} = e.srcElement;
    const progress = (currentTime / duration) * 100;
    progressBar.style.width = progress + "%";
}
// Update volume
function updateVolumeIcon() {
    if (audio.muted || audio.volume === 0) {
        soundIcon.classList.remove('fa-volume-up');
        soundIcon.classList.add('fa-volume-mute');
    } else {
        soundIcon.classList.remove('fa-volume-mute');
        soundIcon.classList.add('fa-volume-up');
    }
};

//Song duration
function setDurationSong(audio) {
    return new Promise((resolve) => {
        audio.addEventListener('loadedmetadata', () => {
            const minutes = Math.floor(audio.duration / 60);
            const seconds = Math.floor(audio.duration % 60);
            const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            resolve(formattedDuration);
        });
    });
};

//Set timer
function setTimer(){
    setInterval(()=> {
    let timing = audio.currentTime;
    let minutes = Math.floor(timing / 60);
    let seconds = Math.floor(timing % 60);

    let secondsWithLeadingZero = seconds < 10 ? '0' + seconds : seconds;
    actualTime.innerHTML = `${minutes}:${secondsWithLeadingZero}`;
    }, 500)
}

// Event Listeners
play.addEventListener('click', ()=> {
    if(audio.paused){
        playSong();
    }else{
        pauseSong();
    }
});
// Volume bar
volumeBar.addEventListener('click', (e) => {
    dragging = true;
    volume(e)
    dragging = false;
});
// Volumen slide
volumeSlider.addEventListener("mousedown", (e) => {
    dragging = true; 
    volume(e); 
    e.preventDefault()
});
audio.addEventListener("mouseup", () => {
    dragging = false; 
});
audio.addEventListener("mousemove", (e) => {
    if (dragging) {
        volume(e); 
        e.preventDefault()
    }
});
// Next song
next.addEventListener('click', ()=> nextSong());
// Prev song
prev.addEventListener('click', ()=> prevSong());
// Progress bar
audio.addEventListener('timeupdate',  updateProgressBar);
// Progress bar (*clickeable*)
progressContainer.addEventListener('click', setProgressBar);
// Play once current song finished
audio.addEventListener('ended', ()=> nextSong());
// Update sound icon
soundIcon.addEventListener('click', UpdateMute);


initializeMusicList();
updateVolumeIcon();