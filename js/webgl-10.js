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
    //... Definimos Shaders para el color
    programaShader.vertColorAtributo = gl.getAttribLocation(programaShader, "aVerticeColor");
    gl.enableVertexAttribArray(programaShader.vertColorAtributo);
    ///... Fin de Shaders para el color
    programaShader.pMatrizUniforme = gl.getUniformLocation(programaShader, "uPMatriz");
    programaShader.mvMatrizUniforme = gl.getUniformLocation(programaShader, "umvMatriz");
}
    function puntosTriangulo(pPuntos,pAristas){
        var tri= gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, tri);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pPuntos), gl.STATIC_DRAW);
        tri.itemTam = 3;
        tri.numItems = pAristas;
        return tri;
    }
    function puntosCuadrado(pPuntos){
        var cua = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cua);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pPuntos), gl.STATIC_DRAW);
        cua.itemTam = 3;
        cua.numItems = 5;
        return cua;
    }
    function colorTriangulo(pColor,pVertice,pArista){
        var triC = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, triC);
        var color= [];
        for (var i= 0; i<pVertice; i++){
            color= color.concat(pColor);
        }
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW);
        triC.itemTam = 4;
        triC.numItems = pArista;
        return triC;
    }
    function colorCuadrado(pcolor){
        var cuaC = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cuaC);
         color= [];
        for (var i= 0; i<4; i++){
            color= color.concat(pcolor);
        }
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW);
        cuaC.itemTam = 4;
        cuaC.numItems = 5;
        return cuaC;
    }
var triangulo, trianguloColor;
var cuadrado, cuadradoColor;
function iniciarBuffers() {
    //... dibujando el triangulo
    triangulo= puntosTriangulo(
        [0.0, 1.0, 0.0,
        -1.0, -1.0, 1.0
        ,1.0, -1.0, 1.0,
        
        // cara derecha
        0.0, 1.0, 0.0,
        1.0, -1.0, 1.0
        ,1.0, -1.0, -1.0,
        
        // cara atras
        0.0, 1.0, 0.0,
        1.0, -1.0, -1.0
        ,-1.0, -1.0, -1.0,
        // cara izquierda
        0.0, 1.0, 0.0,
        -1.0, -1.0, -1.0
        ,-1.0, -1.0, 1.0 ],12);
    
    
    //... Color para el triangulo
    trianguloColor= colorTriangulo([
            [1.0, 0.0, 0.0, 1.0],
            [0.0, 1.0, 0.0, 1.0],
            [0.0, 0.0, 1.0, 1.0],
            [1.0, 0.0, 1.0, 1.0]
            ],3,12);
    
    
    
    
    //... dibujando el cuadrado
    cuadrado= puntosCuadrado([  -0.5, 0.5, 0.0,
                                0.5, 0.5, 0.0,
                                -0.5, -0.5, 0.0,
                                0.5, -0.5, 0.0
                                ]);
                            
    //... Color para el cuadrado
    cuadradoColor = colorCuadrado([1.0, 0.0, 0.0,1.0]);  
    
}




var mvMatriz = mat4.create();
var pMatriz = mat4.create();
function modificarMatrizUniforme() {
    gl.uniformMatrix4fv(programaShader.pMatrizUniforme, false, pMatriz);
    gl.uniformMatrix4fv(programaShader.mvMatrizUniforme, false, mvMatriz);
}

var rotartriangulo=0;
var trasladartriangulo = -3.1;
var Escalacuadrado= 0.5;
var rojo=0.0;



function graficotriangulo(triangulo1,triangulo1Color){
    
    mat4.identity(mvMatriz);
    mat4.translate(mvMatriz, [0.0, 0.1, -7.0]);
    mat4.rotate(mvMatriz, rotartriangulo*Math.PI/180, [1, 0, 0]);
    mat4.scale(mvMatriz, [0.5, 0.5, 1.0]);
    gl.bindBuffer(gl.ARRAY_BUFFER, triangulo1);
    gl.vertexAttribPointer(programaShader.atribPosVertice, triangulo1.itemTam, gl.FLOAT, false, 0, 0);
    //... Aplicando color
    gl.bindBuffer(gl.ARRAY_BUFFER, triangulo1Color);
    gl.vertexAttribPointer(programaShader.vertColorAtributo, triangulo1Color.itemTam, gl.FLOAT, false, 0, 0);
    //... Fin aplicando color
    modificarMatrizUniforme();
    gl.drawArrays(gl.TRIANGLES, 0, triangulo1.numItems);
    
}

function graficopoligono(cuadrado,cuadradoColor){
    
    mat4.identity(mvMatriz);
    mat4.translate(mvMatriz, [-0.5, -1.4, -7.0]);
    mat4.rotate(mvMatriz, rotartriangulo*Math.PI/180, [0, 1, 0]);
    mat4.scale(mvMatriz, [Escalacuadrado,Escalacuadrado , 1.0]);
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
    //... dibujando el triangulo
    
    
     
     graficotriangulo(triangulo,trianguloColor) ; 
     graficopoligono(cuadrado,cuadradoColor);
   
    
   
  
}
var ultimoTiempo = 0;
var caso=1;
var colorcr=1;

function animacion() {
    var tiempoAhora = new Date().getTime();
    if (ultimoTiempo != 0) {
        var lapso = tiempoAhora - ultimoTiempo;
        rotartriangulo += (90 * lapso) / 1000.0;
        
        trasladartriangulo=trasladartriangulo+0.01;
        
        switch (colorcr) {
        case 1:
            
            
            cuadradoColor = colorCuadrado([1.0, 0.0, 0.0,1.0]);

          break;
        case 2:
            
             cuadradoColor = colorCuadrado([0.0, 1.0, 0.0,1.0]);
          break;
        case 3:
            
            cuadradoColor = colorCuadrado([0.0, 0.0, 1.0,1.0]);
            
            
          break;
      }
        
        switch (caso) {
        case 1:
            
            
            Escalacuadrado=Escalacuadrado+0.01;
            
             if( Escalacuadrado>=1.5){
             
                caso=2;
                colorcr=colorcr+1;
            }
             

          break;
        case 2:
            Escalacuadrado=Escalacuadrado-0.01;
            if( Escalacuadrado<=0.0){
             
                caso=1;
                colorcr=colorcr+1;
            }
             
          break;

      }
      
       
      
      if(colorcr>=4){
          colorcr=1;
          
      }
      
    

       
    }
    if(rotartriangulo>=360)
        rotartriangulo= 0;
    ultimoTiempo = tiempoAhora;
   

    if(trasladartriangulo>=3.0){
        trasladartriangulo= -3.0;
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