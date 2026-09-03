/**
 * Default experimental objects specification.
 * Each object contains ID, display name, conventional function statement, and optional custom image URL.
 */
export const PRACTICE_OBJECT = {
  id: 'practice_button',
  name: 'BUTTON',
  displayName: 'Button',
  imageUrl: '', // falls back to SVG
  conventionalFunction: 'A button is commonly used to fasten pieces of fabric or clothing together.',
  isPractice: true
};

export const DEFAULT_EXPERIMENTAL_OBJECTS = [
  {
    id: 'obj_01',
    name: 'PAPERCLIP',
    displayName: 'Paperclip',
    imageUrl: '',
    conventionalFunction: 'A paperclip is commonly used to hold sheets of paper together.',
    order: 1
  },
  {
    id: 'obj_02',
    name: 'BRICK',
    displayName: 'Brick',
    imageUrl: '',
    conventionalFunction: 'A brick is commonly used to construct walls, pavements, and buildings.',
    order: 2
  },
  {
    id: 'obj_03',
    name: 'NEWSPAPER',
    displayName: 'Newspaper',
    imageUrl: '',
    conventionalFunction: 'A newspaper is commonly used to read current news, articles, and announcements.',
    order: 3
  },
  {
    id: 'obj_04',
    name: 'SPOON',
    displayName: 'Spoon',
    imageUrl: '',
    conventionalFunction: 'A spoon is commonly used to eat soups and liquids or stir beverages.',
    order: 4
  },
  {
    id: 'obj_05',
    name: 'CUP',
    displayName: 'Cup',
    imageUrl: '',
    conventionalFunction: 'A cup is commonly used to hold and drink liquid beverages.',
    order: 5
  },
  {
    id: 'obj_06',
    name: 'RUBBER_BAND',
    displayName: 'Rubber Band',
    imageUrl: '',
    conventionalFunction: 'A rubber band is commonly used to bind or hold multiple loose items together.',
    order: 6
  }
];
