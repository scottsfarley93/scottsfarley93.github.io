/**
 * dat.globe Javascript WebGL Globe Toolkit
 * http://dataarts.github.com/dat.globe
 *
 * Copyright 2011 Data Arts Team, Google Creative Lab
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

           	
 function lonLatToVector3( lng, lat, out )
{
    out = out || new THREE.Vector3();

    //flips the Y axis
    lat = Math.PI / 2 - lat;

    //distribute to sphere
    out.set(
                Math.sin( lat ) * Math.sin( lng ),
                Math.cos( lat ),
                Math.sin( lat ) * Math.cos( lng )
    );

    return out;

}

function vector3toLonLat( vector3 )
{

    vector3.normalize();
	r = 150;
	x = vector3.x
	y = vector3.y
	z = vector3.z
     lat = 90 - (Math.acos(y / r)) * 180 / Math.PI;
    lon = ((270 + (Math.atan2(x, z)) * 180 / Math.PI) % 360) - 180;

    lat = Math.round(lat * 100000) / 100000;
    lon = Math.round(lon * 100000) / 100000;
	return [lon, lat]
}



var DAT = DAT || {};

DAT.Globe = function (container, colorFn) {

    colorFn = colorFn || function (x) {
       // var c = new THREE.Color();
        // c.setHSV(( 0.6 - ( x * 0.5 ) ), 1.0, 1.0);
        var c = new THREE.Color("rgb(255, 0, 0)");
        return c;
    };

    var Shaders = {
        'earth':{
            uniforms:{
                'texture':{ type:'t', value:null }
            },
            vertexShader:[
                'varying vec3 vNormal;',
                'varying vec2 vUv;',
                'void main() {',
                'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
                'vNormal = normalize( normalMatrix * normal );',
                'vUv = uv;',
                '}'
            ].join('\n'),
            fragmentShader:[
                'uniform sampler2D texture;',
                'varying vec3 vNormal;',
                'varying vec2 vUv;',
                'void main() {',
                'vec3 diffuse = texture2D( texture, vUv ).xyz;',
                'float intensity = 1.05 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) );',
                'vec3 atmosphere = vec3( 1.0, 1.0, 1.0 ) * pow( intensity, 3.0 );',
                'gl_FragColor = vec4( diffuse + atmosphere, 1.0 );',
                '}'
            ].join('\n')
        },
        'atmosphere':{
            uniforms:{},
            vertexShader:[
                'varying vec3 vNormal;',
                'void main() {',
                'vNormal = normalize( normalMatrix * normal );',
                'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
                '}'
            ].join('\n'),
            fragmentShader:[
                'varying vec3 vNormal;',
                'void main() {',
                'float intensity = pow( 0.8 - dot( vNormal, vec3( 0, 0, 1.0 ) ), 12.0 );',
                'gl_FragColor = vec4( 1.0, 1.0, 1.0, 1.0 ) * intensity;',
                '}'
            ].join('\n')
        }
    };

    var camera, scene, sceneAtmosphere, renderer, projector, w, h;
    var vector, mesh, atmosphere, point, globe3d;

    var overRenderer;

    var curZoomSpeed = 0;
    var zoomSpeed = 50;

    var mouse = { x:0, y:0 }, mouseOnDown = { x:0, y:0 };
    var rotation = { x:0, y:0 },
        target = { x:Math.PI * 3 / 2, y:Math.PI / 6.0 },
        targetOnDown = { x:0, y:0 };

    var distance = 100000, distanceTarget = 100000;
    var padding = 40;
    var PI_HALF = Math.PI / 2;

    function init() {

        container.style.color = '#fff';
        container.style.font = '13px/20px Arial, sans-serif';

        var shader, uniforms, material;
        w = container.offsetWidth || window.innerWidth;
        h = container.offsetHeight || window.innerHeight;

        camera = new THREE.PerspectiveCamera(30, w / h, 1, 10000);
        camera.position.z = distance;

        vector = new THREE.Vector3();

        scene = new THREE.Scene();
        sceneAtmosphere = new THREE.Scene();

        var geometry = new THREE.SphereGeometry(150, 40, 30);

        shader = Shaders['earth'];
        uniforms = THREE.UniformsUtils.clone(shader.uniforms);

        uniforms['texture'].value = THREE.ImageUtils.loadTexture('world.jpg');

        material = new THREE.ShaderMaterial({

            uniforms:uniforms,
            vertexShader:shader.vertexShader,
            fragmentShader:shader.fragmentShader

        });

        mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.y = Math.PI;
        globe3d = mesh;
        scene.add(mesh);

        shader = Shaders['atmosphere'];
        uniforms = THREE.UniformsUtils.clone(shader.uniforms);

        material = new THREE.ShaderMaterial({

            uniforms:uniforms,
            vertexShader:shader.vertexShader,
            fragmentShader:shader.fragmentShader,
            side:THREE.BackSide

        });

        mesh = new THREE.Mesh(geometry, material);
        mesh.scale.x = mesh.scale.y = mesh.scale.z = 1.1;
        sceneAtmosphere.add(mesh);

        projector = new THREE.Projector();

        geometry = new THREE.CubeGeometry(0.75, 0.75, 1, 1, 1, 1, undefined, { px:true,
            nx:true, py:true, ny:true, pz:false, nz:true});

        geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0.5));

        point = new THREE.Mesh(geometry);

        renderer = new THREE.WebGLRenderer({antialias:true});
        renderer.autoClear = false;
        renderer.setSize(w, h);

//    renderer.domElement.style.position = 'absolute';

        container.appendChild(renderer.domElement);

        container.addEventListener('mousedown', onMouseDown, false);
        container.addEventListener('mousewheel', onMouseWheel, false);
        container.addEventListener('dblclick', onDoubleClick, false);

        document.addEventListener('keydown', onDocumentKeyDown, false);

        window.addEventListener('resize', onWindowResize, false);

        container.addEventListener('mouseover', function () {
            overRenderer = true;
        }, false);

        container.addEventListener('mouseout', function () {
            overRenderer = false;
        }, false);
    }

    addData = function (data, opts) {
        var lat, lng, size, color, i, step, colorFnWrapper;

        opts.animated = opts.animated || false;
        this.is_animated = opts.animated;
        opts.format = opts.format || 'magnitude'; // other option is 'legend'
        if (opts.format === 'magnitude') {
            step = 3;
            colorFnWrapper = function (data, i) {
                return colorFn(data[i + 2]);
            }
        } else if (opts.format === 'legend') {
            step = 4;
            colorFnWrapper = function (data, i) {
                return colorFn(data[i + 3]);
            }
        } else {
            throw('error: format not supported: ' + opts.format);
        }

        if (opts.animated) {
            if (this._baseGeometry === undefined) {
                this._baseGeometry = new THREE.Geometry();
                for (i = 0; i < data.length; i += step) {
                    lat = data[i];
                    lng = data[i + 1];
//        size = data[i + 2];
                    color = colorFnWrapper(data, i);
                    size = 0;
                    addPoint(lat, lng, size, color, this._baseGeometry);
                }
            }
            if (this._morphTargetId === undefined) {
                this._morphTargetId = 0;
            } else {
                this._morphTargetId += 1;
            }
            opts.name = opts.name || 'morphTarget' + this._morphTargetId;
        }
        var subgeo = new THREE.Geometry();
        for (i = 0; i < data.length; i += step) {
            lat = data[i];
            lng = data[i + 1];
            color = colorFnWrapper(data, i);
            size = data[i + 2];
            size = size * 150;
            addPoint(lat, lng, size, color, subgeo);
        }
        if (opts.animated) {
            this._baseGeometry.morphTargets.push({'name':opts.name, vertices:subgeo.vertices});
        } else {
            this._baseGeometry = subgeo;
        }

    };

    function createPoints() {
        if (this._baseGeometry !== undefined) {
            if (this.is_animated === false) {
                this.points = new THREE.Mesh(this._baseGeometry, new THREE.MeshBasicMaterial({
                    color:0xffffff,
                    vertexColors:THREE.FaceColors,
                    morphTargets:false
                }));
                console.log(this.points)
            } else {
                if (this._baseGeometry.morphTargets.length < 8) {
                    console.log('t l', this._baseGeometry.morphTargets.length);
                    var padding = 8 - this._baseGeometry.morphTargets.length;
                    console.log('padding', padding);
                    for (var i = 0; i <= padding; i++) {
                        console.log('padding', i);
                        this._baseGeometry.morphTargets.push({'name':'morphPadding' + i, vertices:this._baseGeometry.vertices});
                    }
                }
                this.points = new THREE.Mesh(this._baseGeometry, new THREE.MeshBasicMaterial({
                    color:0xffffff,
                    vertexColors:THREE.FaceColors,
                    morphTargets:true
                }));
            }
            this.points.name = "points"
            scene.add(this.points);
        }
    }

    function addPoint(lat, lng, size, color, subgeo) {
        var phi = (90 - lat) * Math.PI / 180;
        var theta = (180 - lng) * Math.PI / 180;

        point.position.x = 150 * Math.sin(phi) * Math.cos(theta);
        point.position.y = 150 * Math.cos(phi);
        point.position.z = 150 * Math.sin(phi) * Math.sin(theta);

        point.lookAt(mesh.position);

        point.scale.z = -size;
        point.updateMatrix();

        for (var i = 0; i < point.geometry.faces.length; i++) {
            point.geometry.faces[i].color = color;
        }

        THREE.GeometryUtils.merge(subgeo, point);
    }

    function onMouseDown(event) {
        event.preventDefault();

        container.addEventListener('mousemove', onMouseMove, false);
        container.addEventListener('mouseup', onMouseUp, false);
        container.addEventListener('mouseout', onMouseOut, false);

        mouseOnDown.x = -event.clientX;
        mouseOnDown.y = event.clientY;

        targetOnDown.x = target.x;
        targetOnDown.y = target.y;

        container.style.cursor = 'move';
    }

    function onMouseMove(event) {
        mouse.x = -event.clientX;
        mouse.y = event.clientY;

        var zoomDamp = distance / 1000;

        target.x = targetOnDown.x + (mouse.x - mouseOnDown.x) * 0.005 * zoomDamp;
        target.y = targetOnDown.y + (mouse.y - mouseOnDown.y) * 0.005 * zoomDamp;

        target.y = target.y > PI_HALF ? PI_HALF : target.y;
        target.y = target.y < -PI_HALF ? -PI_HALF : target.y;
    }

    function onMouseUp(event) {
        container.removeEventListener('mousemove', onMouseMove, false);
        container.removeEventListener('mouseup', onMouseUp, false);
        container.removeEventListener('mouseout', onMouseOut, false);
        container.style.cursor = 'auto';
    }

    function onMouseOut(event) {
        container.removeEventListener('mousemove', onMouseMove, false);
        container.removeEventListener('mouseup', onMouseUp, false);
        container.removeEventListener('mouseout', onMouseOut, false);
    }

    function onMouseWheel(event) {
        event.preventDefault();
        if (overRenderer) {
            zoom(event.wheelDeltaY * 0.3, true);
        }
        return false;
    }

    function onDocumentKeyDown(event) {
        switch (event.keyCode) {
            case 38:
                zoom(50, true);
                event.preventDefault();
                break;
            case 40:
                zoom(-50, true);
                event.preventDefault();
                break;
        }
    }

    function onWindowResize(event) {
        return;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

 function onDoubleClick(event) {
        event.preventDefault();

        var canvas = renderer.domElement;
        var vector = new THREE.Vector3( ( (event.offsetX) / canvas.width ) * 2 - 1, - ( (event.offsetY) / canvas.height) * 2 + 1, 0.5 );

        projector.unprojectVector( vector, camera );

        var ray = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

        var intersects = ray.intersectObject(globe3d);
        console.log(intersects)

        if (intersects.length > 0) {

            object = intersects[0];

            r = 150 //object.object.boundRadius;
            x = object.point.x;
            y = object.point.y;
            z = object.point.z;

            lat = 90 - (Math.acos(y / r)) * 180 / Math.PI;
            lon = ((270 + (Math.atan2(x, z)) * 180 / Math.PI) % 360) - 180;

            lat = Math.round(lat * 100000) / 100000;
            lon = Math.round(lon * 100000) / 100000;
            console.log(lat, lon)
            
            latBounds = [lat + 0.25, lat - 0.25];
            lonBounds = [lon + 0.25, lon - 1];
            
            
           	pointsInRadius = _.filter(globals.points, function(d){
           		return (((+d.latitude < d3.max(latBounds)) && (+d.latitude > d3.min(latBounds)))
           		&&
           		((+d.longitude < d3.max(lonBounds)) && (+d.longitude > d3.min(lonBounds)))
           		)
           	})
           	console.log("Found: " + pointsInRadius.length)
           	// newCloud = new THREE.Geometry();
//            	
//            	
           	// for (var i = 0; i< pointsInRadius.length; i++){
           		// d = pointsInRadius[i]
				// lat = +d.latitude
				// lon = +d.longitude 
				// vec = latLongToVector3(lat, lon)
				// vec.name = d.locationID
            	// newCloud.vertices.push(vec);
           	// }
//            	
            // var newMaterial = new THREE.PointCloudMaterial( { size: 1, color: new THREE.Color("rgb(91, 113, 156)"), sizeAttenuation: false } );
        	// var cloud = new THREE.PointCloud( newCloud, newMaterial );
       		 // globe.scene.add( cloud );
//            	
		    animate();
        }
    }

    function zoom(delta, s) {
        distanceTarget -= delta;
        distanceTarget = distanceTarget > 1100 ? 1100 : distanceTarget;
        distanceTarget = distanceTarget < 500 ? 500 : distanceTarget;

    }

    function animate() {
        requestAnimationFrame(animate);
        render();
    }

    function render() {

        zoom(curZoomSpeed);

        rotation.x += (target.x - rotation.x) * 0.1;
        rotation.y += (target.y - rotation.y) * 0.1;
        distance += (distanceTarget - distance) * 0.3;

        camera.position.x = distance * Math.sin(rotation.x) * Math.cos(rotation.y);
        camera.position.y = distance * Math.sin(rotation.y);
        camera.position.z = distance * Math.cos(rotation.x) * Math.cos(rotation.y);
        camera.lookAt(scene.position);

        vector.copy(camera.position);

        renderer.clear();
        renderer.render(scene, camera);
        renderer.render(sceneAtmosphere, camera);
    }

    init();
    this.animate = animate;


    this.__defineGetter__('time', function () {
        return this._time || 0;
    });

    this.__defineSetter__('time', function (t) {
        var validMorphs = [];
        var morphDict = this.points.morphTargetDictionary;
        for (var k in morphDict) {
            if (k.indexOf('morphPadding') < 0) {
                validMorphs.push(morphDict[k]);
            }
        }
        validMorphs.sort();
        var l = validMorphs.length - 1;
        var scaledt = t * l + 1;
        var index = Math.floor(scaledt);
        for (i = 0; i < validMorphs.length; i++) {
            this.points.morphTargetInfluences[validMorphs[i]] = 0;
        }
        var lastIndex = index - 1;
        var leftover = scaledt - index;
        if (lastIndex >= 0) {
            this.points.morphTargetInfluences[lastIndex] = 1 - leftover;
        }
        this.points.morphTargetInfluences[index] = leftover;
        this._time = t;
    });

    this.addData = addData;
    this.createPoints = createPoints;
    this.renderer = renderer;
    this.scene = scene;
    this.zoom = zoom;
    this.camera = camera
    this.render = render
    this.renderer = renderer
	

    return this;

};

