-- ========================================
-- SEQUENCES
-- ========================================

CREATE SEQUENCE seq_cod_produto START 1;
CREATE SEQUENCE seq_cod_pedido START 1;

-- ========================================
-- TABELAS
-- ========================================

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,
    cod_produto VARCHAR(20) UNIQUE NOT NULL,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT,
    preco NUMERIC(10,2) NOT NULL,
    estoque INTEGER NOT NULL CHECK (estoque >= 0),
    imagem TEXT,
    categoria_id INTEGER REFERENCES categorias(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cupons (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    desconto NUMERIC(5,2) NOT NULL CHECK (desconto > 0),
    ativo BOOLEAN DEFAULT TRUE
);

CREATE TABLE pedidos (
    id SERIAL PRIMARY KEY,
    cod_pedido VARCHAR(20) UNIQUE NOT NULL,
    usuario_id INTEGER REFERENCES usuarios(id),
    total NUMERIC(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDENTE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE itens_pedido (
    id SERIAL PRIMARY KEY,
    pedido_id INTEGER REFERENCES pedidos(id) ON DELETE CASCADE,
    produto_id INTEGER REFERENCES produtos(id),
    quantidade INTEGER NOT NULL CHECK (quantidade > 0),
    preco_unitario NUMERIC(10,2) NOT NULL
);

CREATE TABLE favoritos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    produto_id INTEGER REFERENCES produtos(id) ON DELETE CASCADE
);

CREATE TABLE carrinho (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    produto_id INTEGER REFERENCES produtos(id) ON DELETE CASCADE,
    quantidade INTEGER NOT NULL CHECK (quantidade > 0)
);

-- ========================================
-- TRIGGERS
-- ======================================== 

CREATE OR REPLACE FUNCTION gerar_cod_produto()
RETURNS TRIGGER AS $$
BEGIN
    NEW.cod_produto := 'PRD' || LPAD(nextval('seq_cod_produto')::TEXT, 3, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_cod_produto
BEFORE INSERT ON produtos
FOR EACH ROW
EXECUTE FUNCTION gerar_cod_produto();

CREATE OR REPLACE FUNCTION gerar_cod_pedido()
RETURNS TRIGGER AS $$
BEGIN
    NEW.cod_pedido := 'PED' || LPAD(nextval('seq_cod_pedido')::TEXT, 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_cod_pedido
BEFORE INSERT ON pedidos
FOR EACH ROW
EXECUTE FUNCTION gerar_cod_pedido();

-- ========================================
-- INSERTS (mínimo 10 por entidade principal)
-- ========================================

-- USUARIOS
INSERT INTO usuarios (nome, email, senha) VALUES
('João Silva','joao.silva@email.com','123456'),
('Maria Oliveira','maria.oliveira@email.com','123456'),
('Pedro Santos','pedro.santos@email.com','123456'),
('Lucas Almeida','lucas.almeida@email.com','123456'),
('Ana Costa','ana.costa@email.com','123456'),
('Fernanda Lima','fernanda.lima@email.com','123456'),
('Rafael Souza','rafael.souza@email.com','123456'),
('Camila Rocha','camila.rocha@email.com','123456'),
('Bruno Martins','bruno.martins@email.com','123456'),
('Juliana Ferreira','juliana.ferreira@email.com','123456');

-- CATEGORIAS
INSERT INTO categorias (nome) VALUES
('Futebol'),
('Basquete'),
('Corrida'),
('Masculino'),
('Feminino'),
('Infantil'),
('Calçados'),
('Acessórios'),
('Suplementos'),
('Promoções');

-- PRODUTOS (cod_produto gerado automaticamente)
INSERT INTO produtos (nome, descricao, preco, estoque, categoria_id) VALUES
('Camisa São Paulo 24/25','Camisa oficial temporada 24/25',199.90,50,1),
('Camisa Palmeiras 96/97','Modelo retrô temporada 96/97',219.90,30,1),
('Camisa Corinthians 19/20','Camisa oficial 19/20',189.90,40,1),
('Regata Lakers 23/24','Regata oficial NBA',499.90,20,2),
('Regata Boston Celtics','Modelo clássico Celtics',479.90,25,2),
('Tênis Nike Run','Tênis ideal para corrida',399.90,35,7),
('Tênis Puma Carina','Modelo feminino casual',349.90,45,7),
('Blusão Puma Squad','Moletom feminino',279.90,15,5),
('Conjunto Infantil Inter','Conjunto infantil completo',149.90,60,6),
('Kit Meias Puma','Kit com 3 pares',79.90,100,8);

-- CUPONS
INSERT INTO cupons (codigo, desconto) VALUES
('GRENA10',10),
('FUTEBOL15',15),
('BASQUETE20',20),
('RUN5',5),
('PROMO25',25),
('DESCONTO30',30),
('CLIENTE5',5),
('OFERTA12',12),
('VIP18',18),
('SUPER50',50);

-- PEDIDOS (cod_pedido gerado automaticamente)
INSERT INTO pedidos (usuario_id, total, status) VALUES
(1,199.90,'PAGO'),
(2,349.90,'PENDENTE'),
(3,479.90,'PAGO'),
(4,219.90,'ENVIADO'),
(5,149.90,'PAGO'),
(6,399.90,'CANCELADO'),
(7,189.90,'PAGO'),
(8,279.90,'PENDENTE'),
(9,499.90,'PAGO'),
(10,79.90,'PAGO');