//! Database module providing connection pooling and repository layers

pub mod page_repo;
pub mod pool;

pub use page_repo::PageRepository;
pub use pool::create_db_pool;
