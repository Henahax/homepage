<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import IconDrumstick from './components/icons/IconDrumstick.vue'
</script>

<template>
  <header>

    <IconDrumstick class="logo" viewBox="0 0 512 512"/>

    <div class="wrapper">
      <h1 class="primary-color">henahax.de</h1>
      <h2>persönliche Webseite</h2>
      <nav>
        <ul>
          <li>
            <RouterLink to="/"><font-awesome-icon :icon="['fas', 'house']" /><span>Home</span></RouterLink>
          </li>
          <li>
            <RouterLink to="/discord"><font-awesome-icon :icon="['fab', 'discord']" /><span>Discord</span></RouterLink>
          </li>
          <li>
            <RouterLink to="/teamspeak"><font-awesome-icon :icon="['fab', 'teamspeak']" /><span>TeamSpeak</span>
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/server"><font-awesome-icon :icon="['fas', 'server']" /><span>Server</span></RouterLink>
          </li>
          <li>
            <RouterLink to="/links"><font-awesome-icon :icon="['fas', 'link']" /><span>Links & Kontakt</span></RouterLink>
          </li>
        </ul>
      </nav>
    </div>

  </header>
    <RouterView v-slot="{Component}">
      <Transition name="page-slide" mode="out-in">
        <component :is="Component"/>
      </Transition>
    </RouterView>
</template>

<style scoped>
.page-slide-enter-active,
.page-slide-leave-active{
  transition: 400ms ease all;
}

.page-slide-enter-from,
.page-slide-leave-to{
  opacity: 0;
  transform: translateY(60px);
}


h1 {
  text-align: center;
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

.logo {
  margin: 0 auto 2rem;
  width: 8rem;
  height: 8rem;
  fill: white;
  -webkit-animation: sk-rotateplane 8s infinite ease-in-out;
  animation: sk-rotateplane 8s infinite ease-in-out;
}

@-webkit-keyframes sk-rotateplane {
  0% { -webkit-transform: perspective(36rem) }
  100% { -webkit-transform: perspective(36rem) rotateX(360deg) }
}

@keyframes sk-rotateplane {
  0% { 
    transform: perspective(36rem) rotateX(0deg) rotateY(0deg);
    -webkit-transform: perspective(36rem) rotateX(0deg) rotateY(0deg) 
  } 100% { 
    transform: perspective(36rem) rotateY(-360.1deg) rotateX(0deg);
    -webkit-transform: perspective(36rem) rotateY(-360.1deg) rotateY(0deg) 
  } 
}

@media (min-width: 1024px) {
  .logo {
    margin: 0 2rem 0 0;
  }
}
</style>
