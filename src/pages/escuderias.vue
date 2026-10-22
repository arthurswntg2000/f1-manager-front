<!-- Criado (13/10/2026) / Atualizações (16/10/2026); (19/10/2026); (20/10/2026) -->
<template>
  <v-app>
    <SidebarLateral />
    <AppHeader titulo="ESCUDERIAS" />

    <v-main class="f1-bg">
      <div class="f1-overlay"></div>

      <v-container fluid class="pa-6 z-index-content max-width-container">
        <!-- Linha Superior: Barra Unificada de Busca e Nova Escuderia -->
        <v-row class="mb-4" justify="center">
          <v-col cols="12" sm="10">
            <v-card class="f1-btn-card pa-2 px-4 d-flex align-center gap-3" rounded="xl">
              <!-- Campo de Busca Integrado -->
              <v-text-field
                v-model="termoBusca"
                placeholder="BUSCAR ESCUDERIA (NOME, PAÍS DE ORIGEM...)"
                prepend-inner-icon="mdi-magnify"
                variant="plain"
                density="compact"
                hide-details
                clearable
                class="f1-search-input flex-grow-1"
              ></v-text-field>

              <v-divider vertical class="my-2 border-grey-darken-2"></v-divider>

              <!-- Botão + NOVO -->
              <v-btn
                color="#e10600"
                variant="flat"
                rounded="lg"
                class="font-weight-black text-white px-5 btn-f1"
                prepend-icon="mdi-plus"
                @click="$router.push('/CadastroEscuderia')"
              >
                NOVO
              </v-btn>
            </v-card>
          </v-col>
        </v-row>

        <!-- Tabela de Escuderias -->
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
                    <td class="font-weight-bold text-uppercase">{{ escuderia.paisOrigem }}</td>
                    <td>
                      <div class="d-flex justify-center gap-1">
                        <v-btn icon="mdi-pencil" size="x-small" variant="text" color="amber-darken-3" @click="editarEscuderia(escuderia.id)"></v-btn>
                        <v-btn icon="mdi-delete" size="x-small" variant="text" color="grey-darken-2" @click="confirmarDeletar(escuderia)"></v-btn>
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

              <!-- Paginação Estilizada -->
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
            Tem certeza que deseja excluir a escuderia <strong>{{ escuderiaSelecionada?.nome }}</strong>?
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

const escuderias = ref([])
const paginaAtual = ref(1)
const itensPorPagina = 6
const totalEscuderias = ref(0)

const dialogDeletar = ref(false)
const carregandoAcao = ref(false)

const termoBusca = ref('')
const escuderiaSelecionada = ref(null)

const totalEscuderiasExibicao = computed(() => escuderiasFiltradas.value.length)

const textoExibicao = computed(() => {
  if (totalEscuderiasExibicao.value === 0) {
    return 'NENHUMA ESCUDERIA ENCONTRADA'
  }

  const inicio = (paginaAtual.value - 1) * itensPorPagina + 1
  const fim = Math.min(paginaAtual.value * itensPorPagina, totalEscuderiasExibicao.value)

  return `EXIBINDO ${inicio}-${fim} DE ${totalEscuderiasExibicao.value} ESCUDERIAS`
})

const escuderiasFiltradas = computed(() => {
  if (!termoBusca.value) return escuderias.value
  const termo = termoBusca.value.toLowerCase()
  return escuderias.value.filter(e => 
    e.nome?.toLowerCase().includes(termo) || 
    e.paisOrigem?.toLowerCase().includes(termo) ||
    e.id?.toString().includes(termo)
  )
})

// Criado (19/10/2026)
async function reativarEscuderia(id) {
  try {
    const res = await api.put(`/escuderias/${id}/reativar`)
    const escuderia = res.data

    registrarAtividade('ESCUDERIA_REATIVADA', `Escuderia reativada no sistema: ${escuderia.nome}`)

    await carregarEscuderias()
  } catch (err) {
    console.error('Erro ao reativar escuderia:', err)
  }
}

const totalPaginas = computed(() => Math.ceil(escuderiasFiltradas.value.length / itensPorPagina) || 1)

const escuderiasPaginadas = computed(() => {
  const inicio = (paginaAtual.value - 1) * itensPorPagina
  return escuderiasFiltradas.value.slice(inicio, inicio + itensPorPagina)
})

const editarEscuderia = (id) => {
  router.push({ path: '/CadastroEscuderia', query: { id } })
}

const visualizarEscuderia = (escuderia) => {
  router.push({ path: '/PerfilEscuderia', query: { id: escuderia.id } })
}

const confirmarDeletar = (escuderia) => {
  escuderiaSelecionada.value = escuderia
  dialogDeletar.value = true
}


const executarExclusao = async () => {
  if (!escuderiaSelecionada.value?.id) return
  carregandoAcao.value = true

  try {
    await api.delete(`/escuderias/${escuderiaSelecionada.value.id}`)
    registrarAtividade('ESCUDERIA', `Escuderia removida do sistema: ${escuderiaSelecionada.value.nome}`)
    dialogDeletar.value = false
    escuderiaSelecionada.value = null
    await carregarEscuderias()
  } catch (err) {
    console.error('Erro ao excluir escuderia:', err)
  } finally {
    carregandoAcao.value = false
  }
}

const carregarEscuderias = async () => {
  try {
    const response = await api.get('/escuderias')
    if (response.data) {
      escuderias.value = response.data
      totalEscuderias.value = response.data.length
    }
  } catch (err) {
    console.error('Erro ao buscar escuderias na API:', err)
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
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(15, 15, 20, 0.35) !important;
  backdrop-filter: blur(2px) !important;
}

.z-index-content { position: relative; z-index: 2; }
.max-width-container { max-width: 1000px; }

/* Barra Unificada de Busca e Botão Novo */
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

/* Garante visibilidade da Lupa */
:deep(.f1-search-input .v-field__prepend-inner .v-icon) {
  color: #111111 !important;
  opacity: 1 !important;
  font-size: 1.25rem !important;
}

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