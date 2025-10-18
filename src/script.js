import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'lil-gui'
import gsap from 'gsap'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

/**
 * Debug GUI
 */
const gui = new GUI()

/**
 * Canvas
 */
const canvas = document.querySelector('canvas.webgl')

/**
 * Scene
 */
const scene = new THREE.Scene()

/**
 * Texture Loader
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/8.png')

/**
 * Font Loader and Text
 */
const fontLoader = new FontLoader()
fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) => {
        // Create text geometry
        const textGeometry = new TextGeometry('ITS ME JOWAW', {
            font: font,
            size: 0.5,
            height: 0.2,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 5
        })

        // Compute bounding box & center manually (optional)
        textGeometry.computeBoundingBox()
        textGeometry.translate(
            - (textGeometry.boundingBox.max.x - 0.02) * 0.5,
            - (textGeometry.boundingBox.max.y - 0.02) * 0.5,
            - (textGeometry.boundingBox.max.z - 0.03) * 0.5
        )

        // OR simply center with:
        // textGeometry.center()

        // Material (set wireframe true to inspect geometry)
        const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
        // const material = new THREE.MeshBasicMaterial({ wireframe: true }) // uncomment to debug

        const text = new THREE.Mesh(textGeometry, material)
        scene.add(text)

        /**
         * Create donuts
         */
        const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
        for (let i = 0; i < 100; i++) {
            const donut = new THREE.Mesh(donutGeometry, material)
            donut.position.x = (Math.random() - 0.5) * 10
            donut.position.y = (Math.random() - 0.5) * 10
            donut.position.z = (Math.random() - 0.5) * 10

            donut.rotation.x = Math.random() * Math.PI
            donut.rotation.y = Math.random() * Math.PI

            const scale = Math.random()
            donut.scale.set(scale, scale, scale)

            scene.add(donut)
        }

        // Optional animation (spin the text slowly)
        gsap.to(text.rotation, {
            y: Math.PI * 2,
            duration: 10,
            repeat: -1,
            ease: 'none'
        })
    }
)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

/**
 * Controls
 */
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

/**
 * Resize
 */
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Fullscreen (Double-click)
 */
window.addEventListener('dblclick', () => {
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement
    if (!fullscreenElement) {
        if (canvas.requestFullscreen) canvas.requestFullscreen()
        else if (canvas.webkitRequestFullscreen) canvas.webkitRequestFullscreen()
    } else {
        if (document.exitFullscreen) document.exitFullscreen()
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen()
    }
})

/**
 * Animation loop
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()
