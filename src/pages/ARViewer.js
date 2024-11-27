import React, { useState, useRef, useEffect } from 'react';
import '@google/model-viewer'; // Import the model-viewer library for 3D model rendering
import '../styles/ARViewer.css'; // Import CSS styles for the component
import { initializeApp, getApps } from 'firebase/app'; // Firebase app initialization
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage'; // Firebase storage utilities

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCfWYRWOQyNrn9WGv3Wfz_EM47ZpbL_Yqs",
  authDomain: "virtual-world-84ce0.firebaseapp.com",
  projectId: "virtual-world-84ce0",
  storageBucket: "virtual-world-84ce0.appspot.com",
  messagingSenderId: "306111432374",
  appId: "1:306111432374:web:1b7d4cfea3b7ab7ef123f7",
  measurementId: "G-1K1M3CNJR7"
};

// Initialize Firebase app if not already initialized
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Get Firebase storage instance
const storage = getStorage(app);

const MuseumViewer = () => {
  // States for managing component data and behavior
  const [modelSrc, setModelSrc] = useState(''); // Source URL of the selected 3D model
  const [firebaseFiles, setFirebaseFiles] = useState([]); // List of 3D models stored in Firebase
  const [loading, setLoading] = useState(false); // Loading indicator
  const [isWebXRSupported, setIsWebXRSupported] = useState(false); // WebXR support status
  const [modelHistory, setModelHistory] = useState({}); // Metadata (history) for models
  const [historyText, setHistoryText] = useState(''); // History text for the selected model
  const [isReading, setIsReading] = useState(false); // Text-to-speech status
  const inputFileRef = useRef(null); // Reference for the file input element
  const modelViewerRef = useRef(null); // Reference for the model-viewer element

  // Check if the device supports WebXR for AR compatibility
  useEffect(() => {
    if (navigator.xr) {
      navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
        setIsWebXRSupported(supported);
      });
    }
  }, []);

  // Load all 3D models from Firebase storage
  const loadFirebaseFiles = async () => {
    const listRef = ref(storage, '/'); // Reference to the root directory in Firebase storage
    const res = await listAll(listRef); // Fetch list of all files
    const files = await Promise.all(
      res.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef); // Get the download URL for each file
        return { name: itemRef.name, url }; // Store file name and URL
      })
    );
    setFirebaseFiles(files); // Update state with fetched files
  };

  // Load metadata (history) for models from a JSON file in Firebase storage
  const loadMetadata = async () => {
    const metadataRef = ref(storage, 'metadata.json'); // Reference to metadata file
    const metadataUrl = await getDownloadURL(metadataRef); // Fetch metadata file URL
    const response = await fetch(metadataUrl); // Fetch metadata file content
    const data = await response.json(); // Parse JSON data
    setModelHistory(data); // Update state with metadata
  };

  // Run once to load models and metadata when the component mounts
  useEffect(() => {
    loadFirebaseFiles();
    loadMetadata();
  }, []);

  // Handle file upload from the user's local system
  const handleFileUpload = (event) => {
    const file = event.target.files[0]; // Get the uploaded file
    if (file && (file.name.endsWith('.glb') || file.name.endsWith('.gltf'))) {
      const url = URL.createObjectURL(file); // Generate a local URL for the file
      setModelSrc(url); // Set the model source to the uploaded file
      setHistoryText('History not available for this model.'); // Default history for local files
    } else {
      alert('Please upload a .glb or .gltf file'); // Show an alert for unsupported file formats
    }
  };

  // Open the file selection dialog
  const triggerFileInput = () => {
    inputFileRef.current.click();
  };

  // Handle the selection of a model from Firebase
  const handleFirebaseFileUpload = async (url, name) => {
    setLoading(true); // Show loading indicator
    setModelSrc(url); // Set the selected model's source
    const description = modelHistory[name] || 'History not available for this model.'; // Get model history
    setHistoryText(description); // Update the history text
    readAloud(description); // Read the history aloud
    setLoading(false); // Hide loading indicator
  };

  // Text-to-speech function with cancel functionality
  const readAloud = (text) => {
    if (isReading) {
      // If already reading, stop the speech
      window.speechSynthesis.cancel();
      setIsReading(false); // Update state
    } else {
      // Create a new speech synthesis instance
      const speech = new SpeechSynthesisUtterance();
      speech.text = text;
      speech.lang = 'en-US';
      speech.rate = 1;
      speech.pitch = 1;

      // Start speech synthesis
      window.speechSynthesis.speak(speech);
      setIsReading(true); // Update state
    }
  };

  // Start an AR session using WebXR
  const startARSession = async () => {
    if (!navigator.xr) {
      alert('WebXR is not supported on this device.'); // Alert if WebXR is unavailable
      return;
    }

    try {
      const xrSession = await navigator.xr.requestSession('immersive-ar', {
        requiredFeatures: ['local-floor'] // Features required for AR
      });

      const modelViewer = modelViewerRef.current; // Access model-viewer reference
      modelViewer.setAttribute('xr', '');
      modelViewer.xrSession = xrSession; // Link AR session to model-viewer
      modelViewer.activateAR(); // Activate AR

      // End the AR session when done
      xrSession.addEventListener('end', () => {
        modelViewer.xrSession = null;
      });
    } catch (error) {
      console.error('Failed to start AR session:', error); // Log errors
      alert('Unable to start AR session on this device.');
    }
  };

  return (
    <div className="ar-viewer-container">
      {/* File upload button */}
      <button className="upload-button" onClick={triggerFileInput}>Upload 3D Model</button>
      <input
        type="file"
        accept=".glb,.gltf"
        style={{ display: 'none' }}
        ref={inputFileRef}
        onChange={handleFileUpload}
      />

      {/* Firebase model selector */}
      <div className="firebase-file-selector">
        <label>Select 3D Model from Firebase:</label>
        <select onChange={(e) => {
          const selectedFile = firebaseFiles.find(file => file.url === e.target.value);
          handleFirebaseFileUpload(selectedFile.url, selectedFile.name);
        }}>
          <option value="">Select a model...</option>
          {firebaseFiles.map((file) => (
            <option key={file.url} value={file.url}>
              {file.name}
            </option>
          ))}
        </select>
      </div>

      {/* 3D model viewer */}
      {modelSrc && (
        <div className="model-viewer-container">
          <model-viewer
            ref={modelViewerRef}
            src={modelSrc}
            alt="A 3D model"
            ar
            ar-modes="webxr scene-viewer quick-look"
            camera-controls
            auto-rotate
            style={{ width: '100%', height: '500px' }}
            touch-action="manipulation"
            interaction-prompt="when-focused"
            environment-image="neutral"
            exposure="1"
            shadow-intensity="1"
            shadow-softness="0.5"
            min-camera-orbit="auto auto 0deg"
            max-camera-orbit="auto auto 360deg"
            min-field-of-view="10deg"
            max-field-of-view="45deg"
          >
            <button className="ar-button" slot="ar-button">View in AR</button>
          </model-viewer>
        </div>
      )}

      {/* Model history section */}
      {modelSrc && (
        <div className="history-section">
          <h3>History</h3>
          <p>{historyText}</p>
          <button onClick={() => readAloud(historyText)}>🔊 Read Aloud</button>
        </div>
      )}

      {/* AR session button for HoloLens */}
      {isWebXRSupported && modelSrc && (
        <div className="hololens-ar">
          <button
            className="ar-button hololens-button"
            onClick={startARSession}
          >
            View in HoloLens
          </button>
          <p className="ar-support-text">
            Use a WebXR-compatible browser (e.g., Microsoft Edge) on HoloLens to access this view.
          </p>
        </div>
      )}

      {/* Loading indicator */}
      {loading && <div className="loading">Loading...</div>}
    </div>
  );
};

export default MuseumViewer;
