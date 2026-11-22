import { createClient } from '@supabase/supabase-js'

// Lê o endereço e a chave pública do Supabase configurados no ambiente.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

// Cria o cliente usado pelo Admin para acessar autenticação, banco e Storage.
export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey
)