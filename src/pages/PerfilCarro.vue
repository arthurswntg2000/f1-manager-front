<!-- Criado (15/10/2026) / Atualizado (16/10/2026) -->
<template>
  <v-app>
    <SidebarLateral modo="perfil" modulo="CARROS" />
    <AppHeader titulo="PERFIL" />

    <v-main class="f1-bg">
      <div class="f1-overlay"></div>

      <v-container fluid class="pa-6 z-index-content full-page-container">
        <!-- Linha Principal ocupando 100% da altura restante -->
        <v-row density="comfortable" class="full-height-row">
          
          <!-- COLUNA DA ESQUERDA: Perfil do Carro (Ocupa a altura inteira) -->
          <v-col cols="12" md="5" lg="4" class="full-height-col">
            <v-card class="f1-card-profile pa-6 h-100 d-flex flex-column justify-space-between" rounded="xl">
              <div>
                <!-- Imagem do Carro -->
                <div class="text-center mb-4">
                  <v-img
                    v-if="carro.fotoUrl"
                    :src="carro.fotoUrl"
                    height="220"
                    cover
                    class="rounded-lg border mx-auto"
                  ></v-img>
                  <div v-else class="sem-foto-placeholder d-flex align-center justify-center rounded-lg mx-auto">
                    <span class="text-grey-darken-1 font-weight-bold text-h6">Sem Foto do Carro</span>
                  </div>
                </div>

                <!-- Modelo do Carro -->
                <h2 class="text-h3 font-weight-black text-red-accent-4 mb-4 text-uppercase text-center line-height-tight">
                  {{ carro.modelo || 'MODELO DO CARRO' }}
                </h2>
              </div>

              <!-- Especificações Básicas do Carro -->
              <v-list class="bg-transparent pa-0 my-auto" density="comfortable">
                <div class="d-flex justify-between py-2 border-b border-grey-lighten-2">
                  <span class="font-weight-black text-grey-darken-4 text-subtitle-2">MOTOR:</span>
                  <span class="font-weight-black text-black text-subtitle-1 text-uppercase text-right">{{ carro.motor || '-' }}</span>
                </div>
                
                <div class="d-flex justify-between py-2 border-b border-grey-lighten-2 mt-2">
                  <span class="font-weight-black text-grey-darken-4 text-subtitle-2">ANO DE FABRICAÇÃO:</span>
                  <span class="font-weight-black text-black text-subtitle-1 text-right">{{ carro.ano || '-' }}</span>
                </div>

                <div class="d-flex justify-between py-2 mt-2">
                  <span class="font-weight-black text-grey-darken-4 text-subtitle-2">ESCUDERIA:</span>
                  <span class="font-weight-black text-black text-subtitle-1 text-uppercase text-right">
                    {{ carro.escuderia?.nome || 'NÃO VINCULADA' }}
                  </span>
                </div>
              </v-list>
            </v-card>
          </v-col>

          <!-- COLUNA DA DIREITA: Ficha Técnica (Cima) + Pilotos (Baixo) -->
          <v-col cols="12" md="7" lg="8" class="full-height-col d-flex flex-column gap-4">
            
            <!-- FICHA TÉCNICA -->
            <v-card class="f1-card-profile pa-6 right-half-card overflow-y-auto" rounded="xl">
              <div class="text-left font-weight-black text-red-accent-4 text-h5 tracking-widest mb-3 border-b border-grey-lighten-2 pb-1">
                FICHA TÉCNICA
              </div>
              <p class="text-body-1 font-weight-medium text-grey-darken-4 text-justify line-height-relaxed">
                {{ carro.fichaTecnica || 'Nenhuma ficha técnica cadastrada para este carro.' }}
              </p>
            </v-card>

            <!-- PILOTOS QUE O USARAM -->
            <v-card class="f1-card-profile pa-6 right-half-card overflow-y-auto" rounded="xl">
              <div class="text-left font-weight-black text-red-accent-4 text-h5 tracking-widest mb-3 border-b border-grey-lighten-2 pb-1">
                PILOTOS QUE O USARAM
              </div>

              <v-table v-if="carro.pilotos && carro.pilotos.length > 0" class="bg-transparent text-center text-subtitle-1">
                <thead>
                  <tr>
                    <th class="text-center font-weight-black text-grey-darken-4 text-subtitle-2">Nº</th>
                    <th class="text-center font-weight-black text-grey-darken-4 text-subtitle-2">NOME</th>
                    <th class="text-center font-weight-black text-grey-darken-4 text-subtitle-2">NACIONALIDADE</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="piloto in carro.pilotos" :key="piloto.id">
                    <td class="font-weight-bold">{{ piloto.numeroCarro ?? '-' }}</td>
                    <td class="font-weight-black text-uppercase">{{ piloto.nome }}</td>
                    <td class="font-weight-bold text-uppercase">{{ piloto.nacionalidade }}</td>
                  </tr>
                </tbody>
              </v-table>

              <div v-else class="text-center py-6 text-body-1 font-weight-bold text-grey-darken-2">
                Nenhum piloto registrado para este carro.
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
import AppHeader from '@/components/AppHeader.vue'
import api from '@/services/api'

const route = useRoute()
const carroId = computed(() => route.query.id)

const carro = ref({
  modelo: '',
  motor: '',
  ano: null,
  fotoUrl: '',
  fichaTecnica: '',
  escuderia: null,
  pilotos: []
})

const carregarCarro = async () => {
  if (!carroId.value) return
  try {
    const res = await api.get(`/carros/${carroId.value}`)
    if (res.data) carro.value = res.data
  } catch (err) {
    console.error('Erro ao buscar dados do carro:', err)
  }
}

onMounted(() => {
  carregarCarro()
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

.right-half-card {
  flex: 1;
  height: calc(50% - 8px);
}

.sem-foto-placeholder {
  height: 220px;
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