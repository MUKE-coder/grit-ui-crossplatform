import { useMediaQuery } from './use-media-query'

/**
 * Detect whether the current viewport is mobile-sized (max-width: 768px).
 *
 * @example
 * const isMobile = useIsMobile()
 */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 768px)')
}
