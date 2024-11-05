let wrapper = document.querySelector(".wrapper");
let image = document.querySelector(".image img");
let song = document.querySelector(".displayname #name");
let artist = document.querySelector(".displayname #artist");
let audio = document.querySelector("#audio")
let play = document.querySelector(".play")
let next = document.querySelector(".next");
let previous = document.querySelector(".previous");
let progressBar = document.querySelector(".progressbar");
let progressArea = document.querySelector(".progress");
let musicList = document.querySelector(".list");
let showMoreBtn = document.querySelector("#more-music");
let hideMusicBtn = document.querySelector("#close");

showMoreBtn.addEventListener("click",()=>{
    musicList.classList.toggle("show");
})

hideMusicBtn.addEventListener("click",()=>{
    showMoreBtn.click()
})

let musicindex = Math.floor((Math.random() * all.length)+1);

window.addEventListener("load",()=>{
    loadmusic(musicindex);
    playingNow()
})

function loadmusic(num){
    song.innerHTML = all[num-1].name;
    image.src = all[num-1].img;
    artist.innerHTML = all[num-1].artist;
    audio.src = all[num-1].src;

}

function playMusic(){
    wrapper.classList.add("paused")
    audio.play();
    play.innerHTML = "pause"
}
function pauseMusic(){
    wrapper.classList.remove("paused");
    audio.pause();
    
    play.innerHTML = "play_arrow"
}

play.addEventListener("click" , () =>{
    const isMusicPaused = wrapper.classList.contains("paused");
    isMusicPaused ? pauseMusic() : playMusic();
    playingNow();
    
});

function nextMusic(){
    musicindex++;
    if (musicindex > all.length) {
        musicindex = 1; 
    }
    loadmusic(musicindex);
    playMusic();
    playingNow();

}

next.addEventListener("click", () => {
    nextMusic();
    
});

previous.addEventListener("click", () => {
    musicindex--;
    if (musicindex < 1) {
        musicindex = all.length; 
    }
    loadmusic(musicindex);
    playMusic();
    playingNow();
});


audio.addEventListener("timeupdate", (e) => {
    const currentTime = e.target.currentTime; // get current time
    const duration = e.target.duration; // get duration
    let progressWidth = (currentTime / duration) * 100; // calculate progress bar width
    progressBar.style.width = `${progressWidth}%`;

    let musicCurrentTime = document.querySelector(".current");
    let musicDuration = document.querySelector(".duration");

    // When the audio data is loaded, set the duration
    audio.addEventListener("loadeddata", () => {
        let audioDuration = audio.duration;
        let totalMin = Math.floor(audioDuration / 60); // calculate total minutes
        let totalSec = Math.floor(audioDuration % 60); // calculate total seconds
        if (totalSec < 10) {
            totalSec = `0${totalSec}`; // add leading zero to seconds
        }
        musicDuration.innerHTML = `${totalMin}:${totalSec}`; // update the duration display
    });

    // Calculate the current time (minutes and seconds)
    let currentMin = Math.floor(currentTime / 60); // calculate current minutes
    let currentSec = Math.floor(currentTime % 60); // calculate current seconds
    if (currentSec < 10) {
        currentSec = `0${currentSec}`; // add leading zero to seconds
    }
    musicCurrentTime.innerHTML = `${currentMin}:${currentSec}`; // update the current time display
});
progressArea.addEventListener("click" , (e)=>{
    let progressWidthVal = progressArea.clientWidth;
    let clickedOffSetX = e.offsetX;
    let songDuration = audio.duration;

    audio.currentTime = (clickedOffSetX / progressWidthVal) *songDuration
    playMusic();
});

const repeatBtn = document.querySelector("#repeat-plist");

repeatBtn.addEventListener("click" , ()=>{

    let getText = repeatBtn.innerHTML;

    switch(getText){
        case "repeat":
            repeatBtn.innerHTML = "repeat_one";
            repeatBtn.setAttribute("title","Song looped");
            break;
        case "repeat_one":
            repeatBtn.innerHTML = "shuffle";
            repeatBtn.setAttribute("title","Playback shuffle");
            break;
        case "shuffle":
            repeatBtn.innerHTML  = "repeat";
            repeatBtn.setAttribute("title","Playlist looped");
            break;
    }
});

//let's work on the changed icon

audio.addEventListener("ended",()=>{
    let getText = repeatBtn.innerHTML;

    switch(getText){
        case "repeat":
            nextMusic();
            break;
        case "repeat_one":
            audio.currentTime = 0;
            loadmusic(musicindex);
            playMusic();
            break;
        case "shuffle":
            let randIndex = Math.floor((Math.random() * all.length)+1);
            do{
                randIndex = Math.floor((Math.random() * all.length)+1);
            } while(musicindex == randIndex);
            musicindex = randIndex;
            playingNow();
            loadmusic(musicindex);
            playMusic()
            break;    
    }
})

const ulTag = document.querySelector("ul");

for (let i = 0; i < all.length; i++) {
    let liTag = `<li li-index="${i+1}">
                    <div class="box">
                        <p id="name-stamp">${all[i].name}</p>
                        <p class="time-stamp" id="time-${i}">3:26</p>
                        <audio src="${all[i].src}" class="audio-${i}"></audio>
                    </div>
                </li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag); 

    // Select audio and time elements based on unique identifiers
    let liAudioTag = ulTag.querySelector(`.audio-${i}`);
    let liAudioDuration = ulTag.querySelector(`#time-${i}`);

    // Use 'loadeddata' event to fetch the audio duration
    liAudioTag.addEventListener("loadeddata", () => {
        let audioDuration = liAudioTag.duration;
        let totalMin = Math.floor(audioDuration / 60); // calculate total minutes
        let totalSec = Math.floor(audioDuration % 60); // calculate total seconds
        if (totalSec < 10) {
            totalSec = `0${totalSec}`; // add leading zero to seconds
        }
        liAudioDuration.innerHTML = `${totalMin}:${totalSec}
        `; // update the duration display
        liAudioDuration.setAttribute('t-duration', `${totalMin}:${totalSec}`)
    });
}

// song play on click from tags

const allLiTags = ulTag.querySelectorAll("li")

function playingNow(){
    for (let j = 0; j < allLiTags.length; j++) {

        let audioTag = allLiTags[j].querySelector(".time-stamp");

        if(allLiTags[j].classList.contains("playing") ){
            allLiTags[j].classList.remove("playing");
            let adDuration = audioTag.getAttribute("t-duration")
            audioTag.innerHTML = adDuration;
        }

        if (allLiTags[j].getAttribute("li-index") == musicindex) {
            allLiTags[j].classList.add("playing");
            audioTag.innerHTML = "Playing"
        }
        
        allLiTags[j].setAttribute("onclick", "clicked(this)"); // Closing parenthesis added
    }
}

function clicked(element){
    let getLiIndex = element.getAttribute("li-index");
    musicindex = parseInt(getLiIndex);
    loadmusic(musicindex);
    playMusic();
    playingNow()

}
