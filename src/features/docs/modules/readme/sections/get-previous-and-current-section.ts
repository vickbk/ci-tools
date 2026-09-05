import { MatchedReadmeSection } from "../types";

/**
 * Gets adjacent matched README sections and determines whether ordering checks should skip them.
 *
 * @param input - Section index, preferred-order map, and matched sections.
 * @returns The previous and current sections plus the ordering skip decision.
 * @example
 * ```ts
 * const result = getPreviousAndCurrentSection({ index, orderIndex, matchedSections });
 * ```
 */
export function getPreviousAndCurrentSection({
  orderIndex,
  index,
  matchedSections,
}: {
  index: number;
  orderIndex: Map<string, number>;
  matchedSections: MatchedReadmeSection[];
}) {
  const previousSection = matchedSections[index - 1];
  const currentSection = matchedSections[index];
  const previousIndex = orderIndex.get(previousSection.id);
  const currentIndex = orderIndex.get(currentSection.id);

  let shouldSkip = false;
  if (
    previousIndex === undefined ||
    currentIndex === undefined ||
    currentIndex >= previousIndex
  ) {
    shouldSkip = true;
  }
  return { shouldSkip, previousSection, currentSection };
}
