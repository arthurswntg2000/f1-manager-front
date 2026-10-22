<!-- Criado (09/10/2026) / Atualizações (15/10/2026); (22/10/2026) -->
<template>
  <v-app>
    <SidebarLateral />

    <v-main class="f1-bg">
      <div class="f1-overlay"></div>

      <!-- Barra Superior com Nome do Usuário e Cronômetro de Sessão -->
      <v-app-bar flat color="#15151e" height="72" class="border-b px-6" app>
        <v-spacer></v-spacer>

        <!-- Título Centralizado -->
        <div class="text-h6 font-weight-black text-red-accent-4 tracking-widest">
          DASHBOARD
        </div>

        <v-spacer></v-spacer>

        <!-- Bloco Direito: Usuário Logado + Cronômetro de Sessão -->
        <div class="d-flex align-center gap-3">
          <!-- Nome do Usuário Logado -->
          <div class="d-flex align-center bg-grey-darken-4 px-3 py-1 rounded-pill border-subtle">
            <v-icon icon="mdi-account-circle" color="red-accent-4" class="mr-2" size="small"></v-icon>
            <span class="text-caption font-weight-black text-grey-lighten-2 tracking-wide text-uppercase">
              {{ nomeUsuario }}
            </span>
          </div>

          <!-- Cronômetro da Sessão -->
          <div class="d-flex align-center bg-grey-darken-4 px-3 py-1 rounded-pill border-subtle">
            <v-icon icon="mdi-clock-outline" color="red-accent-4" class="mr-2" size="small"></v-icon>
            <span class="text-caption font-weight-black text-grey-lighten-2 tracking-wide">
              Sessão: {{ tempoSessaoFormatado }}
            </span>
          </div>
        </div>
      </v-app-bar>

      <v-container fluid class="pa-6 z-index-content max-width-container">
        <!-- Cards de Métricas -->
        <v-row density="comfortable" class="mb-4">
          <v-col cols="12" md="4">
            <v-card class="f1-card-metric pa-4 text-center" rounded="xl">
              <div class="text-caption font-weight-black text-grey-darken-4 tracking-widest mb-1">TOTAL DE PILOTOS</div>
              <div class="text-h4 font-weight-black text-black">{{ totalPilotos }}</div>
            </v-card>
          </v-col>

          <v-col cols="12" md="4">
            <v-card class="f1-card-metric pa-4 text-center" rounded="xl">
              <div class="text-caption font-weight-black text-grey-darken-4 tracking-widest mb-1">TOTAL DE ESCUDERIAS</div>
              <div class="text-h4 font-weight-black text-black">{{ totalEscuderias }}</div>
            </v-card>
          </v-col>

          <v-col cols="12" md="4">
            <v-card class="f1-card-metric pa-4 text-center" rounded="xl">
              <div class="text-caption font-weight-black text-grey-darken-4 tracking-widest mb-1">TOTAL DE CARROS</div>
              <div class="text-h4 font-weight-black text-black">{{ totalCarros }}</div>
            </v-card>
          </v-col>
        </v-row>

        <!-- Bloco de Atividades Recentes -->
        <v-row>
          <v-col cols="12">
            <v-card class="f1-card-metric pa-6" rounded="xl">
              <div class="text-center font-weight-black text-grey-darken-4 text-subtitle-1 tracking-widest mb-6">
                ATIVIDADES RECENTES
              </div>

              <!-- Lista de Atividades -->
              <v-list v-if="atividades.length > 0" class="bg-transparent pa-0">
                <div
                  v-for="(atividade, index) in atividades" 
                  :key="atividade.id || index"
                  class="d-flex justify-space-between align-center py-3 px-4 my-1 activity-row rounded-lg"
                >
                  <span class="font-weight-black text-grey-darken-4 text-body-2">
                    {{ atividade.descricao }}
                  </span>
                  <span class="font-weight-bold text-grey-darken-2 text-caption ms-4 text-no-wrap">
                    {{ atividade.tempoRelativo }}
                  </span>
                </div>
              </v-list>

              <div v-else class="text-center py-8 text-grey-darken-2 font-weight-bold">
                Nenhuma atividade registrada até o momento.
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import SidebarLateral from '@/components/SidebarLateral.vue'
import api from '@/services/api'
import { formatarTempoRelativo } from '@/services/activityLogger'

const totalPilotos = ref(0)
const totalEscuderias = ref(0)
const totalCarros = ref(0)
const atividades = ref([])

// Variáveis de Usuário e Cronômetro de Sessão
const nomeUsuario = ref('USUÁRIO')
const segundosSessao = ref(0)
let timerSessao = null
let timerAtualizacao = null

// Converte os segundos em formato MM:SS
const tempoSessaoFormatado = computed(() => {
  const min = Math.floor(segundosSessao.value / 60).toString().padStart(2, '0')
  const sec = (segundosSessao.value % 60).toString().padStart(2, '0')
  return `${min}:${sec}`
})

const carregarMetricas = async () => {
  try {
    const [resPilotos, resEscuderias, resCarros] = await Promise.all([
      api.get('/pilotos'),
      api.get('/escuderias'),
      api.get('/carros')
    ])

    totalPilotos.value = resPilotos.data?.length || 0
    totalEscuderias.value = resEscuderias.data?.length || 0
    totalCarros.value = resCarros.data?.length || 0
  } catch (err) {
    console.error('Erro ao carregar totais do Dashboard:', err)
  }
}

const atualizarAtividades = async () => {
  try {
    const response = await api.get('/atividades')
    if (response.data) {
      atividades.value = response.data.map(atv => ({
        ...atv,
        tempoRelativo: formatarTempoRelativo(new Date(atv.timestamp).getTime())
      }))
    }
  } catch (err) {
    console.error('Erro ao buscar atividades recentes na API:', err)
  }
}

onMounted(() => {
  // Resgata o usuário logado
  const usuarioSalvo = localStorage.getItem('usuario')
  if (usuarioSalvo) {
    nomeUsuario.value = usuarioSalvo
  }

  // Cronômetro da Sessão (incrementa a cada 1 segundo)
  timerSessao = setInterval(() => {
    segundosSessao.value++
  }, 1000)

  carregarMetricas()
  atualizarAtividades()

  // Recalcula o tempo relativo em tempo real a cada 30 segundos
  timerAtualizacao = setInterval(() => {
    carregarMetricas()
    atualizarAtividades()
  }, 30000)
})

onUnmounted(() => {
  if (timerSessao) clearInterval(timerSessao)
  if (timerAtualizacao) clearInterval(timerAtualizacao)
})
</script>

<style scoped>
.f1-bg {
  position: relative;
  min-height: 100vh;
  background-image: url('@/assets/f1-manager-logo.jpg');
  background-size: cover;
  background-position: center;
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
  background: rgba(240, 240, 245, 0.5) !important;
  border: 1.5px solid rgba(225, 6, 0, 0.5) !important;
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

.activity-row {
  border-bottom: 1px solid rgba(180, 180, 190, 0.3);
  transition: background-color 0.2s;
}

.activity-row:hover {
  background: rgba(255, 255, 255, 0.25);
}

.tracking-widest { letter-spacing: 0.15em !important; }
.text-no-wrap { white-space: nowrap; }

.gap-3 { gap: 12px; }
.border-subtle { border: 1px solid rgba(255, 255, 255, 0.15); }
.text-uppercase { text-transform: uppercase; }
</style>