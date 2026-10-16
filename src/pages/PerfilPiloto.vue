<!-- Criado/Atualizado (16/10/2026) -->
<template>
  <v-app>
    <SidebarLateral modo="perfil" modulo="PILOTOS" />

    <v-main class="f1-bg">
      <div class="f1-overlay"></div>

      <!-- Barra Superior -->
      <v-app-bar flat color="#15151e" height="65" class="border-b" app>
        <div class="w-100 text-center font-weight-black text-red-accent-4 text-h6 tracking-widest">
          PERFIL
        </div>
      </v-app-bar>

      <v-container fluid class="pa-6 z-index-content full-page-container">
        <!-- Linha Principal ocupando 100% da altura restante -->
        <v-row density="comfortable" class="full-height-row">
          
          <!-- COLUNA DA ESQUERDA: Perfil do Piloto (Ocupa a altura inteira) -->
          <v-col cols="12" md="5" lg="4" class="full-height-col">
            <v-card class="f1-card-profile pa-6 h-100 d-flex flex-column justify-space-between" rounded="xl">
              <div>
                <!-- Foto / Imagem do Piloto -->
                <div class="text-center mb-4">
                  <v-img
                    v-if="piloto.fotoUrl"
                    :src="piloto.fotoUrl"
                    height="240"
                    cover
                    class="rounded-lg border mx-auto"
                  ></v-img>
                  <div v-else class="sem-foto-placeholder d-flex align-center justify-center rounded-lg mx-auto">
                    <span class="text-grey-darken-1 font-weight-bold text-h6">Sem Foto</span>
                  </div>
                </div>

                <!-- Nome do Piloto -->
                <h2 class="text-h4 font-weight-black text-red-accent-4 mb-4 text-uppercase text-center line-height-tight">
                  {{ piloto.nome || 'NOME DO PILOTO' }}
                </h2>
              </div>

              <!-- Dados Pessoais do Piloto (Empurrados para preencher o card) -->
              <v-list class="bg-transparent pa-0 my-auto" density="comfortable">
                <div class="d-flex justify-between py-2 border-b border-grey-lighten-2">
                  <span class="font-weight-black text-grey-darken-4 text-subtitle-2">NACIONALIDADE:</span>
                  <span class="font-weight-black text-black text-subtitle-1 text-uppercase text-right">{{ piloto.nacionalidade || '-' }}</span>
                </div>
                
                <div class="d-flex justify-between py-2 border-b border-grey-lighten-2 mt-2">
                  <span class="font-weight-black text-grey-darken-4 text-subtitle-2">DATA DE NASCIMENTO:</span>
                  <span class="font-weight-black text-black text-subtitle-1 text-right">{{ piloto.dataNascimento || '-' }}</span>
                </div>

                <div class="d-flex justify-between py-2 border-b border-grey-lighten-2 mt-2">
                  <span class="font-weight-black text-grey-darken-4 text-subtitle-2">Nº DO CARRO:</span>
                  <span class="font-weight-black text-black text-subtitle-1 text-right">{{ piloto.numeroCarro ?? '-' }}</span>
                </div>

                <div class="d-flex justify-between py-2 border-b border-grey-lighten-2 mt-2">
                  <span class="font-weight-black text-grey-darken-4 text-subtitle-2">TÍTULOS:</span>
                  <span class="font-weight-black text-black text-subtitle-1 text-right">{{ piloto.titulos ?? 0 }}</span>
                </div>

                <div class="d-flex justify-between py-2 mt-2">
                  <span class="font-weight-black text-grey-darken-4 text-subtitle-2">STATUS:</span>
                  <span class="font-weight-black text-black text-subtitle-1 text-uppercase text-right">{{ piloto.status || '-' }}</span>
                </div>
              </v-list>
            </v-card>
          </v-col>

          <!-- COLUNA DA DIREITA: Biografia (Cima) + Escuderias (Baixo) -->
          <v-col cols="12" md="7" lg="8" class="full-height-col d-flex flex-column gap-4">
            
            <!-- BIOGRAFIA (Divide a altura igualitariamente) -->
            <v-card class="f1-card-profile pa-6 right-half-card overflow-y-auto" rounded="xl">
              <div class="text-left font-weight-black text-red-accent-4 text-h5 tracking-widest mb-3 border-b border-grey-lighten-2 pb-1">
                BIOGRAFIA
              </div>
              <p class="text-body-1 font-weight-medium text-grey-darken-4 text-justify line-height-relaxed">
                {{ piloto.biografia || 'Nenhuma biografia cadastrada para este piloto.' }}
              </p>
            </v-card>

            <!-- ESCUDERIAS VINCULADAS (Divide a altura igualitariamente) -->
            <v-card class="f1-card-profile pa-6 right-half-card overflow-y-auto" rounded="xl">
              <div class="text-left font-weight-black text-red-accent-4 text-h5 tracking-widest mb-3 border-b border-grey-lighten-2 pb-1">
                ESCUDERIAS
              </div>

              <v-table v-if="piloto.escuderias && piloto.escuderias.length > 0" class="bg-transparent text-center text-subtitle-1">
                <thead>
                  <tr>
                    <th class="text-center font-weight-black text-grey-darken-4 text-subtitle-2">ESCUDO</th>
                    <th class="text-center font-weight-black text-grey-darken-4 text-subtitle-2">NOME</th>
                    <th class="text-center font-weight-black text-grey-darken-4 text-subtitle-2">PAÍS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="escuderia in piloto.escuderias" :key="escuderia.id">
                    <td class="py-2">
                      <v-img :src="escuderia.urlLogo" max-width="40" class="mx-auto" contain></v-img>
                    </td>
                    <td class="font-weight-black text-uppercase">{{ escuderia.nome }}</td>
                    <td class="font-weight-bold text-uppercase">{{ escuderia.paisOrigem }}</td>
                  </tr>
                </tbody>
              </v-table>

              <div v-else class="text-center py-6 text-body-1 font-weight-bold text-grey-darken-2">
                Nenhuma escuderia vinculada a este piloto.
              </div>
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
import api from '@/services/api'

const route = useRoute()
const pilotoId = computed(() => route.query.id)

const piloto = ref({
  nome: '',
  nacionalidade: '',
  dataNascimento: '',
  numeroCarro: null,
  titulos: 0,
  status: '',
  biografia: '',
  fotoUrl: '',
  escuderias: []
})

const carregarPiloto = async () => {
  if (!pilotoId.value) return
  try {
    const res = await api.get(`/pilotos/${pilotoId.value}`)
    if (res.data) piloto.value = res.data
  } catch (err) {
    console.error('Erro ao buscar dados do piloto:', err)
  }
}

onMounted(() => {
  carregarPiloto()
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

/* Container com altura total descontando apenas a app-bar de 65px */
.full-page-container {
  height: calc(100vh - 80px) !important;
  max-width: 1450px !important;
  width: 95% !important;
  display: flex;
  flex-direction: column;
}

.full-height-row {
  flex: 1;
  height: 100%;
}

.full-height-col {
  height: 100%;
}

/* Cards com estilo translúcido */
.f1-card-profile {
  background: rgba(240, 240, 245, 0.5) !important;
  border: 1.5px solid rgba(225, 6, 0, 0.5) !important;
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

/* Ocupa exatamente 50% da altura útil da coluna direita menos o gap */
.right-half-card {
  flex: 1;
  height: calc(50% - 8px);
}

.sem-foto-placeholder {
  height: 240px;
  width: 100%;
  background-color: rgba(210, 210, 215, 0.6);
  border: 1px dashed rgba(100, 100, 100, 0.5);
}

.line-height-tight { line-height: 1.2; }
.line-height-relaxed { line-height: 1.6; }
.tracking-widest { letter-spacing: 0.15em !important; }
.justify-between { justify-content: space-between; }
.gap-4 { gap: 16px; }
.h-100 { height: 100%; }
</style>