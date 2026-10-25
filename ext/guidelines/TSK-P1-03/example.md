# Examples: Context7 MCP Tool Calls

- **Task ID:** `TSK-P1-03`
- **Domain:** MCP Interaction

---

## 1. Resolving Library ID (Axum)

```json
{
  "ServerName": "context7",
  "ToolName": "resolve-library-id",
  "Arguments": {
    "libraryName": "axum",
    "query": "router state extractor and middleware handlers"
  }
}
```

*Response:*
```json
{
  "libraryId": "/tokio-rs/axum",
  "description": "Ergonomic and modular web framework built with Tokio, Tower, and Hyper"
}
```

---

## 2. Querying Live Documentation

```json
{
  "ServerName": "context7",
  "ToolName": "query-docs",
  "Arguments": {
    "libraryId": "/tokio-rs/axum",
    "query": "How to pass application state to handlers using State extractor"
  }
}
```
