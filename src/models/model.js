import { makeCamelCaseAlias, camelToSnakeCase } from '../lib/utils';

export class DOAError extends Error {
  constructor({ type, message }) {
    super(message);
    this.type = type;
    this.message = message;
  }
}

const baseModel = {
  makeDOACamelCase: function makeDOACamelCase(res) {
    return res.map((row) => Object.entries(row).reduce((DOA, [key, value]) => {
      const camelCaseKey = makeCamelCaseAlias(key);
      return {
        ...DOA,
        [camelCaseKey]: value,
      };
    }, {}));
  },
  makeDOASnakeCase: function makeDOASnakeCase(dataObject) {
    return Object.entries(dataObject).reduce((DOA, [key, value]) => {
      const camelCaseKey = camelToSnakeCase(key);
      return {
        ...DOA,
        [camelCaseKey]: value,
      };
    }, {});
  },
  safeQuery: async function safeQuery(q) {
    let res;
    try {
      res = await q;
    } catch (e) {
      if (new RegExp(/no such column/).test(e.message)) {
        return [];
      }
    }
    return this.makeDOACamelCase(res);
  },
  safeInsert: async function safeInsert(q) {
    let res;
    try {
      res = await q;
    } catch (e) {
      if (new RegExp(/NOT NULL constraint failed/).test(e.message)) {
        const field = e.message.split(/NOT NULL constraint failed/)[1].split('.')[1];
        throw new DOAError({ type: 'insert', message: `Missing required field(s): ${field}` });
      }
      if (new RegExp(/UNIQUE constraint failed/).test(e.message)) {
        const field = e.message.split(/UNIQUE constraint failed/)[1].split('.')[1];
        throw new DOAError({ type: 'insert', message: `Field(s) provided: (${field}) is duplicated` });
      }
      throw e;
    }
    return res;
  },
};

export default baseModel;
