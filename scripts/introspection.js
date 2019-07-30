const {resolve, dirname} = require('path');
const glob = require('glob');
const {graphql, buildSchema, introspectionQuery} = require('graphql');
const {readFile, writeFile} = require('fs-extra');

glob
  .sync(resolve(__dirname, '../packages/*/test/fixtures/**/schema.graphql'))
  .forEach((schemaFile) => {
    readFile(schemaFile, 'utf8')
      .then((schemaContents) => buildSchema(schemaContents))
      .then((schema) => graphql(schema, introspectionQuery))
      .then((results) =>
        writeFile(
          resolve(dirname(schemaFile), 'schema.json'),
          JSON.stringify(results, null, 2),
        ),
      )
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error);
        process.exitCode = 1;
      });
  });
