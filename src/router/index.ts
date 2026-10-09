/**
 * router/index.ts
 *
 * Manual routes for ./src/pages/*.vue
 */

// Composables

// Criado (08/10/2026); // Atualização (09/10/2026)
import { createRouter, createWebHistory } from 'vue-router'
import Index from '@/pages/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Index,
    },
    {
      path: '/registrar',
      component: () => import('@/pages/registrar.vue'),
    },
    {
      path: '/escuderias',
      component: () => import('@/pages/escuderias.vue'),
    },
    {
      path: '/carros',
      component: () => import('@/pages/carros.vue'),
    },
    {
      path: '/pilotos',
      component: () => import('@/pages/pilotos.vue'),
    },
    {
      path: '/dashboard',
      component: () => import('@/pages/dashboard.vue'),
    },
  ],
})

export default router