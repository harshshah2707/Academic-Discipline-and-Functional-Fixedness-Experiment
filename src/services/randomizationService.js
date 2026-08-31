import { storageService } from './storageService';

/**
 * Randomization and Assignment Engine
 * Ensures stratified balanced assignment across academic disciplines and unbiased trial order.
 */

export const CONDITIONS = {
  PICTURE: 'Picture Condition',
  WORD: 'Word Condition'
};

/**
 * Generates an anonymous participant ID like P0001, P0002...
 */
export const generateParticipantId = () => {
  const participants = storageService.getParticipants();
  const nextNum = participants.length + 1;
  const padded = String(nextNum).padStart(4, '0');
  return `P${padded}`;
};

/**
 * Performs stratified random assignment to Picture or Word condition based on
 * the participant's academic discipline, balancing cell counts in real-time.
 */
export const assignConditionForDiscipline = (discipline) => {
  const participants = storageService.getParticipants();
  
  // Normalize discipline string for matching
  const normDiscipline = (discipline || '').toLowerCase().trim();

  // Filter existing participants by discipline category
  const matchingParticipants = participants.filter(p => {
    const d = (p.discipline || '').toLowerCase().trim();
    if (normDiscipline.includes('fine') || normDiscipline.includes('art')) {
      return d.includes('fine') || d.includes('art');
    }
    if (normDiscipline.includes('history')) {
      return d.includes('history');
    }
    return !d.includes('fine') && !d.includes('art') && !d.includes('history');
  });

  const pictureCount = matchingParticipants.filter(p => p.assigned_modality === CONDITIONS.PICTURE).length;
  const wordCount = matchingParticipants.filter(p => p.assigned_modality === CONDITIONS.WORD).length;

  if (pictureCount < wordCount) {
    return CONDITIONS.PICTURE;
  } else if (wordCount < pictureCount) {
    return CONDITIONS.WORD;
  } else {
    // Exact tie: unbiassed 50/50 coin flip
    return Math.random() < 0.5 ? CONDITIONS.PICTURE : CONDITIONS.WORD;
  }
};

/**
 * Fisher-Yates unbiased shuffle for experimental objects.
 */
export const shuffleObjects = (objectsList) => {
  const copy = [...objectsList];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};
