/* 
 * YTBeloolaServer : YouTube Beloola Server
 * Receive command from TBeloolaClient and send it to player
 * If needed server can send player information( video duration, video current time ) to client
 */

/*
 * Constructor
 * Object player : YouTube player instance
 */
YTBeloolaServer = function(player) {
	this.player 		= player;
	var self		= this;
	// listen to YTBeloolaClient command and send it to player
	window.addEventListener("message", function(event) {
		// get message
		var message	= event.data;
		// only manage YTBeloola message signature
		if(typeof message === "object" && Object.keys(message)[0] === 'YTBeloola') {
			// build player commmand
			var command = "player."+message.YTBeloola;
			// send command
			if(self.player)		eval(command);
			// save event source (message)
			if(!self.messageSource) {
				self.messageSource = event.source;
			}
		}
	}, false);
}

/*
 * Refresh player information evry X millisecond
 * Number ms : Number of millisecond (default 250)
 */ 
YTBeloolaServer.prototype.refreshPlayerInfo = function(ms) {
	var ms = ms || 250;
	var self = this;
	setInterval(function() {
		self._sendPlayerInfo()
	}, ms);
}
/*
 * Send player information to YTBeloolaClient
 */
YTBeloolaServer.prototype._sendPlayerInfo = function() {
	if(!this.player)		return;
	if(!this.messageSource)		return;
	// get player information
	var info = {
		duration: this.player.getDuration(),
		currentTime: this.player.getCurrentTime()
	}
	// send player information to client with YTBeloola signature
	this.messageSource.postMessage({ YTBeloola: info }, document.URL);
} 