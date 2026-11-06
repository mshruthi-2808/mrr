# Retrieval Metrics Evaluation

This project evaluates keyword search and semantic search against the same ten-query test set using Mean Reciprocal Rank (MRR) and Recall@10. It uses the supplied ranked-result fixtures, so no database or API keys are required.

## Run the evaluation

```bash
node eval.js
```

## Results

```text
| Query | Keyword rank | Semantic rank |
|---|---|---|
| my redis cache keeps showing old data | 8 | 1 |
| how do I add semantic search to a table I already have | miss | 2 |
| redis or memcached for caching | 1 | 2 |
| why did my query get slower after I added an index | miss | 1 |
| what does ACID actually guarantee | 2 | 1 |
| how do I keep my postgres online while changing the schema | 6 | 3 |
| my background jobs stop after every deploy | miss | 2 |
| how do I let my database accept more writes per second | 4 | 1 |
| sql or nosql for a new product | 1 | 3 |
| why does my redis memory keep climbing | miss | 2 |
| **Summary** | **MRR 0.30 · Recall@10 0.60** | **MRR 0.67 · Recall@10 1.00** |
```

## Interpretation

Semantic search performs better overall on both metrics, with an MRR of 0.67 and Recall@10 of 1.00 compared with keyword search's 0.30 and 0.60. Keyword search wins on “redis or memcached for caching” and “sql or nosql for a new product,” which contain precise technical terms and named technologies that are easy to match directly. Semantic search wins on the other eight queries, especially questions phrased as everyday descriptions of technical problems rather than exact document terminology. Its ability to capture intent and related meaning helps it retrieve relevant posts even when the wording differs. A team would still keep keyword search because exact-term matching is valuable for some queries, and combining both approaches can provide stronger hybrid retrieval than relying on either system alone.

## Metrics

- **Reciprocal Rank:** the reciprocal of the 1-based rank of the first relevant result; zero when no relevant result appears in the top 10.
- **MRR:** the mean reciprocal rank across all test queries.
- **Recall@10:** the proportion of test queries for which at least one relevant result appears in the top 10.

The evaluation code computes these metrics from `test-set.csv` and `search-results.json`; the reported values are not hard-coded.
