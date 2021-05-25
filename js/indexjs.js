$(document).ready(function(){
    $(".navSeparator > a").mouseenter(function(){
        $(this).animate({
            opacity: 1,
            backgroundColor: "#FFF000"
        }, "fast")
    });
});

$(document).ready(function(){
    $(".navSeparator > a").mouseleave(function(){
        $(this).animate({
            opacity: 0.5
        }, "fast")
    });
});