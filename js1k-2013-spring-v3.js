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
d=[], h=e=6, b = function(h,s,l) { return 'hsl('+[94*h,15*s+'%',60*l]+'%)'; }
		
// Generating the landscape with various levels of details :
for(f=10;f-=2;){
	g=[0,9,h,o=2];// Initial description of our map : a hole, a bump, and some stuff between ...
	for (l=1; l <=f; l++){
		p = o*2-1,q = [],h /= 2
		for (i=p; i--;){
			for (j=p; j--;){
				v=g[u=o*(i/2|0)+j/2|0], w=i*p+j, q[w] = ((i%2)?
					(j%2)? ((q[w+p]+q[w+1]+v)/3):((v+g[u+o])/2):
					(j%2)? ((v+g[u+1])/2):v)+h*Math.random();
				if (l==f && q[w] < e)
					q[w] = e
			}
		}
		o=p, g=q
	}
	r = 20/Math.pow(2, 8),n = 0,d[f] = [],p=o-1
	for (i = p; i--;) {
		for (j = p; j--;) {
			v=g[u=o*i+j]
			for (k=0;k<2;k++){
				d[f][n++] = [
					m=i*r,
					q=j*r,
					v,
					(i+1-n%2)*r,
					(j+n%2)*r,
					z=g[u+(n%2?1:o)],
					m+r,
					q+r,
					y=g[u+o+1],
					x=1-(z-y)/r,
					(y-=3*Math.random())>9? b(0,0,x):
						z>6.1? b(7/y,7/y*x,x/3):
									z>e? b(7/y,7/y*x,x):
										b(2,y,x)]
			}
		}
	}
}	
a.fillStyle=b(),a.fillRect(0, 0, r=c.width=c.height=800),

q = [], h = .4, g=d[8],p=131072, r/=2, o = .8
for (w = p; w--;) {
	q[w] = []
	for (j = 9; j--;
		v=g[w][j--]-15, u=g[w][j--]+8, t=g[w][j],
		q[w].push(z = Math.cos(o)*v - Math.sin(o)*(k=Math.cos(h)*u+Math.sin(h)*t),(Math.cos(h)*t-Math.sin(h)*u)/z*r + r, (Math.sin(o)*v + Math.cos(o)*k)/z*r + r));
	q[w][9] = g[w][10]
}
q.sort(function(h,s,l){return h[3]-s[3]})
		
for (w=p;w--;
	a.fillStyle= /*a.strokeStyle = */q[w][9],
	a.beginPath(),
	a.moveTo(q[w][1], q[w][2]),
	a.lineTo(q[w][4], q[w][5]),
	a.lineTo(q[w][7], q[w][8]),
	a.fill()/*,a.stroke()*/);

		</script>
	</body>
</html>
