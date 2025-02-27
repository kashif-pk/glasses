import cv2
import numpy as np
import dlib
from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import os
import tempfile

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load face detector and landmark predictor
detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor("shape_predictor_68_face_landmarks.dat")

def get_landmarks(image):
    """Get facial landmarks from an image"""
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    faces = detector(gray)
    
    if len(faces) == 0:
        return None
    
    # Get the first face
    face = faces[0]
    landmarks = predictor(gray, face)
    
    # Convert landmarks to numpy array
    points = []
    for i in range(68):
        x = landmarks.part(i).x
        y = landmarks.part(i).y
        points.append([x, y])
    
    return np.array(points)
"""
 def analyze_face_shape(landmarks):
    Analyze face shape based on facial landmarks
    # Extract specific landmark groups
    jawline = landmarks[0:17]
    eyebrows = landmarks[17:27]
    nose = landmarks[27:36]
    eyes = landmarks[36:48]
    mouth = landmarks[48:68]
    
    # Calculate measurements
    # Face width at the cheekbones
    face_width = np.linalg.norm(landmarks[0] - landmarks[16])
    # Face height from chin to forehead
    face_height = np.linalg.norm(landmarks[8] - landmarks[27])
    # Jawline width
    jaw_width = np.linalg.norm(landmarks[3] - landmarks[13])
    # Forehead width
    forehead_width = np.linalg.norm(landmarks[17] - landmarks[26])
    # Cheekbone width
    cheekbone_width = np.linalg.norm(landmarks[1] - landmarks[15])
    
    # Calculate ratios
    width_to_height = face_width / face_height
    jaw_to_forehead = jaw_width / forehead_width
    cheekbone_to_jaw = cheekbone_width / jaw_width
    
    # Determine face shape
    if width_to_height > 0.85 and width_to_height < 0.92:
        face_shape = "Round"
    elif width_to_height < 0.8 and jaw_to_forehead < 0.9:
        face_shape = "Oval"
    elif cheekbone_to_jaw > 1.2 and jaw_width < forehead_width:
        face_shape = "Heart"
    elif jaw_to_forehead > 1.1:
        face_shape = "Triangle"
    elif jaw_to_forehead > 0.9 and jaw_to_forehead < 1.1 and width_to_height < 0.85:
        face_shape = "Square"
    elif width_to_height > 0.92:
        face_shape = "Diamond"
    else:
        face_shape = "Oval"  # Default
    
    return face_shape """














def analyze_face_shape(landmarks):
    """Analyze face shape based on facial landmarks"""

    # Extract key facial points
    jawline = landmarks[0:17]
    eyebrows = landmarks[17:27]
    nose = landmarks[27:36]
    eyes = landmarks[36:48]
    mouth = landmarks[48:68]

    # Calculate facial measurements
    face_width = np.linalg.norm(landmarks[1] - landmarks[15])  # Cheekbone width
    face_height = np.linalg.norm(landmarks[8] - landmarks[27])  # Face height (chin to forehead)
    jaw_width = np.linalg.norm(landmarks[3] - landmarks[13])  # Jaw width
    forehead_width = np.linalg.norm(landmarks[17] - landmarks[26])  # Forehead width

    # Calculate ratios
    width_to_height_ratio = face_width / face_height
    jaw_to_forehead_ratio = jaw_width / forehead_width
    cheekbone_to_jaw_ratio = face_width / jaw_width

    # Determine face shape using improved thresholds
    if 0.9 <= width_to_height_ratio <= 1.05 and cheekbone_to_jaw_ratio < 1.1:
        face_shape = "Round"
    elif width_to_height_ratio < 0.85 and jaw_to_forehead_ratio < 0.9:
        face_shape = "Oval"
    elif cheekbone_to_jaw_ratio > 1.2 and forehead_width > jaw_width:
        face_shape = "Heart"
    elif jaw_to_forehead_ratio > 1.1 and cheekbone_to_jaw_ratio < 1.15 and forehead_width < jaw_width:
        face_shape = "Triangle"
    elif 0.95 <= jaw_to_forehead_ratio <= 1.05 and width_to_height_ratio < 0.85:
        face_shape = "Square"
    elif width_to_height_ratio > 1.05 and cheekbone_to_jaw_ratio > 1.15:
        face_shape = "Diamond"
    else:
        face_shape = "Oval"  # Default fallback

    return face_shape
















@app.route('/api/detect-face-shape', methods=['POST'])
def detect_face_shape():
    """API endpoint to detect face shape from an image"""
    if 'image' not in request.files:
        return jsonify({"error": "No image provided"}), 400
    
    file = request.files['image']
    
    # Save the file temporarily
    temp_file = tempfile.NamedTemporaryFile(delete=False)
    file.save(temp_file.name)
    
    try:
        # Load the image
        image = cv2.imread(temp_file.name)
        if image is None:
            return jsonify({"error": "Invalid image file"}), 400
        
        # Get facial landmarks
        landmarks = get_landmarks(image)
        if landmarks is None:
            return jsonify({"error": "No face detected in the image"}), 400
        
        # Determine face shape
        face_shape = analyze_face_shape(landmarks)
        
        # Convert landmarks to list for JSON serialization
        landmarks_list = landmarks.tolist()
        
        # Return the results
        return jsonify({
            "faceShape": face_shape,
            "landmarks": landmarks_list
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    finally:
        # Clean up the temporary file
        if os.path.exists(temp_file.name):
            os.unlink(temp_file.name)

if __name__ == "__main__":
    app.run(debug=True, port=5000)