# Examples: Security Resolver & WCAG Contrast Formula

- **Task ID:** `TSK-0A-02`
- **Domain:** Security & Accessibility Implementation

---

## 1. Mathematical Contrast Calculation

Relative luminance formula for sRGB:
$$L = 0.2126 \times R + 0.7152 \times G + 0.0722 \times B$$
Where each channel $C \in \{R, G, B\}$ is converted from $c = C_{\text{srgb}} / 255$:
$$C = \begin{cases} \frac{c}{12.92} & c \le 0.04045 \\ \left(\frac{c + 0.055}{1.055}\right)^{2.4} & c > 0.04045 \end{cases}$$

Contrast Ratio:
$$\text{Ratio} = \frac{L_1 + 0.05}{L_2 + 0.05} \quad (L_1 > L_2)$$

---

## 2. Custom DNS Pinning & SSRF IP Validation (Rust)

```rust
use std::net::IpAddr;

pub fn is_disallowed_ip(ip: IpAddr) -> bool {
    match ip {
        IpAddr::V4(v4) => {
            v4.is_loopback()            // 127.0.0.0/8
            || v4.is_private()           // 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16
            || v4.is_link_local()        // 169.254.0.0/16 (AWS metadata 169.254.169.254)
            || v4.is_broadcast()
            || v4.is_documentation()
        }
        IpAddr::V6(v6) => {
            v6.is_loopback()
            || v6.is_unicast_link_local()
        }
    }
}
```
