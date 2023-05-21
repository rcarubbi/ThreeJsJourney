import {
	TransformControls,
	PivotControls,
	OrbitControls,
	Html,
	Text,
	Float,
	MeshReflectorMaterial,
} from '@react-three/drei';
import { useRef } from 'react';
export default function Experience() {
	const cubeRef = useRef();
	const sphereRef = useRef();

	return (
		<>
			<OrbitControls makeDefault />
			<directionalLight position={[1, 2, 3]} intensity={1.5} />
			<ambientLight intensity={0.5} />

			<mesh position-x={-2} ref={sphereRef}>
				<sphereGeometry />
				<meshStandardMaterial color="orange" />
				<Html
					position={[1, 1, 0]}
					wrapperClass="label"
					center
					distanceFactor={6}
					occlude={[cubeRef, sphereRef]}
				>
					That's a sphere 👍
				</Html>
			</mesh>

			{/* <TransformControls object={sphepereRef} mode="rotate" /> */}
			{/* <TransformControls object={sphepereRef} mode="scale" /> */}
			<TransformControls object={sphereRef} />

			<PivotControls
				anchor={[0, 0, 0]}
				depthTest={false}
				lineWidth={2}
				axisColors={[0xff4d6d, 0x9381ff, 0x78e982]}
				scale={100}
				fixed={true}
			>
				<mesh ref={cubeRef} position-x={2} scale={1.5}>
					<boxGeometry />
					<meshStandardMaterial color="mediumpurple" />
				</mesh>
			</PivotControls>

			<mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
				<planeGeometry />
				{/* <meshStandardMaterial color="greenyellow" /> */}
				<MeshReflectorMaterial
					color="greenyellow"
					resolution={1024}
					blur={[1000, 1000]}
					mixBlur={1}
					mirror={0.75}
				/>
			</mesh>

			<Float speed={5} floatingRange={2}>
				<Text
					color="red"
					fontSize={0.5}
					font="./bangers-v20-latin-regular.woff"
					outlineWidth={0.01}
					outlineColor="blue"
					outlineBlur={0.04}
					position-y={2}
					maxWidth={2}
					textAlign="center"
				>
					{/* <meshNormalMaterial /> */}
					Raphael test
				</Text>
			</Float>
		</>
	);
}
