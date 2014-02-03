#Beloola Youtube API

Ce module à pour but de piloter le player Youtube (version HTML5) au travers d'une Iframe.
Deux classes sont misent à disposition pour echanger les commandes du player via postMessage :
   - YTBeloolaClient.js
   - YTBeloolaServer.js

Deux fichiers d'exemples sont également inclus pour tester ces deux fichiers :
   - client.html
   - server.html



## Coté client

1 - Inclure la librairie lib/YTBeloolaClient.js

```html
<script src="lib/YTBeloolaClient.js"></script>
```

2 - Instancier la classe

```js
var serverUrl		= "http://127.0.0.1:8000/server.html";
var YTBeloolaClient 	= new YTBeloolaClient('player', serverUrl, {
	height: "280px",
	listenPlayerInfo: true,
	video: "M7lc1UVf-VE"
});
```

ou 

```js
var serverUrl		= "http://127.0.0.1:8000/server.html";
var YTBeloolaClient 	= new YTBeloolaClient('player', serverUrl, {
	height: "280px",
	listenPlayerInfo: true,
	video: {
		id: "M7lc1UVf-VE",
		startSeconds: 10,
		suggestedQuality: "large"
	}
});
```

YTBeloolaClient vous permet d'envoyer les commandes de base au player `YouTube`
    - playVideo()
    - pauseVideo()
    - mute()
    - unMute()
    - seekTo(second)
    - setVolume(volume)
    - loadVideoById(videoId) 

En activant `listenPlayerInfo` dans le constructeur vous pourrez via la méthode `getPlayerInfo()` 
récupérer la durée de la vidéo demandée `duration` et la position actuelle de cette dernière `currentTime`


## Coté Server

1 - Inclure les librairies Youtube et lib/YTBeloolaServer.js

```html
	<script src="lib/YTBeloolaServer.js"></script>
	<script src="https://www.youtube.com/iframe_api"></script>
```

2 - Définir la fonction onYouTubeIframeAPIReady et y instancier la classe YTBeloolaServer

```js
	// declare youtube player
	var YTBeloolaServer;
	// When YT iframe_api is loaded onYouTubeIframeAPIReady event is fired
	function onYouTubeIframeAPIReady() {
		var player = new YT.Player('player', {
			playerVars: { 'autoplay': 0, 'controls': 0, 'html5': 1 },
		});
		YTBeloolaServer = new YTBeloolaServer(player);
		// envoi des infos au client YTBeloolaClient
		YTBeloolaServer.refreshPlayerInfo();
	}
```

