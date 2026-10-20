<!-- Criado (20/10/2026) -->
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

          <!-- Campo de E-mail -->
          <div class="text-left mb-4">
            <label class="text-caption font-weight-black text-grey-darken-4 tracking-widest d-block mb-1">
              INFORME SEU E-MAIL
            </label>
            <v-text-field
              v-model="email"
              placeholder="DIGITE SEU E-MAIL CADASTRADO"
              variant="solo-filled"
              flat
              density="comfortable"
              hide-details
              class="f1-input-field"
            ></v-text-field>
          </div>

          <!-- Botão de Envio -->
          <v-btn
            color="#e10600"
            variant="flat"
            rounded="pill"
            size="large"
            block
            class="font-weight-black text-white btn-f1 mt-6 mb-4"
            :loading="carregando"
            @click="enviarRecuperacao"
          >
            ENVIAR INSTRUÇÕES
          </v-btn>

          <!-- Links Inferiores -->
          <div class="d-flex flex-column gap-2 mt-4">
            <span 
              class="font-weight-black text-caption text-grey-darken-4 cursor-pointer tracking-widest hover-red"
              @click="$router.push('/')"
            >
              VOLTAR PARA O LOGIN
            </span>
          </div>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const carregando = ref(false)

const enviarRecuperacao = () => {
  if (!email.value) return
  carregando.value = true

  setTimeout(() => {
    carregando.value = false
    alert('Se o e-mail estiver cadastrado, você receberá o link para redefinição de senha.')
    router.push('/')
  }, 1000)
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