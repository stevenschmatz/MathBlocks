$(function(){
	socket.on('valueCalculated', function(data) {
		var logEl = $("<ul class='messageText'>"+"<b>"+data['sendingUser']+"</b>: "+data['exp']+"="+data['value']+"</ul>");
		if($("#calc-log").html().indexOf(logEl.html()) == -1) {
			$("#calc-log").prepend(logEl);
		}
	});
	
	socket.on('chatMessage', function(data) {
		var msgEl = $("<ul class='messageText'>"+"<b>"+data['sendingUser']+"</b>: "+data['messageText']+"</ul>");
		if($("#chat-msgs").html().indexOf(msgEl.html()) == -1) {
			$("#chat-msgs").append(msgEl);
		}
	});
	
	socket.on('latexChanged', function(data) {
		if(window.context == 'latex') {
			$("#latexRender").text(data['rawText']);
			$("#latexInput").val(data['rawText']);
			MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
		}
		else {
			window.latexContent = data['rawText'];
		}
	});
	
	socket.on('graphChanged', function(data) {
		if(window.context == 'graph') {
			$("#graph").html('<img src="' + data['graphSource'] + '"></img>');
		}
		else {
			window.graphSource = data['graphSource'];
			window.funct = data['funct'];
		}
	});
							
	socket.on('graphHistoryChanged', function(data) {
		var history = data['graphHistory'];
		var mostRecentHistory = history[history.length-1];
		var $item = $("<li id='history'><b>"+mostRecentHistory['sendingUser']+"</b>: "+mostRecentHistory['funct']+"</li>");
		$("#graphHistory").append($item);
	});
						
	socket.on('latexHistoryChanged', function(data) {
		var history = data['latexHistory'];
		var mostRecentHistory = history[history.length-1];
		var $item = $("<li id='history'><b>"+mostRecentHistory['sendingUser']+"</b>: "+mostRecentHistory['funct']+"</li>");
		$("#graphHistory").append(item);
	});
						
	socket.on('solutionChanged', function(data) {
		$("#solution").val(data['solutionText']);
	});
});
