$(function() {
	window.apiKey    = "44618172";
	window.sessionId = "1_MX40NDYxODE3Mn5-U2F0IEphbiAxOCAwMDowMjoxNCBQU1QgMjAxNH4wLjU2MTYxNjg0fg";
	window.token     = "T1==cGFydG5lcl9pZD00NDYxODE3MiZzZGtfdmVyc2lvbj10YnJ1YnktdGJyYi12MC45MS4yMDExLTAyLTE3JnNpZz01MmM0ZjJlZTY2NmZjYjg5NTNjMTgwZWJkNzMzOWFjOGY5YTZjZDVlOnJvbGU9cHVibGlzaGVyJnNlc3Npb25faWQ9MV9NWDQwTkRZeE9ERTNNbjUtVTJGMElFcGhiaUF4T0NBd01Eb3dNam94TkNCUVUxUWdNakF4Tkg0d0xqVTJNVFl4TmpnMGZnJmNyZWF0ZV90aW1lPTEzOTAwMzIxODEmbm9uY2U9MC4wMTgwMjM1MDEwOTE0NTQ0NTImZXhwaXJlX3RpbWU9MTM5MDYzNjk4MSZjb25uZWN0aW9uX2RhdGE9";
									
	window.session = TB.initSession(sessionId);

	session.addEventListener("sessionConnected", sessionConnectedHandler);
	session.addEventListener("streamCreated", streamCreatedHandler);

	function sessionConnectedHandler(event) {
		session.publish(publisher);
		subscribeToStreams(event.streams);
	}

	function subscribeToStreams(streams) {
		for(var i = 0; i < streams.length; i++) {
			var stream = streams[i];
			if(stream.connection.connectionId != session.connection.connectionId) {
				var videoBoxId = "placeholder"+window.highestStream;
				var $videoBox = $("<div id='" + videoBoxId + "'></div>");
				window.highestStream++;
				$("#tokbox").append($videoBox);
				session.subscribe(stream, videoBoxId);
			}
		}
	}

	function streamCreatedHandler(event) {
		subscribeToStreams(event.streams);
	}

	var publisher = TB.initPublisher(apiKey, "placeholder");
	var session = TB.initSession(sessionId);


	session.connect(apiKey, token);
	session.addEventListener("sessionConnected", sessionConnectedHandler);
	session.addEventListener("streamCreated", streamCreatedHandler);
	resizePublisher();

	function resizePublisher() {
		var pubElement = document.getElementById(publisher.id);
		//pubElement.width = ($("#tokbox").width())-20;
		//pubElement.height = $("#tokbox").height()/3-20;
	}

	// remove duplicate opentok instances

	for(var i = 0; i < window.highestStream;i++) {
		if($("#placeholder"+i).find("video").attr('src') == $("#placeholder"+i-1).find("video").attr('src')) {
			$("#placeholder"+i).hide();
		}
	}
});
