import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const doorColorTexture = textureLoader.load('textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('textures/door/roughness.jpg')

const bricksColorTexture = textureLoader.load('textures/bricks/color.jpg')
const bricksAmbientOcclusionTexture = textureLoader.load('textures/bricks/ambientOcclusion.jpg')
const bricksNormalTexture = textureLoader.load('textures/bricks/normal.jpg')
const bricksRoughnessTexture = textureLoader.load('textures/bricks/roughness.jpg')

const grassColorTexture = textureLoader.load('textures/grass/color.jpg')
const grassAmbientOcclusionTexture = textureLoader.load('textures/grass/ambientOcclusion.jpg')
const grassNormalTexture = textureLoader.load('textures/grass/normal.jpg')
const grassRoughnessTexture = textureLoader.load('textures/grass/roughness.jpg')

grassColorTexture.wrapS = THREE.RepeatWrapping
grassColorTexture.wrapT = THREE.RepeatWrapping
grassColorTexture.repeat.set(8, 8)

grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
grassAmbientOcclusionTexture.repeat.set(8, 8)

grassNormalTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapT = THREE.RepeatWrapping
grassNormalTexture.repeat.set(8, 8)

grassRoughnessTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapT = THREE.RepeatWrapping
grassRoughnessTexture.repeat.set(8, 8)


/**
 * House
 */
const house = new THREE.Group()
scene.add(house)

const houseParameters = {
    wallsHeight: 2.5,
    roofHeight: 1
}

const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, houseParameters.wallsHeight, 4),
    new THREE.MeshStandardMaterial({
        map: bricksColorTexture,
        aoMap: bricksAmbientOcclusionTexture,
        normalMap: bricksNormalTexture,
        roughnessMap: bricksRoughnessTexture,
        // color: 0xac8e82
    })
)

walls.geometry.setAttribute(
    'uv2',
    new THREE.BufferAttribute(walls.geometry.attributes.uv.array, 2)
)


walls.position.y = houseParameters.wallsHeight * .5

const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, houseParameters.roofHeight, 4),
    new THREE.MeshStandardMaterial({ color: 0xb35f45 })
)
roof.position.y = houseParameters.wallsHeight + (houseParameters.roofHeight * .5)
roof.rotation.y = Math.PI * .25


const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
    new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        alphaMap: doorAlphaTexture,
        transparent: true,
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.1,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture,
    })
)
door.geometry.setAttribute(
    'uv2',
    new THREE.BufferAttribute(door.geometry.attributes.uv.array, 2)
)


door.position.y = 1
door.position.z = 2.01

house.add(walls, roof, door)

// bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({
    color: 0x89c894
})

const bushesParams = [
    {
        size: .5,
        x: .8,
        y: .2,
        z: 2.2
    },
    {
        size: 0.25,
        x: 1.4,
        y: .1,
        z: 2.1
    },
    {
        size: 0.4,
        x: -0.8,
        y: .1,
        z: 2.2
    },
    {
        size: .15,
        x: -1,
        y: .05,
        z: 2.6
    }
]

for (const bushParams of bushesParams) {
    const bush = new THREE.Mesh(bushGeometry, bushMaterial)
    bush.castShadow = true
    bush.scale.set(bushParams.size, bushParams.size, bushParams.size)
    bush.position.set(bushParams.x, bushParams.y, bushParams.z)
    house.add(bush)
}

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({
        map: grassColorTexture,
        aoMap: grassAmbientOcclusionTexture,
        normalMap: grassNormalTexture,
        roughnessMap: grassRoughnessTexture
    })
)
floor.geometry.setAttribute(
    'uv2',
    new THREE.BufferAttribute(floor.geometry.attributes.uv.array, 2)
)
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)


// Graves
const graves = new THREE.Group()

const graveGeometry = new THREE.BoxGeometry(.6, .8, .2)
const graveMaterial = new THREE.MeshStandardMaterial({ color: 0xb2b6b1 })

for (let i = 0; i < 50; i++) {

    const angle = Math.random() * Math.PI * 2
    const radius = 3 + Math.random() * 6
    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius
    const grave = new THREE.Mesh(graveGeometry, graveMaterial)
    grave.position.set(x, 0.3, z)
    grave.rotation.y = (Math.random() - 0.5) * 0.4
    grave.rotation.z = (Math.random() - 0.5) * 0.4
    grave.castShadow = true
    graves.add(grave)

}

scene.add(graves)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xb9d5ff, 0.12)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight(0xb9d5ff, 0.12)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)


const doorLightParams = {
    intensity: 1,
    distance: 7
}
const doorLight = new THREE.PointLight(0xff7d46, doorLightParams.intensity, doorLightParams.distance)
doorLight.position.set(0, 2.2, 2.7)
house.add(doorLight)


/**
 * Ghosts
 */

const ghost1 = new THREE.PointLight(0xff00ff, 2, 3)
scene.add(ghost1)

const ghost2 = new THREE.PointLight(0x00ffff, 2, 3)
scene.add(ghost2)

const ghost3 = new THREE.PointLight(0xffff00, 2, 3)
scene.add(ghost3)

/**
 * Fog
 */

const fog = new THREE.Fog(0x262837, 1, 15)
scene.fog = fog

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(0x262837)

/**
 * Shadows
 */
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

moonLight.castShadow = true
doorLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true
walls.castShadow = true
roof.castShadow = true
floor.receiveShadow = true


doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256
doorLight.shadow.camera.far = 7

ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 7

ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 7

ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 7


/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Update ghosts
    const ghost1Angle = elapsedTime * .5
    ghost1.position.x = Math.cos(ghost1Angle) * 4
    ghost1.position.z = Math.sin(ghost1Angle) * 4
    ghost1.position.y = Math.sin(ghost1Angle * 3)

    const ghost2Angle = - elapsedTime * .32
    ghost2.position.x = Math.cos(ghost2Angle) * 5
    ghost2.position.z = Math.sin(ghost2Angle) * 5
    ghost2.position.y = Math.sin(ghost2Angle * 4) + Math.sin(ghost2Angle * 2.5)

    const ghost3Angle = - elapsedTime * .18
    ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32))
    ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5))
    ghost3.position.y = Math.sin(ghost3Angle * 5) + Math.sin(ghost3Angle * 2)

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()