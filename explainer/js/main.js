// Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoiZXNzc3RoZXJjIiwiYSI6ImNtaGswNmg5aDB2d3UybG84cGwweWJyNWkifQ.zyaBQaRKMoSz6bMzEDQ4Hg';

// Map variable - will be initialized only when needed (iframe section)
let map = null;
let mapInitialized = false;

// Initialize scroll functionality immediately
initializeScrollMapper();

// Function to initialize map only when iframe section is reached
function initializeMapIfNeeded() {
    if (!mapInitialized) {
        map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/essstherc/cmh4029np003f01qpexxf6tha',
            center: [18.293,23.982], // Default center
            zoom: 2.26,
            pitch: 0,
            bearing: 0
        });
        
        map.on('load', () => {
            console.log('Map loaded successfully');
            mapInitialized = true;
        });
    }
}

// ScrollMapper functionality
function initializeScrollMapper() {
    const sections = document.querySelectorAll('.step');
    const scrollContainer = document.getElementById('scroll');
    
    // Track which section is currently active
    let currentStep = 0;
    
    // Map configuration for each interactive section
    const sectionMapConfigs = {
        sea: {
            center: [170.309,12.006],
            zoom: 2.38,
            pitch: 0,
            bearing: 0
        },
        land: {
            center: [103.405,34.987],
            zoom: 3.23,
            pitch: 0,
            bearing: 0
        },
        lake: {
            center: [-83.754,45.220],
            zoom: 5.51,
            pitch: 0,
            bearing: 0
        },
        city: {
            center: [-87.709,41.906],
            zoom: 9.38,
            pitch: 0,
            bearing: 0
        },
        location_1: {
            center: [-89.401,43.076],
            zoom: 16.42,
            pitch: 0,
            bearing: 0
        },
        location_2: {
            center: [-89.419,43.101],
            zoom: 11.65,
            pitch: 0,
            bearing: 0
        },
        location_3: {
            center: [-89.962,44.672],
            zoom: 5.61,
            pitch: 0,
            bearing: 0
        },
        location_4: {
            center: [-99.579,41.771],
            zoom: 3.13,
            pitch: 0,
            bearing: 0
        }
    };
    const fallbackMapConfig = {
        center: [170.309,12.006],
        zoom: 2.38,
        pitch: 0,
        bearing: 0
    };
    
    // Handle scroll events
    scrollContainer.addEventListener('scroll', () => {
        const scrollPosition = scrollContainer.scrollTop;
        const windowHeight = window.innerHeight;
        
        // Find which section should be active
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionBottom = sectionTop + sectionHeight;
            
            // Check if section is in view (using viewport center as reference)
            const viewportCenter = scrollPosition + windowHeight / 2;
            
            if (viewportCenter >= sectionTop && viewportCenter < sectionBottom) {
                // Update active state
                sections.forEach(s => s.classList.remove('active'));
                section.classList.add('active');
                
                // Check if hero section is active
                const heroSection = document.querySelector('.hero-section');
                if (section.classList.contains('hero-section')) {
                    document.body.classList.add('hero-active');
                    document.body.classList.remove('map-active');
                } else {
                    document.body.classList.remove('hero-active');
                    
                    // Show map only from texture section onwards
                    const stepName = section.getAttribute('data-step');
                    const sectionsBeforeMap = ['hero', 'inspiration', 'color', 'type'];
                    
                    if (sectionsBeforeMap.includes(stepName)) {
                        // Hide map for sections before iframe
                        document.body.classList.remove('map-active');
                    } else {
                        // Show map only for iframe section
                        if (stepName === 'iframe') {
                            const sectionId = section.id;
                            const targetConfig = sectionMapConfigs[sectionId] || fallbackMapConfig;
                            // Initialize map only when reaching iframe section
                            initializeMapIfNeeded();
                            document.body.classList.add('map-active');
                            
                            // Allow interaction ONLY on location_4
                            if (sectionId === 'location_4') {
                                document.body.classList.add('allow-interaction');
                            } else {
                                document.body.classList.remove('allow-interaction');
                            }
                            
                            // Update map view once initialized and loaded
                            if (map && map.loaded()) {
                                updateMapView(targetConfig);
                            } else if (map) {
                                // Wait for map to load if not ready yet
                                map.once('load', () => {
                                    updateMapView(targetConfig);
                                });
                            }
                        } else {
                            document.body.classList.remove('map-active');
                            document.body.classList.remove('allow-interaction');
                        }
                    }
                }
            }
        });
    });
    
    // Function to smoothly update map view
    function updateMapView(config) {
        if (map) {
            map.flyTo({
                center: config.center,
                zoom: config.zoom,
                pitch: config.pitch || 0,
                bearing: config.bearing || 0,
                duration: 2000, // Longer duration for smoother animation
                essential: true, // Prevent animation from being interrupted
                easing: (t) => {
                    // Smooth ease-in-out cubic function
                    return t < 0.5 
                        ? 4 * t * t * t 
                        : 1 - Math.pow(-2 * t + 2, 3) / 2;
                }
            });
        }
    }
    
    // Set initial active section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroSection.classList.add('active');
        document.body.classList.add('hero-active');
    } else if (sections.length > 0) {
        sections[0].classList.add('active');
    }
    
    // Handle geographic comparison interactions
    const geoComparisonItems = document.querySelectorAll('#compare-geo .comparison-item');
    geoComparisonItems.forEach(item => {
        item.addEventListener('click', () => {
            const location = item.getAttribute('data-location');
            // You can add specific coordinates for each location here
            // Example: updateMapView({ center: [longitude, latitude], zoom: 8 });
        });
    });
    
}

// Add smooth scrolling behavior
document.documentElement.style.scrollBehavior = 'smooth';
