var images = ["../images/baghead.png","../images/giornoemoji.png","../images/infomaniacpfp.png","../images/unityFrozenLogo.png","../images/filler.png"];
// <img src="../images/baghead.png" alt="bag head profile pic" id="pos0">
// container.append("<img src=\""+images[i]+"\">\n");
let button = $("#scrollButton");
let container = $("#scrollContainer");
var j = 0;

$(document).ready(function(){
    for(let i = 0; i < images.length; i++)
    {
        container.append("<img src=\""+images[i]+"\">\n");
    }
});

$(document).ready(function(){
    button.click(function(){
        let content = "";
        //j is my current start position
        j += 1;
        if(j >= images.length)
        {
            j = 0;
        }
        let k = j;
        for(let i = 0; i < 5; i++)
        {

            k++;
            if(k >= images.length)
            {
                k = 0;
            }

            switch(i)
            {
                case 0:
                    content += "<img src="+images[k]+" id=\"first\" style=\"opacity: 0.5;\">\n";
                    break;
                case 4:
                    content += "<img src="+images[k]+" id=\"last\" style=\"display: none;opacity: 0.5;\">\n";
                    break;
                default:
                    content += "<img src="+images[k]+" style=\"opacity: 0.5;\">\n";
                    break;
            }
            
        }
        
        container.html(content);
        $("img").css({"width":"150px","height":"150px"});
        $("#first").hide("slow");
        $("#last").show("slow");
    });
});

$(document).ready(function(){
    $("body").on("mouseenter","img",function(){
        $(this).animate(
            {
                opacity: 1,
                height: "+=50px",
                width: "+=50px"
            }
        ,"fast")
    });
});

$(document).ready(function(){
    $("body").on("mouseleave","img",function(){
        $(this).animate(
            {
                opacity: 0.5,
                height: "150px",
                width: "150px"
            }
        ,"fast")
    });
});



