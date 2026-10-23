import React, { useState, useRef, useEffect } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  Search, 
  Bookmark, 
  Check, 
  ExternalLink, 
  Layers, 
  Compass, 
  X,
  Info,
  FileDown
} from 'lucide-react';
import { MindMapNode, MindMapEdge, VisualProject } from '../types';
import { KaTeXView } from './KaTeXView';

interface MindMapCanvasProps {
  project: VisualProject;
  isDarkMode: boolean;
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string | null) => void;
  onBookmarkNode: (node: MindMapNode) => void;
  isNodeBookmarked: (nodeId: string) => boolean;
  activeSentenceIndex: number;
  onOpenPdfModal?: () => void;
}

export const MindMapCanvas: React.FC<MindMapCanvasProps> = ({
  project,
  isDarkMode,
  selectedNodeId,
  onSelectNode,
  onBookmarkNode,
  isNodeBookmarked,
  activeSentenceIndex,
  onOpenPdfModal,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Zoom & Pan transformation state
  const [scale, setScale] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [searchQuery, setSearchQuery] = useState<string>('');

  const nodes = project.mindMap.nodes;
  const edges = project.mindMap.edges;

  // Selected node object
  const activeNode = nodes.find(n => n.id === selectedNodeId);

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    const newScale = Math.min(Math.max(scale * zoomFactor, 0.4), 2.5);
    setScale(newScale);
  };

  // Mouse drag pan
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag on canvas background, not when clicking interactive cards
    if ((e.target as HTMLElement).closest('.node-card')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleResetZoom = () => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  };

  const handleFitScreen = () => {
    setScale(0.85);
    setPan({ x: 30, y: 20 });
  };

  // Node position map
  const nodeMap = React.useMemo(() => {
    const map = new Map<string, MindMapNode>();
    nodes.forEach(n => map.set(n.id, n));
    return map;
  }, [nodes]);

  // Center on node if selected externally (e.g. from Quiz "Locate in Mind Map")
  useEffect(() => {
    if (selectedNodeId && containerRef.current) {
      const node = nodeMap.get(selectedNodeId);
      if (node) {
        const rect = containerRef.current.getBoundingClientRect();
        const targetX = rect.width / 2 - node.x * scale;
        const targetY = rect.height / 2 - node.y * scale;
        setPan({ x: targetX, y: targetY });
      }
    }
  }, [selectedNodeId, scale]);

  return (
    <div 
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className={`relative w-full h-full overflow-hidden select-none cursor-grab active:cursor-grabbing ${
        isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'
      }`}
    >
      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: isDarkMode 
            ? 'radial-gradient(circle, #4f46e5 1px, transparent 1px)' 
            : 'radial-gradient(circle, #94a3b8 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          transform: `translate(${pan.x % 24}px, ${pan.y % 24}px)`,
        }}
      />

      {/* Floating Canvas Controls (Feature 5: Zooming Mode & Deep Inspection) */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 p-1.5 rounded-xl border backdrop-blur-md shadow-lg bg-slate-900/80 border-slate-700/80 text-slate-200">
        <button
          onClick={() => setScale(s => Math.min(s + 0.15, 2.5))}
          className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          title="Zoom In (+)"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setScale(s => Math.max(s - 0.15, 0.4))}
          className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          title="Zoom Out (-)"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="w-[1px] h-4 bg-slate-700 mx-1" />
        <button
          onClick={handleResetZoom}
          className="px-2 py-1 rounded-lg hover:bg-slate-800 text-xs font-mono font-medium"
          title="Reset Zoom to 100%"
        >
          {Math.round(scale * 100)}%
        </button>
        <button
          onClick={handleFitScreen}
          className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          title="Fit Canvas"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
        {onOpenPdfModal && (
          <>
            <div className="w-[1px] h-4 bg-slate-700 mx-1" />
            <button
              onClick={onOpenPdfModal}
              className="px-2 py-1 rounded-lg hover:bg-indigo-600/30 text-indigo-400 text-xs font-semibold flex items-center gap-1 transition-colors"
              title="Download Mind Map as PDF"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>PDF</span>
            </button>
          </>
        )}
      </div>

      {/* Node Search Filter */}
      <div className="absolute top-4 right-4 z-20 flex items-center">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Filter concept nodes..."
            className="w-44 sm:w-56 pl-8 pr-3 py-1.5 text-xs rounded-xl border backdrop-blur-md bg-slate-900/80 border-slate-700 text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 shadow-lg"
          />
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400 pointer-events-none" />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Interactive Scalable Canvas Viewport */}
      <div
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
          transformOrigin: '0 0',
          transition: isDragging ? 'none' : 'transform 0.05s ease-out',
        }}
        className="absolute inset-0 w-[1200px] h-[900px] pointer-events-auto"
      >
        {/* SVG Directed Edges & Flow Arrows */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <defs>
            <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
            </linearGradient>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="10"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#6366f1" opacity="0.85" />
            </marker>
          </defs>

          {edges.map(edge => {
            const sourceNode = nodeMap.get(edge.source);
            const targetNode = nodeMap.get(edge.target);
            if (!sourceNode || !targetNode) return null;

            // Compute midpoint and smooth cubic bezier curve
            const sx = sourceNode.x + 90;
            const sy = sourceNode.y + 45;
            const tx = targetNode.x + 90;
            const ty = targetNode.y + 45;
            const dx = tx - sx;
            const dy = ty - sy;
            const cx1 = sx + dx * 0.2;
            const cy1 = sy + dy * 0.5;
            const cx2 = sx + dx * 0.8;
            const cy2 = sy + dy * 0.5;

            const isEdgeActive = selectedNodeId === edge.source || selectedNodeId === edge.target;

            return (
              <g key={edge.id} className="transition-all duration-300">
                <path
                  d={`M ${sx} ${sy} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${tx} ${ty}`}
                  fill="none"
                  stroke={isEdgeActive ? '#38bdf8' : isDarkMode ? '#475569' : '#cbd5e1'}
                  strokeWidth={isEdgeActive ? 3 : 2}
                  strokeDasharray={isEdgeActive ? '6,3' : 'none'}
                  markerEnd="url(#arrowhead)"
                  className={isEdgeActive ? 'animate-pulse' : ''}
                />
                {edge.label && (
                  <text
                    x={(sx + tx) / 2}
                    y={(sy + ty) / 2 - 8}
                    fill={isDarkMode ? '#94a3b8' : '#64748b'}
                    fontSize="10"
                    textAnchor="middle"
                    className="font-medium pointer-events-none select-none bg-slate-900"
                  >
                    {edge.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Interactive Node Cards */}
        {nodes.map(node => {
          const isSelected = selectedNodeId === node.id;
          const isHighlighted = searchQuery && node.label.toLowerCase().includes(searchQuery.toLowerCase());
          const bookmarked = isNodeBookmarked(node.id);

          return (
            <div
              key={node.id}
              onClick={() => onSelectNode(isSelected ? null : node.id)}
              style={{
                left: `${node.x}px`,
                top: `${node.y}px`,
                borderColor: isSelected ? '#818cf8' : node.color || '#4f46e5',
              }}
              className={`node-card absolute w-[180px] p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 transform hover:-translate-y-1 hover:shadow-xl z-10 ${
                isSelected
                  ? 'bg-indigo-950/90 text-white ring-4 ring-indigo-500/40 shadow-indigo-500/30'
                  : isHighlighted
                  ? 'bg-amber-950/90 text-amber-100 ring-2 ring-amber-400'
                  : isDarkMode
                  ? 'bg-slate-900/90 text-slate-100 shadow-lg shadow-black/40'
                  : 'bg-white text-slate-800 shadow-md'
              }`}
            >
              {/* Node Header Badge */}
              <div className="flex items-center justify-between mb-1">
                <span 
                  style={{ color: node.color || '#6366f1' }}
                  className="text-[10px] font-extrabold uppercase tracking-wider"
                >
                  {node.type}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onBookmarkNode(node);
                  }}
                  className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition-colors"
                  title="Bookmark this node"
                >
                  <Bookmark className={`w-3 h-3 ${bookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
                </button>
              </div>

              {/* Node Label */}
              <h4 className="font-bold text-xs leading-snug line-clamp-2 mb-1">
                {node.label}
              </h4>

              {/* Node Short Description */}
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-tight">
                {node.description}
              </p>

              {/* Formula badge if present */}
              {node.formula && (
                <div className="mt-1.5 pt-1 border-t border-slate-800/80 text-[10px] text-indigo-300 font-mono truncate">
                  <KaTeXView math={node.formula} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Minimap Thumbnail (Bottom Right) */}
      <div className="absolute bottom-4 right-4 z-20 w-36 h-28 rounded-xl border backdrop-blur-md shadow-xl p-2 bg-slate-900/90 border-slate-700/80 hidden sm:block">
        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
          <span>Minimap</span>
          <span className="text-[8px] text-indigo-400 font-mono">{nodes.length} nodes</span>
        </div>
        <div className="relative w-full h-18 bg-slate-950 rounded border border-slate-800 overflow-hidden">
          {nodes.map(n => (
            <div
              key={n.id}
              style={{
                left: `${(n.x / 800) * 100}%`,
                top: `${(n.y / 500) * 100}%`,
                backgroundColor: n.color || '#6366f1',
              }}
              className="absolute w-2 h-2 rounded-full transform -translate-x-1/2 -translate-y-1/2"
            />
          ))}
          {/* Viewport Box */}
          <div 
            style={{
              left: `${Math.max(0, (-pan.x / (1200 * scale)) * 100)}%`,
              top: `${Math.max(0, (-pan.y / (900 * scale)) * 100)}%`,
              width: `${Math.min(100, (100 / scale) * 0.4)}%`,
              height: `${Math.min(100, (100 / scale) * 0.4)}%`,
            }}
            className="absolute border border-indigo-400 bg-indigo-500/20 rounded-xs pointer-events-none"
          />
        </div>
      </div>

      {/* Selected Node Details Slide-Out Drawer (Feature 10: Deep Inspection) */}
      {activeNode && (
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:w-96 z-30 p-4 rounded-2xl border backdrop-blur-xl shadow-2xl bg-slate-900/95 border-indigo-500/40 text-slate-100 animate-in fade-in slide-in-from-bottom duration-200">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <span 
                style={{ color: activeNode.color || '#6366f1' }}
                className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700"
              >
                {activeNode.category} • {activeNode.type}
              </span>
              <h3 className="text-base font-bold text-white mt-1.5">
                {activeNode.label}
              </h3>
            </div>
            <button
              onClick={() => onSelectNode(null)}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            {activeNode.description}
          </p>

          {activeNode.formula && (
            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-indigo-500/20 mb-3 text-center">
              <div className="text-[10px] text-slate-400 font-medium mb-1">Mathematical Representation:</div>
              <KaTeXView math={activeNode.formula} displayMode />
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
            <button
              onClick={() => onBookmarkNode(activeNode)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
            >
              <Bookmark className={`w-3.5 h-3.5 ${isNodeBookmarked(activeNode.id) ? 'fill-amber-400 text-amber-400' : ''}`} />
              <span>{isNodeBookmarked(activeNode.id) ? 'Bookmarked' : 'Bookmark Node'}</span>
            </button>

            <span className="text-[11px] text-slate-400">
              Connected to {edges.filter(e => e.source === activeNode.id || e.target === activeNode.id).length} concepts
            </span>
          </div>
        </div>
      )}

    </div>
  );
};
