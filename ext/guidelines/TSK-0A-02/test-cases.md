# Test Cases: Security, RFC 9535 & Accessibility

- **Task ID:** `TSK-0A-02`
- **Domain:** Verification Tests

---

## Security & Path Grammar Test Cases

```rust
#[test]
fn test_ssrf_disallows_private_and_metadata_addresses() {
    use std::net::Ipv4Addr;
    assert!(is_disallowed_ip(IpAddr::V4(Ipv4Addr::new(127, 0, 0, 1))));
    assert!(is_disallowed_ip(IpAddr::V4(Ipv4Addr::new(10, 0, 0, 5))));
    assert!(is_disallowed_ip(IpAddr::V4(Ipv4Addr::new(169, 254, 169, 254))));
    assert!(is_disallowed_ip(IpAddr::V4(Ipv4Addr::new(192, 168, 1, 1))));
    
    // Public IP allowed
    assert!(!is_disallowed_ip(IpAddr::V4(Ipv4Addr::new(93, 184, 216, 34))));
}
```

```typescript
describe('WCAG 2.2 AA Contrast Calculations', () => {
  it('TC-WCAG-01: Verifies dark mode muted text exceeds 4.5:1', () => {
    const ratio = calculateContrastRatio('#94a3b8', '#090a0f');
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it('TC-WCAG-02: Verifies light mode muted text exceeds 4.5:1', () => {
    const ratio = calculateContrastRatio('#64748b', '#ffffff');
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });
});
```
