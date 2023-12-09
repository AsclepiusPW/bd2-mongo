const neo4j = require('neo4j-driver');

const driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "marcostobias"));
const session = driver.session({ database: "neo4j" });

async function runCypherQuery(query, params) {
  const result = await session.run(query, params);
  return result.records.map(record => record.get(0).properties);
}

module.exports = {
  runCypherQuery,
  driver,
};
