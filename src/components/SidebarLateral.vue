<!-- Criado (09/10/2026) /Atualizado (15/10/2026); (20/10/2026) -->
<template>
  <v-navigation-drawer
    app
    permanent
    color="#15151e"
    width="220"
    class="border-e border-grey-darken-3 d-flex flex-column justify-space-between"
  >
    <div>
      <!-- Logo F1 Manager -->
      <div 
        class="pa-6 font-weight-black text-white text-h6 tracking-wider border-b border-grey-darken-3 cursor-pointer"
        @click="router.push('/dashboard')"
      >
        F1 MANAGER
      </div>

      <!-- Modo Contextual (Cadastro ou Perfil) -->
      <v-list v-if="modo === 'cadastro' || modo === 'perfil'" nav class="pa-4">
      
        <v-list-item
          class="mb-2 font-weight-black text-grey-lighten-1 cursor-pointer"
          @click="voltarParaListagem"
        >
          <v-list-item-title class="font-weight-black text-subtitle-2">
            {{ modulo }}
          </v-list-item-title>
        </v-list-item>

        <!-- Subitem Ativo em Vermelho (CADASTRO ou PERFIL) -->
        <v-list-item class="font-weight-black text-red-accent-4 bg-transparent pa-0">
          <v-list-item-title class="font-weight-black text-subtitle-2 px-2">
            {{ modo === 'cadastro' ? 'CADASTRO' : 'PERFIL' }}
          </v-list-item-title>
        </v-list-item>
      </v-list>

      <!-- Modo Padrão (Navegação Principal) -->
      <v-list v-else nav class="pa-4">
        <v-list-item
          to="/dashboard"
          active-class="text-red-accent-4 font-weight-black"
          class="mb-2 text-grey-lighten-1"
        >
          <v-list-item-title class="font-weight-black text-subtitle-2">DASHBOARD</v-list-item-title>
        </v-list-item>

        <v-list-item
          to="/pilotos"
          active-class="text-red-accent-4 font-weight-black"
          class="mb-2 text-grey-lighten-1"
        >
          <v-list-item-title class="font-weight-black text-subtitle-2">PILOTOS</v-list-item-title>
        </v-list-item>

        <v-list-item
          to="/escuderias"
          active-class="text-red-accent-4 font-weight-black"
          class="mb-2 text-grey-lighten-1"
        >
          <v-list-item-title class="font-weight-black text-subtitle-2">ESCUDERIAS</v-list-item-title>
        </v-list-item>

        <v-list-item
          to="/carros"
          active-class="text-red-accent-4 font-weight-black"
          class="mb-2 text-grey-lighten-1"
        >
          <v-list-item-title class="font-weight-black text-subtitle-2">CARROS</v-list-item-title>
        </v-list-item>
      </v-list>
    </div>

    <!-- Botão SAIR Fixado na Parte Inferior da Sidebar -->
    <template #append>
      <div class="pa-4 border-t border-grey-darken-3">
        <v-list-item
          class="font-weight-black text-grey-lighten-1 cursor-pointer hover-logout rounded-lg"
          @click="fazerLogout"
        >
          <template #prepend>
            <v-icon color="red-accent-4" size="small" class="mr-2">mdi-logout</v-icon>
          </template>
          <v-list-item-title class="font-weight-black text-subtitle-2 text-red-accent-4">
            SAIR
          </v-list-item-title>
        </v-list-item>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  modo: {
    type: String,
    default: 'padrao' // 'padrao', 'cadastro' ou 'perfil'
  },
  modulo: {
    type: String,
    default: 'PILOTOS' // 'PILOTOS', 'ESCUDERIAS' ou 'CARROS'
  }
})

const router = useRouter()

const voltarParaListagem = () => {
  if (props.modulo === 'PILOTOS') router.push('/pilotos')
  else if (props.modulo === 'ESCUDERIAS') router.push('/escuderias')
  else if (props.modulo === 'CARROS') router.push('/carros')
}
const fazerLogout = () => {
  // Limpa os dados de autenticação armazenados
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  sessionStorage.clear()

  // Redireciona para a tela de login
  router.push('/')
}
</script>

<style scoped>
.tracking-wider { letter-spacing: 0.08em !important; }
.cursor-pointer { cursor: pointer; }

.hover-logout:hover {
  background-color: rgba(225, 6, 0, 0.15) !important;
  transition: background-color 0.2s ease-in-out;
}
</style>