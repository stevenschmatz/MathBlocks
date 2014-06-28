$(function() {
	$("#calc").keypress(function(e) {
		if(e.keyCode == 13) {
			e.preventDefault();
			if($(this).val() != '') {
				var exp = $(this).val();
				$(this).val('');
				$("#result").text('');
				$("#error").text('');
				$.post('/calc', {'exp': exp}, function(data) {
					var parsed = JSON.parse(data);
					if(parsed['status'] == 'ok') {
						$("#result").text(parsed['exp'] + '=' + parsed['result']);
						socket.emit('valueCalculated', {'sendingUser': window.name, 'value': parsed['result'], 'exp': parsed['exp']});
					}
					else {
						$("#error").text(parsed['error'])
					}
				});
			}
		}
	});
});
