<!-- Criado (15/10/2026) / Atualização (16/10/2026) -->
<!-- Criado (15/10/2026) / Atualização (16/10/2026) / (27/10/2026) -->
<template>
  <v-app>
    <SidebarLateral modo="perfil" modulo="ESCUDERIAS" />
    <AppHeader titulo="PERFIL" />

    <v-main class="f1-bg">
      <div class="f1-overlay"></div>

      <v-container fluid class="pa-6 z-index-content full-page-container">
        <!-- Indicador de Carregamento -->
        <div v-if="carregando" class="d-flex align-center justify-center fill-height">
          <v-progress-circular indeterminate color="red-accent-4" size="64"></v-progress-circular>
        </div>

        <!-- Conteúdo Principal em Grid -->
        <v-row v-else-if="escuderia" density="comfortable" class="full-height-row">
          
          <!-- COLUNA DA ESQUERDA: Perfil com Logo Centralizada + Biografia -->
          <v-col cols="12" md="5" lg="4" class="full-height-col d-flex flex-column gap-4">
            
            <!-- Card 1: Logo Centralizada & Informações Empilhadas -->
            <v-card class="f1-card-profile pa-6 card-top-height overflow-y-auto d-flex flex-column justify-center align-center" rounded="xl">
              <!-- Escudo/Logo Centralizado -->
              <div class="text-center mb-2 w-100 logo-container d-flex align-center justify-center">
                <img
                  v-if="fotoValida"
                  :src="fotoValida"
                  alt="Logo da Escuderia"
                  class="img-logo-fit"
                />
                <div v-else class="sem-foto-placeholder d-flex align-center justify-center rounded-lg mx-auto">
                  <span class="text-grey-darken-1 font-weight-bold">Sem Foto</span>
                </div>
              </div>

              <!-- Nome da Escuderia Centralizado -->
              <h1 class="text-h5 font-weight-black text-red-accent-4 mb-2 text-uppercase text-center line-height-tight w-100">
                {{ escuderia.nome }}
              </h1>

              <!-- Informações do Perfil Abaixo da Foto -->
              <div class="w-100 border-t border-grey-lighten-2 pt-2 mt-auto">
                <div class="d-flex justify-between py-1 border-b border-grey-lighten-2">
                  <span class="font-weight-black text-grey-darken-4 text-caption">PAÍS DE ORIGEM:</span>
                  <span class="font-weight-black text-black text-caption text-uppercase text-right">{{ escuderia.paisOrigem || '-' }}</span>
                </div>

                <div class="d-flex justify-between py-1 border-b border-grey-lighten-2">
                  <span class="font-weight-black text-grey-darken-4 text-caption">DATA DE FUNDAÇÃO:</span>
                  <span class="font-weight-black text-black text-caption text-right">{{ escuderia.dataFundacao || '-' }}</span>
                </div>

                <div class="d-flex justify-between py-1 border-b border-grey-lighten-2">
                  <span class="font-weight-black text-grey-darken-4 text-caption">FUNDADOR:</span>
                  <span class="font-weight-black text-black text-caption text-uppercase text-right">{{ escuderia.fundador || '-' }}</span>
                </div>

                <div class="d-flex justify-between py-1">
                  <span class="font-weight-black text-grey-darken-4 text-caption">TÍTULOS:</span>
                  <span class="font-weight-black text-black text-caption text-right">{{ escuderia.titulos ?? 0 }}</span>
                </div>
              </div>
            </v-card>

            <!-- Card 2: Biografia -->
            <v-card class="f1-card-profile pa-6 card-bottom-height overflow-y-auto" rounded="xl">
              <h2 class="text-h6 font-weight-black text-red-accent-4 text-center mb-2">BIOGRAFIA</h2>
              <p class="text-body-2 text-black font-weight-medium lh-relaxed text-justify ma-0">
                {{ escuderia.biografia || 'Sem biografia cadastrada para esta escuderia.' }}
              </p>
            </v-card>

          </v-col>

          <!-- COLUNA DA DIREITA: Carros Vinculados + Pilotos -->
          <v-col cols="12" md="7" lg="8" class="full-height-col d-flex flex-column gap-4">
            
            <!-- Card 3: Carros Vinculados -->
            <v-card class="f1-card-profile pa-6 card-top-height overflow-y-auto" rounded="xl">
              <h2 class="text-h5 font-weight-black text-red-accent-4 text-center mb-4">CARROS VINCULADOS</h2>
              <v-table class="bg-transparent text-black text-center" density="comfortable">
                <thead>
                  <tr>
                    <th class="text-center font-weight-black th-style">MODELO</th>
                    <th class="text-center font-weight-black th-style">MOTOR</th>
                    <th class="text-center font-weight-black th-style">ANO</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="carro in carrosExibicao" :key="carro.id">
                    <td class="font-weight-black text-uppercase">{{ carro.modelo }}</td>
                    <td class="font-weight-bold text-uppercase">{{ carro.motor || '-' }}</td>
                    <td class="font-weight-bold">{{ carro.ano || 'N/A' }}</td>
                  </tr>
                  <tr v-if="carrosExibicao.length === 0">
                    <td colspan="3" class="text-center py-6 font-weight-bold text-grey-darken-1">
                      Nenhum carro vinculado a esta escuderia.
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card>

            <!-- Card 4: Pilotos da Escuderia -->
            <v-card class="f1-card-profile pa-6 card-bottom-height overflow-y-auto" rounded="xl">
              <h2 class="text-h6 font-weight-black text-red-accent-4 text-center mb-3">PILOTOS</h2>
              <v-table class="bg-transparent text-black text-center" density="compact">
                <thead>
                  <tr>
                    <th class="text-center font-weight-black th-style">Nº</th>
                    <th class="text-center font-weight-black th-style">NOME</th>
                    <th class="text-center font-weight-black th-style">NACIONALIDADE</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="piloto in pilotosExibicao" :key="piloto.id">
                    <td class="font-weight-black">{{ piloto.numeroCarro ?? piloto.numero ?? 'S/N' }}</td>
                    <td class="font-weight-black text-uppercase">{{ piloto.nome }}</td>
                    <td class="font-weight-bold text-uppercase">{{ piloto.nacionalidade || '-' }}</td>
                  </tr>
                  <tr v-if="pilotosExibicao.length === 0">
                    <td colspan="3" class="text-center py-4 font-weight-bold text-grey-darken-1">
                      Nenhum piloto vinculado a esta escuderia.
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card>

          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import SidebarLateral from '@/components/SidebarLateral.vue'
import AppHeader from '@/components/AppHeader.vue'
import api from '@/services/api'

const route = useRoute()
const escuderia = ref(null)
const carregando = ref(true)

// Computada que extrai o link da foto e aceita tanto urlLogo quanto logoUrl
const fotoValida = computed(() => {
  if (!escuderia.value) return null
  const url = escuderia.value.urlLogo || escuderia.value.logoUrl || escuderia.value.url
  return url && url.trim().length > 0 ? url : null
})

// Computada para lista de carros resiliente
const carrosExibicao = computed(() => {
  if (!escuderia.value) return []
  return escuderia.value.carros || escuderia.value.carrosList || []
})

// Computada para lista de pilotos resiliente
const pilotosExibicao = computed(() => {
  if (!escuderia.value) return []
  return escuderia.value.pilotos || escuderia.value.pilotosList || []
})

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
  height: 100vh;
  overflow: hidden;
  background-image: url('@/assets/f1-manager-logo.jpg');
  background-size: cover;
  background-position: center;
}

.f1-overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(15, 15, 20, 0.35) !important;
  backdrop-filter: blur(2px) !important;
}

.z-index-content { position: relative; z-index: 2; }

.full-page-container {
  height: calc(100vh - 65px) !important;
  max-width: 1450px !important;
  width: 95% !important;
  display: flex;
  flex-direction: column;
}

.full-height-row { flex: 1; height: 100%; }
.full-height-col { height: 100%; }

.f1-card-profile {
  background: rgba(240, 240, 245, 0.5) !important;
  border: 1.5px solid rgba(225, 6, 0, 0.5) !important;
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

.card-top-height {
  flex: 6;
  height: calc(60% - 8px);
}

.card-bottom-height {
  flex: 4;
  height: calc(40% - 8px);
}

.logo-container {
  height: 150px;
  max-width: 220px;
}

.img-logo-fit {
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
  filter: drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.2));
}

.sem-foto-placeholder {
  height: 140px;
  width: 200px;
  background-color: rgba(210, 210, 215, 0.6);
  border: 1px dashed rgba(100, 100, 100, 0.5);
}

.th-style { color: #111111 !important; font-size: 0.85rem; font-weight: 900; }
.lh-relaxed { line-height: 1.5; }
.line-height-tight { line-height: 1.2; }
.justify-between { justify-content: space-between; }
.gap-4 { gap: 16px; }
.fill-height { height: 100%; }
</style>