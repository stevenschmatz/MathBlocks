$(function() {
    $("#problem_text").hide();
    $(".draggable").hide();
    $("#sidebar").hide();
    $("#menu").hide();

    $("#problem_text").fadeIn(500);
    $("#sidebar").fadeIn(500);
    $("#menu").fadeIn(500);
    $(".callout .panel").fadeIn(500);
    $(".draggable").delay(500).fadeIn(500);
    $(".draggable").draggable();
    $(".draggable").resizable();
    $(".draggable").mouseover(function() {
        $(this).animate({
         "border-color": "#494949",
         "border-width": "0.2em"
         }, 100);
    });

    $(".draggable").mouseleave(function() {
        $(this).animate({
            "border-color": "#9D9D9D",
            "border-width": "1px"
        }, 100);
    });

    $("#clear").click(function() {
        $(".close").parent().parent().hide()
    });
});
    
