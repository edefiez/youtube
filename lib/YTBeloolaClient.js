/* YTBeloolaClient : YouTube Beloola Client
 * Manage YouTube Player API Reference for iframe Embeds
 * @see https://developers.google.com/youtube/iframe_api_reference
 */

/*
 * Constructor
 * String divId : id where create youtube iframe element
 * String serverUrl : iframe http src
 * Object Params : 
 *	String : iframe height
 *	Mix : video (video Object (id, startSeconds, suggestedQuality) or String (videoId)) [optional]
 * Number seekTo : start video to second
 * Boolean listenPlayerInfo : add listerner to retrieve player informations (duration, currentTime)
 */
YTBeloolaClient = function(divId, serverUrl, params) {
	// save client parameters
	this.divId	= divId;
	this.serverUrl	= serverUrl;
	this.params	= params;
	this.playerInfo = false;

	// init parameter and create iframe element
	this._createPlayerIframe();

	// manage parameters
	if(params.video)		this.loadVideoById(params.video);
	if(params.seekTo)		this.seekTo(params.seekTo);

	// register server domaine to check postMessage auth
	if(params.listenPlayerInfo)	this._addPostMessageListener()

}

/*
 * Create iframe element to display youture player
 */
YTBeloolaClient.prototype._createPlayerIframe = function() {
	var width	= this.params.width || "100%";
	var height	= this.params.height || "100%";

	this.iframe	= document.createElement('iframe');
	this.iframe.setAttribute("id", "ytbeloola_"+this.divId);
	this.iframe.setAttribute("frameBorder", 0);
	this.iframe.setAttribute("width", width);
	this.iframe.setAttribute("height", height);
	this.iframe.setAttribute("src", this.serverUrl);
	if(this.params.allowFullScreen) {
		this.iframe.setAttribute("allowfullscreen", true);
	}
	document.getElementById(this.divId).appendChild(this.iframe);
}

/*
 * add Post message listener to get player informations
 */
YTBeloolaClient.prototype._addPostMessageListener = function() {
	var self = this;
	window.addEventListener("message", function(event) {
		var message	= event.data;
		// only manage YTBeloola message signature
		if(typeof message === "object" && Object.keys(message)[0] === 'YTBeloola') {
			self.playerInfo = message.YTBeloola;
		}
	}, false);
}

/*
 * load video 
 * Object video (id, [startSeconds, suggestedQuality]) or String videoId, [Number startSeconds, String suggestedQuality]
 * @see https://developers.google.com/youtube/iframe_api_reference#loadVideoById
 */
YTBeloolaClient.prototype.loadVideoById	= function(video, startSeconds, suggestedQuality) {
	var videoId, seconds, quality;

	if(typeof video == "string") {
		videoId		= video;
		seconds		= startSeconds 			|| 0;
		quality		= suggestedQuality 		|| "default";
	} else {
		videoId		= video.id;
		seconds		= video.startSeconds		|| 0;
		quality		= video.suggestedQuality	|| "default";
	}

	var command = 'loadVideoById("'+ videoId +'", '+seconds+', "'+quality+'")'; 
	self = this;
	// wait YT player is ready in server side
	setTimeout(function() {
		self.iframe.contentWindow.postMessage({ YTBeloola: command }, document.URL);
		self.playVideo();
	}, 1000)
}

/*
* return Object player informations (duration, currentTime)
*/
YTBeloolaClient.prototype.getPlayerInfo = function() {
	return this.playerInfo;
}

/* 
 * send playVideo command to iframe
 * @see https://developers.google.com/youtube/iframe_api_reference#playVideo
 */
YTBeloolaClient.prototype.playVideo	= function() {
	this._sendCommand('playVideo()');
}

/* 
 * send pauseVideo command to iframe
 * @see https://developers.google.com/youtube/iframe_api_reference#pauseVideo
 */
YTBeloolaClient.prototype.pauseVideo	= function() {
	this._sendCommand('pauseVideo()');
}

/* 
 * send mute command to iframe
 * @see https://developers.google.com/youtube/iframe_api_reference#mute
 */
YTBeloolaClient.prototype.mute		= function() {
	this._sendCommand('mute()');
}

/* 
 * send unMute command to iframe
 * @see https://developers.google.com/youtube/iframe_api_reference#unMute
 */
YTBeloolaClient.prototype.unMute	= function() {
	this._sendCommand('unMute()');
}

/* 
 * send setVolume(volume) command to iframe (volume 0-100)
 * @see https://developers.google.com/youtube/iframe_api_reference#setVolume
 */
YTBeloolaClient.prototype.setVolume	= function(volume) {
	this._sendCommand('setVolume('+volume+')');
}

/* 
 * send seekTo(seconds) command to iframe 
 * @see https://developers.google.com/youtube/iframe_api_reference#seekTo
 */
YTBeloolaClient.prototype.seekTo	= function(seconds) {
	this._sendCommand('seekTo('+seconds+')');
}

/* 
 * send postMessage (command player) to iframe
 */
YTBeloolaClient.prototype._sendCommand = function(command) {
	this.iframe.contentWindow.postMessage({ YTBeloola: command }, document.URL);
}
