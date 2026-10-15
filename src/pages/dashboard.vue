<!-- Criado (09/10/2026) / Atualizado (15/10/2026) -->
<template>
  <v-app>
    <SidebarLateral />

    <v-main class="f1-bg">
      <div class="f1-overlay"></div>

      <!-- Barra Superior -->
      <v-app-bar flat color="#15151e" height="65" class="border-b" app>
        <div class="w-100 text-center font-weight-black text-red-accent-4 text-h6 tracking-widest">
          DASHBOARD
        </div>
      </v-app-bar>

      <v-container fluid class="pa-6 z-index-content max-width-container">
        <!-- Cards de Totais na Parte Superior (Estilo Idêntico ao Atividades Recentes) -->
        <v-row density="compact" justify="center" class="mb-2">
          <v-col cols="12" sm="4">
            <v-card class="f1-card-metric pa-4 text-center" rounded="xl">
              <div class="text-caption font-weight-black text-grey-darken-4 tracking-widest">
                TOTAL DE PILOTOS
              </div>
              <div class="text-h4 font-weight-black text-grey-darken-4 mt-1">
                {{ totalPilotos }}
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" sm="4">
            <v-card class="f1-card-metric pa-4 text-center" rounded="xl">
              <div class="text-caption font-weight-black text-grey-darken-4 tracking-widest">
                TOTAL DE ESCUDERIAS
              </div>
              <div class="text-h4 font-weight-black text-grey-darken-4 mt-1">
                {{ totalEscuderias }}
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" sm="4">
            <v-card class="f1-card-metric pa-4 text-center" rounded="xl">
              <div class="text-caption font-weight-black text-grey-darken-4 tracking-widest">
                TOTAL DE CARROS
              </div>
              <div class="text-h4 font-weight-black text-grey-darken-4 mt-1">
                {{ totalCarros }}
              </div>
            </v-card>
          </v-col>
        </v-row>

        <!-- Bloco de Atividades Recentes -->
        <v-row justify="center">
          <v-col cols="12">
            <v-card class="f1-card-table pa-6" rounded="xl">
              <div class="text-center font-weight-black text-grey-darken-4 text-subtitle-1 tracking-widest mb-4">
                ATIVIDADES RECENTES
              </div>

              <!-- Lista de Atividades -->
              <v-list class="bg-transparent pa-0" density="compact">
                <v-list-item
                  v-for="(atividade, index) in atividades"
                  :key="index"
                  class="border-b border-grey-darken-2 py-2"
                >
                  <template #prepend>
                    <v-icon :color="atividade.cor" size="small" class="mr-3">
                      {{ atividade.icone }}
                    </v-icon>
                  </template>

                  <v-list-item-title class="font-weight-black text-grey-darken-4 text-body-2">
                    {{ atividade.descricao }}
                  </v-list-item-title>

                  <template #append>
                    <span class="text-caption text-grey-darken-3 font-weight-bold">
                      {{ atividade.tempo }}
                    </span>
                  </template>
                </v-list-item>

                <v-list-item v-if="atividades.length === 0" class="text-center">
                  <v-list-item-title class="text-grey-darken-2 font-weight-bold">
                    Nenhuma atividade recente registrada.
                  </v-list-item-title>
                </v-list-item>
              </v-list>
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

const atividades = ref([
  {
    descricao: 'Novo piloto registrado: Fernando Alonso',
    tempo: 'Há 10 min'
  },
  {    
    descricao: 'Escuderia atualizada: Aston Martin',
    tempo: 'Há 1 hora'
  },
  {
    descricao: 'Carro cadastrado: AMR24',
    tempo: 'Há 3 horas'
  },
  {
    descricao: 'Carro removido do sistema: RB19',
    tempo: 'Ontem'
  }
])

const carregarTotais = async () => {
  try {
    const [resPilotos, resEscuderias, resCarros] = await Promise.all([
      api.get('/pilotos'),
      api.get('/escuderias'),
      api.get('/carros')
    ])

    if (resPilotos.data) totalPilotos.value = resPilotos.data.length
    if (resEscuderias.data) totalEscuderias.value = resEscuderias.data.length
    if (resCarros.data) totalCarros.value = resCarros.data.length
  } catch (err) {
    console.error('Erro ao carregar totais do Dashboard:', err)
  }
}

onMounted(() => {
  carregarTotais()
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
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(15, 15, 20, 0.35) !important;
  backdrop-filter: blur(2px) !important;
}

.z-index-content { position: relative; z-index: 2; }
.max-width-container { max-width: 1100px; }

/* Cards de Métricas com o mesmo estilo translúcido de Atividades Recentes */
.f1-card-metric {
  background: rgba(240, 240, 245, 0.45) !important;
  border: 1.5px solid rgba(225, 6, 0, 0.5) !important;
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

/* Card de Atividades Recentes */
.f1-card-table {
  background: rgba(240, 240, 245, 0.45) !important;
  border: 1.5px solid rgba(225, 6, 0, 0.5) !important;
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  min-height: 400px;
}

.tracking-widest { letter-spacing: 0.15em !important; }
</style>