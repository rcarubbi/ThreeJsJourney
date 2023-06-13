import { useFrame } from '@react-three/fiber';
import {
	Environment,
	Sky,
	ContactShadows,
	AccumulativeShadows,
	OrbitControls,
	useHelper,
	BakeShadows,
	SoftShadows,
	RandomizedLight,
	Lightformer,
} from '@react-three/drei';
import { useRef } from 'react';
import { Perf } from 'r3f-perf';
import * as THREE from 'three';
import { useControls } from 'leva';

export default function Experience() {
	const cube = useRef();

	useFrame((state, delta) => {
		// const time = state.clock.elapsedTime;
		// cube.current.position.x = 2 + Math.sin(time);
		cube.current.rotation.y += delta * 0.2;
	});

	const directionalLight = useRef();
	useHelper(
		directionalLight,
		THREE.DirectionalLightHelper,
		1,
		new THREE.Color('red')
	);

	const { color, opacity, blur, scale, resolution, far } = useControls(
		'Contact shadows',
		{
			color: '#4b2709',
			opacity: { value: 0.4, min: 0, max: 1 },
			blur: { value: 2.8, min: 0, max: 10 },
			scale: { value: 10, min: 0, max: 10 },
			far: { value: 5, min: 0, max: 10 },
			resolution: { value: 512, min: 0, max: 2048 },
		}
	);

	const { radius, phi, theta } = useControls('sky', {
		radius: {
			value: 3.5,
			min: 0,
			max: 10,
		},
		phi: {
			value: 1,
			min: -(2 * Math.PI),
			max: 2 * Math.PI,
		},
		theta: {
			value: 0.5,
			min: -(2 * Math.PI),
			max: 2 * Math.PI,
		},
	});

	const sunPosition = new THREE.Vector3().setFromSphericalCoords(
		radius,
		phi,
		theta
	);

	const { envMapIntensity, envMapHeight, envMapRadius, envMapScale } =
		useControls('environment map', {
			envMapIntensity: {
				value: 3.5,
				min: 0,
				max: 12,
			},
			envMapHeight: { value: 7, min: 0, max: 100 },
			envMapRadius: { value: 20, min: 10, max: 1000 },
			envMapScale: { value: 100, min: 10, max: 1000 },
		});

	return (
		<>
			<Environment
				// background
				ground={{
					height: envMapHeight,
					radius: envMapRadius,
					scale: envMapScale,
				}}
				preset={'sunset'}
				// files={'./environmentMaps/the_sky_is_on_fire_2k.hdr'}
				// files={[
				// 	'./environmentMaps/3/px.jpg',
				// 	'./environmentMaps/3/nx.jpg',
				// 	'./environmentMaps/3/py.jpg',
				// 	'./environmentMaps/3/ny.jpg',
				// 	'./environmentMaps/3/pz.jpg',
				// 	'./environmentMaps/3/nz.jpg',
				// ]}
				// resolution={32}
			>
				{/* <color args={['#000000']} attach="background" /> */}
				{/* <mesh position-z={-5} scale={10}>
					<planeGeometry />
					<meshBasicMaterial color={[10, 0, 0]} />
				</mesh> */}
				{/* <Lightformer
					position-z={-5}
					scale={10}
					color="red"
					intensity={2}
					form="ring"
				/> */}
			</Environment>

			{/* <BakeShadows /> */}

			{/* <SoftShadows
				frustum={3.75}
				size={0.005}
				near={9.5}
				samples={17}
				rings={11}
			/> */}

			<color args={['ivory']} attach="background" />

			<Perf position="top-left" />

			<OrbitControls makeDefault />

			{/* <AccumulativeShadows
				position={[0, -0.99, 0]}
				scale={10}
				color={0x316d39}
				opacity={0.8}
				frames={Infinity}
				temporal
				blend={100}
			>
				<RandomizedLight
					amount={8}
					radius={1}
					ambient={0.5}
					intensity={1}
					position={[1, 2, 3]}
					bias={0.001}
				/>
			</AccumulativeShadows> */}

			<ContactShadows
				// position={[0, -0.99, 0]}
				position={[0, 0, 0]}
				scale={scale}
				resolution={resolution}
				far={far}
				color={color}
				opacity={opacity}
				blur={blur}
				frames={1}
			/>
			{/* <directionalLight
				ref={directionalLight}
				position={sunPosition}
				intensity={1.5}
				castShadow
				shadow-mapSize={[1024, 1024]}
				shadow-camera-near={1}
				shadow-camera-far={10}
				shadow-camera-top={10}
				shadow-camera-bottom={-10}
				shadow-camera-right={10}
				shadow-camera-left={-10}
			/>
			<ambientLight intensity={0.5} /> */}

			{/* <Sky sunPosition={sunPosition} /> */}

			<mesh position-x={-2} position-y={1} castShadow>
				<sphereGeometry />
				<meshStandardMaterial
					color="orange"
					envMapIntensity={envMapIntensity}
				/>
			</mesh>

			<mesh
				ref={cube}
				position-x={2}
				position-y={1}
				scale={1.5}
				castShadow
			>
				<boxGeometry />
				<meshStandardMaterial
					color="mediumpurple"
					envMapIntensity={envMapIntensity}
				/>
			</mesh>
			{/* 
			<mesh
				position-y={0}
				rotation-x={-Math.PI * 0.5}
				scale={10}
				receiveShadow
			>
				<planeGeometry />
				<meshStandardMaterial
					color="greenyellow"
					envMapIntensity={envMapIntensity}
				/>
			</mesh> */}
		</>
	);
}
