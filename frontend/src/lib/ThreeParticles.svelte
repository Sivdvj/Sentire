<script context="module">
	import * as THREE from "three";
	import { createNoise2D, createNoise3D } from "simplex-noise";

	let renderer, scene, camera, geometry, material;
	let initialized = false;

	function init(width, height, initialColor) {
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
		camera.position.z = 250;
		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(width, height);

		let particleCount = 50000;
		geometry = new THREE.BufferGeometry();
		let positions = new Float32Array(particleCount * 3);

		for (let i = 0; i < particleCount; i++) {
			let u = Math.random();
			let v = Math.random();
			let theta = u * 2 * Math.PI;
			let phi = Math.acos(2 * v - 1);
			let r = Math.random() * 1000;

			let x = r * Math.sin(phi) * Math.cos(theta);
			let y = r * Math.sin(phi) * Math.sin(theta);
			let z = r * Math.cos(phi);

			positions[i * 3] = x;
			positions[i * 3 + 1] = y;
			positions[i * 3 + 2] = z;
		}

		geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

		material = new THREE.PointsMaterial({
			size: 2.5,
			color: initialColor,
			map: new THREE.TextureLoader().load("/assets/spark1.png"),
			blending: THREE.AdditiveBlending,
			transparent: true,
			opacity: 1,
		});

		let points = new THREE.Points(geometry, material);
		scene.add(points);

		let noise2D = createNoise2D(() => 0.75);
		let noise3D = createNoise3D(() => 0.75);

		let R = 80,
			r = 50;
		let noiseMag = 5;
		let torusUV = new Float32Array(particleCount * 2);
		let torusVel = new Float32Array(particleCount * 2);
		let torusBase = new Float32Array(particleCount * 3);

		let sqrt = Math.floor(Math.sqrt(particleCount));
		for (let i = 0; i < particleCount; i++) {
			let u = (2 * Math.PI * (i % sqrt)) / sqrt;
			let v = 2 * Math.PI * (Math.floor(i / sqrt) / sqrt);

			const x = (R + r * Math.cos(v)) * Math.cos(u);
			const y = (R + r * Math.cos(v)) * Math.sin(u);
			const z = r * Math.sin(v);

			torusUV[i * 2] = u;
			torusUV[i * 2 + 1] = v;
			torusVel[i * 2] = noise2D(u / noiseMag, v / noiseMag) * 0.01;
			torusVel[i * 2 + 1] = noise2D(u / noiseMag, v / noiseMag) * 0.01;

			torusBase[i * 3] = x;
			torusBase[i * 3 + 1] = y;
			torusBase[i * 3 + 2] = z;
		}

		function updateTorus(time) {
			let spatialScale = 0.02,
				timeScale = 0.3,
				amplitude = 2;
			for (let i = 0; i < particleCount; i++) {
				torusUV[i * 2] += torusVel[i * 2];
				torusUV[i * 2 + 1] += torusVel[i * 2 + 1];

				let u = torusUV[i * 2],
					v = torusUV[i * 2 + 1];
				let bx = (R + r * Math.cos(v)) * Math.cos(u);
				let by = (R + r * Math.cos(v)) * Math.sin(u);
				let bz = r * Math.sin(v);

				let nx = noise3D(bx * spatialScale, by * spatialScale, time * timeScale);
				let ny = noise3D(by * spatialScale, bz * spatialScale, time * timeScale + 100);
				let nz = noise3D(bz * spatialScale, bx * spatialScale, time * timeScale + 200);

				torusBase[i * 3] = bx + nx * amplitude;
				torusBase[i * 3 + 1] = by + ny * amplitude;
				torusBase[i * 3 + 2] = bz + nz * amplitude;
			}
		}

		let sphereRadius = 100;
		let sphereUV = new Float32Array(particleCount * 2);
		let sphereVel = new Float32Array(particleCount * 2);
		let sphereBase = new Float32Array(particleCount * 3);

		for (let i = 0; i < particleCount; i++) {
			let theta = (2 * Math.PI * (i % sqrt)) / sqrt;
			let phi = Math.PI * (Math.floor(i / sqrt) / sqrt);

			let x = sphereRadius * Math.sin(phi) * Math.cos(theta);
			let y = sphereRadius * Math.sin(phi) * Math.sin(theta);
			let z = sphereRadius * Math.cos(phi);

			let newY = z;
			let newZ = -y;
			y = newY;
			z = newZ;

			sphereUV[i * 2] = theta;
			sphereUV[i * 2 + 1] = phi;
			sphereVel[i * 2] = noise2D(theta / noiseMag, phi / noiseMag) * 0.0075;
			sphereVel[i * 2 + 1] = noise2D(theta / noiseMag, phi / noiseMag) * 0.0075;

			sphereBase[i * 3] = x;
			sphereBase[i * 3 + 1] = y;
			sphereBase[i * 3 + 2] = z;
		}

		function updateSphere(time) {
			let spatialScale = 0.02,
				timeScale = 0.3,
				amplitude = 2;
			for (let i = 0; i < particleCount; i++) {
				sphereUV[i * 2] += sphereVel[i * 2];
				sphereUV[i * 2 + 1] += sphereVel[i * 2 + 1];

				let theta = sphereUV[i * 2];
				let phi = sphereUV[i * 2 + 1];
				let bx = sphereRadius * Math.sin(phi) * Math.cos(theta);
				let by = sphereRadius * Math.sin(phi) * Math.sin(theta);
				let bz = sphereRadius * Math.cos(phi);

				let temp = bz;
				bz = -by;
				by = temp;
				let nx = noise3D(bx * spatialScale, by * spatialScale, time * timeScale);
				let ny = noise3D(by * spatialScale, bz * spatialScale, time * timeScale + 100);
				let nz = noise3D(bz * spatialScale, bx * spatialScale, time * timeScale + 200);

				sphereBase[i * 3] = bx + nx * amplitude;
				sphereBase[i * 3 + 1] = by + ny * amplitude;
				sphereBase[i * 3 + 2] = bz + nz * amplitude;
			}
		}

		const dur = 3; //morphing time
		const stay = 3;
		const cyc = dur + stay;

		let startTime = performance.now() * 0.001;

		function easeInOutCubic(t) {
			return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; //the equivalent of ease-in-out in css
		}

		function animate() {
			requestAnimationFrame(animate);
			let t = performance.now() * 0.001;

			let totalTime = t - startTime;
			let cycleTime = totalTime % (cyc * 2); //everything repeats after 12 seconds
			let phase = Math.floor(cycleTime / cyc); //2 phases
			let phaseTime = cycleTime % cyc; //0 to stay and stay to cyc ->morphing time

			let startShape, endShape, localProg;
			if (phaseTime < stay) {
				localProg = 0;
				if (phase === 0) {
					updateTorus(t);
					startShape = torusBase;
					endShape = torusBase;
				} else {
					updateSphere(t);
					startShape = sphereBase;
					endShape = sphereBase;
				}
			} else {
				//morphing happens
				let transitionProg = (phaseTime - stay) / dur;
				localProg = easeInOutCubic(transitionProg);
				if (phase === 0) {
					updateTorus(t);
					startShape = torusBase;
					endShape = sphereBase;
				} else {
					updateSphere(t);
					startShape = sphereBase;
					endShape = torusBase;
				}
			}

			let pos = geometry.attributes.position.array;
			for (let i = 0; i < particleCount * 3; i++) {
				pos[i] = THREE.MathUtils.lerp(startShape[i], endShape[i], localProg);
			}
			geometry.attributes.position.needsUpdate = true;

			renderer.render(scene, camera);
		}
		animate();
		initialized = true;
	}
</script>

<script>
	import { onMount } from "svelte";
	export let colorParticles = "";

	let container;

	onMount(() => {
		if (!initialized) {
			init(container.clientWidth, innerHeight, colorParticles);
		} else {
			renderer.setSize(container.clientWidth, innerHeight);
			camera.aspect = container.clientWidth / innerHeight;
			camera.updateProjectionMatrix();
		}
		container.appendChild(renderer.domElement);
	});

	$: if (initialized && material && colorParticles) {
		material.color.set(colorParticles);
	}
</script>

<div bind:this={container} class="h-full w-full"></div>
