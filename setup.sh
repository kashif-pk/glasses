#!/bin/bash

# Exit on error
set -e

echo "Setting up Glasses Recommender Web Application..."

# Update system
echo "Updating system packages..."
sudo apt update

# Install Node.js and npm if not already installed
if ! command -v node &> /dev/null; then
    echo "Installing Node.js and npm..."
    sudo apt install -y nodejs npm
else
    echo "Node.js and npm already installed."
fi

# Install Python and pip if not already installed
if ! command -v python3 &> /dev/null; then
    echo "Installing Python3 and pip3..."
    sudo apt install -y python3 python3-pip
else
    echo "Python3 and pip3 already installed."
fi

# Install required system packages for dlib
echo "Installing dependencies for dlib..."
sudo apt install -y cmake build-essential libopenblas-dev liblapack-dev libx11-dev libgtk-3-dev

# Create project directories
echo "Creating project directories..."
mkdir -p src/{js,css,python,assets/{images/glasses,models}}

# Download face-api.js models
echo "Downloading face-api.js models..."
mkdir -p src/assets/models

# Define models to download (using raw GitHub URLs)
MODELS=(
    "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-weights_manifest.json"
    "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-shard1"
    "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-weights_manifest.json"
    "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-shard1"
)

for model in "${MODELS[@]}"; do
    filename=$(basename "$model")
    wget -O "src/assets/models/$filename" "$model"
done

# Download dlib shape predictor
echo "Downloading dlib shape predictor model..."
wget -O shape_predictor_68_face_landmarks.dat.bz2 http://dlib.net/files/shape_predictor_68_face_landmarks.dat.bz2
bunzip2 shape_predictor_68_face_landmarks.dat.bz2
mv shape_predictor_68_face_landmarks.dat src/python/

# Initialize npm project
echo "Initializing npm project..."
npm init -y

# Install frontend dependencies
echo "Installing frontend dependencies..."
npm install face-api.js bootstrap

# Install Python dependencies
echo "Installing Python dependencies..."
pip3 install flask flask-cors opencv-python numpy dlib

# Create placeholder images for glasses
echo "Setting up placeholder glasses images..."
mkdir -p src/assets/images/glasses

# Download sample glasses images or create placeholders
for style in square-frames rectangle-frames wayfarer-frames geometric-frames aviator-frames round-frames oval-frames rimless-frames browline-frames cat-eye-frames decorative-frames bottom-heavy-frames; do
    touch "src/assets/images/glasses/${style}.jpg"
    echo "Placeholder for ${style}" > "src/assets/images/glasses/${style}.jpg"
done

echo "Setup completed successfully!"
echo "Run the app with: python3 src/python/face_shape_detector.py & npx live-server"