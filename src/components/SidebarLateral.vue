<!-- Criado (09/10/2026) / Atualizado (14/10/2026) -->
<template>
  <v-navigation-drawer
    permanent
    color="#18181f"
    width="240"
    class="border-r border-grey-darken-3"
  >
    <!-- Logo / Nome da Aplicação -->
    <div class="pa-5 text-h6 font-weight-black text-white tracking-widest">
      F1 MANAGER
    </div>

    <v-divider class="border-opacity-25 mb-4"></v-divider>

    <!-- Lista de Navegação -->
    <v-list v-if="modo === 'padrao'" density="compact" nav class="pa-2">
      <!-- Item: DASHBOARD -->
      <v-list-item
        to="/dashboard"
        active-class="active-menu-item"
        rounded="lg"
        class="mb-2 py-3"
      >
        <v-list-item-title class="font-weight-black text-body-2 tracking-wider">
          DASHBOARD
        </v-list-item-title>
      </v-list-item>

      <!-- Item: PILOTOS -->
      <v-list-item
        to="/pilotos"
        active-class="active-menu-item"
        rounded="lg"
        class="mb-2 py-3"
      >
        <v-list-item-title class="font-weight-black text-body-2 tracking-wider">
          PILOTOS
        </v-list-item-title>
      </v-list-item>

      <!-- Item: ESCUDERIAS -->
      <v-list-item
        to="/escuderias"
        active-class="active-menu-item"
        rounded="lg"
        class="mb-2 py-3"
      >
        <v-list-item-title class="font-weight-black text-body-2 tracking-wider">
          ESCUDERIAS
        </v-list-item-title>
      </v-list-item>

      <!-- Item: CARROS -->
      <v-list-item
        to="/carros"
        active-class="active-menu-item"
        rounded="lg"
        class="mb-2 py-3"
      >
        <v-list-item-title class="font-weight-black text-body-2 tracking-wider">
          CARROS
        </v-list-item-title>
      </v-list-item>
    </v-list>

    <!-- Lista de Navegação para Telas de Cadastro -->
    <v-list v-else-if="modo === 'cadastro'" density="compact" nav class="pa-2">
      <!-- Item: PILOTOS (Navega de volta para a lista) -->
      <v-list-item
        :to="origem"
        active-class="active-menu-item"
        rounded="lg"
        class="mb-2 py-3"
      >
        <v-list-item-title class="font-weight-black text-body-2 tracking-wider">
          {{ labelOrigem }}
        </v-list-item-title>
      </v-list-item>

      <!-- Item: CADASTRO -->
      <v-list-item
        active-class="active-menu-item"
        rounded="lg"
        class="mb-2 py-3 active-menu-item"
      >
        <v-list-item-title class="font-weight-black text-body-2 tracking-wider">
          CADASTRO
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modo: {
    type: String,
    default: 'padrao' 
  },
  tipo: {
    type: String,
    default: 'piloto' 
  }
})

const origem = computed(() => {
  if (props.tipo === 'escuderia') return '/escuderias'
  if (props.tipo === 'carro') return '/carros'
  return '/pilotos'
})

const labelOrigem = computed(() => {
  if (props.tipo === 'escuderia') return 'ESCUDERIAS'
  if (props.tipo === 'carro') return 'CARROS'
  return 'PILOTOS'
})
</script>

<style scoped>
/* Estilo para itens normais do menu */
:deep(.v-list-item) {
  color: #9ca3af !important;
}

:deep(.v-list-item:hover) {
  color: #ffffff !important;
  background-color: rgba(255, 255, 255, 0.05) !important;
}

/* Item Ativo */
:deep(.active-menu-item) {
  color: #d50000 !important;
  background-color: transparent !important;
}

.tracking-widest {
  letter-spacing: 0.15em !important;
}

.tracking-wider {
  letter-spacing: 0.08em !important;
}
</style>