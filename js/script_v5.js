//THREE.JS
	var threeJSContainer;
	var stats
	
	var width = 900, height = 400;
	var camera, scene, renderer;

	//BEAR
	var joints = [];
	var jointsPos = [
		new THREE.Vector3(0, 4, 0),			//neck
		new THREE.Vector3(0, -4, 0),		//body
		new THREE.Vector3(15, 4, 0),		//HR1
		new THREE.Vector3(10, 4, 0),		//HR2
		new THREE.Vector3(-15, 4, 0),		//HL1
		new THREE.Vector3(-10, 4, 0),		//HL2
		new THREE.Vector3(2, -18.5, 0),		//LR1
		new THREE.Vector3(2, -12, 0),		//LR2
		new THREE.Vector3(-2, -18.5, 0),	//LL1
		new THREE.Vector3(-2, -12, 0)		//LL2
	];

	var headTex, bodyTex, armULTex, armDLTex, armURTex, armDRTex,
		legULTex, legDLTex, legURTex, legDRTex;

	// save the width and height of the texture to build geometry and scaling references 
	var headTexWidth, bodyTexWidth, armULTexWidth, armDLTexWidth, armURTexWidth,
		armDRTexWidth, legULTexWidth, legDLTexWidth, legURTexWidth, legDRTexWidth,
		headTexHeight, bodyTexHeight, armULTexHeight, armDLTexHeight, armURTexHeight,
		armDRTexHeight, legULTexHeight, legDLTexHeight, legURTexHeight, legDRTexHeight;

	// for model drawing
	var hand3P, hand2P, handDrawPercX, handDrawPercY;

	// for audience drawing
	var lineMaterial, lineGeometry, audienceLines = [], pointsForEachDraw = [];

	// elmo
	var elmoGeo, elmoTex, elmoMat;
	var elmoRigGeo, elmoRig, elmoBone;
	var mouthStep=1;

	var lengthForRot, rotForJoint;


// version_v1
function to2DXY_v0(position) {

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

// version_v2
function to2DXY(position) {

	// this will give us position relative to the world
	// if the parent of the object is scene, it's matrixWorld == local transform
	var p = position.clone();

	// translate position to 2d
	var v = p.project(camera);

	// translate our vector to our viewport size
	var percX = Math.round(( v.x + 1) * width  / 2);
	var percY = Math.round((-v.y + 1) * height / 2);

	return {x: percX, y: percY};
}


function createAudienceDraw( vectorArray ) {

	// restore the mouse history
	var data = vectorArray;
	lineGeometry = new THREE.Geometry();

	var xMiddle, yMiddle;

	// push the mouse position history into line geometry
	for(var i=0; i<data.length; i++){
		lineGeometry.vertices.push( new THREE.Vector3( data[i].x, data[i].y, data[i].z ) );
	}

	// find center point
	if( data.length%2 == 0 ){
		xMiddle = data[data.length/2].x;
		yMiddle = data[data.length/2].y;
	} else {
		xMiddle = data[((data.length-1)/2)].x;
		yMiddle = data[((data.length-1)/2)].y;
	}
	
	THREE.GeometryUtils.center( lineGeometry )
	lineGeometry.verticesNeedUpdate = true;
	lineGeometry.dynamic = true;

	// locate the line at center point
	var line = new THREE.Line(lineGeometry, lineMaterial);
	line.position.set( xMiddle, yMiddle, 0 );

	line.matrixAutoUpdate = true;


	audienceLines.push(line);
	scene.add(line);

	// clear and restart
	pointsForEachDraw = [];
}


var textureLoaded = false, characterBuilt = false;

function initThreeJS() {
	console.log("initThreeJS");

	//SET_UP
		threeJSContainer = document.getElementById('charactercanvas');

		camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 10000);
		camera.position.set(0,0,80);

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
	
	// material for character
		// var modelMaterial = new THREE.MeshFaceMaterial;

	// textures for 2D character
		headTex = THREE.ImageUtils.loadTexture('images/stickBear_head.png', undefined, function(){
			console.log("read!");
			console.log(headTex.image.width);			
			textureLoaded = true;
		});
		bodyTex = THREE.ImageUtils.loadTexture('images/stickBear_body2.png');
		armULTex = THREE.ImageUtils.loadTexture('images/stickBear_armUL.png');
		armDLTex = THREE.ImageUtils.loadTexture('images/stickBear_armDL.png');
		armURTex = THREE.ImageUtils.loadTexture('images/stickBear_armUR.png');
		armDRTex = THREE.ImageUtils.loadTexture('images/stickBear_armDR.png');
		legULTex = THREE.ImageUtils.loadTexture('images/stickBear_legUL.png');
		legDLTex = THREE.ImageUtils.loadTexture('images/stickBear_legDL.png');
		legURTex = THREE.ImageUtils.loadTexture('images/stickBear_legUR_v2.png');
		legDRTex = THREE.ImageUtils.loadTexture('images/stickBear_legDR.png');

	// build 2D character
	setTimeout(function(){
		buildCharacter( headTex, bodyTex, armULTex, armDLTex, armURTex, armDRTex,
				    legULTex, legDLTex, legURTex, legDRTex );

	}, 500);


	// build ELMO
		elmoMat = new THREE.MeshLambertMaterial( {color: 0xff0000} );
		loadModelElmo("models/elmo8.js",elmoMat);
		


	// setUp for audienceDraw
	// ref: https://github.com/mrdoob/three.js/wiki/Drawing-lines
	lineMaterial = new THREE.LineBasicMaterial({color: 0xffff00});
	/*
	lineGeometry = new THREE.Geometry();
	lineGeometry.vertices.push( new THREE.Vector3(-10,-10,0) );
	lineGeometry.vertices.push( new THREE.Vector3(0,0,0) );
	lineGeometry.vertices.push( new THREE.Vector3(10,10,0) );
	var line = new THREE.Line(lineGeometry, lineMaterial);
	audienceLines.push(line);
	scene.add(line);
	*/
		
	// RENDERER
		renderer = new THREE.WebGLRenderer( {antialias: true, alpha: true, opacity: .5} );
		renderer.setClearColor(0x000000, 0);
		renderer.sortObjects = false;
		renderer.autoClear = true;
		renderer.setSize( width, height );
		threeJSContainer.appendChild(renderer.domElement);

	// STATE(to show framerate)
		stats = new Stats();
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.bottom = '5px';
		stats.domElement.style.zIndex = 100;
		stats.domElement.children[ 0 ].style.background = "transparent";
		stats.domElement.children[ 0 ].children[1].style.display = "none";
		threeJSContainer.appendChild(stats.domElement);
		
	animate();
}

function buildCharacter( headTex, bodyTex, armULTex, armDLTex, armURTex, armDRTex,legULTex, legDLTex, legURTex, legDRTex ){

	// build plane geometry based on the texture image size
	// for now are scaled down by divided by 111

	//HEAD
		headTexHeight = headTex.image.height/111, headTexWidth = headTex.image.width/111;
		var headGeo = new THREE.PlaneGeometry(headTexWidth, headTexHeight);
		transY(headGeo, 4);			// offset the geometry to be the position I want
		var manMat = new THREE.MeshLambertMaterial({map: headTex, transparent: true, alphaTest: 0.5, side: THREE.DoubleSide});
		head = new THREE.Mesh(headGeo, manMat);
		scene.add(head);

	//BODY
		bodyTexWidth = bodyTex.image.width/111, bodyTexHeight = bodyTex.image.height/111;
		var bodyGeo = new THREE.PlaneGeometry(bodyTexWidth, bodyTexHeight);
		var bG = bodyGeo.clone();

		var rotation = new THREE.Matrix4().makeRotationY(-Math.PI/2);
		bG.applyMatrix(rotation);
		rotation = new THREE.Matrix4().makeRotationX(Math.PI/2);
		bG.applyMatrix(rotation);
		bG.verticesNeedUpdate = true;

		transZ(bG, 4);
		manMat = new THREE.MeshLambertMaterial({map: bodyTex, transparent: true, alphaTest: 0.5, side: THREE.DoubleSide});
		body = new THREE.Mesh(bG, manMat);
		scene.add(body);

	//ARM
		// hand_left_near
		armULTexWidth = armURTexWidth = armULTex.image.width/111, armULTexHeight = armURTexHeight = armULTex.image.height/111;
		var armGeo = new THREE.PlaneGeometry(armULTexWidth, armULTexHeight);
		// var armGeo = new THREE.PlaneGeometry(6,2.5);
		var aG = armGeo.clone();
		rotation = new THREE.Matrix4().makeRotationY(-Math.PI/2);
		aG.applyMatrix(rotation);
		aG.verticesNeedUpdate = true;
		transZ(aG, 3);
		manMat = new THREE.MeshLambertMaterial({map: armULTex, transparent: true, alphaTest: 0.5, side: THREE.DoubleSide});
		hL2 = new THREE.Mesh(aG, manMat);
		scene.add(hL2);

		// hand_right_near
		// armURTexWidth = armURTex.image.width/111, armURTexHeight = armURTex.image.height/111;
		aG = armGeo.clone();
		rotation = new THREE.Matrix4().makeRotationY(-Math.PI/2);
		aG.applyMatrix(rotation);
		aG.verticesNeedUpdate = true;
		transZ(aG, 3);
		manMat = new THREE.MeshLambertMaterial({map: armURTex, transparent: true, alphaTest: 0.5, side: THREE.DoubleSide});
		hR2 = new THREE.Mesh(aG, manMat);
		scene.add(hR2);

		// hand_left_far
		armDLTexWidth = armDRTexWidth = armDLTex.image.width/111, armDLTexHeight = armDRTexHeight= armDLTex.image.height/111;
		armGeo = new THREE.PlaneGeometry(armDLTexWidth, armDLTexHeight);
		// armGeo = new THREE.PlaneGeometry(6.5,3);
		aG = armGeo.clone();
		rotation = new THREE.Matrix4().makeRotationY(-Math.PI/2);
		aG.applyMatrix(rotation);
		aG.verticesNeedUpdate = true;
		transZ(aG, 3);
		manMat = new THREE.MeshLambertMaterial({map: armDLTex, transparent: true, alphaTest: 0.5, side: THREE.DoubleSide});
		hL1 = new THREE.Mesh(aG, manMat);
		scene.add(hL1);

		// hand_right_far
		aG = armGeo.clone();
		rotation = new THREE.Matrix4().makeRotationY(Math.PI/2);
		aG.applyMatrix(rotation);
		aG.verticesNeedUpdate = true;
		transZ(aG, 3);
		manMat = new THREE.MeshLambertMaterial({map: armDRTex, transparent: true, alphaTest: 0.5, side: THREE.DoubleSide});
		hR1 = new THREE.Mesh(aG, manMat);
		scene.add(hR1);

	//LEG
		// leg_left_near
		legULTexWidth = legURTexWidth = legULTex.image.width/111, legULTexHeight = legURTexHeight= legULTex.image.height/111;
		var legGeo = new THREE.PlaneGeometry(legULTexWidth, legULTexHeight);
		// var legGeo = new THREE.PlaneGeometry(8,3);
		var lG = legGeo.clone();
		rotation = new THREE.Matrix4().makeRotationX(-Math.PI/2);
		lG.applyMatrix(rotation);
		rotation = new THREE.Matrix4().makeRotationZ(-Math.PI/2);
		lG.applyMatrix(rotation);
		lG.verticesNeedUpdate = true;
		transZ(lG, 3);
		manMat = new THREE.MeshLambertMaterial({map: legULTex, transparent: true, alphaTest: 0.5, side: THREE.DoubleSide});
		lL2 = new THREE.Mesh(lG, manMat);
		scene.add(lL2);

		// leg_right_near
		lG = legGeo.clone();
		rotation = new THREE.Matrix4().makeRotationX(-Math.PI/2);
		lG.applyMatrix(rotation);
		rotation = new THREE.Matrix4().makeRotationZ(-Math.PI/2);
		lG.applyMatrix(rotation);
		lG.verticesNeedUpdate = true;
		transZ(lG, 3);
		manMat = new THREE.MeshLambertMaterial({map: legURTex, transparent: true, alphaTest: 0.5, side: THREE.DoubleSide});
		lR2 = new THREE.Mesh(lG, manMat);
		scene.add(lR2);

		// leg_left_far
		legDLTexWidth = legDRTexWidth = legDLTex.image.width/111, legDLTexHeight = legDRTexHeight = legDLTex.image.height/111;
		legGeo = new THREE.PlaneGeometry(legDLTexWidth, legDLTexHeight);
		// legGeo = new THREE.PlaneGeometry(3,8);
		lG = legGeo.clone();
		rotation = new THREE.Matrix4().makeRotationX(-Math.PI/2);
		lG.applyMatrix(rotation);
		rotation = new THREE.Matrix4().makeRotationZ(-Math.PI/2);
		lG.applyMatrix(rotation);
		lG.verticesNeedUpdate = true;
		transZ(lG, 3);
		manMat = new THREE.MeshLambertMaterial({map: legDLTex, transparent: true, alphaTest: 0.5, side: THREE.DoubleSide});
		lL1 = new THREE.Mesh(lG, manMat);
		scene.add(lL1);

		// leg_right_far
		lG = legGeo.clone();
		rotation = new THREE.Matrix4().makeRotationX(-Math.PI/2);
		lG.applyMatrix(rotation);
		rotation = new THREE.Matrix4().makeRotationZ(-Math.PI/2);
		lG.applyMatrix(rotation);
		lG.verticesNeedUpdate = true;
		transZ(lG, 3);
		manMat = new THREE.MeshLambertMaterial({map: legDRTex, transparent: true, alphaTest: 0.5, side: THREE.DoubleSide});
		lR1 = new THREE.Mesh(lG, manMat);
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

	characterBuilt = true;
}

function loadModelElmo (model, meshMat) {

	var loader = new THREE.JSONLoader();
	var eMat = meshMat;

	loader.load(model, function(geometry, material){

		console.log(material);

		for(var i=0; i<material.length; i++){
			var m = material[i];
			m.skinning = true;
			m.color = new THREE.Color( 0xff0000 );

			// apply it when there's a texture for it
			// m.map = elmoTex;
			
			// m.shadding = THREE.FlatShading;
		}

		var elmoMattt = new THREE.MeshFaceMaterial(material);
		elmoGeo = geometry;
		elmoRig = new THREE.SkinnedMesh(elmoGeo, elmoMattt);
		scene.add(elmoRig);

		// get BONES
		elmoBone = elmoRig.skeleton.bones;
	});
}


function animate() {
	requestAnimationFrame(animate);
	update();
	renderer.render(scene, camera);
}

function update(){

	stats.update();
	//

	var vecTmp = new THREE.Vector3();

	// update after the character is built
	if(characterBuilt){

	//HEAD
		head.position.copy(joints[0].position);

		//SCALE_TIME!
			headMoveX = (joints[0].position.x - jointsPos[0].x);
			headMoveY = (jointsPos[0].y - joints[0].position.y);
			sqrtHeadMoveY = Math.sqrt(Math.pow(headMoveY, 2));

	//BODY
		body.lookAt(joints[0].position);
		body.position.copy(joints[1].position);

		//SCALE_TIME!
			bMoveX = Math.sqrt(Math.pow((joints[1].position.x - jointsPos[1].x), 2));
			bMoveY = (jointsPos[1].y - joints[1].position.y);

			body.scale.set(1, 1, 1+(bMoveX/bodyTexWidth + bMoveY/bodyTexHeight - headMoveY/headTexHeight));

	//LEFT_HAND
		hL2.lookAt(joints[5].position);
		hL2.position.copy(joints[0].position);

		//SCALE_TIME!
			//relate to BODY 
			// hL2MoveX = Math.sqrt(Math.pow(headMoveX, 2));
			// hL2MoveY = Math.sqrt(Math.pow(headMoveY, 2));

			//relate to joints[5] 
			hL2MoveX = Math.sqrt(Math.pow((joints[0].position.x - joints[5].position.x), 2))-5;
			hL2MoveY = Math.sqrt(Math.pow((joints[0].position.y - joints[5].position.y), 2))-2;

			// hL2.scale.set(1, 1, 1+( hL2MoveX/8 + hL2MoveY/10 + hL2MoveX2/8 + hL2MoveY2/15 ));
			hL2.scale.set(1, 1, 1+( hL2MoveX/armULTexWidth + hL2MoveY/armULTexHeight/2 ));

		hL1.lookAt(joints[4].position);
		hL1.position.copy(joints[5].position);

		//SCALE_TIME!
			//relate to joints[5] 
			hL1MoveX = Math.sqrt(Math.pow((joints[4].position.x - joints[5].position.x), 2))-5;
			hL1MoveY = Math.sqrt(Math.pow((joints[4].position.y - joints[5].position.y), 2));

			hL1.scale.set(1, 1, 1+( hL1MoveX/armDLTexWidth + hL1MoveY/armDLTexHeight ));

	//RIGHT_HAND
		hR2.lookAt(joints[3].position);
		hR2.position.copy(joints[0].position);

		//SCALE_TIME!
			//relate to joints[3] 
			hR2MoveX = Math.sqrt(Math.pow((joints[0].position.x - joints[3].position.x), 2))-5;
			hR2MoveY = Math.sqrt(Math.pow((joints[0].position.y - joints[3].position.y), 2))-2;

			hR2.scale.set(1, 1, 1+( hR2MoveX/armURTexWidth + hR2MoveY/armURTexHeight/2 ));

		hR1.lookAt(joints[2].position);
		hR1.position.copy(joints[3].position);

			//SCALE_TIME!
			//relate to joints[2] 
			hR1MoveX = Math.sqrt(Math.pow((joints[2].position.x - joints[3].position.x), 2))-5;
			hR1MoveY = Math.sqrt(Math.pow((joints[2].position.y - joints[3].position.y), 2));

			hR1.scale.set(1, 1, 1+( hR1MoveX/armDRTexWidth + hR1MoveY/armDRTexHeight ));

	//LEFT_LEG
		lL2.lookAt(joints[9].position);
		lL2.position.copy(joints[1].position);

			//SCALE_TIME!
			//relate to joints[9] 
			lL2MoveX = Math.sqrt(Math.pow((joints[1].position.x - joints[9].position.x), 2))-3;
			lL2MoveY = Math.sqrt(Math.pow((joints[1].position.y - joints[9].position.y), 2))-1;

			lL2.scale.set(1, 1, 1+( lL2MoveX/legULTexWidth + lL2MoveY/legULTexHeight ));

		lL1.lookAt(joints[8].position);
		lL1.position.copy(joints[9].position);

			//SCALE_TIME!
			//relate to joints[8] 
			lL1MoveX = Math.sqrt(Math.pow((joints[8].position.x - joints[9].position.x), 2));
			lL1MoveY = Math.sqrt(Math.pow((joints[8].position.y - joints[9].position.y), 2))-5;

			lL1.scale.set(1, 1, 1+( lL1MoveX/legDLTexWidth + lL1MoveY/legDLTexHeight ));

	//RIGHT_LEG
		lR2.lookAt(joints[7].position);
		lR2.position.copy(joints[1].position);

			//SCALE_TIME!
			//relate to joints[7] 
			lR2MoveX = Math.sqrt(Math.pow((joints[1].position.x - joints[7].position.x), 2))-3;
			lR2MoveY = Math.sqrt(Math.pow((joints[1].position.y - joints[7].position.y), 2))-1;

			lR2.scale.set(1, 1, 1+( lR2MoveX/legDRTexWidth + lR2MoveY/legDRTexHeight ));

			// console.log("L: " + lL2MoveX/legULTexWidth + lL2MoveY/legULTexHeight + ", R: " + lR2MoveX/legDRTexWidth + lR2MoveY/legDRTexHeight);

		lR1.lookAt(joints[6].position);
		lR1.position.copy(joints[7].position);

			//SCALE_TIME!
			//relate to joints[6] 
			lR1MoveX = Math.sqrt(Math.pow((joints[6].position.x - joints[7].position.x), 2));
			lR1MoveY = Math.sqrt(Math.pow((joints[6].position.y - joints[7].position.y), 2))-5;

			lR1.scale.set(1, 1, 1+( lR1MoveX/legDRTexWidth + lR1MoveY/legDRTexHeight ));	
	}

	// for audienceDraw
	if(audienceLines.length>0){
		for(var i=0; i<audienceLines.length; i++){

			// falling down
			audienceLines[i].position.y -= 0.1;
			audienceLines[i].geometry.verticesNeedUpdate = true;

			// get world position!
			var worldVector = new THREE.Vector3();
			worldVector.setFromMatrixPosition( audienceLines[i].matrixWorld );

			// line bounces up once hit by character's hand
			if( worldVector.distanceTo(joints[4].position)<5 ) {
				audienceLines[i].position.y += 5;
			}

		}
	}

	// update 3D ELMO
	if(characterBuilt && elmoBone) {
		// OLD_v1
		// elmoBone[0].position.copy( joints[0].position );	//head
		// elmoBone[1].position.copy( joints[1].position );	//root
		// elmoBone[2].position.copy( joints[2].position );	//palmL

		// elmoBone[3].position.copy( joints[3].position );	//armL

		// elmoBone[4].position.copy( joints[4].position );	//palmR
		// elmoBone[5].position.copy( joints[5].position );	//armR

		// elmoBone[6].position.copy( joints[6].position );	//feetL
		// elmoBone[7].position.copy( joints[7].position );	//kneeL

		// elmoBone[8].position.copy( joints[8].position );	//feetR
		// elmoBone[9].position.copy( joints[9].position );	//kneeR


		//
		// copy the bone position
		elmoBone[0].position.copy( joints[5].position.clone() );
		elmoBone[1].position.copy( joints[4].position.clone() );

		elmoBone[2].position.copy( joints[3].position.clone() );
		elmoBone[3].position.copy( joints[2].position.clone() );

		elmoBone[4].position.copy( joints[1].position.clone() );
		elmoBone[5].position.copy( joints[0].position.clone() );

		elmoBone[6].position.copy( joints[9].position.clone() );
		elmoBone[7].position.copy( joints[8].position.clone() );

		elmoBone[8].position.copy( joints[7].position.clone() );
		elmoBone[9].position.copy( joints[6].position.clone() );

		// offset postion.x
		for(var i=0; i<elmoBone.length; i++){
			var offsetX;
			if(i==0) 		offsetX=joints[5].position.x+30;
			else if(i==1) 	offsetX=joints[4].position.x+30;
			else if(i==2) 	offsetX=joints[3].position.x+30;
			else if(i==3)	offsetX=joints[2].position.x+30;
			else if(i==4)	offsetX=joints[1].position.x+30;
			else if(i==5)	offsetX=joints[0].position.x+30;
			else if(i==6)	offsetX=joints[9].position.x+30;
			else if(i==7)	offsetX=joints[8].position.x+30;
			else if(i==8)	offsetX=joints[7].position.x+30;
			else			offsetX=joints[6].position.x+30;

			elmoBone[i].position.x = offsetX;
		}

		// ROTATION
		// base on the relationship of two joints' positions
		// for now, just rotate arm joints since others look fine without adjusted
			lengthForRot = elmoBone[3].position.distanceTo( elmoBone[2].position );
			rotForJoint = Math.asin( (elmoBone[3].position.y-elmoBone[2].position.y)/lengthForRot );
			elmoBone[3].rotation.y = rotForJoint;

			lengthForRot = elmoBone[2].position.distanceTo( elmoBone[5].position );
			rotForJoint = Math.asin( (elmoBone[2].position.y-elmoBone[5].position.y)/lengthForRot );
			elmoBone[2].rotation.y = rotForJoint;

			lengthForRot = elmoBone[1].position.distanceTo( elmoBone[0].position );
			rotForJoint = Math.asin( (elmoBone[1].position.y-elmoBone[0].position.y)/lengthForRot );
			elmoBone[1].rotation.y = -rotForJoint;

			lengthForRot = elmoBone[0].position.distanceTo( elmoBone[5].position );
			rotForJoint = Math.asin( (elmoBone[0].position.y-elmoBone[5].position.y)/lengthForRot );
			elmoBone[0].rotation.y = -rotForJoint;

	}
	


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
