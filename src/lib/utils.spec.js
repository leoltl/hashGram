import { makeCamelCaseAlias, camelToSnakeCase } from './utils';

describe('makeCamelCaseAlias', () => {
  it('happy path', () => {
    expect(makeCamelCaseAlias('first_name')).toBe('firstName');
  });

  it('handles words without _', () => {
    expect(makeCamelCaseAlias('email')).toBe('email');
  });

  it('handles invalid cases', () => {
    expect(makeCamelCaseAlias('_first_name')).toBe('');
    expect(makeCamelCaseAlias('first_name_')).toBe('');
  });
});

describe('camelToSnakeCase', () => {
  it('happy path', () => {
    expect(camelToSnakeCase('firstName')).toBe('first_name');
  });
});
