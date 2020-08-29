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

export default {
  makeCamelCaseAlias,
  camelToSnakeCase,
};
