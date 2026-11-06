# Retrieval Metrics Mini Project

Implement `eval.js` to compare keyword and semantic search using Mean Reciprocal Rank (MRR) and Recall@10. The fixture data is provided, so no database or API keys are required.

## Files

- `eval.js`: evaluation program.
- `test-set.csv`: ten queries and their relevant post IDs.
- `search-results.json`: top-10 ranked results for both systems.
- `posts-dataset.csv`: source posts for context.

## Run

```bash
node eval.js
```

## Expected metrics

The assignment's supplied answer key reports keyword MRR 0.30 / Recall@10 0.60 and semantic MRR 0.67 / Recall@10 1.00. The implementation should calculate metrics from the fixture data rather than hard-code these values.
