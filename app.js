const musicList = [
    {
        songName: 'BackWards - Cannons',
        audioUrl: 'BackWards - Cannons.mp3',
        cover: 'img-1.jpg'
    },
    {
        songName: 'Hurricane - Cannons',
        audioUrl: 'Hurricane - Cannons.mp3',
        cover: 'img-2.jpg'
    },
    {
        songName: 'Miracle - Cannons',
        audioUrl: 'Miracle - Cannons.mp3',
        cover: 'img-3.jpg'
    },
    {
        songName: 'Purple Sun - Cannons',
        audioUrl: 'Purple Sun - Cannons.mp3',
        cover: 'img-4.jpg'
    },
    {
        songName: 'Pretty Boy - Cannons',
        audioUrl: 'Pretty Boy - Cannons.mp3',
        cover: 'img-5.jpg'
    },
    {
        songName: 'Eat Your Young - Hozier',
        audioUrl: 'Eat Your Young - Hozier.mp3',
        cover: 'img-6.jpg'
    },
    {
        songName: 'Take Me To Church - Hozier',
        audioUrl: 'Take Me To Church - Hozier.mp3',
        cover: 'img-7.jpg'
    },
    {
        songName: 'Francesca - Hozier',
        audioUrl: 'Francesca - Hozier.mp3',
        cover: 'img-8.jpg'
    },
]


//Elementos
const songs = document.getElementById("songs");
const audio = document.getElementById("audio");
const cover = document.getElementById("cover");
const title = document.getElementById("title");
const play = document.getElementById("play");
const prev = document.getElementById("prev");
const next = document.getElementById("next");
const controls = document.querySelector('.controls')
const progressBar = document.getElementById("progress");
const progressContainer = document.getElementById("progress-container");
const volumeBar = document.getElementById("volume-bar");
const volumeSlider = document.getElementById("volume-slider");

//Current song
let currentSong = null;
//Volume
let dragging = false;
const volumenPredeterminado = 0.5; 
volumeSlider.style.width = `${volumenPredeterminado * 100}%`;

/*-------Event Listeners-------*/
play.addEventListener('click', ()=> {
    if(audio.paused){
        playSong();
    }else{
        pauseSong();
    }
});
//Next song
next.addEventListener('click', ()=> nextSong());
//Prev song
prev.addEventListener('click', ()=> prevSong());
//Progress bar
audio.addEventListener('timeupdate',  updateProgress);
//Progress bar (*clickeable*)
progressContainer.addEventListener('click', setProgressBar);
//Play once current song finished
audio.addEventListener('ended', ()=> nextSong())
//Volume bar
volumeBar.addEventListener('click', (e) => {
    dragging = true;
    volume(e)
    dragging = false;
})
//Volumen slide
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

/*-------*Interface*--------*/

//Access the array of objects to get the songs and display them in the interface
function loadMusic(){
    musicList.forEach((song, i) => {
        const li = `<li><a class="link" href="#">${song.songName}</a></li>`;
        songs.insertAdjacentHTML('beforeend', li);

        const liElements = document.querySelectorAll('.link');
        const currentLi = liElements[liElements.length - 1];

        currentLi.addEventListener('click', () => loadSong(i));
    })
};

//load song
function loadSong(songIndex){
    if(songIndex !== currentSong){
        activeClass(songIndex)
        currentSong = songIndex;
        audio.src = "./audio/" +  musicList[songIndex].audioUrl;

        playSong();
        loadImageSong(songIndex);
        loadSongName(songIndex);
    }
};

//Song with active class
function activeClass(songIndex){
    const links = document.querySelectorAll('a');
    links.forEach((link) =>{
        link.classList.remove('active');
    });
    links[songIndex].classList.add('active');
};



/*-----Controls-----*/

//Barra de progreso
function updateProgress(e){
    const {duration, currentTime} = e.srcElement;
    const progress = (currentTime / duration) * 100;
    progressBar.style.width = progress + "%";
}

//Barra de progresso clickeable
function setProgressBar(e){
   const barWidth = this.offsetWidth;
   const progressWidth = e.offsetX;

   const current = (progressWidth / barWidth) * audio.duration;
   audio.currentTime = current;
}


//Actualizar Controles
function updateControls(){
    if(audio.paused){
        play.classList.remove('fa-pause');
        play.classList.add('fa-play');
    }else{
        play.classList.remove('fa-play');
        play.classList.add('fa-pause');
    }
};

function volume(e) {
    if(dragging){
        const bar = volumeBar.getBoundingClientRect();
        const updateVolume = (e.clientX - bar.left) / bar.width;
        const volumeMinMax = Math.max(0, Math.min(1, updateVolume));
        audio.volume = volumeMinMax;

        volumeSlider.style.width = `${volumeMinMax * 100}%`
    }
}

//Play song
function playSong(){
    if(currentSong !== null){
        audio.play();
        updateControls();
    }
}

//Pause song
function pauseSong(){
    updateControls();
    audio.pause()
    updateControls();
}

//Load image
function loadImageSong(songIndex){
    cover.src = "./img/" + musicList[songIndex].cover;
};

//Load name song
function loadSongName(songIndex){
    title.textContent = musicList[songIndex].songName;
};

//Next song
function nextSong(){
    if(currentSong < musicList.length - 1){
        loadSong(currentSong + 1);
    }else{
        loadSong(0)
    }
}

//prev song
function prevSong(){
    if(currentSong > 0 ){
        loadSong(currentSong - 1)
    }else{
        loadSong(musicList.length - 1)
    }
}


loadMusic();
loadSong(0);
