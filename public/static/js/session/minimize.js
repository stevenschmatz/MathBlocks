$(function(){
	$(".miniz").click(function() {
        if(window.idBeingMaximized = $(this).parent().parent().attr('id')) {
            ids = ["wolfram", "tokbox", "chat", "board", "output"];
            for(var i = 0; i < ids.length; i++) {
                if(!($.contains(document.getElementById(ids[i]), this))) {
                    $("#"+ids[i]).show();
                }
            }

            $(this).parent().parent().parent().animate({
                "height": originalRowHeight
            }, 500);

            $(this).parent().parent().animate({
               "width": window.originalWidth,
               "height": window.originalHeight
            }, 500);
        }
    });
});
