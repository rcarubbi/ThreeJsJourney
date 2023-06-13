import './style.css';
import ReactDOM from 'react-dom/client';
import { Canvas } from '@react-three/fiber';
import Experience from './Experience.jsx';
import StageExperience from './StageExperience.jsx';
import * as THREE from 'three';

const root = ReactDOM.createRoot(document.querySelector('#root'));

// const created = ({ gl, scene }) => {
// 	// gl.setClearColor(0xff0000, 1);
// 	scene.background = new THREE.Color(0xff0000);
// };

root.render(
	<Canvas
		shadows
		camera={{
			fov: 45,
			near: 0.1,
			far: 200,
			position: [-4, 3, 6],
		}}
		// onCreated={created}
	>
		{/* <Experience /> */}
		<StageExperience />
	</Canvas>
);
