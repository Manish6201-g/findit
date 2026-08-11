import Item, { IItem } from '../models/Item';
import Notification from '../models/Notification';

export interface MatchResult {
  item: IItem;
  score: number;
}

export const executeAiMatcher = async (newItem: IItem): Promise<MatchResult[]> => {
  try {
    const targetType = newItem.type === 'lost' ? 'found' : 'lost';

    // Find all active items of the opposite type
    const candidateItems = await Item.find({
      type: targetType,
      status: 'active',
      owner: { $ne: newItem.owner },
    }).populate('owner', 'name email');

    const matches: MatchResult[] = [];

    const newItemWords = new Set(
      `${newItem.name} ${newItem.description}`
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter((w) => w.length > 2)
    );

    for (const candidate of candidateItems) {
      let score = 0;

      // 1. Category match
      if (candidate.category.toLowerCase() === newItem.category.toLowerCase()) {
        score += 35;
      }

      // 2. Location match
      if (
        candidate.location.toLowerCase().includes(newItem.location.toLowerCase()) ||
        newItem.location.toLowerCase().includes(candidate.location.toLowerCase())
      ) {
        score += 30;
      }

      // 3. Color match
      if (newItem.color && candidate.color && newItem.color.toLowerCase() === candidate.color.toLowerCase()) {
        score += 15;
      }

      // 4. Brand match
      if (newItem.brand && candidate.brand && newItem.brand.toLowerCase() === candidate.brand.toLowerCase()) {
        score += 10;
      }

      // 5. Word overlap match
      const candidateWords = `${candidate.name} ${candidate.description}`
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter((w) => w.length > 2);

      let commonWordCount = 0;
      for (const word of candidateWords) {
        if (newItemWords.has(word)) {
          commonWordCount++;
        }
      }

      if (commonWordCount > 0) {
        score += Math.min(commonWordCount * 5, 20);
      }

      if (score >= 35) {
        matches.push({ item: candidate, score: Math.min(score, 100) });
      }
    }

    // Sort by highest match score
    matches.sort((a, b) => b.score - a.score);

    // Notify owners of high-confidence matches
    for (const match of matches.slice(0, 3)) {
      if (match.score >= 50) {
        await Notification.create({
          user: match.item.owner,
          title: 'Potential AI Item Match Found! 🔍',
          message: `Our Smart AI Matcher detected a ${match.score}% match for your ${match.item.type} item "${match.item.name}" with a newly reported item.`,
          type: 'match',
        });
      }
    }

    return matches;
  } catch (error) {
    console.error('Error executing AI Matcher:', error);
    return [];
  }
};
