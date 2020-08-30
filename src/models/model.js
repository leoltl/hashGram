import { makeCamelCaseAlias, camelToSnakeCase } from '../lib/utils';

export class DOAError extends Error {
  constructor({ type, message }) {
    super(message);
    this.type = type;
    this.message = message;
  }
}

const baseModel = {
  makeDOACamelCase: function makeDOACamelCase(dbRows) {
    return dbRows.map((row) => Object.entries(row).reduce((DOA, [key, value]) => {
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
  addTableNameToId: function addTableNameToId(dataObject, tableName) {
    if ('id' in dataObject) {
      const { id, ...rest } = dataObject;
      return { [`${tableName}.id`]: id, ...rest };
    }
    return dataObject;
  },
  safeQuery: async function safeQuery(query, where = null) {
    let res;
    // const currentTable = query.toSQL().sql.match(new RegExp(/from `([^`]*)`/))[1];
    // eslint-disable-next-line no-underscore-dangle
    const currentTable = query._single.table;
    try {
      res = await (where
        ? query.where(this.makeDOASnakeCase(this.addTableNameToId(where, currentTable)))
        : query);
    } catch (e) {
      if (new RegExp(/no such column/).test(e.message)) {
        return [];
      }
      throw e;
    }
    return this.makeDOACamelCase(res);
  },
  safeInsert: async function safeInsert(query, dataObject) {
    let res;
    try {
      res = await query.insert(this.makeDOASnakeCase(dataObject));
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
