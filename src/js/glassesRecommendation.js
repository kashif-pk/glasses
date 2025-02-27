// Get glasses recommendations based on face shape
function getGlassesRecommendations(faceShape) {
    const recommendations = {
        Round: [
            {
                name: 'Square Frames',
                image: 'src/assets/images/glasses/square-frames.jpg',
                description: 'Square or rectangular frames add angles to your soft features.'
            },
            {
                name: 'Rectangle Frames',
                image: 'src/assets/images/glasses/rectangle-frames.jpg',
                description: 'Rectangle frames create contrast with your round face shape.'
            },
            {
                name: 'Wayfarer Style',
                image: 'src/assets/images/glasses/wayfarer-frames.jpg',
                description: 'Wayfarer styles provide a classic look that balances round features.'
            }
        ],
        Oval: [
            {
                name: 'Geometric Frames',
                image: 'src/assets/images/glasses/geometric-frames.jpg',
                description: 'Geometric frames complement your balanced proportions.'
            },
            {
                name: 'Aviator Style',
                image: 'src/assets/images/glasses/aviator-frames.jpg',
                description: 'Aviator styles work well with oval faces.'
            },
            {
                name: 'Rectangle Frames',
                image: 'src/assets/images/glasses/rectangle-frames.jpg',
                description: 'Rectangle frames maintain the balance of your face shape.'
            }
        ],
        Heart: [
            {
                name: 'Bottom-Heavy Frames',
                image: 'src/assets/images/glasses/bottom-heavy-frames.jpg',
                description: 'Frames that are heavier on the bottom balance your wider forehead.'
            },
            {
                name: 'Round Frames',
                image: 'src/assets/images/glasses/round-frames.jpg',
                description: 'Round frames soften your angular features.'
            },
            {
                name: 'Aviator Style',
                image: 'src/assets/images/glasses/aviator-frames.jpg',
                description: 'Aviator styles complement heart-shaped faces well.'
            }
        ],
        Square: [
            {
                name: 'Round Frames',
                image: 'src/assets/images/glasses/round-frames.jpg',
                description: 'Round frames soften your strong jawline and forehead.'
            },
            {
                name: 'Oval Frames',
                image: 'src/assets/images/glasses/oval-frames.jpg',
                description: 'Oval frames help balance your angular features.'
            },
            {
                name: 'Rimless Frames',
                image: 'src/assets/images/glasses/rimless-frames.jpg',
                description: 'Rimless frames soften your strong facial structure.'
            }
        ],
        Triangle: [
            {
                name: 'Browline Frames',
                image: 'src/assets/images/glasses/browline-frames.jpg',
                description: 'Browline frames add width to the upper part of your face.'
            },
            {
                name: 'Cat-Eye Frames',
                image: 'src/assets/images/glasses/cat-eye-frames.jpg',
                description: 'Cat-eye frames draw attention upward to balance your jawline.'
            },
            {
                name: 'Decorative Frames',
                image: 'src/assets/images/glasses/decorative-frames.jpg',
                description: 'Frames with details on the upper part add balance to your face.'
            }
        ],
        Diamond: [
            {
                name: 'Oval Frames',
                image: 'src/assets/images/glasses/oval-frames.jpg',
                description: 'Oval frames soften your angular features.'
            },
            {
                name: 'Rimless Frames',
                image: 'src/assets/images/glasses/rimless-frames.jpg',
                description: 'Rimless frames don\'t overpower your distinctive face shape.'
            },
            {
                name: 'Cat-Eye Frames',
                image: 'src/assets/images/glasses/cat-eye-frames.jpg',
                description: 'Cat-eye frames accentuate your cheekbones.'
            }
        ]
    };
    
    // Return appropriate recommendations, or default to Oval if face shape not recognized
    return recommendations[faceShape] || recommendations['Oval'];
}