// Scroll animations
document.addEventListener('DOMContentLoaded', function() {
    // Intersection Observer for fade-in animations
    const fadeElements = document.querySelectorAll('section:not(#hero), .feature, .metric-card, .principle');
    
    // Add fade-in and visible classes to all elements we want to animate
    // Adding visible class immediately prevents content from disappearing
    fadeElements.forEach(el => {
        el.classList.add('fade-in');
        el.classList.add('visible');
    });
    
    // Observer callback - no longer needed since we're making elements visible immediately
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    };
    
    // Create and setup the observer
    const observer = new IntersectionObserver(observerCallback, {
        root: null,
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    });
    
    // Observe all elements with fade-in class - no longer needed
    // fadeElements.forEach(el => {
    //     observer.observe(el);
    // });
    
    // Scroll indicator functionality
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            // Scroll to the first section after the fold
            const insightsSection = document.querySelector('#insights');
            if (insightsSection) {
                window.scrollTo({
                    top: insightsSection.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    }
    
    // Show/hide scroll indicator based on scroll position
    window.addEventListener('scroll', function() {
        if (scrollIndicator) {
            if (window.scrollY > 100) {
                scrollIndicator.style.opacity = '0';
            } else {
                scrollIndicator.style.opacity = '0.8';
            }
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Subtle parallax effect on hero section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        window.addEventListener('scroll', () => {
            const scrollPos = window.scrollY;
            if (scrollPos < window.innerHeight) {
                heroSection.style.backgroundPosition = `center ${scrollPos * 0.4}px`;
            }
        });
    }
    
    // Initialize performance chart
    initPerformanceChart();
});

// Initialize performance chart
function initPerformanceChart() {
    const ctx = document.getElementById('performanceChart');
    
    if (!ctx) return;
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Sample data for performance chart
    const algorithmData = [
        10000, 11500, 13200, 12800, 14300, 16200, 18500, 20100, 19800, 21500, 24000, 26500
    ];
    
    const spyData = [
        10000, 10200, 10500, 10100, 10800, 11000, 11300, 11100, 11500, 11800, 12200, 12500
    ];
    
    // Calculate percentage growth from initial value
    const calculateGrowth = (data) => {
        const initialValue = data[0];
        return data.map(value => ((value - initialValue) / initialValue) * 100);
    };
    
    const algorithmGrowth = calculateGrowth(algorithmData);
    const spyGrowth = calculateGrowth(spyData);
    
    // Create gradient for algorithm line
    const gradientAlgo = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
    gradientAlgo.addColorStop(0, 'rgba(0, 0, 0, 0.8)');
    gradientAlgo.addColorStop(1, 'rgba(0, 0, 0, 0.1)');
    
    // Create gradient for SPY line
    const gradientSpy = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
    gradientSpy.addColorStop(0, 'rgba(150, 150, 150, 0.5)');
    gradientSpy.addColorStop(1, 'rgba(150, 150, 150, 0.1)');
    
    // Chart configuration
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [
                {
                    label: 'Algorithm',
                    data: algorithmGrowth,
                    borderColor: '#000',
                    backgroundColor: gradientAlgo,
                    borderWidth: 3,
                    pointBackgroundColor: '#000',
                    pointRadius: 0,
                    pointHoverRadius: 5,
                    tension: 0.3,
                    fill: false
                },
                {
                    label: 'S&P 500',
                    data: spyGrowth,
                    borderColor: '#888',
                    backgroundColor: gradientSpy,
                    borderWidth: 2,
                    pointBackgroundColor: '#888',
                    pointRadius: 0,
                    pointHoverRadius: 5,
                    tension: 0.3,
                    borderDash: [5, 5],
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        boxWidth: 15,
                        padding: 15,
                        font: {
                            family: "'Inter', sans-serif",
                            size: 12
                        }
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    titleFont: {
                        family: "'Inter', sans-serif",
                        size: 13
                    },
                    bodyFont: {
                        family: "'Inter', sans-serif",
                        size: 12
                    },
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.raw.toFixed(2)}%`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            family: "'Inter', sans-serif",
                            size: 12
                        }
                    }
                },
                y: {
                    grid: {
                        borderDash: [2, 4],
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        font: {
                            family: "'Inter', sans-serif",
                            size: 12
                        },
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            },
            interaction: {
                mode: 'index',
                intersect: false
            },
            animation: {
                duration: 2000,
                easing: 'easeOutQuart'
            }
        }
    });
    
    // Animation for statistics
    animateStatNumbers();
}

// Animate statistic numbers
function animateStatNumbers() {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const targetValue = stat.textContent;
        const suffix = targetValue.indexOf('%') !== -1 ? '%' : '';
        const numericValue = parseFloat(targetValue.replace(/[^0-9.-]+/g, ''));
        
        let startValue = 0;
        const duration = 2000;
        const startTime = performance.now();
        
        function updateNumber(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            // Easing function: easeOutQuart
            const easedProgress = 1 - Math.pow(1 - progress, 4);
            
            const currentValue = startValue + (numericValue - startValue) * easedProgress;
            stat.textContent = currentValue.toFixed(1) + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            } else {
                stat.textContent = targetValue;
            }
        }
        
        requestAnimationFrame(updateNumber);
    });
}