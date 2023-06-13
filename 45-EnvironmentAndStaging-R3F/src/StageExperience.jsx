import { useFrame } from '@react-three/fiber';
import { OrbitControls, Stage, useHelper } from '@react-three/drei';
import { useRef } from 'react';
import { Perf } from 'r3f-perf';
import * as THREE from 'three';
import { useControls } from 'leva';

export default function StageExperience() {
	const cube = useRef();

	useFrame((state, delta) => {
		cube.current.rotation.y += delta * 0.2;
	});

	const directionalLight = useRef();
	useHelper(
		directionalLight,
		THREE.DirectionalLightHelper,
		1,
		new THREE.Color('red')
	);

	return (
		<>
			<color args={['ivory']} attach="background" />

			<Perf position="top-left" />

			<OrbitControls makeDefault />

			<Stage
				shadows={{ type: 'contact', opacity: 0.2, blur: 3 }}
				environment="sunset"
				preset="portrait"
				intensity={2}
			>
				<mesh position-x={-2} position-y={1} castShadow>
					<sphereGeometry />
					<meshStandardMaterial color="orange" />
				</mesh>

				<mesh
					ref={cube}
					position-x={2}
					position-y={1}
					scale={1.5}
					castShadow
				>
					<boxGeometry />
					<meshStandardMaterial color="mediumpurple" />
				</mesh>
			</Stage>
		</>
	);
}
