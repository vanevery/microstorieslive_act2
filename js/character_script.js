//THREE.JS
	var threeJSContainer;
	
	var width = 900, height = 400;
	var camera, scene, renderer;

	//BEAR
	var joints = [];
	var jointsPos = [
		new THREE.Vector3(0, 4, 0),		//neck
		new THREE.Vector3(0, -4, 0),	//body
		new THREE.Vector3(15, 4, 0),	//HR1
		new THREE.Vector3(10, 4, 0),		//HR2
		new THREE.Vector3(-15, 4, 0),	//HL1
		new THREE.Vector3(-10, 4, 0),	//HL2
		new THREE.Vector3(2, -18.5, 0),	//LR1
		new THREE.Vector3(2, -12, 0),	//LR2
		new THREE.Vector3(-2, -18.5, 0),	//LL1
		new THREE.Vector3(-2, -12, 0)	//LL2
	];

	var headTex, bodyTex, armULTex, armDLTex, armURTex, armDRTex,
		legULTex, legDLTex, legURTex, legDRTex;


function to2DXY(position) {

	// this will give us position relative to the world
	var p = position.clone();

	// projectVector will translate position to 2d
	//v = projector.projectVector(p, camera);
	var v = p.unproject(camera);

	// translate our vector so that percX=0 represents
	// the left edge, percX=1 is the right edge,
	// percY=0 is the top edge, and percY=1 is the bottom edge.
	var percX = (v.x + 1) / 2;
	var percY = (-v.y + 1) / 2;

	// scale these values to our viewport size
	var x = percX * width/10000 * width;
	var y = percY * height/10000 * height;

	return {x: x, y: y};
}


function initThreeJS() {
	console.log("initThreeJS");

	//SET_UP
	threeJSContainer = document.getElementById('charactercanvas');

	camera = new THREE.PerspectiveCamera(50, width / height, 1, 10000);
	camera.position.set(0,0,50);

	scene = new THREE.Scene();

	var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
	directionalLight.position.set( 1, 1, 0 );
	scene.add( directionalLight );

	directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
	directionalLight.position.set( 0.3, 0, 1 );
	scene.add( directionalLight );

	directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
	directionalLight.position.set( -0.3, 0, -1 );
	scene.add( directionalLight );
	
	var modelMaterial = new THREE.MeshFaceMaterial;

	// headTex, bodyTex, armULTex, armDLTex, armURTex, armDRTex,
	// legULTex, legDLTex, legURTex, legDRTex;

	// stickBear!
	headTex = THREE.ImageUtils.loadTexture('images/stickBear_head.png');
	bodyTex = THREE.ImageUtils.loadTexture('images/stickBear_body2.png');
	armULTex = THREE.ImageUtils.loadTexture('images/stickBear_armUL.png');
	armDLTex = THREE.ImageUtils.loadTexture('images/stickBear_armDL.png');
	armURTex = THREE.ImageUtils.loadTexture('images/stickBear_armUR.png');
	armDRTex = THREE.ImageUtils.loadTexture('images/stickBear_armDR.png');
	legULTex = THREE.ImageUtils.loadTexture('images/stickBear_legUL.png');
	legDLTex = THREE.ImageUtils.loadTexture('images/stickBear_legDL.png');
	legURTex = THREE.ImageUtils.loadTexture('images/stickBear_legUR.png');
	legDRTex = THREE.ImageUtils.loadTexture('images/stickBear_legDR.png');

	buildStickBear( headTex, bodyTex, armULTex, armDLTex, armURTex, armDRTex,
				    legULTex, legDLTex, legURTex, legDRTex );

	//RENDERER
		renderer = new THREE.WebGLRenderer( {antialias: true, alpha: true, opacity: .5} );
		renderer.setClearColor(0x000000, 0);
		renderer.sortObjects = false;
		renderer.autoClear = true;
		renderer.setSize( width, height );
		threeJSContainer.appendChild(renderer.domElement);
		
	animate();
}

function buildStickBear( headTex, bodyTex, armULTex, armDLTex, armURTex, armDRTex,
	legULTex, legDLTex, legURTex, legDRTex ){
	
	//HEAD
		// var headGeo = new THREE.SphereGeometry(4,16,16);
		var headGeo = new THREE.PlaneGeometry(12,8);
		transY(headGeo, 4);
		var manMat = new THREE.MeshLambertMaterial({map: headTex, transparent: true, alphaTest: 0.5, side: THREE.DoubleSide});
		head = new THREE.Mesh(headGeo, manMat);
		// head.rotation.y = 45 * (Math.PI/180);
		head.position.set(0,5,0);
		scene.add(head);

	//BODY
		var bodyGeo = new THREE.PlaneGeometry(8,10);
		var bG = bodyGeo.clone();

		var rotation = new THREE.Matrix4().makeRotationY(-Math.PI/2);
		bG.applyMatrix(rotation);
		rotation = new THREE.Matrix4().makeRotationX(Math.PI/2);
		bG.applyMatrix(rotation);
		bG.verticesNeedUpdate = true;

		transZ(bG, 4);
		manMat = new THREE.MeshLambertMaterial({map: bodyTex, transparent: true, alphaTest: 0.5, side: THREE.DoubleSide});
		body = new THREE.Mesh(bG, manMat);
		body.position.copy(jointsPos[1]);
		scene.add(body);


	//ARM
		var armGeo = new THREE.PlaneGeometry(6,2.5);
		var aG = armGeo.clone();
		rotation = new THREE.Matrix4().makeRotationY(-Math.PI/2);
		aG.applyMatrix(rotation);
		// rotation = new THREE.Matrix4().makeRotationX(Math.PI/2);
		// bG.applyMatrix(rotation);
		aG.verticesNeedUpdate = true;
		transZ(aG, 3);
		manMat = new THREE.MeshLambertMaterial({map: armULTex, transparent: true, alphaTest: 0.5, side: THREE.DoubleSide});
		hL2 = new THREE.Mesh(aG, manMat);
		hL2.position.set(0,4,0);
		scene.add(hL2);


		aG = armGeo.clone();
		rotation = new THREE.Matrix4().makeRotationY(-Math.PI/2);
		aG.applyMatrix(rotation);
		aG.verticesNeedUpdate = true;
		transZ(aG, 3);
		manMat = new THREE.MeshLambertMaterial({map: armURTex, transparent: true, alphaTest: 0.5, side: THREE.DoubleSide});
		hR2 = new THREE.Mesh(aG, manMat);
		hR2.position.set(0,4,0);
		scene.add(hR2);


		armGeo = new THREE.PlaneGeometry(6.5,3);
		aG = armGeo.clone();
		rotation = new THREE.Matrix4().makeRotationY(-Math.PI/2);
		aG.applyMatrix(rotation);
		aG.verticesNeedUpdate = true;
		transZ(aG, 3);
		manMat = new THREE.MeshLambertMaterial({map: armDLTex, transparent: true, alphaTest: 0.5, side: THREE.DoubleSide});
		hL1 = new THREE.Mesh(aG, manMat);
		hL1.position.set(-5,4,0);
		scene.add(hL1);


		aG = armGeo.clone();
		rotation = new THREE.Matrix4().makeRotationY(Math.PI/2);
		aG.applyMatrix(rotation);
		aG.verticesNeedUpdate = true;
		transZ(aG, 3);
		manMat = new THREE.MeshLambertMaterial({map: armDRTex, transparent: true, alphaTest: 0.5, side: THREE.DoubleSide});
		hR1 = new THREE.Mesh(aG, manMat);
		hR1.position.set(5,4,0);
		scene.add(hR1);

	//LEG
		var legGeo = new THREE.PlaneGeometry(8,3);
		var lG = legGeo.clone();
		rotation = new THREE.Matrix4().makeRotationY(-Math.PI/2);
		lG.applyMatrix(rotation);
		lG.verticesNeedUpdate = true;
		transZ(lG, 3);
		manMat = new THREE.MeshLambertMaterial({map: legULTex, transparent: true, alphaTest: 0.5, side: THREE.DoubleSide});
		lL2 = new THREE.Mesh(lG, manMat);
		// lL2.rotation.z = -20 * (Math.PI/180);
		// lL2.position.set(-2,-7,0);
		scene.add(lL2);

		lG = legGeo.clone();
		rotation = new THREE.Matrix4().makeRotationY(-Math.PI/2);
		lG.applyMatrix(rotation);
		lG.verticesNeedUpdate = true;
		transZ(lG, 3);
		manMat = new THREE.MeshLambertMaterial({map: legURTex, transparent: true, alphaTest: 0.5, side: THREE.DoubleSide});
		lR2 = new THREE.Mesh(lG, manMat);
		// lR2.rotation.z = 20 * (Math.PI/180);
		// lR2.position.set(2,-7,0);
		scene.add(lR2);

		legGeo = new THREE.PlaneGeometry(3,8);
		lG = legGeo.clone();
		rotation = new THREE.Matrix4().makeRotationX(-Math.PI/2);
		lG.applyMatrix(rotation);
		rotation = new THREE.Matrix4().makeRotationZ(-Math.PI/2);
		lG.applyMatrix(rotation);
		lG.verticesNeedUpdate = true;
		transZ(lG, 3);
		manMat = new THREE.MeshLambertMaterial({map: legDLTex, transparent: true, alphaTest: 0.5, side: THREE.DoubleSide});
		lL1 = new THREE.Mesh(lG, manMat);
		// lL1.position.set(-3,-13,0);
		scene.add(lL1);

		lG = legGeo.clone();
		rotation = new THREE.Matrix4().makeRotationX(-Math.PI/2);
		lG.applyMatrix(rotation);
		rotation = new THREE.Matrix4().makeRotationZ(-Math.PI/2);
		lG.applyMatrix(rotation);
		lG.verticesNeedUpdate = true;
		transZ(lG, 3);
		manMat = new THREE.MeshLambertMaterial({map: legDRTex, transparent: true, alphaTest: 0.5, side: THREE.DoubleSide});
		lR1 = new THREE.Mesh(lG, manMat);
		// lR1.position.set(3,-13,0);
		scene.add(lR1);

	//JOINTS
		var jointGeo = new THREE.SphereGeometry(0.5, 8, 8);
		var jointMat = new THREE.MeshLambertMaterial({color: 0x01eed8});

		for(var i=0; i<jointsPos.length; i++){
			var j = new THREE.Mesh(jointGeo.clone(), jointMat);
			j.position.copy(jointsPos[i]);
			j.oriPos = (jointsPos[i]);
			joints.push(j);
			scene.add(j);
		}
}


function animate() {
	requestAnimationFrame(animate);
	update();
	renderer.render(scene, camera);
}

function update(){

	//STICK_MAN
		var vecTmp = new THREE.Vector3();

		//HEAD
			head.position.copy(joints[0].position);

			//SCALE_TIME!
				headMoveX = (joints[0].position.x - jointsPos[0].x);
				headMoveY = (jointsPos[0].y - joints[0].position.y);
				sqrtHeadMoveY = Math.sqrt(Math.pow(headMoveY, 2));

			body.lookAt(joints[0].position);
			body.position.copy(joints[1].position);

			//SCALE_TIME!
				bMoveX = Math.sqrt(Math.pow((joints[1].position.x - jointsPos[1].x), 2));
				bMoveY = (jointsPos[1].y - joints[1].position.y);

				body.scale.set(1, 1, 1+(bMoveX/15 + bMoveY/10 - headMoveY/8));

		//LEFT_HAND
			hL2.lookAt(joints[5].position);
			hL2.position.copy(joints[0].position);

			//SCALE_TIME!
				//relate to BODY 
				// hL2MoveX = Math.sqrt(Math.pow(headMoveX, 2));
				// hL2MoveY = Math.sqrt(Math.pow(headMoveY, 2));

				//relate to joints[5] 
				hL2MoveX = Math.sqrt(Math.pow((joints[0].position.x - joints[5].position.x), 2))-5;
				hL2MoveY = Math.sqrt(Math.pow((joints[0].position.y - joints[5].position.y), 2));

				// hL2.scale.set(1, 1, 1+( hL2MoveX/8 + hL2MoveY/10 + hL2MoveX2/8 + hL2MoveY2/15 ));
				hL2.scale.set(1, 1, 1+( hL2MoveX/8 + hL2MoveY/10 ));

			hL1.lookAt(joints[4].position);
			hL1.position.copy(joints[5].position);

			//SCALE_TIME!
				//relate to joints[5] 
				hL1MoveX = Math.sqrt(Math.pow((joints[4].position.x - joints[5].position.x), 2))-5;
				hL1MoveY = Math.sqrt(Math.pow((joints[4].position.y - joints[5].position.y), 2));

				hL1.scale.set(1, 1, 1+( hL1MoveX/15 + hL1MoveY/15 ));

		//RIGHT_HAND
			hR2.lookAt(joints[3].position);
			hR2.position.copy(joints[0].position);

			//SCALE_TIME!
				//relate to joints[3] 
				hR2MoveX = Math.sqrt(Math.pow((joints[0].position.x - joints[3].position.x), 2))-5;
				hR2MoveY = Math.sqrt(Math.pow((joints[0].position.y - joints[3].position.y), 2));

				hR2.scale.set(1, 1, 1+( hR2MoveX/8 + hR2MoveY/10 ));

			hR1.lookAt(joints[2].position);
			hR1.position.copy(joints[3].position);

				//SCALE_TIME!
				//relate to joints[2] 
				hR1MoveX = Math.sqrt(Math.pow((joints[2].position.x - joints[3].position.x), 2))-5;
				hR1MoveY = Math.sqrt(Math.pow((joints[2].position.y - joints[3].position.y), 2));

				hR1.scale.set(1, 1, 1+( hR1MoveX/8 + hR1MoveY/10 ));

		//LEFT_LEG
			lL2.lookAt(joints[9].position);
			lL2.position.copy(joints[1].position);

				//SCALE_TIME!
				//relate to joints[9] 
				lL2MoveX = Math.sqrt(Math.pow((joints[1].position.x - joints[9].position.x), 2))-3;
				lL2MoveY = Math.sqrt(Math.pow((joints[1].position.y - joints[9].position.y), 2))-5;

				lL2.scale.set(1, 1, 1+( lL2MoveX/8 + lL2MoveY/9 ));

			lL1.lookAt(joints[8].position);
			lL1.position.copy(joints[9].position);

				//SCALE_TIME!
				//relate to joints[8] 
				lL1MoveX = Math.sqrt(Math.pow((joints[8].position.x - joints[9].position.x), 2));
				lL1MoveY = Math.sqrt(Math.pow((joints[8].position.y - joints[9].position.y), 2))-6;

				lL1.scale.set(1, 1, 1+( lL1MoveX/12 + lL1MoveY/12 ));

		//RIGHT_LEG
			lR2.lookAt(joints[7].position);
			lR2.position.copy(joints[1].position);

				//SCALE_TIME!
				//relate to joints[7] 
				lR2MoveX = Math.sqrt(Math.pow((joints[1].position.x - joints[7].position.x), 2))-3;
				lR2MoveY = Math.sqrt(Math.pow((joints[1].position.y - joints[7].position.y), 2))-5;

				lR2.scale.set(1, 1, 1+( lR2MoveX/8 + lR2MoveY/9 ));

			lR1.lookAt(joints[6].position);
			lR1.position.copy(joints[7].position);

				//SCALE_TIME!
				//relate to joints[6] 
				lR1MoveX = Math.sqrt(Math.pow((joints[6].position.x - joints[7].position.x), 2));
				lR1MoveY = Math.sqrt(Math.pow((joints[6].position.y - joints[7].position.y), 2))-6;

				lR1.scale.set(1, 1, 1+( lR1MoveX/12 + lR1MoveY/12 ));	
	
}

function transX(geo, n){
	for(var i=0; i<geo.vertices.length; i++){
		geo.vertices[i].x += n;
	}
}

function transZ(geo, n){
	for(var i=0; i<geo.vertices.length; i++){
		geo.vertices[i].z += n;
	}
}

function transY(geo, n){
	for(var i=0; i<geo.vertices.length; i++){
		geo.vertices[i].y += n;
	}
}
