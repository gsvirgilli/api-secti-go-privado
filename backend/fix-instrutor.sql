-- Criar a tabela instrutor_turma
CREATE TABLE instrutor_turma (
  id INT PRIMARY KEY AUTO_INCREMENT,
  id_instrutor INT,
  id_turma INT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Inserir dados
INSERT INTO instrutor_turma (id_instrutor, id_turma) VALUES
(1, 1), (1, 2), (2, 3), (3, 4), (4, 5);
