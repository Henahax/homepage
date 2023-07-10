<template>
  <main>
    <h2 class="primary-color">TeamSpeak</h2>

    <div class="subPage">
        <div class="subPageContainer">
          <div id="ts3viewer_1124630" style=""> </div>
        </div>
        <div class="subPageContainer">
          <ul>
            <li>Privater TeamSpeak Server</li>
            <li>Musikbot</li>
            <li>Eigene Kanäle auf Anfrage</li>
          </ul>
          <a class="button btnteamspeak" href="ts3server://henahax.de?port=9987">
            <font-awesome-icon :icon="['fab', 'teamspeak']" /><span> Verbinden</span>
          </a>
        </div>
      </div>
  </main>
</template>

<script lang="ts" defer>
declare var ts3v_display:any;
export default {
  data: () => ({

  }),
  mounted() {
    var ts3v_url_1 = "https://www.tsviewer.com/ts3viewer.php?ID=1124630&text=757575&text_size=12&text_family=1&text_s_color=000000&text_s_weight=normal&text_s_style=normal&text_s_variant=normal&text_s_decoration=none&text_i_color=&text_i_weight=normal&text_i_style=normal&text_i_variant=normal&text_i_decoration=none&text_c_color=&text_c_weight=normal&text_c_style=normal&text_c_variant=normal&text_c_decoration=none&text_u_color=000000&text_u_weight=normal&text_u_style=normal&text_u_variant=normal&text_u_decoration=none&text_s_color_h=&text_s_weight_h=bold&text_s_style_h=normal&text_s_variant_h=normal&text_s_decoration_h=none&text_i_color_h=000000&text_i_weight_h=bold&text_i_style_h=normal&text_i_variant_h=normal&text_i_decoration_h=none&text_c_color_h=&text_c_weight_h=normal&text_c_style_h=normal&text_c_variant_h=normal&text_c_decoration_h=none&text_u_color_h=&text_u_weight_h=bold&text_u_style_h=normal&text_u_variant_h=normal&text_u_decoration_h=none&iconset=default_mono_2014";
    ts3v_display.init(ts3v_url_1, 1124630, 100);
  },
  methods: {
  }
}
</script>

<style>
#ts3viewer_1124630{
  margin: auto;
  background-color: white;
    padding: 1rem 1rem 0rem 1rem;
    border-radius: 0.5rem;
    max-width: 20rem;
}

.btnteamspeak{
  background-color: #2580c3;
}
</style>
