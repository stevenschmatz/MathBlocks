$(function() {
	$("#icon").click(function(){
        $(".menuList").hide();
        $("#menu").css({
            "padding": "0"
        });

        $("#sidebar").animate( {
            "width": "0"
        }, { duration: 250, queue: false });

        $("#content").animate( {
            "width": "100%"

        });

        $("#sidebar_header").animate({
            "color": "white",
            "z-index":"-1"
        }, { duration: 150, queue: false });

        $("li a").css({
            "color": "white"
        });

        $("#open_panel_icon").animate({
            "left":'0px'
        },{ duration: 500, queue: false });
    });

    $("#open_panel_icon").click(function() {
        $(".menuList").show();
        $("#open_panel_icon").animate({
            "left":'-400px'
        },{ duration: 500, queue: false })

        $("li a").css({
            "color": "#46a9b2"
        })

        $("#sidebar_header").animate({
            "color": "white",
            "z-index":"-1"
        }, { duration: 150, queue: false })

        $("#content").animate( {
            "width": "84%"

        })

        $("#sidebar").animate( {
            "width": "16%"
        }, { duration: 250, queue: false })

        $("#menu").css( {
            "padding": "10px"
        })

    });

    $(".close").click(function() {
        $(this).parent().parent().hide();
    })

});
