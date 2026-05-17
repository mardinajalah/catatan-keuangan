const FALLBACK_CATEGORY = 'Lainnya';

export const normalizeCategory = (value?: string | null) => {
  const normalized = (value ?? '')
    .normalize('NFC')
    .replace(/\s+/g, ' ')
    .trim();

  return normalized || FALLBACK_CATEGORY;
};

export const getCategoryKey = (value?: string | null) =>
  normalizeCategory(value).toLocaleLowerCase('id-ID');
