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
var triangulo, trianguloColor;
var cuadradoPosVertBuffer;
function iniciarBuffers() {
    //... construyendo triangulo
    triangulo= puntosTriangulo([-1.0, 0.0, 0.0, 0.5, 1.0, 00, 2.0, 0.0, 0.0])
    //... 3. Color para el triangulo
   trianguloColor=colorTriangulo([1.0, 0.0, 0.0, 1.0]);
    //... Fin color
    //... construyendo cuadrado
    cuadrado=puntosCuadrado([2.0, 0.0, 0.0,0.0, 0.0, 0.0,2.0, -2.0, 0.0,0.0, -2.0, 0.0]);
    
    //... 3. Color para el cuadrado
    cuadradoColor=colorCuadrado([2.0, 1.0, 0.0, 2.0,0.0, 1.0, 0.0, 2.0,2.0, 1.0, 0.0, 2.0,0.0, 1.0, 0.0, 2.0]);
    
    //... Fin color
    //... aqui aplicar el color para el rectangulo
}
var mvMatriz = mat4.create();
var pMatriz = mat4.create();
function modificarMatrizUniforme() {
    gl.uniformMatrix4fv(programaShader.pMatrizUniforme, false, pMatriz);
    gl.uniformMatrix4fv(programaShader.mvMatrizUniforme, false, mvMatriz);
}
function dibujarEscena() {
    gl.viewport(0, 0, gl.puertoVistaAncho, gl.puertoVistaAlto);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    mat4.perspective(45, gl.puertoVistaAncho / gl.puertoVistaAlto, 0.1, 100.0, pMatriz);
    mat4.identity(mvMatriz);
    //... dibujar triangulo 1
    mat4.translate(mvMatriz, [-0.5, 1.05, -5.0]);
    gl.bindBuffer(gl.ARRAY_BUFFER, triangulo);
    gl.vertexAttribPointer(programaShader.atribPosVertice, triangulo.itemTam, gl.FLOAT, false, 0, 0);
    //... Aplicamos color
    gl.bindBuffer(gl.ARRAY_BUFFER, trianguloColor);
    gl.vertexAttribPointer(programaShader.vertColorAtributo, trianguloColor.itemTam, gl.FLOAT, false, 0, 0);
    //... Fin color
    modificarMatrizUniforme();
    gl.drawArrays(gl.TRIANGLES, 0, triangulo.numItems);
    //... dibujar cuadrado
    mat4.translate(mvMatriz, [-0.5, 1.0, -5.0]);
    gl.bindBuffer(gl.ARRAY_BUFFER, cuadrado);
    gl.vertexAttribPointer(programaShader.atribPosVertice, cuadrado.itemTam, gl.FLOAT, false, 0, 0);
    //... Aplicamos color
    gl.bindBuffer(gl.ARRAY_BUFFER, cuadradoColor);
    gl.vertexAttribPointer(programaShader.vertColorAtributo, cuadradoColor.itemTam, gl.FLOAT, false, 0, 0);
    //... Fin color
    modificarMatrizUniforme();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, cuadrado.numItems);
}
function webGLEjecutar() {
    var canvas = document.getElementById("leccion01-canvas");
    iniciarGL(canvas);
    iniciarShaders();
    iniciarBuffers();
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    dibujarEscena();
}