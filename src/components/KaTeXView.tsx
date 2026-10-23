import React, { useMemo } from 'react';
import katex from 'katex';

interface KaTeXViewProps {
  math: string;
  displayMode?: boolean;
  className?: string;
}

export const KaTeXView: React.FC<KaTeXViewProps> = ({
  math,
  displayMode = false,
  className = '',
}) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode,
        throwOnError: false,
      });
    } catch (error) {
      console.warn('KaTeX render error:', error);
      return math;
    }
  }, [math, displayMode]);

  return (
    <span
      className={`katex-wrapper inline-block ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
