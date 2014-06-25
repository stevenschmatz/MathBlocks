$(function() {
    $("#problem").keydown(function(e) {
        if ($(this).val().length == 1) {
            $("#type_a_problem").text("Press enter to submit");
        }
        if (e.keyCode == 13) {
            e.preventDefault();
            $(".overview").fadeOut(500);
            setTimeout(function() { $("#problemForm").submit() }, 500);
        }
    });
});
