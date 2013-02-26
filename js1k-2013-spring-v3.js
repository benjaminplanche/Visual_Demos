var LandscapeGenerator = {

	author : "Aldream - Benjamin Planche",
	version : "0.1.1",

	// Parameters :
	param_h : 0.4,
	param_s0 : 10,
	param_hwater : 600,
	param_hdam : 630,
	param_sun : [10000, 10000, 10000],
	
	// Colors :
	grey : [0.5, 0.5, 0.5],
	white : [1, 1, 1],
	brown1 : [0.74, 0.73, 0.42],
	brown2 : [0.55, 0.55, 0],
	grey2 : [0.42, 0.35, 0.35],
	greenForest : [0.06, 0.5, 0.05],
	greenGrass : [0, 0.8, 0.3],
	yellowSand : [0.9, 0.9, 0.5],
	blueSky : [0.54, 0.73, 0.91],
	blueSee : [0.61, 0.81, 1],
	
	// Attributes :
	distUser : 10000,
	angleMov : 0.085,
	p1 : [-500, -500, 2000],
	p3 : [17400, 17400, 17401],
	angle : -0.34,
	angleH : 0.51,
	zoom : 1,
	
	// Landscapes :
	landscapes : new Array(),
	
	// Methods :
	perspectiveTransform : function perspectiveTransform(imIni) {
		var im = [];
		
		var yaw = /*Math.asin(rz.e(2)/rz.e(1))*/ LandscapeGenerator.angleH;
		var pitch = 0;
		var roll = /*Math.asin(rz.e(3)/Math.sqrt(rz.e(1)*rz.e(1)+rz.e(2)*rz.e(2)))*/ LandscapeGenerator.angle;
		var inv;
		for (i = 0; i < imIni.length; i++) {
			im[i] = [];
			for (j = 0; j < 9; j+=3) {
			
				var csz = Math.sin(roll)*(imIni[i][j+1]-LandscapeGenerator.p1[1]) + Math.cos(roll)*(imIni[i][j]-LandscapeGenerator.p1[0]);
				var csOy = Math.cos(pitch)*(imIni[i][j+2]-LandscapeGenerator.p1[2])+Math.sin(pitch)*csz;
				var csOz = Math.cos(roll)*(imIni[i][j+1]-LandscapeGenerator.p1[1])-Math.sin(roll)*(imIni[i][j]-LandscapeGenerator.p1[0]);
				
				var coord =
					[Math.cos(pitch)*csz - Math.sin(pitch)*(imIni[i][j+2]-LandscapeGenerator.p1[2]),
					Math.sin(yaw)*csOy + Math.cos(yaw)*csOz,
					Math.cos(yaw)*csOy - Math.sin(yaw)*csOz];
				inv = 1/coord[2];
				im[i].push(coord[0]*inv*canvas.width/2 + canvas.width/2, coord[1]*inv*canvas.height/2 + canvas.height/2, coord[2]);
			}
			im[i][9] = imIni[i][9];
		}

		return im;
	},

	fill : function fill(triangle, canvas) {
		canvas.fillStyle = canvas.strokeStyle = 'rgb(' + Math.floor(triangle[9][0]*255) + ',' + Math.floor(triangle[9][1]*255) + ',' + Math.floor(triangle[9][2]*255) + ')';
		canvas.beginPath();
		canvas.moveTo(triangle[0], triangle[1]);
		canvas.lineTo(triangle[3], triangle[4]);
		canvas.lineTo(triangle[6], triangle[7]);
		canvas.lineTo(triangle[0], triangle[1]);
		canvas.stroke();
		canvas.fill();
	},

	buildLandscape : function buildLandscape(imIni, colsIni, rowsIni, it, h, s0, rectSize, damHeight, damSlope, waterHeight, boolPedestal) {
		for (l=1; l <=it; l++){
			var rows = rowsIni*2-1;
			var cols = colsIni*2-1;
			var im = [];
			var coef = s0*Math.pow(2,(-l*h));
			for (var i=0; i<rows; i++){
				for (var j=0; j<cols; j++){
					var m=i/2|0, n=j/2|0;
					im[i*cols+j] = ((i%2)?
						(j%2)? ((im[i*cols+j-cols]+im[i*cols+j-1]+imIni[m*colsIni+n+colsIni+1])/3):((imIni[m*colsIni+n]+imIni[m*colsIni+n+colsIni])/2):
						(j%2)? ((imIni[m*colsIni+n]+imIni[m*colsIni+n+1])/2):imIni[m*colsIni+n])+Math.random()*coef;
				}
			}
			rowsIni=rows; colsIni=cols; imIni=im;
		}
		
		var heightSnow = waterHeight+350 ;
		var heightSnowLimit = waterHeight+330;
		var heightRock = waterHeight+200;
		var heightForest = waterHeight+100;
		var heightMeadow = waterHeight+5;
		var heightBeach = waterHeight+2;
		var GolDenRationInverted = 0.618;
	
		var step = rectSize/Math.pow(2, it);
		var n = 0;var im = [];
		for (i = 0; i < rowsIni-1; i++) {
			for (j = 0; j < colsIni-1; j++) {
				if (imIni[i*colsIni+j] < waterHeight) {
					imIni[i*colsIni+j] = waterHeight;
				}
				for (k=0;k<2;k++){
					;
					im[n++] = [
						i*step,
						j*step,
						imIni[colsIni*i+j],
						(i+1-n%2)*step,
						(j+n%2)*step,
						z=imIni[colsIni*i+j+(n%2?1:colsIni)],
						(i+1)*step,
						(j+1)*step,
						imIni[colsIni*i+j+colsIni+1],
						z>heightSnow? LandscapeGenerator.white:
							z>heightSnowLimit? Math.random()>GolDenRationInverted? LandscapeGenerator.white:LandscapeGenerator.grey:
								z>heightRock? LandscapeGenerator.brown1:
									z>heightMeadow? LandscapeGenerator.greenForest:
										z>heightBeach? LandscapeGenerator.yellowSand:
											Math.random()>GolDenRationInverted? LandscapeGenerator.blueSky:LandscapeGenerator.blueSee];
				}
			}
		}
		return im;
	},

//	colorLandscape : function colorLandscape(imTriangles, pSun, heightMax, damHeight, lastColWithDam, waterHeight, step) {
//		var nbTriangles = imTriangles.length;
//		var pasDiv2 = step/2;
//		var pasDiv1_5 = Math.round(step/1.5);
//		var pasDiv3  = step/3;
//		var pasDiv9 = step/9;
//
//		
//		var vectSurf1, vectSurf2, vectorSurf, vectorSunRay, colorIndic;
//		var arrayColor = new Array();
//		
//		correctColor = function correctColor(x, i) {
//			if (x > 1) { x = 1; }
//		};
//		
//		for (i=0 ; i < nbTriangles ; i++) {
//			// ___________________________
//			//    Color generation
//			// ___________________________
//			//var c = (imTriangles[i][2]-569)/200;
//			//arrayColor.push([c,c,c]);
//			var barycenter = [1/3*(imTriangles[i][0] + imTriangles[i][3] + imTriangles[i][6]),
//							1/3*(imTriangles[i][1] + imTriangles[i][4] + imTriangles[i][7]),
//							1/3*(imTriangles[i][2] + imTriangles[i][5] + imTriangles[i][8])];
//			/*j = i-1;
//			// Barycenter of the triangle with the global axis :
//			var barycenter = [1/3*(imTriangles[i*10+1] + imTriangles[i*10+4] + imTriangles[i*10+7]),
//							1/3*(imTriangles[i*10+2] + imTriangles[i*10+5] + imTriangles[i*10+8]),
//							1/3*(imTriangles[i*10+3] + imTriangles[i*10+6] + imTriangles[i*10+9])];
//			// Calculation of the color index depending on the LandscapeGenerator.angle between the triangle pointer and the sun ray :
//			vectSurf1 = [(imTriangles[i][1]-imTriangles[i][4]), (imTriangles[i][2]-imTriangles[i][5]), (imTriangles[i][3]-imTriangles[i][6])]);
//			vectSurf2 = ([(imTriangles[i][7]-imTriangles[i][4]), (imTriangles[i][8]-imTriangles[i][5]), (imTriangles[i][9]-imTriangles[i][6])]);
//			vectorSurf = vectSurf1.cross(vectSurf2).toUnitVector();
//			vectorSunRay = vectorSunRay.setElements([(-pSun.e(1)+barycenter.e(1)), (-pSun.e(2)+barycenter.e(2)), (-pSun.e(3)+barycenter.e(3)) ]).toUnitVector();
//			*/
//			colorIndic = /*Math.abs(vectorSurf.dot(vectorSunRay))*/1;
//		
//			if (imTriangles[i][2] > heightSnow) {
//				imTriangles[i][9] = LandscapeGenerator.white;//.x(colorIndic*1.5); // Snow => White	
//			}
//			else if (imTriangles[i][2] > heightSnowLimit) {
//				if (Math.random() > GolDenRationInverted) {
//					imTriangles[i][9] = LandscapeGenerator.white;//;//.x(colorIndic*1.3); // Snow => White	
//				}
//				else {
//					imTriangles[i][9] = LandscapeGenerator.grey;//.x(colorIndic*Math.abs(1+Math.random()/20)); // Rock => Gray
//				}
//			}
//			else if (imTriangles[i][2] > heightRock) {
//				imTriangles[i][9] = LandscapeGenerator.brown1;
//			}
//			else if (imTriangles[i][2] > heightMeadow) {
//				imTriangles[i][9] = LandscapeGenerator.greenForest;
//			}
//			else if (imTriangles[i][2] > heightBeach) {
//				imTriangles[i][9] = LandscapeGenerator.yellowSand;//.x(colorIndic*Math.abs(1-Math.random()/20)); // Beach => yellow
//			}
//			else { // Water :
//				if (Math.random() > GolDenRationInverted) {
//					imTriangles[i][9] = LandscapeGenerator.blueSky;//.x(colorIndic*Math.abs(1-Math.random()/10));
//				}
//				else {
//					imTriangles[i][9] = LandscapeGenerator.blueSee;//.x(colorIndic*Math.abs(1-Math.random()/10));
//				}
//			}
//			
//			//arrayColor[j].each(function(x,i){ correctColor(x,i);});
//		}
//		
//		return imTriangles;
//	},

	painterAlgo : function painterAlgo(imTriangles, context) {
		
		var im = LandscapeGenerator.perspectiveTransform(imTriangles);
		im.sort(function(a,b){return b[2]-a[2]});
		
		for (i=0 ; i < im.length ; i++) {
	/* 		arrayColor[posSorted[i]].each(function(x, i) {
				if (x > 1) { x = 1; }
			}); */
			
			LandscapeGenerator.fill(im[i], context);
			
		}
	},

	clearCanvas : function clearCanvas(context, canvas) {
	  context.clearRect(0, 0, canvas.width, canvas.height);
	  var w = canvas.width;
	  canvas.width = 1;
	  canvas.width = w;
	  var radgrad = context.createRadialGradient(canvas.width/2,canvas.height/2,1,canvas.width/2,canvas.height/2,canvas.width/2);
	  radgrad.addColorStop(0, 'rgba(150, 200, 250,.8)');
	  radgrad.addColorStop(0.9, 'rgba(0, 0, 0,0)');
	  radgrad.addColorStop(1, 'rgba(0, 0, 0,0)');
	  context.fillStyle = radgrad;
	  context.fillRect(0, 0, canvas.width, canvas.height);
	},

	DrawLandscape : function DrawLandscape(canvas) {
		var context = canvas.getContext('2d');
			
		var im =
			[670 , 672 , 670 , 675 , 690 , 680 , 650 , 675 , 750 , 680 , 700 , 892 , 1000,
			680 , 665 , 640 , 630 , 650 , 645 , 630 , 628 , 648 , 650 , 680 , 875 , 900,
			630 , 615 , 585 , 580 , 585 , 600 , 590 , 610 , 640 , 603 , 630 , 800 , 895,
			595 , 568 , 555 , 560 , 575 , 580 , 575 , 570 , 580 , 610 , 625 , 730 , 780,
			550 , 540 , 538 , 550 , 595 , 575 , 600 , 570 , 575 , 620 , 613 , 700 , 730,
			525 , 530 , 538 , 550 , 603 , 625 , 615 , 580 , 570 , 610 , 590 , 610 , 720,
			545 , 540 , 538 , 597 , 575 , 605 , 593 , 578 , 573 , 593 , 608 , 595 , 695,
			650 , 560 , 543 , 579 , 569 , 560 , 563 , 570 , 580 , 595 , 619 , 638 , 650,
			700 , 640 , 570 , 620 , 586 , 558 , 578 , 585 , 600 , 615 , 655 , 680 , 683,
			750 , 680 , 640 , 650 , 615 , 618 , 625 , 638 , 648 , 665 , 680 , 750 , 705];
		im.forEach(function(e,i,a) { a[i] *= (1.1-Math.random()/5);});

		var imMax = 1000;
		
		// Generating the landscape with various levels of details :
		landscapes = new Array();
		colorsMap = new Array();
		landscapes[0] = LandscapeGenerator.buildLandscape(im, 13,10, 1, LandscapeGenerator.param_h, LandscapeGenerator.param_s0, 100, LandscapeGenerator.param_hdam, 3, LandscapeGenerator.param_hwater, 1);
		landscapes[1] = LandscapeGenerator.buildLandscape(im, 13,10, 2, LandscapeGenerator.param_h, LandscapeGenerator.param_s0, 100, LandscapeGenerator.param_hdam, 3, LandscapeGenerator.param_hwater, 1);
		landscapes[2] = LandscapeGenerator.buildLandscape(im, 13,10, 3, LandscapeGenerator.param_h, LandscapeGenerator.param_s0, 100, LandscapeGenerator.param_hdam, 3, LandscapeGenerator.param_hwater, 1);

		GeneratePointOfView = function GeneratePointOfView(e) {
			var code = (e.keyCode ? e.keyCode : e.which);
			var bool = 0;
			if (code == 39) { // Right
				bool = 1;
				LandscapeGenerator.angle -= LandscapeGenerator.angleMov;
			}
			else if (code == 37) { // Left	
				bool = 1;
				LandscapeGenerator.angle += LandscapeGenerator.angleMov;
			}
			else if (code == 38) { // Up
				if (LandscapeGenerator.angleH < 1.397) { bool = 1; LandscapeGenerator.angleH += LandscapeGenerator.angleMov; }
			}
			else if (code == 40) { // Down
				if (LandscapeGenerator.angleH > 0.175) { bool = 1; LandscapeGenerator.angleH -= LandscapeGenerator.angleMov; }
			}
			else if (code == 80) { // Zoom (p)
				bool = 1;
				LandscapeGenerator.zoom += .1;
			}
			else if (code == 76 ) { // Dezoom (l)
				bool = 1;
				LandscapeGenerator.zoom -= .1;
			}
			else if (code == 87) { // Move Up (w)
				bool = 2;
				LandscapeGenerator.p2.set(3, LandscapeGenerator.p2.e(3)-1000000/LandscapeGenerator.zoom);
			}
			else if (code == 83) { // Move Down (s)
				bool = 2;
				LandscapeGenerator.p2.set(3, LandscapeGenerator.p2.e(3)+1000000/LandscapeGenerator.zoom);
			}
			else if (code == 65) { // Move Left (a)
				var x = 1000000*Math.cos(LandscapeGenerator.angle);
				var y = 1000000*Math.sin(LandscapeGenerator.angle);
				bool = 1;
				LandscapeGenerator.p2.set(1, LandscapeGenerator.p2.e(1)-x/LandscapeGenerator.zoom);
				LandscapeGenerator.p2.set(2, LandscapeGenerator.p2.e(2)+y/LandscapeGenerator.zoom);

			}
			else if (code == 68) { // Move Right (d)
				var x = 1000000*Math.cos(LandscapeGenerator.angle);
				var y = 1000000*Math.sin(LandscapeGenerator.angle);
				bool = 1;
				LandscapeGenerator.p2.set(1, LandscapeGenerator.p2.e(1)+x/LandscapeGenerator.zoom);
				LandscapeGenerator.p2.set(2, LandscapeGenerator.p2.e(2)-y/LandscapeGenerator.zoom);
			}
			else if (code == 71) { // Generate (g)
				var rG = LandscapeGenerator.buildLandscape(im, 3, LandscapeGenerator.param_h, LandscapeGenerator.param_s0, 100, LandscapeGenerator.param_hdam, 3, LandscapeGenerator.param_hwater, 1);
				LandscapeGenerator.clearCanvas(context, canvas);
				LandscapeGenerator.painterAlgo(landscapes[2], context);
			}
			else if (code == 82) {
				im = Matrix.Random(2, 3);
				im.map(function(x,i,j) {
					im.set(i,j, Math.round(x*500+500));
				});
				LandscapeGenerator.clearCanvas(context, canvas);
				LandscapeGenerator.painterAlgo(r, context);
			}

			if (bool == 1) {/*
				var x = LandscapeGenerator.distUser*Math.cos(LandscapeGenerator.angle)*Math.cos(LandscapeGenerator.angleH);
				var y = LandscapeGenerator.distUser*Math.sin(LandscapeGenerator.angle)*Math.cos(LandscapeGenerator.angleH);
				var z = LandscapeGenerator.distUser*Math.sin(LandscapeGenerator.angleH);
				LandscapeGenerator.p1.set(1, LandscapeGenerator.p2.e(1)+x);
				LandscapeGenerator.p1.set(2, LandscapeGenerator.p2.e(2)+y);
				LandscapeGenerator.p1.set(3, LandscapeGenerator.p2.e(3)+z);
				LandscapeGenerator.p3.set(1, LandscapeGenerator.p1.e(1));
				LandscapeGenerator.p3.set(2, LandscapeGenerator.p1.e(2));
				LandscapeGenerator.p3.set(3, LandscapeGenerator.p1.e(3)-1);
				*/
				LandscapeGenerator.clearCanvas(context, canvas);
				LandscapeGenerator.painterAlgo(landscapes[0], context);
			}
			else if (bool == 2) {
				LandscapeGenerator.clearCanvas(context, canvas);
				LandscapeGenerator.painterAlgo(landscapes[0], context);
			}
		};
		
		Generate = function Generate(e) {
			var code = (e.keyCode ? e.keyCode : e.which);
			if (code != 71) {
				LandscapeGenerator.clearCanvas(context, canvas);
				LandscapeGenerator.painterAlgo(landscapes[1], context);
			}
		}
/*
		var x = LandscapeGenerator.distUser*Math.cos(LandscapeGenerator.angle)*Math.cos(LandscapeGenerator.angleH);
		var y = LandscapeGenerator.distUser*Math.sin(LandscapeGenerator.angle)*Math.cos(LandscapeGenerator.angleH);
		var z = LandscapeGenerator.distUser*Math.sin(LandscapeGenerator.angleH);
		LandscapeGenerator.p1.set(1, LandscapeGenerator.p2.e(1)+x);
		LandscapeGenerator.p1.set(2, LandscapeGenerator.p2.e(2)+y);
		LandscapeGenerator.p1.set(3, LandscapeGenerator.p2.e(3)+z);
		LandscapeGenerator.p3.set(1, LandscapeGenerator.p1.e(1));
		LandscapeGenerator.p3.set(2, LandscapeGenerator.p1.e(2));
		LandscapeGenerator.p3.set(3, LandscapeGenerator.p1.e(3)-1);
*/
		LandscapeGenerator.clearCanvas(context, canvas);
		LandscapeGenerator.painterAlgo(landscapes[1], context);
		
		document.onkeydown = function(e) {GeneratePointOfView(e)};
		document.onkeyup = function(e) {Generate(e)};
		return Generate;
	}
};
