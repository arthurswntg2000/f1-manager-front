<!--Criado (08/10/2026); Atualizado (13/10/2026); (20/10/2026)--> 
<template>
  <v-app class="bg-black">
    <!-- Barra superior fixa com o logo F1 MANAGER -->
    <v-app-bar flat color="#15151e" height="72" class="border-b">
      <div class="w-100 text-center font-weight-black text-red-accent-4 text-h6 tracking-widest">
        F1 MANAGER
      </div>
    </v-app-bar>

    <!-- Container Principal -->
    <v-main class="f1-bg pa-0 d-flex align-center justify-center">
      <!-- Camada de sobreposição escurecida -->
      <div class="f1-overlay"></div>
    

      <v-container fluid class="fill-height pa-0 d-flex align-center justify-center z-index-content">
        <v-row align="center" justify="center" class="ma-0 w-100">
          <v-col cols="12" sm="8" md="5" lg="4">

            <!-- Card de Autenticação -->
            <v-card 
              class="f1-card pa-6 text-center"
              variant="outlined"
              rounded="xl"
              elevation="24"
            >
              <!-- Título Interno -->
              <h2 class="text-h5 font-weight-black text-red-accent-4 mb-6 tracking-wider">
                LOGIN
              </h2>

              <v-form @submit.prevent="handleLogin">
                <!-- Campo EMAIL/LOGIN-->
                <div class="text-left font-weight-bold text-caption text-grey-darken-3 mb-1">
                  USUÁRIO
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

                <!-- Campo SENHA -->
                <div class="text-left font-weight-bold text-caption text-grey-darken-3 mb-1">
                  SENHA
                </div>
                <v-text-field
                  v-model="password"
                  :type="mostrarSenha ? 'text' : 'password'"
                  placeholder="..............."
                  variant="solo"
                  flat
                  density="comfortable"
                  class="f1-input mb-6"
                  bg-color="rgba(226, 232, 240, 0.85)"
                  rounded="lg"
                  hide-details="auto"
                  required
                  :append-inner-icon="mostrarSenha ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append-inner="mostrarSenha = !mostrarSenha"
                ></v-text-field>

                <!-- Alerta de Erro -->
                <v-alert v-if="error" type="error" variant="flat" density="compact" class="mb-4 text-caption font-weight-bold text-white">
                  {{ error }}
                </v-alert>

                <!-- Botão ENTRAR -->
                <v-btn
                  type="submit"
                  color="#e10600"
                  size="large"
                  rounded="pill"
                  class="px-8 font-weight-black text-white text-subtitle-1 mb-6 btn-f1"
                  elevation="2"
                >
                  ENTRAR
                </v-btn>
              </v-form>

              <!-- Links do Rodapé com router-link -->
              <div class="d-flex flex-column gap-2 text-center pt-2">
                <router-link 
                  to="/redefinir-senha"
                  class="text-caption font-weight-bold text-grey-darken-3 text-decoration-none d-block hover-red mt-1 cursor-pointer"
                >
                  ESQUECEU A SENHA?
                </router-link>

                <router-link
                  to="/registrar"
                  class="text-caption font-weight-bold text-grey-darken-3 text-decoration-none d-block hover-red mt-1"
                >
                  NOVO POR AQUI? CADASTRE-SE
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

const login = ref('');
const password = ref('');
const mostrarSenha = ref(false);
const error = ref('');
const router = useRouter();

const handleLogin = async () => {
  error.value = ''; // Limpa erros anteriores ao tentar novamente
  try {
    const response = await api.post('/auth/login', {
      login: login.value,
      password: password.value
    });

    // Sucesso: guarda o token JWT e redireciona
    localStorage.setItem('token', response.data.token);
    router.push('/dashboard');
  } catch (err: any) {
    console.error('Erro na requisição:', err);

    if (!err.response) {
      error.value = 'Servidor indisponível (CORS ou Spring Boot desligado)!';
    } else if (err.response.status === 403 || err.response.status === 401) {
      error.value = 'Login ou senha inválidos!';
    } else {
      error.value = err.response.data?.mensagem || 'Erro ao realizar login!';
    }
  }
};
</script>

<style scoped>
/* Fundo que é adaptado a tela */
.f1-bg {
  position: relative;
  min-height: calc(100vh - 48px);
  height: calc(100vh - 48px);
  /* Procura carregar o ficheiro exato da imagem */
  background-image: url('@/assets/f1-manager-logo.jpg');
  /* Garante que o cenário cobre o ecrã inteiro sem distorcer ou deixar bordas */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden;
}

/* Camada escura de sobreposição (Overlay) para aumentar o contraste do Card */
.f1-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 15, 20, 0.20) !important; 
  backdrop-filter: blur(2px) !important; /* Desfoque suave no fundo */
}

/* Mantém o card por cima da marca d'água */
.z-index-content {
  position: relative;
  z-index: 2;
}

/* Card translúcido */
.f1-card {
  background: rgba(255, 255, 255, 0.30) !important;
  border: 1.5px solid rgba(225, 6, 0, 0.6) !important;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1) !important;
}

/* Campos de entrada com leve transparência para harmonizar */
:deep(.f1-input .v-field) {
  border: 1px solid #cbd5e1 !important;
  color: #1e293b !important;
}

:deep(.f1-input input::placeholder) {
  color: #64748b !important;
  font-style: italic;
  font-size: 0.85rem;
}

:deep(.f1-input .v-icon) {
  color: #1e293b !important;
  opacity: 0.8;
}

/* Oculta o ícone de olho nativo dos navegadores*/
:deep(input::-ms-reveal),
:deep(input::-ms-clear) {
  display: none !important;
}

/* Links sem sublinhado por padrão */
.f1-link {
  text-decoration: none;
  transition: color 0.2s;
}

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
</style>