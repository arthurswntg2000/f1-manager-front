<!-- Criado (15/10/2026) /Atualizações (16/10/2026) / (27/10/2026) -->
<template>
  <v-app>
    <SidebarLateral modo="perfil" modulo="PILOTOS" />
    <AppHeader titulo="PERFIL" />

    <v-main class="f1-bg">
      <div class="f1-overlay"></div>

      <v-container fluid class="pa-6 z-index-content full-page-container">
        <div v-if="carregando" class="d-flex align-center justify-center fill-height">
          <v-progress-circular indeterminate color="red-accent-4" size="64"></v-progress-circular>
        </div>

        <v-row v-else-if="piloto" density="comfortable" class="full-height-row">
          
          <!-- COLUNA ESQUERDA -->
          <v-col cols="12" md="5" lg="5" class="d-flex flex-column gap-4 full-height-col">
            
            <!-- CARD SUPERIOR: Foto Ajustada + Nome -->
            <v-card class="f1-card-profile pa-4 card-foto-piloto d-flex flex-column align-center justify-center text-center" rounded="xl">
              <div class="foto-container mb-2">
                <img
                  v-if="fotoValida"
                  :src="fotoValida"
                  alt="Foto do Piloto"
                  class="img-piloto-fit"
                />
                <div v-else class="sem-foto-piloto d-flex align-center justify-center rounded-lg mx-auto">
                  <span class="text-grey-darken-1 font-weight-bold">Sem Foto</span>
                </div>
              </div>

              <h1 class="text-h4 font-weight-black text-red-accent-4 text-uppercase ma-0 tracking-wide">
                {{ piloto.nome }}
              </h1>
            </v-card>

            <!-- CARD INFERIOR: Informações do Piloto -->
            <v-card class="f1-card-profile pa-6 card-info-piloto d-flex flex-column justify-center" rounded="xl">
              <div class="info-grid">
                <div class="info-row">
                  <span class="info-label">NACIONALIDADE:</span>
                  <span class="info-value">{{ piloto.nacionalidade || '-' }}</span>
                </div>

                <div class="info-row">
                  <span class="info-label">DATA DE NASCIMENTO:</span>
                  <span class="info-value">{{ piloto.dataNascimento || '-' }}</span>
                </div>

                <div class="info-row">
                  <span class="info-label">Nº DO CARRO:</span>
                  <span class="info-value">{{ piloto.numeroCarro ?? piloto.numero ?? '-' }}</span>
                </div>

                <div class="info-row">
                  <span class="info-label">TÍTULOS:</span>
                  <span class="info-value">{{ piloto.titulos ?? 0 }}</span>
                </div>

                <div class="info-row no-border">
                  <span class="info-label">STATUS:</span>
                  <span class="info-value status-badge">{{ piloto.status || '-' }}</span>
                </div>
              </div>
            </v-card>

          </v-col>

          <!-- COLUNA DIREITA -->
          <v-col cols="12" md="7" lg="7" class="d-flex flex-column gap-4 full-height-col">
            
            <!-- CARD 3: Biografia -->
            <v-card class="f1-card-profile pa-6 card-biografia overflow-y-auto" rounded="xl">
              <h2 class="text-h6 font-weight-black text-red-accent-4 text-center mb-3 text-uppercase">BIOGRAFIA</h2>
              <p class="text-body-1 text-black font-weight-medium lh-relaxed text-justify ma-0">
                {{ piloto.biografia || 'Nenhuma biografia cadastrada para este piloto.' }}
              </p>
            </v-card>

            <!-- CARD 4: Escuderias -->
            <v-card class="f1-card-profile pa-6 card-escuderias overflow-y-auto" rounded="xl">
              <h2 class="text-h6 font-weight-black text-red-accent-4 text-center mb-3 text-uppercase">ESCUDERIAS</h2>
              
              <v-table v-if="escuderiasExibicao.length > 0" class="bg-transparent text-black text-center" density="comfortable">
                <thead>
                  <tr>
                    <th class="text-center font-weight-black th-style">ESCUDO</th>
                    <th class="text-center font-weight-black th-style">NOME</th>
                    <th class="text-center font-weight-black th-style">PAÍS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="escuderia in escuderiasExibicao" :key="escuderia.id">
                    <td class="align-middle">
                      <img
                        v-if="getLogoEscuderia(escuderia)"
                        :src="getLogoEscuderia(escuderia)"
                        alt="Logo"
                        style="height: 30px; max-width: 50px; object-fit: contain; display: block; margin: 0 auto;"
                      />
                      <span v-else class="text-caption font-weight-bold text-grey">-</span>
                    </td>
                    <td class="font-weight-black text-uppercase">{{ escuderia.nome }}</td>
                    <td class="font-weight-bold text-uppercase">{{ escuderia.paisOrigem || '-' }}</td>
                  </tr>
                </tbody>
              </v-table>

              <div v-else class="text-center py-6 font-weight-bold text-grey-darken-2">
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
import AppHeader from '@/components/AppHeader.vue'
import api from '@/services/api'

const route = useRoute()
const piloto = ref(null)
const carregando = ref(true)

const fotoValida = computed(() => {
  if (!piloto.value) return null
  const url = piloto.value.urlFoto || piloto.value.fotoUrl
  return url && url.trim().length > 0 ? url : null
})

const escuderiasExibicao = computed(() => {
  if (!piloto.value) return []
  return piloto.value.escuderias || piloto.value.escuderiasList || []
})

const carregarPiloto = async () => {
  const id = route.query.id || route.params.id
  if (!id) return
  carregando.value = true
  try {
    const res = await api.get(`/pilotos/${id}`)
    piloto.value = res.data
  } catch (err) {
    console.error('Erro ao carregar perfil do piloto:', err)
  } finally {
    carregando.value = false
  }
}

const getLogoEscuderia = (escuderia) => {
  if (!escuderia) return null
  const url = escuderia.urlLogo || escuderia.logoUrl || escuderia.logo || escuderia.url
  return url && url.trim().length > 0 ? url.trim() : null
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

.full-page-container {
  height: calc(100vh - 65px) !important;
  max-width: 1450px !important;
  width: 95% !important;
}

.full-height-row { height: 100%; }
.full-height-col { height: 100%; }

.f1-card-profile {
  background: rgba(240, 240, 245, 0.5) !important;
  border: 1.5px solid rgba(225, 6, 0, 0.5) !important;
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

/* PROPORÇÃO DOS CARDS */
.card-foto-piloto { 
  flex: 1.2; 
}

.card-info-piloto { 
  flex: 1; 
}

.card-biografia { 
  flex: 1; 
}

.card-escuderias { 
  flex: 1.2; 
}

/* CONTAINER E IMAGEM DO PILOTO */
.foto-container {
  height: 260px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.img-piloto-fit {
  height: 100%;
  max-width: 100%;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
}

.sem-foto-piloto {
  height: 240px;
  width: 180px;
  background-color: rgba(210, 210, 215, 0.6);
  border: 1px dashed rgba(100, 100, 100, 0.5);
}

/* GRADE DE INFORMAÇÕES */
.info-grid {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-evenly;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.info-row.no-border {
  border-bottom: none;
}

.info-label {
  font-weight: 900;
  color: #1a1a1a;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
}

.info-value {
  font-weight: 900;
  color: #000000;
  font-size: 0.9rem;
  text-transform: uppercase;
}

.th-style { color: #111111 !important; font-size: 0.85rem; font-weight: 900; }
.lh-relaxed { line-height: 1.5; }
.gap-4 { gap: 16px; }
.fill-height { height: 100%; }
.tracking-wide { letter-spacing: 1px; }
</style>