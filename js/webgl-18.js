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


function puntosPoligono(pPuntos, pArista){
    var pol = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pol);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pPuntos), gl.STATIC_DRAW);
    pol.itemTam = 3;
    pol.numItems = pArista;
    return pol;
}

function colorPoligono(pColor, pVertice){
    var polC = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, polC);
    color= [];
    for (var i= 0; i<pVertice; i++){
        color=color.concat(pColor);
        }
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW);
    polC.itemTam = 4;
    polC.numItems = pVertice;
    return polC;
    
}
function colorPoligono3D(pColor, pVertice, pArista){
    var polC = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, polC);
    var color =[];
    for (var i= 0 in pColor){
        var c= pColor[i];
        for(var j= 0; j<pVertice; j++){
            color= color.concat(c);
        } 
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW);
    polC.itemTam = 4;
    polC.numItems = pArista;
    return polC;
}
function indexPoligono(pIndex, pNumI){
    var polI = gl.createBuffer(); 
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, polI);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(pIndex), gl.STATIC_DRAW);
    polI.itemTam = 1;
    polI.numItems = pNumI;
    return polI;
}

var cua1, cua1C, cua1I; 
var cua2, cua2C, cua2I;
var cua3, cua3C, cua3I;
var cua4, cua4C, cua4I;
var cua5, cua5C, cua5I;
function iniciarBuffers() {
    
    cua1= puntosPoligono([// frente ACDB
	
	  // cara superior AGHB
	  -1.5, 0.5, 0.0,
	  1.5,  0.5,  0.0,
	  1.5,  -0.5,  0.0,
	  -1.5,  -0.5, 0.0,
	  // cara inferior BHFD
	 -1.5, 0.5, 1.0,
	  1.5,  0.5,  1.0,
	  1.5,  -0.5,  1.0,
	  -1.5,  -0.5, 1.0,
	  // cara derecha DFEC
	  -1.5, -0.5, 1.0,
	  1.5,-0.5, 1.0,
	  1.5,-0.5,  0.0,
	  -1.5, -0.5,  0.0,
	  // cara izquierda CEGA
	  1.5, -0.5, 1.0,
	  1.5,0.5, 1.0,
	  1.5,0.5,  0.0,
	  1.5, -0.5,  0.0,
           // cara izquierda CEGA
          1.5, 0.5, 1.0,
	  -1.5,0.5, 1.0,
	  -1.5,0.5,  0.0,
	  1.5, 0.5,  0.0,
           // cara izquierda CEGA
          -1.5, 0.5, 1.0,
	  -1.5,-0.5, 1.0,
	  -1.5,-0.5,  0.0,
	  -1.5, 0.5,  0.0
      ], 24);
    //... Color del cuadrado
    
    
    cua1C= colorPoligono3D([
        
[1.0, 0.0, 0.0, 1.0], // frente
        [1.0, 1.0, 0.0, 1.0], // cara atras
        [1.0, 0.0, 1.0, 1.0], // cara superior
        [1.0, 0.5, 0.5, 1.0], // cara inferior
        [1.0, 0.0, 1.0, 1.0], // cara derecha
        [0.0, 1.0, 0.0, 1.0] // cara izquierda
    ], 4, 24);
    cua1I= indexPoligono([
        0, 1, 2,     0, 2, 3,    // frente
        4, 5, 6,     4, 6, 7,    // cara atras
        8, 9, 10,    8, 10, 11,  // cara superior
        12, 13, 14,  12, 14, 15, // cara inferior
        16, 17, 18,  16, 18, 19, // cara derecha
        20, 21, 22,  20, 22, 23  // cara izquierda
    ], 36);
    //CUADRADO 2
         cua2= puntosPoligono([// frente ACDB
	
	  // cara superior AGHB
	  -1.5, -0.5, -0.5,
	  -1.5,  0.5,  -0.5,
	  1.5, 0.5,  -0.5,
	  1.5,  -0.5, -0.5,
	  // cara inferior BHFD
	   -1.5, -0.5, 0.5,
	  -1.5,  0.5,  0.5,
	  1.5, 0.5,  0.5,
	  1.5,  -0.5, 0.5,
	  // cara derecha DFEC
	  -1.5, -0.5, -0.5,
	  -1.5,-0.5, 0.5,
	  1.5,-0.5,  0.5,
	  1.5, -0.5,  -0.5,
	  // cara izquierda CEGA
	  1.5, -0.5, 0.5,
	  1.5,1.5, 0.5,
	  1.5,1.5,  -0.5,
	  1.5, -0.5,  -0.5,
           // cara izquierda CEGA
          1.5, 1.5, 0.5,
	  0.5,1.5, 0.5,
	  0.5,1.5,  -0.5,
	  1.5, 1.5,  -0.5,
           // cara izquierda CEGA
          0.5, 1.5, 0.5,
	  0.5,0.5, 0.5,
	  0.5,0.5,  -0.5,
	  0.5, 1.5,  -0.5,
          // cara izquierda CEGA
          0.5, 0.5, 0.5,
	  -1.5,0.5, 0.5,
	  -1.5,0.5,  -0.5,
	  0.5, 0.5,  -0.5,
          // cara izquierda CEGA
          -1.5, 0.5, 0.5,
	  -1.5,-0.5, 0.5,
	  -1.5,-0.5,  -0.5,
	  -1.5, 0.5,  -0.5,
          // cara izquierda CEGA
          1.5, 0.5, 0.5,
	  0.5,0.5, 0.5,
	  0.5,1.5,  0.5,
	  1.5, 1.5,  0.5,
          // cara izquierda CEGA
          1.5, 0.5, -0.5,
	  0.5,0.5, -0.5,
	  0.5,1.5,  -0.5,
	  1.5, 1.5,  -0.5
          
      ], 60);
    //... Color del cuadrado
    
    
    cua2C= colorPoligono3D([
        
[1.0, 0.0, 0.0, 1.0], // frente
        [1.0, 1.0, 0.0, 1.0], // cara atras
        [1.0, 0.0, 1.0, 1.0], // cara superior
        [1.0, 0.5, 0.5, 1.0], // cara inferior
        [1.0, 0.0, 1.0, 1.0], // cara derecha
        [0.0, 1.0, 0.0, 1.0], // cara izquierda
        [0.0, 1.0, 0.0, 1.0] // cara izquierda
    ], 4, 28);
    cua2I= indexPoligono([
        0, 1, 2,     0, 2, 3,    // frente
        4, 5, 6,     4, 6, 7,    // cara atras
        8, 9, 10,    8, 10, 11,  // cara superior
        12, 13, 14,  12, 14, 15, // cara inferior
        16, 17, 18,  16, 18, 19, // cara derecha
        20, 21, 22,  20, 22, 23 , // cara izquierda
        24, 25, 26,  24, 26, 27,  // cara izquierda
        28, 29, 30,  28, 30, 31 , // cara izquierda
        32, 33, 34,  32, 34, 35 , // cara izquierda
        36, 37, 38,  36, 38, 39  // cara izquierda
    ], 60);
    //CUADRADO 2
         cua3= puntosPoligono([// frente ACDB
	
	  // cara superior AGHB
	  1.0, 1.0, -0.5,
	  1.0,  -1.0,  -0.5,
	  -1.0, -1.0,  -0.5,
	  -1.0,  1.0, -0.5,
	  // cara inferior BHFD
	    1.0, 1.0, 0.5,
	  1.0,  -1.0,  0.5,
	  -1.0, -1.0,  0.5,
	  -1.0,  1.0, 0.5,
	  // cara derecha DFEC
	  1.0, 1.0, 0.5,
	  -1.0,1.0, 0.5,
	  -1.0,1.0,  -0.5,
	  1.0, 1.0,  -0.5,
	  // cara izquierda CEGA
	 -1.0, 1.0, 0.5,
	  -1.0,-1.0, 0.5,
	  -1.0,-1.0,  -0.5,
	  -1.0, 1.0,  -0.5,
           // cara izquierda CEGA
         -1.0, -1.0, 0.5,
	  1.0,-1.0, 0.5,
	  1.0,-1.0,  -0.5,
	  -1.0, -1.0,  -0.5,
           // cara izquierda CEGA
          1.0, -1.0, 0.5,
	  1.0,1.0, 0.5,
	  1.0,1.0,  -0.5,
	  1.0, -1.0,  -0.5
         
          
      ], 24);
    //... Color del cuadrado
    
    
    cua3C= colorPoligono3D([
        
[1.0, 0.0, 0.0, 1.0], // frente
        [1.0, 1.0, 0.0, 1.0], // cara atras
        [1.0, 0.0, 1.0, 1.0], // cara superior
        [1.0, 0.5, 0.5, 1.0], // cara inferior
        [1.0, 0.0, 1.0, 1.0], // cara derecha
        [0.0, 1.0, 0.0, 1.0], // cara izquierda
        [0.0, 1.0, 0.0, 1.0] // cara izquierda
    ], 4, 28);
    cua3I= indexPoligono([
        0, 1, 2,     0, 2, 3,    // frente
        4, 5, 6,     4, 6, 7,    // cara atras
        8, 9, 10,    8, 10, 11,  // cara superior
        12, 13, 14,  12, 14, 15, // cara inferior
        16, 17, 18,  16, 18, 19, // cara derecha
        20, 21, 22,  20, 22, 23 , // cara izquierda
        24, 25, 26,  24, 26, 27,  // cara izquierda
        28, 29, 30,  28, 30, 31 , // cara izquierda
        32, 33, 34,  32, 34, 35 , // cara izquierda
        36, 37, 38,  36, 38, 39  // cara izquierda
    ], 60);
     //CUADRADO 2
         cua4= puntosPoligono([// frente ACDB
	
	  // cara superior AGHB
1,0.5,0,
1,0.5,-1,
-1,0.5,-1,
-1,0.5,0,

    
0,0.5,1,
0,0.5,0,
-2,0.5,0,
-2,0.5,1,

  // cara atras

  1,-0.5,0,
  1,-0.5,-1,
  -1,-0.5,-1,
  -1,-0.5,0,
  
  0,-0.5,1,
  0,-0.5,0,
  -2,-0.5,0,
  -2,-0.5,1,   
  
  
  
  
  //cara superior

  0,-0.5,1,
  0,0.5,1,
  -2,0.5,1,
  -2,-0.5,1,

  1,-0.5,0,
  1,0.5,0,
  0,0.5,0,
  0,-0.5,0,
  
  

 
  1,0.5,-1,
  1,-0.5,-1,
  -1,-0.5,-1,
  -1,0.5,-1,

  -1,0.5,0,
  -1,-0.5,0,
  -2,-0.5,0,
  -2,0.5,0,
  
  
  1,-0.5,0,
  1,0.5,0,
  1,0.5,-1,
  1,-0.5,-1,
 
  0,-0.5,1,
  0,0.5,1,
  0,0.5,0,
  0,-0.5,0,
 
  -2,0.5,1,
  -2,-0.5,1,
  -2,-0.5,0,
  -2,0.5,0,

  -1,0.5,0,
  -1,-0.5,0,
  -1,-0.5,-1,
  -1,0.5,-1
         
          
      ], 51);
    //... Color del cuadrado
    
    
    cua4C= colorPoligono3D([
        
[1.0, 0.0, 0.0, 1.0], // frente
        [1.0, 1.0, 0.0, 1.0], // cara atras
        [1.0, 0.0, 1.0, 1.0], // cara superior
        [1.0, 0.5, 0.5, 1.0], // cara inferior
        [1.0, 0.0, 1.0, 1.0], // cara derecha
        [0.0, 1.0, 0.0, 1.0], // cara izquierda
        [0.0, 1.0, 0.0, 1.0] // cara izquierda
    ], 4, 28);
    cua4I= indexPoligono([
        0, 1, 2,     0, 2, 3,    // frente
        4, 5, 6,     4, 6, 7,    // cara atras
        8, 9, 10,    8, 10, 11,  // cara superior
        12, 13, 14,  12, 14, 15, // cara inferior
        16, 17, 18,  16, 18, 19, // cara derecha
        20, 21, 22,  20, 22, 23 , // cara izquierda
        24, 25, 26,  24, 26, 27,  // cara izquierda
        28, 29, 30,  28, 30, 31 , // cara izquierda
        32, 33, 34,  32, 34, 35 , // cara izquierda
        36, 37, 38,  36, 38, 39  // cara izquierda
    ], 60);
    //CUADRADO 2
         cua5= puntosPoligono([// frente ACDB
	
	  // cara superior AGHB
-1.5,-1.0,0.5,
-1.5,0.0,0.5,
1.5,0.0,0.5,
1.5,-1.0,0.5,

    
-1.5,-1.0,-0.5,
-1.5,0.0,-0.5,
1.5,0.0,-0.5,
1.5,-1.0,-0.5,

  // cara atras

 -1.5,-1.0,0.5,
1.5,-1.0,0.5,
1.5,-1.0,-0.5,
-1.5,-1.0,-0.5,
  
   1.5,-1.0,0.5,
1.5,0.0,0.5,
1.5,0.0,-0.5,
1.5,-1.0,-0.5,  

  //cara superior

  1.5,0.0,0.5,
0.5,0.0,0.5,
0.5,0.0,-0.5,
1.5,0.0,-0.5, 

  1,-0.5,0,
  1,0.5,0,
  0,0.5,0,
  0,-0.5,0,
  
  

 
  1,0.5,-1,
  1,-0.5,-1,
  -1,-0.5,-1,
  -1,0.5,-1,

  -1,0.5,0,
  -1,-0.5,0,
  -2,-0.5,0,
  -2,0.5,0,
  
  
  

  1,-0.5,0,
  1,0.5,0,
  1,0.5,-1,
  1,-0.5,-1,
 
  

  0,-0.5,1,
  0,0.5,1,
  0,0.5,0,
  0,-0.5,0,
  
 

  
  
  -2,0.5,1,
  -2,-0.5,1,
  -2,-0.5,0,
  -2,0.5,0,

  -1,0.5,0,
  -1,-0.5,0,
  -1,-0.5,-1,
  -1,0.5,-1,
         
          
      ], 51);
    //... Color del cuadrado
    
    
    cua5C= colorPoligono3D([
        
[1.0, 0.0, 0.0, 1.0], // frente
        [1.0, 1.0, 0.0, 1.0], // cara atras
        [1.0, 0.0, 1.0, 1.0], // cara superior
        [1.0, 0.5, 0.5, 1.0], // cara inferior
        [1.0, 0.0, 1.0, 1.0], // cara derecha
        [0.0, 1.0, 0.0, 1.0], // cara izquierda
        [0.0, 1.0, 0.0, 1.0] // cara izquierda
    ], 4, 28);
    cua5I= indexPoligono([
        0, 1, 2,     0, 2, 3,    // frente
        4, 5, 6,     4, 6, 7,    // cara atras
        8, 9, 10,    8, 10, 11,  // cara superior
        12, 13, 14,  12, 14, 15, // cara inferior
        16, 17, 18,  16, 18, 19, // cara derecha
        20, 21, 22,  20, 22, 23 , // cara izquierda
        24, 25, 26,  24, 26, 27,  // cara izquierda
        28, 29, 30,  28, 30, 31 , // cara izquierda
        32, 33, 34,  32, 34, 35 , // cara izquierda
        36, 37, 38,  36, 38, 39  // cara izquierda
    ], 60);
  
}

var mvMatriz = mat4.create();
var pMatriz = mat4.create();
function modificarMatrizUniforme() {
    gl.uniformMatrix4fv(programaShader.pMatrizUniforme, false, pMatriz);
    gl.uniformMatrix4fv(programaShader.mvMatrizUniforme, false, mvMatriz);
}
function triangulo(pTriangulo, pTrianguloC, pTraslacion, pAngulo, pEjeRotacion, pEscala){
    mat4.identity(mvMatriz);
    mat4.translate(mvMatriz, pTraslacion);
    mat4.rotate(mvMatriz, pAngulo, pEjeRotacion);
    mat4.scale(mvMatriz, pEscala);
    gl.bindBuffer(gl.ARRAY_BUFFER, pTriangulo);
    gl.vertexAttribPointer(programaShader.atribPosVertice, pTriangulo.itemTam, gl.FLOAT, false, 0, 0);
    //... Aplicando color
    gl.bindBuffer(gl.ARRAY_BUFFER, pTrianguloC);
    gl.vertexAttribPointer(programaShader.vertColorAtributo, pTrianguloC.itemTam, gl.FLOAT, false, 0, 0);
    //... Fin aplicando color
    modificarMatrizUniforme();
    gl.drawArrays(gl.TRIANGLES, 0, pTriangulo.numItems);
}
function poligono(pPoligono, pPoligonoC,pTraslacion, pAngulo, pEjeRotacion, pEscala){
    mat4.identity(mvMatriz);
    mat4.translate(mvMatriz, pTraslacion);
    mat4.rotate(mvMatriz, pAngulo, pEjeRotacion);
    mat4.scale(mvMatriz, pEscala);
    gl.bindBuffer(gl.ARRAY_BUFFER, pPoligono);
    gl.vertexAttribPointer(programaShader.atribPosVertice, pPoligono.itemTam, gl.FLOAT, false, 0, 0);
    //... Aplicando color
    gl.bindBuffer(gl.ARRAY_BUFFER, pPoligonoC);
    gl.vertexAttribPointer(programaShader.vertColorAtributo, pPoligonoC.itemTam, gl.FLOAT, false, 0, 0);
     //... Fin aplicando color
    modificarMatrizUniforme();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, pPoligono.numItems);
}
function poligono3D(pPoligono, pPoligonoC, pPoligonoI, pTraslacion, pAngulo, pEjeRotacion, pEscala){
    mat4.identity(mvMatriz);
    mat4.translate(mvMatriz, pTraslacion);
    mat4.rotate(mvMatriz, pAngulo, pEjeRotacion);
    mat4.scale(mvMatriz, pEscala);
    gl.bindBuffer(gl.ARRAY_BUFFER, pPoligono);
    gl.vertexAttribPointer(programaShader.atribPosVertice, pPoligono.itemTam, gl.FLOAT, false, 0, 0);
    //... Aplicando color
    gl.bindBuffer(gl.ARRAY_BUFFER, pPoligonoC);
    gl.vertexAttribPointer(programaShader.vertColorAtributo, pPoligonoC.itemTam, gl.FLOAT, false, 0, 0);
     //... Fin aplicando color
    modificarMatrizUniforme();
    gl.drawElements(gl.TRIANGLES, pPoligonoI.numItems, gl.UNSIGNED_SHORT, 0);
}
var rotarTri = 0, rotarCua= 0, escalaCua= 0.1;
function dibujarEscena() {
    gl.viewport(0, 0, gl.puertoVistaAncho, gl.puertoVistaAlto);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    mat4.perspective(45, gl.puertoVistaAncho / gl.puertoVistaAlto, 0.1, 100.0, pMatriz);
    
    //... dibujando el cuadrado
    poligono3D(cua1, cua1C, cua1I, [-2.0, -2.0, -10.0], rotarCua*Math.PI/180, [0,1, 0], [1.0, 1.0, 1.0]);
    poligono3D(cua2, cua2C, cua2I, [1.0, 1.0, -10.0], rotarCua*Math.PI/180, [0,1, 0], [1.0, 1.0, 1.0]);
     poligono3D(cua3, cua3C, cua3I, [-2.0, 3.0, -10.0], rotarCua*Math.PI/180, [0,1, 0], [1.0, 1.0, 1.0]);
     poligono3D(cua4, cua4C, cua4I, [2.0, -2.0, -10.0], rotarCua*Math.PI/180, [0,1, 0], [1.0, 1.0, 1.0]);
     poligono3D(cua5, cua5C, cua5I, [3.0, 3.0, -10.0], rotarCua*Math.PI/180, [0,1, 0], [1.0, 1.0, 1.0]);
    
}
var ultimoTiempo= 0, signo= 1;
function animacion() {
    var tiempoAhora = new Date().getTime();
    if (ultimoTiempo != 0) {
        var lapso = tiempoAhora - ultimoTiempo;
        rotarTri += (50 * lapso) / 1000.0;
        rotarCua += (50 * lapso) / 1000.0;
        escalaCua += signo*(0.5 * lapso) / 1000.0;
    }
    if(rotarTri>=360)
        rotarTri= 0;
    if(rotarCua>=360)
        rotarCua= 0;
    if(escalaCua>=1.0 || escalaCua<=0.1){
        signo= signo*(-1);
    }
    ultimoTiempo = tiempoAhora;
}
function mover(){
    dibujarEscena();
    animacion();
    requestAnimFrame(mover);
}
function webGLEjecutar() {
    var canvas = document.getElementById("leccion03-3D");
    iniciarGL(canvas);
    iniciarShaders();
    iniciarBuffers();
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    mover();
}