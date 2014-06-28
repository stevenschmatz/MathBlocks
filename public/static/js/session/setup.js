$(function() {

	/* window logic setup */

	$("#graph").hide();
	$("#plot").hide();
	$("#saveLatex").hide();
    $("#draggable").css('z-index', '9999999999');
    $("#content").css('height', '150%');

   	window.context = "whiteboard";
	window.name = "";

	window.highestStream = 0;
	window.wasAlreadyMinimized = 0;
});
