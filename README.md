# 🩺 WoundWatch
[![Flask](https://img.shields.io/badge/Flask-000?logo=flask&logoColor=fff)](#)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-886FBF?logo=googlegemini&logoColor=fff)](#)
[![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?logo=mongodb&logoColor=white)](#)
[![Three.js](https://img.shields.io/badge/Three.js-000?logo=threedotjs&logoColor=fff)](#)
[![PyTorch](https://img.shields.io/badge/PyTorch-ee4c2c?logo=pytorch&logoColor=white)](#)
[![Hugging Face](https://img.shields.io/badge/Hugging%20Face-FFD21E?logo=huggingface&logoColor=000)](#)
[![React Native](https://img.shields.io/badge/React_Native-%2320232a.svg?logo=react&logoColor=%2361DAFB)](#)
[![Expo](https://img.shields.io/badge/Expo-000020?logo=expo&logoColor=fff)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff)](#)
![Open3D](https://img.shields.io/badge/Open3D-lightgrey)

## Overview
WoundWatch helps healthcare workers quantitatively track the progression of chronic wounds, such as burns, ulcers, and lesions, by reconstructing the affected area in 3D from simple 2D photographs. Using depth estimation and 3D modeling, WoundWatch provides precise measurements of wound size and shape over time, empowering providers with insights for better treatment and healing outcomes. 

Chronic wounds affect millions of people in the US alone. An estimated excess of $25 billion is spent annually on the treatment of chronic wounds in the US [(Sen et. al., 2009).](https://pubmed.ncbi.nlm.nih.gov/19903300/)

## Motivation
Chronic wounds affect millions of people, and tracking their healing can be challenging with traditional methods. Clinicians rely on simple rulers or probes to measure wound size and depth, which can be **inaccurate, time-consuming, and even painful** for patients. We created **WoundWatch** to streamline this process. We created a simple, accessible tool that leverages modern AI and 3D reconstruction to give healthcare workers *quantitative, visual* and *actionable* wound data, all from a smartphone photo. We hope to improve patient outcomes–enabling earlier interventions and reducing the need for frequent in-person checkups.

## How we built it

- **Frontend**: **React Native** app using **TypeScript** and **Expo** 
- **Backend**: **Flask** server (Python) and **PyTorch** for model loading (**Huggingface**) and inference
- **AI Modeling & Analysis**: We use a state-of-the-art open source model, DepthAnythingV2, to generate a depth map from a 2D wound image. Next, we apply another state-of-the-art open source model (from Meta), Segment Anything Model, to segment and identify the wound region in the image. By combining the wound mask from SAM with the depth map, we reconstruct a 3D point cloud of the wound using **Open3D**. We then calculate metrics like length, depth, and surface area. Google **Gemini** is used to analyze user data and allow the patient or health professional to converse with LLM reasoning
- **Database & Storage**: We used **MongoDB** to store user data, wound measurements, and 3D mesh outputs, ensuring persistent and scalable storage accessible across devices

Additionally, we primed data for **fine-tuning** our reconstruction and segmentation models using the [Chronic Wound Database](https://chronicwounddatabase.eu) to improve clinical performance

## Challenges we ran into
- First time using **Expo** + **React-native**
- Working with pretrained models (**DepthAnythingV2**, **SAM**) in a low-resource hackathon environment involved careful optimization (CPU + GPU juggling)
- Managing async frontend-backend communication, particularly for image and mesh file transfers
- Calculating the wound area measurements involved projecting from the pixels from the 2D image space to the 3D Object space. Wrestling with these coordinate transforms introduced many bugs

## Accomplishments that we're proud of
- Built a full pipeline from a *single 2D image* -> *depth map* -> *segmentation* -> *3D Mesh* + *Analysis* 
- Successfully integrated cutting-edge depth and segmentation AI models into a lightweight, real-time app
- Created an end-to-end practical solution for clinical use within a short 24-hour hackathon window

## What we learned
- Learned about the prevalence and burden of chronic wounds on global health
- Gained experience integrating estimation and segmentation models together for medical reconstruction tasks
- How to develop a lightweight, local-first AI-powered pipeline for healthcare in a limited 24-hour time window all while experimenting with a new tech stack

## What's next for WoundWatch
- **Usability:** Refine the frontend and user interface
- **Longitudinal tracking:** Automatically overlay wound meshes from different dates to visualize healing progression
- **Texture Mapping:** Colorize 3D meshes using original image RGB data
- **Mesh smoothing:** Improve 3D mesh quality and consistency
- **Clinical validation:** Work with healthcare providers to refine measurement accuracy and field-test the app with real patient data

## References
- Sen CK, Gordillo GM, Roy S, et al. Human skin wounds: A major and snowballing threat to public health and the economy. Wound Repair Regen. 2009;17(6):763–771
- Chronic Wound Database