// Evaluate keyword and semantic retrieval with MRR and Recall@10.
// Run with: node eval.js
const fs = require('fs');

// --- 1. Load the inputs -----------------------------------------------------
function loadTestSet(path) {
  const lines = fs.readFileSync(path, 'utf8').trim().split(/\r?\n/).slice(1);
  return lines.map(line => {
    const [query, ids] = line.split(',');
    return { query, correctIds: ids.split(';').map(Number) };
  });
}
const testSet = loadTestSet('test-set.csv');
const results = JSON.parse(fs.readFileSync('search-results.json', 'utf8'));

// --- 2. Reciprocal Rank -----------------------------------------------------
function reciprocalRank(rankedIds, correctIds) {
  const rank = rankOf(rankedIds, correctIds);
  return rank === null ? 0 : 1 / rank;
}

// Return the 1-based rank of the first correct result, or null for a miss.
function rankOf(rankedIds, correctIds) {
  const index = rankedIds.findIndex(id => correctIds.includes(Number(id)));
  return index === -1 ? null : index + 1;
}

// --- 3. Run the evaluation loop --------------------------------------------
const totals = {
  keyword: { reciprocalRankSum: 0, hits: 0 },
  semantic: { reciprocalRankSum: 0, hits: 0 }
};

const rows = testSet.map(({ query, correctIds }) => {
  const queryResults = results[query];
  if (!queryResults) {
    throw new Error(`Missing search results for query: ${query}`);
  }

  const keywordRank = rankOf(queryResults.keyword, correctIds);
  const semanticRank = rankOf(queryResults.semantic, correctIds);
  const keywordRR = reciprocalRank(queryResults.keyword, correctIds);
  const semanticRR = reciprocalRank(queryResults.semantic, correctIds);

  totals.keyword.reciprocalRankSum += keywordRR;
  totals.semantic.reciprocalRankSum += semanticRR;
  if (keywordRR > 0) totals.keyword.hits += 1;
  if (semanticRR > 0) totals.semantic.hits += 1;

  return { query, keywordRank, semanticRank };
});

const queryCount = testSet.length;
if (queryCount === 0) {
  throw new Error('The test set must contain at least one query.');
}

const keywordMRR = totals.keyword.reciprocalRankSum / queryCount;
const semanticMRR = totals.semantic.reciprocalRankSum / queryCount;
const keywordRecall = totals.keyword.hits / queryCount;
const semanticRecall = totals.semantic.hits / queryCount;

// --- 4. Print the markdown comparison table --------------------------------
console.log('| Query | Keyword rank | Semantic rank |');
console.log('|---|---|---|');
for (const row of rows) {
  console.log(`| ${row.query} | ${row.keywordRank ?? 'miss'} | ${row.semanticRank ?? 'miss'} |`);
}
console.log(
  `| **Summary** | **MRR ${keywordMRR.toFixed(2)} · Recall@10 ${keywordRecall.toFixed(2)}** | **MRR ${semanticMRR.toFixed(2)} · Recall@10 ${semanticRecall.toFixed(2)}** |`
);
