import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Sliders, 
  Activity, 
  Sun, 
  Wind, 
  Zap, 
  Layers, 
  Cpu, 
  Compass,
  Gauge
} from 'lucide-react';
import { VisualProject } from '../types';

interface InteractiveSimulationsProps {
  project: VisualProject;
  isDarkMode: boolean;
}

export const InteractiveSimulations: React.FC<InteractiveSimulationsProps> = ({
  project,
  isDarkMode,
}) => {
  const simulationType = project.simulationConfig?.type || (
    project.educationTier === 'school' ? 'cycle' : project.educationTier === 'research' ? 'network' : 'wave'
  );

  // --- WAVE SIMULATION STATE (Physics / EM Waves) ---
  const [waveFrequency, setWaveFrequency] = useState<number>(3);
  const [waveAmplitude, setWaveAmplitude] = useState<number>(50);
  const [waveWavelength, setWaveWavelength] = useState<number>(120);
  const [isWaveRunning, setIsWaveRunning] = useState<boolean>(true);
  const waveCanvasRef = useRef<HTMLCanvasElement>(null);
  const wavePhaseRef = useRef<number>(0);

  // --- PHOTOSYNTHESIS CYCLE STATE (Biology / Science) ---
  const [lightIntensity, setLightIntensity] = useState<number>(75);
  const [co2Level, setCo2Level] = useState<number>(400);
  const [temperature, setTemperature] = useState<number>(25);

  // --- TRANSFORMER ATTENTION STATE (ML / Research) ---
  const [activeHead, setActiveHead] = useState<number>(1);
  const [attnTemp, setAttnTemp] = useState<number>(1.0);
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number; val: number } | null>(null);

  // Animation Loop for EM Wave Canvas
  useEffect(() => {
    if (simulationType !== 'wave') return;
    const canvas = waveCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;
      const originX = 60;
      const originY = h / 2;
      const length = w - 120;

      // Draw Propagation Z-Axis (Center horizontal line)
      ctx.strokeStyle = isDarkMode ? '#475569' : '#94a3b8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.lineTo(originX + length, originY);
      ctx.stroke();

      // Axis label
      ctx.fillStyle = isDarkMode ? '#94a3b8' : '#64748b';
      ctx.font = '11px monospace';
      ctx.fillText('+z (Direction of propagation c)', originX + length - 180, originY + 24);

      const step = 4;
      const k = (2 * Math.PI) / waveWavelength;
      const omega = waveFrequency * 0.05;

      if (isWaveRunning) {
        wavePhaseRef.current += omega;
      }
      const phase = wavePhaseRef.current;

      // Draw E-field vectors (Vertical Red/Pink sinusoidal wave)
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let x = 0; x <= length; x += step) {
        const eVal = waveAmplitude * Math.sin(k * x - phase);
        const px = originX + x;
        const py = originY - eVal;
        if (x === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Draw individual vertical field vectors
      for (let x = 0; x <= length; x += 24) {
        const eVal = waveAmplitude * Math.sin(k * x - phase);
        const px = originX + x;
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(px, originY);
        ctx.lineTo(px, originY - eVal);
        ctx.stroke();
      }

      // Draw B-field vectors (Horizontal Blue sinusoidal wave with 3D oblique slant)
      ctx.strokeStyle = '#0ea5e9';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let x = 0; x <= length; x += step) {
        const bVal = (waveAmplitude * 0.7) * Math.sin(k * x - phase);
        const px = originX + x + bVal * 0.6;
        const py = originY + bVal * 0.35;
        if (x === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Draw horizontal field vectors
      for (let x = 0; x <= length; x += 24) {
        const bVal = (waveAmplitude * 0.7) * Math.sin(k * x - phase);
        const px = originX + x;
        ctx.strokeStyle = 'rgba(14, 165, 233, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(px, originY);
        ctx.lineTo(px + bVal * 0.6, originY + bVal * 0.35);
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [simulationType, waveFrequency, waveAmplitude, waveWavelength, isWaveRunning, isDarkMode]);

  // Attention matrix tokens
  const tokens = ['[CLS]', 'photon', 'excites', 'chlorophyll', 'electron', 'carrier', 'ATP', '[SEP]'];

  // Calculate synthetic attention scores for head
  const getAttentionScore = (i: number, j: number) => {
    // Generate deterministic values based on token distance, head index, and temperature
    const base = Math.cos((i * 1.3 - j * 1.7) + activeHead) * 1.5;
    const expVal = Math.exp(base / attnTemp);
    return Math.min(Math.max(expVal / (expVal + 2.5), 0.02), 0.98);
  };

  // Photosynthesis calculated yields
  const o2Rate = Math.round((lightIntensity * 0.6 + co2Level * 0.05) * (temperature > 10 && temperature < 40 ? 1 : 0.4));
  const glucoseYield = Math.round((o2Rate * 0.85));

  return (
    <div className="h-full flex flex-col p-4 sm:p-6 max-w-5xl mx-auto overflow-y-auto">
      
      {/* Simulation Title Header */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-1.5">
            <Activity className="w-4 h-4" />
            <span>Interactive Theoretical Laboratory</span>
          </span>
          <h2 className="text-xl font-bold text-slate-100">
            {simulationType === 'wave' && 'Electromagnetic Transverse Wave Dynamics'}
            {simulationType === 'cycle' && 'Chloroplast Light & Calvin Cycle Factory'}
            {simulationType === 'network' && 'Transformer Multi-Head Attention Manifold'}
          </h2>
        </div>

        {/* Simulator Type Badges */}
        <div className="flex items-center gap-1.5 bg-slate-800/60 p-1 rounded-xl border border-slate-700/60 text-xs">
          <span className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-semibold">
            {simulationType.toUpperCase()}
          </span>
          <span className="text-slate-400 text-xs px-2">Real-time parameters</span>
        </div>
      </div>

      {/* --- SIMULATION 1: EM WAVE OSCILLATOR --- */}
      {simulationType === 'wave' && (
        <div className="space-y-4">
          <div className="relative rounded-2xl border bg-slate-950 border-slate-800 p-4 overflow-hidden shadow-2xl">
            {/* Legend Overlay */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-3 text-xs bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700">
              <div className="flex items-center gap-1.5 font-bold text-red-400">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span>Electric Field (E)</span>
              </div>
              <div className="flex items-center gap-1.5 font-bold text-sky-400">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                <span>Magnetic Field (B)</span>
              </div>
              <div className="text-slate-400 font-mono text-[11px]">
                E ⟂ B ⟂ z
              </div>
            </div>

            <canvas
              ref={waveCanvasRef}
              width={800}
              height={320}
              className="w-full h-[280px] sm:h-[320px] rounded-xl"
            />
          </div>

          {/* Controls Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 rounded-xl border bg-slate-900/80 border-slate-800 text-xs text-slate-200">
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Frequency (f):</span>
                <span className="font-mono text-indigo-400">{waveFrequency} Hz</span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                step="0.5"
                value={waveFrequency}
                onChange={e => setWaveFrequency(parseFloat(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Wavelength (λ):</span>
                <span className="font-mono text-indigo-400">{waveWavelength} nm</span>
              </div>
              <input
                type="range"
                min="60"
                max="240"
                step="10"
                value={waveWavelength}
                onChange={e => setWaveWavelength(parseInt(e.target.value, 10))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Amplitude (E0):</span>
                <span className="font-mono text-indigo-400">{waveAmplitude} V/m</span>
              </div>
              <input
                type="range"
                min="20"
                max="80"
                step="5"
                value={waveAmplitude}
                onChange={e => setWaveAmplitude(parseInt(e.target.value, 10))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={() => setIsWaveRunning(!isWaveRunning)}
                className={`w-full py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
                  isWaveRunning
                    ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                    : 'bg-indigo-600 text-white hover:bg-indigo-500'
                }`}
              >
                {isWaveRunning ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isWaveRunning ? 'Pause Oscillation' : 'Resume Oscillation'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- SIMULATION 2: PHOTOSYNTHESIS BIOCHEMICAL CYCLE --- */}
      {simulationType === 'cycle' && (
        <div className="space-y-4">
          <div className="rounded-2xl border bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/30 border-slate-800 p-6 shadow-2xl relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              
              {/* Animated Schematic Representation */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/30 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="w-32 h-32 rounded-full border-4 border-dashed border-emerald-400/60 flex items-center justify-center animate-spin" style={{ animationDuration: `${Math.max(2, 10 - lightIntensity / 10)}s` }}>
                  <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex flex-col items-center justify-center">
                    <span className="text-[10px] font-extrabold uppercase text-emerald-300">Calvin</span>
                    <span className="text-xs font-bold text-white">Cycle</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-around w-full text-xs">
                  <div className="flex items-center gap-1 text-amber-300">
                    <Sun className="w-4 h-4" />
                    <span>Photon Flux</span>
                  </div>
                  <div className="flex items-center gap-1 text-sky-300">
                    <Wind className="w-4 h-4" />
                    <span>CO2 Fixation</span>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-300">
                    <Zap className="w-4 h-4" />
                    <span>ATP + NADPH</span>
                  </div>
                </div>
              </div>

              {/* Output Yields */}
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-semibold text-slate-400 uppercase">Oxygen (O2) Evolution Rate</div>
                    <div className="text-2xl font-extrabold text-emerald-400">{o2Rate} <span className="text-xs font-normal text-slate-400">μmol / m² / s</span></div>
                  </div>
                  <Gauge className="w-7 h-7 text-emerald-400" />
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-semibold text-slate-400 uppercase">Net Glucose Synthesis Yield</div>
                    <div className="text-2xl font-extrabold text-amber-400">{glucoseYield} <span className="text-xs font-normal text-slate-400">mg / hr</span></div>
                  </div>
                  <Sun className="w-7 h-7 text-amber-400" />
                </div>
              </div>

            </div>
          </div>

          {/* Environmental Parameter Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl border bg-slate-900/80 border-slate-800 text-xs text-slate-200">
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Light Intensity:</span>
                <span className="font-mono text-emerald-400">{lightIntensity}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={lightIntensity}
                onChange={e => setLightIntensity(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>CO2 Concentration:</span>
                <span className="font-mono text-emerald-400">{co2Level} ppm</span>
              </div>
              <input
                type="range"
                min="200"
                max="800"
                step="25"
                value={co2Level}
                onChange={e => setCo2Level(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Temperature:</span>
                <span className="font-mono text-emerald-400">{temperature}°C</span>
              </div>
              <input
                type="range"
                min="5"
                max="45"
                value={temperature}
                onChange={e => setTemperature(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* --- SIMULATION 3: TRANSFORMER ATTENTION MATRIX --- */}
      {simulationType === 'network' && (
        <div className="space-y-4">
          <div className="rounded-2xl border bg-slate-950 border-slate-800 p-6 shadow-2xl">
            {/* Attention Head Selector */}
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400">Attention Head:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(h => (
                    <button
                      key={h}
                      onClick={() => setActiveHead(h)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                        activeHead === h
                          ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      H{h}
                    </button>
                  ))}
                </div>
              </div>

              {/* Temperature Slider */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">Softmax Temp:</span>
                <input
                  type="range"
                  min="0.4"
                  max="2.0"
                  step="0.1"
                  value={attnTemp}
                  onChange={e => setAttnTemp(parseFloat(e.target.value))}
                  className="w-24 accent-purple-500"
                />
                <span className="font-mono text-purple-400">{attnTemp.toFixed(1)}</span>
              </div>
            </div>

            {/* Heatmap Grid */}
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full">
                {/* Header Row (Keys) */}
                <div className="flex items-center ml-24 mb-1">
                  {tokens.map((tok, j) => (
                    <div key={j} className="w-12 text-center text-[10px] font-mono text-slate-400 truncate px-1">
                      {tok}
                    </div>
                  ))}
                </div>

                {/* Rows (Queries) */}
                {tokens.map((qTok, i) => (
                  <div key={i} className="flex items-center mb-1">
                    <div className="w-24 text-right pr-3 text-[11px] font-mono text-slate-300 truncate">
                      {qTok}
                    </div>
                    {tokens.map((kTok, j) => {
                      const score = getAttentionScore(i, j);
                      return (
                        <div
                          key={j}
                          onMouseEnter={() => setHoveredCell({ row: i, col: j, val: score })}
                          onMouseLeave={() => setHoveredCell(null)}
                          style={{
                            backgroundColor: `rgba(168, 85, 247, ${score})`,
                          }}
                          className="w-12 h-9 rounded-md border border-slate-900 flex items-center justify-center text-[10px] font-mono font-bold text-white transition-all cursor-crosshair hover:ring-2 hover:ring-white z-10"
                        >
                          {score.toFixed(2)}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Hovered Cell Inspector */}
            {hoveredCell && (
              <div className="mt-4 p-3 rounded-xl bg-slate-900 border border-purple-500/30 text-xs text-slate-200 flex items-center justify-between">
                <span>
                  Query: <strong className="text-white font-mono">{tokens[hoveredCell.row]}</strong> ➔ Key: <strong className="text-white font-mono">{tokens[hoveredCell.col]}</strong>
                </span>
                <span className="font-mono text-purple-300 font-bold">
                  Weight α = {hoveredCell.val.toFixed(4)} (Softmax probability)
                </span>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
