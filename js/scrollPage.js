$(document).ready(function(){
    $("img").mouseenter(function(){
        $(this).animate({
            height: "200px",
            width: "200px",
            opacity: "1"
        },200)
    });
});
$(document).ready(function(){
    $("img").mouseleave(function(){
        $(this).animate({
            height: "150px",
            width: "150px",
            opacity: "0.5"
        },200)
    });
});
