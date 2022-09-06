	var gl;
	function iniciarGL(canvas) {
		try {
			gl = canvas.getContext("webgl");
			gl.puertoVistaAncho = canvas.width;
			gl.puertoVistaAlto = canvas.height;
		} catch (e) { }
		if (!gl) {
			alert("Perdone, no se pudo inicializar WebGL");
		}
	}
	function conseguirShader(gl, id) {
		var shaderScript = document.getElementById(id);
		if (!shaderScript) { return null; }
		var str = "";
		var k = shaderScript.firstChild;
		while (k) {
			if (k.nodeType == 3) {
				str += k.textContent;
			}
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
	var progShader;
	function iniciarShaders() {
		var fragShader = conseguirShader(gl, "shader-fs");
		var vertShader = conseguirShader(gl, "shader-vs");
		progShader = gl.createProgram();
		gl.attachShader(progShader, vertShader);
		gl.attachShader(progShader, fragShader);
		gl.linkProgram(progShader);
		if (!gl.getProgramParameter(progShader, gl.LINK_STATUS)) {
			alert("Perdone, no pudo inicializarse el shaders");
		}
		gl.useProgram(progShader);
		progShader.atribPosVertice = gl.getAttribLocation(progShader, "aPosVertice");
		gl.enableVertexAttribArray(progShader.atribPosVertice);
		//... nuevo
		progShader.texturaCoordAtributo = gl.getAttribLocation(progShader, "aTexturaCoord");
		gl.enableVertexAttribArray(progShader.texturaCoordAtributo);
		//... nuevo
		progShader.pMatrizUniform = gl.getUniformLocation(progShader, "uPMatriz");
		progShader.mvMatrizUniform = gl.getUniformLocation(progShader, "umvMatriz");
		progShader.muestraUniform = gl.getUniformLocation(progShader, "uMuestra");
	}
	function cargarManijaTextura(pTextura) {
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		
		gl.bindTexture(gl.TEXTURE_2D, pTextura);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, pTextura.imagen);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		
		gl.bindTexture(gl.TEXTURE_2D, null);
	}
	function cargarManija(pDireccion){
		var textura= gl.createTexture();
		textura.imagen = new Image();
		textura.imagen.src= pDireccion;
		textura.imagen.onload = function () {
			cargarManijaTextura(textura);
		};
		return textura;
	}
	var aTextura= Array();
	function iniciarTextura(pNum) {
		for(i= 0; i<pNum; i++){
			aTextura.push(cargarManija("img/nehe"+i+".gif"));
		}
	}
	var mvMatriz = mat4.create();
	var pMatriz = mat4.create();
	function modificarMatrizUniforme() {
		gl.uniformMatrix4fv(progShader.pMatrizUniform, false, pMatriz);
		gl.uniformMatrix4fv(progShader.mvMatrizUniform, false, mvMatriz);
	}
	function sexagRad(angulo) {
		return angulo * Math.PI / 180;
	}
	function puntosPoligono(pPuntos, pVertice){
		//... esta funcion trabaja tambien para 3D
		var pol = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, pol);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pPuntos), gl.STATIC_DRAW);
		pol.itemTam = 3;
		//... si los puntos fuesen 3D habria que considerar aristas
		pol.numItems = pVertice;
		return pol;
	}
	function indexPoligono(pIndex, pNumI){
		var polI = gl.createBuffer(); //... nuevo
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, polI);
		//... triangulamos cada cara del poligono
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(pIndex), gl.STATIC_DRAW);
		polI.itemTam = 1;
		polI.numItems = pNumI;
		return polI;
	}
	function coordenadaTextura(pCoord, pNumC){
		var polC = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, polC);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pCoord), gl.STATIC_DRAW);
		polC.itemTam = 2;
		polC.numItems = pNumC;
		return polC;
	}

var  lado,ladotex,ladoI;
var cub1, cub1T, cub1I;
var lad1, lad1T, lad1I,lad2, lad2T, lad2I,lad3, lad3T, lad3I,lad4, lad4T, lad4I,lad5, lad5T, lad5I,lad6, lad6T, lad6I;
var lad7, lad7T, lad7I,lad8, lad8T, lad8I,lad9, lad9T, lad9I,lad10, lad10T, lad10I,lad11, lad11T, lad11I,lad12, lad12T, lad12I;
var rec1,rec1I,rec1T,rec2,rec2I,rec2T,rec3,rec3I,rec3T,rec4,rec4I,rec4T;
function iniciarBuffers() {
	//... puntos del cubo

	//cabeza


	lad1= puntosPoligono([0.5, 0.5, 0.5   , -0.5, 0.5, 0.5,   -0.5, -0.5, 0.5,    0.5, -0.5, 0.5], 4);
	lad2= puntosPoligono([0.5, 0.5, -0.5   , -0.5, 0.5, -0.5,   -0.5, -0.5, -0.5,    0.5, -0.5, -0.5], 4);
	lad3= puntosPoligono([0.5, 0.5, -0.5   , -0.5, 0.5, -0.5,   -0.5, 0.5, 0.5,    0.5, 0.5, 0.5], 4);
	lad4= puntosPoligono([0.5, -0.5, 0.5   , 0.5, -0.5, -0.5,   0.5, 0.5, -0.5,    0.5, 0.5, 0.5], 4);
	lad5= puntosPoligono([-0.5, 0.5, 0.5   , -0.5, -0.5, 0.5,   -0.5, -0.5, -0.5,    -0.5, 0.5, -0.5], 4);
	lad6= puntosPoligono([-0.5, -0.5, 0.5   , 0.5, -0.5, 0.5,   0.5, -0.5, -0.5,    -0.5, -0.5, -0.5], 4);

	lad1T= coordenadaTextura([0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0], 4);
	lad2T= coordenadaTextura([0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0], 4);
	lad3T= coordenadaTextura([0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0], 4);
	lad4T= coordenadaTextura([0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0], 4);
	lad5T= coordenadaTextura([0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0], 4);
	lad6T= coordenadaTextura([0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0], 4);
	
	lad1I= indexPoligono([0, 1, 2,     0, 2, 3], 6);
	lad2I= indexPoligono([0, 1, 2,     0, 2, 3], 6);
	lad3I= indexPoligono([0, 1, 2,     0, 2, 3], 6);
	lad4I= indexPoligono([0, 1, 2,     0, 2, 3], 6);
	lad5I= indexPoligono([0, 1, 2,     0, 2, 3], 6);
	lad6I= indexPoligono([0, 1, 2,     0, 2, 3], 6);
    // cuerpo
	lad7= puntosPoligono([-1.0, -1.0, -1.0   , 1.0, -1.0, -1.0,   1.0, 1.0, -1.0,    -1.0, 1.0, -1.0], 4);
	lad8= puntosPoligono([-1.0, -1.0, 1.0   , 1.0, -1.0, 1.0,   1.0, 1.0, 1.0,    -1.0, 1.0, 1.0], 4);
	lad9= puntosPoligono([-1.0, -1.0, -1.0   , 1.0, -1.0, -1.0,   1.0, -1.0, 1.0,    -1.0, -1.0, 1.0], 4);
	lad10= puntosPoligono([-1.0, 1.0, -1.0   , -1.0, -1.0, -1.0,   -1.0, -1.0, 1.0,    -1.0, 1.0, 1.0], 4);
	lad11= puntosPoligono([1.0, 1.0, -1.0   , -1.0, 1.0, -1.0,   -1.0, 1.0, 1.0,    1.0, 1.0, 1.0], 4);
	lad12= puntosPoligono([1.0, -1.0, -1.0   , 1.0, 1.0, -1.0,   1.0, 1.0, 1.0,    1.0, -1.0, 1.0], 4);

	lad7T= coordenadaTextura([0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0], 4);
	lad8T= coordenadaTextura([0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0], 4);
	lad9T= coordenadaTextura([0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0], 4);
	lad10T= coordenadaTextura([0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0], 4);
	lad11T= coordenadaTextura([0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0], 4);
	lad12T= coordenadaTextura([0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0], 4);
	
	lad7I= indexPoligono([0, 1, 2,     0, 2, 3], 6);
	lad8I= indexPoligono([0, 1, 2,     0, 2, 3], 6);
	lad9I= indexPoligono([0, 1, 2,     0, 2, 3], 6);
	lad10I= indexPoligono([0, 1, 2,     0, 2, 3], 6);
	lad11I= indexPoligono([0, 1, 2,     0, 2, 3], 6);
	lad12I= indexPoligono([0, 1, 2,     0, 2, 3], 6);
// cuello
    cub1= puntosPoligono([0.2, -0.2, -0.2   , 0.2, 0.2, -0.2,   -0.2, 0.2, -0.2,    -0.2, -0.2, -0.2, 
	   0.2, -0.2, 0.2   , 0.2, 0.2, 0.2,   -0.2, 0.2, 0.2,    -0.2, -0.2, 0.2,
	   0.2, -0.2, -0.2   , 0.2, 0.2, -0.2,   0.2, 0.2, 0.2,    0.2, -0.2, 0.2,
	   0.2, 0.2, -0.2   , -0.2, 0.2, -0.2,   -0.2, 0.2, 0.2,    0.2, 0.2, 0.2,
	   -0.2, 0.2, -0.2   , -0.2, -0.2, -0.2,   -0.2, -0.2, 0.2,    -0.2, 0.2, 0.2,
	   -0.2, -0.2, -0.2   , 0.2, -0.2, -0.2,   0.2, -0.2, 0.2,    -0.2, -0.2, 0.2], 24);
	cub1T= coordenadaTextura([0, 0, 1, 0, 1, 1, 0, 1, // cara frente
		0, 0, 1, 0, 1, 1, 0, 1, // cara atras
		0, 0, 1, 0, 1, 1, 0, 1, // cara superior
		0, 0, 1, 0, 1, 1, 0, 1, // cara inferior
		0, 0, 1, 0, 1, 1, 0, 1, // cara derecha
		0, 0, 1, 0, 1, 1, 0, 1], 24);
	cub1I= indexPoligono([0, 1, 2,     0, 2, 3, // frente
		4, 5, 6,     4, 6, 7,    // cara atras
		8, 9, 10,    8, 10, 11,  // cara superior
		12, 13, 14,  12, 14, 15, // cara inferior
		16, 17, 18,  16, 18, 19, // cara derecha
		20, 21, 22,  20, 22, 23], 36);
//brazoz derecho
rec1= puntosPoligono([-1.4, -1.0, 0.2   , -1.0, -1.0, 0.2,   -1.0, 1.0, 0.2,    -1.4, 1.0, 0.2, 
	-1.4, -1.0, -0.2   , -1.0, -1.0, -0.2,   -1.0, 1.0, -0.2,    -1.4, 1.0, -0.2,
	-1.0, -1.0, 0.2   , -1.0, -1.0, -0.2,   -1.0, 1.0, 0.2,    -1.0, 1.0, 0.2,
	-1.4, -1.0, -0.2   , -1.4, -1.0, 0.2,   -1.4, 1.0, 0.2,    -1.4, 1.0, -0.2,
	-1.4, -1.0, 0.2   , -1.0, -1.0, 0.2,   -1.0, -1.0, -0.2,    -1.4, -1.0, -0.2,
	-1.4, 1.0, 0.2   , -1.0, 1.0, 0.2,   -1.0, 1.0, 0.2,    -1.4, 1.0, -0.2], 24);
 rec1T= coordenadaTextura([0, 0, 1, 0, 1, 1, 0, 1, // cara frente
	 0, 0, 1, 0, 1, 1, 0, 1, // cara atras
	 0, 0, 1, 0, 1, 1, 0, 1, // cara superior
	 0, 0, 1, 0, 1, 1, 0, 1, // cara inferior
	 0, 0, 1, 0, 1, 1, 0, 1, // cara derecha
	 0, 0, 1, 0, 1, 1, 0, 1], 24);
 rec1I= indexPoligono([0, 1, 2,     0, 2, 3, // frente
	 4, 5, 6,     4, 6, 7,    // cara atras
	 8, 9, 10,    8, 10, 11,  // cara superior
	 12, 13, 14,  12, 14, 15, // cara inferior
	 16, 17, 18,  16, 18, 19, // cara derecha
	 20, 21, 22,  20, 22, 23], 36);
	// brazo izquierdo
rec2= puntosPoligono([1.0, -1.0, 0.2   , 1.4, -1.0, 0.2,   1.4, 1.0, 0.2,    -1.0, 1.0, 0.2, 
	1.0, -1.0, -0.2   , 1.4, -1.0, -0.2,   1.4, 1.0, -0.2,    -1.0, 1.0, -0.2, 
	1.4, -1.0, 0.2   , 1.4, -1.0, -0.2,   1.4, 1.0, -0.2,    1.4, 1.0, 0.2, 
	1.0, -1.0, 0.2   , 1.0, -1.0, 0.2,   1.0, 1.0, -0.2,    1.0, 1.0, 0.2, 
	1.0, -1.0, 0.2   , 1.4, -1.0, 0.2,   1.4, -1.0, -0.2,    1.0, -1.0, 0.2, 
	1.0, 1.0, 0.2   , 1.4, 1.0, 0.2,   1.4, 1.0, -0.2,    1.0, 1.0, -0.2 ], 24);
 rec2T= coordenadaTextura([0, 0, 1, 0, 1, 1, 0, 1, // cara frente
	 0, 0, 1, 0, 1, 1, 0, 1, // cara atras
	 0, 0, 1, 0, 1, 1, 0, 1, // cara superior
	 0, 0, 1, 0, 1, 1, 0, 1, // cara inferior
	 0, 0, 1, 0, 1, 1, 0, 1, // cara derecha
	 0, 0, 1, 0, 1, 1, 0, 1], 24);
 rec2I= indexPoligono([0, 1, 2,     0, 2, 3, // frente
	 4, 5, 6,     4, 6, 7,    // cara atras
	 8, 9, 10,    8, 10, 11,  // cara superior
	 12, 13, 14,  12, 14, 15, // cara inferior
	 16, 17, 18,  16, 18, 19, // cara derecha
	 20, 21, 22,  20, 22, 23], 36);
//pierna izquierda
rec3= puntosPoligono([-1.0, -3.0,  0.5,  -0.3, -3.0,  0.5,  -0.3,  -1.0,  0.5, -1.0,  -1.0,  0.5, 
	-0.3, -3.0, 0.5,  -0.3,  -3.0, -0.5,  -0.3,  -1.0, -0.5,  -0.3, -1.0, 0.5,
	-1.0, -3.0, -0.5,  -1.0,  -3.0,  0.5,  -1.0,  -1.0,  0.5,  -1.0,  -1.0, -0.5, 
	-0.3, -3.0, -0.5,  -1.0, -3.0, -0.5,  -1.0, -1.0,  -0.5,  -0.3, -1.0,  -0.5, 
	-1.0, -3.0, -0.5,   -0.3,  -3.0, -0.5,  -0.3,  -3.0,  0.5,  -1.0, -3.0,  0.5, 
	-0.3, -1.0, -0.5,  -1.0, -1.0, -0.5,  -1.0,  -1.0,  0.5, -0.3,  -1.0, 0.5], 24);
 rec3T= coordenadaTextura([0, 0, 1, 0, 1, 1, 0, 1, // cara frente
	 0, 0, 1, 0, 1, 1, 0, 1, // cara atras
	 0, 0, 1, 0, 1, 1, 0, 1, // cara superior
	 0, 0, 1, 0, 1, 1, 0, 1, // cara inferior
	 0, 0, 1, 0, 1, 1, 0, 1, // cara derecha
	 0, 0, 1, 0, 1, 1, 0, 1], 24);
 rec3I= indexPoligono([0, 1, 2,     0, 2, 3, // frente
	 4, 5, 6,     4, 6, 7,    // cara atras
	 8, 9, 10,    8, 10, 11,  // cara superior
	 12, 13, 14,  12, 14, 15, // cara inferior
	 16, 17, 18,  16, 18, 19, // cara derecha
	 20, 21, 22,  20, 22, 23], 36);
// pierna derecha
rec4= puntosPoligono([0.3, -3.0,  0.5,  1.0, -3.0,  0.5,  1.0,  -1.0,  0.5, 0.3,  -1.0,  0.5, 
	1.0, -3.0, 0.5,  1.0,  -3.0, -0.5,  1.0,  -1.0, -0.5,  1.0, -1.0, 0.5,
	0.3, -3.0, -0.5,  0.3,  -3.0,  0.5,  0.3,  -1.0,  0.5,  0.3,  -1.0, -0.5, 
	1.0, -3.0, -0.5,  0.3, -3.0, -0.5,  0.3, -1.0,  -0.5,  1.0, -1.0,  -0.5, 
	0.3, -3.0, -0.5,   1.0,  -3.0, -0.5,  1.0,  -3.0,  0.5,  0.3, -3.0,  0.5, 
	1.0, -1.0, -0.5,  0.3, -1.0, -0.5,  0.3,  -1.0,  0.5, 1.0,  -1.0, 0.5], 24);
 rec4T= coordenadaTextura([0, 0, 1, 0, 1, 1, 0, 1, // cara frente
	 0, 0, 1, 0, 1, 1, 0, 1, // cara atras
	 0, 0, 1, 0, 1, 1, 0, 1, // cara superior
	 0, 0, 1, 0, 1, 1, 0, 1, // cara inferior
	 0, 0, 1, 0, 1, 1, 0, 1, // cara derecha
	 0, 0, 1, 0, 1, 1, 0, 1], 24);
 rec4I= indexPoligono([0, 1, 2,     0, 2, 3, // frente
	 4, 5, 6,     4, 6, 7,    // cara atras
	 8, 9, 10,    8, 10, 11,  // cara superior
	 12, 13, 14,  12, 14, 15, // cara inferior
	 16, 17, 18,  16, 18, 19, // cara derecha
	 20, 21, 22,  20, 22, 23], 36);
}
function poligono3D(pPol, pPolI, pPolT, pText, pTras, pAng1, pEje1, pAng2, pEje2, pAng3, pEje3, pEsc){
	mat4.identity(mvMatriz);
	mat4.translate(mvMatriz, pTras);
	mat4.rotate(mvMatriz, sexagRad(pAng1), pEje1);
    mat4.rotate(mvMatriz, sexagRad(pAng2), pEje2);
    mat4.rotate(mvMatriz, sexagRad(pAng3), pEje3);
	mat4.scale(mvMatriz, pEsc);
	//... puntos
    gl.bindBuffer(gl.ARRAY_BUFFER, pPol);
    gl.vertexAttribPointer(progShader.atribPosVertice, pPol.itemTam, gl.FLOAT, false, 0, 0);
    //... textura
    gl.bindBuffer(gl.ARRAY_BUFFER, pPolT);
    gl.vertexAttribPointer(progShader.texturaCoordAtributo, pPolT.itemTam, gl.FLOAT, false, 0, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, pText);
    gl.uniform1i(progShader.muestraUniform, 0);
    //... index
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, pPolI);
    modificarMatrizUniforme();
    gl.drawElements(gl.TRIANGLES, pPolI.numItems, gl.UNSIGNED_SHORT, 0);
}
var xRo = 0, yRo = 0, zRo = 0;
var xRot = 0, yRot = 0, zRot = 0;
var  velX= 0, velY= 0,  velZ = 0, coordZ= -10, enbudo= 5;
// https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API/Cameras
function dibujarEscena() {
	gl.viewport(0, 0, gl.puertoVistaAncho, gl.puertoVistaAlto);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    mat4.perspective(45, gl.puertoVistaAncho / gl.puertoVistaAlto, 0.1, 100.0, pMatriz);
// cara
	poligono3D(lad1, lad1I, lad1T, aTextura[0], [0.0, 1.7, coordZ], xRot, [1, 0, 0], yRot, [0, 1, 0], zRot, [0, 0, 1], [1, 1, 1]);
	poligono3D(lad2, lad1I, lad1T, aTextura[1], [0.0, 1.7, coordZ], xRot, [1, 0, 0], yRot, [0, 1, 0], zRot, [0, 0, 1], [1, 1, 1]);
	poligono3D(lad3, lad3I, lad3T, aTextura[2], [0.0, 1.7, coordZ], xRot, [1, 0, 0], yRot, [0, 1, 0], zRot, [0, 0, 1], [1, 1, 1]);
	poligono3D(lad4, lad4I, lad4T, aTextura[3], [0.0, 1.7, coordZ], xRot, [1, 0, 0], yRot, [0, 1, 0], zRot, [0, 0, 1], [1, 1, 1]);
	poligono3D(lad5, lad5I, lad5T, aTextura[4], [0.0, 1.7, coordZ], xRot, [1, 0, 0], yRot, [0, 1, 0], zRot, [0, 0, 1], [1, 1, 1]);
	poligono3D(lad6, lad6I, lad6T, aTextura[5], [0.0, 1.7, coordZ], xRot, [1, 0, 0], yRot, [0, 1, 0], zRot, [0, 0, 1], [1, 1, 1]);
// torzo
    poligono3D(lad7, lad7I, lad7T,    aTextura[6], [0.0, 0.0, coordZ], xRo, [0, 0, 0], yRo, [0, 1, 0], zRo, [0, 0, 1], [1, 1, 1]);
	poligono3D(lad8, lad8I, lad8T,    aTextura[7], [0.0, 0.0, coordZ], xRo, [0, 0, 0], yRo, [0, 1, 0], zRo, [0, 0, 1], [1, 1, 1]);
	poligono3D(lad9, lad9I, lad9T,    aTextura[8], [0.0, 0.0, coordZ], xRo, [0, 0, 0], yRo, [0, 1, 0], zRo, [0, 0, 1], [1, 1, 1]);
	poligono3D(lad10, lad10I, lad10T, aTextura[9], [0.0, 0.0, coordZ], xRo, [0, 0, 0], yRo, [0, 1, 0], zRo, [0, 0, 1], [1, 1, 1]);
	poligono3D(lad11, lad11I, lad11T, aTextura[10], [0.0, 0.0, coordZ], xRo, [0, 0, 0], yRo, [0, 1, 0], zRo, [0, 0, 1], [1, 1, 1]);
	poligono3D(lad12, lad12I, lad12T, aTextura[11], [0.0, 0.0, coordZ], xRo, [0, 0, 0], yRo, [0, 1, 0], zRo, [0, 0, 1], [1, 1, 1]);
//cuello
	poligono3D(cub1, cub1I, cub1T, aTextura[12] ,[0.0, 1.0, coordZ], xRo, [0, 0, 0], yRo, [0, 1, 0], zRo, [0, 0, 1], [1, 1, 1]);
// brazo izquierdo
poligono3D(rec1, rec1I, rec1T, aTextura[13] ,[0.0, 0.0, coordZ], xRo, [0, 0, 0], yRo, [0, 1, 0], zRo, [1, 0, 1], [1, 1, 1]);
//brazo derecho	
poligono3D(rec2, rec2I, rec2T, aTextura[13] ,[0.0, 0.0, coordZ], xRo, [0, 0, 0], yRo, [0, 1, 0], zRo, [1, 0, 1], [1, 1, 1]);
//pie derecho
poligono3D(rec3, rec3I, rec3T, aTextura[14] ,[0.0, 0.0, coordZ], xRo, [0, 0, 0], yRo, [0, 1, 0], zRo, [1, 0, 1], [1, 1, 1]);
//pie izquierdo
poligono3D(rec4, rec4I, rec4T, aTextura[14] ,[	0.0, 0.0, coordZ], xRo, [0, 0, 0], yRo, [0, 1, 0], zRo, [1, 0, 1], [1, 1, 1]);

}
var keyPrecionado = {};
function manejoKeyAbajo(evento) {
	
    keyPrecionado[evento.keyCode] = true;
    if (String.fromCharCode(evento.keyCode) == "F") {
        enbudo += 1;
        if (enbudo == 3) {
            enbudo = 0;
        }
    }
}
function manejoKeyArriba(evento) {
	
	keyPrecionado[evento.keyCode] = false;
}

function manejoKeys() {
    if (keyPrecionado[33]) {
        coordZ-= 0.05; // Page Up
    }
    if (keyPrecionado[34]) {
        coordZ+= 0.05; // Page Down
    }
    if (keyPrecionado[37]) {
        velY-= 1; // Left cursor key
    }else if (keyPrecionado[39]) {
        velY+= 1; // Right cursor key
    }else{
		if (velY == 2) {
			velY = 2;
		}else if (velY >= 2) {
			
			if (velY == 0) {
				velY = 0;
			}else{
				velY -= 1;
			}
			
		}else {
			
			if (velY == 0) {
				velY = 0;
			}else{
				velY += 1;
			}
		}
	}
    if (keyPrecionado[38]) {
        velX-= 1; // Up cursor key
    }else if (keyPrecionado[40]) {
        velX+= 1; // Down cursor key
    }else{
		if (velX == 2) {
			velX =2;
		}else if (velX >=2 ) {
			
			if (velX == 0) {
				velX = 0;
			}else{
				velX -= 1;
			}
			
		}else {
			
			if (velX == 0) {
				velX = 0;
			}else{
				velX += 1;
			}

		}
	}
	
}
    
var ultimoTiempo = 0;
function animacion() {
	var tiempoActual = new Date().getTime();
    if (ultimoTiempo != 0) {
		var periodo = tiempoActual - ultimoTiempo;
		xRot += (velX * periodo) / 1000.0;
		yRot += (velY * periodo) / 1000.0;
		zRot += (velZ * periodo) / 1000.0;
	}
    if(xRot>360)
		xRot = 0;
	if(yRot>360){
		yRot = 0;
		
	}
	if(zRot>360){

	
		zRot = 0;
		
	}
		if(yRot== 90 ||yRot== 180 ||yRot== 270||yRot==359 ){

			yRo=yRo+90;
			if(yRo>=360){
				yRo=0;
			}
			 
		}	
	ultimoTiempo = tiempoActual;
}
	function momento() {
		requestAnimFrame(momento);
		manejoKeys();
		dibujarEscena();
		animacion();
	}
	
	function iniciarWebGL() {
		var canvas = document.getElementById("leccion04-textura");
		iniciarGL(canvas);
		iniciarShaders();
		iniciarBuffers();
		//... nuevo
		iniciarTextura(100);
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.enable(gl.DEPTH_TEST);
		document.onkeydown = manejoKeyAbajo;
		document.onkeyup = manejoKeyArriba;
		momento();
	}