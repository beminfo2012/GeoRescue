-- SOLUÇÃO DEFINITIVA: Permitir INSERT via service_role
-- Execute este SQL no Supabase SQL Editor

-- 1. Desabilitar RLS temporariamente para inserção inicial
ALTER TABLE electrical_installations DISABLE ROW LEVEL SECURITY;

-- 2. Limpar dados existentes (se houver)
TRUNCATE TABLE electrical_installations;

-- Agora execute: npm run seed-db
-- Após a inserção bem-sucedida, volte aqui e execute o resto:

-- 3. Reabilitar RLS
ALTER TABLE electrical_installations ENABLE ROW LEVEL SECURITY;

-- 4. Remover políticas antigas
DROP POLICY IF EXISTS "Allow authenticated users to read installations" ON electrical_installations;
DROP POLICY IF EXISTS "Allow service role to manage installations" ON electrical_installations;
DROP POLICY IF EXISTS "Allow public read access" ON electrical_installations;

-- 5. Criar política para leitura pública
CREATE POLICY "Allow public read access"
  ON electrical_installations
  FOR SELECT
  TO public
  USING (true);

-- 6. Criar política para service role (INSERT, UPDATE, DELETE)
CREATE POLICY "Allow service role full access"
  ON electrical_installations
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 7. Verificar contagem
SELECT COUNT(*) as total FROM electrical_installations;

-- Deve retornar: 21510
