# CoDropshipping Search API

This service provides complete-result procurement filters without changing the legacy product API.

## Runtime behavior

- First-time searches return the upstream catalog immediately.
- A bounded worker indexes the remaining result pages in MySQL.
- Price, MOQ, monthly sales, fulfillment and supplier-score filters are enabled only when the query index is complete.
- Product details are indexed with a separate one-request-at-a-time worker. Category attributes remain disabled until detail coverage reaches the configured threshold (90% by default).
- Supplier years, audit status, response time and OEM/ODM claims require authenticated supplier-profile data.

## Local start

Copy `.env.example` to a local environment file, supply a dedicated least-privilege MySQL account, then run:

```sh
npm install
npm start
```

The health endpoint is `GET /health`. Public search is `POST /v1/search`. Supplier-profile imports require `Authorization: Bearer <SEARCH_ADMIN_TOKEN>`.
