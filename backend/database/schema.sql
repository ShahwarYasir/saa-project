CREATE DATABASE IF NOT EXISTS saa_project
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE saa_project;

CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL,
  phone VARCHAR(30) NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('student', 'admin') NOT NULL DEFAULT 'student',
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  registered_at DATE NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email),
  KEY idx_users_role_status (role, status),
  KEY idx_users_registered_at (registered_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS profiles (
  user_id INT UNSIGNED NOT NULL,
  nationality VARCHAR(100) NULL,
  current_country VARCHAR(100) NULL,
  current_qualification VARCHAR(150) NULL,
  gpa DECIMAL(3,2) NULL,
  field_of_interest VARCHAR(150) NULL,
  degree_level VARCHAR(50) NULL,
  preferred_countries JSON NULL,
  annual_budget_usd DECIMAL(12,2) NULL,
  ielts_score DECIMAL(3,1) NULL,
  toefl_score DECIMAL(5,1) NULL,
  other_languages VARCHAR(150) NULL,
  needs_scholarship TINYINT(1) NOT NULL DEFAULT 0,
  target_intake VARCHAR(80) NULL,
  ranking_preference VARCHAR(80) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id),
  CONSTRAINT fk_profiles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT chk_profiles_gpa CHECK (gpa IS NULL OR (gpa >= 0 AND gpa <= 4)),
  CONSTRAINT chk_profiles_budget CHECK (annual_budget_usd IS NULL OR annual_budget_usd >= 0),
  CONSTRAINT chk_profiles_ielts CHECK (ielts_score IS NULL OR (ielts_score >= 0 AND ielts_score <= 9)),
  CONSTRAINT chk_profiles_toefl CHECK (toefl_score IS NULL OR (toefl_score >= 0 AND toefl_score <= 120))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS universities (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(150) NOT NULL,
  country VARCHAR(100) NOT NULL,
  city VARCHAR(100) NULL,
  ranking INT UNSIGNED NULL,
  programs JSON NULL,
  tuition_fee_usd DECIMAL(12,2) NOT NULL DEFAULT 0,
  gpa_requirement DECIMAL(3,2) NULL,
  ielts_requirement DECIMAL(3,1) NULL,
  application_deadline DATE NULL,
  degree_levels JSON NULL,
  match_score TINYINT UNSIGNED NULL,
  website VARCHAR(255) NULL,
  portal_url VARCHAR(255) NULL,
  description TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_universities_country (country),
  KEY idx_universities_ranking (ranking),
  KEY idx_universities_deadline (application_deadline),
  CONSTRAINT chk_universities_tuition CHECK (tuition_fee_usd >= 0),
  CONSTRAINT chk_universities_gpa CHECK (gpa_requirement IS NULL OR (gpa_requirement >= 0 AND gpa_requirement <= 4)),
  CONSTRAINT chk_universities_ielts CHECK (ielts_requirement IS NULL OR (ielts_requirement >= 0 AND ielts_requirement <= 9)),
  CONSTRAINT chk_universities_match CHECK (match_score IS NULL OR match_score <= 100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS scholarships (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(150) NOT NULL,
  provider VARCHAR(120) NOT NULL,
  funding_country VARCHAR(100) NULL,
  country VARCHAR(100) NULL,
  coverage VARCHAR(50) NULL,
  coverage_type VARCHAR(50) NULL,
  amount VARCHAR(255) NULL,
  eligible_nationalities JSON NULL,
  eligibility_summary TEXT NULL,
  eligibility TEXT NULL,
  degree_levels JSON NULL,
  deadline DATE NULL,
  application_deadline DATE NULL,
  details TEXT NULL,
  link VARCHAR(255) NULL,
  portal_url VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_scholarships_country (funding_country),
  KEY idx_scholarships_coverage (coverage),
  KEY idx_scholarships_deadline (deadline)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS shortlists (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id INT UNSIGNED NOT NULL,
  entity_type ENUM('university', 'scholarship') NOT NULL,
  entity_id INT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_shortlists_user_entity (user_id, entity_type, entity_id),
  KEY idx_shortlists_entity (entity_type, entity_id),
  CONSTRAINT fk_shortlists_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS roadmap_milestones (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id INT UNSIGNED NOT NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT NULL,
  suggested_date DATE NULL,
  deadline DATE NULL,
  status ENUM('Not Started', 'In Progress', 'Done') NOT NULL DEFAULT 'Not Started',
  display_order INT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_roadmap_user_order (user_id, display_order),
  CONSTRAINT fk_roadmap_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS templates (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(150) NOT NULL,
  description TEXT NULL,
  category VARCHAR(80) NULL,
  formats JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_templates_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS documents (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id INT UNSIGNED NOT NULL,
  document_type VARCHAR(80) NOT NULL,
  content MEDIUMTEXT NOT NULL,
  word_count INT UNSIGNED NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  KEY idx_documents_user_type (user_id, document_type),
  CONSTRAINT fk_documents_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
