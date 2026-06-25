/**
 * UserGen — avatar URL generator.
 *
 * Uses DiceBear's avataaars style (open-source, runs client-side,
 * no API call). The URL embeds a deterministic seed so the same
 * user always gets the same avatar.
 *
 * Docs: https://www.dicebear.com/styles/avataaars
 */

/**
 * Generate a DiceBear avatar URL for the given name.
 *
 * @param seed  Deterministic seed (typically firstName + lastName)
 * @returns     DiceBear SVG URL
 */
export function generateAvatar(seed: string): string {
  return `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;
}
