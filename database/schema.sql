CREATE DATABASE IF NOT EXISTS estoque_facil 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE estoque_facil;

CREATE TABLE IF NOT EXISTS empresas (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  documento VARCHAR(20) NOT NULL,
  atividade VARCHAR(100) NOT NULL,
  cep VARCHAR(8) NOT NULL,
  endereco VARCHAR(200) NOT NULL,
  cidade VARCHAR(100) NOT NULL,
  estado CHAR(2) NOT NULL,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX empresas_documento_idx (documento)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS usuarios (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  empresa_id BIGINT UNSIGNED NOT NULL,
  nome_completo VARCHAR(150) NOT NULL,
  nome_usuario VARCHAR(60) NOT NULL,
  email VARCHAR(150) NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  perfil ENUM('master', 'admin', 'usuario') NOT NULL DEFAULT 'usuario',
  status ENUM('ativo', 'inativo', 'bloqueado') NOT NULL DEFAULT 'ativo',
  ultimo_login_em TIMESTAMP NULL,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY usuarios_nome_usuario_unico (nome_usuario),
  UNIQUE KEY usuarios_email_unico (email),
  INDEX usuarios_empresa_idx (empresa_id),
  CONSTRAINT usuarios_empresa_fk FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS produtos (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  empresa_id BIGINT UNSIGNED NOT NULL,
  nome VARCHAR(150) NOT NULL,
  categoria VARCHAR(100) NOT NULL,
  marca VARCHAR(100) NOT NULL DEFAULT '',
  modelo VARCHAR(120) NOT NULL DEFAULT '',
  sku VARCHAR(80) NULL,
  quantidade INT UNSIGNED NOT NULL DEFAULT 0,
  preco_custo DECIMAL(12,2) UNSIGNED NOT NULL DEFAULT 0,
  preco_venda DECIMAL(12,2) UNSIGNED NOT NULL DEFAULT 0,
  quantidade_entrada INT UNSIGNED NOT NULL DEFAULT 0,
  quantidade_saida INT UNSIGNED NOT NULL DEFAULT 0,
  url_imagem VARCHAR(2000) NULL,
  criado_por BIGINT UNSIGNED NOT NULL,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY produtos_empresa_sku_unico (empresa_id, sku),
  INDEX produtos_empresa_categoria_idx (empresa_id, categoria),
  CONSTRAINT produtos_empresa_fk FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
  CONSTRAINT produtos_criado_por_fk FOREIGN KEY (criado_por) REFERENCES usuarios(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS movimentacoes_estoque (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  empresa_id BIGINT UNSIGNED NOT NULL,
  produto_id BIGINT UNSIGNED NOT NULL,
  usuario_id BIGINT UNSIGNED NOT NULL,
  tipo ENUM('entrada', 'saida', 'ajuste') NOT NULL,
  quantidade INT UNSIGNED NOT NULL,
  observacoes VARCHAR(255) NULL,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX movimentacoes_empresa_produto_idx (empresa_id, produto_id),
  CONSTRAINT movimentacoes_empresa_fk FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
  CONSTRAINT movimentacoes_produto_fk FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE,
  CONSTRAINT movimentacoes_usuario_fk FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS logs_auditoria (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  empresa_id BIGINT UNSIGNED NOT NULL,
  usuario_id BIGINT UNSIGNED NULL,
  acao VARCHAR(80) NOT NULL,
  tipo_entidade VARCHAR(60) NOT NULL,
  entidade_id BIGINT UNSIGNED NULL,
  metadados JSON NULL,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX auditoria_empresa_criado_idx (empresa_id, criado_em),
  CONSTRAINT auditoria_empresa_fk FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
  CONSTRAINT auditoria_usuario_fk FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB;
