import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { FlakesTexture } from 'three/examples/jsm/textures/FlakesTexture';

import { Perlin, FBM } from 'three-noise/build/three-noise.module';

//post-processing imports
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';

//console.log( "222221111" );

import Data from '../data/data.csv';
import BackgroundImg from '../imgs/bg.hdr';

//console.log( Data );

const scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = -5;

scene.background = new THREE.Color( 0xe26d5c );

const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });

//renderer.setPixelRatio( window.devicePixelRatio );
renderer.setPixelRatio( 5 );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );



//These are just helpers. Should be commented on production.
let controls = new OrbitControls( camera, renderer.domElement );
//scene.add( new THREE.AxesHelper( 500 ) );

//This event guarantees that the renderer and camera aspect ratio change whenever the screen is resized
window.addEventListener( 'resize', (event) => {
    renderer.setSize( event.target.innerWidth, event.target.innerHeight, true );
    camera.aspect = event.target.innerWidth / event.target.innerHeight;
    camera.updateProjectionMatrix();
});



//Global light
let ambientLight = new THREE.AmbientLight( 0x404040 );
scene.add( ambientLight );

const light = new THREE.PointLight( 0xFFFFFF, 1, 500 );
light.position.set( 10, 10, 10 );
scene.add( light );

//cube container

let cubeContainer = new THREE.Object3D();

let noiseVector = new THREE.Vector3( 1.34435, 2.113234, 3.77676);
noiseVector.multiplyScalar( 0.3 );

const perlin = new Perlin(Math.random());
console.log( noiseVector );

const noisedPerlin = perlin.get3( noiseVector ) * 10;
console.log( noisedPerlin );

const elemNum = 150;
const radius = 3;
for( let i = 0; i <= 360; i += (360/elemNum) ){
    let currPosition = new THREE.Vector3( Math.cos( degToRad( i ) ) * radius, Math.sin( degToRad( i ) ) * radius, 0 );
    let noiseIncrement = perlin.get3( currPosition ) * 0.2;
    let posX = Math.cos( degToRad( i ) ) * (radius + noiseIncrement);
    let posY = Math.sin( degToRad( i ) ) * (radius + noiseIncrement);
    let geom = new THREE.BoxGeometry( 0.1, 0.1, 0.1 );
    let material = new THREE.MeshBasicMaterial( { color: 0xFF0000 } );
    let cube = new THREE.Mesh( geom, material );
    cube.position.x = posX;
    cube.position.y = posY;
    cubeContainer.add( cube );
}



scene.add( cubeContainer );

//console.log( originalPositions );
let testCounter = 0;

const lineMaterial = new THREE.LineBasicMaterial({
	color: 0xf5ebe0
});

let haveLinesBeenDrawn = false;

function animate(){
    if( testCounter <= 250 ){
    
    }
    
    if( testCounter == 250 && !haveLinesBeenDrawn ){
        haveLinesBeenDrawn = true;
        //document.write('<img src="' + + '"/>');
    }    

    testCounter++;

    renderer.render( scene, camera );
}//animate

renderer.setAnimationLoop( animate );

//Utilities

function degToRad(degrees){
  let pi = Math.PI;
  return degrees * (pi/180);
}

function computeDistance( x1, x2, y1, y2, z1, z2 ){
    let a = x2 - x1;
    let b = y2 - y1;
    let c = z2 - z1;
    let distance = Math.sqrt( a * a + b * b + c * c );
    return distance;
}

document.addEventListener( 'keyup', function( e ){
    if( e.key == 'p' ){
        const canvas = renderer.domElement;
        const img = canvas.toDataURL('image/png');
        document.getElementById( 'exportedImg' ).src = img;
    }
});