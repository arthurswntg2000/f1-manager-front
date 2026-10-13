<!-- Criado/Atualizado (13/10/2026) -->
<template>
  <v-app>
    <SidebarLateral />

    <v-main class="f1-bg">
      <div class="f1-overlay"></div>

      <v-app-bar flat color="#15151e" height="48" class="border-b" app>
        <div class="w-100 text-center font-weight-black text-red-accent-4 text-h6 tracking-widest">
          ESCUDERIAS
        </div>
      </v-app-bar>

      <v-container fluid class="pa-6 z-index-content max-width-container">
        <!-- Linha Superior -->
        <v-row class="mb-4" justify="center">
          <v-col cols="12" sm="5">
            <v-card class="f1-btn-card pa-3 text-center cursor-pointer" rounded="xl" @click="dialogBusca = true">
              <span class="font-weight-black text-grey-darken-4 text-subtitle-2 tracking-wider">
                BUSCAR ESCUDERIA
              </span>
            </v-card>
          </v-col>
          <v-col cols="12" sm="5">
            <v-card class="f1-btn-card pa-3 text-center cursor-pointer" rounded="xl" @click="abrirDialogNovo">
              <span class="font-weight-black text-grey-darken-4 text-subtitle-2 tracking-wider">
                + NOVA ESCUDERIA
              </span>
            </v-card>
          </v-col>
        </v-row>

        <!-- Tabela -->
        <v-row justify="center">
          <v-col cols="12" sm="10">
            <v-card class="f1-card-table pa-6" rounded="xl">
              <v-table class="bg-transparent text-grey-darken-4 text-center">
                <thead>
                  <tr>
                    <th class="text-center font-weight-black text-grey-darken-4">ID</th>
                    <th class="text-center font-weight-black text-grey-darken-4">NOME</th>
                    <th class="text-center font-weight-black text-grey-darken-4">PAÍS DE ORIGEM</th>
                    <th class="text-center font-weight-black text-grey-darken-4">AÇÕES</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="escuderia in escuderiasPaginadas" :key="escuderia.id">
                    <td class="font-weight-bold">{{ escuderia.id }}</td>
                    <td class="font-weight-black text-uppercase">{{ escuderia.nome }}</td>
                    <td class="font-weight-bold text-uppercase">
                      {{ escuderia.paisOrigem || escuderia.pais_origem || escuderia.pais || escuderia.nacionalidade || '-' }}
                    </td>
                    <td>
                      <div class="d-flex justify-center gap-1">
                        <v-btn icon="mdi-pencil" size="x-small" variant="text" color="amber-darken-3" @click="abrirDialogEdicao(escuderia)"></v-btn>
                        <v-btn icon="mdi-delete" size="x-small" variant="text" color="grey-darken-2" @click="confirmarDeletar(escuderia.id)"></v-btn>
                        <v-btn icon="mdi-eye" size="x-small" variant="text" color="grey-darken-3" @click="visualizarEscuderia(escuderia)"></v-btn>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="escuderiasFiltradas.length === 0">
                    <td colspan="4" class="text-center py-4 font-weight-bold text-grey-darken-1">
                      Nenhuma escuderia encontrada.
                    </td>
                  </tr>
                </tbody>
              </v-table>

              <!-- Paginação -->
              <div class="f1-pagination mt-6 py-2 px-4 d-flex justify-center align-center gap-4" rounded="xl">
                <v-btn icon="mdi-chevron-left" variant="text" size="small" color="grey-darken-4" :disabled="paginaAtual === 1" @click="paginaAtual--"></v-btn>
                <span 
                  v-for="p in totalPaginas" 
                  :key="p" 
                  class="cursor-pointer font-weight-black mx-1"
                  :class="p === paginaAtual ? 'text-red-accent-4' : 'text-grey-darken-4'"
                  @click="paginaAtual = p"
                >
                  {{ p }}
                </span>
                <v-btn icon="mdi-chevron-right" variant="text" size="small" color="grey-darken-4" :disabled="paginaAtual === totalPaginas" @click="paginaAtual++"></v-btn>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <!-- Contagem -->
        <v-row justify="center" class="mt-4">
          <v-col cols="12" sm="10">
            <v-card class="f1-btn-card pa-3 text-center" rounded="xl">
              <span class="font-weight-black text-grey-darken-4 text-caption tracking-widest">
                EXIBINDO {{ escuderiasPaginadas.length }} DE {{ totalEscuderias }} ESCUDERIAS
              </span>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <!-- Modais -->
      <v-dialog v-model="dialogBusca" max-width="500">
        <v-card class="pa-4 bg-grey-darken-4 text-white" rounded="lg">
          <v-card-title class="font-weight-black text-red-accent-4">BUSCAR ESCUDERIA</v-card-title>
          <v-card-text>
            <v-text-field v-model="termoBusca" label="Nome ou País" variant="outlined" density="compact" class="mt-2" clearable></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey" variant="text" @click="termoBusca = ''; dialogBusca = false">Limpar</v-btn>
            <v-btn color="red-accent-4" variant="flat" @click="dialogBusca = false">Filtrar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogNovo" max-width="500">
        <v-card class="pa-4 bg-grey-darken-4 text-white" rounded="lg">
          <v-card-title class="font-weight-black text-red-accent-4">
            {{ modoEdicao ? 'EDITAR ESCUDERIA' : 'NOVA ESCUDERIA' }}
          </v-card-title>
          <v-card-text>
            <v-text-field v-model="formEscuderia.nome" label="Nome da Escuderia" variant="outlined" density="compact" class="mt-2"></v-text-field>
            <v-text-field v-model="formEscuderia.pais" label="País de Origem" variant="outlined" density="compact"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey" variant="text" @click="dialogNovo = false">Cancelar</v-btn>
            <v-btn color="red-accent-4" variant="flat" @click="salvarEscuderia">Salvar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogVisualizar" max-width="400">
        <v-card class="pa-4 bg-grey-darken-4 text-white" rounded="lg">
          <v-card-title class="font-weight-black text-red-accent-4">DETALHES DA ESCUDERIA</v-card-title>
          <v-card-text v-if="escuderiaSelecionada">
            <p><strong>ID:</strong> {{ escuderiaSelecionada.id }}</p>
            <p><strong>NOME:</strong> {{ escuderiaSelecionada.nome }}</p>
            <p><strong>PAÍS:</strong> {{ escuderiaSelecionada.pais }}</p>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red-accent-4" variant="flat" @click="dialogVisualizar = false">Fechar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Modal Confirmar Exclusão -->
      <v-dialog v-model="dialogDeletar" max-width="400">
        <v-card class="pa-4 bg-grey-darken-4 text-white" rounded="lg">
          <v-card-title class="font-weight-black text-red-accent-4">CONFIRMAR EXCLUSÃO</v-card-title>
          <v-card-text class="text-subtitle-1">
            Tem certeza que deseja excluir esta escuderia?
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey" variant="text" @click="dialogDeletar = false">Cancelar</v-btn>
            <v-btn color="red-accent-4" variant="flat" @click="executarExclusao">Excluir</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import SidebarLateral from '@/components/SidebarLateral.vue'
import api from '@/services/api'

const escuderias = ref([
  { id: 8, nome: 'Ferrari', pais: 'Itália' },
  { id: 9, nome: 'Red Bull Racing', pais: 'Áustria' },
  { id: 10, nome: 'Mercedes-AMG Petronas', pais: 'Alemanha' },
  { id: 11, nome: 'McLaren F1 Team', pais: 'Reino Unido' },
  { id: 12, nome: 'Aston Martin', pais: 'Reino Unido' },
  { id: 13, nome: 'Alpine F1 Team', pais: 'França' },
])

const paginaAtual = ref(1)
const itensPorPagina = 6
const totalEscuderias = ref(11)

const dialogBusca = ref(false)
const dialogNovo = ref(false)
const dialogVisualizar = ref(false)
const dialogDeletar = ref(false)
const modoEdicao = ref(false)

const termoBusca = ref('')
const idParaDeletar = ref(null)
const escuderiaSelecionada = ref(null)
const formEscuderia = ref({ id: null, nome: '', pais: '' })

const escuderiasFiltradas = computed(() => {
  if (!termoBusca.value) return escuderias.value
  const termo = termoBusca.value.toLowerCase()
  return escuderias.value.filter(e => {
    const nome = e.nome ? e.nome.toLowerCase() : ''
    const pais = (e.paisOrigem || e.pais_origem || e.pais || e.nacionalidade || '').toLowerCase()
    return nome.includes(termo) || pais.includes(termo)
  })
})

const totalPaginas = computed(() => Math.ceil(escuderiasFiltradas.value.length / itensPorPagina) || 1)

const escuderiasPaginadas = computed(() => {
  const inicio = (paginaAtual.value - 1) * itensPorPagina
  return escuderiasFiltradas.value.slice(inicio, inicio + itensPorPagina)
})

const abrirDialogNovo = () => {
  modoEdicao.value = false
  formEscuderia.value = { id: null, nome: '', pais: '' }
  dialogNovo.value = true
}

const abrirDialogEdicao = (escuderia) => {
  modoEdicao.value = true
  formEscuderia.value = { ...escuderia }
  dialogNovo.value = true
}

const visualizarEscuderia = (escuderia) => {
  escuderiaSelecionada.value = escuderia
  dialogVisualizar.value = true
}

const salvarEscuderia = async () => {
  if (modoEdicao.value) {
    const idx = escuderias.value.findIndex(e => e.id === formEscuderia.value.id)
    if (idx !== -1) escuderias.value[idx] = { ...formEscuderia.value }
  } else {
    const novoId = escuderias.value.length ? Math.max(...escuderias.value.map(e => e.id)) + 1 : 1
    escuderias.value.push({ ...formEscuderia.value, id: novoId })
  }
  dialogNovo.value = false
}

const confirmarDeletar = (id) => {
  idParaDeletar.value = id
  dialogDeletar.value = true
}

const executarExclusao = async () => {
  if (idParaDeletar.value !== null) {
    escuderias.value = escuderias.value.filter(e => e.id !== idParaDeletar.value)
    idParaDeletar.value = null
  }
  dialogDeletar.value = false
}

const carregarEscuderias = async () => {
  try {
    const response = await api.get('/escuderias')
    if (response.data && response.data.length > 0) {
      escuderias.value = response.data
      totalEscuderias.value = response.data.length
    }
  } catch (err) {
    console.error('Carregando dados locais...', err)
  }
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
.max-width-container { max-width: 1000px; }

.f1-btn-card {
  background: rgba(240, 240, 245, 0.82) !important;
  border: 1.5px solid rgba(225, 6, 0, 0.5) !important;
  backdrop-filter: blur(10px);
  transition: transform 0.2s, background-color 0.2s;
}

.f1-btn-card:hover { background: rgba(255, 255, 255, 0.95) !important; }

.f1-card-table {
  background: rgba(240, 240, 245, 0.3) !important;
  border: 1.5px solid rgba(225, 6, 0, 0.5) !important;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.f1-pagination {
  border: 1.5px solid rgba(225, 6, 0, 0.5);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.82);
}

.tracking-widest { letter-spacing: 0.15em !important; }
.tracking-wider { letter-spacing: 0.08em !important; }
.cursor-pointer { cursor: pointer; }
.gap-1 { gap: 4px; }
.gap-4 { gap: 16px; }
</style>