import React, { useState } from 'react';
import { 
  Compass, 
  Sparkles, 
  GraduationCap, 
  Atom, 
  ArrowRight, 
  Search, 
  Upload, 
  BookOpen, 
  GitFork, 
  Layers, 
  Activity, 
  Calculator, 
  Award, 
  HelpCircle, 
  Volume2, 
  Languages, 
  Share2, 
  Printer, 
  Check, 
  ChevronRight,
  Bookmark,
  History,
  FileText
} from 'lucide-react';
import { EducationTier, SupportedLanguage, VisualProject } from '../types';
import { CURRICULUM_SUBJECTS, SHOWCASE_PROJECTS } from '../data/presetCurriculum';
import { UI_TRANSLATIONS } from '../data/translations';
import { KaTeXView } from './KaTeXView';

interface HomePageProps {
  onLaunchTopic: (topic: string, tier: EducationTier, subject: string) => void;
  onOpenWorkspace: () => void;
  onOpenUploadModal: () => void;
  onOpenPdfModal: () => void;
  isDarkMode: boolean;
  language: SupportedLanguage;
}

export const HomePage: React.FC<HomePageProps> = ({
  onLaunchTopic,
  onOpenWorkspace,
  onOpenUploadModal,
  onOpenPdfModal,
  isDarkMode,
  language,
}) => {
  const [heroSearch, setHeroSearch] = useState('');
  const [heroTier, setHeroTier] = useState<EducationTier>('college');
  const [activeCurriculumTier, setActiveCurriculumTier] = useState<EducationTier>('school');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('school-science-bio');

  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  // Filter subjects for the selected curriculum tier
  const tierSubjects = CURRICULUM_SUBJECTS.filter(s => s.tier === activeCurriculumTier);
  const currentSubject = CURRICULUM_SUBJECTS.find(s => s.id === selectedSubjectId) || tierSubjects[0];

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroSearch.trim()) return;
    const defaultSubject = heroTier === 'school' ? 'Science (Biology)' : heroTier === 'research' ? 'Advanced Machine Learning' : 'STEM: Physics';
    onLaunchTopic(heroSearch.trim(), heroTier, defaultSubject);
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-12 pb-20 overflow-hidden border-b border-slate-800/60">
        
        {/* Subtle Architectural Blueprint Grid Background */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-25"
          style={{
            backgroundImage: isDarkMode 
              ? 'radial-gradient(circle, #6366f1 1px, transparent 1px)' 
              : 'radial-gradient(circle, #94a3b8 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Eyebrow / Kicker */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-4 tracking-wide">
            <span className="text-indigo-400 font-bold uppercase">TheoryVisualizer</span>
            <span aria-hidden="true">·</span>
            <span>Cognitive Curriculum Intelligence</span>
            <span aria-hidden="true">·</span>
            <span>Version 2.4</span>
          </div>

          {/* Main Hero Headline */}
          <div className="max-w-4xl">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] mb-6">
              Deconstruct complex educational theories into{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-emerald-400 bg-clip-text text-transparent">
                living visual systems.
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl mb-8 font-normal">
              Transform textbooks, mathematical proofs, and scientific research into interactive directed acyclic graphs (DAGs), 3D physical simulations, KaTeX derivations, and spaced-repetition memory models engineered precisely for your cognitive level.
            </p>
          </div>

          {/* Interactive Fast-Launch Search Console */}
          <div className="max-w-3xl mb-8">
            <form 
              onSubmit={handleHeroSubmit}
              className={`p-2.5 rounded-2xl border shadow-2xl transition-all ${
                isDarkMode 
                  ? 'bg-slate-900/90 border-slate-700/80 focus-within:border-indigo-500' 
                  : 'bg-white border-slate-300 shadow-md focus-within:border-indigo-600'
              }`}
            >
              {/* Audience Tier Filter Buttons */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-950/60 rounded-xl mb-2 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setHeroTier('school')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    heroTier === 'school'
                      ? 'bg-emerald-500 text-white font-bold shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>School (K–10)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setHeroTier('college')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    heroTier === 'college'
                      ? 'bg-indigo-600 text-white font-bold shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>College & Competitive</span>
                </button>
                <button
                  type="button"
                  onClick={() => setHeroTier('research')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    heroTier === 'research'
                      ? 'bg-purple-600 text-white font-bold shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Atom className="w-3.5 h-3.5" />
                  <span>Research & Advanced</span>
                </button>
              </div>

              {/* Search Bar Input & Action */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={heroSearch}
                    onChange={e => setHeroSearch(e.target.value)}
                    placeholder="Enter any scientific concept, law, or equation to visualize (e.g., Photosynthesis, Maxwell Equations, Transformer Attention)..."
                    className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm bg-transparent text-slate-100 placeholder-slate-400 focus:outline-hidden"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!heroSearch.trim()}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all shrink-0 active:scale-95"
                >
                  <span>Deconstruct Theory</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Quick Action Badges / Quantitative Rigor */}
          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400 pt-2">
            <button
              onClick={onOpenWorkspace}
              className="font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 transition-colors"
            >
              <span>Explore Interactive Studio Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <button
              onClick={onOpenUploadModal}
              className="font-medium text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-emerald-400" />
              <span>Upload Textbook Chapter (PDF / TXT)</span>
            </button>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <button
              onClick={onOpenPdfModal}
              className="font-medium text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-violet-400" />
              <span>Export Printable PDF Reports</span>
            </button>
          </div>

        </div>
      </section>

      {/* --- THREE AUDIENCE SECTIONS --- */}

      {/* SECTION 1: SCHOOL STUDENTS (UP TO 10TH CLASS) */}
      <section id="school" className="py-20 border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col lg:flex-row items-start justify-between gap-8 mb-12">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                <span className="font-bold text-emerald-400 uppercase">Tier 1</span>
                <span aria-hidden="true">·</span>
                <span>Foundational Curriculum</span>
                <span aria-hidden="true">·</span>
                <span>Grades 6 through 10</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
                School Students (Up to 10th Class)
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                Anchored in visual storytelling, character metaphors, and intuitive physical analogies. Deconstructs abstract textbook concepts into step-by-step observable phenomena without overwhelming mathematical jargon.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => onLaunchTopic('Photosynthesis & Cellular Respiration', 'school', 'Science (Biology)')}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all active:scale-95"
              >
                <span>Launch Biology Visualizer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Subjects Grid for 10th Class */}
          <div className="mb-10">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
              Core Subject Coverage:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { name: 'Science (Biology)', topics: 'Photosynthesis, Cell Organelles, Double Circulation' },
                { name: 'Science (Physics)', topics: 'Ohm\'s Law, Lenses, Newton\'s Laws, Magnetism' },
                { name: 'Science (Chemistry)', topics: 'Acids & Bases, Chemical Reactions, Carbon' },
                { name: 'Mathematics', topics: 'Pythagoras, Quadratics, AP Series, Volumes' },
                { name: 'Social Science', topics: 'Nationalism, Indian Constitution, Monsoons' },
                { name: 'Commerce & Languages', topics: 'Money & Credit, Hindi Grammar, Poetry' },
              ].map((subj, idx) => (
                <div
                  key={idx}
                  onClick={() => onLaunchTopic(subj.topics.split(', ')[0], 'school', subj.name)}
                  className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-emerald-500/50 cursor-pointer transition-all space-y-1.5 group"
                >
                  <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {subj.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                    {subj.topics}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Featured School Concept Card (Bento Showcase) */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-xl">
            <div className="lg:col-span-7 space-y-4">
              <div className="text-xs font-mono text-emerald-400 uppercase font-semibold">
                Showcase Concept Model · Biology & Energetics
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Photosynthesis & Cellular Respiration
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-serif">
                "Plants are Earth's primary solar harvesters. Inside plant mesophyll cells lie microscopic green organelles called chloroplasts housing thylakoids and stroma fluid. Photons strike photosystem II, photolysing water into free oxygen gas, protons, and ATP currency."
              </p>

              {/* Chemical Equation in KaTeX */}
              <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/20 text-center font-serif text-sm text-emerald-200">
                <KaTeXView math="6CO_2 + 6H_2O \xrightarrow{\text{Light, Chlorophyll}} C_6H_{12}O_6 + 6O_2" displayMode />
              </div>

              {/* Metaphor Callout */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-start gap-2.5">
                <span className="font-bold text-amber-400 shrink-0">💡 Cognitive Analogy:</span>
                <span>Like solar panels catching photons on a clean glass roof, splitting liquid water into chemical energy charges.</span>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => onLaunchTopic('Photosynthesis & Cellular Respiration', 'school', 'Science (Biology)')}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <span>Explore Full Visualizer</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs text-slate-400 font-mono">7 Concept Nodes · 3 Storyboard Frames · 3 Quiz Checks</span>
              </div>
            </div>

            {/* Visual Schematic Diagram Box */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/40 border border-slate-800 flex flex-col items-center justify-center text-center">
              <div className="w-28 h-28 rounded-full border-4 border-dashed border-emerald-400/60 flex items-center justify-center mb-4">
                <div className="w-18 h-18 rounded-full bg-emerald-500/20 flex flex-col items-center justify-center text-emerald-300 font-bold text-xs">
                  <span>Calvin</span>
                  <span>Cycle</span>
                </div>
              </div>
              <div className="text-xs font-bold text-white mb-1">Chloroplast Stroma Factory</div>
              <div className="text-[11px] text-slate-400 max-w-xs">
                Light reaction thylakoid membranes generating ATP & NADPH to drive RuBisCO carbon fixation.
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 2: COLLEGE & COMPETITIVE EXAM STUDENTS */}
      <section id="college" className="py-20 border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col lg:flex-row items-start justify-between gap-8 mb-12">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                <span className="font-bold text-indigo-400 uppercase">Tier 2</span>
                <span aria-hidden="true">·</span>
                <span>Higher Education & Competitive Exams</span>
                <span aria-hidden="true">·</span>
                <span>JEE · NEET · GATE · UPSC</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
                College & Competitive Exam Students
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                High information density, deterministic physical schematics, coordinate vector mechanics, and formula derivations. Focuses on spatial relationships, reaction mechanisms, and multi-step derivations.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => onLaunchTopic('Electromagnetic Wave Propagation & Maxwell Equations', 'college', 'STEM: Physics')}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-indigo-600/20 transition-all active:scale-95"
              >
                <span>Launch Physics Visualizer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Subjects Grid for College & Competitive */}
          <div className="mb-10">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
              Academic & Competitive Domains:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { name: 'STEM: Physics', desc: 'Rotational dynamics, Maxwell equations, thermodynamics, SHM oscillations' },
                { name: 'STEM: Chemistry', desc: 'SN1/SN2 reaction kinetics, coordination complexes, electrochemistry' },
                { name: 'STEM: Mathematics', desc: 'Eigenvalues, vector calculus, differential equations, distributions' },
                { name: 'STEM: Computer Science', desc: 'Dijkstra shortest path, dynamic programming, OS virtual memory' },
                { name: 'Commerce: Finance', desc: 'CAPM model, double-entry balance sheets, DCF valuation, break-even' },
                { name: 'Commerce: Economics', desc: 'Market elasticity, Porter\'s five forces, monetary transmission' },
                { name: 'Arts: Political Science', desc: 'Separation of powers, Rawlsian justice, non-aligned movement' },
                { name: 'Arts: World History', desc: 'Industrial expansion, World War geopolitics, cold war deterrence' },
              ].map((subj, idx) => (
                <div
                  key={idx}
                  onClick={() => onLaunchTopic(subj.desc.split(', ')[0], 'college', subj.name)}
                  className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-indigo-500/50 cursor-pointer transition-all space-y-1.5 group"
                >
                  <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {subj.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                    {subj.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Featured College Concept Card (Bento Showcase) */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-xl">
            <div className="lg:col-span-7 space-y-4">
              <div className="text-xs font-mono text-indigo-400 uppercase font-semibold">
                Showcase Concept Model · Classical Electrodynamics & Wave Optics
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Electromagnetic Wave Propagation & Maxwell Equations
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-serif">
                "Changing electric and magnetic fields sustain each other in vacuum, propagating as transverse waves at the invariant speed of light. In free space, electric vector E and magnetic vector B oscillate in phase, mutually orthogonal and transverse to wavevector k."
              </p>

              {/* Maxwell Wave Equation in KaTeX */}
              <div className="p-3 rounded-xl bg-slate-950 border border-indigo-500/20 text-center font-serif text-sm text-indigo-200">
                <KaTeXView math="\nabla^2 \mathbf{E} - \mu_0 \varepsilon_0 \frac{\partial^2 \mathbf{E}}{\partial t^2} = 0 \quad\implies\quad c = \frac{1}{\sqrt{\mu_0\varepsilon_0}}" displayMode />
              </div>

              {/* Poynting Vector */}
              <div className="p-3 rounded-xl bg-slate-950 border border-indigo-500/20 text-center font-serif text-sm text-indigo-200">
                <KaTeXView math="\mathbf{S} = \frac{1}{\mu_0} (\mathbf{E} \times \mathbf{B}) \quad [\text{Watts / m}^2]" displayMode />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => onLaunchTopic('Electromagnetic Wave Propagation & Maxwell Equations', 'college', 'STEM: Physics')}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <span>Explore Full Visualizer</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs text-slate-400 font-mono">6 Nodes · 3D Vector Simulator · 2 Formulas</span>
              </div>
            </div>

            {/* Visual Vector Schematic */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 border border-slate-800 flex flex-col items-center justify-center text-center">
              <div className="w-full h-32 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-around px-4 mb-4 relative overflow-hidden">
                <div className="flex flex-col items-center">
                  <span className="w-3 h-12 bg-red-500 rounded-sm mb-1" />
                  <span className="text-[10px] font-mono text-red-400 font-bold">E-Field</span>
                </div>
                <div className="text-slate-500 font-mono text-sm">⟂</div>
                <div className="flex flex-col items-center">
                  <span className="w-12 h-3 bg-sky-500 rounded-sm mb-1" />
                  <span className="text-[10px] font-mono text-sky-400 font-bold">B-Field</span>
                </div>
                <div className="text-slate-500 font-mono text-sm">➔</div>
                <div className="text-[10px] font-mono text-emerald-400 font-bold">+z (Velocity c)</div>
              </div>
              <div className="text-xs font-bold text-white mb-1">Transverse Vector Wave Model</div>
              <div className="text-[11px] text-slate-400 max-w-xs">
                Real-time frequency, wavelength, and field amplitude controls in the integrated 3D laboratory.
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 3: RESEARCH & ADVANCED STUDIES */}
      <section id="research" className="py-20 border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col lg:flex-row items-start justify-between gap-8 mb-12">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                <span className="font-bold text-purple-400 uppercase">Tier 3</span>
                <span aria-hidden="true">·</span>
                <span>Postgraduate & Research Scholars</span>
                <span aria-hidden="true">·</span>
                <span>Mathematical Rigor & Complex Systems</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
                Research & Advanced Studies
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                Rigorous mathematical formulations, latent space topological manifolds, Bloch spheres, Hamiltonian quantum operators, and multi-head attention heatmaps. Built for scientific clarity and doctoral depth.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => onLaunchTopic('Transformer Self-Attention & Latent Topology', 'research', 'Advanced Machine Learning')}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-purple-600/20 transition-all active:scale-95"
              >
                <span>Launch Research Visualizer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Subjects Grid for Research */}
          <div className="mb-10">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
              Advanced Research Disciplines:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { name: 'Advanced Machine Learning', desc: 'Transformer self-attention, diffusion score SDEs, RLHF PPO, spectral GNNs' },
                { name: 'Quantum Physics', desc: 'Bloch spheres, Bell inequalities & CHSH, path integral propagators, decoherence' },
                { name: 'Molecular Biology', desc: 'CRISPR-Cas9 cleavage, AlphaFold distograms, chromatin remodeling, translation' },
                { name: 'Neuroscience', desc: 'Hodgkin-Huxley ion channels, Hebbian LTP plasticity, cortical microcircuits' },
              ].map((subj, idx) => (
                <div
                  key={idx}
                  onClick={() => onLaunchTopic(subj.desc.split(', ')[0], 'research', subj.name)}
                  className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-purple-500/50 cursor-pointer transition-all space-y-1.5 group"
                >
                  <h4 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                    {subj.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                    {subj.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Research Concept Card (Bento Showcase) */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-xl">
            <div className="lg:col-span-7 space-y-4">
              <div className="text-xs font-mono text-purple-400 uppercase font-semibold">
                Showcase Concept Model · Deep Representation Theory
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Transformer Self-Attention & Latent Topology
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-serif">
                "Scaled dot-product attention maps high-dimensional query and key embeddings into soft probability distributions over value representations. Normalizing by the square root of dimension prevents vanishing gradients in the saturated tails of the softmax simplex."
              </p>

              {/* Attention Formula in KaTeX */}
              <div className="p-3 rounded-xl bg-slate-950 border border-purple-500/20 text-center font-serif text-sm text-purple-200">
                <KaTeXView math="\text{Attention}(Q, K, V) = \text{softmax}\left( \frac{QK^T}{\sqrt{d_k}} \right) V" displayMode />
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-purple-500/20 text-center font-serif text-sm text-purple-200">
                <KaTeXView math="\text{MultiHead}(Q, K, V) = \text{Concat}(\text{head}_1, \dots, \text{head}_h) W^O" displayMode />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => onLaunchTopic('Transformer Self-Attention & Latent Topology', 'research', 'Advanced Machine Learning')}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <span>Explore Full Visualizer</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs text-slate-400 font-mono">6 Nodes · 8-Head Heatmap · Analytical Proofs</span>
              </div>
            </div>

            {/* Visual Heatmap Box */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950/40 border border-slate-800 flex flex-col items-center justify-center text-center">
              <div className="grid grid-cols-4 gap-1 p-3 bg-slate-950 rounded-xl border border-slate-800 mb-4">
                {[0.85, 0.12, 0.03, 0.45, 0.10, 0.92, 0.33, 0.15, 0.05, 0.28, 0.76, 0.19, 0.40, 0.11, 0.22, 0.88].map((v, i) => (
                  <div
                    key={i}
                    style={{ backgroundColor: `rgba(168, 85, 247, ${v})` }}
                    className="w-10 h-8 rounded-sm flex items-center justify-center text-[9px] font-mono font-bold text-white"
                  >
                    {v.toFixed(2)}
                  </div>
                ))}
              </div>
              <div className="text-xs font-bold text-white mb-1">Attention Affinity Manifold</div>
              <div className="text-[11px] text-slate-400 max-w-xs">
                Interactive softmax weights across token projections with dynamic temperature scaling.
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* --- CURRICULUM TOPIC BROWSER & SUBJECT MATRIX --- */}
      <section id="curriculum" className="py-20 border-b border-slate-800/60 bg-slate-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-2xl mb-8">
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
              <span className="font-bold text-indigo-400 uppercase">Interactive Browser</span>
              <span aria-hidden="true">·</span>
              <span>Subject Taxonomy Directory</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
              Explore the Structured Curriculum Matrix
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Select any audience tier and subject to reveal pre-mapped educational models ready for instant deconstruction.
            </p>
          </div>

          {/* Tier Switcher Segmented Control */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 max-w-md mb-8 text-xs font-medium">
            <button
              onClick={() => {
                setActiveCurriculumTier('school');
                const first = CURRICULUM_SUBJECTS.find(s => s.tier === 'school');
                if (first) setSelectedSubjectId(first.id);
              }}
              className={`flex-1 py-2 rounded-lg text-center transition-all ${
                activeCurriculumTier === 'school'
                  ? 'bg-emerald-500 text-white font-bold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              School (K–10)
            </button>
            <button
              onClick={() => {
                setActiveCurriculumTier('college');
                const first = CURRICULUM_SUBJECTS.find(s => s.tier === 'college');
                if (first) setSelectedSubjectId(first.id);
              }}
              className={`flex-1 py-2 rounded-lg text-center transition-all ${
                activeCurriculumTier === 'college'
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              College & Competitive
            </button>
            <button
              onClick={() => {
                setActiveCurriculumTier('research');
                const first = CURRICULUM_SUBJECTS.find(s => s.tier === 'research');
                if (first) setSelectedSubjectId(first.id);
              }}
              className={`flex-1 py-2 rounded-lg text-center transition-all ${
                activeCurriculumTier === 'research'
                  ? 'bg-purple-600 text-white font-bold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Research & Advanced
            </button>
          </div>

          {/* Subjects Filter Bar */}
          <div className="flex flex-wrap gap-2 mb-8">
            {tierSubjects.map(sub => (
              <button
                key={sub.id}
                onClick={() => setSelectedSubjectId(sub.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  selectedSubjectId === sub.id
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>

          {/* Subject Topics Grid */}
          {currentSubject && (
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white">
                    {currentSubject.name}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Select any concept topic below to launch the visualizer immediately:
                  </p>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-slate-300">
                  {currentSubject.sampleTopics.length} Models Ready
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {currentSubject.sampleTopics.map((topic, idx) => (
                  <div
                    key={idx}
                    onClick={() => onLaunchTopic(topic, currentSubject.tier, currentSubject.name)}
                    className="p-4 rounded-xl border border-slate-800 hover:border-indigo-500 bg-slate-950/80 hover:bg-slate-950 cursor-pointer transition-all space-y-2 group"
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span>Module 0{idx + 1}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-indigo-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors leading-snug">
                      {topic}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Interactive DAG · Flashcards · Quiz
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>

      {/* --- ALL 12 INTEGRATED FEATURES SHOWCASE --- */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-2xl mb-12">
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
              <span className="font-bold text-indigo-400 uppercase">Architecture Checklist</span>
              <span aria-hidden="true">·</span>
              <span>12 Integrated Educational Utilities</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
              Built for End-to-End Conceptual Mastery
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              Every tool required for reading, inspecting, testing, and synthesizing complex theories is fully functional and connected to the underlying generative engine.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: <GitFork className="w-5 h-5 text-indigo-400" />,
                title: '1. Mind Map DAG',
                desc: 'Directed acyclic graphs with dynamic pan/zoom, expandable concept cards, and category grouping.',
              },
              {
                icon: <Layers className="w-5 h-5 text-violet-400" />,
                title: '2. Visual Storyboard',
                desc: 'Sequential narrative frames with intuitive cognitive metaphors, scene descriptions, and prompt copiers.',
              },
              {
                icon: <Activity className="w-5 h-5 text-emerald-400" />,
                title: '3. Interactive Lab',
                desc: 'Real-time simulations for transverse EM waves, chloroplast photosynthesis cycles, and attention matrices.',
              },
              {
                icon: <Calculator className="w-5 h-5 text-sky-400" />,
                title: '4. KaTeX Equations',
                desc: 'Mathematical proofs and derivations with comprehensive variable dictionaries and LaTeX copying.',
              },
              {
                icon: <Award className="w-5 h-5 text-amber-400" />,
                title: '5. SM-2 Flashcards',
                desc: 'SuperMemo-2 spaced repetition with 3D flip animation, recall ratings (1–5), and custom card creation.',
              },
              {
                icon: <HelpCircle className="w-5 h-5 text-rose-400" />,
                title: '6. Adaptive Quiz',
                desc: 'Bloom\'s Taxonomy graded assessment with live scoring, confetti celebrations, and Locate-in-Mind-Map jumps.',
              },
              {
                icon: <Volume2 className="w-5 h-5 text-cyan-400" />,
                title: '7. Text-to-Speech (TTS)',
                desc: 'Sentence-synchronized speech reader that simultaneously pulsates the active concept node in the DAG.',
              },
              {
                icon: <Languages className="w-5 h-5 text-indigo-400" />,
                title: '8. Translation & Etymology',
                desc: 'Interactive popover for any selected word showing target translation, definition, and classical roots.',
              },
              {
                icon: <Upload className="w-5 h-5 text-emerald-400" />,
                title: '9. Book & PDF Upload',
                desc: 'Upload textbook chapters (.pdf, .txt, .md) to automatically parse headings and synthesize node trees.',
              },
              {
                icon: <Printer className="w-5 h-5 text-pink-400" />,
                title: '10. Download as PDF',
                desc: 'High-resolution printable A4 report publishing with jsPDF and html2canvas vector rasterization.',
              },
              {
                icon: <Share2 className="w-5 h-5 text-blue-400" />,
                title: '11. Social Sharing & QR',
                desc: 'Dynamic SVG QR code generator, Instagram Story visual cards, and 1-click Twitter/LinkedIn triggers.',
              },
              {
                icon: <Bookmark className="w-5 h-5 text-amber-400" />,
                title: '12. Bookmarks & History',
                desc: 'Polymorphic bookmarks for projects, nodes, and flashcards with persistent generation prompt history.',
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900 hover:border-slate-700 transition-all space-y-2.5"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
                  {feature.icon}
                </div>
                <h4 className="text-xs font-bold text-white">
                  {feature.title}
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom Launch Banner */}
          <div className="mt-16 p-8 rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/80 via-slate-900 to-purple-950/80 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Ready to deconstruct your first educational theory?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                Open the interactive workspace to explore live DAG mind maps, run wave physics simulations, and test your retention with spaced repetition.
              </p>
            </div>
            <button
              onClick={onOpenWorkspace}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all shrink-0 active:scale-95"
            >
              <span>Launch TheoryVisualizer Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-8 border-t border-slate-800/80 text-xs text-slate-500 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-indigo-400" />
            <span className="font-bold text-slate-300">TheoryVisualizer</span>
            <span>·</span>
            <span>Multi-Tier Educational Concept Architecture</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <a href="#school" className="hover:text-slate-300 transition-colors">School (K–10)</a>
            <a href="#college" className="hover:text-slate-300 transition-colors">College & Competitive</a>
            <a href="#research" className="hover:text-slate-300 transition-colors">Research & Advanced</a>
            <a href="#curriculum" className="hover:text-slate-300 transition-colors">Curriculum Matrix</a>
          </div>
        </div>
      </footer>

    </div>
  );
};
