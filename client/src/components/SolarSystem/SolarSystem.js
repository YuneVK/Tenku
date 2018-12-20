import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'

import './SolarSystem.scss'

export default class SolarSystem extends Component {
  constructor() {
    super();

    this.elements = ['Sun', 'Mercury', 'Venus', 'Earth', 'Moon', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];

    console.log(window.THREE)

    
    
    this.cursor = {
      x: 0,
      y: 0
    }
    
    
  }
  


  componentDidMount = () => {
    var renderer = new window.THREE.WebGLRenderer({
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('SolarSystem').appendChild(renderer.domElement);
    renderer.shadowMapEnabled = true

    let updateFcts = [];
    this.scene = new window.THREE.Scene();
    var camera = new window.THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 120);
    camera.position.z = 2;
    var light = new window.THREE.AmbientLight(0x888888)
    this.scene.add(light)
    // var light	= new window.THREE.DirectionalLight( 'white', 1)
    // light.position.set(5,5,5)
    // light.target.position.set( 0, 0, 0 )
    // this.scene.add( light )
    var light = new window.THREE.DirectionalLight(0xcccccc, 1)
    light.position.set(5, 5, 5)
    this.scene.add(light)
    light.castShadow = true
    light.shadowCameraNear = 0.01
    light.shadowCameraFar = 15
    light.shadowCameraFov = 45
    light.shadowCameraLeft = -1
    light.shadowCameraRight = 1
    light.shadowCameraTop = 1
    light.shadowCameraBottom = -1
    // light.shadowCameraVisible	= true
    light.shadowBias = 0.001
    light.shadowDarkness = 0.2
    light.shadowMapWidth = 1024 * 2
    light.shadowMapHeight = 1024 * 2

    //////////////////////////////////////////////////////////////////////////////////
    //		added starfield							//
    //////////////////////////////////////////////////////////////////////////////////


    var starSphere = window.THREEx.Planets.createStarfield()
    this.scene.add(starSphere)
    //////////////////////////////////////////////////////////////////////////////////
    //		comment								//
    //////////////////////////////////////////////////////////////////////////////////

    this.currentMesh = null

    var initialType = 'Earth'
    this.switchValue(initialType)
    //////////////////////////////////////////////////////////////////////////////////
    //		Camera Controls							//
    //////////////////////////////////////////////////////////////////////////////////
    var mouse = { x: 0, y: 0 }
    document.addEventListener('mousemove', function (event) {
      mouse.x = (event.clientX / window.innerWidth) - 0.5
      mouse.y = (event.clientY / window.innerHeight) - 0.5
    }, false)
    updateFcts.push((delta, now) => {
      camera.position.x += (mouse.x * 3 - camera.position.x) * (delta * 1.5)
      camera.position.y += (mouse.y * 3 - camera.position.y) * (delta * 1.5)
      camera.lookAt(this.scene.position)
    })
    //////////////////////////////////////////////////////////////////////////////////
    //		render the this.scene						//
    //////////////////////////////////////////////////////////////////////////////////
    updateFcts.push(() => {
      renderer.render(this.scene, camera);
    })

    //////////////////////////////////////////////////////////////////////////////////
    //		loop runner							//
    //////////////////////////////////////////////////////////////////////////////////
    var lastTimeMsec = null

    const animate = (nowMsec) => {
      //debugger;
      // keep looping
      requestAnimationFrame(animate);
      // measure time
      lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60
      var deltaMsec = Math.min(200, nowMsec - lastTimeMsec)
      lastTimeMsec = nowMsec
      // call each update function
      updateFcts.forEach((updateFn) => {
        updateFn(deltaMsec / 1000, nowMsec / 1000)
      })

      
      // console.log('cursor', this.cursor);
      // console.log('cursor x', this.cursor.x);
      // console.log('window width', window.innerWidth)
      // console.log('half window width', window.innerWidth / 2)
      
      const deg = (this.cursor.x > window.innerWidth / 2) ? 0.3 : -0.3;
      this.currentMesh.rotateY(window.THREE.Math.degToRad(deg));
    }

    requestAnimationFrame(animate);


    
    let getCursorXY = (e) => {
      let cursorX = (window.Event) ? e.pageX : e.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
      let cursorY = (window.Event) ? e.pageY : e.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
      
      this.cursor.x = cursorX;
      this.cursor.y = cursorY;
    }
    
    if (window.Event) {
      document.captureEvents(Event.MOUSEMOVE);
    }


    document.onmousemove = getCursorXY;
  }


  switchValue = type => {
    // TODO: cambiar if/else infernal por switch

    this.currentMesh && this.scene.remove(this.currentMesh)
    if (type === 'Sun') {
      var mesh = window.THREEx.Planets.createSun()
    } else if (type === 'Mercury') {
      var mesh = window.THREEx.Planets.createMercury()
    } else if (type === 'Venus') {
      var mesh = window.THREEx.Planets.createVenus()
    } else if (type === 'Moon') {
      var mesh = window.THREEx.Planets.createMoon()
    } else if (type === 'Earth') {
      var mesh = window.THREEx.Planets.createEarth()
      var cloud = window.THREEx.Planets.createEarthCloud()
      mesh.add(cloud)

      // updateFcts.push(function(delta, now){
      //   cloud.rotation.y += 1/8 * delta;		
      // })

    } else if (type === 'Moon') {
      var mesh = window.THREEx.Planets.createMoon()
    } else if (type === 'Mars') {
      var mesh = window.THREEx.Planets.createMars()
    } else if (type === 'Jupiter') {
      var mesh = window.THREEx.Planets.createJupiter()
    } else if (type === 'Saturn') {
      var mesh = window.THREEx.Planets.createSaturn()
      mesh.receiveShadow = true
      mesh.castShadow = true
      var ring = window.THREEx.Planets.createSaturnRing()
      ring.receiveShadow = true
      ring.castShadow = true
      mesh.add(ring)
    } else if (type === 'Uranus') {
      var mesh = window.THREEx.Planets.createUranus()
      mesh.receiveShadow = true
      mesh.castShadow = true
      var ring = window.THREEx.Planets.createUranusRing()
      ring.receiveShadow = true
      ring.castShadow = true
      mesh.add(ring)
    } else if (type === 'Neptune') {
      var mesh = window.THREEx.Planets.createNeptune()
    } else if (type === 'Pluto') {
      var mesh = window.THREEx.Planets.createPluto()
    } else console.assert(false)
    this.scene.add(mesh)
    this.currentMesh = mesh
    //window.location.hash = type
  }

  componentWillUnmount = () => {
    let canvas = document.querySelector('canvas');
    document.querySelector('#SolarSystem').removeChild(canvas);
  }


  render() {
    return (
      <div id="SolarSystem">
        <h1>Solar System</h1>

        {this.elements.map(element => {
          return <button onClick={e => this.switchValue(element)}>{element}</button>
        })}

        <NavLink strict to="/">Go to Planetarium</NavLink>
      </div>
    )
  }
}
