import * as THREE from 'three'

const scene = new THREE.Scene()

const geometry = new THREE.BoxGeometry()

const red = 0xff0000
const material = new THREE.MeshBasicMaterial({ color: red })

const mesh = new THREE.Mesh(geometry, material)

scene.add(mesh)

// Camera
const fieldOfViewAngles = 75
const sizes = {
    width: 800,
    height: 600
}
const camera = new THREE.PerspectiveCamera(fieldOfViewAngles, sizes.width / sizes.height)
camera.position.z = 3

scene.add(camera)


// renderer
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({
    canvas
});

renderer.setSize(sizes.width, sizes.height);

renderer.render(scene, camera);