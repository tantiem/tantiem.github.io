var submitButton = $("#submit");

submitButton.css("opacity", "0.5");

$(document).ready(function(){
    submitButton.mouseenter(function(){
        $(this).animate({
            opacity: 1
        }, "fast")
    })
});

$(document).ready(function(){
    submitButton.mouseleave(function(){
        $(this).animate({
            opacity: 0.5
        }, "fast")
    })
});