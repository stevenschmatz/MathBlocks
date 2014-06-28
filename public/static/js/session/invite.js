$(function() {
	$("#invite").click(function() {
		var $emailBar = $("<div class='callout panel' id='emailBar'><form id='emailForm'><p>Type each email, separated by a comma.</p><input type='text' id='emails' placeholder='Emails, separated by commas...'/></form></div>");
		if($("#emailBar").length == 0) {
			$("body").prepend($emailBar);
			$("#emails").tagsInput();
			var $inputButton = $("<input type='submit' id='submitButton' value='Submit' class='small round button'>");
			$("#emailForm").append($inputButton);
			$("#emailForm").submit(function(e) {
				e.preventDefault();
					var emails = $("#emails").val();
					if(window.name != '') {
						var psetter = window.name;
					}
					else {
						psetter = 'A user';
					}
					var pName = $("#problem_text").text();
					var link = document.URL;
					$.post('/invite', {'emails': emails, 'psetter': psetter, 'pName': pName, 'link': link}, function(err, data) {
						
					});
					$("#emailBar").html("");
					$("#emailBar").text("Email sent.");
					$("#emailBar").fadeOut(500);
			});
		}
	});
});
