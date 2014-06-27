$(function() {
	$("#msg").keypress(function(e) {
		if(e.keyCode == 13) {
			e.preventDefault();
			if($(this).val() != '') {
				var messageText = $(this).val();
				$(this).val('');
				socket.emit('chatMessage', {"messageText": messageText, "sendingUser": window.name});
			}
		}
	});
});
