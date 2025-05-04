
import { LayoutMode } from '@/contexts/LayoutContext';

/**
 * Type guard function to check if the layout mode is presentation mode
 */
export const isPresentationMode = (mode: LayoutMode): boolean => {
  return mode === 'presentation';
};

/**
 * Type guard function to check if the layout mode is focus mode
 */
export const isFocusMode = (mode: LayoutMode): boolean => {
  return mode === 'focus';
};

/**
 * Type guard function to check if the layout mode is explorer mode
 */
export const isExplorerMode = (mode: LayoutMode): boolean => {
  return mode === 'explorer';
};

/**
 * Type guard function to check if the layout mode is split mode
 */
export const isSplitMode = (mode: LayoutMode): boolean => {
  return mode === 'split';
};
