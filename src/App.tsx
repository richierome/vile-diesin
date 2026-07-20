import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, ValidationError } from "@formspree/react";

const tracks = [
  { n: "01", title: "Miles Bennett Dyson", src: "/audio/mbd2026.wav", status: "TRANSMITTING" },
  { n: "02", title: "Escape From L.A", src: "/audio/escape2026.wav", status: "STABLE" },
  { n: "03", title: "SkyNet Falls (Victory March -- War Ends)", src: "/audio/march.wav", status: "UNRELEASED" },
];

const dates = [
  { day: "--", mon: "--", year: "2026", city: "RIVERSIDE, CA", venue: "MISSION INN SECTOR" },
  { day: "--", mon: "---", year: "----", city: "UNKNOWN", venue: "LOCATION CLASSIFIED" },
  { day: "--", mon: "---", year: "----", city: "UNKNOWN", venue: "AWAITING TRANSMISSION" },
];

function pad(n: number) { return String(n).padStart(2, "0"); }
function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "00:00";
  return `${pad(Math.floor(seconds / 60))}:${pad(Math.floor(seconds % 60))}`;
}

export default function Home() {
  const [now, setNow] = useState(new Date());
  const [activeTrack, setActiveTrack] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [briefingOpen, setBriefingOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [formState, handleFormSubmit] = useForm("xbjrkgbw");

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const clock = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  const date = useMemo(() => now.toISOString().slice(0, 10).replaceAll("-", "."), [now]);

  async function togglePlayback() {
    const audio = audioRef.current;
    if (!audio) return;
    setAudioError(false);
    if (!audio.paused) {
      audio.pause();
      return;
    }
    try {
      await audio.play();
    } catch {
      setAudioError(true);
      setPlaying(false);
    }
  }

  function selectTrack(index: number) {
    if (index === activeTrack) {
      void togglePlayback();
      return;
    }
    audioRef.current?.pause();
    setPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setAudioError(false);
    setActiveTrack(index);
  }

  function seek(value: number) {
    if (!audioRef.current) return;
    audioRef.current.currentTime = value;
    setCurrentTime(value);
  }

  return (
    <main>
      <div className="scanlines" aria-hidden="true" />
      <header className="topbar">
        <div className="system-line"><i /> TEMPORAL LINK: STABLE</div>
        <nav aria-label="Primary navigation">
          <a href="#transmissions">TRANSMISSIONS</a>
          <a href="#appearances">APPEARANCES</a>
          <a href="#archive">ARCHIVE</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="coordinate top-left">LAT 33.9832° N<br/>LON 117.3728° W</div>
        <div className="coordinate top-right">REALITY INDEX<br/><b>VD-09.77</b></div>
        <div className="hero-copy">
          <p className="eyebrow">//IDENTIFICATION CONFIRMED</p>
          <h1>VILE<br/><em>DIESIN</em></h1>
          <div className="hero-meta"><span>INDUSTRIAL / DARKWAVE</span><span>ORIGIN: UNKNOWN</span><span>STATUS: ACTIVE</span></div>
        </div>
        <div className="orbital" aria-hidden="true">
          <div className="ring r1"/><div className="ring r2"/><div className="ring r3"/>
          <div className="cross x"/><div className="cross y"/>
          <div className="orb-label o1">ORIGIN</div><div className="orb-label o2">NOW</div><div className="orb-label o3">DEST.</div>
        </div>
        <div className="chronometer">
          <div className="chrono-head"><span>CURRENT PLACEMENT</span><b>LIVE</b></div>
          <div className="time">{clock}<small>PST</small></div>
          <div className="date">{date} // RIVERSIDE SECTOR</div>
        </div>
        <div className="scroll-hint">SCROLL TO DECRYPT <span>↓</span></div>
      </section>

      <section className="timeline" aria-label="Temporal coordinates">
        <div className="timeline-line"><i className="past-dot"/><i className="current-dot"/><i className="future-dot"/></div>
        <article><label>PAST PLACEMENT</label><strong>1984.05.12</strong><p>FIRST SIGNAL DETECTED<br/>COORDINATES CORRUPTED</p></article>
        <article className="current"><label>CURRENT PLACEMENT</label><strong>{date}</strong><p>ACTIVE TRANSMISSION<br/>EARTH // SECTOR 09</p></article>
        <article><label>ORIGIN TIME</label><strong>20--.--.--</strong><p>CLASSIFIED<br/>ACCESS LEVEL: OBSIDIAN</p></article>
        <article><label>FUTURE PLACEMENT</label><strong>2095.11.02</strong><p>EVENT: CONVERGENCE<br/>PROBABILITY: 87.4%</p></article>
      </section>

      <section className="transmissions" id="transmissions">
        <div className="section-intro"><span>01 / AUDIO ARCHIVE</span><h2>LATEST<br/>TRANSMISSIONS</h2><p>RECOVERED AUDIO FROM FRACTURED TIMELINES.</p></div>
        <div className="player-panel">
          <audio
            ref={audioRef}
            src={tracks[activeTrack].src}
            preload="metadata"
            onLoadedMetadata={(event)=>setDuration(event.currentTarget.duration)}
            onDurationChange={(event)=>setDuration(Number.isFinite(event.currentTarget.duration) ? event.currentTarget.duration : 0)}
            onTimeUpdate={(event)=>setCurrentTime(event.currentTarget.currentTime)}
            onPlay={()=>setPlaying(true)}
            onPause={()=>setPlaying(false)}
            onEnded={()=>setPlaying(false)}
            onError={()=>{setAudioError(true);setPlaying(false)}}
          />
          <div className="waveform" aria-hidden="true">{Array.from({length: 62}).map((_,i)=><i key={i} style={{height: `${14 + ((i * 17) % 55)}%`}} />)}</div>
          <div className="seek-row">
            <input aria-label={`Seek through ${tracks[activeTrack].title}`} type="range" min="0" max={duration || 0} step="0.1" value={Math.min(currentTime, duration || 0)} onChange={(event)=>seek(Number(event.target.value))}/>
          </div>
          <div className="play-row">
            <button className={`play ${playing ? "active" : ""}`} aria-label={playing ? "Pause" : `Play ${tracks[activeTrack].title}`} onClick={()=>void togglePlayback()}>{playing ? "Ⅱ" : "▶"}</button>
            <div><small>NOW TRANSMITTING</small><h3>{tracks[activeTrack].title}</h3></div>
            <div className="counter">{formatTime(currentTime)} / {formatTime(duration)}</div>
          </div>
          {audioError && <p className="audio-error" role="status">AUDIO SIGNAL NOT FOUND // ADD {tracks[activeTrack].src.replace("/audio/", "").toUpperCase()} TO PUBLIC/AUDIO</p>}
          <div className="track-list">
            {tracks.map((track,i)=><button key={track.title} className={activeTrack===i ? "selected" : ""} onClick={()=>selectTrack(i)} aria-label={`${activeTrack===i && playing ? "Pause" : "Select"} ${track.title}`}><span>{track.n}</span><b>{track.title}</b><em>{track.status}</em><time>{activeTrack===i && duration ? formatTime(duration) : "--:--"}</time></button>)}
          </div>
        </div>
      </section>

      <section className="appearances" id="appearances">
        <div className="section-head"><div><span>02 / TEMPORAL EVENTS</span><h2>APPEARANCES</h2></div><p>WITNESS THE SIGNAL<br/>IN YOUR SECTOR</p></div>
        <div className="date-list">
          {dates.map((show,i)=><article key={`${show.city}-${i}`}><div className="num">0{i+1}</div><div className="show-date"><b>{show.day}</b><span>{show.mon}<br/>{show.year}</span></div><div className="location"><h3>{show.city}</h3><p>{show.venue}</p></div><div className="risk">ANOMALY RISK<br/><b>{["LOW","UNKNOWN","UNKNOWN"][i]}</b></div><button aria-label={`Acquire access for ${show.city}`}>ACQUIRE ACCESS ↗</button></article>)}
        </div>
      </section>

      <section className="archive" id="archive">
        <div><span>03 / CLASSIFIED ARCHIVE</span><h2>NO<br/><em>FATE.</em></h2></div>
        <p>NO FATE BUT WHAT WE MAKE IT.<br/><br/>VILE DIESIN IS A TRANSMISSION FROM BETWEEN ERAS—A SOUND RECOVERED FROM MACHINES THAT HAVEN&apos;T BEEN BUILT YET.</p>
        <button onClick={()=>setBriefingOpen(true)}>REQUEST ARCHIVE ACCESS <b>→</b></button>
      </section>

      <footer><p>© 2026 // ALL TIMELINES RESERVED</p><div><a href="#">INSTAGRAM</a><a href="#">SPOTIFY</a></div></footer>

      {briefingOpen && (
  <div
    className="modal-wrap"
    role="dialog"
    aria-modal="true"
    aria-labelledby="briefing-title"
    onMouseDown={(event) => {
      if (event.currentTarget === event.target) {
        setBriefingOpen(false);
      }
    }}
  >
    <div className="modal">
      <button
        className="close"
        type="button"
        aria-label="Close archive access form"
        onClick={() => setBriefingOpen(false)}
      >
        ×
      </button>

      <span>// SECURE CHANNEL 09</span>

      <h2 id="briefing-title">
        ENTER THE
        <br />
        TIMELINE
      </h2>

      {formState.succeeded ? (
        <p className="success" role="status">
          IDENTITY LOGGED.
          <br />
          THE NEXT SIGNAL WILL FIND YOU.
        </p>
      ) : (
        <form onSubmit={handleFormSubmit}>
          <input
            type="hidden"
            name="_subject"
            value="New Vile Diesin Archive Request"
          />

          <input
            type="hidden"
            name="source"
            value="Vile Diesin Temporal Transmission"
          />

          <label htmlFor="email">
            COMMUNICATION ADDRESS
          </label>

          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="traveler@sector.net"
            aria-describedby="email-error"
          />

          <ValidationError
            id="email-error"
            className="form-error"
            prefix="Email"
            field="email"
            errors={formState.errors}
          />

          <ValidationError
            className="form-error"
            errors={formState.errors}
          />

          <button
            type="submit"
            disabled={formState.submitting}
          >
            {formState.submitting
              ? "TRANSMITTING..."
              : "AUTHORIZE TRANSMISSION →"}
          </button>
        </form>
      )}
    </div>
  </div>
)}
    </main>
  );
}
