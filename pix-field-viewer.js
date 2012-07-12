
var Viewer = function() {
    // private variables
    var canvas = {},
        context = {},
        width = 800,
        height = 800;
    
    var reset = function() {
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, canvas.width, canvas.height);
    };

    return {
        pix : [],
        
        transform : {
            zoom : 10,
            rotate : 0
        },
        
        init : function() {
            canvas = document.getElementById("canvas");
            canvas.width = width;
            canvas.height = height;
            
            context = canvas.getContext("2d");
        },
        
        draw : function() {
            reset();
            context.fillStyle = "black";
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.translate(width / 2, height / 2);
            context.rotate(this.transform.rotate * Math.PI / 180);
            context.scale(this.transform.zoom, this.transform.zoom);
            this.pix.forEach(function(p) {
                context.fillStyle = p.f;
                var s2 = p.s / 2;
                context.fillRect(p.x - s2, p.y - s2, p.s, p.s);
            });
        }
    };
}();

function example() {
    Viewer.pix = [
        {x:0,y:1,f:"red",s:1},
        {x:-1,y:-0.5,f:"blue",s:1},
        {x:1,y:-0.5,f:"yellow",s:2}];
    Viewer.draw();
}

function refresh() {
    Viewer.transform.zoom = document.getElementById("zoom").value;
    Viewer.transform.rotate = document.getElementById("rotate").value;
    Viewer.draw();
}

window.onload = function() {
    Viewer.init();
    example();
};
