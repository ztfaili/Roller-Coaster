
var canvas = document.getElementById('wheel');
var context = canvas.getContext('2d');

let wheel1Angles = [];
let wheel2Angles = [];
for(i = (Math.PI / 4); i <= 2*Math.PI; i +=(Math.PI / 4)) {
    wheel1Angles.push(i);
    wheel2Angles.push(i);
}

var tParam = 0;
var tParam2 = 0.05;

var tParam3 = 0.5;
var tParam4 = 0.55;

// gl matrix functions

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
        tParam += 0.02;
        tParam2 += 0.02;
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
    

        var C1 = function(t) { // discontinuity at t=1
            var x = t;
            var y = 0.5 * Math.pow(t - 4, 2);
            return [x,y];
        }

        var C1Tangent = function(t) {
            var xPrime = 1;
            var yPrime = t - 4;
            return [xPrime, yPrime];
        }
    

        var C1b = function(t) { // C0 continuity at t=1
            var x = t;
            var y = 0.8 * Math.pow(t - 4, 2);
            return [x,y];
        }

        
        var C1bTangent = function(t) { // C0 continuity at t=1
            var x = 1;
            var y = (1.6*t) - 6.4;
            return [x,y];
        }

        var C1e = function(t) { // C2 continuity at t=1
                var x = t;
                var y = -2*Math.pow(t - 4.1, 3) + 7*Math.pow(t - 4.1, 2) - 6*(t - 4.1) + 2;
                return [x,y];
        }
    
    
        var C1eTangent = function(t) {
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
                return C1b(t);
            }
            
            else if(t >= 5 && t < 7) {
                return C1e(t);
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

        drawCurve(0, 1.0, 100, C0,Tcurve,"brown");
        drawCurve(1.0, 3.0, 175, C02,Tcurve,"brown");
        drawCurve(3.0, 4, 100, C1,Tcurve,"brown");
        drawCurve(4, 5, 100, C1b,Tcurve,"brown");
        drawCurve(5, 6.9, 200, C1e,Tcurve,"brown");
        
        var TWheel = mat3.create();
        mat3.fromTranslation(TWheel, Ccomp(tParam));

        var TWheel2 = mat3.create();
        mat3.fromTranslation(TWheel2, Ccomp(tParam2));

        var Tcart = mat3.create();
        mat3.fromTranslation(Tcart, Ccomp(tParam2));

        var Tcart2 = mat3.create();
        mat3.fromTranslation(Tcart2, Ccomp(tParam2));

        // angles for cart 1
        
        if(tParam < 1) {
            var tangent = C0Tangent(tParam);
            var angle = Math.atan2(tangent[1],tangent[0]);
            mat3.rotate(Tcart, Tcart, angle);
        }
        else if(tParam >= 1 && tParam < 3) {
            var tangent = C02Tangent(tParam);
            var angle = Math.atan2(tangent[1],tangent[0]);
            mat3.rotate(Tcart, Tcart, angle);
        }
        else if(tParam >= 3 && tParam < 4) {
            var tangent = C1Tangent(tParam);
            var angle = Math.atan2(tangent[1], tangent[0]);
            mat3.rotate(Tcart, Tcart, angle);
        }
        else if(tParam >= 4 && tParam < 5) {
            var tangent = C1bTangent(tParam);
            var angle = Math.atan2(tangent[1], tangent[0]);
            mat3.rotate(Tcart, Tcart, angle);
        }
        else {
            var tangent = C1eTangent(tParam);
            var angle = Math.atan2(tangent[1], tangent[0]);
            mat3.rotate(Tcart, Tcart, angle);
        }

        if(tParam2 < 1) {
            var tangent = C0Tangent(tParam2);
            var angle = Math.atan2(tangent[1], tangent[0]);
            mat3.rotate(Tcart2, Tcart2, angle);
        }
        else if(tParam2 >= 1 && tParam2 < 3) {
            var tangent = C02Tangent(tParam2);
            var angle = Math.atan2(tangent[1],tangent[0]);
            mat3.rotate(Tcart2, Tcart2, angle);
        }
        else if(tParam2 >= 3 && tParam2 < 4) {
            var tangent = C1Tangent(tParam2);
            var angle = Math.atan2(tangent[1], tangent[0]);
            mat3.rotate(Tcart2, Tcart2, angle);
        }
        else if(tParam2 >= 4 && tParam2 < 5) {
            var tangent = C1bTangent(tParam2);
            var angle = Math.atan2(tangent[1], tangent[0]);
            mat3.rotate(Tcart2, Tcart2, angle);
        }
        else {
            var tangent = C1eTangent(tParam2);
            var angle = Math.atan2(tangent[1], tangent[0]);
            mat3.rotate(Tcart2, Tcart2, angle);
        }

        // draw cart 1

        var Tobject = mat3.create();
        mat3.multiply(Tobject, Tcurve, TWheel);
        
        var trans1 = mat3.create();
        mat3.fromTranslation(trans1, [0, -10]);
        mat3.multiply(Tobject, trans1, Tobject);
        drawWheel("#0ba115", Tobject, wheel1Angles);
        
        var Tobject2 = mat3.create();
        mat3.multiply(Tobject2, Tcurve, TWheel2);

        mat3.multiply(Tobject2, trans1, Tobject2);
        drawWheel("#23e830", Tobject2, wheel2Angles);

        var Tobject3 = mat3.create();
        mat3.multiply(Tobject3, Tcurve, Tcart)

        var trans3 = mat3.create();
        mat3.fromTranslation(trans3, [0, -30]);
        mat3.multiply(Tobject3, trans3, Tobject3);
        drawCart("red", Tobject3);

        // draw cart 2



        // reset the animation
        if(tParam > 6.9) {
            tParam = 0;
        }

        if(tParam2 > 6.9) {
            tParam2 = 0;
        }
        window.requestAnimationFrame(draw);
    }

    draw();
    
}
window.onload = setup();