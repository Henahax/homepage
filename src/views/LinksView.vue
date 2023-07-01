<template>
    <main class="item pageLinks">
        <h2 class="headline primary-color">Links</h2>
        <h2>@henahax</h2>
        <p>Software-Entwicklung | Heimserver</p>
        <ul>
            <li>
                <a class="linkButton email" href="mailto:mail@henahax.de"><font-awesome-icon :icon="['fas', 'envelope']" /> E-Mail</a>
            </li>
            <li>
                <a class="linkButton twitter" href="https://twitter.henahax.de"><font-awesome-icon :icon="['fab', 'twitter']" /> Twitter</a>
            </li>
            <li>
                <a class="linkButton instagram" href="https://instagram.henahax.de"><font-awesome-icon :icon="['fab', 'instagram']" /> Instagram</a>
            </li>
            <li>
                <a class="linkButton steam" href="https://steam.henahax.de"><font-awesome-icon :icon="['fab', 'steam']" /> Steam</a>
            </li>
            <li>
                <a class="linkButton discord" href="https://discordapp.com/users/128418924084723712"><font-awesome-icon :icon="['fab', 'discord']" /> Discord</a>
            </li>
            <li>
                <a class="linkButton github" href="https://github.henahax.de"><font-awesome-icon :icon="['fab', 'github']" /> GitHub</a>
            </li>
            <li>
                <a class="linkButton onlyfans" href="https://onlyfans.henahax.de"><font-awesome-icon :icon="['fas', 'lock']" /> OnlyFans</a>
            </li>
        </ul>

    </main>
</template>
  
<style>
main {
    text-align: center;
}

main p {
    margin: 1rem;
}

.pageLinks {
    list-style: none;
}

.pageLinks ul {
    max-width: 16rem;
    margin: auto;
}

.pageLinks li:not(:last-child) {
    margin-bottom: 1rem;
}

.linkButton {
    display: block;
    width: 100%;
    border: none !important;
    padding: .5rem;
    border-radius: .35rem;
    font-size: 1rem;

}

.linkButton:hover {
    filter: brightness(.85);
}

.website {
    background-color: #696969;
    color: #fff;
}

.email {
    background-color: #0078d4;
    color: #fff;
}

.twitter {
    background-color: #1da1f2;
    color: #fff;
}

.instagram {
    background-image: linear-gradient(-135deg, #1400c8, #b900b4, #f50000);
    color: #fff;
}

.steam {
    background-color: #171a21;
    color: #fff;

}

.discord {
    background-color: #5865f2;
    color: #fff;
}

.github {
    background-color: #000;
    color: #fff;
}

.onlyfans {
    color: #00aff0;
    background-color: #fff;
}</style>
  