var LandscapeGenerator = {

  author : "Aldream - Benjamin Planche",
	version : "0.1.1",

	// Parameters :
	param_h : 0.4,
	param_s0 : 10,
	param_hwater : 590,
	param_hdam : 630,
	param_sun : Vector.create([10000, 10000, 10000]),
	
	// Colors :
	grey : Vector.create([0.5, 0.5, 0.5]),
	white : Vector.create([1, 1, 1]),
	brown1 : Vector.create([0.74, 0.73, 0.42]),
	brown2 : Vector.create([0.55, 0.55, 0]),
	grey2 : Vector.create([0.42, 0.35, 0.35]),
	greenForest : Vector.create([0.06, 0.5, 0.05]),
	greenGrass : Vector.create([0, 0.8, 0.3]),
	yellowSand : Vector.create([0.9, 0.9, 0.5]),
	blueSky : Vector.create([0.54, 0.73, 0.91]),
	blueSee : Vector.create([0.61, 0.81, 1]),
	
	// Attributes :
	distUser : 10000,
	angleMov : 0.085,
	p1 : [0, 0, 1000],
	p3 : [17400, 17400, 17401],
	angle : -0.34,
	angleH : 0.51,
	zoom : 1,
	
	// Landscapes :
	landscapes : new Array(),
	colorsMap : new Array(),

	
	// Methods :
	
	stochasticInterpolation : function stochasticInterpolation(imIni, colsIni, rowsIni,l, h, s0) {
		var rows = rowsIni*2;
		var cols = colsIni*2;
		var im = [];
/*
		// We fill with the already-known values :
		for (i = 1; i < rowsIni; i++) {
			for (j = 1; j < colsIni; j++) {
				im[2*i*cols+2*j] = imIni[i*colsIni+j];
				im[2*i*cols+2*j+1] = imIni[i*colsIni+j];
			}
		}
		 
		// We fill the rest with the generated values :
		var coef = s0*Math.pow(2,(-l*h));
		for (i = 0; i < rows; i+=2) {
			for (j = 1; j < cols; j+=2) {
					im[i*cols+j] = Math.floor(0.5*( im[i*cols+j-1] + im[i*cols+j+1])+Math.random()*coef);
			}
		}

		for (j = 0; j < cols; j+=2) {
			for (i = 1; i < rows; i+=2) {
					im[i*cols+j] = Math.floor(0.5*( im[i*cols+j-cols] + im[i*cols+j+cols])+Math.random()*coef);
			}
		}

		for (i = 1; i < rows; i+=2) {
			for (j = 1; j < cols; j+=2) {
					im[i*cols+j] = Math.floor(0.25*( im[i*cols+j-cols] + im[i*cols+j+cols] + im[i*cols+j-1] + im[i*cols+j+1])+Math.random()*coef);
			}
		}
*/
		for (i = 0; i < rows*cols; i++) { im[i] = (i/cols)*20; }
		return im;
	},

	recursiveInterpolation : function recursiveInterpolation(imIni, colsIni, rowsIni, lMax, h, s0) {
		var imCourant = imIni;
		for (l=1; l <=lMax; l++)
			imCourant = LandscapeGenerator.stochasticInterpolation(imCourant, colsIni*l, rowsIni*l, l, h, s0);
			
		return imCourant;
	},

	triangleCutting : function triangleCutting(imIni, colsIni, rowsIni, step) {
		var imTriangles = [];
		var n = 0;
		for (i = 0; i < rowsIni; i++) {
			for (j = 0; j < colsIni; j++) {
				imTriangles[n++] = [
					(i-1)*step,
					(j-1)*step,
					imIni[colsIni*i+j],
					i*step,
					(j-1)*step,
					imIni[colsIni*i+1+j],
					i*step,
					j*step,
					imIni[colsIni*i+1+j+1]];
				
				imTriangles[n++] = [
					(i-1)*step,
					(j-1)*step,
					imIni[colsIni*i+j],
					(i-1)*step,
					j*step,
					imIni[colsIni*i+j+1],
					i*step,
					j*step,
					imIni[colsIni*i+1+j+1]];
			}
		}

		return imTriangles;
	},

	perspectiveTransform : function perspectiveTransform(imIni) {
		var im = [];
		
		var yaw = /*Math.asin(rz.e(2)/rz.e(1))*/ LandscapeGenerator.angleH;
		var pitch = 0;
		var roll = /*Math.asin(rz.e(3)/Math.sqrt(rz.e(1)*rz.e(1)+rz.e(2)*rz.e(2)))*/ LandscapeGenerator.angle;
		var inv;
		for (i = 0; i < imIni.length; i++) {
			for (j = 0; j < 9; j+=3) {
			
				var csz = Math.sin(roll)*(imIni[i][j+1]-LandscapeGenerator.p1[1]) + Math.cos(roll)*(imIni[i][j]-LandscapeGenerator.p1[0]);
				var csOy = Math.cos(pitch)*(imIni[i][j+2]-LandscapeGenerator.p1[2])+Math.sin(pitch)*csz;
				var csOz = Math.cos(roll)*(imIni[i][j+1]-LandscapeGenerator.p1[1])-Math.sin(roll)*(imIni[i][j]-LandscapeGenerator.p1[0]);
				
				var coord =
					[Math.cos(pitch)*csz - Math.sin(pitch)*(imIni[i][j+2]-LandscapeGenerator.p1[2]),
					Math.sin(yaw)*csOy + Math.cos(yaw)*csOz,
					Math.cos(yaw)*csOy - Math.sin(yaw)*csOz];
				inv = 1/coord[2];
				im[i] = [coord[0]*inv*canvas.width/2 + canvas.width/2, coord[1]*inv*canvas.height/2 + canvas.height/2, coord[2]];
				
			/*/	
				coordInit.setElements([imIni.e(i,j), imIni.e(i,j+1), imIni.e(i,j+2), 1]);
				coord = matTransfo.x(coordInit);
				
				inv = 1/coord.e(4);
				im.set(i,j, coord.e(1)*inv);
				im.set(i,j+1, coord.e(2)*inv);
				im.set(i,j+2, coord.e(3)*inv);
			*/
			}
		}

		return im;
	},

	sortRows : function sortRows(mat, numCol) {
		var vectDist = mat.col(numCol);
		var length = vectDist.dimensions()+1;
		var posSorted = new Array();
		var id;
		for (i = 1; i < length; i++) {
			id = vectDist.indexOf(vectDist.eSorted(length-i));
			posSorted.push(id);
		}
		return posSorted;
	},

	fill : function fill(triangle, color, canvas) {
		canvas.fillStyle = canvas.strokeStyle = 'rgb(' + Math.floor(color[0]*255) + ',' + Math.floor(color[1]*255) + ',' + Math.floor(color[2]*255) + ')';
		canvas.beginPath();
		canvas.moveTo(triangle[0], triangle[1]);
		canvas.lineTo(triangle[3], triangle[4]);
		canvas.lineTo(triangle[6], triangle[7]);
		canvas.lineTo(triangle[0], triangle[1]);
		canvas.stroke();
		canvas.fill();
	},

	buildLandscape : function buildLandscape(imIni, colsIni, rowsIni, it, h, s0, rectSize, damHeight, damSlope, waterHeight, boolPedestal) {
		imIni = LandscapeGenerator.recursiveInterpolation(imIni, colsIni, rowsIni, it, h, s0);
		var step = rectSize/Math.pow(2, it);
		colsIni *= Math.pow(2, it);
		rowsIni *= Math.pow(2, it);
		/*
		// Adding the dam :
		var lastColWithDam = 0;
		for (j = 1; j < 3; j++) {
			for (i=1 ; i <= imSize.rows ; i++) {
				if (imIni.e(i,j) < damHeight)
					imIni.set(i,j,damHeight);
				
			}
		}
		for (j = 3; j <= imSize.cols; j++) {
			hDam = damHeight - (j-2)*damSlope*step;
			if (hDam < waterHeight) {
				lastColWithDam = j*step;
				break
			}
			for (i=1 ; i <= imSize.rows ; i++) {
				if (imIni.e(i,j) < hDam)
					imIni.set(i,j,hDam);
			}
		}
		*/
		
		// Adding the water :
		for (i=1 ; i <= rowsIni ; i++) {
			for (j=1 ; j <= colsIni ; j++) {
				if (imIni[i*colsIni+j] < waterHeight) {
					imIni[i*colsIni+j] = waterHeight+Math.random();
				}
			}
		}
		
		// // Ajout ou non du socle
		// if (boolPedestal == 1) {
			// var imG = Matrix.Zero(imIni.rows()+2, imIni.cols()+2);
			// imG.map( function(x, i, j) {
				// imG.set(i+1, j+1, imIni.e(i,j));
			// });
			// var nb = imG.cols()-1;
			// for (i = 0; i <= imG.rows(); i++) {
				// imG.set(i,0, 300);
				// imG.set(i, nb, 300);
			// }
			// nb = imG.rows()-1;
			// for (i = 0; i <= imG.cols(); i++) {
				// imG.set(0,i, 300);
				// imG.set(nb,i, 300);
			// }
			// imIni = imG;
		// }
		
		var r = LandscapeGenerator.triangleCutting(imIni, colsIni, rowsIni, step);
		return r;
	},

	colorLandscape : function colorLandscape(imTriangles, pSun, heightMax, damHeight, lastColWithDam, waterHeight, step) {
		var nbTriangles = imTriangles.length;
		var pasDiv2 = step/2;
		var pasDiv1_5 = Math.round(step/1.5);
		var pasDiv3  = step/3;
		var pasDiv9 = step/9;
		var GolDenRationInverted = 0.618;

		var heightSnow = heightMax-50;
		var heightSnowLimit = heightMax-70;
		var heightRock = heightMax-200;
		var heightForest = waterHeight+40;
		var heightMeadow = waterHeight+5;
		var heightBeach = waterHeight+2;
	
		
		var vectSurf1, vectSurf2, vectorSurf, vectorSunRay, colorIndic;
		var arrayColor = new Array();
		
		correctColor = function correctColor(x, i) {
			if (x > 1) { x = 1; }
		};
		
		for (i=0 ; i < nbTriangles ; i++) {
			// ___________________________
			//    Color generation
			// ___________________________
			arrayColor.push([.5,1,0]);
			
			/*j = i-1;
			// Barycenter of the triangle with the global axis :
			var barycenter = [1/3*(imTriangles[i*10+1] + imTriangles[i*10+4] + imTriangles[i*10+7]),
							1/3*(imTriangles[i*10+2] + imTriangles[i*10+5] + imTriangles[i*10+8]),
							1/3*(imTriangles[i*10+3] + imTriangles[i*10+6] + imTriangles[i*10+9])];
			// Calculation of the color index depending on the LandscapeGenerator.angle between the triangle pointer and the sun ray :
			vectSurf1.setElements([(imTriangles.e(i,1)-imTriangles.e(i,4)), (imTriangles.e(i,2)-imTriangles.e(i,5)), (imTriangles.e(i,3)-imTriangles.e(i,6))]);
			vectSurf2.setElements([(imTriangles.e(i,7)-imTriangles.e(i,4)), (imTriangles.e(i,8)-imTriangles.e(i,5)), (imTriangles.e(i,9)-imTriangles.e(i,6))]);
			vectorSurf = vectSurf1.cross(vectSurf2).toUnitVector();
			vectorSunRay = vectorSunRay.setElements([(-pSun.e(1)+barycenter.e(1)), (-pSun.e(2)+barycenter.e(2)), (-pSun.e(3)+barycenter.e(3)) ]).toUnitVector();
			colorIndic = Math.abs(vectorSurf.dot(vectorSunRay));
		
			if ( (barycenter.e(2) <= lastColWithDam) && ((barycenter.e(3) == damHeight) && ((Math.abs(vectorSurf.e(3)) > step) || (vectorSurf.e(1) == 0)))) {
				arrayColor[j] = LandscapeGenerator.grey.x(colorIndic*Math.abs(1+Math.random()/10)); // Dam => Gray	
			}
			else if (barycenter.e(3) > heightSnow) {
				arrayColor[j] = LandscapeGenerator.white.x(colorIndic*1.5); // Snow => White	
			}
			else if (barycenter.e(3) > heightSnowLimit) {
				if (Math.random() > GolDenRationInverted) {
					arrayColor[j] = LandscapeGenerator.white.x(colorIndic*1.3); // Snow => White	
				}
				else {
					arrayColor[j] = LandscapeGenerator.grey.x(colorIndic*Math.abs(1+Math.random()/20)); // Rock => Gray
				}
			}
			else if (barycenter.e(3) > heightRock) {
				if ((Math.abs(vectSurf1.e(3)) > pasDiv1_5) || (Math.abs(vectSurf2.e(3)) > pasDiv1_5)) {
					arrayColor[j] = LandscapeGenerator.grey.x(colorIndic*Math.abs(1+Math.random()/20)); // Steep Rock => Gray
				}	 
				else if ((Math.abs(vectSurf1.e(3)) > pasDiv3) || (Math.abs(vectSurf2.e(3)) > pasDiv3)) {
					arrayColor[j] = LandscapeGenerator.brown1.x(colorIndic*Math.abs(1+Math.random()/20)); // Steep Rock => Brown
				}
				else {
					arrayColor[j] = LandscapeGenerator.brown2.x(colorIndic*Math.abs(1+Math.random()/10)); // Height => Gray-Brown
				}
			}
			else if (barycenter.e(3) > heightMeadow) {
				if ((Math.abs(vectSurf1.e(3)) > pasDiv1_5) || (Math.abs(vectSurf2.e(3)) > pasDiv1_5)) {
					if (Math.random() > GolDenRationInverted) {
						arrayColor[j] = LandscapeGenerator.grey2.x(colorIndic*Math.abs(1+Math.random()/20)); // Really Steep Rock => Gray-Brown
					}
					else {
						arrayColor[j] = LandscapeGenerator.greenForest.x(colorIndic*Math.abs(1+Math.random()/10)); // Wood => Dark green
					}
				}
				else if ((Math.abs(vectSurf1.e(3)) > pasDiv9) || (Math.abs(vectSurf2.e(3)) > pasDiv9)) {
					arrayColor[j] = LandscapeGenerator.greenForest.x(colorIndic*Math.abs(1+Math.random()/10)); // Forest => Dark green
				}
				else {
					if (Math.random() < GolDenRationInverted) {
						arrayColor[j] = LandscapeGenerator.greenGrass.x(colorIndic*Math.abs(1+Math.random()/10)); // Meadow => light green
					}
					else {
						arrayColor[j] = LandscapeGenerator.greenForest.x(colorIndic*Math.abs(1+Math.random()/10));// Wood => Dark green
					}
				}
			}
			else if (barycenter.e(3) > heightBeach) {
				arrayColor[j] = LandscapeGenerator.yellowSand.x(colorIndic*Math.abs(1-Math.random()/20)); // Beach => yellow
			}
			else { // Water :
				if (Math.random() > GolDenRationInverted) {
					arrayColor[j] = LandscapeGenerator.blueSky.x(colorIndic*Math.abs(1-Math.random()/10));
				}
				else {
					arrayColor[j] = LandscapeGenerator.blueSee.x(colorIndic*Math.abs(1-Math.random()/10));
				}
			}
			
			arrayColor[j].each(function(x,i){ correctColor(x,i);}); */
		}
		
		return arrayColor;
	},

	painterAlgo : function painterAlgo(imTriangles, arrayColor, canvas, context, p, q, r, pSun) {
		
		var im = LandscapeGenerator.perspectiveTransform(imTriangles);
		
		var barycenter = [];
/*
		for (i=0 ; i < imTriangles.length ; i++) {
			// Triangle barycenter with the new axis :
			barycenter.set(1, 0.333*(im.e(i,1) + im.e(i,4) + im.e(i,7)));
			barycenter.set(2, 0.333*(im.e(i,2) + im.e(i,5) + im.e(i,8)));
			barycenter.set(3, 0.333*(im.e(i,3) + im.e(i,6) + im.e(i,9)));
			im[i*10+9] = im[ barycenter.modulus());
	 
		}
*/	
		im.sort(function(a,b){return b[2]-a[2]});
		
		for (i=0 ; i < im.length ; i++) {
	/* 		arrayColor[posSorted[i]].each(function(x, i) {
				if (x > 1) { x = 1; }
			}); */
			
			LandscapeGenerator.fill(im[i], arrayColor[i], context);
			
		}
		
		// var dist = LandscapeGenerator.p1.distanceFrom(LandscapeGenerator.p2);
		// var visionPlane = new Object();
		// visionPlane.width = 2*dist*Math.tan(0.785);
		// visionPlane.height = 2*dist*Math.tan(0.506);
		// context.fillStyle = 'rgb(0,0,255)';
		// context.fillRect(-1/2*visionPlane.height, -1/2*visionPlane.height, visionPlane.width , visionPlane.height);
		
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
			[670 , 672 , 670 , 675 , 690 , 680 , 650 , 675 , 690 , 680 , 700 , 892 , 1000,
			680 , 665 , 640 , 630 , 650 , 645 , 630 , 628 , 648 , 650 , 680 , 875 , 900,
			630 , 615 , 585 , 580 , 585 , 600 , 590 , 610 , 603 , 603 , 630 , 800 , 895,
			595 , 568 , 555 , 560 , 575 , 580 , 575 , 570 , 580 , 610 , 625 , 730 , 780,
			550 , 540 , 538 , 550 , 595 , 575 , 600 , 570 , 575 , 620 , 613 , 700 , 730,
			525 , 530 , 538 , 550 , 603 , 625 , 615 , 580 , 570 , 610 , 590 , 610 , 720,
			545 , 540 , 538 , 597 , 575 , 605 , 593 , 578 , 573 , 593 , 608 , 595 , 695,
			615 , 560 , 543 , 579 , 569 , 560 , 563 , 570 , 580 , 595 , 619 , 638 , 650,
			625 , 598 , 560 , 559 , 586 , 558 , 578 , 585 , 600 , 615 , 655 , 680 , 683,
			610 , 600 , 610 , 605 , 615 , 618 , 625 , 638 , 648 , 665 , 680 , 700 , 705];
		

		var imMax = 705;
		
		// Generating the landscape with various levels of details :
		landscapes = new Array();
		colorsMap = new Array();
		landscapes[0] = LandscapeGenerator.buildLandscape(im, 13, 10, 1, LandscapeGenerator.param_h, LandscapeGenerator.param_s0, 100, LandscapeGenerator.param_hdam, 3, LandscapeGenerator.param_hwater, 1);
		landscapes[1] = LandscapeGenerator.buildLandscape(im, 26, 20, 2, LandscapeGenerator.param_h, LandscapeGenerator.param_s0, 100, LandscapeGenerator.param_hdam, 3, LandscapeGenerator.param_hwater, 1);
		landscapes[2] = LandscapeGenerator.buildLandscape(im, 52, 40, 3, LandscapeGenerator.param_h, LandscapeGenerator.param_s0, 100, LandscapeGenerator.param_hdam, 3, LandscapeGenerator.param_hwater, 1);
		colorsMap[0] = LandscapeGenerator.colorLandscape(landscapes[0], LandscapeGenerator.param_sun, imMax, LandscapeGenerator.param_hdam, landscapes[0].d, LandscapeGenerator.param_hwater, 25);
		colorsMap[1] = LandscapeGenerator.colorLandscape(landscapes[1], LandscapeGenerator.param_sun, imMax, LandscapeGenerator.param_hdam, landscapes[1].d, LandscapeGenerator.param_hwater, 25);
		colorsMap[2] = LandscapeGenerator.colorLandscape(landscapes[2], LandscapeGenerator.param_sun, imMax, LandscapeGenerator.param_hdam, landscapes[2].d, LandscapeGenerator.param_hwater, 25);

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
				var arrayColorG = LandscapeGenerator.colorLandscape(rG, LandscapeGenerator.param_sun, imMax, LandscapeGenerator.param_hdam, rG.d, LandscapeGenerator.param_hwater, 12.5);
				LandscapeGenerator.clearCanvas(context, canvas);
				LandscapeGenerator.painterAlgo(landscapes[2], colorsMap[2], canvas, context, LandscapeGenerator.param_p, LandscapeGenerator.param_q, LandscapeGenerator.param_r, LandscapeGenerator.param_sun);
			}
			else if (code == 82) {
				im = Matrix.Random(2, 3);
				im.map(function(x,i,j) {
					im.set(i,j, Math.round(x*500+500));
				});
				LandscapeGenerator.clearCanvas(context, canvas);
				LandscapeGenerator.painterAlgo(r, arrayColor, canvas, context, LandscapeGenerator.param_p, LandscapeGenerator.param_q, LandscapeGenerator.param_r, LandscapeGenerator.param_sun);
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
				LandscapeGenerator.painterAlgo(landscapes[0], colorsMap[0], canvas, context, LandscapeGenerator.param_p, LandscapeGenerator.param_q, LandscapeGenerator.param_r, LandscapeGenerator.param_sun);
			}
			else if (bool == 2) {
				LandscapeGenerator.clearCanvas(context, canvas);
				LandscapeGenerator.painterAlgo(landscapes[0], colorsMap[0], canvas, context, LandscapeGenerator.param_p, LandscapeGenerator.param_q, LandscapeGenerator.param_r, LandscapeGenerator.param_sun);
			}
		};
		
		Generate = function Generate(e) {
			var code = (e.keyCode ? e.keyCode : e.which);
			if (code != 71) {
				LandscapeGenerator.clearCanvas(context, canvas);
				LandscapeGenerator.painterAlgo(landscapes[1], colorsMap[1], canvas, context, LandscapeGenerator.param_p, LandscapeGenerator.param_q, LandscapeGenerator.param_r, LandscapeGenerator.param_sun);
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
		LandscapeGenerator.painterAlgo(landscapes[1], colorsMap[1], canvas, context, LandscapeGenerator.param_p, LandscapeGenerator.param_q, LandscapeGenerator.param_r, LandscapeGenerator.param_sun);
		
		document.onkeydown = function(e) {GeneratePointOfView(e)};
		document.onkeyup = function(e) {Generate(e)};
		return Generate;
	}
};
