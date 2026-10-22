<!-- Criado (14/10/2026) / Atualizações (15/10/2026); (16/10/2026) -->
<template>
  <v-app>
    <SidebarLateral modo="cadastro" modulo="ESCUDERIAS" />
    <AppHeader titulo="CADASTRO" />

    <v-main class="f1-bg">
      <div class="f1-overlay"></div>

      <v-container fluid class="pa-6 z-index-content max-width-container">
        <v-card class="f1-card-form pa-6" rounded="xl">
          <v-form ref="formRef" @submit.prevent="salvarEscuderia">
            <!-- Nome da Escuderia -->
            <div class="mb-4">
              <label class="form-label">NOME DA ESCUDERIA *</label>
              <v-text-field
                v-model="form.nome"
                placeholder="EX: FERRARI"
                :rules="[v => !!v || 'O nome da escuderia é obrigatório']"
                variant="outlined"
                density="compact"
                class="f1-input mt-1"
              ></v-text-field>
            </div>

            <!-- País de Origem, Data de Fundação e Nº de Títulos -->
            <v-row density="compact" class="mb-4">
              <v-col cols="12" sm="5">
                <label class="form-label">PAÍS DE ORIGEM *</label>
                <v-text-field
                  v-model="form.paisOrigem"
                  placeholder="EX: ITÁLIA"
                  :rules="[v => !!v || 'O país de origem é obrigatório']"
                  variant="outlined"
                  density="compact"
                  class="f1-input mt-1"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4">
                <label class="form-label">DATA DE FUNDAÇÃO</label>
                <v-text-field
                  v-model="form.dataFundacao"
                  type="date"
                  variant="outlined"
                  density="compact"
                  hide-details
                  class="f1-input mt-1"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="3">
                <label class="form-label">Nº DE TÍTULOS</label>
                <v-select
                  v-model="form.titulos"
                  :items="listaTitulos"
                  placeholder="0"
                  variant="outlined"
                  density="compact"
                  hide-details
                  class="f1-input mt-1"
                ></v-select>
              </v-col>
            </v-row>

            <!-- Fundador -->
            <div class="mb-4">
              <label class="form-label">FUNDADOR</label>
              <v-text-field
                v-model="form.fundador"
                placeholder="EX: ENZO FERRARI"
                variant="outlined"
                density="compact"
                hide-details
                class="f1-input mt-1"
              ></v-text-field>
            </div>

            <!-- Pilotos Vinculados -->
            <div class="mb-4">
              <label class="form-label">PILOTOS VINCULADOS (SELECIONE UM OU MAIS)</label>
              <v-select
                v-model="form.pilotosIds"
                :items="pilotosOpcoes"
                item-title="nome"
                item-value="id"
                multiple
                placeholder="EX: FERNANDO ALONSO"
                variant="outlined"
                density="compact"
                hide-details
                chips
                class="f1-input mt-1"
              ></v-select>
            </div>

            <!-- Carros Vinculados -->
            <div class="mb-4">
              <label class="form-label">CARROS VINCULADOS (SELECIONE UM OU MAIS)</label>
              <v-select
                v-model="form.carrosIds"
                :items="carrosOpcoes"
                item-title="modelo"
                item-value="id"
                multiple
                placeholder="EX: RB20"
                variant="outlined"
                density="compact"
                hide-details
                chips
                class="f1-input mt-1"
              ></v-select>
            </div>

            <!-- Logo da Escuderia -->
            <div class="mb-4">
              <label class="form-label">LOGO DA ESCUDERIA</label>
              <v-text-field
                v-model="form.urlLogo"
                placeholder="EX: HTTPS://..."
                variant="outlined"
                density="compact"
                hide-details
                class="f1-input mt-1"
              ></v-text-field>
            </div>

            <!-- Biografia -->
            <div class="mb-6">
              <label class="form-label">BIOGRAFIA</label>
              <v-textarea
                v-model="form.biografia"
                placeholder="MÁX 400 CARACTERES"
                variant="outlined"
                density="compact"
                hide-details
                rows="3"
                maxlength="400"
                class="f1-input mt-1"
              ></v-textarea>
            </div>

            <!-- Botões de Ação -->
            <div class="d-flex justify-end gap-3">
              <v-btn
                color="#e10600"
                size="large"
                class="font-weight-black text-white px-8 rounded-xl btn-f1"
                type="submit"
                :loading="carregando"
              >
                SALVAR
              </v-btn>
              <v-btn
                color="#e10600"
                size="large"
                class="font-weight-black text-white px-8 rounded-xl btn-f1"
                @click="cancelar"
              >
                CANCELAR
              </v-btn>
            </div>
          </v-form>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SidebarLateral from '@/components/SidebarLateral.vue'
import AppHeader from '@/components/AppHeader.vue'
import { registrarAtividade } from '@/services/activityLogger'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()
const formRef = ref(null)

const escuderiaId = computed(() => route.query.id)
const isEdicao = computed(() => !!escuderiaId.value)

const carregando = ref(false)
const listaTitulos = Array.from({ length: 101 }, (_, i) => i)

const pilotosOpcoes = ref([])
const carrosOpcoes = ref([])

const form = ref({
  nome: '',
  paisOrigem: '',
  dataFundacao: '',
  titulos: 0,
  fundador: '',
  pilotosIds: [],
  carrosIds: [],
  urlLogo: '',
  biografia: ''
})

const carregarDadosAuxiliares = async () => {
  try {
    const [resPilotos, resCarros] = await Promise.all([
      api.get('/pilotos'),
      api.get('/carros')
    ])
    if (resPilotos.data) pilotosOpcoes.value = resPilotos.data
    if (resCarros.data) carrosOpcoes.value = resCarros.data
  } catch (err) {
    console.error('Erro ao carregar pilotos/carros:', err)
  }
}

const carregarDadosEscuderia = async () => {
  if (!isEdicao.value) return
  try {
    const res = await api.get(`/escuderias/${escuderiaId.value}`)
    const e = res.data

    form.value = {
      nome: e.nome || '',
      paisOrigem: e.paisOrigem || '',
      dataFundacao: e.dataFundacao || '',
      titulos: e.titulos ?? 0,
      fundador: e.fundador || '',
      pilotosIds: e.pilotos ? e.pilotos.map(p => p.id) : (e.pilotosIds || []),
      carrosIds: e.carros ? e.carros.map(c => c.id) : (e.carrosIds || []),
      urlLogo: e.urlLogo || '',
      biografia: e.biografia || ''
    }
  } catch (err) {
    console.error('Erro ao carregar escuderia para edição:', err)
  }
}

const salvarEscuderia = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  carregando.value = true
  try {
    if (isEdicao.value) {
      await api.put(`/escuderias/${escuderiaId.value}`, form.value)
      registrarAtividade('ESCUDERIA', `Escuderia atualizada: ${form.value.nome}`)
    } else {
      await api.post('/escuderias', form.value)
      registrarAtividade('ESCUDERIA', `Nova escuderia registrada: ${form.value.nome}`)
    }
    router.push('/escuderias')
  } catch (err) {
    console.error('Erro ao salvar escuderia:', err)
  } finally {
    carregando.value = false
  }
}

const cancelar = () => {
  router.push('/escuderias')
}

onMounted(async () => {
  await carregarDadosAuxiliares()
  await carregarDadosEscuderia()
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
.max-width-container { max-width: 850px; }

.f1-card-form {
  background: rgba(240, 240, 245, 0.45) !important;
  border: 1.5px solid rgba(225, 6, 0, 0.5) !important;
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

.form-label {
  font-weight: 900;
  font-size: 0.85rem;
  color: #1a1a1a;
  letter-spacing: 0.05em;
}

:deep(.f1-input .v-field) {
  background-color: rgba(220, 220, 225, 0.7) !important;
  border-radius: 12px !important;
  border: 1px solid rgba(225, 6, 0, 0.4) !important;
}

:deep(.f1-input .v-field__input) {
  color: #111 !important;
  font-weight: 700;
  font-size: 0.9rem;
}

:deep(.f1-input input::placeholder),
:deep(.f1-input textarea::placeholder) {
  color: #777 !important;
  font-style: italic;
  font-weight: 600;
}

:deep(.v-messages__message) {
  color: #ff0000 !important; 
  font-weight: 900 !important; 
  font-size: 0.78rem !important;
  letter-spacing: 0.03em;
  opacity: 1 !important;
  margin-top: 3px !important;
}

:deep(.v-field--error) {
  border: 2px solid #ff0000 !important;
  background-color: rgba(255, 235, 235, 0.95) !important;
}

.btn-f1 {
  letter-spacing: 0.08em;
  font-size: 0.95rem;
}

.tracking-widest { letter-spacing: 0.15em !important; }
.gap-3 { gap: 12px; }
</style>