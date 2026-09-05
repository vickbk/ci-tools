import { MatchedReadmeSection } from "../types";

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
