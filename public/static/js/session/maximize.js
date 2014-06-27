$(function(){
	$(".maxim").click(function(){
        ids = ["wolfram", "tokbox", "chat", "board", "output"];
        for(var i = 0; i < ids.length; i++) {
            //var ith_rectangle =  document.getElementById(ids[i]).getBoundingClientRect();
            //window.corners[ids[i]] = ith_rectangle[0], ith_rectangle[1], ith_rectangle[2], ith_rectangle[3];
            window.originalWidth = $(this).parent().parent().width();
            window.originalHeight = $(this).parent().parent().height();
            window.originalRowHeight = $(this).parent().parent().parent().height();
            window.idBeingMaximized = $(this).parent().parent().attr('id');
            if (!($(this).parent().parent().attr('id') == ids[i])) {
                $("#"+ids[i]).hide();
            }
        }

        $(this).parent().parent().parent().css({
            "height": "100% !important"
        });

        $(this).parent().parent().animate({
            "width": "100%",
            "height": "100%"
        }, 500)
    });
});
