# Dr. Processo

Plataforma para consulta de processos judiciais de forma simples e acessível.

## Configuração do Ambiente

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

**Importante:** 
- As variáveis devem começar com `VITE_` para serem acessíveis no frontend
- Substitua `your-project-id` pelo ID real do seu projeto Supabase
- Substitua `your_supabase_anon_key_here` pela chave anônima real do Supabase

### 2. Como obter as credenciais do Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Faça login na sua conta
3. Selecione seu projeto
4. Vá em **Settings** > **API**
5. Copie:
   - **Project URL** para `VITE_SUPABASE_URL`
   - **anon public** key para `VITE_SUPABASE_ANON_KEY`

### 3. Configuração no Netlify

Para o deploy funcionar corretamente, você precisa configurar as variáveis de ambiente no Netlify:

1. Acesse o painel do Netlify
2. Vá em **Site settings** > **Environment variables**
3. Adicione as variáveis:
   - `VITE_SUPABASE_URL`: URL do seu projeto Supabase
   - `VITE_SUPABASE_ANON_KEY`: Chave anônima do Supabase

### 4. Verificação

Para verificar se as variáveis estão configuradas corretamente:

1. Execute `npm run dev` localmente
2. Abra o console do navegador (F12)
3. Se houver erros relacionados ao Supabase, verifique:
   - Se o arquivo `.env` existe na raiz do projeto
   - Se as variáveis começam com `VITE_`
   - Se os valores estão corretos (sem espaços extras)

## Instalação e Execução

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## Estrutura do Projeto

```
src/
├── components/     # Componentes reutilizáveis
├── pages/         # Páginas da aplicação
├── lib/           # Configurações e utilitários
└── main.tsx       # Ponto de entrada da aplicação
```

## Tecnologias Utilizadas

- **React 18** - Framework frontend
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS
- **Supabase** - Backend as a Service
- **Framer Motion** - Animações
- **React Router** - Roteamento
- **Lucide React** - Ícones

## Suporte

Em caso de problemas:

1. Verifique se todas as variáveis de ambiente estão configuradas
2. Confirme se o projeto Supabase está ativo
3. Verifique os logs do console do navegador
4. Entre em contato com o suporte técnico

## Performance

O projeto foi otimizado para performance seguindo as melhores práticas:

- Lazy loading de componentes
- Code splitting automático
- Otimização de imagens
- Cache de recursos estáticos
- Preconnect para domínios externos