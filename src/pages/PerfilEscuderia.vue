<!-- Criado (15/10/2026) -->
<template>
  <v-app>
    <SidebarLateral modo="perfil" modulo="ESCUDERIAS" />

    <v-main class="f1-bg">
      <div class="f1-overlay"></div>

      <!-- Barra Superior -->
      <v-app-bar flat color="#15151e" height="65" class="border-b" app>
        <div class="w-100 text-center font-weight-black text-red-accent-4 text-h6 tracking-widest">
          PERFIL
        </div>
      </v-app-bar>

      <v-container fluid class="pa-6 z-index-content max-width-container">
        <div v-if="carregando" class="text-center py-12">
          <v-progress-circular indeterminate color="red-accent-4" size="64"></v-progress-circular>
        </div>

        <div v-else-if="escuderia" class="d-flex flex-column gap-4">
          <!-- Card 1: Logo & Informações Principais -->
          <v-card class="f1-card-profile pa-6" rounded="xl">
            <v-row align="center">
              <v-col cols="12" sm="5" class="text-center">
                <v-img
                  :src="escuderia.urlLogo || 'https://via.placeholder.com/280x160?text=Logo+Escuderia'"
                  height="160"
                  contain
                  class="rounded-lg pa-2"
                ></v-img>
              </v-col>

              <v-col cols="12" sm="7">
                <h1 class="text-h4 font-weight-black text-red-accent-4 mb-4 text-uppercase">
                  {{ escuderia.nome }}
                </h1>

                <div class="info-grid text-black">
                  <div class="info-label">PAÍS DE ORIGEM</div>
                  <div class="info-value">{{ escuderia.paisOrigem?.toUpperCase() || 'NÃO INFORMADO' }}</div>

                  <div class="info-label">DATA DE FUNDAÇÃO</div>
                  <div class="info-value">{{ escuderia.dataFundacao || 'NÃO INFORMADA' }}</div>

                  <div class="info-label">FUNDADOR</div>
                  <div class="info-value">{{ escuderia.fundador?.toUpperCase() || 'NÃO INFORMADO' }}</div>

                  <div class="info-label">TÍTULOS</div>
                  <div class="info-value">{{ escuderia.titulos ?? 0 }}</div>
                </div>
              </v-col>
            </v-row>
          </v-card>

          <!-- Card 2: Biografia -->
          <v-card class="f1-card-profile pa-6" rounded="xl">
            <h2 class="text-h5 font-weight-black text-red-accent-4 text-center mb-3">BIOGRAFIA</h2>
            <p class="text-body-1 text-black font-weight-medium lh-relaxed text-justify">
              {{ escuderia.biografia || 'Sem biografia cadastrada para esta escuderia.' }}
            </p>
          </v-card>

          <!-- Card 3: Pilotos da Escuderia -->
          <v-card class="f1-card-profile pa-6" rounded="xl">
            <h2 class="text-h5 font-weight-black text-red-accent-4 text-center mb-4">PILOTOS (TEMPORADA ATUAL)</h2>
            <v-table class="bg-transparent text-black text-center">
              <thead>
                <tr>
                  <th class="text-center font-weight-black th-style">Nº</th>
                  <th class="text-center font-weight-black th-style">NOME</th>
                  <th class="text-center font-weight-black th-style">NACIONALIDADE</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="piloto in escuderia.pilotos || []" :key="piloto.id">
                  <td class="font-weight-black">{{ piloto.numeroCarro ?? 'S/N' }}</td>
                  <td class="font-weight-black text-uppercase">{{ piloto.nome }}</td>
                  <td class="font-weight-bold text-uppercase">{{ piloto.nacionalidade }}</td>
                </tr>
                <tr v-if="!escuderia.pilotos || escuderia.pilotos.length === 0">
                  <td colspan="3" class="text-center py-4 font-weight-bold text-grey-darken-1">
                    Nenhum piloto vinculado a esta escuderia.
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card>

          <!-- Card 4: Carros Vinculados -->
          <v-card class="f1-card-profile pa-6" rounded="xl">
            <h2 class="text-h5 font-weight-black text-red-accent-4 text-center mb-4">CARROS VINCULADOS</h2>
            <v-table class="bg-transparent text-black text-center">
              <thead>
                <tr>
                  <th class="text-center font-weight-black th-style">MODELO</th>
                  <th class="text-center font-weight-black th-style">MOTOR</th>
                  <th class="text-center font-weight-black th-style">ANO</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="carro in escuderia.carros || []" :key="carro.id">
                  <td class="font-weight-black text-uppercase">{{ carro.modelo }}</td>
                  <td class="font-weight-bold text-uppercase">{{ carro.motor }}</td>
                  <td class="font-weight-bold">{{ carro.ano || 'N/A' }}</td>
                </tr>
                <tr v-if="!escuderia.carros || escuderia.carros.length === 0">
                  <td colspan="3" class="text-center py-4 font-weight-bold text-grey-darken-1">
                    Nenhum carro vinculado a esta escuderia.
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import SidebarLateral from '@/components/SidebarLateral.vue'
import api from '@/services/api'

const route = useRoute()
const escuderia = ref(null)
const carregando = ref(true)

const carregarEscuderia = async () => {
  const id = route.params.id || route.query.id
  if (!id) return
  carregando.value = true
  try {
    const res = await api.get(`/escuderias/${id}`)
    escuderia.value = res.data
  } catch (err) {
    console.error('Erro ao carregar perfil da escuderia:', err)
  } finally {
    carregando.value = false
  }
}

onMounted(() => {
  carregarEscuderia()
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
.max-width-container { max-width: 900px; }

.f1-card-profile {
  background: rgba(240, 240, 245, 0.5) !important;
  border: 1.5px solid rgba(225, 6, 0, 0.5) !important;
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

.info-grid {
  display: grid;
  grid-template-columns: 180px 1fr;
  row-gap: 8px;
  align-items: center;
}

.info-label { font-weight: 900; font-size: 0.9rem; letter-spacing: 0.05em; }
.info-value { font-weight: 800; font-size: 0.95rem; }
.th-style { color: #111111 !important; font-size: 0.9rem; font-weight: 900; }
.lh-relaxed { line-height: 1.6; }
.tracking-widest { letter-spacing: 0.15em !important; }
.gap-4 { gap: 16px; }
</style>