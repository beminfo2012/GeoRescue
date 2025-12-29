# GeoRescue - Sistema de Busca Defesa Civil

Sistema completo de busca offline-first para agilizar atendimentos da Defesa Civil Municipal de Santa Maria de Jetibá.

## 🚀 Funcionalidades

✅ **Cache IndexedDB** com 21.583 registros de instalações elétricas  
✅ **Detecção automática online/offline**  
✅ **Sincronização inteligente** com fallback automático  
✅ **Indicador visual** de status offline  
✅ **Buscas funcionam offline** após primeira sincronização  
✅ **Navegação Google Maps** com rotas diretas  
✅ **Timestamp de sincronização** visível  
✅ **PWA instalável** em dispositivos móveis  
✅ **Autenticação Supabase** com sessão persistente  

## 📋 Pré-requisitos

- Node.js 18+ e npm
- Conta no [Supabase](https://supabase.com)
- (Opcional) Google Maps API Key para preview de mapas

## 🛠️ Instalação

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Supabase

1. Crie um projeto no [Supabase](https://supabase.com)
2. No dashboard do Supabase, vá em **SQL Editor**
3. Execute o script `supabase/schema.sql` para criar as tabelas
4. Copie suas credenciais (Settings → API)

### 3. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

Edite `.env.local` e adicione suas credenciais:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-publica-aqui
SUPABASE_SERVICE_KEY=sua-chave-service-role-aqui

# Opcional - para preview de mapas
VITE_GOOGLE_MAPS_API_KEY=sua-api-key-google-maps
```

### 4. Processar Dados

Converta o CSV para JSON:

```bash
npm run process-csv
```

Isso criará o arquivo `installations.json` com os dados processados.

### 5. Popular Banco de Dados

```bash
npm run seed-db
```

Isso inserirá todos os 21.583 registros no Supabase.

### 6. Criar Usuário

No dashboard do Supabase:
1. Vá em **Authentication → Users**
2. Clique em **Add User**
3. Adicione email e senha
4. Confirme o email (ou desabilite confirmação em Auth Settings)

## 🚀 Executar

### Desenvolvimento

```bash
npm run dev
```

Acesse http://localhost:3000

### Produção

```bash
npm run build
npm run preview
```

## 📱 Instalar como PWA

1. Abra o app no Chrome/Edge
2. Clique no ícone de instalação na barra de endereço
3. Ou vá em Menu → Instalar GeoRescue

## 🔧 Uso

### Login
Use as credenciais criadas no Supabase para fazer login.

### Primeira Sincronização
Na primeira vez, o sistema sincronizará automaticamente os 21.583 registros para o cache local (IndexedDB). Isso pode levar alguns segundos.

### Busca
- **Por Instalação**: Digite o número da instalação elétrica
- **Por Nome**: Digite o nome do titular
- **Por Endereço**: Digite o endereço ou rua

### Navegação
1. Clique em um resultado da busca
2. Visualize os detalhes da instalação
3. Clique em "Navegar no Google Maps"
4. O Google Maps abrirá com a rota até o local

### Modo Offline
Após a primeira sincronização, o sistema funciona 100% offline:
- Todas as buscas usam o cache local
- Coordenadas são carregadas do cache
- Navegação Google Maps funciona (abre o app)

## 📊 Estrutura do Banco de Dados

### Tabela: `electrical_installations`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | ID único |
| installation_number | TEXT | Número da instalação (único) |
| name | TEXT | Nome do titular |
| address | TEXT | Endereço |
| street | TEXT | Rua |
| client_lat | DOUBLE | Latitude (cliente) - opcional |
| client_lng | DOUBLE | Longitude (cliente) - opcional |
| pee_lat | DOUBLE | Latitude (PEE) - principal |
| pee_lng | DOUBLE | Longitude (PEE) - principal |

## 🔐 Segurança

- Autenticação via Supabase Auth
- Row Level Security (RLS) habilitado
- Usuários autenticados podem apenas ler dados
- Service role necessária para inserção/atualização

## 🐛 Troubleshooting

### Erro de sincronização
- Verifique se as credenciais do Supabase estão corretas
- Confirme que o schema foi executado corretamente
- Verifique se há dados na tabela `electrical_installations`

### Busca não retorna resultados
- Aguarde a primeira sincronização completar
- Verifique o indicador de sincronização no header
- Tente forçar uma sincronização manual (botão sync)

### Login não funciona
- Verifique se o usuário foi criado no Supabase
- Confirme que o email foi verificado (ou desabilite verificação)
- Verifique as credenciais em `.env.local`

## 📝 Licença

Sistema desenvolvido para a Defesa Civil Municipal de Santa Maria de Jetibá - ES.

## 🤝 Suporte

Para dúvidas ou problemas, entre em contato com a equipe de desenvolvimento.
