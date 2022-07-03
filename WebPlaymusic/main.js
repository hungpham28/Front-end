const $=document.querySelector.bind(document)
const $$=document.querySelectorAll.bind(document)

const songsAPI="http://localhost:3000/songs"

const heading=$('header h2')
const cdThumb=$('.cd-thumb')
const auditionCurrent=$('#audio')
const toCd=$('.cd')
const btnPlay=$('.btn-toggle-play')
const playControl=$('.player')
const progress=$('#progress')
const btnNext=$('.btn-next')
const btnPrev=$('.btn-prev')
const btnRandom=$('.btn-random')
const btnRepeat=$('.btn-repeat')

//main
function start(){
    fetch(songsAPI)
        .then(songsApi => songsApi.json())
        .then(working)
}
function working(playList){
    const app={
        currentIndex:0,

        songs:playList,

        defineProperties:function(){
            Object.defineProperty(this, "currentSong", {
                get:function(){
                    return this.songs[this.currentIndex]
                }
            })
        },

        renderSongs: function renderSongs(){
            const playList=document.querySelector('.playlist')
            const listSongs=this.songs.map(function(song){//${index === this.currentIndex ? "active" : ""}" data-index="${index}
                return `<div class="song">
                <div class="thumb"
                    style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>`
            })
            playList.innerHTML=listSongs.join('')
        },

        handleEvents:function (){
            //building started
            let playing=false
            let onRandom=false
            let onRepeat=false
            const tagSongs=$$('.song')
            const optionSong=$$('.option')
            console.log(optionSong)
            const cdAnimate=cdThumb.animate([
                {transform:'rotate(360deg)'}
            ],{
                duration:10000,
                iterations: Infinity
            })
            cdAnimate.pause()
            cssSong()
            //change size of CD when scrolling
            const widthCd=toCd.offsetWidth
            document.onscroll=function(){
                let postionScroll=document.documentElement.scrollTop
                let newWidthCd=widthCd-postionScroll
                toCd.style.width=newWidthCd>0 ? newWidthCd+'px':0 
            }
            //pressing play or pause
            function pressPlaying(){
                if (playing){//when pressing button pause
                    auditionCurrent.pause()
                    playControl.classList.remove('playing')
                    cdAnimate.pause()
                    playing=!playing
                }
                else{//when pressing button play
                        auditionCurrent.play()
                        cdAnimate.play()
                        playControl.classList.add('playing')
                        auditionCurrent.ontimeupdate=function(){//change on the bar of progress
                            if(auditionCurrent.duration)
                                progress.value=auditionCurrent.currentTime/auditionCurrent.duration * 100   
                        }
                        auditionCurrent.onended= function(){
                            console.log(onRepeat)
                            if(onRepeat) auditionCurrent.play()
                            else nextSong()
                        }//when ending song ,events stoped 
                    playing=!playing
                }
            }
            progress.onchange=function(at){//time rewind on bar
                const seekTime=at.target.value/100 * auditionCurrent.duration
                auditionCurrent.currentTime=seekTime
                if(!playing) pressPlaying()
            }
            function cssSong(){
                tagSongs.forEach(function(tagSong){
                    if(tagSong.classList.value.includes('active',4)) 
                        tagSong.classList.remove('active')
                })
                tagSongs[app.currentIndex].classList.add('active')
            }
            //next Song
            function nextSong(){
                if(onRandom){
                    do{
                        var newIndex=Math.floor(Math.random()*app.songs.length)
                    }while(newIndex==app.currentIndex)
                    app.currentIndex=newIndex
                }
                else app.currentIndex++
                if(app.currentIndex>=app.songs.length){
                    app.currentIndex=0
                }
                app.loadingCurrentSong()
                playing=false
                pressPlaying()
                cssSong()
            }
            //previous song
            function previousSong(){
                if(onRandom){
                    do{
                        var newIndex=Math.floor(Math.random()*app.songs.length)
                    }while(newIndex==app.currentIndex)
                    app.currentIndex=newIndex
                }
                else app.currentIndex--
                if(app.currentIndex<0){
                    app.currentIndex=app.songs.length-1
                }
                app.loadingCurrentSong()
                playing=false
                pressPlaying()
                cssSong()
            }
            //change song by click
            tagSongs.forEach(function(tagSong,index){
                tagSong.onclick=function(){
                    app.currentIndex=index
                    app.loadingCurrentSong()
                    playing=false
                    pressPlaying()
                    cssSong()
                }
            })
            //when pressing on button play, events activing
            btnPlay.onclick=pressPlaying
            //when pressing button next
            btnNext.onclick=nextSong
            //when pressing button prev
            btnPrev.onclick=previousSong
            //when pressing button random song
            btnRandom.onclick=function(){
                onRandom=!onRandom
                btnRandom.classList.toggle('active')
            }
            //when pressing button repeat song
            btnRepeat.onclick=function(){
                onRepeat=!onRepeat
                btnRepeat.classList.toggle('active')
            }
        },
    loadingCurrentSong:function(){
        heading.textContent=this.currentSong.name
        cdThumb.style.backgroundImage=`url('${this.currentSong.image}')`
        auditionCurrent.src=this.currentSong.path
    },

    startApp : function(){
        //render data songs from API 
        this.renderSongs()

        //define property is current song which is playing on website
        this.defineProperties()
        
        //Loading current song to play
        this.loadingCurrentSong()
        
        //events in website
        this.handleEvents()
    }
    }
    app.startApp()
}
//end: main


start()