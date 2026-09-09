/**
 * Image Studio — Analytics React Hook
 *
 * Convenience hook that returns the track function bound to Image Studio events.
 */

import { trackStudioEvent } from './analytics';
import type { ImageStudioEvent } from './analytics';

export function useImageStudioAnalytics() {
  return {
    track: (event: ImageStudioEvent) => trackStudioEvent(event),
  };
}
