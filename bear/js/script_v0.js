
//THREE.JS
	var container, stats;
	var width = window.innerWidth, height = window.innerHeight;
	var camera, scene, projector, renderer, controls;
	var keyboard = new KeyboardState();
	var clock = new THREE.Clock();
	var mesh;

	var radius = 600;
	var theta = 0;

	var duration = 2000;
	var keyframes = 49 /*16*/, interpolation = duration / keyframes, time;
	var lastKeyframe = 0, currentKeyframe = 0;
	var influcence = 1, downInf = false, upInf = false;


	//new
	var outsideBulb, insideBulb;
	var lightBulbMat;
	var lightSource;
	var glow;
	var ground;

	//MAN
	var head, body, hR1, hR2, hL1, hL2, lR1, lR2, lL1, lL2;
	var joints = [];
	var jointsPos = [
		new THREE.Vector3(0, 4, 0),		//neck
		new THREE.Vector3(0, -4, 0),	//body
		new THREE.Vector3(10, 4, 0),	//HR1
		new THREE.Vector3(5, 4, 0),		//HR2
		new THREE.Vector3(-10, 4, 0),	//HL1
		new THREE.Vector3(-5, 4, 0),	//HL2
		new THREE.Vector3(3, -15, 0),	//LR1
		new THREE.Vector3(3, -9, 0),	//LR2
		new THREE.Vector3(-3, -15, 0),	//LL1
		new THREE.Vector3(-3, -9, 0)	//LL2
	];

	//
	var cubeMan;


	//CAT
	var headCat, bodyCat, hR1Cat, hR2Cat, hL1Cat, hL2Cat, lR1Cat, lR2Cat, lL1Cat, lL2Cat;
	var jointsCat = [];
	var jointsPosCat = [
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
	var cat;

	var headTex, bodyTex, armULTex, armDLTex, armURTex, armDRTex,
		legULTex, legDLTex, legURTex, legDRTex;

//GUI
	var jointController = function(){

		// this.joint = [ 'head', 'body', 
		// 			   'rightHand1', 'rightHand2', 'leftHand1', 'leftHand2', 
		// 			   'rightLeg1', 'rightLeg2', 'leftLeg1', 'leftLeg2' ];
		this.unit = 0;
		// this.rotationX = 0;
		// this.rotationY = 0;
		// this.rotationZ = 0;

		this.positionX = 0;
		this.positionY = 0;
		this.positionZ = 0;
	};
	var jointCatController = function(){

		this.unit_cat = 0;
		this.positionX = 0;
		this.positionY = 0;
		this.positionZ = 0;
	};
	var gui;


//////////////////////////////////////////////////

// window.load = initAudio;
init();
animate();

//////////////////////////////////////////////////

var lightttt;

function init() {


	//SET_UP
	container = document.createElement( 'div' );
	document.body.appendChild( container );

	camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.set(0,0,50);

	scene = new THREE.Scene();

	var loader = new THREE.JSONLoader( true );


	var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
	directionalLight.position.set( 1, 1, 0 );
	scene.add( directionalLight );

	directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
	directionalLight.position.set( 0.3, 0, 1 );
	scene.add( directionalLight );

	directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
	directionalLight.position.set( -0.3, 0, -1 );
	scene.add( directionalLight );

	var groundGeo = new THREE.PlaneGeometry(500, 500);
	// groundGeo.computeFaceNormals();	
	mat  = new THREE.MeshLambertMaterial( {color: 0xd82e27, side: THREE.DoubleSide} );
	ground = new THREE.Mesh(groundGeo, mat);
	ground.position.y = -5;
	ground.rotation.x = Math.PI/2;
	// scene.add(ground);


	//STICK_FIGURE
	// buildStickFigure();

	var modelMaterial = new THREE.MeshFaceMaterial;
	// loadModelRig("models/knight.js", modelMaterial);
	// loadModelRig("models/spock_rig_export4.js", modelMaterial);

	/*
	loadModelCat("models/stickCat/headC.js",
				 "models/stickCat/bodyC.js",
				 "models/stickCat/arm_R_DC.js",
				 "models/stickCat/arm_R_UC.js",
				 "models/stickCat/arm_L_DC.js",
				 "models/stickCat/arm_L_UC.js",
				 "models/stickCat/leg_R_DC.js",
				 "models/stickCat/leg_R_UC.js",
				 "models/stickCat/leg_L_DC.js",
				 "models/stickCat/leg_L_UC.js");
	*/


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
		// renderer = new THREE.WebGLRenderer( {antialias: true, alpha: true} );
		renderer = new THREE.WebGLRenderer( {antialias: true, alpha: true} );
		renderer.setClearColor(0x000000, 1);
		renderer.sortObjects = false;
		renderer.autoClear = true;
		renderer.setSize( width, height );
		container.appendChild(renderer.domElement);
		window.addEventListener( 'resize', onWindowResize, false );

	//

	controls = new THREE.OrbitControls(camera, renderer.domElement);

	//

	//STATS
		stats = new Stats();
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.bottom = '5px';
		stats.domElement.style.zIndex = 100;
		stats.domElement.children[ 0 ].style.background = "transparent";
		stats.domElement.children[ 0 ].children[1].style.display = "none";
		container.appendChild(stats.domElement);

	//
	// lightttt = new THREE.PointLight( 0xff0000, 1, 100 );
	// lightttt.position.set( 0, 0, 10 );
	// scene.add( lightttt );
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

	setupStickmanGui();
}


function buildStickFigure(){
	
	// var headGeo = new THREE.SphereGeometry(4,16,16);
	var headGeo = new THREE.TetrahedronGeometry(6);
	transY(headGeo, 4);
	var manMat = new THREE.MeshLambertMaterial({color: 0xe7d7b7});
	head = new THREE.Mesh(headGeo, manMat);
	head.rotation.y = 45 * (Math.PI/180);
	head.position.set(0,5,0);
	scene.add(head);

	var bodyGeo = new THREE.BoxGeometry(1,1,8);
	var bG = bodyGeo.clone();
	transZ(bG, 4);
	body = new THREE.Mesh(bG, manMat);
	body.position.copy(jointsPos[1]);
	scene.add(body);


	//ARM
		var armGeo = new THREE.BoxGeometry(1,1,4);
		var aG = armGeo.clone();
		transZ(aG, 3);
		hL2 = new THREE.Mesh(aG, manMat);
		hL2.position.set(0,4,0);
		scene.add(hL2);

		aG = armGeo.clone();
		transZ(aG, 3);
		hL1 = new THREE.Mesh(aG, manMat);
		hL1.position.set(-5,4,0);
		scene.add(hL1);

		aG = armGeo.clone();
		transZ(aG, 3);
		hR2 = new THREE.Mesh(aG, manMat);
		hR2.position.set(0,4,0);
		scene.add(hR2);

		aG = armGeo.clone();
		transZ(aG, 3);
		hR1 = new THREE.Mesh(aG, manMat);
		hR1.position.set(5,4,0);
		scene.add(hR1);

	//LEG
		var legGeo = new THREE.BoxGeometry(1,1,5);
		var lG = legGeo.clone();
		transZ(lG, 3);
		lL2 = new THREE.Mesh(lG, manMat);
		// lL2.rotation.z = -20 * (Math.PI/180);
		// lL2.position.set(-2,-7,0);
		scene.add(lL2);

		lG = legGeo.clone();
		transZ(lG, 3);
		lL1 = new THREE.Mesh(lG, manMat);
		// lL1.position.set(-3,-13,0);
		scene.add(lL1);

		lG = legGeo.clone();
		transZ(lG, 3);
		lR2 = new THREE.Mesh(lG, manMat);
		// lR2.rotation.z = 20 * (Math.PI/180);
		// lR2.position.set(2,-7,0);
		scene.add(lR2);

		lG = legGeo.clone();
		transZ(lG, 3);
		lR1 = new THREE.Mesh(lG, manMat);
		// lR1.position.set(3,-13,0);
		scene.add(lR1);

	//JOINTS
		var jointGeo = new THREE.SphereGeometry(1,8,8);
		var jointMat = new THREE.MeshLambertMaterial({color: 0x01eed8});

		for(var i=0; i<jointsPos.length; i++){
			var j = new THREE.Mesh(jointGeo.clone(), jointMat);
			j.position.copy(jointsPos[i]);
			j.oriPos = (jointsPos[i]);
			joints.push(j);
			scene.add(j);
		}


	setupStickmanGui();
}

var moveDistance = 10;

function setupStickmanGui() {

	var manJoint = new jointController();
	gui = new dat.GUI();
	// gui.remember(manJoint);

	var singleJoint = joints[manJoint.unit];

	// var f0 = gui.addFolder('System');
	// f0.addPresets();

	var f1 = gui.addFolder('Joints Position');
	
	var jointU = f1.add(manJoint, 'unit', 0, joints.length-1).step(1);
	jointU.onChange( function( value ){ singleJoint = joints[ value ]; } );

	var jointPX = f1.add(manJoint, 'positionX',-10, 10);
	jointPX.onChange( function( value ){ singleJoint.position.x = singleJoint.oriPos.x + value; } );

	var jointPY = f1.add(manJoint, 'positionY', -10, 10);
	jointPY.onChange( function( value ){ singleJoint.position.y = singleJoint.oriPos.y + value; } );

	var jointPZ = f1.add(manJoint, 'positionZ', -10, 10);
	jointPZ.onChange( function( value ){ singleJoint.position.z = singleJoint.oriPos.z + value; } );

	f1.open();
}


function setupGui() {

	var jointParameters = new jointController();
	gui = new dat.GUI();

	var figureBones = cubeMan.skeleton.bones;
	var singleFigureBone = figureBones[jointParameters.unit];

	var f1 = gui.addFolder('Rotation');
	
	var jointU = f1.add(jointParameters, 'unit', 0, figureBones.length-1).step(1);
	jointU.onChange( function( value ){ singleFigureBone = figureBones[ value ]; } );

	var jointRX = f1.add(jointParameters, 'rotationX', -Math.PI/2, Math.PI/2);
	jointRX.onChange( function( value ){ singleFigureBone.rotation.x = value; } );

	var jointRY = f1.add(jointParameters, 'rotationY', -Math.PI/2, Math.PI/2);
	jointRY.onChange( function( value ){ singleFigureBone.rotation.y = value; } );

	var jointRZ = f1.add(jointParameters, 'rotationZ', -Math.PI/2, Math.PI/2);
	jointRZ.onChange( function( value ){ singleFigureBone.rotation.z = value; } );

	f1.open();
}



function finishedLoading(bufferList){
	analyzer = context.createAnalyser();
	analyzer.smoothingTimeConstant = 0.8;	//
	analyzer.fftSize = samples;
	binCount = analyzer.frequencyBinCount;
	levelBins = Math.floor(binCount/levelCount);

	frequencyByteData = new Uint8Array(binCount);
	timeByteData = new Uint8Array(binCount);

	var length = 256;
	for(var i=0; i<length; i++){
		levelHistory.push(0);
	}

	source = context.createBufferSource();
	gainNode = context.createGain();

	source.buffer = bufferList[0];
	source.loop = true;

	source.connect(analyzer);
	analyzer.connect(gainNode);
	gainNode.connect(context.destination);

	gainNode.gain.value = 0.5;

	source.start(0);
	isPlayingAudio = true;
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

function scaleGeo(geo, s){
	for(var i=0; i<geo.vertices.length; i++){
		var gg = geo.vertices[i];
		// console.log(gg);
		gg.multiplyScalar(s);
	}
	geo.__dirtyVertices = true;
}


function onBeat(){
	gotBeat = true;
}

function noteFromPitch(frequency){
  var noteNum = 12*(Math.log(frequency/440)/Math.log(2));
  return Math.round(noteNum)+69;
}

function freqencyFromNote(note){
  return 440* Math.pow(2, (note+69)/12);
}

function centsOffFromPitch(frequency){
  return ( 1200 * Math.log(frequency/freqencyFromNote(note) ) / Math.log(2) );
}

function updatePitch(time){
	var cycles = [];
	analyser.getByteTimeDomainData(buf);
	// autoCorrelate(buf, audioContext.sampleRate);
}



function loadModelRig (model, meshMat) {

	var loader = new THREE.JSONLoader();
	loader.load(model, function(geometry, materials){

		for ( var i = 0; i < materials.length; i ++ ) {
			var m = materials[ i ];
			m.skinning = true;
			// m.wrapAround = true;
		}

		// var cubeManMat = new THREE.MeshLambertMaterial ({color: 0xaaaa00, skinning: true});
		cubeMan = new THREE.SkinnedMesh(geometry, new THREE.MeshFaceMaterial(materials));
		// cubeMan = new THREE.SkinnedMesh(geometry, cubeManMat);

		// cubeManMat = cubeMan.material.materials;

		// for(var i=0; i<materials.length; i++){
		// 	var matt = materials[i];
		// 	matt.skinning = true;
		// }

		
		scene.add(cubeMan);

		setupGui();
			
	}, "js");
}



function loadModelCat (model0, model1, model2, model3, model4, model5, model6, model7, model8, model9) {

	//JOINTS_CAT
		var jointGeo = new THREE.BoxGeometry(2,2,2);
		var jointMat = new THREE.MeshLambertMaterial({color: 0xfe858e});

		for(var i=0; i<jointsPosCat.length; i++){
			var j = new THREE.Mesh(jointGeo.clone(), jointMat);
			j.position.copy(jointsPosCat[i]);
			j.oriPos = (jointsPosCat[i]);
			jointsCat.push(j);
			scene.add(j);
		}



	var loader = new THREE.JSONLoader();
	var catMat = new THREE.MeshLambertMaterial({color: 0xb2a57d});


	loader.load(model0, function(geometry0){
		//head
		transY(geometry0, 4);
		transZ(geometry0, 1);
		headCat = new THREE.Mesh(geometry0, catMat);
		// headCat.scale.set(5,5,5);
		scene.add(headCat);			
	}, "js");


	loader.load(model1, function(geometry1){
		//body
		var rotation = new THREE.Matrix4().makeRotationX(-Math.PI/2);
		geometry1.applyMatrix(rotation);
		rotation = new THREE.Matrix4().makeRotationZ(Math.PI/2);
		geometry1.applyMatrix(rotation);
		geometry1.verticesNeedUpdate = true;


		transX(geometry1, -2);
		transZ(geometry1, 2.5);
		bodyCat = new THREE.Mesh(geometry1, catMat);
		scene.add(bodyCat);
	}, "js");


	loader.load(model2, function(geometry2){
		//arm_L_D
		var rotation = new THREE.Matrix4().makeRotationX(-Math.PI/2);
		geometry2.applyMatrix(rotation);
		rotation = new THREE.Matrix4().makeRotationZ(Math.PI/2);
		geometry2.applyMatrix(rotation);
		rotation = new THREE.Matrix4().makeRotationY(Math.PI/5);
		geometry2.applyMatrix(rotation);
		geometry2.verticesNeedUpdate = true;

		transZ(geometry2, 2.5);
		hL1Cat = new THREE.Mesh(geometry2, catMat);
		scene.add(hL1Cat);
	}, "js");


	loader.load(model3, function(geometry3){
		//arm_L_U
		
		var rotation = new THREE.Matrix4().makeRotationY(-Math.PI/2);
		geometry3.applyMatrix(rotation);
		rotation = new THREE.Matrix4().makeRotationX(-Math.PI/2);
		geometry3.applyMatrix(rotation);
		geometry3.verticesNeedUpdate = true;

		transZ(geometry3, 5);
		transX(geometry3, -2);
		hL2Cat = new THREE.Mesh(geometry3, catMat);

		scene.add(hL2Cat);
	}, "js");


	loader.load(model4, function(geometry4){
		//arm_R_D
		var rotation = new THREE.Matrix4().makeRotationX(-Math.PI/2);
		geometry4.applyMatrix(rotation);
		rotation = new THREE.Matrix4().makeRotationZ(-Math.PI/2);
		geometry4.applyMatrix(rotation);
		rotation = new THREE.Matrix4().makeRotationY(-Math.PI/5);
		geometry4.applyMatrix(rotation);
		geometry4.verticesNeedUpdate = true;

		transZ(geometry4, 2.5);

		hR1Cat = new THREE.Mesh(geometry4, catMat);
		scene.add(hR1Cat);
	}, "js");


	loader.load(model5, function(geometry5){
		//arm_R_U
		hR2Cat = new THREE.Mesh(geometry5, catMat);
		var rotation = new THREE.Matrix4().makeRotationY(-Math.PI/2);
		geometry5.applyMatrix(rotation);
		rotation = new THREE.Matrix4().makeRotationX(-Math.PI/2);
		geometry5.applyMatrix(rotation);
		geometry5.verticesNeedUpdate = true;

		transZ(geometry5, 5);
		transX(geometry5, -2);

		scene.add(hR2Cat);
	}, "js");


	loader.load(model6, function(geometry6){
		//leg_L_D
		var rotation = new THREE.Matrix4().makeRotationY(-Math.PI/2);
		geometry6.applyMatrix(rotation);
		rotation = new THREE.Matrix4().makeRotationX(-Math.PI/2);
		geometry6.applyMatrix(rotation);
		geometry6.verticesNeedUpdate = true;

		transZ(geometry6, 3);
		transX(geometry6, -3);

		lL1Cat = new THREE.Mesh(geometry6, catMat);
		scene.add(lL1Cat);
	}, "js");


	loader.load(model7, function(geometry7){
		//leg_L_U
		var rotation = new THREE.Matrix4().makeRotationY(-Math.PI/2);
		geometry7.applyMatrix(rotation);
		rotation = new THREE.Matrix4().makeRotationX(-Math.PI/2);
		geometry7.applyMatrix(rotation);
		geometry7.verticesNeedUpdate = true;

		transZ(geometry7, 4);
		transX(geometry7, -3);

		lL2Cat = new THREE.Mesh(geometry7, catMat);
		scene.add(lL2Cat);
	}, "js");


	loader.load(model8, function(geometry8){
		//leg_R_D
		var rotation = new THREE.Matrix4().makeRotationY(-Math.PI/2);
		geometry8.applyMatrix(rotation);
		rotation = new THREE.Matrix4().makeRotationX(-Math.PI/2);
		geometry8.applyMatrix(rotation);
		geometry8.verticesNeedUpdate = true;

		transZ(geometry8, 3);
		transX(geometry8, -3);

		lR1Cat = new THREE.Mesh(geometry8, catMat);
		scene.add(lR1Cat);
	}, "js");


	loader.load(model9, function(geometry9){
		//leg_R_U
		var rotation = new THREE.Matrix4().makeRotationY(Math.PI/2);
		geometry9.applyMatrix(rotation);
		rotation = new THREE.Matrix4().makeRotationX(-Math.PI/2);
		geometry9.applyMatrix(rotation);
		geometry9.verticesNeedUpdate = true;

		transZ(geometry9, 4);
		transX(geometry9, 3);

		lR2Cat = new THREE.Mesh(geometry9, catMat);
		scene.add(lR2Cat);
	}, "js");



	setupStickcatGui();

}

function setupStickcatGui() {

	var catjoint = new jointCatController();

	var singleCatJoint = jointsCat[catjoint.unit_cat];

	var f2 = gui.addFolder('JointsCat Position');
	
	var jointU = f2.add(catjoint, 'unit_cat', 0, jointsCat.length-1).step(1);
	jointU.onChange( function( value ){ singleCatJoint = jointsCat[ value ]; } );

	var jointPX = f2.add(catjoint, 'positionX',-10, 10);
	jointPX.onChange( function( value ){ singleCatJoint.position.x = singleCatJoint.oriPos.x + value; } );

	var jointPY = f2.add(catjoint, 'positionY', -10, 10);
	jointPY.onChange( function( value ){ singleCatJoint.position.y = singleCatJoint.oriPos.y + value; } );

	var jointPZ = f2.add(catjoint, 'positionZ', -10, 10);
	jointPZ.onChange( function( value ){ singleCatJoint.position.z = singleCatJoint.oriPos.z + value; } );

	f2.open();
}


function animate() {

	requestAnimationFrame( animate );

	update();
	render();
}

function render() {
	renderer.render( scene, camera );
}




var step=0, danceStep = 0;
var vecHeadToBody, vecHeadToBodyCat;
var vecCenter = new THREE.Vector3(0,1,0);

function update(){

	var delta = clock.getDelta();
	var timeNow = Date.now() * 0.00025;


	keyboard.update();
	controls.update();
	stats.update();

	// if(lightttt.position.y <= 30)
	// 	lightttt.position.y += 1;
	// else
	// 	lightttt.position.y -= 1;
//==================================================================

	//STICK_MAN
		var vecTmp = new THREE.Vector3();

		//HEAD
			head.position.copy(joints[0].position);

			headMoveX = Math.sqrt(Math.pow((head.position.x - jointsPos[0].x), 2));
			headMoveY = (jointsPos[0].y - head.position.y);

		//BODY
			// vecHeadToBody = vecTmp.subVectors(joints[0].position, joints[1].position).normalize();
			// var rotBody = vecHeadToBody.angleTo(vecCenter);

			body.lookAt(joints[0].position);
			body.position.copy(joints[1].position);

			// bMoveX = new THREE.Vector2();
			body_2D = new THREE.Vector2(body.position.x, body.position.y);
			joints1_2D = new THREE.Vector2(jointsPos[1].x, jointsPos[1].y);

			// bMoveLenght = body_2D.distanceTo(joints1_2D);
			bMoveX = Math.sqrt(Math.pow((body_2D.x - joints1_2D.x), 2));
			bMoveY = (joints1_2D.y - body_2D.y);
			// if(bMoveX != 0){
			// 	body.scale.set(1, 1, 1+bMoveX/15);
			// }
			// if(bMoveY != 0){
			// 	body.scale.set(1, 1, 1+bMoveY/15);
			// }

			body.scale.set(1, 1, 1+(bMoveX/15 + bMoveY/10 - headMoveY/8));

		//LEFT_HAND
			hL2.lookAt(joints[5].position);
			hL2.position.copy(joints[0].position);

			hL1.lookAt(joints[4].position);
			hL1.position.copy(joints[5].position);

		//RIGHT_HAND
			hR2.lookAt(joints[3].position);
			hR2.position.copy(joints[0].position);

			hR1.lookAt(joints[2].position);
			hR1.position.copy(joints[3].position);

		//LEFT_LEG
			lL2.lookAt(joints[9].position);
			lL2.position.copy(joints[1].position);

			lL1.lookAt(joints[8].position);
			lL1.position.copy(joints[9].position);

		//RIGHT_LEG
			lR2.lookAt(joints[7].position);
			lR2.position.copy(joints[1].position);

			lR1.lookAt(joints[6].position);
			lR1.position.copy(joints[7].position);

//==================================================================
	
	/*
	//STICK_Cat
		var vecTmpCat = new THREE.Vector3();

		//HEAD
			headCat.position.copy(jointsCat[0].position);

		//BODY
			bodyCat.lookAt(jointsCat[0].position);
			bodyCat.position.copy(jointsCat[1].position);

		//LEFT_HAND
			hL2Cat.lookAt(jointsCat[5].position);
			// hL2Cat.position.copy(jointsCat[0].position);
			hL2Cat.position.x = jointsCat[0].position.x - 1;
			hL2Cat.position.y = jointsCat[0].position.y;
			hL2Cat.position.z = jointsCat[0].position.z;

			hL1Cat.lookAt(jointsCat[4].position);
			hL1Cat.position.copy(jointsCat[5].position);

		// //RIGHT_HAND
			hR2Cat.lookAt(jointsCat[3].position);
			// hR2Cat.position.copy(jointsCat[0].position);
			hR2Cat.position.x = jointsCat[0].position.x + 1;
			hR2Cat.position.y = jointsCat[0].position.y;
			hR2Cat.position.z = jointsCat[0].position.z;

			hR1Cat.lookAt(jointsCat[2].position);
			hR1Cat.position.copy(jointsCat[3].position);

		// //LEFT_LEG
			lL2Cat.lookAt(jointsCat[9].position);
			// lL2Cat.position.copy(jointsCat[1].position);
			lL2Cat.position.y = jointsCat[1].position.y;
			lL2Cat.position.x = jointsCat[1].position.x-1;
			lL2Cat.position.z = jointsCat[1].position.z;

			lL1Cat.lookAt(jointsCat[8].position);
			lL1Cat.position.copy(jointsCat[9].position);

		//RIGHT_LEG
			lR2Cat.lookAt(jointsCat[7].position);
			// lR2Cat.position.copy(jointsCat[1].position);
			lR2Cat.position.y = jointsCat[1].position.y;
			lR2Cat.position.x = jointsCat[1].position.x+1;
			lR2Cat.position.z = jointsCat[1].position.z;

			lR1Cat.lookAt(jointsCat[6].position);
			lR1Cat.position.copy(jointsCat[7].position);
	*/

//==================================================================
	window.onmousedown = function(event){

		// var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		// var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		var posX = event.clientX;
		var posY = event.clientY;
		
		// if(posX>width/2 && posY<height/2)
		// 	console.log("2");

		// if(posX<width/2 && posY<height/2)
		// 	console.log("1");

		// if(posX<width/2 && posY>height/2)
		// 	console.log("3");

		// if(posX>width/2 && posY>height/2)
		// 	console.log("4");


		/*
		var vecMouse = new THREE.Vector2(posX-width/2, posY-height/2);
		vecMouse.normalize();

		var angle = Math.atan2(vecMouse.y, vecMouse.x) - Math.atan2(1, 0);
		if (angle < 0) angle += 2 * Math.PI;
		angle *= (180/Math.PI);

		console.log(angle);

		cubeMan.skeleton.bones[3].rotation.y = angle;
		*/

		// var posX = event.clientX;
		// var posY = event.clientY;
		
		
		// var vecMouse = new THREE.Vector2(posX-width/2, posY-height/2);
		// vecMouse.normalize();

		// var angle = Math.atan2(vecMouse.y, vecMouse.x) - Math.atan2(1, 0);
		// if (angle < 0) angle += 2 * Math.PI;
		// angle *= (180/Math.PI);

		// cubeMan.skeleton.bones[3].rotation.y = angle;
	}

	window.onmousemove = function(event){

		// var posX = event.clientX;
		// var posY = event.clientY;
		
		
		// var vecMouse = new THREE.Vector2(posX-width/2, posY-height/2);
		// vecMouse.normalize();

		// var angle = Math.atan2(vecMouse.y, vecMouse.x) - Math.atan2(1, 0);
		// if (angle < 0) angle += 2 * Math.PI;
		// angle *= (180/Math.PI);

		// cubeMan.skeleton.bones[3].rotation.y = angle;
		

		//3,5
	}

}






function onWindowResize(){
	width = window.innerWidth;
	height = window.innerHeight;

	camera.aspect = width/height;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}