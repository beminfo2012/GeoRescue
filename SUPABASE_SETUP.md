# GeoRescue - Guia de Setup Supabase

## 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Faça login ou crie uma conta
3. Clique em "New Project"
4. Preencha:
   - **Name**: GeoRescue
   - **Database Password**: Escolha uma senha forte
   - **Region**: South America (São Paulo) - mais próximo
5. Aguarde a criação do projeto (~2 minutos)

## 2. Executar Schema SQL

1. No dashboard do projeto, vá em **SQL Editor** (menu lateral)
2. Clique em **New Query**
3. Copie todo o conteúdo do arquivo `supabase/schema.sql`
4. Cole no editor SQL
5. Clique em **Run** (ou pressione Ctrl+Enter)
6. Verifique se apareceu "Success. No rows returned"

## 3. Obter Credenciais

1. Vá em **Settings** → **API** (menu lateral)
2. Copie os seguintes valores:

### Project URL
```
https://xxxxxxxxxxxxx.supabase.co
```

### anon public (API Key)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### service_role (Secret Key)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **IMPORTANTE**: A `service_role` key é secreta! Nunca commit no Git.

## 4. Configurar .env.local

Crie o arquivo `.env.local` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 5. Criar Primeiro Usuário

### Opção A: Via Dashboard (Recomendado)

1. Vá em **Authentication** → **Users**
2. Clique em **Add User** → **Create new user**
3. Preencha:
   - **Email**: seu@email.com
   - **Password**: SuaSenhaSegura123
   - **Auto Confirm User**: ✅ Marque esta opção
4. Clique em **Create User**

### Opção B: Desabilitar Confirmação de Email

1. Vá em **Authentication** → **Providers**
2. Clique em **Email**
3. Desabilite **Confirm email**
4. Salve

Agora você pode criar usuários que não precisam confirmar email.

## 6. Testar Conexão

Execute no terminal:

```bash
npm run process-csv
```

Se funcionar, você verá:
```
✅ Processed 21583 valid installations
💾 Saved to installations.json
```

Depois execute:

```bash
npm run seed-db
```

Você deve ver:
```
✅ Inserted batch 1/22 (1000 total)
✅ Inserted batch 2/22 (2000 total)
...
🎉 Database seeding complete!
```

## 7. Verificar Dados

1. No Supabase, vá em **Table Editor**
2. Selecione a tabela `electrical_installations`
3. Você deve ver 21.583 registros

## 8. Configurar RLS (Row Level Security)

As policies já foram criadas pelo schema.sql, mas você pode verificar:

1. Vá em **Authentication** → **Policies**
2. Selecione `electrical_installations`
3. Deve ter 2 policies:
   - "Allow authenticated users to read installations"
   - "Allow service role to manage installations"

## Troubleshooting

### Erro: "relation does not exist"
- Execute novamente o schema.sql
- Verifique se está no projeto correto

### Erro: "Invalid API key"
- Verifique se copiou a chave correta
- Confirme que não há espaços extras no .env.local
- Reinicie o servidor de desenvolvimento

### Erro: "row-level security policy"
- Verifique se as policies foram criadas
- Confirme que o usuário está autenticado
- Para testes, você pode desabilitar RLS temporariamente

### Seed demora muito
- Normal para 21k+ registros
- Pode levar 2-5 minutos
- Não interrompa o processo

## Próximos Passos

Após configurar tudo:

1. Execute `npm run dev`
2. Acesse http://localhost:3000
3. Faça login com o usuário criado
4. Aguarde a sincronização inicial
5. Teste as buscas!

## Backup e Migração

### Exportar dados
```bash
# No Supabase Dashboard
Table Editor → electrical_installations → Export → CSV
```

### Importar em outro projeto
1. Crie novo projeto
2. Execute schema.sql
3. Use o script seed-db com os dados exportados
