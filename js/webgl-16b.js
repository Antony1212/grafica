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
//... se modifica puntos poligono por tratarse de 3D
function puntosPoligono(pPuntos, pArista){
    var pol = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pol);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pPuntos), gl.STATIC_DRAW);
    pol.itemTam = 3;
    pol.numItems = pArista;
    return pol;
}
function colorPoligono(pColor, pVertice, pArista){
    var polC = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, polC);
    var color= [];
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
    /* Definimos el element array buffer (n??tese la diferencia del primer par??metro
     * en el gl.bindBuffer y el gl.bufferData): */
    var polI = gl.createBuffer(); //... nuevo
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, polI);
    //... triangulamos cada cara del poligono
    /* Cada n??mero en este buffer corresponde al ??ndice de los buffers de v??rtices
     * y colores que debe utilizar para dibujar cada tri??ngulo (hay que dibujar
     * seis caras, necesitamos 12 tri??ngulos (buffer de elementos del c??digo anterior).
     * Ese ??ndice no es exactamente el ??ndice del array del buffer (buffer[indice]),
     * si no el ??ndice al elemento que contiene, que en el caso del buffer de v??rtices
     * corresponde a 3 posiciones consecutivas en el array (coordenadas X, Y y Z),
     * y a cuatro posiciones consecutivas en el array de colores (un color ocupaba
     * 4 n??meros).
     * Por ejemplo, el primer tri??ngulo usar?? los elementos 0, 1 y 2 contenidos
     * tanto en el buffer de v??rtices como en el de colores, para pintar el primer
     * tri??ngulo, y los elementos 0, 2 y 3 para el segundo.
     * Ambos juntos forman la primera cara del cubo. Repetimos lo mismo con todos
     * los tri??ngulos, y obtenemos un perfecto cubo.
     * Ahora ya conoces c??mo crear escenas usando objetos 3D, y tambi??n a reusar
     * los v??rtices que has especificado en los buffers (array buffers) usando el
     * tipo element array buffer y drawElements.*/
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(pIndex), gl.STATIC_DRAW);
    polI.itemTam = 1;
    polI.numItems = pNumI;
    return polI;
}
/* Definimos los buffers de posiciones de v??rtices y colores con los nuevos nombres
 * que les hemos puesto, y a??adimos el nuevo tipo de buffer necesario para dibujar
 * el cubo de forma eficiente. */
var tri1, tri1C;
var cua1, cua1C, cua1I; //... nuevo
function iniciarBuffers() {
    //... puntos de la piramide
    tri1= puntosPoligono([// frente
	  0.0,  0.5,  1.0,
	  -1.5, -1.0,  1.0,
	  1.5, -1.0,  1.0,
	  // cara derecha
	  0.0,  0.5,  1.0,
	  1.5, -1.0,  1.0,
	  1.5, -1.0, -1.0,
          // cara derecha2
	  0.0,  0.5,  -1.0,
	  1.5, -1.0,  -1.0,
	  0.0, 0.5, 1.0,
	  // cara atras
	  0.0,  0.5,  -1.0,
	  1.5, -1.0, -1.0,
	  -1.5, -1.0, -1.0,
	  // cara izquierda
	  0.0,  0.5,  1.0,
	  -1.5, -1.0, -1.0,
	  -1.5, -1.0,  1.0,
      // cara izquierda2
          0.0,  0.5,  -1.0,
	  -1.5, -1.0, -1.0,
	  0.0, 0.5,  1.0
	  
	  
    ], 18);
    //... Color del triangulo
    tri1C= colorPoligono([
        [1.0, 0.0, 0.0, 1.0], // frente
        [1.0, 0.0, 1.0, 1.0], // cara derecha
        [1.0, 0.0, 1.0, 1.0], // cara derecha2
        [1.0, 1.0, 0.0, 1.0], // atras
        [0.0, 1.0, 0.0, 1.0], // cara izquierda
        [0.0, 1.0, 0.0, 1.0] // cara izquierda
        
    ], 3, 18);
    //... puntos del cubo
    cua1= puntosPoligono([// frente
	  -1.0, -1.0,  1.0,
	  1.0, -1.0,  1.0,
	  1.5,  1.0,  1.0,
	  -1.5,  1.0,  1.0,
	  // cara atras
	  -1.0, -1.0, -1.0,
	  -1.5,  1.0, -1.0,
	  1.5,  1.0, -1.0,
	  1.0, -1.0, -1.0,
	  // cara superior
	  -1.5,  1.0, -1.0,
	  -1.5,  1.0,  1.0,
	  1.5,  1.0,  1.0,
	  1.5,  1.0, -1.0,
	  // cara inferior
	  -1.0, -1.0, -1.0,
	  1.0, -1.0, -1.0,
	  1.0, -1.0,  1.0,
	  -1.0, -1.0,  1.0,
	  // cara derecha
	  1.0, -1.0, -1.0,
	  1.5,  1.0, -1.0,
	  1.5,  1.0,  1.0,
	  1.0, -1.0,  1.0,
	  // cara izquierda
	  -1.0, -1.0, -1.0,
	  -1.0, -1.0,  1.0,
	  -1.5,  1.0,  1.0,
	  -1.5,  1.0, -1.0], 24);
    //... Color del cuadrado
    cua1C= colorPoligono([
        [1.0, 0.0, 0.0, 1.0], // frente
        [1.0, 1.0, 0.0, 1.0], // cara atras
        [1.0, 1.0, 0.0, 1.0], // cara superior
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
function poligono(pPoligono, pPoligonoC, pPoligonoI, pTraslacion, pAngulo, pEjeRotacion, pEscala){
    mat4.identity(mvMatriz);
    mat4.translate(mvMatriz, pTraslacion);
    mat4.rotate(mvMatriz, pAngulo, pEjeRotacion);
    mat4.scale(mvMatriz, pEscala);
    gl.bindBuffer(gl.ARRAY_BUFFER, pPoligono);
    gl.vertexAttribPointer(programaShader.atribPosVertice, pPoligono.itemTam, gl.FLOAT, false, 0, 0);
    //... Aplicando color
    gl.bindBuffer(gl.ARRAY_BUFFER, pPoligonoC);
    gl.vertexAttribPointer(programaShader.vertColorAtributo, pPoligonoC.itemTam, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, pPoligonoI);
    modificarMatrizUniforme();
    //... cambiado
    gl.drawElements(gl.TRIANGLES, pPoligonoI.numItems, gl.UNSIGNED_SHORT, 0); //... nuevo
}
var rotarTri = 0, rotarCua= 0, escalaCua= 0.1;
function dibujarEscena() {
    gl.viewport(0, 0, gl.puertoVistaAncho, gl.puertoVistaAlto);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    mat4.perspective(45, gl.puertoVistaAncho / gl.puertoVistaAlto, 0.1, 100.0, pMatriz);
    //... dibujando el triangulo
    triangulo(tri1, tri1C, [0.0, 2.0, -10.0], rotarTri*Math.PI/180, [0, 1, 0], [1.0, 1.0, 1.0]);
    //... dibujando el cuadrado
    poligono(cua1, cua1C, cua1I, [0.0, 0.0, -10.0], rotarCua*Math.PI/180, [0,1,0], [1.0, 1.0, 1.0]);
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