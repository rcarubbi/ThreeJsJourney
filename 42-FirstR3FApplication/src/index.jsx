import './style.css';
import ReactDOM from 'react-dom/client';

import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import Experience from './Eperience';

const root = ReactDOM.createRoot(document.querySelector('#root'));

const cameraSettings = {
	fov: 45,
	near: 0.1,
	far: 200,
	position: [3, 2, 6],
	//zoom: 100,
};

root.render(
	<Canvas
		// flat // linear tonemapping
		// dpr={[1, 2]} // pixel ratio clamp at 2 default values
		gl={{
			antialias: true, //default
			toneMapping: THREE.ACESFilmicToneMapping, //default
			// toneMapping: THREE.CineonToneMapping,
			outputColorSpace: THREE.SRGBColorSpace, //default
			alpha: true, //default
		}}
		//orthographic
		camera={cameraSettings}
	>
		<Experience />
	</Canvas>
);
