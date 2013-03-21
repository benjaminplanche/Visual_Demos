Visual Demos
============

*Playing around with Maths and pixels ...*

Sub-repo containing some experiments.
Those I'm pleased enough with can be seen there: http://aldream.net/demo.


## Loom

*Spring is coming, The mountains take off their white mantle, Random mesh of life and ice, lakes and rocks.*

See it <a href="http://aldream.net/demo#js1k-2013-loom" title="Loom Demo">here</a>

### Controls
- Move the mouse to fly around.
- Use the wheel to draw near or observe from afar.
- Click to enjoy the view (may take ~1-3s to display) or resume your journey.
- Actualize the page to generate a different landscape.
- Change the ratio of the window if you find the relief too flat or too steep (it should look fine with a landscape ratio, but you can have different tastes...).

### Description
Final JS1K entry for the <a href="http://js1k.com/2013-spring/" title="JS1k Spring'13">Spring'13</a> edition. Size: **1023 bytes**.

This demo uses the same rendering method as my other submission (see <a href="http://aldream.net/demo#js1k-2013-morphose" title="Morphose Demo">here</a> too), the <a href="https://en.wikipedia.org/wiki/Painter%27s_algorithm" title="Wikipedia Article - Painter's algorithm">Painter's algorithm</a>, simplistic but quite light.

The landscape is generated using a mix between the <a href="https://en.wikipedia.org/wiki/Diamond-square_algorithm" title="Wikipedia Article - Diamond-square algorithm"> Midpoint displacement and the Diamond-square algorithms</a>, starting with a 2x2 matrix to get a detailed 257x257 heightmap, which is then used to build the 3D mesh.

Colors are applied taking into account the height (water < beach < vegetation < snow) and an rough estimation of the incline for the luminosity. By playing with those parameters and using the flexibility of the HSL color system, it is thus possible to create various nuances of vegetation (meadows for the sun-bathed hills, forests in the coombs, alpines above <small>- imagination can be required here</small>) or to simulate the effect of the sun on the snow (only found in the shadows for the lower altitudes).

<small>*By the way, don't fly to close to the surface or you might get entangled in the mesh and unravel the whole world (well, you will actually just get some threads spoiling the view)... Also, if you keep zooming, you will eventually reach a <em>negative distance</em>, inverting the controls. Both are harmless, but now you won't be surprised. I hadn't enough bytes left to better handle the zoom, sorry.
As for "why only stroking and not filling the faces?", the answer is simple: I couldn't afford to do both. I found the gaps left by stroking interesting, like a reminder of the "substantial" part of emptiness in the universe fabric. ;-)*</small>


## Morphose

*"They said I could be anything..." - 3D Mesh*

See it <a href="http://aldream.net/demo#js1k-2013-morphose" title="Morphose Demo">here</a>

### Controls
- Change the camera orientation with the mouse.
- Click to generate an impulse, briefly affecting the mesh cohesion. Click several times to stack impulses and get a kaleidoscope-like effect.
- Press any key to switch between "immaterialness" (starting mode) or "reality" (i.e. to invert the depth...).

### Description
First JS1K entry for the <a href="http://js1k.com/2013-spring/" title="JS1k Spring'13">Spring'13</a> edition. Size: **1020 bytes**.

This demo uses the <a href="https://en.wikipedia.org/wiki/Painter%27s_algorithm" title="Wikipedia Article - Painter's algorithm">Painter's algorithm</a> to render the 3D mesh: after projecting each face on the coordinate system defined by the camera, we sort them by decreasing depth to get the painting order. Simple, but quite light (and it is possible to use this painting order to apply effects such as a depth fog).

The displayed shape is the result of a chaotic tweening between two pre-generated meshes, a cube and a sphere. To get a smooth tweening for the faces, the sphere geometry is created by mapping each vertex of the cube (cube-mapping method).

To reduce the "collision" effect when the camera enters the shape and to make the whole demo looks more "unreal", I decided to invert the depth order during the rendering process. You can still observe the original order by pressing any keys.

Alas, this demo wasn't running as smoothly with Firefox and Opera as with Chrome (and I couldn't apply most of the optimization tricks because of the specificity of this scene or the lack of bytes). So I decided to add a simple browser detector, to reduce the shape details for Firefox and Opera. I'm not fond of this exception, but I found the render lags even worse (and it was interesting to search a trick to detect the browsers in a minimal number of bytes...). Now that you're aware of the difference, I just invite you to give it a try on Chrome, if you want more details.


## Beziering

*Intoxicated Bézier curves tracer*

See it <a href="http://aldream.net/demo#beziering" title="Beziering Demo">here</a>

### Controls
- Click to give it some life, click again to get some peace.

### Description
Some time ago, I read with great interest a presentation made by Steven Wittens, aka <a href="http://www.acko.net" title="Acko.net">Acko</a>, and I like <a href="http://acko.net/files/fullfrontal/fullfrontal/slides-net/" title="Making things with Maths - Slides">"making things with Maths"</a> too... Following his explanations and adding a *personal touch*, I made my own Bézier plotter.

This is in fact a direct graphic interpretation of <a href="https://en.wikipedia.org/wiki/De_Casteljau%27s_algorithm#B.C3.A9zier_curve" title="Wikipedia Article - De Casteljau's algorithm">De Casteljau's algorithm</a> to evaluate Bézier curves.

Given a polyline P0 made of n segments (n+1 points). Every iteration #i of our algorithm, we take, for each oriented segment, the point situated at (i / MAX_ITE)% of the segment length, and we connect these points to build a new polyline P1 of n-1 segments. We recursively repeat this operation on the polyline and its descendants (P2 with n-2 segments, P3 with n-3 segments,etc), until we get a polyline of 0 segment, ie. a single point.

If we follow the path of this point through the consecutive iterations, we get a Bézier curve of degree n (while the moving segments extremities of a polyline PX follow Bézier curves of degree X).

The specificity here is that I use close polylines: the overlapping effect (by adding a segment to close them) allows me to virtually avoid the segments decrease every iteration (it thus could be possible to iterate infinitely, until reaching the limit state.

The <a href="http://kineticjs.com" title="KineticJS.com">Kinetic.js library</a> is used here to handle various canvas layers easily.


## 404-Windy

See it <a href="http://aldream.net/demo#404-windy" title="404-Windy Demo">here</a>

### Description

A simple experiment using CSS animations and 3D transforms.
JS is only used beforehand to randomize the animations durations.

Don't search for any meaning here, I'm not sure either what I wanted to represent...


## 404-Acid

See it <a href="http://aldream.net/demo#404-acid" title="404-Acid Demo">here</a>
### Description

At first I was trying to implement a function to alter the text content of a DOM tree by inserting new node inside... (It is indeed a bit more complicated than it sounds, since you can't use directly *innerHTML* or *innerText* without breaking the tree by also affecting the HTML nodes it may already contain. You have to iterate through the whole tree to find every text-node leaf.)
... and the tests I was using slowly drift toward that... *(Why am I sharing this, btw?)*
