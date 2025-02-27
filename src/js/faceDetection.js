// Load face-api.js models
async function loadFaceDetectionModels() {
    try {
        await faceapi.nets.tinyFaceDetector.loadFromUri('/src/assets/models');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/src/assets/models');
        console.log('Face detection models loaded successfully');
        return true;
    } catch (error) {
        console.error('Error loading face detection models:', error);
        return false;
    }
}

// Detect face in the image
async function detectFace(img) {
    try {
        // Run detection
        const detections = await faceapi.detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks();
        
        if (!detections) {
            return {
                success: false,
                error: 'No face detected in the image. Please upload a clear photo of your face.'
            };
        }
        
        return {
            success: true,
            detection: detections.detection,
            landmarks: detections.landmarks
        };
    } catch (error) {
        console.error('Face detection error:', error);
        return {
            success: false,
            error: 'Error during face detection. Please try a different image.'
        };
    }
}

// Determine face shape based on landmarks
async function determineFaceShape(detection, landmarks) {
    // Get facial landmarks points
    const jawline = landmarks.getJawOutline();
    const nose = landmarks.getNose();
    const leftEye = landmarks.getLeftEye();
    const rightEye = landmarks.getRightEye();
    const mouth = landmarks.getMouth();
    
    // Calculate face measurements
    const faceWidth = calculateDistance(jawline[0], jawline[16]); // Width at jawline
    const faceHeight = calculateDistance(nose[0], jawline[8]); // Height from nose bridge to chin
    const jawWidth = calculateDistance(jawline[3], jawline[13]); // Width at lower jaw
    const foreheadWidth = calculateDistance(landmarks.positions[18], landmarks.positions[25]); // Width at forehead
    const cheekboneWidth = calculateDistance(landmarks.positions[1], landmarks.positions[15]); // Width at cheekbones
    
    // Calculate ratios
    const widthToHeightRatio = faceWidth / faceHeight;
    const jawToForeheadRatio = jawWidth / foreheadWidth;
    const cheekboneToJawRatio = cheekboneWidth / jawWidth;
    
    // Determine face shape based on measurements and ratios
    let faceShape;
    
    if (widthToHeightRatio > 0.85 && widthToHeightRatio < 0.92) {
        // Round face
        faceShape = 'Round';
    } else if (widthToHeightRatio < 0.8 && jawToForeheadRatio < 0.9) {
        // Oval face
        faceShape = 'Oval';
    } else if (cheekboneToJawRatio > 1.2 && jawWidth < foreheadWidth) {
        // Heart-shaped face
        faceShape = 'Heart';
    } else if (jawToForeheadRatio > 1.1) {
        // Triangle face
        faceShape = 'Triangle';
    } else if (jawToForeheadRatio > 0.9 && jawToForeheadRatio < 1.1 && widthToHeightRatio < 0.85) {
        // Square face
        faceShape = 'Square';
    } else if (widthToHeightRatio > 0.92) {
        // Diamond face
        faceShape = 'Diamond';
    } else {
        // Default to oval if no clear match
        faceShape = 'Oval';
    }
    
    return {
        faceShape,
        landmarks,
        detection
    };
}

// Helper function to calculate distance between two points
function calculateDistance(point1, point2) {
    return Math.sqrt(
        Math.pow(point2.x - point1.x, 2) + 
        Math.pow(point2.y - point1.y, 2)
    );
}

// Draw detection results on canvas
function drawDetectionResults(canvas, img, detection, landmarks, faceShape) {
    const ctx = canvas.getContext('2d');
    
    // Resize canvas to match image dimensions while maintaining aspect ratio
    const maxWidth = canvas.width;
    const maxHeight = canvas.height;
    const imgRatio = img.width / img.height;
    
    let drawWidth, drawHeight;
    
    if (imgRatio > maxWidth / maxHeight) {
        // Image is wider than canvas ratio
        drawWidth = maxWidth;
        drawHeight = maxWidth / imgRatio;
    } else {
        // Image is taller than canvas ratio
        drawHeight = maxHeight;
        drawWidth = maxHeight * imgRatio;
    }
    
    // Center image on canvas
    const xOffset = (maxWidth - drawWidth) / 2;
    const yOffset = (maxHeight - drawHeight) / 2;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw image
    ctx.drawImage(img, xOffset, yOffset, drawWidth, drawHeight);
    
    // Calculate scale factors for detected points
    const scaleX = drawWidth / img.width;
    const scaleY = drawHeight / img.height;
    
    // Draw face box
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;
    ctx.strokeRect(
        detection.box.x * scaleX + xOffset, 
        detection.box.y * scaleY + yOffset, 
        detection.box.width * scaleX, 
        detection.box.height * scaleY
    );
    
    // Draw landmarks
    ctx.fillStyle = '#ff0000';
    landmarks.positions.forEach(point => {
        ctx.beginPath();
        ctx.arc(
            point.x * scaleX + xOffset, 
            point.y * scaleY + yOffset, 
            2, 0, 2 * Math.PI
        );
        ctx.fill();
    });
    
    // Add face shape text
    ctx.font = '20px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.strokeText(
        `Face Shape: ${faceShape}`, 
        xOffset + 10, 
        yOffset + 30
    );
    ctx.fillText(
        `Face Shape: ${faceShape}`, 
        xOffset + 10, 
        yOffset + 30
    );
}