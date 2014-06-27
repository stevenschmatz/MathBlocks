$(function() {
	$("#solution").keypress(function() {
		socket.emit("solutionChanged", {'solutionText': $(this).val(), 'sendingUser': this.name});
	});
	
	$("#save").click(function(e) {
		e.preventDefault();
		window.open('/render/?problem='+encodeURIComponent($("#problem_text").text())+'&solution='+encodeURIComponent($("#solution").val()));
	});
});
	
