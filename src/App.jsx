import { useState, useEffect, useRef } from 'react'
import logoSvg from './assets/logo.svg'
import './App.css'

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [isBackToTopVisible, setIsBackToTopVisible] = useState(false);
  const statsRef = useRef(null);

  const statsData = [
    { start: 0, end: 15, suffix: '+', label: 'Years Experience' },
    { start: 0, end: 75, suffix: '+', label: 'Countries' },
    { start: 0, end: 10, suffix: 'k+', label: 'Shipments Monthly' },
    { start: 0, end: 98, suffix: '%', label: 'Client Satisfaction' }
  ];
  
  const [countValues, setCountValues] = useState(statsData.map(stat => stat.start));

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      if (window.scrollY > 500) {
        setIsBackToTopVisible(true);
      } else {
        setIsBackToTopVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setStatsVisible(true);
          setCountValues(statsData.map(stat => stat.start));
        } else {
          setStatsVisible(false);
        }
      },
      { threshold: 0.3 }
    );

    const currentStatsRef = statsRef.current;
    if (currentStatsRef) {
      observer.observe(currentStatsRef);
    }

    return () => {
      if (currentStatsRef) {
        observer.unobserve(currentStatsRef);
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      if (window.carouselInterval) {
        clearInterval(window.carouselInterval);
        window.carouselInterval = null;
      }
      if (window.testimonialInterval) {
        clearInterval(window.testimonialInterval);
        window.testimonialInterval = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!statsVisible) return;

    const duration = 2000;
    const frameDuration = 1000 / 60; // 60fps
    const totalFrames = Math.round(duration / frameDuration);

    const counters = statsData.map((stat, index) => {
      const delay = index * 300; // 300ms delay between each stat starting
      
      return setTimeout(() => {
        let statFrame = 0;
        
        const intervalId = setInterval(() => {
          statFrame++;
          
          const progress = statFrame / totalFrames;
          const easeOutQuad = progress * (2 - progress);
          
          const value = stat.start + Math.floor(easeOutQuad * (stat.end - stat.start));
          
          setCountValues(prev => {
            const newValues = [...prev];
            newValues[index] = value;
            return newValues;
          });
          
          if (statFrame === totalFrames) {
            clearInterval(intervalId);
          }
        }, frameDuration);
        
        return intervalId;
      }, delay);
    });

    return () => {
      counters.forEach(timerId => clearTimeout(timerId));
    };
  }, [statsVisible]);

  const updateActiveDot = (container) => {
    if (!container) return;
    
    const dots = document.querySelectorAll('.carousel-dot');
    const scrollLeft = container.scrollLeft;
    const totalWidth = container.scrollWidth;
    const logoSetWidth = totalWidth / 2; // Width of one set of logos
    
    const normalizedScrollLeft = scrollLeft % logoSetWidth;
    
    const sectionWidth = logoSetWidth / 3;
    const activeIndex = Math.min(
      Math.floor(normalizedScrollLeft / sectionWidth),
      2
    );
    
    dots.forEach((dot, index) => {
      if (index === activeIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  };

  const handleInfiniteScroll = (container) => {
    if (!container) return;
    
    const scrollLeft = container.scrollLeft;
    const totalWidth = container.scrollWidth;
    
    const logoSetWidth = totalWidth / 2; //identical
    
    if (scrollLeft > logoSetWidth) {
      container.scrollLeft = scrollLeft - logoSetWidth;
    }
    
    if (scrollLeft < 10 && scrollLeft < container.previousScrollLeft) {
      container.scrollLeft = logoSetWidth + scrollLeft;
    }
    
    container.previousScrollLeft = container.scrollLeft;
    
    updateActiveDot(container);
  };

  const handleTestimonialInfiniteScroll = (container) => {
    if (!container) return;
    
    const scrollLeft = container.scrollLeft;
    const totalWidth = container.scrollWidth;
    const containerWidth = container.clientWidth;
    const testimonialSetWidth = totalWidth / 2;
    
    // When we reach the end of the first set, jump back to start
    if (scrollLeft >= testimonialSetWidth - 50) {
      container.scrollLeft = 0;
    }
    
    // When we go backward past the start, jump to the second set
    if (scrollLeft <= 0 && container.previousScrollLeft > scrollLeft) {
      container.scrollLeft = testimonialSetWidth - containerWidth;
    }
    
    container.previousScrollLeft = scrollLeft;
    
    // Update active dot
    const normalizedScrollLeft = scrollLeft % testimonialSetWidth;
    const cardWidth = container.querySelector('.testimonial-card').offsetWidth + 30;
    const activeIndex = Math.min(Math.floor(normalizedScrollLeft / cardWidth), 2);
    
    const dots = document.querySelectorAll('.testimonial-navigation .carousel-dot');
    dots.forEach((dot, index) => {
      if (index === activeIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="app-container">
      {/* Header/Navigation */}
      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container header-container">
          <div className="logo-container" onClick={() => window.location.href = '/'} style={{ cursor: 'pointer' }}>
            <img src={logoSvg} alt="LogiTrans Logo" className="logo" />
            <h1>LogiTrans</h1>
          </div>
          
          <div className="mobile-menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          
          <nav className={`main-nav ${isMenuOpen ? 'open' : ''}`}>
            <ul>
              <li><a href="#services">Services</a></li>
              <li><a href="#products">Products</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#clients">Partners</a></li>
              <li><a href="#network">Network</a></li>
              <li><a href="#testimonials">Testimonials</a></li>
              <li><a href="#contact" className="cta-button">Contact Us</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Global Logistics Solutions for Your Business</h1>
            <p>Efficient, reliable, and sustainable transportation services worldwide</p>
            <div className="hero-buttons">
              <a href="#services" className="primary-button">Our Services</a>
              <a href="#contact" className="secondary-button">Get a Quote</a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services">
        <div className="container">
          <h2 className="section-title">Our Services</h2>
          <p className="section-subtitle">Comprehensive logistics solutions tailored to your needs</p>
          
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon freight"></div>
              <h3>Freight Forwarding</h3>
              <p>International shipping solutions by air, ocean, and land with real-time tracking capabilities.</p>
            </div>
            
            <div className="service-card">
              <div className="service-icon warehouse"></div>
              <h3>Warehousing</h3>
              <p>Strategic storage facilities with advanced inventory management systems.</p>
            </div>
            
            <div className="service-card">
              <div className="service-icon customs"></div>
              <h3>Customs Clearance</h3>
              <p>Expert handling of documentation and regulatory compliance for smooth border crossings.</p>
            </div>
            
            <div className="service-card">
              <div className="service-icon supply"></div>
              <h3>Supply Chain</h3>
              <p>End-to-end visibility and optimization of your entire supply chain network.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="products">
        <div className="container">
          <h2 className="section-title">Our Products</h2>
          <p className="section-subtitle">Tailored logistics solutions for various industries</p>

          <div className="products-grid">
            <div className="product-card">
              <div className="product-icon retail"></div>
              <div className="product-content">
                <h3>Retail Logistics</h3>
                <p>Specialized solutions for retail businesses, including inventory management, warehousing, and last-mile delivery.</p>
                <a href="#contact" className="product-link">Learn More</a>
              </div>
            </div>

            <div className="product-card">
              <div className="product-icon ecommerce"></div>
              <div className="product-content">
                <h3>E-Commerce Fulfillment</h3>
                <p>End-to-end fulfillment services designed specifically for online retailers, with fast shipping options.</p>
                <a href="#contact" className="product-link">Learn More</a>
              </div>
            </div>

            <div className="product-card">
              <div className="product-icon international"></div>
              <div className="product-content">
                <h3>International Shipping</h3>
                <p>Global shipping solutions with customs clearance expertise and international compliance management.</p>
                <a href="#contact" className="product-link">Learn More</a>
              </div>
            </div>

            <div className="product-card">
              <div className="product-icon cold-chain"></div>
              <div className="product-content">
                <h3>Cold Chain Logistics</h3>
                <p>Temperature-controlled transportation and storage for perishable goods and pharmaceuticals.</p>
                <a href="#contact" className="product-link">Learn More</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2 className="section-title">About LogiTrans</h2>
              <p>With over 15 years of experience in the logistics industry, LogiTrans has established itself as a leader in providing innovative and reliable transportation solutions.</p>
              <p>Our global network spans across 75+ countries, enabling us to deliver seamless logistics services to businesses of all sizes.</p>
              <ul className="about-features">
                <li>24/7 Customer Support</li>
                <li>Real-time Shipment Tracking</li>
                <li>Sustainable Transportation Options</li>
                <li>Customized Logistics Solutions</li>
              </ul>
            </div>
            <div className={`about-stats ${statsVisible ? 'visible' : ''}`} ref={statsRef}>
              {statsData.map((stat, index) => (
                <div className="stat-item" key={index}>
                  <span className="stat-number">
                    {countValues[index]}{stat.suffix}
                  </span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Client Logos Section */}
      <section id="clients" className="clients">
        <div className="container">
          <h2 className="section-title">Our Trusted Partners</h2>
          <p className="section-subtitle">We collaborate with leading courier services to ensure timely deliveries</p>
          
          <div className="client-logos-container">
            <div className="client-logos" 
              onMouseEnter={() => {
                // Stop auto-scrolling when mouse enters
                if (window.carouselInterval) {
                  clearInterval(window.carouselInterval);
                  window.carouselInterval = null;
                }
              }}
              onMouseLeave={() => {
                // Resume auto-scrolling when mouse leaves
                if (!window.carouselInterval) {
                  window.carouselInterval = setInterval(() => {
                    const container = document.querySelector('.client-logos');
                    if (container) {
                      // Get the width of one logo item (including gap)
                      const logoWidth = window.innerWidth <= 576 ? 125 : window.innerWidth <= 768 ? 150 : 190; // logo width + gap
                      
                      // Simply scroll one logo at a time
                      container.scrollBy({ left: logoWidth, behavior: 'smooth' });
                      
                      // Check if we need to reset position (handleInfiniteScroll will take care of the jump)
                      setTimeout(() => {
                        handleInfiniteScroll(container);
                      }, 500);
                      
                      // Update active dot
                      updateActiveDot(container);
                    }
                  }, 3000);
                }
              }}
              onScroll={(e) => {
                // Update active dot when scrolling manually
                updateActiveDot(e.currentTarget);
                
                // Handle infinite scroll effect
                handleInfiniteScroll(e.currentTarget);
              }}
              ref={(el) => {
                // Set up auto-scrolling when component mounts
                if (el && !window.carouselInterval) {
                  // Initialize previous scroll position
                  el.previousScrollLeft = 0;
                  
                  window.carouselInterval = setInterval(() => {
                    if (el) {
                      // Get the width of one logo item (including gap)
                      const logoWidth = window.innerWidth <= 576 ? 125 : window.innerWidth <= 768 ? 150 : 190; // logo width + gap
                      
                      // Simply scroll one logo at a time
                      el.scrollBy({ left: logoWidth, behavior: 'smooth' });
                      
                      // Check if we need to reset position (handleInfiniteScroll will take care of the jump)
                      setTimeout(() => {
                        handleInfiniteScroll(el);
                      }, 500);
                      
                      // Update active dot
                      updateActiveDot(el);
                    }
                  }, 3000);
                }
              }}
            >
              {/* First set of logos */}
              <div className="client-logo">
                <div className="logo-image jnt"></div>
                <p>J&T Express</p>
              </div>
              <div className="client-logo">
                <div className="logo-image jne"></div>
                <p>JNE</p>
              </div>
              <div className="client-logo">
                <div className="logo-image sicepat"></div>
                <p>SiCepat</p>
              </div>
              <div className="client-logo">
                <div className="logo-image express"></div>
                <p>EXPRESS</p>
              </div>
              <div className="client-logo">
                <div className="logo-image pos"></div>
                <p>POS Indonesia</p>
              </div>
              
              {/* Duplicate logos to create infinite loop effect */}
              <div className="client-logo">
                <div className="logo-image jnt"></div>
                <p>J&T Express</p>
              </div>
              <div className="client-logo">
                <div className="logo-image jne"></div>
                <p>JNE</p>
              </div>
              <div className="client-logo">
                <div className="logo-image sicepat"></div>
                <p>SiCepat</p>
              </div>
              <div className="client-logo">
                <div className="logo-image express"></div>
                <p>EXPRESS</p>
              </div>
              <div className="client-logo">
                <div className="logo-image pos"></div>
                <p>POS Indonesia</p>
              </div>
            </div>
            
            <div className="carousel-navigation">
              <button className="carousel-button prev" onClick={() => {
                const container = document.querySelector('.client-logos');
                // Scroll exactly one logo width to the left
                const logoWidth = window.innerWidth <= 576 ? 125 : window.innerWidth <= 768 ? 150 : 190;
                container.scrollBy({ left: -logoWidth, behavior: 'smooth' });
                
                // After scrolling, check if we need to handle the infinite loop
                setTimeout(() => {
                  handleInfiniteScroll(container);
                  // Update active dot
                  updateActiveDot(container);
                }, 500);
              }}>&lt;</button>
              <div className="carousel-dots">
                <span className="carousel-dot active" onClick={() => {
                  const container = document.querySelector('.client-logos');
                  container.scrollTo({ left: 0, behavior: 'smooth' });
                }}></span>
                <span className="carousel-dot" onClick={() => {
                  const container = document.querySelector('.client-logos');
                  const logoWidth = window.innerWidth <= 576 ? 125 : window.innerWidth <= 768 ? 150 : 190;
                  container.scrollTo({ left: logoWidth * 2, behavior: 'smooth' });
                }}></span>
                <span className="carousel-dot" onClick={() => {
                  const container = document.querySelector('.client-logos');
                  const logoWidth = window.innerWidth <= 576 ? 125 : window.innerWidth <= 768 ? 150 : 190;
                  container.scrollTo({ left: logoWidth * 4, behavior: 'smooth' });
                }}></span>
              </div>
              <button className="carousel-button next" onClick={() => {
                const container = document.querySelector('.client-logos');
                // Scroll exactly one logo width to the right
                const logoWidth = window.innerWidth <= 576 ? 125 : window.innerWidth <= 768 ? 150 : 190;
                container.scrollBy({ left: logoWidth, behavior: 'smooth' });
                
                // After scrolling, check if we need to handle the infinite loop
                setTimeout(() => {
                  handleInfiniteScroll(container);
                  // Update active dot
                  updateActiveDot(container);
                }, 500);
              }}>&gt;</button>
            </div>
          </div>
        </div>
      </section>

      {/* Network Section */}
      <section id="network" className="network">
        <div className="container">
          <h2 className="section-title">Our Global Network</h2>
          <p className="section-subtitle">Connecting businesses across continents</p>
          
          <div className="map-container">
            <div className="world-map"></div>
            
            {/* Connection lines between points */}
            <div className="network-connections">
              {/* Americas to Europe */}
              <div className="connection-line" style={{
                width: '28%',
                top: '29.5%',
                left: '21%',
                transform: 'rotate(-4deg)',
              }}></div>
              
              {/* Europe to Asia */}
              <div className="connection-line" style={{
                width: '22%',
                top: '24.8%',
                left: '49%',
                transform: 'rotate(11.2deg)',
              }}></div>
              
              {/* Asia to Australia */}
              <div className="connection-line" style={{
                width: '11%',
                top: '35.3%',
                left: '70.6%',
                transform: 'rotate(115deg)',
              }}></div>
              
              {/* Europe to Africa */}
              <div className="connection-line" style={{
                width: '8%',
                top: '26%',
                left: '48.9%',
                transform: 'rotate(76deg)',
              }}></div>
              
              {/* Americas to Africa */}
              <div className="connection-line" style={{
                width: '30%',
                top: '30%',
                left: '21%',
                transform: 'rotate(12deg)',
              }}></div>

              {/* Africa to Australia */}
              <div className="connection-line" style={{
                width: '16%',
                top: '45%',
                left: '51%',
                transform: 'rotate(22deg)',
              }}></div>
            </div>
            
            <div className="network-points">
              {/* These would be positioned absolutely in CSS */}
              <div className="network-point" style={{top: '30%', left: '20%'}}><span>Americas</span></div>
              <div className="network-point" style={{top: '25%', left: '48%'}}><span>Europe</span></div>
              <div className="network-point" style={{top: '35%', left: '70%'}}><span>Asia</span></div>
              <div className="network-point" style={{top: '60%', left: '65%'}}><span>Australia</span></div>
              <div className="network-point" style={{top: '45%', left: '50%'}}><span>Africa</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials">
        <div className="container">
          <h2 className="section-title">What Our Clients Say</h2>

          <div className="testimonial-carousel-container">
            <div className="testimonial-carousel"
                 onMouseEnter={() => {
                   // Stop auto-scrolling when mouse enters
                   if (window.testimonialInterval) {
                     clearInterval(window.testimonialInterval);
                     window.testimonialInterval = null;
                   }
                 }}
                 onMouseLeave={() => {
                   // Resume auto-scrolling when mouse leaves
                   if (!window.testimonialInterval) {
                     window.testimonialInterval = setInterval(() => {
                       const container = document.querySelector('.testimonial-carousel');
                       if (container) {
                         const testimonialWidth = container.querySelector('.testimonial-card').offsetWidth + 20;
                         container.scrollBy({ left: testimonialWidth, behavior: 'smooth' });
                         
                         // Check if we need to reset position after animation completes
                         setTimeout(() => {
                           const scrollLeft = container.scrollLeft;
                           const totalWidth = container.scrollWidth;
                           const testimonialSetWidth = totalWidth / 2;
                           
                           if (scrollLeft >= testimonialSetWidth - 50) {
                             container.scrollLeft = 0;
                           }
                           
                           // Update active dot
                           handleTestimonialInfiniteScroll(container);
                         }, 500);
                       }
                     }, 3000);
                   }
                 }}
                 onScroll={(e) => {
                   // Handle infinite scroll effect
                   handleTestimonialInfiniteScroll(e.currentTarget);
                 }}
                 ref={(el) => {
                   // Set up auto-scrolling when component mounts
                   if (el && !window.testimonialInterval) {
                     // Initialize previous scroll position
                     el.previousScrollLeft = 0;
                     
                     // Start auto-scrolling after a short delay
                     setTimeout(() => {
                       window.testimonialInterval = setInterval(() => {
                         if (el) {
                           const testimonialWidth = el.querySelector('.testimonial-card').offsetWidth + 20;
                           el.scrollBy({ left: testimonialWidth, behavior: 'smooth' });
                           
                           // Check if we need to reset position after animation completes
                           setTimeout(() => {
                             const scrollLeft = el.scrollLeft;
                             const totalWidth = el.scrollWidth;
                             const testimonialSetWidth = totalWidth / 2;
                             
                             if (scrollLeft >= testimonialSetWidth - 50) {
                               el.scrollLeft = 0;
                             }
                             
                             // Update active dot
                             handleTestimonialInfiniteScroll(el);
                           }, 500);
                         }
                       }, 3000);
                     }, 1000);
                   }
                 }}
            >
              {/* First set of testimonials */}
              <div className="testimonial-card">
                <div className="testimonial-content">
                  <p>"LogiTrans has transformed our supply chain operations. Their reliable service and innovative solutions have helped us reduce costs and improve delivery times."</p>
                </div>
                <div className="testimonial-author">
                  <div className="author-image"></div>
                  <div className="author-info">
                    <h4>Sarah Johnson</h4>
                    <p>Supply Chain Director, TechCorp Inc.</p>
                  </div>
                </div>
              </div>

              <div className="testimonial-card">
                <div className="testimonial-content">
                  <p>"We've been working with LogiTrans for over 5 years now. Their customs clearance expertise has been invaluable for our international expansion."</p>
                </div>
                <div className="testimonial-author">
                  <div className="author-image"></div>
                  <div className="author-info">
                    <h4>Michael Chen</h4>
                    <p>CEO, Global Traders Ltd.</p>
                  </div>
                </div>
              </div>

              <div className="testimonial-card">
                <div className="testimonial-content">
                  <p>"The real-time tracking and 24/7 support from LogiTrans gives us peace of mind. We always know where our shipments are and when they'll arrive."</p>
                </div>
                <div className="testimonial-author">
                  <div className="author-image"></div>
                  <div className="author-info">
                    <h4>Elena Rodriguez</h4>
                    <p>Operations Manager, Fresh Foods Co.</p>
                  </div>
                </div>
              </div>

              {/* Duplicate testimonials to create infinite loop effect */}
              <div className="testimonial-card">
                <div className="testimonial-content">
                  <p>"LogiTrans has transformed our supply chain operations. Their reliable service and innovative solutions have helped us reduce costs and improve delivery times."</p>
                </div>
                <div className="testimonial-author">
                  <div className="author-image"></div>
                  <div className="author-info">
                    <h4>Sarah Johnson</h4>
                    <p>Supply Chain Director, TechCorp Inc.</p>
                  </div>
                </div>
              </div>

              <div className="testimonial-card">
                <div className="testimonial-content">
                  <p>"We've been working with LogiTrans for over 5 years now. Their customs clearance expertise has been invaluable for our international expansion."</p>
                </div>
                <div className="testimonial-author">
                  <div className="author-image"></div>
                  <div className="author-info">
                    <h4>Michael Chen</h4>
                    <p>CEO, Global Traders Ltd.</p>
                  </div>
                </div>
              </div>

              <div className="testimonial-card">
                <div className="testimonial-content">
                  <p>"The real-time tracking and 24/7 support from LogiTrans gives us peace of mind. We always know where our shipments are and when they'll arrive."</p>
                </div>
                <div className="testimonial-author">
                  <div className="author-image"></div>
                  <div className="author-info">
                    <h4>Elena Rodriguez</h4>
                    <p>Operations Manager, Fresh Foods Co.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="carousel-navigation testimonial-navigation">
              <button className="carousel-button prev" onClick={() => {
                const container = document.querySelector('.testimonial-carousel');
                if (container) {
                  const testimonialWidth = container.querySelector('.testimonial-card').offsetWidth + 20;
                  container.scrollBy({ left: -testimonialWidth, behavior: 'smooth' });
                  
                  setTimeout(() => {
                    handleTestimonialInfiniteScroll(container);
                  }, 500);
                }
              }}>&lt;</button>
              <div className="carousel-dots">
                <span className="carousel-dot active" onClick={() => {
                  const container = document.querySelector('.testimonial-carousel');
                  if (container) {
                    container.scrollTo({ left: 0, behavior: 'smooth' });
                  }
                }}></span>
                <span className="carousel-dot" onClick={() => {
                  const container = document.querySelector('.testimonial-carousel');
                  if (container) {
                    const testimonialWidth = container.querySelector('.testimonial-card').offsetWidth + 20;
                    container.scrollTo({ left: testimonialWidth, behavior: 'smooth' });
                  }
                }}></span>
                <span className="carousel-dot" onClick={() => {
                  const container = document.querySelector('.testimonial-carousel');
                  if (container) {
                    const testimonialWidth = container.querySelector('.testimonial-card').offsetWidth + 20;
                    container.scrollTo({ left: testimonialWidth * 2, behavior: 'smooth' });
                  }
                }}></span>
              </div>
              <button className="carousel-button next" onClick={() => {
                const container = document.querySelector('.testimonial-carousel');
                if (container) {
                  const testimonialWidth = container.querySelector('.testimonial-card').offsetWidth + 20;
                  container.scrollBy({ left: testimonialWidth, behavior: 'smooth' });
                  
                  setTimeout(() => {
                    handleTestimonialInfiniteScroll(container);
                  }, 500);
                }
              }}>&gt;</button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="container">
          <div className="contact-content">
            <div className="contact-info">
              <h2 className="section-title">Contact Us</h2>
              <p>Ready to optimize your logistics operations? Get in touch with our team of experts.</p>
              
              <div className="contact-details">
                <div className="contact-item">
                  <div className="contact-icon location"></div>
                  <div>
                    <h4>Headquarters</h4>
                    <p>123 Logistics Way, Transport City, TC 10001</p>
                  </div>
                </div>
                
                <div className="contact-item">
                  <div className="contact-icon phone"></div>
                  <div>
                    <h4>Phone</h4>
                    <p>+62 123 456 789</p>
                  </div>
                </div>
                
                <div className="contact-item">
                  <div className="contact-icon email"></div>
                  <div>
                    <h4>Email</h4>
                    <p>info@logitrans.com</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="contact-form">
              <h3>Request a Quote</h3>
              <form>
                <div className="form-group">
                  <input type="text" placeholder="Your Name" required />
                </div>
                <div className="form-group">
                  <input type="email" placeholder="Your Email" required />
                </div>
                <div className="form-group">
                  <input type="tel" placeholder="Phone Number" />
                </div>
                <div className="form-group">
                  <select>
                    <option value="" disabled selected>Service Type</option>
                    <option value="freight">Freight Forwarding</option>
                    <option value="warehouse">Warehousing</option>
                    <option value="customs">Customs Clearance</option>
                    <option value="supply">Supply Chain Solutions</option>
                  </select>
                </div>
                <div className="form-group">
                  <textarea placeholder="Tell us about your logistics needs" rows="4"></textarea>
                </div>
                <button type="submit" className="primary-button">Submit Request</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Top Button */}
      <button className={`back-to-top ${isBackToTopVisible ? 'visible' : ''}`} onClick={scrollToTop}>
        <span>&#8593;</span>
      </button>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <img src={logoSvg} alt="LogiTrans Logo" className="logo" />
              <h2>LogiTrans</h2>
              <p>Global logistics solutions for modern businesses</p>
            </div>
            
            <div className="footer-links">
              <div className="footer-column">
                <h3>Services</h3>
                <ul>
                  <li><a href="#services">Freight Forwarding</a></li>
                  <li><a href="#services">Warehousing</a></li>
                  <li><a href="#services">Customs Clearance</a></li>
                  <li><a href="#services">Supply Chain</a></li>
                </ul>
              </div>
              
              <div className="footer-column">
                <h3>Company</h3>
                <ul>
                  <li><a href="#about">About Us</a></li>
                  <li><a href="#network">Our Network</a></li>
                  <li><a href="#clients">Our Partners</a></li>
                  <li><a href="#">Careers</a></li>
                </ul>
              </div>
              
              <div className="footer-column">
                <h3>Support</h3>
                <ul>
                  <li><a href="#contact">Contact Us</a></li>
                  <li><a href="#">FAQ</a></li>
                  <li><a href="#">Track Shipment</a></li>
                  <li><a href="#">Resources</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} LogiTrans. All rights reserved.</p>
            <div className="social-links">
              <a href="#" className="social-icon facebook"></a>
              <a href="#" className="social-icon twitter"></a>
              <a href="#" className="social-icon linkedin"></a>
              <a href="#" className="social-icon instagram"></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
