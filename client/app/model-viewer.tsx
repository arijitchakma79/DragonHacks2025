// app/model-viewer.tsx

import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useLocalSearchParams } from 'expo-router';

const API_BASE_URL = 'http://10.250.106.84:5000'; // your server IP

const ModelViewerScreen = () => {
  const { fileId } = useLocalSearchParams<{ fileId: string }>();

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
    camera.position.z = 3; // 👈 Camera closer

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 0, 5).normalize();
    scene.add(light);

    const objLoader = new OBJLoader();

    try {
      const modelUrl = `${API_BASE_URL}/download/models/${fileId}`;

      const model = await new Promise<THREE.Group>((resolve, reject) => {
        objLoader.load(
          modelUrl,
          (object) => resolve(object),
          undefined,
          (error) => reject(error)
        );
      });

      scene.add(model);

      // ✨ MAKE THE MODEL BIGGER
      model.scale.set(10, 10, 10); // (X, Y, Z)

      // ✨ Center model properly (optional, if model seems off)
      const box = new THREE.Box3().setFromObject(model);
      const center = new THREE.Vector3();
      box.getCenter(center);
      model.position.sub(center); // Center the model at origin (0,0,0)

      // ✨ Add OrbitControls
      const controls = new OrbitControls(camera, gl.canvas as any);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.rotateSpeed = 0.5;
      controls.zoomSpeed = 1.0;
      controls.panSpeed = 0.8;
      controls.autoRotate = true; // 👈 AUTO ROTATE
      controls.autoRotateSpeed = 0.5; // 👈 Slow smooth spin

      const animate = () => {
        requestAnimationFrame(animate);

        controls.update(); // Update controls
        renderer.render(scene, camera);
        gl.endFrameEXP();
      };

      animate();
    } catch (error) {
      console.error('Failed to load 3D model:', error);
    }
  };

  if (!fileId) {
    return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
  }

  return (
    <View style={{ flex: 1 }}>
      <GLView style={{ flex: 1 }} onContextCreate={renderScene} />
    </View>
  );
};

export default ModelViewerScreen;
