# Guideline: Rust Platform API Service Skeleton

- **Task ID:** `TSK-01-02`
- **Phase:** Phase 1
- **Domain:** Backend Service Architecture

---

## Architectural Principles & Invariants

1. **Strict Layered Separation:**
   - `handlers`: Axum routes and HTTP request/response DTOs.
   - `services`: Application logic and orchestration.
   - `domain`: Core domain models and business invariants (pure Rust, no framework dependencies).
   - `repository`: SQLx queries and persistence logic.

2. **Error Handling Contract:**
   - Centralized `PlatformError` enum using `thiserror`.
   - Never expose raw database stack traces or SQL errors in client responses.
   - Map domain errors strictly to standardized HTTP status codes with structured JSON error bodies.

3. **Structured Tracing & Observability:**
   - `tracing` with JSON subscriber for production and ANSI colors for local dev.
   - Every request carries an `x-request-id` header passed through tracing spans.
