import { createRouter, createWebHistory } from 'vue-router'
import Enseignant from '../views/Enseignant.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'enseignants',
      component: Enseignant,
    },
    
  ],
})

export default router
