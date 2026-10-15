<!-- Criado (15/10/2026) -->
<template>
  <v-app>
    <SidebarLateral modo="perfil" modulo="CARROS" />

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

        <div v-else-if="carro" class="d-flex flex-column gap-4">
          <!-- Card 1: Imagem e Dados Principais -->
          <v-card class="f1-card-profile pa-6" rounded="xl">
            <v-row align="center">
              <v-col cols="12" sm="5" class="text-center">
                <v-img
                  :src="carro.fotoUrl || 'https://via.placeholder.com/300x180?text=Sem+Foto+do+Carro'"
                  height="180"
                  cover
                  class="rounded-lg"
                ></v-img>
              </v-col>

              <v-col cols="12" sm="7">
                <h1 class="text-h4 font-weight-black text-red-accent-4 mb-4 text-uppercase">
                  {{ carro.modelo }}
                </h1>

                <div class="info-grid text-black">
                  <div class="info-label">MOTOR</div>
                  <div class="info-value">{{ carro.motor?.toUpperCase() || 'NÃO INFORMADO' }}</div>

                  <div class="info-label">ANO DE FABRICAÇÃO</div>
                  <div class="info-value">{{ carro.ano || 'NÃO INFORMADO' }}</div>

                  <div class="info-label">ESCUDERIA</div>
                  <div class="info-value">{{ carro.escuderiaNome?.toUpperCase() || carro.escuderia?.nome?.toUpperCase() || 'NÃO VINCULADA' }}</div>
                </div>
              </v-col>
            </v-row>
          </v-card>

          <!-- Card 2: Ficha Técnica -->
          <v-card class="f1-card-profile pa-6" rounded="xl">
            <h2 class="text-h5 font-weight-black text-red-accent-4 text-center mb-3">FICHA TÉCNICA</h2>
            <p class="text-body-1 text-black font-weight-medium lh-relaxed text-justify whitespace-pre-line">
              {{ carro.fichaTecnica || 'Sem ficha técnica cadastrada para este veículo.' }}
            </p>
          </v-card>

          <!-- Card 3: Pilotos que o usaram -->
          <v-card class="f1-card-profile pa-6" rounded="xl">
            <h2 class="text-h5 font-weight-black text-red-accent-4 text-center mb-4">PILOTOS QUE O USARAM</h2>
            <v-table class="bg-transparent text-black text-center">
              <thead>
                <tr>
                  <th class="text-center font-weight-black th-style">Nº</th>
                  <th class="text-center font-weight-black th-style">NOME</th>
                  <th class="text-center font-weight-black th-style">NACIONALIDADE</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="piloto in carro.pilotos || []" :key="piloto.id">
                  <td class="font-weight-black">{{ piloto.numeroCarro ?? 'S/N' }}</td>
                  <td class="font-weight-black text-uppercase">{{ piloto.nome }}</td>
                  <td class="font-weight-bold text-uppercase">{{ piloto.nacionalidade }}</td>
                </tr>
                <tr v-if="!carro.pilotos || carro.pilotos.length === 0">
                  <td colspan="3" class="text-center py-4 font-weight-bold text-grey-darken-1">
                    Nenhum piloto registrado para este carro.
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
const carro = ref(null)
const carregando = ref(true)

const carregarCarro = async () => {
  const id = route.params.id || route.query.id
  if (!id) return
  carregando.value = true
  try {
    const res = await api.get(`/carros/${id}`)
    carro.value = res.data
  } catch (err) {
    console.error('Erro ao carregar perfil do carro:', err)
  } finally {
    carregando.value = false
  }
}

onMounted(() => {
  carregarCarro()
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
.whitespace-pre-line { white-space: pre-line; }
.tracking-widest { letter-spacing: 0.15em !important; }
.gap-4 { gap: 16px; }
</style>