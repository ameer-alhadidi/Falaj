//! Canonical CanvasComponentNode Schema and Tree Invariants
//!
//! Authoritative AST representation for enterprise visual pages.

use serde::{Deserialize, Serialize};
use std::collections::HashMap;

/// 12-Column Responsive Layout Attributes
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct ComponentLayout {
    pub col_start: u32,
    pub col_span: u32,
    pub row_start: u32,
    pub row_span: u32,
}

impl Default for ComponentLayout {
    fn default() -> Self {
        Self {
            col_start: 1,
            col_span: 12,
            row_start: 1,
            row_span: 1,
        }
    }
}

/// Canvas Component Node
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct CanvasComponentNode {
    pub id: String,
    pub component_type: String,
    pub version: u32,
    pub layout: ComponentLayout,
    #[serde(default)]
    pub props: HashMap<String, serde_json::Value>,
    #[serde(default)]
    pub bindings: HashMap<String, String>,
    #[serde(default)]
    pub events: HashMap<String, serde_json::Value>,
    #[serde(default)]
    pub responsive: HashMap<String, serde_json::Value>,
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub children: Vec<CanvasComponentNode>,
}

impl CanvasComponentNode {
    /// Validates that layout coordinates fit within the 12-column constraint
    pub fn validate_layout(&self) -> Result<(), String> {
        if self.layout.col_start < 1 || self.layout.col_start > 12 {
            return Err(format!(
                "Node {} has invalid colStart {}: must be between 1 and 12",
                self.id, self.layout.col_start
            ));
        }
        if self.layout.col_span < 1 || (self.layout.col_start + self.layout.col_span - 1) > 12 {
            return Err(format!(
                "Node {} layout exceeds 12-column boundary (colStart={}, colSpan={})",
                self.id, self.layout.col_start, self.layout.col_span
            ));
        }
        for child in &self.children {
            child.validate_layout()?;
        }
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_valid_layout() {
        let node = CanvasComponentNode {
            id: "node-1".into(),
            component_type: "Button".into(),
            version: 1,
            layout: ComponentLayout {
                col_start: 1,
                col_span: 6,
                row_start: 1,
                row_span: 1,
            },
            props: HashMap::new(),
            bindings: HashMap::new(),
            events: HashMap::new(),
            responsive: HashMap::new(),
            children: vec![],
        };
        assert!(node.validate_layout().is_ok());
    }

    #[test]
    fn test_invalid_layout_overflow() {
        let node = CanvasComponentNode {
            id: "node-invalid".into(),
            component_type: "Table".into(),
            version: 1,
            layout: ComponentLayout {
                col_start: 10,
                col_span: 4, // 10 + 4 - 1 = 13 > 12!
                row_start: 1,
                row_span: 1,
            },
            props: HashMap::new(),
            bindings: HashMap::new(),
            events: HashMap::new(),
            responsive: HashMap::new(),
            children: vec![],
        };
        assert!(node.validate_layout().is_err());
    }
}
