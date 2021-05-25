$(document).ready(function(){
    $(".navSeparator > #navMenu").css("opacity","0.5");
});
$(document).ready(function(){
    $(".navSeparator > #navMenu").mouseenter(function(){
        $(this).animate({
            opacity: 1
        }, "fast")
    });
});

$(document).ready(function(){
    $(".navSeparator > #navMenu").mouseleave(function(){
        $(this).animate({
            opacity: 0.5
        }, "fast")
    });
});