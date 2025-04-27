// app/model-viewer.tsx

import React, { useRef, useState } from 'react';
import { View, Text, ActivityIndicator, PanResponder } from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useLocalSearchParams } from 'expo-router';

const API_BASE_URL = 'http://10.250.106.84:5000'; // your server IP

const ModelViewerScreen = () => {
  const { fileId } = useLocalSearchParams<{ fileId: string }>();
  const modelRef = useRef<THREE.Group | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const [ready, setReady] = useState(false);

  let previousX = 0;
  let previousY = 0;
  let lastTouchMoveTime = 0;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (event, gestureState) => {
        previousX = gestureState.x0;
        previousY = gestureState.y0;
      },
      onPanResponderMove: (event, gestureState) => {
        const now = Date.now();
        if (now - lastTouchMoveTime > 66) { // 🔥 66 ms = ~15 fps
          if (cameraRef.current) {
            const deltaX = gestureState.moveX - previousX;
            const deltaY = gestureState.moveY - previousY;

            const rotationSpeed = 0.002; // 🔥 Smooth rotation

            cameraRef.current.rotation.y -= deltaX * rotationSpeed;
            cameraRef.current.rotation.x -= deltaY * rotationSpeed;

            previousX = gestureState.moveX;
            previousY = gestureState.moveY;

            lastTouchMoveTime = now;
          }
        }
      },
      onPanResponderRelease: () => {
        previousX = 0;
        previousY = 0;
      },
    })
  ).current;

  const renderScene = async (gl: ExpoWebGLRenderingContext) => {
    const renderer = new Renderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    const camera = new THREE.PerspectiveCamera(
      75,
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      0.1,
      1000
    );
    camera.position.z = 3;
    cameraRef.current = camera;

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 0, 5).normalize();
    scene.add(light);

    const animate = () => {
      requestAnimationFrame(animate);

      if (controlsRef.current) controlsRef.current.update();
      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    animate(); // Start rendering immediately

    const objLoader = new OBJLoader();

    try {
      const modelUrl = `${API_BASE_URL}/download/models/${fileId}`;

      console.log('Downloading model from:', modelUrl);

      const model = await new Promise<THREE.Group>((resolve, reject) => {
        objLoader.load(
          modelUrl,
          (object) => resolve(object),
          (xhr) => {
            console.log(`Model loading: ${(xhr.loaded / xhr.total) * 100}%`);
          },
          (error) => reject(error)
        );
      });

      scene.add(model);
      model.scale.set(10, 10, 10);

      // Center model
      const box = new THREE.Box3().setFromObject(model);
      const center = new THREE.Vector3();
      box.getCenter(center);
      model.position.sub(center);

      modelRef.current = model;

      const controls = new OrbitControls(camera, gl.canvas as any);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.zoomSpeed = 1.0;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.5;
      controlsRef.current = controls;

      setReady(true); // Model fully ready
    } catch (error) {
      console.error('Failed to load 3D model:', error);
    }
  };

  if (!fileId || !ready) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 20, fontSize: 16 }}>Loading 3D Model...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }} {...panResponder.panHandlers}>
      <GLView style={{ flex: 1 }} onContextCreate={renderScene} />
    </View>
  );
};

export default ModelViewerScreen;
