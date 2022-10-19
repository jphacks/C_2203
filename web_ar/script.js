const clock = new THREE.Clock();

let scene, camera, renderer;
let arToolkitSource, arToolkitContext;
let mixer;

init();

function init() {
	scene = new THREE.Scene();

	camera = new THREE.Camera();
	scene.add(camera);

	// 光源
	const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
	const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
	directionalLight.position.set(5, 5, 0);
	scene.add(ambientLight);
	scene.add(directionalLight);

	renderer = new THREE.WebGLRenderer({
		antialias: true,
		alpha: true,
	});

	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.outputEncoding = THREE.GammaEncoding;

	document.body.appendChild(renderer.domElement);

	arToolkitContext = new THREEx.ArToolkitContext({
		cameraParametersUrl: "data/camera_para.dat",
		detectionMode: "mono",
	});

	arToolkitContext.init(() => {
		camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
	});

	arToolkitSource = new THREEx.ArToolkitSource({
		sourceType: "webcam",
		displayWidth: window.innerWidth,
		displayHeight: window.innerHeight,
	});

	function handleResize() {
		arToolkitSource.onResize();
		arToolkitSource.copySizeTo(renderer.domElement);

		if (arToolkitContext.arController) {
			arToolkitSource.copySizeTo(arToolkitContext.arController.canvas);
		}
	}

	arToolkitSource.init(() => {
		setTimeout(() => {
			tick();
			handleResize();
			[].slice.call(document.querySelectorAll(".invisible")).forEach((elm) => {
				elm.classList.remove("invisible");
			});
		}, 200);
	});

	window.addEventListener("resize", handleResize, {
		passive: true,
	});

	const markerRoot = new THREE.Group();

	scene.add(markerRoot);

	const arMarkerControls = new THREEx.ArMarkerControls(
		arToolkitContext,
		markerRoot,
		{
			type: "pattern",
			patternUrl: "data/pattern.patt",
		}
	);

	const loader = new THREE.GLTFLoader();
	const url = "./dog_walk.glb";

	loader.load(
		url,
		(gltf) => {
			const animations = gltf.animations;
			const model = gltf.scene;

			if (animations && animations.length) {
				mixer = new THREE.AnimationMixer(model);

				for (let i = 0; i < animations.length; i++) {
					const animation = animations[i];
					const action = mixer.clipAction(animation);

					action.play();
				}
			}

			model.scale.set(1.0, 1.0, 1.0);
			model.position.set(0, 0, 0);
			model.rotation.y = Math.PI;
			markerRoot.add(gltf.scene);
		},
		(err) => {
			console.error(err);
		}
	);
}

function update() {
	if (arToolkitSource.ready) {
		arToolkitContext.update(arToolkitSource.domElement);
	}

	if (mixer) {
		mixer.update(clock.getDelta());
	}
}

function render() {
	renderer.render(scene, camera);
}

function tick() {
	update();
	render();
	requestAnimationFrame(tick);
}
