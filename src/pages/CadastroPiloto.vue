<!-- Criado (14/10/2026) -->
<template>
  <v-app>
    <SidebarLateral modo="cadastro" tipo="piloto" />

    <v-main class="f1-bg">
      <div class="f1-overlay"></div>

      <!-- Barra Superior -->
      <v-app-bar flat color="#15151e" height="65" class="border-b" app>
        <div class="w-100 text-center font-weight-black text-red-accent-4 text-h6 tracking-widest">
          CADASTRO
        </div>
      </v-app-bar>

      <v-container fluid class="pa-6 z-index-content max-width-container">
        <v-card class="f1-card-form pa-6" rounded="xl">
          <v-form @submit.prevent="salvarPiloto">
            <!-- Nome do Piloto -->
            <div class="mb-4">
              <label class="form-label">NOME DO PILOTO</label>
              <v-text-field
                v-model="form.nome"
                placeholder="EX: AYRTON SENNA"
                variant="outlined"
                density="compact"
                hide-details
                class="f1-input mt-1"
              ></v-text-field>
            </div>

            <!-- Nacionalidade e Número do Carro -->
            <v-row density="compact" class="mb-4">
              <v-col cols="12" sm="8">
                <label class="form-label">NACIONALIDADE</label>
                <v-text-field
                  v-model="form.nacionalidade"
                  placeholder="EX: BRASILEIRO"
                  variant="outlined"
                  density="compact"
                  hide-details
                  class="f1-input mt-1"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4">
                <label class="form-label">NÚMERO DO CARRO (Nº)</label>
                <v-select
                  v-model="form.numeroCarro"
                  :items="Array.from({ length: 10000 }, (_, i) => i + 1)"
                  placeholder="1"
                  variant="outlined"
                  density="compact"
                  hide-details
                  class="f1-input mt-1"
                ></v-select>
              </v-col>
            </v-row>

            <!-- Status, Data de Nascimento, Nº de Títulos -->
            <v-row density="compact" class="mb-4">
              <v-col cols="12" sm="4">
                <label class="form-label">STATUS</label>
                <v-select
                  v-model="form.status"
                  :items="['ATIVO', 'APOSENTADO']"
                  placeholder="SELECIONE"
                  variant="outlined"
                  density="compact"
                  hide-details
                  class="f1-input mt-1"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="4">
                <label class="form-label">DATA DE NASCIMENTO</label>
                <v-text-field
                  v-model="form.dataNascimento"
                  type="date"
                  variant="outlined"
                  density="compact"
                  hide-details
                  class="f1-input mt-1"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4">
                <label class="form-label">Nº DE TÍTULOS</label>
                <v-select
                  v-model="form.titulos"
                  :items="Array.from({ length: 101 }, (_, i) => i)"
                  placeholder="0"
                  variant="outlined"
                  density="compact"
                  hide-details
                  class="f1-input mt-1"
                ></v-select>
              </v-col>
            </v-row>

            <!-- Escuderias Vinculadas -->
            <div class="mb-4">
              <label class="form-label">ESCUDERIAS VINCULADAS (SELECIONE UMA OU MAIS)</label>
              <v-select
                v-model="form.escuderiasIds"
                :items="escuderiasOpcoes"
                item-title="nome"
                item-value="id"
                multiple
                placeholder="EX: RED BULL RACING"
                variant="outlined"
                density="compact"
                hide-details
                chips
                class="f1-input mt-1"
              ></v-select>
            </div>

            <!-- Foto de Perfil -->
            <div class="mb-4">
              <label class="form-label">FOTO DE PERFIL</label>
              <v-text-field
                v-model="form.fotoUrl"
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
              <v-btn color="#e10600" size="large" class="font-weight-black text-white px-8 rounded-xl btn-f1" type="submit">
                SALVAR
              </v-btn>
              <v-btn color="#e10600" size="large" class="font-weight-black text-white px-8 rounded-xl btn-f1" @click="cancelar">
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import SidebarLateral from '@/components/SidebarLateral.vue'
import api from '@/services/api'

const router = useRouter()
const escuderiasOpcoes = ref([])

const form = ref({
  nome: '',
  nacionalidade: '',
  numeroCarro: null,
  status: 'ATIVO',
  dataNascimento: '',
  titulos: 0,
  escuderiasIds: [],
  fotoUrl: '',
  biografia: ''
})

const carregarEscuderias = async () => {
  try {
    const res = await api.get('/escuderias')
    escuderiasOpcoes.value = res.data
  } catch (err) {
    console.error('Erro ao carregar escuderias:', err)
  }
}

const salvarPiloto = async () => {
  try {
    await api.post('/pilotos', form.value)
    router.push('/pilotos')
  } catch (err) {
    console.error('Erro ao salvar piloto:', err)
  }
}

const cancelar = () => {
  router.push('/pilotos')
}

onMounted(() => {
  carregarEscuderias()
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
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 15, 20, 0.35) !important;
  backdrop-filter: blur(2px) !important;
}

.z-index-content { position: relative; z-index: 2; }
.max-width-container { max-width: 850px; }

.f1-card-form {
  background: rgba(240, 240, 245, 0.45) !important;
  border: 1.5px solid rgba(225, 6, 0, 0.5) !important;
  backdrop-filter: blur(14px);
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

.btn-f1 { letter-spacing: 0.08em; }
.tracking-widest { letter-spacing: 0.15em !important; }
.gap-3 { gap: 12px; }
</style>