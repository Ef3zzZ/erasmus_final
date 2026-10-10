import type * as React from 'react';

type ModelViewerAttributes = React.HTMLAttributes<HTMLElement> & {
  src?: string;
  alt?: string;
  'auto-rotate'?: boolean | string;
  'auto-rotate-delay'?: number | string;
  'rotation-per-second'?: string;
  'camera-controls'?: boolean | string;
  'camera-orbit'?: string;
  'field-of-view'?: string;
  'shadow-intensity'?: string | number;
  'shadow-softness'?: string | number;
  'exposure'?: string | number;
  'loading'?: 'auto' | 'lazy' | 'eager';
  'reveal'?: 'auto' | 'interaction' | 'manual';
  'touch-action'?: string;
  'disable-zoom'?: boolean | string;
  'interaction-prompt'?: 'auto' | 'when-focused' | 'none';
  poster?: string;
};

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<ModelViewerAttributes, HTMLElement>;
    }
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<ModelViewerAttributes, HTMLElement>;
    }
  }
}
