// Number handling shared by ingest.mjs and check.mjs.

// Every number as the text writes it: "12,400", "0.500", "-3", "62".
export const numbersIn = (text) => String(text).match(/[-−]?\d[\d,]*(?:\.\d+)?/g) || [];

// Two spellings of the same value compare equal: "12,400" and "12400", "−3" and "-3".
// Trailing zeros are kept on purpose: "0.50" on screen for a source "0.5" is a change.
export const normalise = (raw) => String(raw).replace(/,/g, '').replace('−', '-').replace(/^-(?=0+(\.0+)?$)/, '');
