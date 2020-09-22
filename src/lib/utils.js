export function makeCamelCaseAlias(snakeColumnName) {
  if (snakeColumnName[0] === '_'
   || snakeColumnName.slice(-1) === '_') {
    return '';
  }
  return snakeColumnName.split('_')
    .map((part, index) => (index > 0 ? `${part[0].toUpperCase()}${part.slice(1)}` : part))
    .join('');
}

export function camelToSnakeCase(camelCase) {
  return camelCase.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

export function mapItemToKey(setFunction, array, getKey) {
  array.forEach((item) => setFunction(getKey(item), item));
}

export function createMapFromArray(array, getKey) {
  const dict = new Map();
  array.forEach((item) => {
    dict.set(getKey(item), { ...item });
  });
  return dict;
}

export function attachPropAsArrayToMap(map, array, getKey, prop) {
  array.forEach((item) => {
    const key = getKey(item);
    const mapItem = map.get(key);
    mapItem[prop] = mapItem[prop] || [];
    mapItem[prop].push(item);
  });
}

export function attachPropAsArrayToObject(obj, key, array) {
  array.forEach((item) => {
    obj[key] = obj[key] || [];
    obj[key].push(item);
  });
}

export function trimFields(obj) {
  return Object.entries(obj).reduce((fields, [key, value]) => {
    fields[key] = value.trim();
    return fields;
  }, {});
}

export function genEmailVerificationCode() {
  return `${getRandomNumberBetween(100000, 999999)}`;
}

function getRandomNumberBetween(min,max){
  return Math.floor(Math.random()*(max-min+1)+min);
}

export default {
  makeCamelCaseAlias,
  camelToSnakeCase,
  mapItemToKey,
  createMapFromArray,
  attachPropAsArrayToMap,
  attachPropAsArrayToObject,
  trimFields,
  genEmailVerificationCode,
};
