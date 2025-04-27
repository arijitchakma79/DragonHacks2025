// src/screens/ModelViewerScreen.tsx

import React, { useRef, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import { Asset } from 'expo-asset';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { useLocalSearchParams } from 'expo-router';


const API_BASE_URL = 'http://10.250.106.84:5000';


export default function ModelViewerScreen() {
    const { fileId } = useLocalSearchParams<{ fileId: string }>();
  
    const renderScene = async (gl: ExpoWebGLRenderingContext) => {
      const renderer = new Renderer({ gl });
      renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
  
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xffffff);
  
      const camera = new THREE.PerspectiveCamera(70, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.01, 1000);
      camera.position.z = 3;
  
      const light = new THREE.DirectionalLight(0xffffff, 1);
      light.position.set(0, 0, 5).normalize();
      scene.add(light);
  
      const objLoader = new OBJLoader();
  
      // Load OBJ model from backend
      const objUrl = `${API_BASE_URL}/download/models/${fileId}`;
  
      const model = await new Promise<THREE.Group>((resolve, reject) => {
        objLoader.load(
          objUrl,
          (object) => resolve(object),
          undefined,
          (error) => reject(error)
        );
      });
  
      scene.add(model);
  
      const animate = () => {
        requestAnimationFrame(animate);
  
        model.rotation.y += 0.01;
  
        renderer.render(scene, camera);
        gl.endFrameEXP();
      };
  
      animate();
    };
  
    if (!fileId) {
      return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
    }
  
    return (
      <View style={{ flex: 1 }}>
        <GLView style={{ flex: 1 }} onContextCreate={renderScene} />
      </View>
    );
  }