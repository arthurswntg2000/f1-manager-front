<!-- Criado (20/10/2026); Atualizações (21/10/2026) -->
<template>
  <v-app>
    <v-main class="f1-bg">
      <div class="f1-overlay"></div>

      <!-- Barra Superior -->
      <v-app-bar flat color="#15151e" height="72" class="border-b">
        <div class="w-100 text-center font-weight-black text-red-accent-4 text-h6 tracking-widest">
          F1 MANAGER
        </div>
      </v-app-bar>

      <v-container fluid class="fill-height d-flex align-center justify-center z-index-content">
        <!-- Card de Redefinição com o mesmo design da tela de Login -->
        <v-card class="f1-card-table pa-8 text-center" rounded="xl" width="100%" max-width="450">
          <div class="text-h5 font-weight-black text-red-accent-4 tracking-widest mb-6">
            REDEFINIR SENHA
          </div>

          <!-- Campo: Usuário / E-mail -->
          <div class="text-left mb-4">
            <label class="text-caption font-weight-black text-grey-darken-4 tracking-widest d-block mb-1">
              USUÁRIO OU E-MAIL *
            </label>
            <v-text-field
              v-model="login"
              placeholder="DIGITE SEU USUÁRIO OU E-MAIL"
              variant="solo-filled"
              flat
              density="comfortable"
              hide-details
              class="f1-input-field"
            ></v-text-field>
          </div>

          <!-- Campo: Nova Senha -->
          <div class="text-left mb-4">
            <label class="text-caption font-weight-black text-grey-darken-4 tracking-widest d-block mb-1">
              NOVA SENHA *
            </label>
            <v-text-field
              v-model="senha"
              :type="mostrarSenha ? 'text' : 'password'"
              placeholder="DIGITE SUA NOVA SENHA"
              variant="solo-filled"
              flat
              density="comfortable"
              hide-details
              class="f1-input-field"
              :append-inner-icon="mostrarSenha ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="mostrarSenha = !mostrarSenha"
            ></v-text-field>
          </div>

          <!-- Campo: Confirmar Nova Senha -->
          <div class="text-left mb-4">
            <label class="text-caption font-weight-black text-grey-darken-4 tracking-widest d-block mb-1">
              REDEFINIR SENHA *
            </label>
            <v-text-field
              v-model="confirmarSenha"
              :type="mostrarConfirmarSenha ? 'text' : 'password'"
              placeholder="CONFIRME SUA NOVA SENHA"
              variant="solo-filled"
              flat
              density="comfortable"
              hide-details
              class="f1-input-field"
              :append-inner-icon="mostrarConfirmarSenha ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="mostrarConfirmarSenha = !mostrarConfirmarSenha"
            ></v-text-field>
          </div>

          <!-- Botão de Salvar -->
          <v-btn
            color="#e10600"
            variant="flat"
            rounded="pill"
            size="large"
            block
            class="font-weight-black text-white btn-f1 mt-6 mb-4"
            :loading="carregando"
            @click="redefinirSenha"
          >
            SALVAR SENHA
          </v-btn>

          <!-- Links Inferiores -->
          <div class="d-flex flex-column gap-2 mt-4">
            <router-link 
              to="/"
              class="font-weight-black text-caption text-grey-darken-4 cursor-pointer tracking-widest hover-red text-decoration-none"
            >
              VOLTAR PARA O LOGIN
            </router-link>
          </div>
        </v-card>
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

const redefinirSenha = async () => {
  if (!login.value || !senha.value || !confirmarSenha.value) {
    alert('Preencha todos os campos!')
    return
  }

  if (senha.value !== confirmarSenha.value) {
    alert('As senhas não coincidem!')
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
    alert(err.response?.data?.mensagem || 'Erro ao comunicar com o servidor!')
  } finally {
    carregando.value = false
  }
}
</script>

<style scoped>
.f1-bg {
  position: relative;
  min-height: 100vh;
  background-image: url('@/assets/f1-manager-logo.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow-y: auto;
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
.f1-card-table {
  background: rgba(240, 240, 245, 0.3) !important;
  border: 2px solid rgba(225, 6, 0, 0.5) !important;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

/* Estilização dos campos de texto idêntica ao login */
:deep(.f1-input-field .v-field) {
  background-color: rgba(220, 220, 228, 0.8) !important;
  border-radius: 8px !important;
}

:deep(.f1-input-field input) {
  font-weight: 800 !important;
  font-size: 0.85rem !important;
  color: #111 !important;
  letter-spacing: 0.05em;
}

:deep(.f1-input-field input::placeholder) {
  color: #777 !important;
  font-style: italic;
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

.btn-f1 {
  letter-spacing: 0.12em;
  font-size: 0.9rem;
}

.tracking-widest { letter-spacing: 0.15em !important; }
.cursor-pointer { cursor: pointer; }

.hover-red:hover {
  color: #e10600 !important;
  transition: color 0.2s ease-in-out;
}

.gap-2 { gap: 8px; }
</style>