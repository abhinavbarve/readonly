var navbar = document.querySelector("#navigation-bar")

var headroom = new Headroom(navbar,{
    tolerance:{
        up:4,
        down:0
    }
});
headroom.init();
$(document).ready(function(){
$(this).scrollTop(0,0);
});
