import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/discord',
      name: 'discord',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/DiscordView.vue'),
      meta: { transition: 'slide-left' }
    },
    {
      path: '/teamspeak',
      name: 'teamspeak',
      component: () => import('../views/TeamSpeakView.vue'),
      meta: { transition: 'slide-left' }
    },
    {
      path: '/server',
      name: 'server',
      component: () => import('../views/ServerView.vue'),
      meta: { transition: 'slide-left' }
    },
    {
      path: '/links',
      name: 'links',
      component: () => import('../views/LinksView.vue'),
      meta: { transition: 'slide-left' }
    }
  ]
})

export default router
