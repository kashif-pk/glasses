document.addEventListener('DOMContentLoaded', async () => {
    // DOM elements
    const imageUpload = document.getElementById('imageUpload');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');
    const resultContainer = document.getElementById('resultContainer');
    const errorContainer = document.getElementById('errorContainer');
    const errorMessage = document.getElementById('errorMessage');
    const outputCanvas = document.getElementById('outputCanvas');
    const faceShapeResult = document.getElementById('faceShapeResult');
    const glassesRecommendations = document.getElementById('glassesRecommendations');

    // Load face-api.js models
    await loadFaceDetectionModels();
    
    // Event listeners
    analyzeBtn.addEventListener('click', handleImageAnalysis);
    
    async function handleImageAnalysis() {
        // Reset UI
        resultContainer.classList.add('d-none');
        errorContainer.classList.add('d-none');
        
        // Check if file is selected
        if (!imageUpload.files || imageUpload.files.length === 0) {
            showError('Please select an image to analyze.');
            return;
        }
        
        const file = imageUpload.files[0];
        
        // Validate file type
        if (!file.type.match('image.*')) {
            showError('Please select a valid image file.');
            return;
        }
        
        // Show progress
        progressContainer.classList.remove('d-none');
        updateProgress(10, 'Loading image...');
        
        try {
            // Load image
            const img = await loadImage(file);
            updateProgress(30, 'Detecting face...');
            
            // Detect face and landmarks
            const detectionResult = await detectFace(img);
            
            if (!detectionResult.success) {
                showError(detectionResult.error);
                progressContainer.classList.add('d-none');
                return;
            }
            
            updateProgress(60, 'Analyzing face shape...');
            
            // Determine face shape
            const { faceShape, landmarks, detection } = await determineFaceShape(detectionResult.detection, detectionResult.landmarks);
            
            updateProgress(80, 'Generating recommendations...');
            
            // Draw face landmarks on canvas
            drawDetectionResults(outputCanvas, img, detection, landmarks, faceShape);
            
            // Display face shape
            faceShapeResult.textContent = faceShape;
            
            // Show recommendations
            const recommendations = getGlassesRecommendations(faceShape);
            displayRecommendations(recommendations);
            
            updateProgress(100, 'Complete!');
            
            // Show results
            resultContainer.classList.remove('d-none');
            
            // Hide progress after a delay
            setTimeout(() => {
                progressContainer.classList.add('d-none');
            }, 500);
            
        } catch (error) {
            console.error('Analysis error:', error);
            showError('An error occurred during analysis. Please try again.');
            progressContainer.classList.add('d-none');
        }
    }
    
    function showError(message) {
        errorMessage.textContent = message;
        errorContainer.classList.remove('d-none');
    }
    
    function updateProgress(percent, message = '') {
        progressBar.style.width = `${percent}%`;
        progressBar.setAttribute('aria-valuenow', percent);
        
        if (message) {
            progressBar.textContent = message;
        }
    }
    
    function loadImage(file) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = URL.createObjectURL(file);
        });
    }
    
    function displayRecommendations(recommendations) {
        glassesRecommendations.innerHTML = '';
        
        recommendations.forEach((rec, index) => {
            const recElement = document.createElement('div');
            recElement.className = 'glasses-option';
            recElement.innerHTML = `
                <div class="recommendation-title">${rec.name}</div>
                <img src="${rec.image}" alt="${rec.name}" class="img-fluid">
                <div>${rec.description}</div>
            `;
            
            recElement.addEventListener('click', () => {
                // Remove selected class from all options
                document.querySelectorAll('.glasses-option').forEach(el => {
                    el.classList.remove('selected');
                });
                
                // Add selected class to this option
                recElement.classList.add('selected');
                
                // TODO: Implement virtual try-on functionality
            });
            
            glassesRecommendations.appendChild(recElement);
        });
    }
});