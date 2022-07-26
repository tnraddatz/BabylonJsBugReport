import './style.css'

import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera.js'
import { Color3 } from '@babylonjs/core/Maths/math.color.js'
import { Engine } from '@babylonjs/core/Engines/engine.js'
import { EnvironmentHelper } from '@babylonjs/core/Helpers/environmentHelper.js'
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight.js'
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder.js'
import { Scene } from '@babylonjs/core/scene.js'
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial.js'
import { Vector3 } from '@babylonjs/core/Maths/math.vector.js'
import * as BABYLON from 'babylonjs';
// Required for EnvironmentHelper
import '@babylonjs/core/Materials/Textures/Loaders'

// Enable GLTF/GLB loader for loading controller models from WebXR Input registry
import '@babylonjs/loaders/glTF'

// Without this next import, an error message like this occurs loading controller models:
//  Build of NodeMaterial failed" error when loading controller model
//  Uncaught (in promise) Build of NodeMaterial failed: input rgba from block
//  FragmentOutput[FragmentOutputBlock] is not connected and is not optional.
import '@babylonjs/core/Materials/Node/Blocks'

// Create a canvas element for rendering
const app = document.querySelector<HTMLDivElement>('#app')
const canvas = document.createElement('canvas')
app?.appendChild(canvas)

// Create engine and a scene
const babylonEngine = new BABYLON.Engine(canvas, true)
const scene = new BABYLON.Scene(babylonEngine)

// Add a basic light
new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 2, 0), scene)

// Create a default environment (skybox, ground mesh, etc)
const envHelper = new BABYLON.EnvironmentHelper({
  skyboxSize: 30,
  groundColor: new Color3(0.5, 0.5, 0.5),
}, scene)

// Add a camera for the non-VR view in browser
const camera = new BABYLON.ArcRotateCamera("Camera", -(Math.PI / 4) * 3, Math.PI / 4, 10, new BABYLON.Vector3(0, 0, 0), scene);
camera.attachControl(true)

// Add a sphere to have something to look at
const sphereD = 1.0
const sphere = BABYLON.MeshBuilder.CreateSphere('xSphere', { segments: 16, diameter: sphereD }, scene)
sphere.position.x = 0
sphere.position.y = sphereD * 2
sphere.position.z = 0
const rMat = new BABYLON.StandardMaterial("matR", scene)
rMat.diffuseColor = new Color3(1.0, 0, 0)
sphere.material = rMat

// Setup default WebXR experience
// Use the enviroment floor to enable teleportation

scene.createDefaultXRExperienceAsync().then(() => {
  // Run render loop
  babylonEngine.runRenderLoop(() => {
    scene.render()
  })
})
