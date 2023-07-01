<template>
  <main>
    <div class="item pageDiscord">
      <h2 class="headline primary-color">Discord</h2>

      <div class="subPage">
        <div class="subPageContainer">
          <iframe id="discordviewer" src="https://discord.com/widget?id=185552226998157313&theme=dark"
            allowtransparency="true" frameborder="0"
            sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts">
          </iframe>

        </div>
        <div class="subPageContainer">
          <ul>
            <li>Privater Discord Server</li>
            <li>Eigene Kanäle auf Anfrage</li>
          </ul>
          <a class="button btndiscord" href="https://discord.henahax.de/">
            <font-awesome-icon :icon="['fab', 'discord']" /><span> Beitreten</span>
          </a>
        </div>


      </div>

    </div>
  </main>
</template>

<style>
.btndiscord{
  background-color: #5865f2;
}

#discordviewer {
  margin: auto;
  height: 100%;
  max-width: 100%;
  min-height: 26rem;
  width: auto;
}
</style>