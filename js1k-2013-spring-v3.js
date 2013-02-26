<!doctype html>
<html>
	<head>
		<title>JS1k, 1k demo submission [ID]</title>
		<meta charset="utf-8" />
	</head>
	<body>
		<canvas id="c"></canvas>
		<script>
			var b = document.body;
			var c = document.getElementsByTagName('canvas')[0];
			var a = c.getContext('2d');
			document.body.clientWidth; // fix bug in webkit: http://qfox.nl/weblog/218
		</script>
		<script>
var landscapes=[], waterHeight=6, heightSnow=10,heightSnowLimit=9.5,heightRock=9,heightMeadow=7.2,heightBeach=7.1; 
color = function(h,s,l) {
	p='%';
	return 'hsl('+[18*h,9*s+'%',15*l+.5|0]+'%)';
}
		
// Generating the landscape with various levels of details :
for(it=10;it-=2;){
	imIni=[0,9,coef=5,3];// Initial description of our map : a hole, a bump, and some stuff between ...
	rowsIni=2;
	for (l=1; l <=it; l++){
		var rows = rowsIni*2-1;
		var im = [];
		coef /= 2;
		for (var i=0; i<rows; i++){
			for (var j=0; j<rows; j++){
				var m=i/2|0, n=j/2|0, u=m*rowsIni+n, v=imIni[u], w=i*rows+j;
				m = im[w] = ((i%2)?
					(j%2)? ((im[w-rows]+im[w-1]+imIni[u+rowsIni+1])/3):((v+imIni[u+rowsIni])/2):
					(j%2)? ((v+imIni[u+1])/2):v)+Math.random()*coef;
				if (l==it && m < waterHeight)
					im[w] = waterHeight;
			}
		}
		rowsIni=rows; imIni=im;
	}
	var step = 20/Math.pow(2, 8);
	var n = 0;landscapes[it] = [];
	for (i = 0; i < rowsIni-1; i++) {
		for (j = 0; j < rowsIni-1; j++) {
			v=i*rowsIni+j;w=imIni[v];
			for (k=0;k<2;k++){
				landscapes[it][n++] = [
					i*step,
					j*step,
					w,
					(i+1-n%2)*step,
					(j+n%2)*step,
					z=imIni[v+(n%2?1:rowsIni)],
					(i+1)*step,
					(j+1)*step,
					y=imIni[v+rowsIni+1],
					x=1-(z-y)/step,
					z>heightSnow? color(0,0,x*9):
						z>heightSnowLimit? Math.random()>.6? color(0,0,x*9):color(3,2,x*2):
							z>heightRock? x>.8? color(7,4,x*2):color(3,1,x*2):
								z>heightMeadow?  x>.5? color(7,7,x*2):color(7,4,x*2):
									z>heightBeach? color(3,8,x*4):
										Math.random()>.6? color(10,7,5):color(10,6,5)];
			}
		}
	}
}	
a.fillStyle='#000';
a.fillRect(0, 0, w=c.width=800, h=c.height=600);

var im = [], imOr=landscapes[8],yaw = 0.51, pitch = 0, roll = -0.34,p1=[-5, -5, 20];
for (i = 0; i < imOr.length; i++) {
	im[i] = [];
	for (j = 0; j < 9; j+=3) {
		
		var x=imOr[i],
			csz = Math.sin(roll)*(x[u=j+1]-p1[1]) + Math.cos(roll)*(x[j]-p1[0]),
			csOy = Math.cos(pitch)*(x[v=j+2]-p1[2])+Math.sin(pitch)*csz,
			csOz = Math.cos(roll)*(x[u]-p1[1])-Math.sin(roll)*(x[j]-p1[0]),
			coord = [Math.cos(pitch)*csz - Math.sin(pitch)*(x[v]-p1[2]),
				Math.sin(yaw)*csOy + Math.cos(yaw)*csOz,
				Math.cos(yaw)*csOy - Math.sin(yaw)*csOz],
			inv = 1/coord[2];
		im[i].push(coord[0]*inv*w/2 + w/2, coord[1]*inv*h/2 + h/2, coord[2]);
	}
	im[i][9] = x[10];
}
im.sort(function(h,s,l){return s[2]-h[2]});

for (i=0 ; i < im.length ; i++) {
	t=im[i];
	a.fillStyle = a.strokeStyle = t[9];
	a.beginPath();
	a.moveTo(t[0], t[1]);
	a.lineTo(t[3], t[4]);
	a.lineTo(t[6], t[7]);
	a.lineTo(t[0], t[1]);
	a.stroke();
	a.fill();
}
		</script>
	</body>
</html>
