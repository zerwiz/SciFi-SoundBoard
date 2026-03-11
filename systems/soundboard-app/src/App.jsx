import React, { useCallback, useState } from 'react';
import {
  Volume2,
  Crosshair,
  Zap,
  Radio,
  Rocket,
  Activity,
  Power,
  Shield,
  Cpu,
  Wind,
  Bomb,
  Wifi,
  AlertOctagon,
  Database,
} from 'lucide-react';

const EXTENSIONS = ['mp3', 'ogg', 'wav'];

export default function App() {
  const [activeSound, setActiveSound] = useState(null);

  const getCtx = useCallback(() => {
    if (!window.audioCtx) {
      window.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (window.audioCtx.state === 'suspended') {
      window.audioCtx.resume();
    }
    return window.audioCtx;
  }, []);

  const createNoiseBuffer = useCallback((ctx, duration) => {
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }, []);

  const playSynthesizedSound = useCallback((id) => {
    const ctx = getCtx();
    const now = ctx.currentTime;

    const playNoise = (duration, fadeOut, type = 'lowpass', freq = 1000) => {
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = createNoiseBuffer(ctx, duration);
      const filter = ctx.createBiquadFilter();
      filter.type = type;
      filter.frequency.value = freq;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + fadeOut);
      noiseSource.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noiseSource.start(now);
    };

    switch (id) {
      case 'blaster': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.3);
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
        break;
      }
      case 'lightsaber': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(40, now);
        osc.frequency.linearRampToValueAtTime(60, now + 0.5);
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.5, now + 0.2);
        gain.gain.linearRampToValueAtTime(0.01, now + 1.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 1.5);
        break;
      }
      case 'droid': {
        for (let i = 0; i < 6; i++) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = i % 2 === 0 ? 'sine' : 'square';
          osc.frequency.value = 800 + Math.random() * 1200;
          gain.gain.setValueAtTime(0.2, now + i * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.12 + 0.1);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.12);
          osc.stop(now + i * 0.12 + 0.1);
        }
        break;
      }
      case 'tie_engine': {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc1.type = 'sawtooth';
        osc2.type = 'sawtooth';
        osc1.frequency.setValueAtTime(500, now);
        osc1.frequency.exponentialRampToValueAtTime(150, now + 1.2);
        osc2.frequency.setValueAtTime(510, now);
        osc2.frequency.exponentialRampToValueAtTime(155, now + 1.2);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 1.2);
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 1.2);
        osc2.stop(now + 1.2);
        break;
      }
      case 'vader': {
        const noise = ctx.createBufferSource();
        noise.buffer = createNoiseBuffer(ctx, 2.5);
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(400, now);
        filter.frequency.linearRampToValueAtTime(800, now + 1);
        filter.frequency.linearRampToValueAtTime(400, now + 2.5);
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.5, now + 1);
        gain.gain.linearRampToValueAtTime(0.01, now + 2.5);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start(now);
        break;
      }
      case 'hyperdrive': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(50, now);
        osc.frequency.exponentialRampToValueAtTime(2000, now + 1.5);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0.5, now + 1.4);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 1.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 1.5);
        setTimeout(() => playNoise(0.5, 0.4, 'lowpass', 400), 1400);
        break;
      }
      case 'seismic': {
        setTimeout(() => {
          const t = ctx.currentTime;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(40, t);
          osc.frequency.exponentialRampToValueAtTime(10, t + 1.5);
          gain.gain.setValueAtTime(0.8, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 1.5);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(t);
          osc.stop(t + 1.5);
          playNoise(1.5, 1.5, 'lowpass', 2000);
        }, 800);
        break;
      }
      case 'force': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(60, now);
        osc.frequency.linearRampToValueAtTime(30, now + 1);
        gain.gain.setValueAtTime(0.6, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 1);
        playNoise(1.0, 1.0, 'bandpass', 300);
        break;
      }
      case 'thermal': {
        for (let i = 0; i < 5; i++) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.value = 1500;
          const time = now + (i * 0.2 * (1 - i * 0.15));
          gain.gain.setValueAtTime(0.3, time);
          gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(time);
          osc.stop(time + 0.1);
        }
        setTimeout(() => playNoise(0.8, 0.8, 'lowpass', 1500), 1000);
        break;
      }
      case 'deflector': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(120, now);
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.3, now + 0.5);
        gain.gain.linearRampToValueAtTime(0.01, now + 2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 2);
        break;
      }
      case 'phaser': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.linearRampToValueAtTime(200, now + 0.4);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.4);
        break;
      }
      case 'communicator': {
        const playBeep = (freq, time, duration) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.3, time);
          gain.gain.exponentialRampToValueAtTime(0.01, time + duration);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(time);
          osc.stop(time + duration);
        };
        playBeep(1200, now, 0.1);
        playBeep(1600, now + 0.15, 0.1);
        break;
      }
      case 'red_alert': {
        for (let i = 0; i < 3; i++) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(500, now + i * 0.8);
          osc.frequency.linearRampToValueAtTime(1000, now + i * 0.8 + 0.4);
          gain.gain.setValueAtTime(0, now + i * 0.8);
          gain.gain.linearRampToValueAtTime(0.3, now + i * 0.8 + 0.1);
          gain.gain.setValueAtTime(0.3, now + i * 0.8 + 0.4);
          gain.gain.linearRampToValueAtTime(0, now + i * 0.8 + 0.6);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.8);
          osc.stop(now + i * 0.8 + 0.6);
        }
        break;
      }
      case 'transporter': {
        const osc = ctx.createOscillator();
        const lfo = ctx.createOscillator();
        const gain = ctx.createGain();
        const lfoGain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = 3000;
        lfo.type = 'sine';
        lfo.frequency.value = 15;
        lfo.connect(lfoGain);
        lfoGain.connect(gain.gain);
        lfoGain.gain.value = 0.5;
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.3, now + 1);
        gain.gain.linearRampToValueAtTime(0.01, now + 2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        lfo.start(now);
        osc.stop(now + 2);
        lfo.stop(now + 2);
        break;
      }
      case 'warp': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(50, now);
        osc.frequency.linearRampToValueAtTime(150, now + 2);
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.4, now + 1);
        gain.gain.linearRampToValueAtTime(0.01, now + 2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 2);
        break;
      }
      case 'tricorder': {
        for (let i = 0; i < 15; i++) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.value = 2500 + (i % 3) * 500;
          gain.gain.setValueAtTime(0.1, now + i * 0.05);
          gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.05 + 0.04);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.05);
          osc.stop(now + i * 0.05 + 0.04);
        }
        break;
      }
      case 'door': {
        playNoise(0.6, 0.5, 'highpass', 2000);
        break;
      }
      case 'computer': {
        for (let i = 0; i < 4; i++) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.value = 1800 - (i * 200);
          const startTime = now + (Math.random() * 0.5);
          gain.gain.setValueAtTime(0.1, startTime);
          gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.1);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(startTime);
          osc.stop(startTime + 0.1);
        }
        break;
      }
      case 'torpedo': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1000, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.4);
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.4);
        playNoise(0.3, 0.3, 'lowpass', 800);
        break;
      }
      case 'hail': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.setValueAtTime(1000, now + 0.2);
        osc.frequency.setValueAtTime(800, now + 0.4);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.setValueAtTime(0.3, now + 0.6);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.8);
        break;
      }
      default:
        break;
    }
  }, [getCtx, createNoiseBuffer]);

  const playSound = useCallback((id) => {
    setActiveSound(id);
    setTimeout(() => setActiveSound(null), 500);

    const urls = EXTENSIONS.map((ext) => `/sounds/${id}.${ext}`);
    let played = false;

    const tryPlay = (index) => {
      if (index >= urls.length) {
        playSynthesizedSound(id);
        return;
      }
      const audio = new Audio(urls[index]);
      audio.oncanplaythrough = () => {
        if (!played) {
          played = true;
          audio.play().catch(() => {});
        }
      };
      audio.onerror = () => tryPlay(index + 1);
      audio.load();
    };

    tryPlay(0);
  }, [playSynthesizedSound]);

  const SoundButton = ({ id, label, Icon, themeClass }) => {
    const isActive = activeSound === id;
    return (
      <button
        type="button"
        onClick={() => playSound(id)}
        className={`
          relative flex flex-col items-center justify-center p-4 gap-3
          rounded-lg border bg-opacity-10 backdrop-blur-sm
          transition-all duration-200 active:scale-95 group overflow-hidden
          ${themeClass}
          ${isActive ? 'scale-95 brightness-150' : 'hover:bg-opacity-20'}
        `}
      >
        <div className={`absolute inset-0 bg-current opacity-0 group-hover:opacity-5 transition-opacity ${isActive ? 'opacity-20' : ''}`} />
        <Icon size={24} className={`mb-1 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
        <span className="font-semibold text-sm tracking-widest uppercase">{label}</span>
      </button>
    );
  };

  const starWarsSounds = [
    { id: 'blaster', label: 'Blaster', icon: Crosshair },
    { id: 'lightsaber', label: 'Lightsaber', icon: Zap },
    { id: 'droid', label: 'Astromech', icon: Cpu },
    { id: 'tie_engine', label: 'TIE Engine', icon: Wind },
    { id: 'vader', label: 'Respirator', icon: Activity },
    { id: 'hyperdrive', label: 'Hyperdrive', icon: Rocket },
    { id: 'seismic', label: 'Seismic', icon: Bomb },
    { id: 'force', label: 'The Force', icon: Power },
    { id: 'thermal', label: 'Detonator', icon: AlertOctagon },
    { id: 'deflector', label: 'Deflector', icon: Shield },
  ];

  const starTrekSounds = [
    { id: 'phaser', label: 'Phaser', icon: Zap },
    { id: 'communicator', label: 'Comms', icon: Radio },
    { id: 'red_alert', label: 'Red Alert', icon: AlertOctagon },
    { id: 'transporter', label: 'Transport', icon: Activity },
    { id: 'warp', label: 'Warp Core', icon: Rocket },
    { id: 'tricorder', label: 'Tricorder', icon: Wifi },
    { id: 'door', label: 'Airlock', icon: Wind },
    { id: 'computer', label: 'Computer', icon: Database },
    { id: 'torpedo', label: 'Torpedo', icon: Bomb },
    { id: 'hail', label: 'Incoming', icon: Volume2 },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 md:p-12 font-sans relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-red-900/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-900/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-16 text-center">
          <h1 className="text-5xl font-black tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-500">
            SCI-FI AUDIO CONSOLE
          </h1>
          <p className="text-slate-400 font-mono tracking-widest text-sm">SYNTHESIZED WAVEFORM GENERATOR</p>
        </header>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">
          <section className="relative">
            <div className="absolute inset-0 bg-red-950/20 border border-red-900/30 rounded-2xl -m-6 p-6 shadow-[0_0_30px_rgba(220,38,38,0.05)] pointer-events-none" />
            <div className="flex items-center gap-4 mb-8">
              <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-red-600/50" />
              <h2 className="text-2xl font-black text-red-500 tracking-widest uppercase">Galactic Empire</h2>
              <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-red-600/50" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
              {starWarsSounds.map((sound) => (
                <SoundButton
                  key={sound.id}
                  id={sound.id}
                  label={sound.label}
                  Icon={sound.icon}
                  themeClass="border-red-900/50 text-red-400 bg-red-950/30 shadow-[0_0_15px_rgba(220,38,38,0.1)] hover:shadow-[0_0_20px_rgba(220,38,38,0.2)] hover:border-red-500/50"
                />
              ))}
            </div>
          </section>

          <section className="relative">
            <div className="absolute inset-0 bg-blue-950/20 border border-blue-900/30 rounded-2xl -m-6 p-6 shadow-[0_0_30px_rgba(59,130,246,0.05)] pointer-events-none" />
            <div className="flex items-center gap-4 mb-2">
              <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-blue-500/50" />
              <h2 className="text-2xl font-black text-blue-400 tracking-widest uppercase">Starfleet Command</h2>
              <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-blue-500/50" />
            </div>
            <p className="text-blue-400/70 text-xs font-mono uppercase tracking-wider mb-6 text-center">Real Star Trek sounds</p>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
              {starTrekSounds.map((sound) => (
                <SoundButton
                  key={sound.id}
                  id={sound.id}
                  label={sound.label}
                  Icon={sound.icon}
                  themeClass="border-blue-900/50 text-blue-300 bg-blue-950/30 shadow-[0_0_15px_rgba(59,130,246,0.1)] hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:border-blue-400/50"
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
