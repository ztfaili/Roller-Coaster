
var canvas = document.getElementById('wheel');
var context = canvas.getContext('2d');

var wheel1Angles = [];
var wheel2Angles = [];
var wheel3Angles = [];
for(i = (Math.PI / 4); i <= 2*Math.PI; i +=(Math.PI / 4)) {
    wheel1Angles.push(i);
    wheel2Angles.push(i);
    wheel3Angles.push(i);
}

var t = [];
t.push(0.05);
t.push(0.7);
t.push(1.4);

function moveToTx(loc,Tx) {
    var res=vec2.create(); 
    vec2.transformMat3(res,loc,Tx); 
    context.moveTo(res[0],res[1]);
}

function lineToTx(loc,Tx) {
    var res=vec2.create(); 
    vec2.transformMat3(res,loc,Tx); 
    context.lineTo(res[0],res[1]);
}

function setup() {
    function draw() {
        for(i = 0; i < t.length; i++) {
            t[i] += 0.01;
        }
        canvas.width = canvas.width;

        function drawWheel(color, Tx, angles) {
            for(i = 0; i < 8; i++) {
                angles[i] -= 0.05;
            }
            context.beginPath();
            context.strokeStyle = color;
            context.arc(Tx[6], Tx[7], 10, 0, 2 * Math.PI);
            context.stroke();
            context.closePath();
            for(i = 0; i < 8; i++) {
                drawSpoke(angles[i], Tx);
            }
            context.lineWidth = 5;
        }

        function drawSpoke(angle, Tx) {
            var spokeMat = mat3.create();
            for(j = 0; j < Tx.length; j++) {
                spokeMat[j] = Tx[j];
            }
            mat3.rotate(spokeMat, spokeMat, angle);
            context.lineWidth = 1;
            moveToTx([0, 0], spokeMat);
            lineToTx([0, 0.08], spokeMat);
            context.stroke();
        }

        function drawCart(color, Tx) {
            context.beginPath();
            context.fillStyle = color;
            moveToTx([-0.25, -0.05], Tx);
            lineToTx([-0.25, 0.05], Tx);
            lineToTx([0.25, 0.05], Tx);
            lineToTx([0.25, -0.05], Tx);
            moveToTx([-0.25, -0.05], Tx);
            lineToTx([-0.25, 0.2], Tx);
            lineToTx([-0.15, 0.2], Tx);
            lineToTx([-0.15, -0.05], Tx);
            moveToTx([0.25, 0.05], Tx);
            lineToTx([0.25, 0.2], Tx);
            lineToTx([0.15, 0.2], Tx);
            lineToTx([0.15, 0.05], Tx);


            context.closePath();
            context.fill();
        }

        // curves 
        
        var C0 = function(t) {
                var x = t;
                var y = 0.5 * t*t;
                return [x,y];
        }
    
        var C0Tangent = function(t) {
            var xPrime = 1;
            var yPrime = 1*t;
            return [xPrime, yPrime];
        }

        var C02 = function(t) {
            var x = t;
            var y = -0.5 * Math.pow(t - 2, 2) + 1;
            return [x,y];
        }

        var C02Tangent = function(t) {
            var xPrime = 1;
            var yPrime = -1*t + 2;
            return [xPrime, yPrime];
        }
    

        var C1 = function(t) {
            var x = t;
            var y = 0.5 * Math.pow(t - 4, 2);
            return [x,y];
        }

        var C1Tangent = function(t) {
            var xPrime = 1;
            var yPrime = t - 4;
            return [xPrime, yPrime];
        }
    

        var C2 = function(t) { 
            var x = t;
            var y = 0.8 * Math.pow(t - 4, 2);
            return [x,y];
        }

        
        var C2Tangent = function(t) {
            var x = 1;
            var y = (1.6*t) - 6.4;
            return [x,y];
        }

        var C3 = function(t) { 
                var x = t;
                var y = -2*Math.pow(t - 4.1, 3) + 7*Math.pow(t - 4.1, 2) - 6*(t - 4.1) + 2;
                return [x,y];
        }
    
    
        var C3Tangent = function(t) {
            var xPrime = 1;
            var yPrime = -6*Math.pow(t - 4.1, 2) + 14*(t - 4.1) - 6;
            return [xPrime, yPrime];
        }
        
        var Ccomp = function(t) {
            if(t < 1) {
                return C0(t);
            }
            else if(t >= 1 && t < 3) {
                return C02(t);
            }
            else if(t >= 3 && t < 4) {
                return C1(t);
            }
            else if(t >= 4 && t < 5) {
                return C2(t);
            }
            
            else if(t >= 5 && t < 7) {
                return C3(t);
            }
            
        }

        function drawCurve(t_begin, t_end, intervals, C, Tx, color) {
            context.strokeStyle=color;
            context.beginPath();
            moveToTx(C(t_begin),Tx);
            for(var i = 1; i <= intervals; i += 15){
                context.lineWidth = 3;
                var t = ((intervals - i)/intervals)*t_begin+(i / intervals)*t_end;
                moveToTx(C(t), Tx);
                lineToTx([C(t)[0], -800],Tx)
            }
            context.stroke();
            context.closePath();
            context.beginPath();
            for(var j = 0; j <= intervals; j++){
                context.lineWidth = 5;
                var t = ((intervals - j)/intervals) * t_begin + (j/intervals) * t_end;
                lineToTx(C(t),Tx);
            }
            context.stroke();
            context.closePath();
        }

        var Tcurve = mat3.create();
	    mat3.fromTranslation(Tcurve,[50, 450]);
	    mat3.scale(Tcurve,Tcurve,[150, -150]);

        drawCurve(0, 1.0, 100, C0, Tcurve,"brown");
        drawCurve(1.0, 3.0, 175, C02, Tcurve,"brown");
        drawCurve(3.0, 4, 100, C1, Tcurve,"brown");
        drawCurve(4, 5, 100, C2, Tcurve,"brown");
        drawCurve(5, 6.9, 200, C3, Tcurve,"brown");
        
        
        var Tcart = mat3.create();
        mat3.fromTranslation(Tcart, Ccomp(t[0]));
        
        var Tcart2 = mat3.create();
        mat3.fromTranslation(Tcart2, Ccomp(t[1]));

        var Tcart3 = mat3.create();
        mat3.fromTranslation(Tcart3, Ccomp(t[2]));

        // rotations for cart 1

        var angle = 0;
        
        if(t[0] < 1) {
            var tangent = C0Tangent(t[0]);
            angle = Math.atan2(tangent[1],tangent[0]);
            mat3.rotate(Tcart, Tcart, angle);
        }
        else if(t[0] >= 1 && t[0] < 3) {
            var tangent = C02Tangent(t[0]);
            angle = Math.atan2(tangent[1],tangent[0]);
            mat3.rotate(Tcart, Tcart, angle);
        }
        else if(t[0] >= 3 && t[0] < 4) {
            var tangent = C1Tangent(t[0]);
            angle = Math.atan2(tangent[1], tangent[0]);
            mat3.rotate(Tcart, Tcart, angle);
        }
        else if(t[0] >= 4 && t[0] < 5) {
            var tangent = C2Tangent(t[0]);
            angle = Math.atan2(tangent[1], tangent[0]);
            mat3.rotate(Tcart, Tcart, angle);
        }
        else {
            var tangent = C3Tangent(t[0]);
            angle = Math.atan2(tangent[1], tangent[0]);
            mat3.rotate(Tcart, Tcart, angle);
        }

        // rotations for cart 2

        if(t[1] < 1) {
            var tangent = C0Tangent(t[1]);
            var angle = Math.atan2(tangent[1], tangent[0]);
            mat3.rotate(Tcart2, Tcart2, angle);
        }
        else if(t[1] >= 1 && t[1] < 3) {
            var tangent = C02Tangent(t[1]);
            var angle = Math.atan2(tangent[1],tangent[0]);
            mat3.rotate(Tcart2, Tcart2, angle);
        }
        else if(t[1] >= 3 && t[1] < 4) {
            var tangent = C1Tangent(t[1]);
            var angle = Math.atan2(tangent[1], tangent[0]);
            mat3.rotate(Tcart2, Tcart2, angle);
        }
        else if(t[1] >= 4 && t[1] < 5) {
            var tangent = C2Tangent(t[1]);
            var angle = Math.atan2(tangent[1], tangent[0]);
            mat3.rotate(Tcart2, Tcart2, angle);
        }
        else {
            var tangent = C3Tangent(t[1]);
            var angle = Math.atan2(tangent[1], tangent[0]);
            mat3.rotate(Tcart2, Tcart2, angle);
        }

        // rotations for cart 3

        if(t[2] < 1) {
            var tangent = C0Tangent(t[2]);
            var angle = Math.atan2(tangent[1], tangent[0]);
            mat3.rotate(Tcart3, Tcart3, angle);
        }
        else if(t[2] >= 1 && t[2] < 3) {
            var tangent = C02Tangent(t[2]);
            var angle = Math.atan2(tangent[1],tangent[0]);
            mat3.rotate(Tcart3, Tcart3, angle);
        }
        else if(t[2] >= 3 && t[2] < 4) {
            var tangent = C1Tangent(t[2]);
            var angle = Math.atan2(tangent[1], tangent[0]);
            mat3.rotate(Tcart3, Tcart3, angle);
        }
        else if(t[2] >= 4 && t[2] < 5) {
            var tangent = C2Tangent(t[2]);
            var angle = Math.atan2(tangent[1], tangent[0]);
            mat3.rotate(Tcart3, Tcart3, angle);
        }
        else {
            var tangent = C3Tangent(t[2]);
            var angle = Math.atan2(tangent[1], tangent[0]);
            mat3.rotate(Tcart3, Tcart3, angle);
        }


        // draw cart 1

        var Tobject1 = mat3.create();
        mat3.multiply(Tobject1, Tcurve, Tcart);

        var cartTrans = mat3.create();
        mat3.fromTranslation(cartTrans, [0, -15]);
        mat3.multiply(Tobject1, cartTrans, Tobject1);
        drawCart("red", Tobject1);

        // draw wheel attatched to cart 
        drawWheel("#0ba115", Tobject1, wheel1Angles);
        
        // draw cart 2

        var Tobject2 = mat3.create();
        mat3.multiply(Tobject2, Tcurve, Tcart2);
        mat3.multiply(Tobject2, cartTrans, Tobject2);
        drawCart("red", Tobject2);

        // draw wheel attatched to cart 
        drawWheel("#0ba115", Tobject2, wheel2Angles);
        
        // draw cart 3
        
        var Tobject3 = mat3.create();
        mat3.multiply(Tobject3, Tcurve, Tcart3);
        mat3.multiply(Tobject3, cartTrans, Tobject3);
        drawCart("red", Tobject3);

        // draw wheel attatched to cart 
        drawWheel("#0ba115", Tobject3, wheel3Angles);
        
        // reset the animation
        for(i = 0; i < t.length; i++) {
            if(t[i] > 6.9) {
                t[i] = 0;
            }
        }
        
        window.requestAnimationFrame(draw);
    }

    draw();
    
}
window.onload = setup();