$(function() {
	$("#saveLatex").click(function(e) {
		e.preventDefault();
		socket.emit('latexSaved', {'rawText': $("#latexInput").val(), 'sendingUser': window.name});
	});
});
