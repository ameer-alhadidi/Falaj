# Examples: Quality Gate Configuration Files

- **Task ID:** `TSK-P1-02`
- **Domain:** Toolchain Configuration

---

## 1. Cargo Deny Configuration (`deny.toml` snippet)

```toml
[licenses]
unlicensed = "deny"
allow = [
    "MIT",
    "Apache-2.0",
    "BSD-3-Clause",
    "Unicode-DFS-2016"
]
confidence-threshold = 0.8

[advisories]
vulnerability = "deny"
unmaintained = "warn"
yanked = "warn"

[bans]
multiple-versions = "warn"
wildcards = "deny"
```

---

## 2. Clippy Workspace Flags (`Cargo.toml` snippet)

```toml
[workspace.lints.clippy]
all = { level = "deny", priority = -1 }
unwrap_used = "deny"
expect_used = "deny"
panic = "deny"
```
