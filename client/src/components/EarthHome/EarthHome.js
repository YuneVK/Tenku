import React, { Component } from 'react'

import './EarthHome.scss'

export default class EarthHome extends Component {
  constructor() {
    super();
  }

  componentDidMount() {
    var renderer	= new window.THREE.WebGLRenderer({
      antialias	: true
    });
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.querySelector('#earth-home').appendChild( renderer.domElement );
    renderer.shadowMapEnabled	= true
    
    var onRenderFcts= [];
    var scene	= new window.THREE.Scene();
    var camera	= new window.THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 100 );
    camera.position.z = 2;
    var light	= new window.THREE.AmbientLight( 0x222222 )
    scene.add( light )
    var light	= new window.THREE.DirectionalLight( 0xffffff, 1 )
    light.position.set(5,5,5)
    scene.add( light )
    light.castShadow	= true
    light.shadowCameraNear	= 0.01
    light.shadowCameraFar	= 15
    light.shadowCameraFov	= 45
    light.shadowCameraLeft	= -1
    light.shadowCameraRight	=  1
    light.shadowCameraTop	=  1
    light.shadowCameraBottom= -1
    // light.shadowCameraVisible	= true
    light.shadowBias	= 0.001
    light.shadowDarkness	= 0.2
    light.shadowMapWidth	= 1024
    light.shadowMapHeight	= 1024
    
    //////////////////////////////////////////////////////////////////////////////////
    //		added starfield							//
    //////////////////////////////////////////////////////////////////////////////////
    
    var starSphere	= window.THREEx.Planets.createStarfield()
    scene.add(starSphere)
    //////////////////////////////////////////////////////////////////////////////////
    //		add an object and make it move					//
    //////////////////////////////////////////////////////////////////////////////////
    // var datGUI	= new dat.GUI()
    var containerEarth	= new window.THREE.Object3D()
    containerEarth.rotateZ(-23.4 * Math.PI/180)
    containerEarth.position.z	= 0
    containerEarth.rotation.y = window.THREE.Math.degToRad(150)
    scene.add(containerEarth)
    var moonMesh	= window.THREEx.Planets.createMoon()
    moonMesh.position.set(0.5,0.5,0.5)
    moonMesh.scale.multiplyScalar(1/5)
    moonMesh.receiveShadow	= true
    moonMesh.castShadow	= true
    containerEarth.add(moonMesh)
    var earthMesh	= window.THREEx.Planets.createEarth()
    earthMesh.receiveShadow	= true
    earthMesh.castShadow	= true
    containerEarth.add(earthMesh)
    onRenderFcts.push(function(delta, now){
      earthMesh.rotation.y -= 1/32 * delta;	
      containerEarth.rotation.y += 4/32 * delta;	
    })
    var geometry	= new window.THREE.SphereGeometry(0.5, 32, 32)
    var material	= window.THREEx.createAtmosphereMaterial()
    material.uniforms.glowColor.value.set(0x00b3ff)
    material.uniforms.coeficient.value	= 0.8
    material.uniforms.power.value		= 2.0
    var mesh	= new window.THREE.Mesh(geometry, material );
    mesh.scale.multiplyScalar(1.01);
    containerEarth.add( mesh );
    // new window.THREEx.addAtmosphereMaterial2DatGui(material, datGUI)
    var geometry	= new window.THREE.SphereGeometry(0.5, 32, 32)
    var material	= window.THREEx.createAtmosphereMaterial()
    material.side	= window.THREE.BackSide
    material.uniforms.glowColor.value.set(0x00b3ff)
    material.uniforms.coeficient.value	= 0.5
    material.uniforms.power.value		= 9.0
    var mesh	= new window.THREE.Mesh(geometry, material );
    mesh.scale.multiplyScalar(1.15);
    containerEarth.add( mesh );
    // new window.THREEx.addAtmosphereMaterial2DatGui(material, datGUI)
    var earthCloud	= window.THREEx.Planets.createEarthCloud()
    earthCloud.receiveShadow	= true
    earthCloud.castShadow	= true
    containerEarth.add(earthCloud)
    onRenderFcts.push(function(delta, now){
      earthCloud.rotation.y += 1/8 * delta;		
    })
    //////////////////////////////////////////////////////////////////////////////////
    //		Camera Controls							//
    //////////////////////////////////////////////////////////////////////////////////
    var mouse	= {x : 0, y : 0}
    document.addEventListener('mousemove', function(event){
      mouse.x	= (event.clientX / window.innerWidth ) - 0.5
      mouse.y	= (event.clientY / window.innerHeight) - 0.5
    }, false)
    onRenderFcts.push(function(delta, now){
      camera.position.x += (mouse.x*2 - camera.position.x) * (delta*3)
      camera.position.y += (mouse.y*2 - camera.position.y) * (delta*3)
      camera.lookAt( scene.position )
    })
    //////////////////////////////////////////////////////////////////////////////////
    //		render the scene						//
    //////////////////////////////////////////////////////////////////////////////////
    onRenderFcts.push(function(){
      renderer.render( scene, camera );		
    })
    
    //////////////////////////////////////////////////////////////////////////////////
    //		loop runner							//
    //////////////////////////////////////////////////////////////////////////////////
    var lastTimeMsec= null
    requestAnimationFrame(function animate(nowMsec){
      // keep looping
      requestAnimationFrame( animate );
      // measure time
      lastTimeMsec	= lastTimeMsec || nowMsec-1000/60
      var deltaMsec	= Math.min(200, nowMsec - lastTimeMsec)
      lastTimeMsec	= nowMsec
      // call each update function
      onRenderFcts.forEach(function(onRenderFct){
        onRenderFct(deltaMsec/1000, nowMsec/1000)
      })
    })
  }

  render() {
    return (
      <div id="earth-home">
      </div>
    )
  }
}
