YTBeloolaClient 			= function(divId, params) {
	this.divId			= divId;
	this.params			= params;
	this.iframe 			= document.createElement('iframe');
	this.iframe.frameBorder		= 0;
	this.iframe.width		= params.width || "100%";
	this.iframe.height		= params.height || "100%";
	this.iframe.id 			= "ytbeloola_"+divId;
	this.iframe.setAttribute("src", params.serverUrl);
	document.getElementById(divId).appendChild(this.iframe);
}

YTBeloolaClient.prototype.play 		= function() {
	this.iframe.contentWindow.postMessage({ YTBeloola: 'playVideo()' }, this.params.clientUrl);
}

YTBeloolaClient.prototype.pause		= function() {
	this.iframe.contentWindow.postMessage({ YTBeloola: 'pauseVideo()' }, this.params.clientUrl);
}

YTBeloolaClient.prototype.mute		= function() {
	this.iframe.contentWindow.postMessage({ YTBeloola: 'mute()' }, this.params.clientUrl);
}

YTBeloolaClient.prototype.unMute	= function() {
	this.iframe.contentWindow.postMessage({ YTBeloola: 'unMute()' }, this.params.clientUrl);
}