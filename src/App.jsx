import React, { useState, useEffect, useRef, useCallback } from 'react';
import Confetti from 'react-confetti';
import FloatingParticles from './FloatingParticles';

/* ─────────────────────────────────────────────
   YOUTUBE PLAYER HOOK
   Pakai YouTube IFrame API (hidden iframe) agar
   lagu "Semua Aku Dirayakan" – Nadin Amizah bisa
   dikontrol play/pause langsung dari tombol.
───────────────────────────────────────────── */
const YT_VIDEO_ID = 'CptnLrdF3_E'; // Nadin Amizah - Semua Aku Dirayakan (Official MV)

function useYouTubePlayer() {
  const playerRef = useRef(null);       // YT.Player instance
  const iframeContainerRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Load YouTube IFrame API script sekali saja
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    }

    const initPlayer = () => {
      if (playerRef.current) return; // sudah dibuat
      playerRef.current = new window.YT.Player(iframeContainerRef.current, {
        videoId: YT_VIDEO_ID,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
        },
        events: {
          onReady: () => setReady(true),
        },
      });
    };

    // Jika API sudah tersedia langsung init, jika belum tunggu callback global
    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prev) prev();
        initPlayer();
      };
    }

    return () => {
      // Jangan destroy saat unmount karena akan bikin error saat hot-reload
    };
  }, []);

  const play  = useCallback(() => { if (ready && playerRef.current) { playerRef.current.setVolume(60); playerRef.current.playVideo(); } }, [ready]);
  const pause = useCallback(() => { if (ready && playerRef.current) playerRef.current.pauseVideo(); }, [ready]);

  return { iframeContainerRef, play, pause, ready };
}

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const QUOTES = [
  { text: "Kucing membawa kebahagiaan kecil di setiap langkah kakinya.", icon: "🐾" },
  { text: "Semekar bunga di pagi hari, semoga harimu seindah itu, Latifah!", icon: "🌸" },
  { text: "Hidup itu singkat, nikmati seperti kucing yang sedang tidur siang dengan damai.", icon: "🐱" },
  { text: "Setiap kelopak bunga adalah senyuman kecil untukmu di usia 22 tahun.", icon: "🌷" },
];

const MESSAGES = [
  { icon: "✨", text: "Happy 22nd Birthday, Latifah! Semoga di usia yang baru ini, segala hal baik, kebahagiaan, dan kelancaran selalu menyertai hari-harimu." },
  { icon: "🐱", text: "Semoga hidupmu selalu ceria dan menggemaskan selayaknya kucing kesayangan, serta senantiasa mekar indah penuh warna seperti bunga-bunga tercantik." },
  { icon: "🌸", text: "Tetap jadi pribadi yang luar biasa, bawa terus energi positifmu, dan semoga semua impian besarmu di tahun ini terwujud satu persatu ya!" },
];

/* ─────────────────────────────────────────────
   SMALL REUSABLE COMPONENTS
───────────────────────────────────────────── */

/** Lingkaran cahaya di sudut sebagai aksen dekorasi */
function GlowOrb({ className }) {
  return (
    <div
      className={`pointer-events-none absolute rounded-full blur-3xl opacity-30 ${className}`}
    />
  );
}

/** Baris isi pesan dengan icon */
function MessageRow({ icon, text, delay = 0 }) {
  return (
    <div
      className="flex items-start gap-3 animate-fade-in-up opacity-0"
      style={{ animationDelay: `${delay}s`, animationFillMode: 'forwards' }}
    >
      <span className="text-xl mt-0.5 shrink-0">{icon}</span>
      <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{text}</p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   STAGE 1 — ENVELOPE
───────────────────────────────────────────── */
function EnvelopeStage({ onOpen }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-10 z-10 relative">
      <div className="glass-card animate-fade-in-scale rounded-[2rem] shadow-2xl animate-glow-pulse p-8 sm:p-12 max-w-md w-full flex flex-col items-center gap-6 text-center">

        {/* Badge */}
        <span className="bg-gradient-to-r from-pink-100 to-purple-100 text-pink-600 text-[11px] font-extrabold uppercase tracking-widest px-5 py-1.5 rounded-full border border-pink-200 shadow-sm animate-ribbon">
          🎀 Special for Latifah Sriwijaya
        </span>

        {/* Hero icon */}
        <div className="relative">
          <div className="text-8xl sm:text-9xl animate-bounce-soft drop-shadow-xl">🎁</div>
          <span className="absolute -top-1 -right-2 text-3xl animate-star" style={{ animationDelay: '0.3s' }}>✨</span>
          <span className="absolute -bottom-2 -left-3 text-2xl animate-star" style={{ animationDelay: '1s' }}>🌸</span>
        </div>

        {/* Title */}
        <div>
          <h1
            className="text-3xl sm:text-4xl font-black tracking-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            <span className="text-shimmer">Ada Surat</span>
            <br />
            <span className="text-gray-800">Spesial Untukmu!</span>
          </h1>
          <p className="text-gray-500 text-sm mt-3 leading-relaxed">
            Ketuk amplop di bawah untuk membuka lembaran kejutan<br className="hidden sm:block" />
            ulang tahunmu yang ke-22 ✨
          </p>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 w-full">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-pink-200 to-transparent" />
          <span className="text-pink-400 text-lg">🌸</span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-pink-200 to-transparent" />
        </div>

        {/* CTA Button */}
        <button
          onClick={onOpen}
          className="group w-full py-4 px-6 rounded-2xl font-extrabold text-white text-base sm:text-lg
                     bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 animate-bg-shift
                     shadow-xl shadow-pink-400/40
                     hover:shadow-pink-500/60 hover:-translate-y-0.5
                     active:scale-95 transition-all duration-300 cursor-pointer
                     flex items-center justify-center gap-2"
        >
          <span>Buka Amplop Surat</span>
          <span className="group-hover:translate-x-1 transition-transform duration-300">✉️</span>
        </button>

        {/* Floating emoji row */}
        <div className="flex gap-5 text-2xl">
          {['🐱', '🌷', '🎂', '🌸', '🐾'].map((e, i) => (
            <span
              key={i}
              className="animate-float"
              style={{ animationDelay: `${i * 0.3}s` }}
            >
              {e}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   STAGE 2 — MAIN / TEASER
───────────────────────────────────────────── */
function MainStage({ onOpenSurprise, quote }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-10 z-10 relative">
      <div className="glass-card animate-fade-in-up rounded-[2rem] shadow-2xl p-7 sm:p-10 max-w-lg w-full flex flex-col items-center gap-5 text-center">

        {/* Animated badge */}
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-[11px] font-extrabold uppercase tracking-widest px-5 py-2 rounded-full shadow-lg shadow-pink-400/40 animate-pulse">
          <span className="animate-star inline-block">✨</span>
          Special Delivery for Latifah Sriwijaya
          <span className="animate-star inline-block" style={{ animationDelay: '0.5s' }}>✨</span>
        </div>

        {/* Title */}
        <h2
          className="text-3xl sm:text-4xl font-black text-gray-800 leading-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Kejutan Spesial<br />
          <span className="text-shimmer">Menantimu! 🎉</span>
        </h2>

        {/* Quote card */}
        <div className="w-full bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-100 rounded-2xl p-4 shadow-inner">
          <span className="text-3xl block mb-2">{quote.icon}</span>
          <p className="text-pink-700 text-sm sm:text-base italic font-medium leading-relaxed">
            "{quote.text}"
          </p>
        </div>

        {/* Hint text */}
        <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
          Psst... Ada pesan rahasia di dalam buat kamu yang berulang<br className="hidden sm:block" />
          tahun ke-22 tanggal 17 September nanti! 🐾
        </p>

        {/* Bouncing icons */}
        <div className="flex gap-4 text-3xl py-1">
          {['🌸', '🌷', '✨', '🎀', '💫'].map((e, i) => (
            <span key={i} className="animate-bounce-soft" style={{ animationDelay: `${i * 0.2}s` }}>
              {e}
            </span>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={onOpenSurprise}
          className="group w-full py-4 px-6 rounded-2xl font-extrabold text-white text-sm sm:text-base
                     bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 animate-bg-shift
                     shadow-xl shadow-pink-400/40
                     hover:shadow-pink-500/60 hover:-translate-y-0.5
                     active:scale-95 transition-all duration-300 cursor-pointer
                     flex items-center justify-center gap-2"
        >
          <span>Buka Kejutan Sekarang</span>
          <span className="group-hover:scale-125 transition-transform duration-300">🎁</span>
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SIDE WIDGET — kucing & bunga (desktop)
───────────────────────────────────────────── */
function SideWidget({ side, onCatClick, onFlowerClick, catAction, flowerBloom }) {
  const isLeft = side === 'left';
  const items = isLeft
    ? [
        { emoji: '🐱', label: 'Klik biar lari! 🐾', onClick: onCatClick, active: catAction, rotate: 'rotate-12' },
        { emoji: '🌸', label: 'Klik biar mekar! 🌷', onClick: onFlowerClick, active: flowerBloom, rotate: '-rotate-12' },
      ]
    : [
        { emoji: '🌷', label: 'Klik biar mekar! 🌸', onClick: onFlowerClick, active: flowerBloom, rotate: 'rotate-12' },
        { emoji: '🐈', label: 'Klik biar lari! 🐾', onClick: onCatClick, active: catAction, rotate: '-rotate-12' },
      ];

  return (
    <div
      className={`fixed top-1/2 -translate-y-1/2 ${isLeft ? 'left-4' : 'right-4'}
                  hidden lg:flex flex-col gap-5 z-20
                  animate-slide-in-${isLeft ? 'left' : 'right'}`}
    >
      {items.map(({ emoji, label, onClick, active, rotate }, i) => (
        <div key={i} className="relative group">
          <button
            onClick={onClick}
            className={`glass-card border-2 border-pink-200 p-4 rounded-3xl shadow-xl cursor-pointer
                        transition-all duration-300
                        ${active
                          ? `scale-125 ${rotate} shadow-pink-400/60 shadow-2xl bg-pink-100/80`
                          : 'hover:scale-110 hover:shadow-pink-300/50 hover:shadow-xl'
                        }`}
          >
            <span className="text-5xl block select-none">{emoji}</span>
          </button>
          <span className={`absolute ${isLeft ? 'left-full ml-3' : 'right-full mr-3'}
                            top-1/2 -translate-y-1/2
                            text-xs bg-white/95 text-pink-600 font-bold
                            px-3 py-1.5 rounded-full shadow-lg border border-pink-100
                            whitespace-nowrap pointer-events-none
                            opacity-0 group-hover:opacity-100
                            transition-opacity duration-200`}>
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   STAGE 3 — SURPRISE / UCAPAN
───────────────────────────────────────────── */
function SurpriseStage({ message, whatsappUrl, onReset, onCatClick, onFlowerClick }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 z-10 relative gap-5">

      {/* Floating message bar */}
      <div className="glass-card animate-fade-in-up rounded-full px-5 py-2.5 shadow-lg border border-pink-100
                      flex items-center gap-2 text-pink-600 text-xs sm:text-sm font-bold max-w-sm text-center">
        <span className="animate-bounce-soft text-base">💬</span>
        <span>{message}</span>
      </div>

      {/* Main card */}
      <div
        className="glass-card animate-fade-in-up delay-100 rounded-[2rem] shadow-2xl
                   border-t-8 border-pink-400 max-w-lg w-full relative overflow-hidden"
        style={{ animationFillMode: 'forwards' }}
      >
        {/* Decorative orbs inside card */}
        <GlowOrb className="w-40 h-40 bg-pink-300 -top-10 -left-10" />
        <GlowOrb className="w-32 h-32 bg-purple-300 -bottom-8 -right-8" />

        {/* Avatar badge */}
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-white border-4 border-pink-200 rounded-full p-3 shadow-2xl animate-pop-in">
            <span className="text-4xl">🐱🌷</span>
          </div>
        </div>

        <div className="pt-10 pb-7 px-6 sm:px-9 flex flex-col items-center gap-5 relative z-10">

          {/* Date & name */}
          <div className="text-center animate-fade-in-up delay-200 opacity-0" style={{ animationFillMode: 'forwards' }}>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-pink-500
                             bg-pink-50 px-4 py-1.5 rounded-full border border-pink-100 shadow-sm">
              17 September · 22nd Birthday 🎂
            </span>
            <h1
              className="text-4xl sm:text-5xl font-black mt-3 mb-1 text-shimmer"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Latifah Sriwijaya
            </h1>
            <p className="text-gray-500 text-sm font-semibold">Selamat Ulang Tahun yang ke-22! 🎉</p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 w-full">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-pink-200 to-transparent" />
            <span className="text-pink-300 text-lg animate-star">🌸</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-pink-200 to-transparent" />
          </div>

          {/* Messages */}
          <div className="w-full bg-gradient-to-b from-pink-50/80 to-purple-50/50 rounded-2xl
                          border border-pink-100 p-5 shadow-inner space-y-4">
            {MESSAGES.map((m, i) => (
              <MessageRow key={i} icon={m.icon} text={m.text} delay={0.3 + i * 0.15} />
            ))}
          </div>

          {/* Interactive row (mobile) */}
          <div className="flex justify-center gap-4 lg:hidden">
            {[
              { emoji: '🐱', label: 'Kucing!', onClick: onCatClick },
              { emoji: '🌸', label: 'Bunga!', onClick: onFlowerClick },
              { emoji: '🐈', label: 'Kucing!', onClick: onCatClick },
              { emoji: '🌷', label: 'Bunga!', onClick: onFlowerClick },
            ].map(({ emoji, label, onClick }, i) => (
              <button
                key={i}
                onClick={onClick}
                className="glass-card border border-pink-100 p-3 rounded-2xl shadow-md
                           text-3xl active:scale-90 hover:scale-110 transition-all duration-200 cursor-pointer"
                aria-label={label}
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Emoji row */}
          <div className="flex justify-center gap-4 text-2xl py-1">
            {['🐾', '🌷', '🎂', '🌻', '🐈'].map((e, i) => (
              <span key={i} className="animate-float" style={{ animationDelay: `${i * 0.25}s` }}>
                {e}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div
        className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-3
                   w-full max-w-lg animate-fade-in-up delay-500 opacity-0"
        style={{ animationFillMode: 'forwards' }}
      >
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center text-sm font-extrabold text-white
                     bg-gradient-to-r from-green-400 to-emerald-500
                     py-3.5 px-6 rounded-2xl shadow-lg shadow-green-400/30
                     hover:-translate-y-0.5 hover:shadow-green-500/50
                     transition-all duration-300 flex items-center justify-center gap-2"
        >
          <span>💬</span>
          <span>Kirim Pesan WhatsApp</span>
        </a>

        <button
          onClick={onReset}
          className="flex-1 sm:flex-none text-sm font-bold text-pink-600
                     glass-card border border-pink-200 py-3.5 px-6 rounded-2xl
                     shadow-lg hover:-translate-y-0.5 hover:bg-white
                     transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
        >
          <span>🔄</span>
          <span>Ulangi Dari Awal</span>
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN APP
───────────────────────────────────────────── */
export default function App() {
  const [stage, setStage] = useState('envelope'); // 'envelope' | 'main' | 'surprise'
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [paws, setPaws] = useState([]);
  const [message, setMessage] = useState('✨ Klik kucing atau bunganya di samping ya!');
  const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [catAction, setCatAction] = useState(false);
  const [flowerBloom, setFlowerBloom] = useState(false);

  const { iframeContainerRef, play: ytPlay, pause: ytPause, ready: ytReady } = useYouTubePlayer();
  const meowRef  = useRef(null);
  const chimeRef = useRef(null);
  const popRef   = useRef(null);

  /* window resize */
  useEffect(() => {
    const handler = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  /* click-trail handler */
  const handleScreenClick = useCallback((e) => {
    if (e.target.closest('button') || e.target.closest('a')) return;
    const icons = ['🐾', '🌸', '🐱', '🌷', '✨', '💕', '🎀'];
    const icon = icons[Math.floor(Math.random() * icons.length)];
    setPaws((prev) => [...prev.slice(-14), { id: Date.now(), x: e.clientX, y: e.clientY, icon }]);
  }, []);

  /* music */
  const toggleMusic = () => {
    if (!ytReady) return;
    if (isPlayingMusic) {
      ytPause();
      setIsPlayingMusic(false);
    } else {
      ytPlay();
      setIsPlayingMusic(true);
    }
  };

  const playPop = () => {
    if (popRef.current) { popRef.current.currentTime = 0; popRef.current.play().catch(() => {}); }
  };

  /* stage transitions */
  const handleOpenEnvelope = () => { playPop(); setStage('main'); };

  const handleOpenSurprise = () => {
    playPop();
    setStage('surprise');
    // Coba autoplay musik saat buka kejutan
    ytPlay();
    setIsPlayingMusic(true);
  };

  const handleReset = () => {
    setStage('envelope');
    ytPause();
    setIsPlayingMusic(false);
  };

  /* cat & flower interactions */
  const handleCatClick = () => {
    if (meowRef.current) { meowRef.current.currentTime = 0; meowRef.current.play().catch(() => {}); }
    setCatAction(true);
    setMessage('🐱 Meow! Kucingnya lari-larian kegirangan! 🏃💨');
    setTimeout(() => setCatAction(false), 1200);
  };

  const handleFlowerClick = () => {
    if (chimeRef.current) { chimeRef.current.currentTime = 0; chimeRef.current.play().catch(() => {}); }
    setFlowerBloom(true);
    setMessage('🌸 Wuuush! Bunganya mekar selebar senyumanmu! ✨');
    setTimeout(() => setFlowerBloom(false), 1200);
  };

  const WA_NUMBER = '6285727480920';
  const whatsappUrl = `https://wa.me/${WA_NUMBER}?text=Halo,%20website%20kejutannya%20sudah%20kubaca%20ya!%20Makasih%20banyak%20kadonya%20✨`;

  /* ── RENDER ── */
  return (
    <div
      onClick={handleScreenClick}
      className="relative min-h-screen overflow-x-hidden select-none"
      style={{
        background: 'linear-gradient(135deg, #fce4ec 0%, #f3e5f5 30%, #fce4ec 60%, #e8eaf6 100%)',
        backgroundSize: '300% 300%',
        animation: 'bgShift 10s ease infinite',
      }}
    >
      {/* ── Hidden YouTube Player (Semua Aku Dirayakan - Nadin Amizah) ── */}
      {/* Container ini diisi oleh YouTube IFrame API secara otomatis */}
      <div
        ref={iframeContainerRef}
        className="fixed -bottom-[9999px] -left-[9999px] w-1 h-1 opacity-0 pointer-events-none"
        aria-hidden="true"
      />

      {/* ── SFX audio elements ── */}
      <audio ref={meowRef}   src="https://freesound.org/data/previews/415/415519_5121236-lq.mp3" />
      <audio ref={chimeRef}  src="https://freesound.org/data/previews/274/274178_5121236-lq.mp3" />
      <audio ref={popRef}    src="https://freesound.org/data/previews/456/456444_912214-lq.mp3" />

      {/* ── Background layers ── */}
      <FloatingParticles count={26} />

      {/* Decorative glow orbs */}
      <GlowOrb className="w-96 h-96 bg-pink-300   top-[-6rem]   left-[-6rem]" />
      <GlowOrb className="w-80 h-80 bg-purple-300  bottom-[-4rem] right-[-4rem]" />
      <GlowOrb className="w-64 h-64 bg-rose-200    top-[40%]     right-[-3rem]" />

      {/* ── Confetti ── */}
      {stage === 'surprise' && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle
          numberOfPieces={200}
          colors={['#f472b6', '#c084fc', '#fb7185', '#a78bfa', '#fbbf24', '#34d399']}
        />
      )}

      {/* ── Music button ── */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={toggleMusic}
          disabled={!ytReady}
          className="glass-card border border-pink-200 text-pink-600 text-xs font-extrabold
                     px-4 py-2.5 rounded-full shadow-lg
                     flex items-center gap-2
                     hover:bg-white hover:-translate-y-0.5
                     active:scale-95 transition-all duration-200 cursor-pointer
                     disabled:opacity-50 disabled:cursor-wait"
        >
          <span className={isPlayingMusic ? 'animate-bounce-soft inline-block' : ''}>
            {isPlayingMusic ? '🔊' : '🎵'}
          </span>
          <span>
            {!ytReady
              ? 'Memuat...'
              : isPlayingMusic
                ? 'Matikan Musik'
                : 'Putar Musik'}
          </span>
        </button>
        {isPlayingMusic && (
          <p className="text-center text-[10px] text-pink-400 mt-1 font-semibold tracking-wide animate-pulse">
            ♪ Nadin Amizah
          </p>
        )}
      </div>

      {/* ── Side widgets (desktop, only on non-envelope stages) ── */}
      {stage !== 'envelope' && (
        <>
          <SideWidget
            side="left"
            onCatClick={handleCatClick}
            onFlowerClick={handleFlowerClick}
            catAction={catAction}
            flowerBloom={flowerBloom}
          />
          <SideWidget
            side="right"
            onCatClick={handleCatClick}
            onFlowerClick={handleFlowerClick}
            catAction={catAction}
            flowerBloom={flowerBloom}
          />
        </>
      )}

      {/* ── Click trail paws ── */}
      {paws.map((p) => (
        <span
          key={p.id}
          className="fixed text-2xl animate-ping pointer-events-none z-[60]"
          style={{ left: p.x - 12, top: p.y - 12 }}
        >
          {p.icon}
        </span>
      ))}

      {/* ── Stages ── */}
      {stage === 'envelope' && <EnvelopeStage onOpen={handleOpenEnvelope} />}
      {stage === 'main'     && <MainStage onOpenSurprise={handleOpenSurprise} quote={quote} />}
      {stage === 'surprise' && (
        <SurpriseStage
          message={message}
          whatsappUrl={whatsappUrl}
          onReset={handleReset}
          onCatClick={handleCatClick}
          onFlowerClick={handleFlowerClick}
        />
      )}
    </div>
  );
}
