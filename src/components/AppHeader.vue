<!-- Criado (22/10/2026) -->
<template>
  <v-app-bar flat color="#15151e" height="72" class="border-b px-4">
    <!-- Título / Logo Esquerdo -->
    <v-spacer></v-spacer>

    <!-- Título da Página Atual -->
    <div class="text-h6 font-weight-black text-red-accent-4 tracking-widest uppercase">
      {{ titulo }}
    </div>

    <v-spacer></v-spacer>

    <!-- Bloco Direito: Usuário Logado + Cronômetro de Sessão -->
    <div class="d-flex align-center gap-3">
      <!-- Nome do Usuário Logado -->
      <div class="d-flex align-center bg-grey-darken-4 px-3 py-1 rounded-pill border-subtle">
        <v-icon icon="mdi-account-circle" color="red-accent-4" class="mr-2" size="small"></v-icon>
        <span class="text-caption font-weight-black text-grey-lighten-2 tracking-wide uppercase">
          {{ nomeUsuario }}
        </span>
      </div>

      <!-- Cronômetro da Sessão -->
      <div class="d-flex align-center bg-grey-darken-4 px-3 py-1 rounded-pill border-subtle">
        <v-icon icon="mdi-clock-outline" color="red-accent-4" class="mr-2" size="small"></v-icon>
        <span class="text-caption font-weight-black text-grey-lighten-2 tracking-wide">
          Sessão: {{ tempoFormatado }}
        </span>
      </div>
    </div>
  </v-app-bar>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

// Prop para receber o título da página (ex: "DASHBOARD", "PILOTOS", etc.)
defineProps<{
  titulo?: string
}>()

const nomeUsuario = ref('USUÁRIO')
const segundosSessao = ref(0)
let timerInterval: any = null

// Formata os segundos em MM:SS
const tempoFormatado = computed(() => {
  const min = Math.floor(segundosSessao.value / 60).toString().padStart(2, '0')
  const sec = (segundosSessao.value % 60).toString().padStart(2, '0')
  return `${min}:${sec}`
})

onMounted(() => {
  // Resgata o usuário salvo no localStorage
  const usuarioSalvo = localStorage.getItem('usuario')
  if (usuarioSalvo) {
    nomeUsuario.value = usuarioSalvo
  }

  // Inicia o cronômetro da sessão
  timerInterval = setInterval(() => {
    segundosSessao.value++
  }, 1000)
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})
</script>

<style scoped>
.gap-3 {
  gap: 12px;
}

.border-subtle {
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.uppercase {
  text-transform: uppercase;
}

.tracking-widest {
  letter-spacing: 0.15em !important;
}

.cursor-pointer {
  cursor: pointer;
}
</style>