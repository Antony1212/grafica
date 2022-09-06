var gl;
function iniciarGL(canvas) {
    try {
        gl = canvas.getContext("webgl");
        gl.puertoVistaAncho = canvas.width;
        gl.puertoVistaAlto = canvas.height;
    } catch (e) { }
    if (!gl) {
        alert("No puede iniciarse webGL en este navegador");
    }
}
function conseguirShader(gl, id) {
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
        return null;
    }
    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
        if (k.nodeType == 3)
            str += k.textContent;
        k = k.nextSibling;
    }
    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else { return null; }
    gl.shaderSource(shader, str);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
}
var programaShader;
function iniciarShaders() {
    var fragmentoShader = conseguirShader(gl, "shader-fs");
    var verticeShader = conseguirShader(gl, "shader-vs");
    programaShader = gl.createProgram();
    gl.attachShader(programaShader, verticeShader);
    gl.attachShader(programaShader, fragmentoShader);
    gl.linkProgram(programaShader);
    if (!gl.getProgramParameter(programaShader, gl.LINK_STATUS)) {
        alert("No pueden iniciarse los shaders");
    }
    gl.useProgram(programaShader);
    programaShader.atribPosVertice = gl.getAttribLocation(programaShader, "aPosVertice");
    gl.enableVertexAttribArray(programaShader.atribPosVertice);
    //... 1. Definimos Shaders para el color
    programaShader.vertColorAtributo = gl.getAttribLocation(programaShader, "aVerticeColor");
    gl.enableVertexAttribArray(programaShader.vertColorAtributo);
    //... Fin de Shaders para el color
    programaShader.pMatrizUniforme = gl.getUniformLocation(programaShader, "uPMatriz");
    programaShader.mvMatrizUniforme = gl.getUniformLocation(programaShader, "umvMatriz");
}

function puntosTriangulo(pPuntos){
    var tri = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tri);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pPuntos), gl.STATIC_DRAW);
    tri.itemTam = 3;
    tri.numItems = 3;
    return tri;
}
function colorTriangulo(pColor){
     var triC = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triC);
    var color=[];
    for (var i=0; i<3; i++){
        color = color.concat(pColor);
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW);
    triC.itemTam = 4;
    triC.numItems = 3;
    return triC;
}
function puntosCuadrado(pPuntos){
    var cuad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cuad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pPuntos), gl.STATIC_DRAW);
    cuad.itemTam = 3;
    cuad.numItems = 4;
    return cuad;
}
function colorCuadrado(pColor){
    var cuadC = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cuadC);
    var color=[];
    for (var i=0; i<4; i++){
        color = color.concat(pColor);
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW);
    cuadC.itemTam = 4;
    cuadC.numItems = 4;
    return cuadC;
}
//... 2. variable para color
var triangulo, trianguloColor, triangulo1, triangulo1Color,triangulo2, triangulo2Color,triangulo3, triangulo3Color,triangulo4, triangulo4Color;
var cuadrado, cuadradoColor, cuadrado1, cuadrado1Color;

function iniciarBuffers() {
    //... construyendo triangulo
    triangulo= puntosTriangulo([-2.0, -1.0, 0.0, 0.0, 1.0, 0.0, 2.0, -1.0, 0.0]);
    triangulo1= puntosTriangulo([-1.0, 2.0, 0.0,1.0, 0.0, 0.0,-1.0, -2.0, 0.0]);
    triangulo2= puntosTriangulo([-1.0, 0.5, 0.0,1.0, 0.5, 0.0,0.0, -0.5, 0.0]);
    triangulo3= puntosTriangulo([-0.5, 0.0, 0.0,0.5, 1.0, 0.0,0.5, -1.0, 0.0]);
    triangulo4= puntosTriangulo([-1.5, 0.5, 0.0,0.5, 0.5, 0.0,0.5, -1.5, 0.0]);
    //... 3. Color para el triangulo
   trianguloColor=colorTriangulo([1.0, 0.0, 0.0, 1.0]);
   triangulo1Color=colorTriangulo([0.0, 1.0, 0.0, 1.0]);
   triangulo2Color=colorTriangulo([0.0, 1.0, 1.0, 1.0]);
   triangulo3Color=colorTriangulo([0.0, 0.0, 1.0, 1.0]);
   triangulo4Color=colorTriangulo([1.0, 1.0, 1.0, 1.0]);
    //... Fin color
    //... construyendo cuadrado
    cuadrado=puntosCuadrado([-1.0, 0.0, 0.0,0.0, 1.0, 0.0,0.0, -1.0, 0.0,1.0, 0.0, 0.0]);
    cuadrado1=puntosCuadrado([-0.5, 1.5, 0.0,0.5, 0.5, 0.0,-0.5, -0.5, 0.0,0.5, -1.5, 0.0]);
    
    //... 3. Color para el cuadrado
    cuadradoColor=colorCuadrado([1.0, 0.0, 1.0, 1.0]);
    cuadrado1Color=colorCuadrado([1.0, 1.0, 0.0, 1.0]);
    
    //... Fin color
    //... aqui aplicar el color para el rectangulo
}
var mvMatriz = mat4.create();
var pMatriz = mat4.create();

function modificarMatrizUniforme() {
    gl.uniformMatrix4fv(programaShader.pMatrizUniforme, false, pMatriz);
    gl.uniformMatrix4fv(programaShader.mvMatrizUniforme, false, mvMatriz);
}

var trasladartriangulo1x = -1.8;
var trasladartriangulo1y = -3.1;
var trasladartriangulo2x = 3.1;
var trasladartriangulo2y = 1.5;
var trasladartriangulo3x = 3.1;
var trasladartriangulo3y = 3.1;
var trasladartriangulo4x = -2.3;
var trasladartriangulo4y = 1.5;

var trasladarcuadrado1y = 2.0;
var trasladarcuadrado1x = -1.8;
var trasladarcuadrado2x = -2.30;
var trasladarcuadrado2y = 3.1;
var trasladarcuadrado3x = -1.05;
var trasladarcuadrado3y = 3.1;

var trasladarcuadrado1 = 3.0;
var rotartriangulo=0;
var rotarcuadrado=0;
var conteo=0;
var Escalacuadrado= 0.5;
var tiempos=1;


function graficotriangulo(triangulo1,triangulo1Color,Traslado,rotacion,escala){
    
    mat4.identity(mvMatriz);
    mat4.translate(mvMatriz, Traslado);
    mat4.rotate(mvMatriz, rotacion*Math.PI/180, [0, 1, 0]);
    mat4.scale(mvMatriz, escala);
    gl.bindBuffer(gl.ARRAY_BUFFER, triangulo1);
    gl.vertexAttribPointer(programaShader.atribPosVertice, triangulo1.itemTam, gl.FLOAT, false, 0, 0);
    //... Aplicando color
    gl.bindBuffer(gl.ARRAY_BUFFER, triangulo1Color);
    gl.vertexAttribPointer(programaShader.vertColorAtributo, triangulo1Color.itemTam, gl.FLOAT, false, 0, 0);
    //... Fin aplicando color
    modificarMatrizUniforme();
    gl.drawArrays(gl.TRIANGLES, 0, triangulo1.numItems);
    
}

function graficopoligono(cuadrado,cuadradoColor,traslado,rotacion,escala){
    
    mat4.identity(mvMatriz);
    mat4.translate(mvMatriz, traslado);
    mat4.rotate(mvMatriz, rotacion*Math.PI/180, [0, 0, 1]);
    mat4.scale(mvMatriz, escala);
    gl.bindBuffer(gl.ARRAY_BUFFER, cuadrado);
    gl.vertexAttribPointer(programaShader.atribPosVertice, cuadrado.itemTam, gl.FLOAT, false, 0, 0);
    //... Aplicando color
    gl.bindBuffer(gl.ARRAY_BUFFER, cuadradoColor);
    gl.vertexAttribPointer(programaShader.vertColorAtributo, cuadradoColor.itemTam, gl.FLOAT, false, 0, 0);
    //... Fin aplicando color
    modificarMatrizUniforme();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, cuadrado.numItems);
    
}


function dibujarEscena() {
     gl.viewport(0, 0, gl.puertoVistaAncho, gl.puertoVistaAlto);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    mat4.perspective(45, gl.puertoVistaAncho / gl.puertoVistaAlto, 0.1, 100.0, pMatriz);
     
    graficotriangulo(triangulo3,triangulo3Color,[trasladartriangulo2x, trasladartriangulo2y,-8.0],0,[0.5,0.5,1.0]);
    graficotriangulo(triangulo1,triangulo1Color,[trasladartriangulo4x, trasladartriangulo4y ,-8.0],0,[Escalacuadrado,Escalacuadrado, 1.0]) ;
    graficopoligono(cuadrado,cuadradoColor,[ trasladarcuadrado1x, trasladarcuadrado1y,-8.0],rotartriangulo,[0.5,0.5,1.0]);
    graficotriangulo(triangulo,trianguloColor,[trasladartriangulo1x,trasladartriangulo1y ,-8.0],rotarcuadrado,[0.5,0.5,1.0]) ; 
    graficotriangulo(triangulo2,triangulo2Color,[trasladarcuadrado2x, trasladarcuadrado2y,-8.0],0,[0.5,0.5,1.0]) ;
    graficotriangulo(triangulo4,triangulo4Color,[trasladartriangulo3x, trasladartriangulo3y,-8.0],0,[0.5,0.5,1.0]) ; 
    graficopoligono(cuadrado1,cuadrado1Color,[trasladarcuadrado3x, trasladarcuadrado3y,-8.0],0,[0.5,0.5,1.0]);
    }

var ultimoTiempo = 0;
var caso=1;

function animacion() {
    var tiempoAhora = new Date().getTime();

    switch (tiempos) {
        case 1:   

            if (ultimoTiempo != 0) {
                var lapso = tiempoAhora - ultimoTiempo;
                rotartriangulo += (90 * lapso) / 1000.0;
            
                trasladartriangulo1y=trasladartriangulo1y+0.01;
                
                switch (caso) {
                case 1:

                    Escalacuadrado=Escalacuadrado+0.005;
                    
                    if( Escalacuadrado>=0.5){
                    
                        caso=2;   
                    } 


                break;
                case 2:
                    Escalacuadrado=Escalacuadrado-0.005;
                    if( Escalacuadrado<=0.05){
                    
                        caso=1;   
                    } 
                break;
            }
            
            }
            if(rotartriangulo>=360)
                rotartriangulo= 0;
            ultimoTiempo = tiempoAhora;

            if(trasladartriangulo1y>=1.0){
                trasladartriangulo1y= 1.0;
                rotarcuadrado= 0;
            }
            else{
                rotarcuadrado += 1;
            }
            
            if(trasladarcuadrado1 ==-0.5){
                trasladarcuadrado1= -0.5;
                
            }else{
                trasladarcuadrado1=trasladarcuadrado1-0.01;
            }
            if(trasladarcuadrado2y <= 2.25){
                trasladarcuadrado2y = 2.25;
                
            }else{
                trasladarcuadrado2y=trasladarcuadrado2y-0.01;
            }

            if(trasladarcuadrado3y <= 1.0){
                trasladarcuadrado3y = 1.0;
                
            }else{
                trasladarcuadrado3y=trasladarcuadrado3y-0.01;
            }

            if(trasladartriangulo2x <= -1.55){
                trasladartriangulo2x = -1.55;
                
            }else{
                trasladartriangulo2x=trasladartriangulo2x-0.1;
            }
            if(trasladartriangulo3x <= -1.05){
                trasladartriangulo3x = -1.05;
                trasladartriangulo3y = 2.25;
        
            }else{
                trasladartriangulo3x=trasladartriangulo3x-0.01;
                trasladartriangulo3y=trasladartriangulo3y-0.0020;
            }
            conteo=conteo+1;
            if(conteo==542){
                tiempos=2;
            }
            
            
        
        break;
        case 2:
            if (ultimoTiempo != 0) {
                var lapso = tiempoAhora - ultimoTiempo;
                rotartriangulo += (90 * lapso) / 1000.0;
            }

            if(rotartriangulo>=360)
                rotartriangulo= 0;
            ultimoTiempo = tiempoAhora;

            if(trasladarcuadrado3y<=-2.2){
                trasladarcuadrado3x =2.0;
                trasladarcuadrado3y =-2.2;
            }else{
                trasladarcuadrado3x=trasladarcuadrado3x+0.003;
                trasladarcuadrado3y=trasladarcuadrado3y-0.01;
            }
  
        break;
        }
    }


function mover(){
    dibujarEscena();
    animacion();
    requestAnimFrame(mover);
}


function webGLEjecutar() {
    var canvas = document.getElementById("leccion02-movimiento");
    iniciarGL(canvas);
    iniciarShaders();
    iniciarBuffers();
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    mover();
}