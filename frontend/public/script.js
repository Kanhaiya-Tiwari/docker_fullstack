function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 5 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 15}s`;
        particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
        
        particlesContainer.appendChild(particle);
    }
}

// Initialize particles
createParticles();

// Form submission handler
document.getElementById('registrationForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = document.querySelector('.submit-btn');
    const messageDiv = document.getElementById('message');
    
    // Get form data
    const formData = {
        fullname: document.getElementById('fullname').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        age: parseInt(document.getElementById('age').value),
        gender: document.getElementById('gender').value,
        country: document.getElementById('country').value
    };
    
    // Add loading state
    submitBtn.classList.add('loading');
    messageDiv.classList.remove('show', 'success', 'error');
    
    try {
        const response = await fetch('/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        // Show message
        messageDiv.textContent = data.message;
        messageDiv.classList.add('show', data.success ? 'success' : 'error');
        
        if (data.success) {
            // Reset form on success
            document.getElementById('registrationForm').reset();
            
            // Add success animation
            submitBtn.style.background = 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)';
            setTimeout(() => {
                submitBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            }, 2000);
        }
    } catch (error) {
        console.error('Error:', error);
        messageDiv.textContent = 'Network error. Please check your connection.';
        messageDiv.classList.add('show', 'error');
    } finally {
        submitBtn.classList.remove('loading');
    }
});

// Add input animations
document.querySelectorAll('input, select').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'translateX(5px)';
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'translateX(0)';
    });
});