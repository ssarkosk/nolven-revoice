/**
 * Nolven Studio — Revoice
 * Tek Parça (Single-File) Eksiksiz React Uygulaması
 * Dosya: src/App.tsx
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Play, Pause, RotateCcw, Volume2, VolumeX, Mic, MicOff, Upload,
  Sliders, Info, Waves, Headphones, AlertCircle, Menu, X,
  ArrowRight, ArrowUpRight, ShieldCheck, Film, Cpu, SlidersHorizontal,
  Clock, Sparkles, Globe, Clapperboard, Globe2, HeartHandshake,
  Lock, Award, FileCheck, ShieldAlert, ChevronDown, CheckCircle2, Mail
} from 'lucide-react';

/* ==========================================================================
   1. TYPES & DATA CONTRACTS
   ========================================================================== */

export interface DialogueSegment {
  id: string;
  speaker: string;
  text: string;
  startTime: number;
  endTime: number;
  emotionalTone: string;
  pauseAfterMs: number;
  pitchOffset: number;
  cadenceMatchScore: number;
  phonemes: string[];
  originalAudioCue: string;
}

export interface SampleScene {
  id: string;
  title: string;
  category: string;
  duration: number;
  aspectRatio: string;
  imagePath: string;
  synopsis: string;
  dialogueSegments: DialogueSegment[];
  acousticEnvironment: string;
}

export interface VoiceProfile {
  id: string;
  name: string;
  type: 'custom' | 'preset' | 'recorded';
  genderDescription: string;
  medianPitchHz: number;
  harmonicRatio: number;
  sampleDurationSec: number;
  timbreDescription: string;
  audioBlobUrl?: string;
  status: 'ready' | 'recording' | 'analyzing';
}

export type PlaybackMode = 'original' | 'revoiced' | 'ab-split';

/* ==========================================================================
   2. DATA REPOSITORIES & CURATED SCENES
   ========================================================================== */

const SAMPLE_SCENES: SampleScene[] = [
  {
    id: 'scene-atrium-noir',
    title: 'The Observation Deck',
    category: 'Architectural Drama',
    duration: 18.0,
    aspectRatio: '2.39:1',
    imagePath: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1600&q=80',
    synopsis: 'Two researchers meet on a misty high-rise walkway at dusk. A tense confrontation under low urban light.',
    acousticEnvironment: 'Open High-Rise Terrace · Light Wind Buffeting · Damp Concrete Reflection',
    dialogueSegments: [
      {
        id: 'seg-1',
        speaker: 'Elena Vance',
        text: 'We never spoke about what happened before the signal broke.',
        startTime: 1.8,
        endTime: 5.6,
        emotionalTone: 'Intimate / Tense',
        pauseAfterMs: 1400,
        pitchOffset: -1.8,
        cadenceMatchScore: 98.4,
        phonemes: ['w-i', 'n-e-v-er', 's-p-o-k', 'b-e-f-or', 's-i-g-n-al'],
        originalAudioCue: 'Soft vocal fry, descending cadence, breathy exhale at tail',
      },
      {
        id: 'seg-2',
        speaker: 'David Cross',
        text: 'You knew as well as I did that the telemetry was compromised.',
        startTime: 7.0,
        endTime: 11.2,
        emotionalTone: 'Resolute / Guarded',
        pauseAfterMs: 950,
        pitchOffset: +0.6,
        cadenceMatchScore: 97.1,
        phonemes: ['y-u', 'n-u', 'w-e-l', 't-e-l-e-m-e-t-r-y'],
        originalAudioCue: 'Firm chest resonance, steady mid-tempo pace, sharp sibilance',
      },
      {
        id: 'seg-3',
        speaker: 'Elena Vance',
        text: 'Then look down there. Neither of us gets to walk away clean.',
        startTime: 12.15,
        endTime: 16.4,
        emotionalTone: 'Somber / Defiant',
        pauseAfterMs: 1600,
        pitchOffset: -1.2,
        cadenceMatchScore: 99.0,
        phonemes: ['d-e-n', 'l-u-k', 'd-a-u-n', 'w-o-k', 'k-l-e-n'],
        originalAudioCue: 'Whisper-to-vocalized shift, slight tremolo, heavy end pause',
      },
    ],
  },
  {
    id: 'scene-fjord-voyage',
    title: 'Fjord Boundary Monologue',
    category: 'Cinematic Documentary',
    duration: 17.5,
    aspectRatio: '2.39:1',
    imagePath: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
    synopsis: 'A lone expedition surveyor records voice notes along the glacial ridge overlooking a volcanic fjord.',
    acousticEnvironment: 'Arctic Ridge · Wide Panoramic Air · Cardioid Windscreen Mic',
    dialogueSegments: [
      {
        id: 'seg-4',
        speaker: 'Surveyor Field Mic',
        text: 'The ice shelf has retreated another two hundred meters into the caldera.',
        startTime: 1.5,
        endTime: 6.2,
        emotionalTone: 'Reflective / Exhausted',
        pauseAfterMs: 1800,
        pitchOffset: -0.8,
        cadenceMatchScore: 98.9,
        phonemes: ['d-e', 'a-i-s', 's-e-l-f', 'm-e-t-e-r-z'],
        originalAudioCue: 'Cold dry room, subdued breath pacing, rhythmic pauses',
      },
      {
        id: 'seg-5',
        speaker: 'Surveyor Field Mic',
        text: 'If the melt rate holds, no satellite map made last summer will remain accurate.',
        startTime: 8.0,
        endTime: 13.5,
        emotionalTone: 'Measured / Urgent Undercurrent',
        pauseAfterMs: 2100,
        pitchOffset: +0.4,
        cadenceMatchScore: 96.8,
        phonemes: ['m-e-l-t', 'r-e-i-t', 's-a-t-e-l-a-i-t', 'a-k-y-u-r-e-t'],
        originalAudioCue: 'Close-mic proximity effect, deep inhalation, precise consonants',
      },
    ],
  },
  {
    id: 'scene-soundstage-adr',
    title: 'Soundstage ADR Session',
    category: 'Post-Production Foley',
    duration: 16.0,
    aspectRatio: '2.39:1',
    imagePath: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1600&q=80',
    synopsis: 'Director and dialogue supervisor re-recording lead performance track on the mixing soundstage.',
    acousticEnvironment: 'Calibrated Dolby Atmos Soundstage · Ultra-Dry Acoustic Baffles',
    dialogueSegments: [
      {
        id: 'seg-6',
        speaker: 'Director Talkback',
        text: 'Take three. Give me two beats before the second phrase.',
        startTime: 1.0,
        endTime: 4.8,
        emotionalTone: 'Authoritative / Precise',
        pauseAfterMs: 1200,
        pitchOffset: 0.0,
        cadenceMatchScore: 99.5,
        phonemes: ['t-e-i-k', 't-r-i', 't-u', 'b-i-t-s', 'f-r-e-i-z'],
        originalAudioCue: 'Studio broadcast condenser, crisp transients, immediate decay',
      },
      {
        id: 'seg-7',
        speaker: 'Voice Actor (Booth)',
        text: 'Understood. Matching the breath markers from the wide master angle.',
        startTime: 6.0,
        endTime: 11.2,
        emotionalTone: 'Controlled / Rehearsed',
        pauseAfterMs: 1500,
        pitchOffset: -1.0,
        cadenceMatchScore: 98.2,
        phonemes: ['u-n-d-e-r-s-t-u-d', 'b-r-e-t-h', 'm-a-s-t-e-r'],
        originalAudioCue: 'Vocal booth isolation, flat frequency curve, clear articulation',
      },
    ],
  },
];

const PRESET_VOICE_PROFILES: VoiceProfile[] = [
  {
    id: 'vp-evelyn',
    name: 'Evelyn V.',
    type: 'preset',
    genderDescription: 'Mezzo-Soprano · Warm Timbre',
    medianPitchHz: 198,
    harmonicRatio: 0.88,
    sampleDurationSec: 24,
    timbreDescription: 'Rich mid-chest warmth with silky high-frequency air. Suited for dramatic monologue.',
    status: 'ready',
  },
  {
    id: 'vp-marcus',
    name: 'Marcus K.',
    type: 'preset',
    genderDescription: 'Baritone · Resonant & Measured',
    medianPitchHz: 114,
    harmonicRatio: 0.92,
    sampleDurationSec: 30,
    timbreDescription: 'Deep sub-formant body with authoritative articulation. Ideal for dialogue & ADR.',
    status: 'ready',
  },
  {
    id: 'vp-solene',
    name: 'Solène R.',
    type: 'preset',
    genderDescription: 'Contralto · Intimate & Crisp',
    medianPitchHz: 165,
    harmonicRatio: 0.84,
    sampleDurationSec: 18,
    timbreDescription: 'Focused forward placement with subtle breath retention. High dynamic articulation.',
    status: 'ready',
  },
];

/* ==========================================================================
   3. WEB AUDIO SYNTHESIS & RECORDING ENGINE
   ========================================================================== */

class StandaloneAudioEngine {
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private gainNode: GainNode | null = null;
  private activeOscillators: OscillatorNode[] = [];
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.8;
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(0.5, this.ctx.currentTime);
      this.gainNode.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMasterVolume(vol: number) {
    this.initContext();
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(Math.max(0, Math.min(1, vol)), this.ctx.currentTime);
    }
  }

  public playSegmentCadence(
    segment: DialogueSegment,
    profile: VoiceProfile | null,
    isRevoiceMode: boolean
  ) {
    this.stopPlayback();
    this.initContext();
    if (!this.ctx || !this.gainNode) return;

    const now = this.ctx.currentTime;
    const duration = Math.max(0.5, segment.endTime - segment.startTime);

    let basePitch = 140;
    if (isRevoiceMode && profile) {
      basePitch = profile.medianPitchHz;
    } else {
      basePitch = segment.speaker.includes('David') || segment.speaker.includes('Director') ? 120 : 185;
      basePitch += segment.pitchOffset * 10;
    }

    const oscF0 = this.ctx.createOscillator();
    const oscF1 = this.ctx.createOscillator();
    const subOsc = this.ctx.createOscillator();

    const segGain = this.ctx.createGain();
    const filterF1 = this.ctx.createBiquadFilter();

    filterF1.type = 'bandpass';
    filterF1.frequency.setValueAtTime(isRevoiceMode ? 650 : 500, now);
    filterF1.Q.setValueAtTime(3.5, now);

    oscF0.type = 'sawtooth';
    oscF0.frequency.setValueAtTime(basePitch, now);
    oscF0.frequency.linearRampToValueAtTime(basePitch * 1.08, now + duration * 0.4);
    oscF0.frequency.linearRampToValueAtTime(basePitch * 0.88, now + duration * 0.95);

    oscF1.type = 'sine';
    oscF1.frequency.setValueAtTime(basePitch * 2, now);

    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(basePitch * 0.5, now);

    segGain.gain.setValueAtTime(0.0001, now);
    segGain.gain.linearRampToValueAtTime(0.28, now + 0.12);

    const syllables = Math.max(3, Math.min(10, segment.phonemes.length * 2));
    const step = duration / syllables;
    for (let i = 1; i < syllables; i++) {
      const t = now + i * step;
      segGain.gain.exponentialRampToValueAtTime(0.08, t - 0.04);
      segGain.gain.exponentialRampToValueAtTime(0.25, t);
    }

    segGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    oscF0.connect(filterF1);
    filterF1.connect(segGain);

    oscF1.connect(segGain);
    subOsc.connect(segGain);

    segGain.connect(this.gainNode);

    oscF0.start(now);
    oscF1.start(now);
    subOsc.start(now);

    oscF0.stop(now + duration + 0.05);
    oscF1.stop(now + duration + 0.05);
    subOsc.stop(now + duration + 0.05);

    this.activeOscillators = [oscF0, oscF1, subOsc];
  }

  public stopPlayback() {
    this.activeOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // already stopped
      }
    });
    this.activeOscillators = [];
  }

  public async startMicrophoneRecording(): Promise<{ stream: MediaStream; audioContext: AudioContext }> {
    this.initContext();
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Microphone access is not supported by your browser.');
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
    });

    this.recordedChunks = [];
    const mimeType = MediaRecorder.isTypeSupported('audio/webm')
      ? 'audio/webm'
      : MediaRecorder.isTypeSupported('audio/mp4')
      ? 'audio/mp4'
      : '';

    this.mediaRecorder = mimeType
      ? new MediaRecorder(stream, { mimeType })
      : new MediaRecorder(stream);

    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) this.recordedChunks.push(e.data);
    };

    this.mediaRecorder.start(100);
    return { stream, audioContext: this.ctx! };
  }

  public stopMicrophoneRecording(): Promise<{ blob: Blob; url: string; durationSec: number }> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('No active recording session.'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.recordedChunks, {
          type: this.mediaRecorder?.mimeType || 'audio/webm',
        });
        const url = URL.createObjectURL(blob);
        resolve({
          blob,
          url,
          durationSec: Math.max(1, Math.round(this.recordedChunks.length * 0.1)),
        });
        this.recordedChunks = [];
      };

      this.mediaRecorder.stop();
      this.mediaRecorder.stream.getTracks().forEach((track) => track.stop());
    });
  }

  public static formatTimecode(seconds: number): string {
    const totalFrames = Math.floor(seconds * 24);
    const ff = String(totalFrames % 24).padStart(2, '0');
    const ss = String(Math.floor(seconds) % 60).padStart(2, '0');
    const mm = String(Math.floor(seconds / 60) % 60).padStart(2, '0');
    const hh = String(Math.floor(seconds / 3600)).padStart(2, '0');
    return `${hh}:${mm}:${ss}:${ff}`;
  }
}

const audioEngine = new StandaloneAudioEngine();

/* ==========================================================================
   4. MODALS & SUB-COMPONENTS
   ========================================================================== */

function WorkflowModal({
  isOpen,
  onClose,
  onStartDemo,
}: {
  isOpen: boolean;
  onClose: () => void;
  onStartDemo: () => void;
}) {
  if (!isOpen) return null;

  const steps = [
    {
      num: '01',
      title: 'Consent & Rights Attestation',
      icon: ShieldCheck,
      description:
        'Upload only authorized footage—videos you created, own, or have explicit licensing permissions to adapt. Nolven enforces cryptographic voice consent signatures to prevent non-consensual deepfakes.',
      details: ['User-owned or licensed media check', 'Voice identity consent authorization', 'Zero scraping of public celebrity voices'],
    },
    {
      num: '02',
      title: 'Voice Sample Calibration',
      icon: Mic,
      description:
        'Provide a 15–30 second lossless audio recording of your natural speaking voice. The calibration engine extracts median pitch (F0), formant dispersion (F1/F2), and dynamic articulation curves.',
      details: ['Lossless 48kHz audio capture', 'Acoustic feature space mapping', 'No retention of raw biometric files on public servers'],
    },
    {
      num: '03',
      title: 'Dialogue Timing & Pause Alignment',
      icon: Cpu,
      description:
        'The scene dialogue is broken into micro-segments. Sub-frame phoneme boundaries, breath cues, and emotional cadence curves are locked to match the on-screen performance exactly.',
      details: ['Sub-frame lip-sync temporal lock', 'Preserves intentional dramatic pauses', 'Emotional pitch modulation extraction'],
    },
    {
      num: '04',
      title: 'Stem Preview & Acoustic Convolving',
      icon: SlidersHorizontal,
      description:
        'Audition adapted dialogue tracks against the original room acoustics. Adjust cadence strictness, reverb wetness, and breath retention before exporting studio-ready stems.',
      details: ['Room impulse response (RIR) convolution', 'Exportable standard WAV/OMF dialogue stems', 'Full A/B comparison for director sign-off'],
    },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-3xl bg-[#0E1017] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-6 border-b border-white/[0.08]">
          <div>
            <div className="text-xs font-mono text-violet-400 uppercase tracking-wider mb-1">
              Architecture & Product Blueprint
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              The Nolven Revoice Workflow
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.05] transition-colors focus-visible:outline-2 focus-visible:outline-violet-400"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-5 p-4 bg-violet-950/20 border border-violet-500/20 rounded-xl text-xs sm:text-sm text-slate-300 flex items-start gap-3">
          <div className="w-2 h-2 rounded-full bg-violet-400 shrink-0 mt-1.5" />
          <div>
            <span className="font-semibold text-white">Transparent Development Note: </span>
            This interactive walkthrough illustrates our planned end-to-end production pipeline. The browser prototype currently simulates acoustic mapping and timing alignment locally. Full neural voice synthesis will connect to Nolven's dedicated processing cluster as our models graduate from internal trials.
          </div>
        </div>

        <div className="space-y-6 pt-2">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="p-4 sm:p-5 bg-[#121520] border border-white/[0.06] rounded-xl hover:border-violet-500/30 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-violet-600/10 border border-violet-500/20 flex items-center justify-center shrink-0 text-violet-400 font-mono text-sm font-semibold">
                    <Icon className="w-5 h-5 text-violet-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-slate-500">{step.num}</span>
                      <h3 className="text-base font-semibold text-white">{step.title}</h3>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3">
                      {step.description}
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs text-slate-400">
                      {step.details.map((detail, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-slate-400">
                          <CheckCircle2 className="w-3.5 h-3.5 text-violet-400/80 shrink-0" />
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 pt-6 border-t border-white/[0.08] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onStartDemo();
            }}
            className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-violet-600 hover:bg-violet-500 rounded-lg transition-colors shadow-lg shadow-violet-600/20 cursor-pointer"
          >
            Audition in Prototype
          </button>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   5. PRIMARY STANDALONE APP COMPONENT
   ========================================================================== */

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [scenes, setScenes] = useState<SampleScene[]>(SAMPLE_SCENES);
  const [selectedScene, setSelectedScene] = useState<SampleScene>(SAMPLE_SCENES[0]);
  const [selectedSegment, setSelectedSegment] = useState<DialogueSegment>(SAMPLE_SCENES[0].dialogueSegments[0]);

  const [voiceProfiles, setVoiceProfiles] = useState<VoiceProfile[]>(PRESET_VOICE_PROFILES);
  const [activeProfile, setActiveProfile] = useState<VoiceProfile>(PRESET_VOICE_PROFILES[1]);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [playbackMode, setPlaybackMode] = useState<PlaybackMode>('revoiced');
  const [volume, setVolume] = useState<number>(0.7);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [loop, setLoop] = useState<boolean>(true);

  const [customVideoUrl, setCustomVideoUrl] = useState<string | null>(null);

  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [recordingError, setRecordingError] = useState<string | null>(null);

  const [cadenceStrictness, setCadenceStrictness] = useState<number>(98);
  const [pitchOffset, setPitchOffset] = useState<number>(selectedSegment.pitchOffset);
  const [breathRetention, setBreathRetention] = useState<number>(85);

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [isWorkflowModalOpen, setIsWorkflowModalOpen] = useState<boolean>(false);

  const recordingTimerRef = useRef<number | null>(null);
  const videoElementRef = useRef<HTMLVideoElement | null>(null);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    setPitchOffset(selectedSegment.pitchOffset);
  }, [selectedSegment]);

  useEffect(() => {
    let interval: number | null = null;
    if (isPlaying) {
      const stepMs = 50;
      interval = window.setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + stepMs / 1000;
          if (next >= selectedScene.duration) {
            if (loop) {
              return 0;
            } else {
              setIsPlaying(false);
              return selectedScene.duration;
            }
          }
          return next;
        });
      }, stepMs);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, selectedScene.duration, loop]);

  useEffect(() => {
    audioEngine.setMasterVolume(isMuted ? 0 : volume);
  }, [volume, isMuted]);

  const activeDialogue = selectedScene.dialogueSegments.find(
    (seg) => currentTime >= seg.startTime && currentTime <= seg.endTime
  );

  const handleSelectScene = (scene: SampleScene) => {
    audioEngine.stopPlayback();
    setIsPlaying(false);
    setCurrentTime(0);
    setSelectedScene(scene);
    setSelectedSegment(scene.dialogueSegments[0]);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      audioEngine.stopPlayback();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      if (currentTime >= selectedScene.duration - 0.2) {
        setCurrentTime(0);
      }
      if (selectedSegment) {
        audioEngine.playSegmentCadence(
          selectedSegment,
          activeProfile,
          playbackMode === 'revoiced'
        );
      }
    }
  };

  const handleAuditionSegment = (seg: DialogueSegment) => {
    setSelectedSegment(seg);
    setCurrentTime(seg.startTime);
    audioEngine.playSegmentCadence(
      seg,
      activeProfile,
      playbackMode === 'revoiced'
    );
  };

  const startRecordingVoice = async () => {
    setRecordingError(null);
    try {
      await audioEngine.startMicrophoneRecording();
      setIsRecording(true);
      setRecordingSeconds(0);
      recordingTimerRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Microphone access denied';
      setRecordingError(errorMsg);
      setIsRecording(false);
    }
  };

  const stopRecordingVoice = async () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
    }
    setIsRecording(false);
    try {
      const { url, durationSec } = await audioEngine.stopMicrophoneRecording();
      const newProfile: VoiceProfile = {
        id: `vp-user-${Date.now()}`,
        name: 'My Calibrated Voice',
        type: 'recorded',
        genderDescription: 'Custom Microphone Profile',
        medianPitchHz: 148,
        harmonicRatio: 0.89,
        sampleDurationSec: durationSec,
        timbreDescription: 'Direct browser capture. Normalized acoustic envelope.',
        audioBlobUrl: url,
        status: 'ready',
      };
      setVoiceProfiles((prev) => [newProfile, ...prev]);
      setActiveProfile(newProfile);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomVideoUrl(url);
      const customScene: SampleScene = {
        id: `scene-custom-${Date.now()}`,
        title: file.name.substring(0, 24),
        category: 'Authorized User Media',
        duration: 20.0,
        aspectRatio: '16:9',
        imagePath: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1600&q=80',
        synopsis: 'Locally loaded media file for timeline extraction and dialogue calibration.',
        acousticEnvironment: 'User Local Source · Pending Convolving',
        dialogueSegments: [
          {
            id: 'seg-custom-1',
            speaker: 'Lead Voice Track',
            text: 'Extracted primary dialogue region from user uploaded clip.',
            startTime: 2.0,
            endTime: 7.5,
            emotionalTone: 'Natural Conversational',
            pauseAfterMs: 1200,
            pitchOffset: 0.0,
            cadenceMatchScore: 98.0,
            phonemes: ['u-z-e-r', 'd-a-i-a-l-o-g', 's-e-g-m-e-n-t'],
            originalAudioCue: 'Extracted from user audio channel',
          },
        ],
      };
      setScenes((prev) => [customScene, ...prev]);
      setSelectedScene(customScene);
      setSelectedSegment(customScene.dialogueSegments[0]);
    }
  };

  const handleVoiceSampleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const newProfile: VoiceProfile = {
        id: `vp-upload-${Date.now()}`,
        name: file.name.substring(0, 18),
        type: 'custom',
        genderDescription: 'Uploaded Lossless Master',
        medianPitchHz: 152,
        harmonicRatio: 0.91,
        sampleDurationSec: 20,
        timbreDescription: 'Imported audio stem. Clean vocal isolation profile.',
        audioBlobUrl: url,
        status: 'ready',
      };
      setVoiceProfiles((prev) => [newProfile, ...prev]);
      setActiveProfile(newProfile);
    }
  };

  const faqs = [
    {
      category: 'CURRENT STATUS',
      question: 'Is Nolven Revoice already a fully functional production product?',
      answer:
        'No. Nolven Revoice is currently an early-stage research prototype and technology demonstration. The interactive workspace on this website demonstrates our dialogue segmentation, timing alignment, and acoustic modeling principles directly in your browser. A production-grade neural conversion engine running on dedicated compute infrastructure is in active engineering development.',
    },
    {
      category: 'VOICE SAMPLES',
      question: 'What kind of voice sample is required, and how long does it take?',
      answer:
        'When fully supported, the engine will require approximately 15 to 30 seconds of clean, uncompressed speech recorded in a quiet environment. We recommend reading a standard calibration phoneme text at conversational volume. The engine calibrates pitch range, vowel formants, and resonance curves.',
    },
    {
      category: 'PERMISSIONS & RIGHTS',
      question: 'Can I upload any movie or copyrighted film dialogue?',
      answer:
        'No. Nolven Studio strictly requires that users upload videos they own, created, or possess explicit legal authorization to adapt. We do not permit uploading unauthorized commercial theatrical films, television broadcasts, or third-party videos without rights clearance.',
    },
    {
      category: 'ETHICS & CONSENT',
      question: 'How do you prevent non-consensual voice cloning or deepfakes?',
      answer:
        'We enforce strict cryptographic identity verification and active voice consent attestations prior to profile generation. Our platform will not process requests attempting to emulate public figures, celebrities, or individuals who have not explicitly authorized their voice biometrics.',
    },
    {
      category: 'PRIVACY & DATA',
      question: 'Are my audio recordings or videos uploaded to public servers?',
      answer:
        'In this web prototype, all audio recording and synthesis happens locally inside your browser using the HTML5 MediaRecorder and Web Audio APIs; no audio or video is stored or transmitted. In our upcoming cloud engine, audio data will be encrypted in transit and at rest, processed in isolated secure enclaves, and deleted upon stem delivery unless explicitly archived by the user.',
    },
    {
      category: 'PERFORMANCE',
      question: 'How does the system preserve emotional delivery and pauses?',
      answer:
        'Rather than executing generic text-to-speech, Nolven Revoice decomposes the original performance into micro-cadence vectors—capturing vocal fry, emotional tension, syllable elongation, breath intakes, and precise silence durations—and forces the adapted voice to conform to these exact temporal boundaries.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#08090C] text-[#E4E6EB] flex flex-col font-sans selection:bg-violet-600/40 selection:text-white">
      
      {/* 1. NAVIGATION */}
      <header className="sticky top-0 z-50 w-full bg-[#08090C]/85 backdrop-blur-md border-b border-white/[0.06] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          <a 
            href="#" 
            className="text-lg font-bold tracking-tight text-white flex items-center gap-2 whitespace-nowrap shrink-0 group"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-violet-500/80 group-hover:bg-violet-400 transition-colors shadow-[0_0_10px_rgba(139,92,246,0.5)]"></span>
            <span>Nolven Studio</span>
            <span className="text-xs font-normal text-slate-500 tracking-normal ml-1">Revoice</span>
          </a>

          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-400" aria-label="Main navigation">
            <button 
              onClick={() => scrollTo('interactive-workspace')} 
              className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Product Workspace
            </button>
            <button 
              onClick={() => scrollTo('how-it-works')} 
              className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              How It Works
            </button>
            <button 
              onClick={() => scrollTo('capabilities')} 
              className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Capabilities
            </button>
            <button 
              onClick={() => scrollTo('use-cases')} 
              className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Use Cases
            </button>
            <button 
              onClick={() => scrollTo('ethical-charter')} 
              className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Ethics & Vision
            </button>
            <button 
              onClick={() => scrollTo('faq')} 
              className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              FAQ
            </button>
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => scrollTo('interactive-workspace')}
              className="px-4 py-2 text-xs font-semibold text-white bg-violet-600/90 hover:bg-violet-500 rounded-lg transition-all duration-200 shadow-[0_0_20px_-3px_rgba(139,92,246,0.4)] hover:shadow-[0_0_25px_-1px_rgba(139,92,246,0.6)] flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Try the Demo</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0C0E14] border-b border-white/[0.08] px-4 py-5 space-y-3">
            <button onClick={() => scrollTo('interactive-workspace')} className="block w-full text-left py-2 text-sm font-medium text-slate-300 hover:text-white">
              Product Workspace
            </button>
            <button onClick={() => scrollTo('how-it-works')} className="block w-full text-left py-2 text-sm font-medium text-slate-300 hover:text-white">
              How It Works
            </button>
            <button onClick={() => scrollTo('capabilities')} className="block w-full text-left py-2 text-sm font-medium text-slate-300 hover:text-white">
              Capabilities
            </button>
            <button onClick={() => scrollTo('use-cases')} className="block w-full text-left py-2 text-sm font-medium text-slate-300 hover:text-white">
              Use Cases
            </button>
            <button onClick={() => scrollTo('ethical-charter')} className="block w-full text-left py-2 text-sm font-medium text-slate-300 hover:text-white">
              Ethics & Vision
            </button>
            <button onClick={() => scrollTo('faq')} className="block w-full text-left py-2 text-sm font-medium text-slate-300 hover:text-white">
              FAQ
            </button>
          </div>
        )}
      </header>

      <main className="flex-1">
        
        {/* 2. HERO SECTION */}
        <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 overflow-hidden border-b border-white/[0.05]">
          <div 
            className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-violet-600/10 blur-[130px] rounded-full pointer-events-none"
            aria-hidden="true"
          />
          <div 
            className="absolute top-1/3 left-1/4 w-[500px] h-[300px] bg-sky-600/8 blur-[140px] rounded-full pointer-events-none"
            aria-hidden="true"
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              
              <div className="lg:col-span-7 flex flex-col items-start space-y-6">
                <div className="flex items-center gap-2 text-xs font-medium tracking-wide uppercase text-violet-400/90">
                  <span>Nolven Studio</span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="text-slate-400">Early-Stage Voice Experience</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.08] text-balance">
                  Your Voice.<br />
                  <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                    Every Scene.
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-slate-300/90 leading-relaxed max-w-xl">
                  Reimagine video dialogue in your own voice, with a focus on emotional delivery, timing, and synchronization.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => scrollTo('interactive-workspace')}
                    className="px-6 py-3.5 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-500 rounded-lg transition-all duration-200 shadow-[0_0_25px_-5px_rgba(139,92,246,0.5)] flex items-center gap-2.5 cursor-pointer"
                  >
                    <span>Experience the Demo</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => scrollTo('how-it-works')}
                    className="px-5 py-3.5 text-sm font-medium text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <span>How It Works</span>
                  </button>
                </div>

                <div className="pt-4 flex items-center gap-3 text-xs text-slate-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                  <span>Interactive prototype with browser audio modeling. No fake backend generation.</span>
                </div>
              </div>

              <div className="lg:col-span-5 relative">
                <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0E1015] shadow-2xl shadow-black/80 group">
                  <div className="px-4 py-2.5 bg-[#12141C] border-b border-white/[0.06] flex items-center justify-between text-xs font-mono text-slate-400">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-violet-400/80"></span>
                      <span className="tracking-wide">SOUNDSTAGE PREVIEW</span>
                    </div>
                    <div className="tabular-nums text-slate-400">
                      TC 00:01:24:18
                    </div>
                  </div>

                  <div className="relative aspect-video w-full overflow-hidden bg-black">
                    <img
                      src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80"
                      alt="Nolven soundstage ADR mixing console with cinematic dialogue monitor"
                      className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                      referrerPolicy="no-referrer"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                    <div className="absolute bottom-3 left-3 right-3 p-3 bg-[#0B0D12]/90 backdrop-blur-md rounded-lg border border-white/10">
                      <div className="flex items-center justify-between text-[11px] font-mono text-violet-300 mb-1">
                        <span>DIALOGUE TRACK · TAKE 03</span>
                        <span className="text-slate-400">SYNC LOCK: 98.4%</span>
                      </div>
                      <p className="text-xs text-white/95 italic font-medium leading-snug">
                        "We never spoke about what happened before the signal broke."
                      </p>
                      
                      <div className="mt-2 flex items-center gap-1 h-3" aria-hidden="true">
                        {[40, 70, 95, 60, 30, 85, 100, 75, 45, 90, 60, 30, 70, 85, 50, 65, 40, 90, 75, 30].map((height, i) => (
                          <span 
                            key={i} 
                            className="flex-1 bg-violet-500/60 rounded-full transition-all duration-300" 
                            style={{ height: `${height}%` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="px-4 py-2.5 bg-[#0B0D12] border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <Mic className="w-3.5 h-3.5 text-violet-400" />
                      <span>Personal Voice Sample</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sliders className="w-3.5 h-3.5 text-sky-400" />
                      <span>Emotional Inflection Lock</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 3. INTERACTIVE PRODUCT WORKSPACE */}
        <section 
          id="interactive-workspace" 
          className="py-16 md:py-24 bg-[#0A0C11] border-b border-white/[0.06] relative"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-violet-400 mb-2">
                  <span className="w-2 h-2 rounded-full bg-violet-400/80"></span>
                  <span>PROTOTYPE WORKSPACE</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400">SIMULATION ENGINE v0.4</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Nolven Revoice Studio Workspace
                </h2>
                <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                  Audition dialogue timing, phoneme synchronization, and cadence adaptation across authorized video scenes.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsWorkflowModalOpen(true)}
                  className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.1] rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Info className="w-3.5 h-3.5 text-violet-400" />
                  <span>Explore Workflow Blueprint</span>
                </button>
              </div>
            </div>

            <div className="mb-8 p-3.5 bg-[#12141F] border border-violet-500/20 rounded-xl flex items-start sm:items-center justify-between gap-4 text-xs text-slate-300">
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-violet-400 shrink-0 mt-1 sm:mt-0" />
                <div>
                  <span className="font-semibold text-white">Interactive Prototype: </span>
                  Demonstrates acoustic alignment, timing preservation, and cadence mapping using local browser synthesis. Full neural voice model training will connect to Nolven's authorized inference cluster in production.
                </div>
              </div>
              <div className="text-[11px] font-mono text-slate-500 shrink-0 hidden md:block">
                NO FAKE BACKEND · LOCAL DEMO
              </div>
            </div>

            <div className="bg-[#0C0E14] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl">
              <div className="px-5 py-3.5 bg-[#10131B] border-b border-white/[0.06] flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-slate-500 font-mono text-[11px] mr-1">SCENE:</span>
                  {scenes.map((scene) => (
                    <button
                      key={scene.id}
                      onClick={() => handleSelectScene(scene)}
                      className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                        selectedScene.id === scene.id
                          ? 'bg-violet-600/30 text-white border border-violet-500/40'
                          : 'text-slate-400 hover:text-slate-200 bg-white/[0.03] hover:bg-white/[0.06]'
                      }`}
                    >
                      {scene.title}
                    </button>
                  ))}

                  <label className="px-3 py-1.5 rounded-md font-medium text-slate-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.06] border border-dashed border-white/10 cursor-pointer flex items-center gap-1.5">
                    <Upload className="w-3 h-3 text-slate-400" />
                    <span>Load Local Clip</span>
                    <input
                      type="file"
                      accept="video/*,audio/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex items-center gap-4 font-mono text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500">TC:</span>
                    <span className="text-white font-semibold tabular-nums">
                      {StandaloneAudioEngine.formatTimecode(currentTime)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500">SYNC LOCK:</span>
                    <span className="text-violet-400 font-semibold tabular-nums">
                      {selectedSegment.cadenceMatchScore}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-white/[0.06]">
                <div className="lg:col-span-7 p-4 sm:p-6 bg-[#08090D] flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/[0.06]">
                  <div className="relative aspect-[2.39/1] sm:aspect-video w-full bg-black rounded-xl overflow-hidden border border-white/10 shadow-lg">
                    {customVideoUrl ? (
                      <video
                        ref={videoElementRef}
                        src={customVideoUrl}
                        className="w-full h-full object-cover"
                        controls={false}
                      />
                    ) : (
                      <img
                        src={selectedScene.imagePath}
                        alt={selectedScene.title}
                        className="w-full h-full object-cover object-center"
                        referrerPolicy="no-referrer"
                      />
                    )}

                    <div className="absolute inset-0 border-[6px] sm:border-[8px] border-black/40 pointer-events-none" />

                    <div className="absolute bottom-4 left-4 right-4 text-center pointer-events-none">
                      {activeDialogue ? (
                        <div className="inline-block px-4 py-1.5 bg-black/80 backdrop-blur-md border border-white/20 rounded-md text-sm sm:text-base font-semibold text-white drop-shadow-md animate-in fade-in duration-150">
                          <span className="text-violet-400 text-xs font-mono mr-2">
                            [{activeDialogue.speaker}]
                          </span>
                          "{activeDialogue.text}"
                        </div>
                      ) : (
                        <div className="text-xs font-mono text-slate-500 italic">
                          [Scene Atmosphere · {selectedScene.acousticEnvironment}]
                        </div>
                      )}
                    </div>

                    <div className="absolute top-3 right-3 px-2 py-1 bg-black/70 backdrop-blur-sm rounded text-[10px] font-mono border border-white/10 text-slate-300">
                      {playbackMode === 'revoiced' && 'NOLVEN REVOICE (ACTIVE)'}
                      {playbackMode === 'original' && 'ORIGINAL ADR STEM'}
                      {playbackMode === 'ab-split' && 'A/B SPLIT AUDITION'}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-mono text-slate-400 tabular-nums w-12 text-right">
                        {currentTime.toFixed(1)}s
                      </span>
                      
                      <div className="relative flex-1 flex items-center">
                        <input
                          type="range"
                          min={0}
                          max={selectedScene.duration}
                          step={0.1}
                          value={currentTime}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setCurrentTime(val);
                            const seg = selectedScene.dialogueSegments.find(
                              (s) => val >= s.startTime - 0.5 && val <= s.endTime + 0.5
                            );
                            if (seg) setSelectedSegment(seg);
                          }}
                          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-violet-500"
                        />
                      </div>

                      <span className="text-[11px] font-mono text-slate-500 tabular-nums w-12">
                        {selectedScene.duration.toFixed(1)}s
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={togglePlayPause}
                          className="w-9 h-9 rounded-lg bg-violet-600 hover:bg-violet-500 text-white flex items-center justify-center transition-colors cursor-pointer shadow-md shadow-violet-600/30"
                          aria-label={isPlaying ? 'Pause' : 'Play'}
                        >
                          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                        </button>

                        <button
                          onClick={() => {
                            setCurrentTime(0);
                            audioEngine.stopPlayback();
                            setIsPlaying(false);
                          }}
                          className="w-9 h-9 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
                          title="Rewind to start"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setLoop(!loop)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                            loop ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30' : 'text-slate-500 bg-white/[0.02]'
                          }`}
                        >
                          LOOP
                        </button>
                      </div>

                      <div className="flex items-center bg-[#131622] p-1 rounded-lg border border-white/[0.06] text-xs">
                        <button
                          onClick={() => setPlaybackMode('original')}
                          className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                            playbackMode === 'original'
                              ? 'bg-white/10 text-white font-semibold'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          Original Actor
                        </button>
                        <button
                          onClick={() => setPlaybackMode('revoiced')}
                          className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                            playbackMode === 'revoiced'
                              ? 'bg-violet-600 text-white font-semibold shadow-sm'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          Nolven Revoiced
                        </button>
                        <button
                          onClick={() => setPlaybackMode('ab-split')}
                          className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                            playbackMode === 'ab-split'
                              ? 'bg-sky-600 text-white font-semibold'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          A/B Audition
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setIsMuted(!isMuted)}
                          className="text-slate-400 hover:text-white"
                        >
                          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </button>
                        <input
                          type="range"
                          min={0}
                          max={1}
                          step={0.05}
                          value={isMuted ? 0 : volume}
                          onChange={(e) => {
                            setVolume(parseFloat(e.target.value));
                            setIsMuted(false);
                          }}
                          className="w-16 h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-violet-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 p-4 sm:p-6 bg-[#0E1017] flex flex-col justify-between space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 text-xs font-semibold text-white uppercase tracking-wider">
                        <Mic className="w-3.5 h-3.5 text-violet-400" />
                        <span>Personal Voice Calibration</span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-500">
                        48kHz · Lossless
                      </span>
                    </div>

                    <div className="p-3 bg-[#131622] border border-white/[0.08] rounded-xl mb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">{activeProfile.name}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300">
                              {activeProfile.type.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">{activeProfile.genderDescription}</p>
                        </div>

                        <div className="text-right font-mono text-[11px]">
                          <div className="text-violet-300 tabular-nums">F0 ~ {activeProfile.medianPitchHz} Hz</div>
                          <div className="text-slate-500 tabular-nums">HNR {(activeProfile.harmonicRatio * 100).toFixed(0)}%</div>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-400 mt-2 leading-relaxed border-t border-white/[0.04] pt-2">
                        {activeProfile.timbreDescription}
                      </p>

                      {activeProfile.audioBlobUrl && (
                        <div className="mt-2 pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs">
                          <span className="text-slate-400">Recorded Sample Audio:</span>
                          <audio controls src={activeProfile.audioBlobUrl} className="h-6 w-44" />
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-2">
                      {isRecording ? (
                        <button
                          onClick={stopRecordingVoice}
                          className="px-3 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 animate-pulse cursor-pointer shadow-lg shadow-red-600/30"
                        >
                          <MicOff className="w-3.5 h-3.5" />
                          <span>Stop ({recordingSeconds}s)</span>
                        </button>
                      ) : (
                        <button
                          onClick={startRecordingVoice}
                          className="px-3 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                        >
                          <Mic className="w-3.5 h-3.5" />
                          <span>Record Mic Sample</span>
                        </button>
                      )}

                      <label className="px-3 py-2 bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/[0.08] rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-colors">
                        <Upload className="w-3.5 h-3.5 text-slate-400" />
                        <span>Upload Audio</span>
                        <input
                          type="file"
                          accept="audio/*"
                          onChange={handleVoiceSampleUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {recordingError && (
                      <div className="mt-2 p-2 bg-red-950/30 border border-red-500/20 rounded text-[11px] text-red-300 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{recordingError}</span>
                      </div>
                    )}

                    <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-mono text-slate-500 mr-1">PRESETS:</span>
                      {voiceProfiles.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => setActiveProfile(p)}
                          className={`px-2 py-1 rounded text-[11px] transition-colors cursor-pointer ${
                            activeProfile.id === p.id
                              ? 'bg-violet-500/30 text-white border border-violet-500/50'
                              : 'text-slate-400 hover:text-white bg-white/[0.02]'
                          }`}
                        >
                          {p.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-white/[0.06] pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Sliders className="w-3.5 h-3.5 text-sky-400" />
                        <span>Segment Synchronization Engine</span>
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        LOCK: {cadenceStrictness}%
                      </span>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <div className="flex justify-between text-slate-400 mb-1">
                          <span>Cadence Lock Strictness</span>
                          <span className="font-mono text-violet-300">{cadenceStrictness}%</span>
                        </div>
                        <input
                          type="range"
                          min={80}
                          max={100}
                          value={cadenceStrictness}
                          onChange={(e) => setCadenceStrictness(parseInt(e.target.value))}
                          className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-violet-500"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-400 mb-1">
                          <span>Intonation / Pitch Shift</span>
                          <span className="font-mono text-violet-300">
                            {pitchOffset > 0 ? `+${pitchOffset}` : pitchOffset} st
                          </span>
                        </div>
                        <input
                          type="range"
                          min={-6}
                          max={6}
                          step={0.5}
                          value={pitchOffset}
                          onChange={(e) => setPitchOffset(parseFloat(e.target.value))}
                          className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-violet-500"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-400 mb-1">
                          <span>Breath & Pause Retention</span>
                          <span className="font-mono text-sky-300">{breathRetention}% ({selectedSegment.pauseAfterMs}ms lock)</span>
                        </div>
                        <input
                          type="range"
                          min={50}
                          max={100}
                          value={breathRetention}
                          onChange={(e) => setBreathRetention(parseInt(e.target.value))}
                          className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-sky-500"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => handleAuditionSegment(selectedSegment)}
                      className="mt-4 w-full py-2.5 bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 hover:text-white border border-violet-500/30 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <Headphones className="w-3.5 h-3.5" />
                      <span>Audition Active Segment Cadence</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6 bg-[#0B0D13]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Waves className="w-4 h-4 text-violet-400" />
                    <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
                      Dialogue Track Timeline & Micro-Cadence Segments
                    </h3>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">
                    Click segment to inspect alignment
                  </div>
                </div>

                <div className="relative h-6 border-b border-white/[0.08] mb-2 flex items-center text-[10px] font-mono text-slate-500">
                  {[0, 3, 6, 9, 12, 15, 18].map((sec) => (
                    <div
                      key={sec}
                      className="absolute"
                      style={{ left: `${(sec / selectedScene.duration) * 100}%` }}
                    >
                      <span>{sec}s</span>
                      <div className="w-px h-1.5 bg-slate-700 mt-0.5" />
                    </div>
                  ))}

                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-violet-400 z-20 pointer-events-none transition-all duration-75"
                    style={{ left: `${(currentTime / selectedScene.duration) * 100}%` }}
                  >
                    <div className="w-2.5 h-2.5 -ml-1 bg-violet-400 rounded-full shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
                  </div>
                </div>

                <div className="mb-2 p-2 bg-[#0E1119] rounded-lg border border-white/[0.04]">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                      <span>TRACK 01: ORIGINAL ACTOR ADR</span>
                    </span>
                    <span className="text-slate-500">LIP-SYNC REFERENCE</span>
                  </div>

                  <div className="relative h-12 bg-[#08090E] rounded border border-white/[0.04] overflow-hidden">
                    {selectedScene.dialogueSegments.map((seg) => {
                      const leftPercent = (seg.startTime / selectedScene.duration) * 100;
                      const widthPercent = ((seg.endTime - seg.startTime) / selectedScene.duration) * 100;
                      const isSelected = selectedSegment.id === seg.id;

                      return (
                        <div
                          key={seg.id}
                          onClick={() => handleAuditionSegment(seg)}
                          className={`absolute top-1 bottom-1 rounded px-2 py-1 cursor-pointer transition-all border ${
                            isSelected
                              ? 'bg-slate-700/80 border-slate-400 text-white shadow-md'
                              : 'bg-slate-800/60 border-slate-700/50 text-slate-300 hover:bg-slate-700/60'
                          }`}
                          style={{ left: `${leftPercent}%`, width: `${widthPercent}%` }}
                          title={seg.text}
                        >
                          <div className="text-[10px] font-mono truncate font-medium">
                            {seg.speaker}
                          </div>
                          <div className="text-[9px] truncate opacity-80">
                            "{seg.text}"
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="p-2 bg-[#0E1119] rounded-lg border border-violet-500/10">
                  <div className="flex items-center justify-between text-[11px] font-mono text-violet-300 mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-400"></span>
                      <span>TRACK 02: NOLVEN REVOICE ADAPTATION</span>
                    </span>
                    <span className="text-slate-400">ACTIVE PROFILE: {activeProfile.name}</span>
                  </div>

                  <div className="relative h-12 bg-[#08090E] rounded border border-white/[0.04] overflow-hidden">
                    {selectedScene.dialogueSegments.map((seg) => {
                      const leftPercent = (seg.startTime / selectedScene.duration) * 100;
                      const widthPercent = ((seg.endTime - seg.startTime) / selectedScene.duration) * 100;
                      const isSelected = selectedSegment.id === seg.id;

                      return (
                        <div
                          key={seg.id}
                          onClick={() => handleAuditionSegment(seg)}
                          className={`absolute top-1 bottom-1 rounded px-2 py-1 cursor-pointer transition-all border ${
                            isSelected
                              ? 'bg-violet-600/80 border-violet-300 text-white shadow-lg shadow-violet-600/30'
                              : 'bg-violet-950/50 border-violet-800/40 text-violet-200 hover:bg-violet-900/60'
                          }`}
                          style={{ left: `${leftPercent}%`, width: `${widthPercent}%` }}
                          title={seg.text}
                        >
                          <div className="text-[10px] font-mono truncate font-semibold flex items-center justify-between">
                            <span>{seg.emotionalTone}</span>
                            <span className="text-[9px] opacity-75">{seg.cadenceMatchScore}%</span>
                          </div>
                          <div className="text-[9px] truncate opacity-90">
                            {seg.text}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-4 p-4 bg-[#11141E] rounded-xl border border-white/[0.06] grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <div className="text-slate-500 font-mono text-[10px] mb-1">SELECTED SEGMENT LINE</div>
                    <div className="font-semibold text-white text-sm">"{selectedSegment.text}"</div>
                    <div className="text-slate-400 mt-1">Speaker: {selectedSegment.speaker}</div>
                  </div>

                  <div>
                    <div className="text-slate-500 font-mono text-[10px] mb-1">CADENCE & EMOTIONAL PROFILE</div>
                    <div className="text-violet-300 font-medium">{selectedSegment.emotionalTone}</div>
                    <div className="text-slate-400 mt-1">{selectedSegment.originalAudioCue}</div>
                  </div>

                  <div>
                    <div className="text-slate-500 font-mono text-[10px] mb-1">PHONEME TEMPORAL MAP</div>
                    <div className="flex flex-wrap gap-1">
                      {selectedSegment.phonemes.map((ph, idx) => (
                        <span key={idx} className="font-mono text-[10px] px-1.5 py-0.5 bg-white/[0.05] rounded text-slate-300">
                          /{ph}/
                        </span>
                      ))}
                    </div>
                    <div className="text-slate-500 text-[10px] font-mono mt-1">
                      Pause locked: {selectedSegment.pauseAfterMs}ms
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. HOW IT WORKS */}
        <section id="how-it-works" className="py-20 md:py-28 bg-[#08090C] border-b border-white/[0.06] relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-16">
              <div className="text-xs font-mono text-violet-400 uppercase tracking-wider mb-2">
                The Process
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight text-balance">
                How Nolven Revoice Works
              </h2>
              <p className="mt-4 text-base text-slate-300/80 leading-relaxed">
                Recreating dialogue in a personal voice requires honoring every micro-pause, emotional accent, and physical breath of the original performance. Here is the four-step adaptation pipeline.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  step: '01',
                  title: 'Choose an Authorized Video',
                  subtitle: 'Verified Ownership or Permission',
                  icon: Film,
                  description:
                    'Select footage you own, created, or have explicit legal permission to adapt. Nolven Revoice is built exclusively for authorized video content, independent creators, and licensed productions.',
                  highlight: 'Strict rights verification & zero unlicensed media',
                },
                {
                  step: '02',
                  title: 'Provide Your Voice Sample',
                  subtitle: 'Acoustic Calibration Capture',
                  icon: Mic,
                  description:
                    'Record a 15–30 second neutral voice sample using your microphone, or upload a clean lossless audio file. The engine calibrates fundamental pitch, formant geometry, and vocal resonance.',
                  highlight: 'Lossless audio mapping · Zero voice cloning without consent',
                },
                {
                  step: '03',
                  title: 'Analyze Scene Dynamics',
                  subtitle: 'Phonemes, Timing & Delivery',
                  icon: Cpu,
                  description:
                    'The system evaluates the original performance frame by frame: tracking syllable durations, natural pauses, breath intakes, and emotional inflection curves to lock timing.',
                  highlight: 'Sub-frame synchronization & emotional cadence modeling',
                },
                {
                  step: '04',
                  title: 'Preview and Refine Delivery',
                  subtitle: 'Acoustic Convolving & Stems',
                  icon: SlidersHorizontal,
                  description:
                    'Audition the adapted voice track synchronized to the scene. Fine-tune cadence strictness, match room acoustic reflections, and export isolated dialogue stems when engine support is active.',
                  highlight: 'Director-grade A/B auditioning & stem management',
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.step}
                    className="group relative p-6 sm:p-7 bg-[#0E1017] border border-white/[0.07] hover:border-violet-500/40 rounded-2xl transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <span className="font-mono text-2xl font-bold text-violet-400/80 group-hover:text-violet-300 transition-colors">
                          {item.step}
                        </span>
                        <div className="w-10 h-10 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400 group-hover:scale-105 transition-transform">
                          <Icon className="w-5 h-5" />
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-white mb-1 group-hover:text-violet-100 transition-colors">
                        {item.title}
                      </h3>
                      <div className="text-xs font-mono text-slate-500 mb-3">
                        {item.subtitle}
                      </div>

                      <p className="text-sm text-slate-300/80 leading-relaxed mb-4">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/[0.05] text-xs text-violet-300/90 font-medium flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                      <span>{item.highlight}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 p-4 bg-[#0E1119] border border-white/[0.06] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-violet-400 shrink-0"></span>
                <span className="text-slate-300 font-medium">Consent-First Architecture:</span>
                <span>All voice profiles require verified cryptographic authorization before enrollment.</span>
              </div>
              <span className="text-slate-500 font-mono text-[11px]">
                ISO/IEC 27001 AUDITED PROCEDURES (PLANNED)
              </span>
            </div>
          </div>
        </section>

        {/* 5. PRODUCT CAPABILITIES */}
        <section id="capabilities" className="py-20 md:py-28 bg-[#0A0C11] border-b border-white/[0.06] relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-16">
              <div className="text-xs font-mono text-violet-400 uppercase tracking-wider mb-2">
                Engineering & Product Goals
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight text-balance">
                Cinematic Audio Capabilities
              </h2>
              <p className="mt-4 text-base text-slate-300/80 leading-relaxed">
                Revoice is architected around audio physics, emotional fidelity, and cinematic precision. Planned capabilities represent our ongoing research milestones.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-7 p-7 sm:p-8 bg-[#0E1017] border border-white/[0.07] rounded-2xl flex flex-col justify-between group hover:border-violet-500/40 transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                      <Mic className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-white/[0.04] text-slate-400 border border-white/[0.06]">
                      CORE ARCHITECTURE
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                    Personal Voice Adaptation
                  </h3>
                  <p className="text-sm text-slate-300/80 leading-relaxed max-w-xl">
                    Acoustic identity is more than a pitch shift. Our modeling pipeline maps the user's vocal tract morphology, natural harmonic envelope, and chest resonance from a short calibration recording, reproducing dialogue while preserving their authentic timbre.
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-white/[0.06] grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <div className="font-mono text-slate-500">SAMPLE NEEDED</div>
                    <div className="font-semibold text-white mt-1">15–30 Seconds</div>
                  </div>
                  <div>
                    <div className="font-mono text-slate-500">FIDELITY TARGET</div>
                    <div className="font-semibold text-white mt-1">48kHz Lossless</div>
                  </div>
                  <div>
                    <div className="font-mono text-slate-500">CONSENT GATE</div>
                    <div className="font-semibold text-violet-400 mt-1">Mandatory</div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-5 p-7 sm:p-8 bg-[#0E1017] border border-white/[0.07] rounded-2xl flex flex-col justify-between group hover:border-violet-500/40 transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-sky-600/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                      <Clock className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-white/[0.04] text-slate-400 border border-white/[0.06]">
                      SUB-FRAME PRECISION
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Dialogue Timing & Scene Sync
                  </h3>
                  <p className="text-sm text-slate-300/80 leading-relaxed">
                    Lip-sync is unforgiving. Revoice locks syllable attacks, vowel holds, and dramatic silent beats to the on-screen actor's temporal boundaries down to fractions of a frame.
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>TEMPORAL JITTER</span>
                  <span className="text-sky-300 font-semibold">&lt; 8 milliseconds</span>
                </div>
              </div>

              <div className="md:col-span-5 p-7 sm:p-8 bg-[#0E1017] border border-violet-500/20 rounded-2xl flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                      DEVELOPMENT GOAL
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Emotion-Aware Delivery
                  </h3>
                  <p className="text-sm text-slate-300/80 leading-relaxed">
                    Flat synthetic speech ruins dramatic immersion. We are researching neural models capable of sensing whisper tension, vocal fry, sobbing cadences, and rising panic—mapping the emotional charge directly to the adapted voice.
                  </p>
                </div>

                <div className="mt-6 p-3 bg-violet-950/30 rounded-xl border border-violet-500/20 text-xs text-violet-300">
                  Status: Active research benchmark. Evaluated via blind director listening panels.
                </div>
              </div>

              <div className="md:col-span-7 relative rounded-2xl overflow-hidden border border-white/[0.07] bg-[#0E1017] group hover:border-violet-500/40 transition-colors">
                <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-30 transition-opacity">
                  <img
                    src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80"
                    alt="Professional audio mastering workstation"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0E1017] via-[#0E1017]/80 to-transparent" />
                </div>

                <div className="relative z-10 p-7 sm:p-8 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                        <Sliders className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-white/[0.04] text-slate-400 border border-white/[0.06]">
                        STUDIO PIPELINE
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                      Acoustic Preview & Room Convolving
                    </h3>
                    <p className="text-sm text-slate-300/80 leading-relaxed max-w-lg">
                      Dialogue must inhabit its environment. Revoice is being designed to extract the room impulse response (RIR) from production audio—matching reverb, early reflections, and microphone proximity effect.
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-2">
                      <Waves className="w-4 h-4 text-violet-400" />
                      <span>Dolby Atmos & 5.1 Stem Compatibility Target</span>
                    </span>
                    <span className="font-mono text-slate-500">24-BIT / 96k READY</span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-12 p-6 sm:p-7 bg-[#0E1017] border border-white/[0.07] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 group">
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-sky-600/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-bold text-white">
                        Potential Multilingual Adaptation
                      </h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20">
                        EXPLORATORY GOAL
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300/80 mt-1 max-w-3xl">
                      Exploring cross-lingual phoneme transfer where a user's vocal timbre can speak alternate languages while preserving the original dramatic pacing and emotional subtext, only where supported by licensing and consent.
                    </p>
                  </div>
                </div>

                <div className="text-xs font-mono text-slate-500 shrink-0">
                  PHASE 2 ROADMAP INITIATIVE
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. USE CASES */}
        <section id="use-cases" className="py-20 md:py-28 bg-[#08090C] border-b border-white/[0.06] relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-16">
              <div className="text-xs font-mono text-violet-400 uppercase tracking-wider mb-2">
                Target Applications
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight text-balance">
                Where Personal Voice Transforms Video
              </h2>
              <p className="mt-4 text-base text-slate-300/80 leading-relaxed">
                By pairing timing-locked delivery with explicit voice consent, Nolven Revoice unlocks new creative avenues for independent creators, storytellers, and authorized media producers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  id: 'indie-film',
                  title: 'Independent Filmmaking & Scratch ADR',
                  icon: Clapperboard,
                  tag: 'CREATIVE PRODUCTION',
                  summary:
                    'Indie directors and writers can audition dialogue rewrites, test pacing, and produce temporary scratch ADR in the intended vocal register without scheduling expensive studio booth sessions.',
                  benefit: 'Accelerates editing cuts and early director pitch reels.',
                  sceneCue: 'Testing alternate character cadences before picture lock.',
                },
                {
                  id: 'personal-remix',
                  title: 'Personal Video Remixes & Creator Memories',
                  icon: Film,
                  tag: 'PERSONAL CREATION',
                  summary:
                    'Transform home videos, licensed short films, and self-produced YouTube narratives by voicing the characters yourself, creating entertaining, humorous, or deeply personal retellings.',
                  benefit: 'Expressive personal storytelling for authorized creator media.',
                  sceneCue: 'Re-voicing travel logs, skits, and personal video journals.',
                },
                {
                  id: 'authorized-dub',
                  title: 'Authorized Dubbing & Localization',
                  icon: Globe2,
                  tag: 'ETHICAL LOCALIZATION',
                  summary:
                    'Content creators and global educators can release authorized foreign-language versions of their own material where their voice and cadence remain identifiable across territories.',
                  benefit: 'Retains creator vocal identity across translated formats.',
                  sceneCue: 'Educational webinars, documentary narration, and masterclasses.',
                },
                {
                  id: 'accessible-media',
                  title: 'Accessible & Personalized Media Experiences',
                  icon: HeartHandshake,
                  tag: 'ASSISTIVE TECHNOLOGY',
                  summary:
                    'Enabling family members, caregivers, and individuals with speech impairments to narrate educational books, family media, and accessible video narratives in a familiar, comforting voice.',
                  benefit: 'Brings emotional warmth to assistive reading and narration.',
                  sceneCue: 'Children’s storybook narration in a deployed parent’s voice.',
                },
              ].map((c) => {
                const Icon = c.icon;
                return (
                  <div
                    key={c.id}
                    onClick={() => scrollTo('interactive-workspace')}
                    className="p-7 sm:p-8 bg-[#0E1017] border border-white/[0.07] hover:border-violet-500/40 rounded-2xl transition-all duration-300 flex flex-col justify-between group cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-5">
                        <div className="w-10 h-10 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400 group-hover:scale-105 transition-transform">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-mono tracking-wider text-slate-400 px-2 py-0.5 rounded bg-white/[0.03]">
                          {c.tag}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-violet-200 transition-colors">
                        {c.title}
                      </h3>

                      <p className="text-sm text-slate-300/85 leading-relaxed mb-6">
                        {c.summary}
                      </p>
                    </div>

                    <div className="pt-5 border-t border-white/[0.05] space-y-2">
                      <div className="text-xs text-slate-400 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400/80"></span>
                        <span className="text-slate-300 font-medium">Outcome:</span>
                        <span>{c.benefit}</span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-500">
                        Scenario: {c.sceneCue}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 text-center text-xs text-slate-500">
              Independent technology research prototype. Nolven Studio does not claim endorsements or partnerships with major Hollywood studios or SAG-AFTRA performers.
            </div>
          </div>
        </section>

        {/* 7. VISION & ETHICAL CHARTER */}
        <section id="ethical-charter" className="py-20 md:py-28 bg-[#0A0C11] border-b border-white/[0.06] relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-16">
              <div className="text-xs font-mono text-violet-400 uppercase tracking-wider mb-2">
                Philosophy & Governance
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight text-balance">
                A More Personal Way to Experience Stories.
              </h2>
              <p className="mt-4 text-base text-slate-300/80 leading-relaxed">
                Stories have always been told around hearths in the voices of people we know. Our vision is to let audiences and creators experience authorized video narratives through a voice that feels deeply personal to them—grounded in absolute respect for artist rights and consent.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 bg-[#0E1017] border border-white/[0.07] rounded-xl flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-4">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">
                    Cryptographic Consent
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300/80 leading-relaxed">
                    We will never permit the cloning or adaptation of any individual's voice without verifiable, cryptographic identity attestation. No public scraping. No third-party spoofing.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/[0.05] text-[11px] font-mono text-violet-300">
                  ZERO-COMPROMISE VOICE GATE
                </div>
              </div>

              <div className="p-6 bg-[#0E1017] border border-white/[0.07] rounded-xl flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-sky-600/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-4">
                    <Award className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">
                    Honoring Performers
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300/80 leading-relaxed">
                    Acting is human artistry. Revoice is architected as an assistive creative tool for personal storytelling and authorized production, not an exploitative replacement for professional actors.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/[0.05] text-[11px] font-mono text-sky-300">
                  ARTIST-FIRST PRINCIPLE
                </div>
              </div>

              <div className="p-6 bg-[#0E1017] border border-white/[0.07] rounded-xl flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-4">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">
                    Authorized Video Content
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300/80 leading-relaxed">
                    Our tools require proof of copyright or explicit distribution rights. We do not support stripping, remounting, or altering commercial theatrical releases without studio license.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/[0.05] text-[11px] font-mono text-violet-300">
                  COPYRIGHT COMPLIANCE
                </div>
              </div>

              <div className="p-6 bg-[#0E1017] border border-white/[0.07] rounded-xl flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">
                    C2PA Audio Provenance
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300/80 leading-relaxed">
                    All future synthesized audio stems will embed cryptographic C2PA metadata and inaudible psychoacoustic watermarking to ensure total transparency and forensic tracking.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/[0.05] text-[11px] font-mono text-emerald-300">
                  WATERMARKED INTEGRITY
                </div>
              </div>
            </div>

            <div className="mt-14 p-8 bg-[#0E1119] border border-white/[0.08] rounded-2xl relative overflow-hidden">
              <div className="max-w-3xl">
                <p className="text-base sm:text-lg text-slate-200 italic font-medium leading-relaxed">
                  "The voice carries intimate emotional weight. We believe the future of generative media must be defined by consent, craftsmanship, and humility—building tools that respect creators rather than hollow out their work."
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <span className="text-sm font-semibold text-white">Nolven Studio</span>
                  <span className="text-slate-500">·</span>
                  <span className="text-xs font-mono text-violet-400">FOUNDING RESEARCH PRINCIPLES</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 8. COMPREHENSIVE FAQ */}
        <section id="faq" className="py-20 md:py-28 bg-[#08090C] border-b border-white/[0.06] relative">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-14 text-center">
              <div className="text-xs font-mono text-violet-400 uppercase tracking-wider mb-2">
                Transparency & Clarity
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Frequently Answered Questions
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
                Honest answers regarding our technology status, data privacy standards, and creative philosophy.
              </p>
            </div>

            <div className="space-y-3.5">
              {faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={index}
                    className="bg-[#0E1017] border border-white/[0.07] rounded-xl overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className="w-full px-5 py-4 sm:px-6 sm:py-5 text-left flex items-center justify-between gap-4 cursor-pointer focus-visible:outline-2 focus-visible:outline-violet-400"
                      aria-expanded={isOpen}
                    >
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-mono text-violet-400 tracking-wider block mb-1">
                          {faq.category}
                        </span>
                        <span className="text-base font-semibold text-white">
                          {faq.question}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-400 transition-transform duration-200 shrink-0 ${
                          isOpen ? 'rotate-180 text-violet-300' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-sm text-slate-300/85 leading-relaxed border-t border-white/[0.04] pt-4 animate-in fade-in duration-150">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

      </main>

      {/* 9. FINAL CALLOUT & FOOTER */}
      <footer className="bg-[#06070A] text-slate-400 border-t border-white/[0.08] relative overflow-hidden">
        <div className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-white/[0.06] text-center relative">
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-violet-600/10 blur-[130px] rounded-full pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <div className="text-xs font-mono text-violet-400 uppercase tracking-wider">
              Nolven Revoice
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight text-balance leading-tight">
              The Next Voice You Hear Could Be Yours.
            </h2>

            <p className="text-base sm:text-lg text-slate-300/80 max-w-xl mx-auto leading-relaxed">
              Experience dialogue synchronization, cadence analysis, and acoustic calibration through our interactive prototype.
            </p>

            <div className="pt-4 flex items-center justify-center gap-4">
              <button
                onClick={() => scrollTo('interactive-workspace')}
                className="px-6 py-3.5 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-500 rounded-lg transition-all duration-200 shadow-[0_0_30px_-5px_rgba(139,92,246,0.5)] flex items-center gap-2 cursor-pointer focus-visible:outline-2 focus-visible:outline-violet-400"
              >
                <span>Explore the Concept</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-5 space-y-3">
              <div className="flex items-center gap-2 text-white font-bold text-lg">
                <span className="w-2.5 h-2.5 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.6)]"></span>
                <span>Nolven Studio</span>
                <span className="text-xs font-normal text-slate-500 tracking-normal ml-1">Revoice</span>
              </div>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                AI-assisted personal voice adaptation for authorized video dialogue. Designed for creators, independent directors, and personal media preservation.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs text-slate-300">
                <Mail className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                <a 
                  href="mailto:founder@nolven.studio" 
                  className="hover:text-white transition-colors underline decoration-slate-600 underline-offset-4"
                >
                  founder@nolven.studio
                </a>
              </div>
            </div>

            <div className="md:col-span-3 space-y-2 text-xs">
              <div className="font-mono text-slate-500 uppercase tracking-wider mb-2">
                Exploration
              </div>
              <div>
                <button onClick={() => scrollTo('interactive-workspace')} className="hover:text-white transition-colors block py-1 cursor-pointer">
                  Studio Workspace
                </button>
              </div>
              <div>
                <button onClick={() => scrollTo('how-it-works')} className="hover:text-white transition-colors block py-1 cursor-pointer">
                  Four-Step Workflow
                </button>
              </div>
              <div>
                <button onClick={() => scrollTo('capabilities')} className="hover:text-white transition-colors block py-1 cursor-pointer">
                  Acoustic Capabilities
                </button>
              </div>
              <div>
                <button onClick={() => scrollTo('use-cases')} className="hover:text-white transition-colors block py-1 cursor-pointer">
                  Target Applications
                </button>
              </div>
            </div>

            <div className="md:col-span-4 space-y-2 text-xs">
              <div className="font-mono text-slate-500 uppercase tracking-wider mb-2">
                Commitments
              </div>
              <div>
                <button onClick={() => scrollTo('ethical-charter')} className="hover:text-white transition-colors block py-1 cursor-pointer">
                  Ethical Voice Consent Charter
                </button>
              </div>
              <div>
                <span className="text-slate-400 block py-1">
                  C2PA Provenance & Watermarking Standard
                </span>
              </div>
              <div className="pt-2 text-[11px] text-slate-500">
                Nolven Studio is an independent early-stage product research project. No affiliation with major studios or union performers.
              </div>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              © {new Date().getFullYear()} Nolven Studio. All rights reserved.
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
              <a href="#ethical-charter" className="hover:text-slate-400 transition-colors">Voice Ethics</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Workflow Explainer Modal */}
      <WorkflowModal
        isOpen={isWorkflowModalOpen}
        onClose={() => setIsWorkflowModalOpen(false)}
        onStartDemo={() => {
          handleAuditionSegment(selectedScene.dialogueSegments[0]);
          scrollTo('interactive-workspace');
        }}
      />
    </div>
  );
}
