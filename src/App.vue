// Criado (08/10/2026); Atualizações (21/10/2026)
<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const segundos = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

// Lista de rotas onde o relógio NÃO deve aparecer
const publicRoutes = ['/', '/login', '/registrar', '/redefinir-senha', '/cadastrar']

// Verifica se a rota atual é pública
const isPublicPage = computed(() => {
  return publicRoutes.includes(route.path.toLowerCase())
})

// Formata a contagem em MM:SS ou HH:MM:SS
const tempoFormatado = computed(() => {
  const hrs = Math.floor(segundos.value / 3600)
  const mins = Math.floor((segundos.value % 3600) / 60)
  const secs = segundos.value % 60

  const pad = (num: number) => String(num).padStart(2, '0')

  if (hrs > 0) {
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`
  }
  return `${pad(mins)}:${pad(secs)}`
})

// Observa a navegação: se o usuário for para o login/raiz, ZERA o timer imediatamente
watch(
  () => route.path,
  (newPath) => {
    if (publicRoutes.includes(newPath.toLowerCase())) {
      segundos.value = 0
    }
  },
  { immediate: true }
)

onMounted(() => {
  timer = setInterval(() => {
    // Aqui só incrementa o relógio se estiver dentro de páginas privadas (Dashboard, Pilotos, etc.)
    if (!isPublicPage.value) {
      segundos.value++
    }
  }, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <v-app>
    <!-- Exibe o relógio APENAS se o usuário estiver autenticado / fora do login -->
    <div v-if="!isPublicPage" class="session-timer-floating d-flex align-center">
      <v-icon size="large" class="mr-1 text-red-accent-2">mdi-clock-outline</v-icon>
      <span class="text-caption font-weight-bold text-white">Sessão: {{ tempoFormatado }}</span>
    </div>

    <v-main class="pa-0 ma-0">
      <router-view />
    </v-main>
  </v-app>
</template>

<style>
/* Remove margens e garante que a aplicação ocupe exatamente a altura total do navegador */
html, body, #app {
  margin: 0;
  padding: 0;
  height: 100vh;
  overflow: hidden;
}

/* Pílula do relógio fixa no canto superior direito */
.session-timer-floating {
  position: absolute;
  top: 16px;
  right: 24px;
  z-index: 9999;
  background-color: rgba(18, 21, 30, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  padding: 6px 16px;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  user-select: none;
}
</style>