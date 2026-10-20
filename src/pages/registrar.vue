<!-- Criado (09/10/2026) / Atualizações (20/10/2026) -->
<template>
  <v-app class="bg-black">
    <!-- Barra superior fixa com o logo F1 MANAGER -->
    <v-app-bar flat color="#15151e" height="72" class="border-b">
      <div class="w-100 text-center font-weight-black text-red-accent-4 text-h6 tracking-widest">
        F1 MANAGER
      </div>
    </v-app-bar>

    <!-- Container Principal com Fundo Temático de F1 -->
    <v-main class="f1-bg pa-0 d-flex align-center justify-center">
      <!-- Camada de sobreposição para destacar o formulário -->
      <div class="f1-overlay"></div>

      <v-row align="center" justify="center" class="ma-0 w-100 z-index-content">
        <v-col cols="12" sm="8" md="5" lg="4">

          <!-- Card de Cadastro -->
          <v-card
            class="f1-card pa-6 text-center"
            elevation="24"
            rounded="xl"
          >
            <!-- Título Interno -->
            <h2 class="text-h5 font-weight-black text-red-accent-4 mb-6 tracking-wider">
              CRIAR NOVA CONTA
            </h2>

            <v-form ref="formRef" @submit.prevent="handleRegister">
              <!-- Campo NOME COMPLETO -->
              <div class="text-left font-weight-bold text-caption text-grey-darken-3 mb-1">
                NOME COMPLETO *
              </div>
              <v-text-field
                v-model="nome"
                placeholder="DIGITE SEU NOME"
                :rules="[v => !!v || 'Nome completo é obrigatório']"
                variant="solo"
                flat
                density="comfortable"
                rounded="lg"
                class="mb-2 custom-input"
                required
              ></v-text-field>

              <!-- Campo E-MAIL/LOGIN -->
              <div class="text-left font-weight-bold text-caption text-grey-darken-3 mb-1">
                E-MAIL / LOGIN *
              </div>
              <v-text-field
                v-model="login"
                placeholder="DIGITE SEU E-MAIL/USUÁRIO"
                type="email"
                :rules="regrasEmail"
                variant="solo"
                flat
                density="comfortable"
                rounded="lg"
                class="mb-2 custom-input"
                required
              ></v-text-field>

              <!-- Campo SENHA -->
              <div class="text-left font-weight-bold text-caption text-grey-darken-3 mb-1">
                SENHA *
              </div>
              <v-text-field
                v-model="password"
                placeholder="••••••••••••"
                type="password"
                :rules="[v => !!v || 'Senha é obrigatória']"
                variant="solo"
                flat
                density="comfortable"
                rounded="lg"
                class="mb-2 custom-input"
                required
              ></v-text-field>

              <!-- Campo CONFIRMAR SENHA -->
              <div class="text-left font-weight-bold text-caption text-grey-darken-3 mb-1">
                CONFIRMAR SENHA
              </div>
              <v-text-field
                v-model="confirmPassword"
                placeholder="••••••••••••"
                type="password"
                :rules="regrasConfirmarSenha"
                variant="solo"
                flat
                density="comfortable"
                rounded="lg"
                class="mb-4 custom-input"
                :error="passwordsDoNotMatch"
                :error-messages="passwordsDoNotMatch ? ['As senhas não coincidem'] : []"
                required
              ></v-text-field>

              <!-- Mensagem de Erro do Backend -->
              <v-alert v-if="errorMessage" type="error" variant="tonal" class="mb-4 text-caption" density="compact">
                {{ errorMessage }}
              </v-alert>

              <!-- Botão CADASTRAR -->
              <v-btn
                type="submit"
                color="red-accent-4"
                size="large"
                block
                rounded="pill"
                class="font-weight-bold text-button text-white mb-6 tracking-widest elevation-4"
                :loading="loading"
              >
                CADASTRAR
              </v-btn>

              <!-- Link para retornar ao Login -->
              <router-link
                to="/"
                class="text-caption font-weight-bold text-grey-darken-3 text-decoration-none d-block hover-red"
              >
                JÁ TEM UMA CONTA? FAÇA LOGIN
              </router-link>
            </v-form>
          </v-card>

        </v-col>
      </v-row>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const formRef = ref(null)

const nome = ref('')
const login = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const errorMessage = ref('')

// Validações
const regrasEmail = [
  v => !!v || 'E-mail / Login é obrigatório',
  v => /.+@.+\..+/.test(v) || 'Informe um e-mail válido'
]

const regrasConfirmarSenha = [
  v => !!v || 'Confirmação de senha é obrigatória',
  v => v === password.value || 'As senhas não coincidem'
]

const passwordsDoNotMatch = computed(() => {
  return confirmPassword.value.length > 0 && password.value !== confirmPassword.value
})

const handleRegister = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  loading.value = true
  errorMessage.value = ''

  try {
    await axios.post('http://localhost:8080/api/auth/registrar', {
      nome: nome.value,
      login: login.value,
      password: password.value
    })

    // Redireciona para a página inicial/login após o registo com sucesso
    router.push('/')
  } catch (error) {
    if (error.response && error.response.data) {
      errorMessage.value = error.response.data.message || 'Erro ao realizar cadastro.'
    } else {
      errorMessage.value = 'Não foi possível conectar ao servidor.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Fundo total da página */
.f1-bg {
  min-height: 100vh;
  background-image: url('@/assets/f1-manager-logo.jpg');
  background-size: cover;
  background-position: center;
  position: relative;
}

/* Camada escura de fundo */
.f1-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 15, 20, 0.45);
  backdrop-filter: blur(4px);
}

.z-index-content {
  position: relative;
  z-index: 2;
}

/* Card Translúcido em tom claro */
.f1-card {
  background: rgba(245, 245, 247, 0.2) !important;
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  color: #1a1a1a !important;
}

/* Estilização clara para os campos de texto */
:deep(.custom-input .v-field) {
  background-color: #e5e7eb !important;
  color: #111827 !important;
  border-radius: 10px !important;
}

:deep(.custom-input input) {
  color: #111827 !important;
}

:deep(.custom-input input::placeholder) {
  color: #6b7280 !important;
  opacity: 1 !important;
}

/* Força cor viva, fundo contrastante e negrito total nas mensagens de erro do Vuetify */
:deep(.v-messages__message) {
  color: #ff0000 !important; /* Vermelho vibrante de alto contraste */
  font-weight: 900 !important; /* Texto em negrito pesado */
  font-size: 0.78rem !important;
  letter-spacing: 0.03em;
  opacity: 1 !important;
  margin-top: 3px !important;
}

/* Destaca o campo com contorno vermelho marcante */
:deep(.v-field--error) {
  border: 2px solid #ff0000 !important;
  background-color: rgba(255, 235, 235, 0.95) !important;
}

/* Efeito Hover nos links */
.hover-red:hover {
  color: #d50000 !important;
  text-decoration: underline !important;
}

.tracking-widest {
  letter-spacing: 0.15em !important;
}

.tracking-wider {
  letter-spacing: 0.08em !important;
}
</style>