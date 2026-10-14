<!-- Criado (14/10/2026) -->
<template>
  <v-app>
    <!-- Sidebar em modo cadastro para Carros (Mostra CARROS e CADASTRO) -->
    <SidebarLateral modo="cadastro" tipo="carro" />

    <v-main class="f1-bg">
      <div class="f1-overlay"></div>

      <!-- Barra Superior -->
      <v-app-bar flat color="#15151e" height="65" class="border-b" app>
        <div class="w-100 text-center font-weight-black text-red-accent-4 text-h6 tracking-widest">
          CADASTRO
        </div>
      </v-app-bar>

      <v-container fluid class="pa-6 z-index-content max-width-container">
        <!-- Card Translúcido do Formulário -->
        <v-card class="f1-card-form pa-6" rounded="xl">
          <v-form @submit.prevent="salvarCarro">
            <!-- Modelo do Carro -->
            <div class="mb-4">
              <label class="form-label">MODELO DO CARRO</label>
              <v-text-field
                v-model="form.modelo"
                placeholder="EX: SF-23"
                variant="outlined"
                density="compact"
                hide-details
                class="f1-input mt-1"
              ></v-text-field>
            </div>

            <!-- Motor do Carro e Ano de Fabricação -->
            <v-row density="compact" class="mb-4">
              <v-col cols="12" sm="8">
                <label class="form-label">MOTOR DO CARRO</label>
                <v-text-field
                  v-model="form.motor"
                  placeholder="EX: FERRARI 066/10"
                  variant="outlined"
                  density="compact"
                  hide-details
                  class="f1-input mt-1"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4">
                <label class="form-label">ANO DE FABRICAÇÃO</label>
                <v-select
                  v-model="form.ano"
                  :items="anosDisponiveis"
                  placeholder="SELECIONE"
                  variant="outlined"
                  density="compact"
                  hide-details
                  class="f1-input mt-1"
                ></v-select>
              </v-col>
            </v-row>

            <!-- Escuderia Vinculada -->
            <div class="mb-4">
              <label class="form-label">ESCUDERIA VINCULADA</label>
              <v-select
                v-model="form.escuderiaId"
                :items="escuderiasOpcoes"
                item-title="nome"
                item-value="id"
                placeholder="SELECIONE"
                variant="outlined"
                density="compact"
                hide-details
                class="f1-input mt-1"
              ></v-select>
            </div>

            <!-- Foto do Carro -->
            <div class="mb-4">
              <label class="form-label">FOTO DO CARRO</label>
              <v-text-field
                v-model="form.fotoUrl"
                placeholder="EX: HTTPS://..."
                variant="outlined"
                density="compact"
                hide-details
                class="f1-input mt-1"
              ></v-text-field>
            </div>

            <!-- Ficha Técnica -->
            <div class="mb-6">
              <label class="form-label">FICHA TÉCNICA</label>
              <v-textarea
                v-model="form.fichaTecnica"
                placeholder="MÁX 600 CARACTERES"
                variant="outlined"
                density="compact"
                hide-details
                rows="4"
                maxlength="600"
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import SidebarLateral from '@/components/SidebarLateral.vue'
import api from '@/services/api'

const router = useRouter()
const carregando = ref(false)

// Lista de anos de fabricação (de 1950 até o ano atual)
const anoAtual = new Date().getFullYear()
const anosDisponiveis = Array.from({ length: anoAtual - 1949 }, (_, i) => anoAtual - i)

const escuderiasOpcoes = ref([])

const form = ref({
  modelo: '',
  motor: '',
  ano: null,
  escuderiaId: null,
  fotoUrl: '',
  fichaTecnica: ''
})

const carregarEscuderias = async () => {
  try {
    const response = await api.get('/escuderias')
    if (response.data) {
      escuderiasOpcoes.value = response.data
    }
  } catch (err) {
    console.error('Erro ao carregar escuderias da API:', err)
  }
}

const salvarCarro = async () => {
  carregando.value = true
  try {
    await api.post('/carros', form.value)
    router.push('/carros')
  } catch (err) {
    console.error('Erro ao cadastrar carro:', err)
  } finally {
    carregando.value = false
  }
}

const cancelar = () => {
  router.push('/carros')
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
  background-repeat: no-repeat;
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

/* Card Translúcido do Formulário */
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

/* Customização dos Inputs Vuetify para o tema F1 */
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

.btn-f1 {
  letter-spacing: 0.08em;
  font-size: 0.95rem;
}

.tracking-widest { letter-spacing: 0.15em !important; }
.gap-3 { gap: 12px; }
</style>