import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faHouse, faServer, faLink, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons'
import { faDiscord, faTeamspeak, faTwitter, faInstagram, faSteam, faGithub } from '@fortawesome/free-brands-svg-icons'


/* add icons to the library */
library.add(faHouse, faDiscord, faTeamspeak, faServer, faLink, faEnvelope, faTwitter, faInstagram, faSteam, faGithub, faLock)

const app = createApp(App)

app.use(createPinia())
app.use(router)

.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')
