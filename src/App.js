import React, { useState, useEffect } from 'react';
import axios from "axios";
import './App.css';
import Loading from './component/Loading/Loading';

export default function MusicPlayer() {
  const host = "https://thekoushikdurgasserver.herokuapp.com";
  const [render, setrender] = useState(true);
  const [musicIndex, setmusicIndex] = useState(1);
  const [progressbarwidth, setprogressbarwidth] = useState(0);
  const [musictitle, setmusictitle] = useState('');
  const [musicimg, setmusicimg] = useState('');
  const [music, setmusic] = useState('');
  const [textsize, settextsize] = useState(window.innerWidth/18);
  const [musicDuartion, setmusicDuartion] = useState(`0:00`);
  const [musicCurrentTime, setmusicCurrentTime] = useState(`0:00`);
  const [isMusicPlayPaused, setisMusicPlayPaused] = useState(false);
  const mainAudio = document.getElementById("main-audio");
  const [sliderspan, setsliderspan] = useState('');
  const [repeatBtnicon, setrepeatBtnicon] = useState('fal fa-repeat');
  const [repeatBtntitle, setrepeatBtntitle] = useState('Playlist looped');
  const [allMusic, setallMusic] = useState([]);
  const getallMusic = async () => { axios.get(`${host}/api/music`, { method: 'GET', headers: { 'Content-Type': 'application/json', "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjI5ZmE4M2I2Zjc1OGY0OGIxY2E4YzdmIn0sImlhdCI6MTY1NDY5MDYwMX0._sln2d2AROxcp0qMosUrIIkNkW5PNZsm2YUBFNL3mvg" } }).then((response) => { setallMusic(response.data) }); }
  const truncate = (str, n, useWordBoundary) => {
    if (str.length <= n) { return str; }
    const subString = str.substr(0, n - 1); // the original check
    return (useWordBoundary
      ? subString.substr(0, subString.lastIndexOf(" "))
      : subString) + "...";
  }
  const mainAudioended = () => {
    switch (repeatBtntitle) {
      case "Playlist looped":
        clicked((musicIndex + 1) > allMusic.length ? 1 : (musicIndex + 1));
        break;
      case "Song looped":
        mainAudio.currentTime = 0;
        loadMusic(allMusic[musicIndex - 1]);
        setTimeout(() => {
          playpauseMusic(true);
        }, 1000);
        break;
      case "Playback shuffled":
        var randIndex = Math.floor((Math.random() * allMusic.length) + 1);
        while (musicIndex === randIndex) {
          randIndex = Math.floor((Math.random() * allMusic.length) + 1);
        }
        setmusicIndex(randIndex);
        loadMusic(allMusic[randIndex - 1]);
        setTimeout(() => {
          playpauseMusic(true);
        }, 1000);
        break;
      default:
        break;
    }
  }
  const repeatBtnclick = () => {
    switch (repeatBtntitle) {
      case "Playlist looped":
        setrepeatBtnicon('fal fa-repeat-1');
        setrepeatBtntitle('Song looped');
        break;
      case "Song looped":
        setrepeatBtnicon('flaticon-381-shuffle-1');
        setrepeatBtntitle('Playback shuffled');
        break;
      case "Playback shuffled":
        setrepeatBtnicon('fal fa-repeat');
        setrepeatBtntitle('Playlist looped');
        break;
      default:
        break;
    }
  }
  const progressAreaclick = (e) => {
    mainAudio.currentTime = (e / 100) * mainAudio.duration;
  }
  const mainAudiotimeupdate = (e) => {
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    var progressWidth = (currentTime / duration) * 100;
    setprogressbarwidth(progressWidth);
    mainAudio.addEventListener("loadeddata", () => {
      var mainAdDuration = mainAudio.duration;
      var totalMin = Math.floor(mainAdDuration / 60);
      var totalSec = Math.floor(mainAdDuration % 60);
      if (totalSec < 10) {
        totalSec = `0${totalSec}`;
      }
      setmusicDuartion(`${totalMin}:${totalSec}`);
    });
    var currentMin = Math.floor(currentTime / 60);
    var currentSec = Math.floor(currentTime % 60);
    if (currentSec < 10) {
      currentSec = `0${currentSec}`;
    }
    setmusicCurrentTime(`${currentMin}:${currentSec}`);

  };
  const playpauseMusic = (a) => {
    setisMusicPlayPaused(a);
    if (a) { mainAudio.play(); }
    else { mainAudio.pause(); }
  }
  const loadeddatali = (a) => {
    var duration = document.getElementById('music-' + a + '-' + a).duration;
    var totalMin = Math.floor(duration / 60);
    var totalSec = Math.floor(duration % 60);
    if (totalSec < 10) {
      totalSec = `0${totalSec}`;
    };
    document.getElementById('music-' + a).innerText = `${totalMin}:${totalSec}`;
    document.getElementById('music-' + a).setAttribute("t-duration", `${totalMin}:${totalSec}`);
  }
  const clicked = (a) => {
    setmusicIndex(a);
    loadMusic(allMusic[a - 1]);
    setTimeout(() => {
      playpauseMusic(true);
    }, 1000);
  }
  const loadMusic = (a) => {
    setmusictitle(a.title);
    setmusicimg(a.image);
    setmusic(a.audio_file);
  }
  window.onresize = ()=>{
    settextsize(window.innerWidth/18);
  }
  useEffect(() => {
    if (render) {
      if (allMusic.length !== 0) {
        loadMusic(allMusic[musicIndex - 1]);
        setrender(false);
      }
      else { getallMusic(); }
    }
  }, [render, allMusic, musicIndex]);
  return (
    <div className='musicplayer'>
      <div className={`wrapper ${isMusicPlayPaused ? 'paused' : ''}`}>
        <div className="img-area">
          <img src={musicimg} alt={musictitle} />
        </div>
        <div className='musicside'>
          <div className="song-details">
            <p className="name">{musictitle}</p>
          </div>
          <div className="range-row" onMouseEnter={() => { setsliderspan('show') }} onMouseLeave={() => { setsliderspan('') }}>
            <div className="range">
              <div className="sliderValue">
                <span className={`sliderspan ${sliderspan}`} style={{ left: progressbarwidth + "%" }}>{musicCurrentTime}</span>
              </div>
              <div className="field">
                <input className="slider" type="range" min='0' max='100' onChange={(e) => progressAreaclick(e.target.value)} value={progressbarwidth.toString()} style={{ background: `linear-gradient(90deg, hsl(${progressbarwidth}deg 50% 50%) ${progressbarwidth}%, #d3d3d3 ${progressbarwidth + 0.1}%)` }} />
              </div>
              <div className="song-timer">
                <span className="current-time">{musicCurrentTime}</span>
                <span className="max-duration">{musicDuartion}</span>
              </div>
            </div>
            <audio id="main-audio" src={music} onTimeUpdate={(event) => { mainAudiotimeupdate(event) }} onEnded={() => { mainAudioended() }}></audio>
          </div>
          <div className="controls">
            <i id="repeat-plist" className={repeatBtnicon} title={repeatBtntitle} onClick={repeatBtnclick}></i>
            <i id="prev" className="tkd3-previous" onClick={() => { clicked((musicIndex - 1) < 1 ? allMusic.length : (musicIndex - 1)); }}></i>
            <i className={`${isMusicPlayPaused ? 'tkd2-pause2' : 'tkd2-play2'}`} onClick={() => { playpauseMusic(!isMusicPlayPaused); }}></i>
            <i id="next" className="tkd3-next" onClick={() => { clicked((musicIndex + 1) > allMusic.length ? 1 : (musicIndex + 1)); }}></i>
            <i className="fal fa-list-music"></i>
          </div>
        </div>
      </div>
      <div className={`music-list`}>
        <ul>
          {allMusic.length !== 0 ? (
            allMusic.map((i, j) =>
              <li key={j} onClick={() => { clicked(j + 1); }} className={`${musicIndex - 1 === j ? 'playing' : ''}`}>
                <div className='d-flex align-items-center'>
                  <span>{j + 1} .</span>
                  <img src={i.image} alt={i.title} />
                  <span>{truncate(i.title, textsize, false)}</span>
                </div>
                <div>
                  <span id={`music-${j + 1}`} className="audio-duration"></span>
                </div>
                <audio id={`music-${j + 1}-${j + 1}`} src={i.audio_file} onLoadedData={() => { loadeddatali(j + 1) }}></audio>
              </li>
            )
          ) : (
            <Loading />
          )}
        </ul>
      </div>
    </div>
  );
}
