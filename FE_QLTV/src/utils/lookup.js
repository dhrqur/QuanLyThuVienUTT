export function createLookup(items, keyField, valueField) {
  return Object.fromEntries(items.map((item) => [item[keyField], item[valueField]]));
}
