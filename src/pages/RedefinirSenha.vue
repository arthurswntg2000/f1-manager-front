<!-- Criado (20/10/2026); Atualizações (21/10/2026); (22/10/2026) -->
<template>
  <v-app class="bg-black">
      <!-- Barra Superior -->
      <v-app-bar flat color="#15151e" height="72" class="border-b">
        <div class="w-100 text-center font-weight-black text-red-accent-4 text-h6 tracking-widest">
          F1 MANAGER
        </div>
      </v-app-bar>

      <v-main class="f1-bg pa-0 d-flex align-center justify-center">
        <div class="f1-overlay"></div>

        <v-container fluid class="fill-height pa-0 d-flex align-center justify-center z-index-content">
          <v-row align="center" justify="center" class="ma-0 w-100">
            <v-col cols="12" sm="8" md="5" lg="4">

            <!-- Card de Redefinição com o mesmo design translúcido da tela de Login -->
            <v-card 
              class="f1-card pa-6 text-center"
              variant="outlined"
              rounded="xl"
              elevation="24"
            >
              <!-- Título Interno -->
              <h2 class="text-h5 font-weight-black text-red-accent-4 mb-6 tracking-wider">
                REDEFINIR SENHA
              </h2>

              <v-form @submit.prevent="redefinirSenha">
                <!-- Campo: USUÁRIO OU E-MAIL -->
                <div class="text-left font-weight-bold text-caption text-grey-darken-3 mb-1">
                  USUÁRIO OU E-MAIL *
                </div>
                <v-text-field
                  v-model="login"
                  placeholder="DIGITE SEU E-MAIL/USUÁRIO"
                  variant="solo"
                  flat
                  density="comfortable"
                  class="f1-input mb-4"
                  bg-color="rgba(226, 232, 240, 0.85)"
                  rounded="lg"
                  hide-details="auto"
                  required
                ></v-text-field>

                <!-- Campo: NOVA SENHA -->
                <div class="text-left font-weight-bold text-caption text-grey-darken-3 mb-1">
                  NOVA SENHA *
                </div>
                <v-text-field
                  v-model="senha"
                  :type="mostrarSenha ? 'text' : 'password'"
                  placeholder="..............."
                  variant="solo"
                  flat
                  density="comfortable"
                  class="f1-input mb-4"
                  bg-color="rgba(226, 232, 240, 0.85)"
                  rounded="lg"
                  hide-details="auto"
                  required
                  :append-inner-icon="mostrarSenha ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append-inner="mostrarSenha = !mostrarSenha"
                ></v-text-field>

                <!-- Campo: CONFIRMAR NOVA SENHA -->
                <div class="text-left font-weight-bold text-caption text-grey-darken-3 mb-1">
                  CONFIRMAR NOVA SENHA *
                </div>
                <v-text-field
                  v-model="confirmarSenha"
                  :type="mostrarConfirmarSenha ? 'text' : 'password'"
                  placeholder="..............."
                  variant="solo"
                  flat
                  density="comfortable"
                  class="f1-input mb-6"
                  bg-color="rgba(226, 232, 240, 0.85)"
                  rounded="lg"
                  hide-details="auto"
                  required
                  :append-inner-icon="mostrarConfirmarSenha ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append-inner="mostrarConfirmarSenha = !mostrarConfirmarSenha"
                ></v-text-field>

                <!-- Alerta de Erro -->
                <v-alert v-if="mensagemErro" type="error" variant="flat" density="compact" class="mb-4 text-caption font-weight-bold text-white">
                  {{ mensagemErro }}
                </v-alert>

                <!-- Botão SALVAR SENHA -->
                <v-btn
                  type="submit"
                  color="#e10600"
                  size="large"
                  rounded="pill"
                  class="px-8 font-weight-black text-white text-subtitle-1 mb-6 btn-f1"
                  elevation="2"
                  :loading="carregando"
                >
                  SALVAR SENHA
                </v-btn>
              </v-form>

              <!-- Link de Retorno ao Login -->
              <div class="d-flex flex-column gap-2 text-center pt-2">
                <router-link
                  to="/"
                  class="text-caption font-weight-bold text-grey-darken-3 text-decoration-none d-block hover-red mt-1 cursor-pointer"
                >
                  VOLTAR PARA O LOGIN
                </router-link>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()
const login = ref('')
const senha = ref('')
const confirmarSenha = ref('')
const mostrarSenha = ref(false)
const mostrarConfirmarSenha = ref(false)
const carregando = ref(false)
const mensagemErro = ref('')

const redefinirSenha = async () => {
  mensagemErro.value = ''

  if (!login.value || !senha.value || !confirmarSenha.value) {
    mensagemErro.value = 'Preencha todos os campos!'
    return
  }

  if (senha.value !== confirmarSenha.value) {
    mensagemErro.value = 'As senhas não coincidem!'
    return
  }

  carregando.value = true

  try {
    await api.put('/auth/redefinir-senha', {
      login: login.value,
      novaSenha: senha.value
    })

    alert('Senha alterada com sucesso no servidor!')
    router.push('/')
  } catch (err: any) {
    console.error('Erro ao redefinir senha:', err)
    mensagemErro.value = err.response?.data?.mensagem || 'Erro ao comunicar com o servidor!'
  } finally {
    carregando.value = false
  }
}
</script>

<style scoped>
.f1-bg {
  position: relative;
  min-height: calc(100vh - 48px);
  height: calc(100vh - 48px);
  background-image: url('@/assets/f1-manager-logo.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden;
}

.f1-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 15, 20, 0.20) !important;
  backdrop-filter: blur(2px) !important;
}

.z-index-content { position: relative; z-index: 2; }

/* Card com efeito de vidro translúcido idêntico ao login */
.f1-card {
  background: rgba(255, 255, 255, 0.3) !important;
  border: 1.5px solid rgba(225, 6, 0, 0.6) !important;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1) !important;
}

/* Estilização dos campos de texto idêntica ao login */
:deep(.f1-input .v-field) {
  border: 1px solid #cbd5e1 !important;
  color: #1e293b !important;
}

:deep(.f1-input input::placeholder) {
  color: #64748b !important;
  opacity: 1 !important;
  font-weight: 600;
  font-style: italic;
  font-size: 0.85rem;
}

:deep(.f1-input .v-icon) {
  color: #1e293b !important;
  opacity: 0.8;
}

/* Cor escura para os ícones de olho */
:deep(.f1-input-field .v-icon) {
  color: #1e293b !important;
  opacity: 0.8;
}

/* Oculta o ícone de olho nativo dos navegadores*/
:deep(input::-ms-reveal),
:deep(input::-ms-clear) {
  display: none !important;
}

/* Links do Rodapé */
.hover-red:hover {
  color: #d50000 !important;
  text-decoration: underline !important;
}

.cursor-pointer {
  cursor: pointer;
}

.btn-f1 {
  letter-spacing: 1px;
}

.tracking-widest { letter-spacing: 0.15em !important; }


.tracking-wider {
  letter-spacing: 0.03em !important;
}

.gap-2 { gap: 8px; }
</style>