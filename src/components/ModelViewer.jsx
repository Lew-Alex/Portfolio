import { useEffect, useRef, useState } from 'react'

export default function ModelViewer({ src }) {
  const containerRef = useRef(null)
  const [status, setStatus] = useState('loading') // loading | error | ready
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let cancelled = false
    let renderer, scene, camera, controls, frameId, dracoLoader
    const container = containerRef.current

    async function init() {
      try {
        const [THREE, { OrbitControls }, { GLTFLoader }, { DRACOLoader }] = await Promise.all([
          import('three'),
          import('three/examples/jsm/controls/OrbitControls.js'),
          import('three/examples/jsm/loaders/GLTFLoader.js'),
          import('three/examples/jsm/loaders/DRACOLoader.js'),
        ])

        dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderPath('/draco/')

        const loader = new GLTFLoader()
        loader.setDRACOLoader(dracoLoader)

        const gltf = await new Promise((resolve, reject) => {
          loader.load(
            src,
            resolve,
            (evt) => {
              if (evt.lengthComputable) setProgress(Math.round((evt.loaded / evt.total) * 100))
            },
            reject
          )
        })
        if (cancelled) return

        const object = gltf.scene

        scene = new THREE.Scene()
        camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100000)

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        container.appendChild(renderer.domElement)

        scene.add(new THREE.AmbientLight(0xffffff, 0.7))
        const key = new THREE.DirectionalLight(0xffffff, 1.4)
        key.position.set(5, 8, 6)
        scene.add(key)
        const fill = new THREE.DirectionalLight(0xffffff, 0.6)
        fill.position.set(-6, -3, -4)
        scene.add(fill)

        const material = new THREE.MeshStandardMaterial({
          color: 0xb9c2cc,
          metalness: 0.25,
          roughness: 0.55,
        })
        object.traverse((child) => {
          if (child.isMesh) {
            child.material = material
            if (!child.geometry.attributes.normal) child.geometry.computeVertexNormals()
          }
        })
        // The source CAD export uses Z-up; three.js expects Y-up.
        object.rotation.x = -Math.PI / 2
        scene.add(object)

        const box = new THREE.Box3().setFromObject(object)
        const size = box.getSize(new THREE.Vector3())
        const center = box.getCenter(new THREE.Vector3())
        object.position.sub(center)

        const radius = Math.max(size.x, size.y, size.z) || 1
        camera.position.set(radius * 1.2, radius * 0.9, radius * 1.2)
        camera.near = radius / 100
        camera.far = radius * 100
        camera.updateProjectionMatrix()

        controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true
        controls.dampingFactor = 0.08
        controls.target.set(0, 0, 0)

        const resize = () => {
          const w = container.clientWidth
          const h = container.clientHeight
          camera.aspect = w / h
          camera.updateProjectionMatrix()
          renderer.setSize(w, h)
        }
        resize()
        window.addEventListener('resize', resize)

        const animate = () => {
          controls.update()
          renderer.render(scene, camera)
          frameId = requestAnimationFrame(animate)
        }
        animate()

        setStatus('ready')

        return () => window.removeEventListener('resize', resize)
      } catch (err) {
        console.error('Failed to load 3D model:', err)
        if (!cancelled) setStatus('error')
      }
    }

    const cleanupPromise = init()

    return () => {
      cancelled = true
      if (frameId) cancelAnimationFrame(frameId)
      cleanupPromise?.then((cleanup) => cleanup?.())
      controls?.dispose()
      renderer?.dispose()
      dracoLoader?.dispose()
      if (renderer?.domElement && container?.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [src])

  return (
    <div className="cad-viewer">
      <div ref={containerRef} className="cad-viewer-canvas" />
      {status === 'loading' && (
        <div className="cad-viewer-overlay">Loading 3D model{progress > 0 ? ` (${progress}%)` : '…'}</div>
      )}
      {status === 'error' && (
        <div className="cad-viewer-overlay">Couldn't load the 3D model.</div>
      )}
    </div>
  )
}
