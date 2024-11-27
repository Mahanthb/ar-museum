# AR Museum: React Application for 3D Model Viewing and Editing

## Project Overview

The **AR Museum** is a React-based application that allows users to view, edit, and interact with 3D models in both desktop and augmented reality (AR) environments. Users can upload local 3D model files, select models from Firebase storage, and customize the viewing experience with various controls and editing features.

This project includes two main components:
1. **MuseumViewer**: For selecting, viewing, and exploring 3D models with history descriptions and AR capabilities.
2. **Editor**: For editing 3D models, controlling scene properties, and experimenting with animations.

---

## Features

### Museum Viewer
- **3D Model Display**: Supports `.glb` and `.gltf` files.
- **Firebase Integration**: Allows users to load 3D models stored in Firebase Cloud Storage.
- **Model Metadata**: Displays historical information or descriptions associated with the selected model.
- **Text-to-Speech (TTS)**: Reads aloud the historical information of the model.
- **AR Support**: Provides AR viewing options via WebXR, compatible with devices like HoloLens.
- **File Upload**: Enables users to upload and view 3D models directly from their local storage.

### Editor
- **Scene Customization**:
  - Change background color.
  - Enable/disable wireframe mode for the 3D model.
- **Lighting Controls**:
  - Adjust ambient light intensity.
  - Modify directional light position and intensity.
- **Animation Controls**: Play and pause animations embedded in the 3D model.
- **Shadow Support**: Models cast and receive realistic shadows.
- **Grid Helper**: Visual aid for understanding object orientation in the scene.

---

## Technologies Used

### Frontend
- **React**: Core library for building the UI.
- **@react-three/fiber**: For rendering 3D content in the browser.
- **@react-three/drei**: Provides useful helpers like `Environment` and `OrbitControls`.
- **Three.js**: Underlying 3D rendering engine.

### Backend
- **Firebase**:
  - **Cloud Storage**: Stores 3D models and metadata.
  - **Configuration**: Handles secure API key and storage bucket integration.

---

## Setup and Installation

### Prerequisites
- Node.js (v14 or later)
- Firebase project with a configured storage bucket

### Steps
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ar-museum
2. Install dependencies:
   ```bash
   npm install
3. Start the development server:
   ```bash
   npm start


## Usage

### Museum Viewer

#### Upload Local Files:
- Click the **"Upload 3D Model"** button.
- Select a `.glb` or `.gltf` file from your computer.
- The model will load in the viewer.

#### Select Firebase Files:
- Use the dropdown menu to choose a file stored in Firebase.
- The model and its associated description will appear in the viewer.

#### View in AR:
- Click the **"View in AR"** button to start the augmented reality experience (WebXR-compatible devices required).

---

### Editor

#### Load a Model:
- Use the **file upload** button to load a `.glb` model.

#### Customize Scene:
- Change background color, lighting, and toggle wireframe mode using the controls panel.

#### Control Animations:
- Play or pause animations embedded in the model.

#### Experiment with Lights:
- Adjust light position and intensity for better visualization.

---

## Future Enhancements

1. **Support for More Formats**:
   - Add compatibility for additional 3D file formats, such as `.obj` and `.fbx`.

2. **User Authentication**:
   - Integrate a user login system to personalize uploaded files and settings.

3. **Collaborative Editing**:
   - Enable multiple users to collaboratively edit the same 3D model in real time.

4. **Improved AR Features**:
   - Real-world scaling for accurate AR representations.
   - Anchoring and interaction with real-world surfaces.

5. **Performance Optimization**:
   - Enhance rendering performance for large models and complex scenes.

6. **Model History**:
   - Add a version control system to track changes made to models over time.

7. **Interactive Tutorials**:
   - Provide in-app guides and tutorials for using the Viewer and Editor.

