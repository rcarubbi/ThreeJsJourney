import { extend, useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import CustomObject from './CustomObject';

extend({ OrbitControls });

export default function Experience() {
	useFrame((state, delta) => {
		// const angle = state.clock.elapsedTime;
		// state.camera.position.x = Math.sin(angle) * 8;
		// state.camera.position.z = Math.cos(angle) * 8;
		// state.camera.lookAt(0, 0, 0);
		cubeRef.current.rotation.y += delta * 2;
		// groupRef.current.rotation.y -= delta;
	});

	const { camera, gl } = useThree();

	const cubeRef = useRef();
	const groupRef = useRef();

	return (
		<>
			<orbitControls args={[camera, gl.domElement]} />

			<directionalLight position={[1, 2, 3]} intensity={1.5} />
			<ambientLight intensity={0.5} />

			<group ref={groupRef}>
				<mesh position-x={-2}>
					<sphereGeometry />
					<meshStandardMaterial color="orange" />
				</mesh>
				<mesh
					ref={cubeRef}
					// position={[2, 0, 0]}
					rotation-y={Math.PI * 0.25}
					scale={1.5}
					position-x={2}
				>
					{/* <sphereGeometry args={[1.5, 32, 32]} /> */}
					<boxGeometry scale={1.5} />
					<meshStandardMaterial
						color="mediumpurple"
						wireframe={false}
					/>
				</mesh>
			</group>

			<mesh position={-1} rotation-x={-Math.PI * 0.5} scale={10}>
				<planeGeometry />
				<meshStandardMaterial color="greenyellow" />
			</mesh>

			<CustomObject verticesCount={10 * 3} />
		</>
	);
}
