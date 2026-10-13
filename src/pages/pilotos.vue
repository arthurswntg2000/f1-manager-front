<!-- Criado (13/10/2026) -->
<template>
  <v-app>
    <SidebarLateral />

    <v-main class="f1-bg">
      <div class="f1-overlay"></div>

      <!-- Barra Superior -->
      <v-app-bar flat color="#15151e" height="48" class="border-b" app>
        <div class="w-100 text-center font-weight-black text-red-accent-4 text-h6 tracking-widest">
          PILOTOS
        </div>
      </v-app-bar>

      <v-container fluid class="pa-6 z-index-content max-width-container">
        <!-- Linha Superior: Buscar e Novo Piloto -->
        <v-row class="mb-4" justify="center">
          <v-col cols="12" sm="5">
            <v-card class="f1-btn-card pa-3 text-center cursor-pointer" rounded="xl" @click="dialogBusca = true">
              <span class="font-weight-black text-grey-darken-4 text-subtitle-2 tracking-wider">
                BUSCAR PILOTO
              </span>
            </v-card>
          </v-col>
          <v-col cols="12" sm="5">
            <v-card class="f1-btn-card pa-3 text-center cursor-pointer" rounded="xl" @click="abrirDialogNovo">
              <span class="font-weight-black text-grey-darken-4 text-subtitle-2 tracking-wider">
                + NOVO PILOTO
              </span>
            </v-card>
          </v-col>
        </v-row>

        <!-- Card da Tabela de Pilotos -->
        <v-row justify="center">
          <v-col cols="12" sm="10">
            <v-card class="f1-card-table pa-6" rounded="xl">
              <v-table class="bg-transparent text-grey-darken-4 text-center">
                <thead>
                  <tr>
                    <th class="text-center font-weight-black text-grey-darken-4">ID</th>
                    <th class="text-center font-weight-black text-grey-darken-4">PILOTO</th>
                    <th class="text-center font-weight-black text-grey-darken-4">NACIONALIDADE</th>
                    <th class="text-center font-weight-black text-grey-darken-4">AÇÕES</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="piloto in pilotosPaginados" :key="piloto.id">
                    <td class="font-weight-bold">{{ piloto.id }}</td>
                    <td class="font-weight-black text-uppercase">{{ piloto.nome }}</td>
                    <td class="font-weight-bold text-uppercase">{{ piloto.nacionalidade }}</td>
                    <td>
                      <div class="d-flex justify-center gap-1">
                        <v-btn icon="mdi-pencil" size="x-small" variant="text" color="amber-darken-3" @click="abrirDialogEdicao(piloto)"></v-btn>
                        <v-btn icon="mdi-delete" size="x-small" variant="text" color="grey-darken-2" @click="confirmarDeletar(piloto.id)"></v-btn>
                        <v-btn icon="mdi-eye" size="x-small" variant="text" color="grey-darken-3" @click="visualizarPiloto(piloto)"></v-btn>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="pilotosFiltrados.length === 0">
                    <td colspan="4" class="text-center py-4 font-weight-bold text-grey-darken-1">
                      Nenhum piloto encontrado.
                    </td>
                  </tr>
                </tbody>
              </v-table>

              <!-- Paginação Estilizada Interna -->
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

        <!-- Card Inferior de Contagem -->
        <v-row justify="center" class="mt-4">
          <v-col cols="12" sm="10">
            <v-card class="f1-btn-card pa-3 text-center" rounded="xl">
              <span class="font-weight-black text-grey-darken-4 text-caption tracking-widest">
                EXIBINDO {{ pilotosPaginados.length }} DE {{ totalPilotos }} PILOTOS
              </span>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <!-- Modal de Busca -->
      <v-dialog v-model="dialogBusca" max-width="500">
        <v-card class="pa-4 bg-grey-darken-4 text-white" rounded="lg">
          <v-card-title class="font-weight-black text-red-accent-4">BUSCAR PILOTO</v-card-title>
          <v-card-text>
            <v-text-field v-model="termoBusca" label="Nome ou Nacionalidade" variant="outlined" density="compact" class="mt-2" clearable></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey" variant="text" @click="termoBusca = ''; dialogBusca = false">Limpar</v-btn>
            <v-btn color="red-accent-4" variant="flat" @click="dialogBusca = false">Filtrar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Modal Cadastro / Edição -->
      <v-dialog v-model="dialogNovo" max-width="500">
        <v-card class="pa-4 bg-grey-darken-4 text-white" rounded="lg">
          <v-card-title class="font-weight-black text-red-accent-4">
            {{ modoEdicao ? 'EDITAR PILOTO' : 'NOVO PILOTO' }}
          </v-card-title>
          <v-card-text>
            <v-text-field v-model="formPiloto.nome" label="Nome do Piloto" variant="outlined" density="compact" class="mt-2"></v-text-field>
            <v-text-field v-model="formPiloto.nacionalidade" label="Nacionalidade" variant="outlined" density="compact"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey" variant="text" @click="dialogNovo = false">Cancelar</v-btn>
            <v-btn color="red-accent-4" variant="flat" @click="salvarPiloto">Salvar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Modal Visualizar -->
      <v-dialog v-model="dialogVisualizar" max-width="400">
        <v-card class="pa-4 bg-grey-darken-4 text-white" rounded="lg">
          <v-card-title class="font-weight-black text-red-accent-4">DETALHES DO PILOTO</v-card-title>
          <v-card-text v-if="pilotoSelecionado">
            <p><strong>ID:</strong> {{ pilotoSelecionado.id }}</p>
            <p><strong>NOME:</strong> {{ pilotoSelecionado.nome }}</p>
            <p><strong>NACIONALIDADE:</strong> {{ pilotoSelecionado.nacionalidade }}</p>
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
            Tem certeza que deseja excluir este piloto?
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

const pilotos = ref([
  { id: 1, nome: 'Fernando Alonso', nacionalidade: 'Espanha' },
  { id: 2, nome: 'Felipe Massa', nacionalidade: 'Brasil' },
  { id: 3, nome: 'Michael Schumacher', nacionalidade: 'Alemanha' },
  { id: 4, nome: 'Lewis Hamilton', nacionalidade: 'Reino Unido' },
  { id: 5, nome: 'Sebastian Vettel', nacionalidade: 'Alemanha' },
  { id: 6, nome: 'Lando Norris', nacionalidade: 'Reino Unido' },
])

const paginaAtual = ref(1)
const itensPorPagina = 6
const totalPilotos = ref(22)

const dialogBusca = ref(false)
const dialogNovo = ref(false)
const dialogVisualizar = ref(false)
const dialogDeletar = ref(false)
const modoEdicao = ref(false)

const termoBusca = ref('')
const idParaDeletar = ref(null)
const pilotoSelecionado = ref(null)
const formPiloto = ref({ id: null, nome: '', nacionalidade: '' })

const pilotosFiltrados = computed(() => {
  if (!termoBusca.value) return pilotos.value
  const termo = termoBusca.value.toLowerCase()
  return pilotos.value.filter(p => 
    p.nome.toLowerCase().includes(termo) || 
    p.nacionalidade.toLowerCase().includes(termo)
  )
})

const totalPaginas = computed(() => Math.ceil(pilotosFiltrados.value.length / itensPorPagina) || 1)

const pilotosPaginados = computed(() => {
  const inicio = (paginaAtual.value - 1) * itensPorPagina
  return pilotosFiltrados.value.slice(inicio, inicio + itensPorPagina)
})

const abrirDialogNovo = () => {
  modoEdicao.value = false
  formPiloto.value = { id: null, nome: '', nacionalidade: '' }
  dialogNovo.value = true
}

const abrirDialogEdicao = (piloto) => {
  modoEdicao.value = true
  formPiloto.value = { ...piloto }
  dialogNovo.value = true
}

const visualizarPiloto = (piloto) => {
  pilotoSelecionado.value = piloto
  dialogVisualizar.value = true
}

const salvarPiloto = async () => {
  if (modoEdicao.value) {
    const idx = pilotos.value.findIndex(p => p.id === formPiloto.value.id)
    if (idx !== -1) pilotos.value[idx] = { ...formPiloto.value }
  } else {
    const novoId = pilotos.value.length ? Math.max(...pilotos.value.map(p => p.id)) + 1 : 1
    pilotos.value.push({ ...formPiloto.value, id: novoId })
  }
  dialogNovo.value = false
}

const confirmarDeletar = (id) => {
  idParaDeletar.value = id
  dialogDeletar.value = true
}

const executarExclusao = async () => {
  if (idParaDeletar.value !== null) {
    pilotos.value = pilotos.value.filter(p => p.id !== idParaDeletar.value)
    idParaDeletar.value = null
  }
  dialogDeletar.value = false
}

const carregarPilotos = async () => {
  try {
    const response = await api.get('/pilotos')
    if (response.data && response.data.length > 0) {
      pilotos.value = response.data
      totalPilotos.value = response.data.length
    }
  } catch (err) {
    console.error('Carregando dados locais...', err)
  }
}

onMounted(() => {
  carregarPilotos()
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