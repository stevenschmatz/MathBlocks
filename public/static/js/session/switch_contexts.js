$(function() {
	$(".switchLink").click(function(e) {
		e.preventDefault();
		if($(this).attr('data-selected') == 'true') {
			// do nothing
		} else {
			$(".switchLink").removeClass('small');
			$(".switchLink").removeClass('round');
			$(".switchLink").removeClass('button');
			$(".switchLink").css("color", "");
			$(this).addClass('small');
			$(this).addClass('round');
			$(this).addClass('button');
			$(this).css('color', 'white');
			window.context = $(this).attr('data-context');
			if(window.context == 'latex') {
				$("#saveLatex").show();
				$("#graph").hide();
				$("#graphInput").hide();
				$("#latexRender").show();
				if($("#latexInput").length == 0) {
					$("#graphInput").remove();
					var $latexEditor = $("<input type='text' id='latexInput' placeholder='Type your LaTeX here.'/>");
					$(".boardRight").prepend($latexEditor);
					$("#latexInput").val(window.latexContent);
					$("#latexRender").text(window.latexContent);
					MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
					$("#latexInput").keydown(function() {
							$("#latexRender").text($(this).val());
							MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
							socket.emit('latexChanged', {'rawText': $("#latexInput").val(), 'sendingUser': window.name});
						});
					}
				}
			else if(window.context == 'graph') {
				$("#latexInput").remove();
				$("#latexRender").hide();
				$("#graph").show();
				if($("#graphInput").length == 0) {
					var $graphEditor = $("<input type='text' id='graphInput' placeholder='Type your function here.'/>");
					$(".boardRight").prepend($graphEditor);
					var $graph = $("<div id='graph'></p>");
					$(".boardRight").append($graph);
					if(window.graphSource != undefined) {
						$("#graph").html('<img src="' + window.graphSource + '"></img>');
					}
					$("#graphInput").val(window.funct);
					$graphEditor.ready(function() {
						$("#graphInput").keydown(function(e) {
							if(e.keyCode == 13) {
								e.preventDefault();
								var funct = $("#graphInput").val();
								$.post('/plot', {'funct': funct}, function(data) {
									parsed = JSON.parse(data);
									if(parsed['status'] == 'ok') {
										$("#graph").html('<img src="' + parsed['result'] + '"></img>');
										socket.emit('graphChanged', {'graphSource': parsed['result'], 'funct': funct, 'sendingUser': window.name});
									}
									else {
										$("#error").text(parsed['error']);
									}
								});
							}
						});
					});
				}
			}
		}
	});
});
