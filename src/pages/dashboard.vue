<!--Criado (09/10/2026); Atualizado (13/10/2026)--> 
<template>
  <v-app>
    <!-- Componente da Barra Lateral Reutilizável -->
    <SidebarLateral />

    <!-- Barra Superior Fixa do Dashboard -->
    <v-app-bar flat color="#15151e" height="48" class="border-b" app>
      <div class="w-100 text-center font-weight-black text-red-accent-4 text-h6 tracking-widest">
        DASHBOARD
      </div>
    </v-app-bar>

    <!-- Área de Conteúdo Principal -->
    <v-main class="f1-bg">
      <!-- Camada escura de sobreposição (Overlay) para destacar os cards -->
      <div class="f1-overlay"></div>

      <!-- Container do Grid Principal -->
      <v-container fluid class="pa-6 z-index-content">
        <!-- Linha de Cards de Totais -->
        <v-row>
          <!-- Card Total de Pilotos -->
          <v-col cols="12" sm="4">
            <v-card class="f1-card pa-4 text-center text-white elevation-6" rounded="lg">
              <div class="text-caption font-weight-black text-grey-lighten-2 tracking-wider mb-2">
                TOTAL DE PILOTOS
              </div>
              <div class="text-h3 font-weight-black text-white">
                {{ totalPilotos }}
              </div>
            </v-card>
          </v-col>

          <!-- Card Total de Escuderias -->
          <v-col cols="12" sm="4">
            <v-card class="f1-card pa-4 text-center text-white elevation-6" rounded="lg">
              <div class="text-caption font-weight-black text-grey-lighten-2 tracking-wider mb-2">
                TOTAL DE ESCUDERIAS
              </div>
              <div class="text-h3 font-weight-black text-white">
                {{ totalEscuderias }}
              </div>
            </v-card>
          </v-col>

          <!-- Card Total de Carros -->
          <v-col cols="12" sm="4">
            <v-card class="f1-card pa-4 text-center text-white elevation-6" rounded="lg">
              <div class="text-caption font-weight-black text-grey-lighten-2 tracking-wider mb-2">
                TOTAL DE CARROS
              </div>
              <div class="text-h3 font-weight-black text-white">
                {{ totalCarros }}
              </div>
            </v-card>
          </v-col>
        </v-row>

        <!-- Card de Atividades Recentes -->
        <v-row class="mt-4">
          <v-col cols="12">
            <v-card class="f1-card pa-6 text-white elevation-6 min-vh-card" rounded="lg">
              <div class="text-h6 font-weight-black text-center tracking-widest mb-6 text-white">
                ATIVIDADES RECENTES
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import SidebarLateral from '@/components/SidebarLateral.vue'
import api from '@/services/api'

const totalPilotos = ref(0)
const totalEscuderias = ref(0)
const totalCarros = ref(0)

const carregarTotaisReais = async () => {
  try {
    const [resPilotos, resEscuderias, resCarros] = await Promise.all([
      api.get('/pilotos'),
      api.get('/escuderias'),
      api.get('/carros')
    ])

    totalPilotos.value = resPilotos.data ? resPilotos.data.length : 0
    totalEscuderias.value = resEscuderias.data ? resEscuderias.data.length : 0
    totalCarros.value = resCarros.data ? resCarros.data.length : 0
  } catch (err) {
    console.error('Erro ao buscar totais reais da API Spring Boot:', err)
  }
}

onMounted(() => {
  carregarTotaisReais()
})
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
  background: rgba(15, 15, 20, 0.40) !important;
  backdrop-filter: blur(2px) !important;
}
/* Garante que o conteúdo fique visível acima da camada overlay */
.z-index-content {
  position: relative;
  z-index: 2;
}

/* Cards translúcidos no estilo da aplicação */
.f1-card {
  background: rgba(25, 25, 35, 0.75) !important;
  border: 1px solid rgba(225, 6, 0, 0.4) !important;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.min-vh-card {
  min-height: 380px;
}

.tracking-widest {
  letter-spacing: 0.15em !important;
}

.tracking-wider {
  letter-spacing: 0.08em !important;
}
</style>