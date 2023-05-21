import * as THREE from 'three';
import { useEffect, useMemo, useRef } from 'react';

export default function CustomObject({ verticesCount }) {
	const geometryRef = useRef();

	const positions = useMemo(() => {
		const positions = new Float32Array(verticesCount * 3);
		for (let i = 0; i < verticesCount * 3; i++) {
			positions[i] = (Math.random() - 0.5) * 3;
		}

		return positions;
	}, [verticesCount]);

	useEffect(() => {
		geometryRef.current.computeVertexNormals();
	}, [positions]);

	return (
		<mesh>
			<bufferGeometry ref={geometryRef}>
				<bufferAttribute
					attach="attributes-position"
					itemSize={3}
					count={verticesCount}
					array={positions}
				/>
			</bufferGeometry>
			<meshStandardMaterial color="red" side={THREE.DoubleSide} />
		</mesh>
	);
}
