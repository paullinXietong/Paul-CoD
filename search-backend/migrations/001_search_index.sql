CREATE TABLE IF NOT EXISTS product_search_products (
  offer_id VARCHAR(96) NOT NULL,
  source VARCHAR(32) NOT NULL DEFAULT '',
  subject TEXT NULL,
  subject_trans TEXT NULL,
  image_url TEXT NULL,
  top_category_id VARCHAR(64) NULL,
  second_category_id VARCHAR(64) NULL,
  third_category_id VARCHAR(64) NULL,
  source_price DECIMAL(18,4) NULL,
  promotion_price DECIMAL(18,4) NULL,
  min_order_quantity INT NULL,
  month_sold INT NULL,
  repurchase_rate DECIMAL(8,4) NULL,
  one_piece_dropshipping TINYINT(1) NOT NULL DEFAULT 0,
  shipping_included TINYINT(1) NOT NULL DEFAULT 0,
  online_invoice TINYINT(1) NOT NULL DEFAULT 0,
  fast_invoice TINYINT(1) NOT NULL DEFAULT 0,
  dispatch_guarantee VARCHAR(64) NULL,
  trade_score DECIMAL(8,4) NULL,
  service_score DECIMAL(8,4) NULL,
  trade_medal_level INT NULL,
  seller_identities JSON NULL,
  offer_identities JSON NULL,
  source_modified_at VARCHAR(64) NULL,
  raw_json JSON NOT NULL,
  indexed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (offer_id, source),
  KEY idx_product_price (source_price),
  KEY idx_product_moq (min_order_quantity),
  KEY idx_product_sales (month_sold),
  KEY idx_product_trade_score (trade_score),
  KEY idx_product_category (top_category_id, second_category_id, third_category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS product_search_query_memberships (
  query_hash CHAR(64) NOT NULL,
  normalized_keyword VARCHAR(255) NOT NULL,
  category_id VARCHAR(64) NOT NULL DEFAULT '',
  offer_id VARCHAR(96) NOT NULL,
  source VARCHAR(32) NOT NULL DEFAULT '',
  source_rank INT NOT NULL DEFAULT 0,
  indexed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (query_hash, offer_id, source),
  KEY idx_membership_product (offer_id, source),
  KEY idx_membership_query_rank (query_hash, source_rank)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS product_search_attributes (
  offer_id VARCHAR(96) NOT NULL,
  source VARCHAR(32) NOT NULL DEFAULT '',
  category_id VARCHAR(64) NULL,
  attribute_id VARCHAR(96) NOT NULL,
  attribute_name VARCHAR(255) NOT NULL,
  attribute_value VARCHAR(500) NOT NULL,
  normalized_name VARCHAR(255) NOT NULL,
  normalized_value VARCHAR(500) NOT NULL,
  indexed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (offer_id, source, attribute_id, normalized_value),
  KEY idx_attribute_facet (category_id, normalized_name, normalized_value(128))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS product_search_inventory (
  offer_id VARCHAR(96) NOT NULL,
  source VARCHAR(32) NOT NULL DEFAULT '',
  total_inventory INT NULL,
  has_tier_pricing TINYINT(1) NOT NULL DEFAULT 0,
  tier_pricing_json JSON NULL,
  origin VARCHAR(255) NULL,
  weight_grams DECIMAL(18,4) NULL,
  volume_cm3 DECIMAL(18,4) NULL,
  certificate_types JSON NULL,
  indexed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (offer_id, source),
  KEY idx_inventory_stock (total_inventory),
  KEY idx_inventory_origin (origin)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS product_search_supplier_profiles (
  supplier_key VARCHAR(255) NOT NULL,
  company_name VARCHAR(500) NULL,
  years_in_business INT NULL,
  audit_status VARCHAR(64) NULL,
  audit_provider VARCHAR(255) NULL,
  audit_date DATE NULL,
  average_response_minutes INT NULL,
  sample_available TINYINT(1) NULL,
  production_lead_time_min_days INT NULL,
  production_lead_time_max_days INT NULL,
  oem_supported TINYINT(1) NULL,
  odm_supported TINYINT(1) NULL,
  private_label_supported TINYINT(1) NULL,
  source_name VARCHAR(255) NOT NULL,
  source_reference TEXT NULL,
  verified_at DATETIME NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (supplier_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS product_search_jobs (
  query_hash CHAR(64) NOT NULL,
  normalized_keyword VARCHAR(255) NOT NULL,
  category_id VARCHAR(64) NOT NULL DEFAULT '',
  status ENUM('pending', 'running', 'complete', 'failed') NOT NULL DEFAULT 'pending',
  indexed_products INT NOT NULL DEFAULT 0,
  expected_products INT NOT NULL DEFAULT 0,
  detail_indexed_products INT NOT NULL DEFAULT 0,
  retry_count INT NOT NULL DEFAULT 0,
  last_error TEXT NULL,
  started_at DATETIME NULL,
  completed_at DATETIME NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (query_hash),
  KEY idx_job_status (status, updated_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
