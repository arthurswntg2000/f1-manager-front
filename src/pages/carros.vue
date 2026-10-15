<!-- Criado (09/10/2026) / Atualizado (13/10/2026) -->
<template>
  <v-app>
    <SidebarLateral />

    <v-main class="f1-bg">
      <div class="f1-overlay"></div>

      <v-app-bar flat color="#15151e" height="65" class="border-b" app>
        <div class="w-100 text-center font-weight-black text-red-accent-4 text-h6 tracking-widest">
          CARROS
        </div>
      </v-app-bar>

      <v-container fluid class="pa-6 z-index-content max-width-container">
        <!-- Linha Superior -->
        <v-row class="mb-4" justify="center">
          <v-col cols="12" sm="5">
            <v-card class="f1-btn-card pa-3 text-center cursor-pointer" rounded="xl" @click="dialogBusca = true">
              <span class="font-weight-black text-grey-darken-4 text-subtitle-2 tracking-wider">
                BUSCAR CARRO
              </span>
            </v-card>
          </v-col>  
          <v-col cols="12" sm="5">
            <v-card class="f1-btn-card pa-3 text-center cursor-pointer" rounded="xl" @click="$router.push('/CadastroCarro')">
              <span class="font-weight-black text-grey-darken-4 text-subtitle-2 tracking-wider">
                + NOVO CARRO
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
                    <th class="text-center font-weight-black text-grey-darken-4">MODELO</th>
                    <th class="text-center font-weight-black text-grey-darken-4">ANO</th>
                    <th class="text-center font-weight-black text-grey-darken-4">AÇÕES</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="carro in carrosPaginados" :key="carro.id">
                    <td class="font-weight-bold">{{ carro.id }}</td>
                    <td class="font-weight-black text-uppercase">{{ carro.modelo }}</td>
                    <td class="font-weight-bold">{{ carro.ano }}</td>
                    <td>
                      <div class="d-flex justify-center gap-1">
                        <v-btn icon="mdi-pencil" size="x-small" variant="text" color="amber-darken-3" @click="editarCarro(carro)"></v-btn>
                        <v-btn icon="mdi-delete" size="x-small" variant="text" color="grey-darken-2" @click="confirmarDeletar(carro)"></v-btn>
                        <v-btn icon="mdi-eye" size="x-small" variant="text" color="grey-darken-3" @click="visualizarCarro(carro)"></v-btn>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="carrosFiltrados.length === 0">
                    <td colspan="4" class="text-center py-4 font-weight-bold text-grey-darken-1">
                      Nenhum carro encontrado.
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
                EXIBINDO {{ carrosPaginados.length }} DE {{ totalCarros }} CARROS
              </span>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <!-- Modal de Busca -->
      <v-dialog v-model="dialogBusca" max-width="500">
        <v-card class="pa-4 bg-grey-darken-4 text-white" rounded="lg">
          <v-card-title class="font-weight-black text-red-accent-4">BUSCAR CARRO</v-card-title>
          <v-card-text>
            <v-text-field v-model="termoBusca" label="Modelo ou Ano" variant="outlined" density="compact" class="mt-2" clearable></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey" variant="text" @click="termoBusca = ''; dialogBusca = false">Limpar</v-btn>
            <v-btn color="red-accent-4" variant="flat" @click="dialogBusca = false">Filtrar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Modal Confirmar Exclusão -->
      <v-dialog v-model="dialogDeletar" max-width="400">
        <v-card class="pa-4 bg-grey-darken-4 text-white" rounded="lg">
          <v-card-title class="font-weight-black text-red-accent-4">CONFIRMAR EXCLUSÃO</v-card-title>
          <v-card-text class="text-subtitle-1">
            Tem certeza que deseja excluir o carro <strong>{{ carroSelecionado?.modelo }}</strong>?
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey" variant="text" @click="dialogDeletar = false">Cancelar</v-btn>
            <v-btn color="red-accent-4" variant="flat" :loading="carregandoAcao" @click="executarExclusao">Excluir</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import SidebarLateral from '@/components/SidebarLateral.vue'
import api from '@/services/api'

const router = useRouter()

const carros = ref([])
const paginaAtual = ref(1)
const itensPorPagina = 6
const totalCarros = ref(0)

const dialogBusca = ref(false)
const dialogDeletar = ref(false)
const carregandoAcao = ref(false)

const termoBusca = ref('')
const carroSelecionado = ref(null)

const carrosFiltrados = computed(() => {
  if (!termoBusca.value) return carros.value
  const termo = termoBusca.value.toLowerCase()
  return carros.value.filter(c => 
    c.modelo?.toLowerCase().includes(termo) || 
    c.motor?.toLowerCase().includes(termo) ||
    c.ano?.toString().includes(termo)
  )
})

const totalPaginas = computed(() => Math.ceil(carrosFiltrados.value.length / itensPorPagina) || 1)

const carrosPaginados = computed(() => {
  const inicio = (paginaAtual.value - 1) * itensPorPagina
  return carrosFiltrados.value.slice(inicio, inicio + itensPorPagina)
})

// Redireciona para CadastroCarro passando apenas o ID
const editarCarro = (carro) => {
  const id = typeof carro === 'object' ? carro.id : carro
  router.push({ path: '/CadastroCarro', query: { id } })
}

const visualizarCarro = (carro) => {
  const id = typeof carro === 'object' ? carro.id : carro
  router.push({ path: '/PerfilCarro', query: { id } })
}

const confirmarDeletar = (carro) => {
  carroSelecionado.value = carro
  dialogDeletar.value = true
}

const executarExclusao = async () => {
  if (!carroSelecionado.value?.id) return

  carregandoAcao.value = true
  try {
    await api.delete(`/carros/${carroSelecionado.value.id}`)
    dialogDeletar.value = false
    carroSelecionado.value = null
    await carregarCarros()
  } catch (err) {
    console.error('Erro ao excluir carro do banco:', err)
  } finally {
    carregandoAcao.value = false
  }
}

const carregarCarros = async () => {
  try {
    const response = await api.get('/carros')
    if (response.data) {
      carros.value = response.data
      totalCarros.value = response.data.length
    }
  } catch (err) {
    console.error('Erro ao buscar carros na API:', err)
  }
}

onMounted(() => {
  carregarCarros()
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
  top: 0; left: 0; width: 100%; height: 100%;
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