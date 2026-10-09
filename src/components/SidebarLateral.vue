<!-- Criado (09/10/2026) -->
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
    <v-list density="compact" nav class="pa-2">
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
  </v-navigation-drawer>
</template>

<style scoped>
/* Estilo para itens normais do menu */
:deep(.v-list-item) {
  color: #9ca3af !important;
}

:deep(.v-list-item:hover) {
  color: #ffffff !important;
  background-color: rgba(255, 255, 255, 0.05) !important;
}

/* Item Ativo (Destaque Vermelho do Figma) */
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