<!-- Criado (13/10/2026) / Atualizações (16/10/2026); (19/10/2026); (20/10/2026); (22/10/2026) -->
<template>
  <v-app>
    <SidebarLateral />
    <AppHeader titulo="PILOTOS" />

    <v-main class="f1-bg">
      <div class="f1-overlay"></div>

      <v-container fluid class="pa-6 z-index-content max-width-container">
        <!-- Linha Superior: Barra Unificada de Busca e Novo Piloto -->
        <v-row class="mb-4" justify="center">
          <v-col cols="12" sm="10">
            <v-card class="f1-btn-card pa-2 px-4 d-flex align-center gap-3" rounded="xl">
              <!-- Campo de Busca Integrado -->
              <v-text-field
                v-model="termoBusca"
                placeholder="BUSCAR PILOTO (NOME, NACIONALIDADE...)"
                prepend-inner-icon="mdi-magnify"
                variant="plain"
                density="compact"
                hide-details
                clearable
                class="f1-search-input flex-grow-1"
              ></v-text-field>

              <v-divider vertical class="my-2 border-grey-darken-2"></v-divider>

              <!-- Botão Novo Piloto -->
              <v-btn
                color="#e10600"
                variant="flat"
                rounded="lg"
                class="font-weight-black text-white px-5 btn-f1"
                prepend-icon="mdi-plus"
                @click="$router.push('/CadastroPiloto')"
              >
                NOVO
              </v-btn>
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
                        <v-btn icon="mdi-pencil" size="x-small" variant="text" color="amber-darken-3" @click="editarPiloto(piloto.id)"></v-btn>
                        <v-btn icon="mdi-delete" size="x-small" variant="text" color="grey-darken-2" @click="confirmarDeletar(piloto)"></v-btn>
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
                {{ textoExibicao }}
              </span>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <!-- Modal Confirmar Exclusão -->
      <v-dialog v-model="dialogDeletar" max-width="400">
        <v-card class="pa-4 bg-grey-darken-4 text-white" rounded="lg">
          <v-card-title class="font-weight-black text-red-accent-4">CONFIRMAR EXCLUSÃO</v-card-title>
          <v-card-text class="text-subtitle-1">
            Tem certeza que deseja excluir o piloto <strong>{{ pilotoSelecionado?.nome }}</strong>?
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
import AppHeader from '@/components/AppHeader.vue'
import { registrarAtividade } from '@/services/activityLogger'
import api from '@/services/api'

const router = useRouter()

const pilotos = ref([])
const paginaAtual = ref(1)
const itensPorPagina = 6
const totalPilotos = ref(0)

const dialogDeletar = ref(false)
const carregandoAcao = ref(false)

const termoBusca = ref('')
const pilotoSelecionado = ref(null)

const totalPilotosExibicao = computed(() => pilotosFiltrados.value.length)

const textoExibicao = computed(() => {
  if (totalPilotosExibicao.value === 0) {
    return 'NENHUM PILOTO ENCONTRADO'
  }

  const inicio = (paginaAtual.value - 1) * itensPorPagina + 1
  const fim = Math.min(paginaAtual.value * itensPorPagina, totalPilotosExibicao.value)

  return `EXIBINDO ${inicio}-${fim} DE ${totalPilotosExibicao.value} PILOTOS`
})

const pilotosFiltrados = computed(() => {
  if (!termoBusca.value) return pilotos.value
  const termo = termoBusca.value.toLowerCase()
  return pilotos.value.filter(p => 
    p.nome?.toLowerCase().includes(termo) || 
    p.nacionalidade?.toLowerCase().includes(termo) ||
    p.id?.toString().includes(termo)
  )
})

// Criado (19/10/2026)
async function reativarPiloto(id) {
  try {
    const res = await api.put(`/pilotos/${id}/reativar`)
    const piloto = res.data

    registrarAtividade('PILOTO_REATIVADO', `Piloto reativado no sistema: ${piloto.nome}`)

    await carregarPilotos()
  } catch (err) {
    console.error('Erro ao reativar piloto:', err)
  }
}

const totalPaginas = computed(() => Math.ceil(pilotosFiltrados.value.length / itensPorPagina) || 1)

const pilotosPaginados = computed(() => {
  const inicio = (paginaAtual.value - 1) * itensPorPagina
  return pilotosFiltrados.value.slice(inicio, inicio + itensPorPagina)
})

const editarPiloto = (id) => {
  router.push({ path: '/CadastroPiloto', query: { id } })
}

const visualizarPiloto = (piloto) => {
  router.push({ path: '/PerfilPiloto', query: { id: piloto.id } })
}

const confirmarDeletar = (piloto) => {
  pilotoSelecionado.value = piloto
  dialogDeletar.value = true
}

// Exclusão de dados
const executarExclusao = async () => {
  if (!pilotoSelecionado.value?.id) return
  carregandoAcao.value = true

  try {
    await api.delete(`/pilotos/${pilotoSelecionado.value.id}`)
    registrarAtividade('PILOTO', `Piloto removido do sistema: ${pilotoSelecionado.value.nome}`)
    dialogDeletar.value = false
    pilotoSelecionado.value = null
    await carregarPilotos()
  } catch (err) {
    console.error('Erro ao excluir piloto:', err)
  } finally {
    carregandoAcao.value = false
  }
}

// Busca a lista real do banco de dados
const carregarPilotos = async () => {
  try {
    const response = await api.get('/pilotos')
    if (response.data) {
      pilotos.value = response.data
      totalPilotos.value = response.data.length
    }
  } catch (err) {
    console.error('Erro ao buscar pilotos na API:', err)
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

/* Barra Unificada de Busca e Botão */
.f1-btn-card {
  background: rgba(240, 240, 245, 0.85) !important;
  border: 1.5px solid rgba(225, 6, 0, 0.5) !important;
  backdrop-filter: blur(10px);
}

:deep(.f1-search-input input) {
  font-weight: 800;
  font-size: 0.85rem;
  color: #111 !important;
  letter-spacing: 0.05em;
}

:deep(.f1-search-input input::placeholder) {
  color: #555 !important;
  font-weight: 700;
}

/* Visibilidade nítida do ícone da Lupa no Vuetify */
:deep(.f1-search-input .v-field__prepend-inner .v-icon) {
  color: #111111 !important;
  opacity: 1 !important;
  font-size: 1.25rem !important;
}

/* Visibilidade nítida do ícone de limpar */
:deep(.f1-search-input .v-field__clearable .v-icon) {
  color: #111111 !important;
  opacity: 0.8 !important;
}

.btn-f1 {
  letter-spacing: 0.08em;
  font-size: 0.85rem;
}

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
.cursor-pointer { cursor: pointer; }
.gap-1 { gap: 4px; }
.gap-3 { gap: 12px; }
.gap-4 { gap: 16px; }
</style>