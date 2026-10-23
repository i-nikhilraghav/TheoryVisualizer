export type EducationTier = 'school' | 'college' | 'research';

export interface SubjectConfig {
  id: string;
  name: string;
  tier: EducationTier;
  icon: string;
  sampleTopics: string[];
}

export interface MindMapNode {
  id: string;
  label: string;
  type: 'root' | 'core' | 'branch' | 'leaf';
  description: string;
  category: string;
  formula?: string;
  x: number;
  y: number;
  color?: string;
}

export interface MindMapEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  relation?: string;
}

export interface StoryboardStep {
  step: number;
  title: string;
  visualDescription: string;
  analogy: string;
  icon: string;
  keyConcept: string;
}

export interface FormulaVariable {
  symbol: string;
  meaning: string;
}

export interface FormulaItem {
  name: string;
  latex: string;
  explanation: string;
  variables: FormulaVariable[];
}

export interface SimulationConfig {
  type: 'wave' | 'cycle' | 'network' | 'vector';
  title: string;
  parameters: Record<string, number>;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  hint?: string;
  category: string;
  interval?: number;
  repetition?: number;
  easeFactor?: number;
  dueDate?: string;
  userRating?: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  taxonomyLevel: 'Recall' | 'Understanding' | 'Application';
  referenceNodeId: string;
}

export interface ReaderSection {
  title: string;
  content: string;
  sentences: string[];
}

export interface VisualProject {
  id: string;
  title: string;
  subject: string;
  educationTier: EducationTier;
  targetAudience: string;
  summary: string;
  keyTakeaways: string[];
  readerSections: ReaderSection[];
  mindMap: {
    nodes: MindMapNode[];
    edges: MindMapEdge[];
  };
  storyboard: StoryboardStep[];
  formulas: FormulaItem[];
  simulationConfig?: SimulationConfig;
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
  createdAt?: string;
}

export interface WordTranslationData {
  word: string;
  targetLanguage: string;
  translatedWord: string;
  partOfSpeech: string;
  definition: string;
  etymology: string;
  educationalContext: string;
}

export interface BookmarkItem {
  id: string;
  type: 'project' | 'node' | 'flashcard';
  title: string;
  snippet: string;
  tag: string;
  projectId: string;
  createdAt: string;
}

export type SupportedLanguage = 'en' | 'hi' | 'es' | 'fr' | 'de' | 'ja';
