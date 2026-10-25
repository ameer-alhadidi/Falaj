# Containerfile for Platform API (Multi-stage rootless build)
FROM docker.io/library/rust:1.85-alpine AS builder

RUN apk add --no-cache musl-dev pkgconfig

WORKDIR /app
COPY Cargo.toml Cargo.lock ./
COPY crates/ crates/
COPY services/platform-api/ services/platform-api/

RUN cargo build --release -p platform-api

FROM docker.io/library/alpine:3.21 AS runtime

RUN apk add --no-cache ca-certificates tzdata

# Create unprivileged platform user
RUN addgroup -S platform && adduser -S platform -G platform
USER platform

WORKDIR /home/platform

COPY --from=builder /app/target/release/platform-api /usr/local/bin/platform-api

ENV HOST="0.0.0.0"
ENV PORT="8080"
ENV RUST_LOG="info,platform_api=debug"

EXPOSE 8080

ENTRYPOINT ["/usr/local/bin/platform-api"]
