$(function() {
	$("#nameInput").keypress(function(e) {
		if(e.keyCode == 13) {
			e.preventDefault();
			window.name = $(this).val();
			var $dialog = $(this).parent();
			$(this).remove();
			$dialog.text("Name changed to " + name);
			socket.emit('newUser', {'name': name});
			setTimeout(function() {
				$dialog.fadeOut(500);
			}, 1000);
		}
	});
					
	socket.on('newUser', function(data) {
		if($("#newUserBar").length == 0) {
			var $newUserBar = $("<div class='callout panel' id='newUserBar'>"+data['name']+" has joined.</div>");
			$("body").prepend($newUserBar);
		}
		setTimeout(function() {
			$newUserBar.fadeOut(500);
		}, 1000);
	});
});
