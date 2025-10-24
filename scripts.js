// JavaScript Document

/*

TemplateMo 596 Electric Xtra

https://templatemo.com/tm-596-electric-xtra

*/

// Create floating particles
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 15) + 's';

        // Randomly assign orange or blue color
        if (Math.random() > 0.5) {
            particle.style.setProperty('--particle-color', '#00B2FF');
            const before = particle.style.getPropertyValue('--particle-color');
            particle.style.background = '#00B2FF';
        }

        particlesContainer.appendChild(particle);
    }
}

// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Active navigation highlighting
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-link');

function updateActiveNav() {
    const scrollPosition = window.pageYOffset + 100;

    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navItems.forEach(item => item.classList.remove('active'));
            const currentNav = document.querySelector(`.nav-link[href="#${section.id}"]`);
            if (currentNav) currentNav.classList.add('active');
        }
    });
}

// Navbar scroll effect
window.addEventListener('scroll', function () {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    updateActiveNav();
});

// Initial active nav update
updateActiveNav();

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        // Previne o comportamento padrão do link
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            // Define a altura do seu header fixo
            const headerOffset = 60;

            // Calcula a posição do elemento na página
            const elementPosition = targetElement.getBoundingClientRect().top;

            // Calcula a posição final do scroll, descontando o header
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            // Rola a página suavemente para a posição calculada
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Feature tabs functionality
const tabs = document.querySelectorAll('.tab-item');
const panels = document.querySelectorAll('.content-panel');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabId = tab.getAttribute('data-tab');

        // Remove active class from all tabs and panels
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));

        // Add active class to clicked tab and corresponding panel
        tab.classList.add('active');
        document.getElementById(tabId).classList.add('active');
    });
});

// Form submission
document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();
    
    // 1. COLE A URL DO SEU GOOGLE SCRIPT AQUI
    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwKWyI2fnVbIonqc-WM0Ukk1W-Fx3lJ0jVqJWRMcJK1_I6YYxBolAnBAQxf3FkH-9kd/exec";

    // 2. Feedback de envio
    const form = this;
    const submitButton = form.querySelector('.submit-btn');
    submitButton.disabled = true;
    submitButton.innerHTML = "Enviando...";

    // 3. Obter os dados do formulário
    const formData = new FormData(form);
    const dataObject = {};
    formData.forEach((value, key) => {
        dataObject[key] = value;
    });

    // 4. Enviar os dados para o Google Script
    fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: 'no-cors', // Necessário para Google Scripts
        body: new URLSearchParams(dataObject)
    })
    .then(() => {
        // 5. Sucesso
        alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
        form.reset();
        submitButton.disabled = false;
        submitButton.innerHTML = "Enviar mensagem";
    })
    .catch(error => {
        // 6. Erro
        console.error("Erro ao enviar formulário:", error);
        alert('Ocorreu um erro ao enviar sua mensagem. Tente novamente.');
        submitButton.disabled = false;
        submitButton.innerHTML = "Enviar mensagem";
    });
});

// Initialize particles
createParticles();

// Text rotation with character animation
const textSets = document.querySelectorAll('.text-set');
let currentIndex = 0;
let isAnimating = false;

function wrapTextInSpans(element) {
    const text = element.textContent;
    element.innerHTML = text.split('').map((char, i) =>
        `<span class="char" style="animation-delay: ${i * 0.05}s">${char === ' ' ? '&nbsp;' : char}</span>`
    ).join('');
}

function animateTextIn(textSet) {
    const glitchText = textSet.querySelector('.glitch-text');
    const subtitle = textSet.querySelector('.subtitle');

    // Wrap text in spans for animation
    wrapTextInSpans(glitchText);

    // Update data attribute for glitch effect
    glitchText.setAttribute('data-text', glitchText.textContent);

    // Show subtitle after main text
    setTimeout(() => {
        subtitle.classList.add('visible');
    }, 800);
}

function animateTextOut(textSet) {
    const chars = textSet.querySelectorAll('.char');
    const subtitle = textSet.querySelector('.subtitle');

    // Animate characters out
    chars.forEach((char, i) => {
        char.style.animationDelay = `${i * 0.02}s`;
        char.classList.add('out');
    });

    // Hide subtitle
    subtitle.classList.remove('visible');
}

function rotateText() {
    if (isAnimating) return;
    isAnimating = true;

    const currentSet = textSets[currentIndex];
    const nextIndex = (currentIndex + 1) % textSets.length;
    const nextSet = textSets[nextIndex];

    // Animate out current text
    animateTextOut(currentSet);

    // After out animation, switch sets
    setTimeout(() => {
        currentSet.classList.remove('active');
        nextSet.classList.add('active');
        animateTextIn(nextSet);

        currentIndex = nextIndex;
        isAnimating = false;
    }, 600);
}

// Initialize first text set
textSets[0].classList.add('active');
animateTextIn(textSets[0]);

// Start rotation after initial display
setTimeout(() => {
    setInterval(rotateText, 5000); // Change every 5 seconds
}, 4000);

// Add random glitch effect
setInterval(() => {
    const glitchTexts = document.querySelectorAll('.glitch-text');
    glitchTexts.forEach(text => {
        if (Math.random() > 0.95) {
            text.style.animation = 'none';
            setTimeout(() => {
                text.style.animation = '';
            }, 200);
        }
    });
}, 3000);


// --- INÍCIO DO CARROSSEL DE PLANOS (MOBILE) ---
document.addEventListener('DOMContentLoaded', () => {
    
    const wrapper = document.querySelector('.carousel-wrapper');
    const track = document.querySelector('.pricing-container');
    
    // Só continua se os elementos do carrossel existirem
    if (!wrapper || !track) {
        return;
    }

    const slides = Array.from(track.children);
    const dotsContainer = document.querySelector('.carousel-dots');
    
    if (slides.length === 0 || !dotsContainer) {
        return;
    }

    let slideWidth = 0;
    let currentIndex = 0;

    // --- Funções do Carrossel ---

    // 1. Cria os 'dots' de navegação
    function setupDots() {
        dotsContainer.innerHTML = ''; // Limpa dots antigos
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            if (index === 0) dot.classList.add('active'); // Ativa o primeiro
            
            dot.addEventListener('click', () => {
                moveToSlide(index);
            });
            dotsContainer.appendChild(dot);
        });
    }

    // 2. Atualiza qual dot está ativo
    function updateDots(index) {
        const dots = Array.from(dotsContainer.children);
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    // 3. Move o 'trilho' (track)
    function moveToSlide(index) {
        // Recalcula a largura do slide (importante para responsividade)
        slideWidth = wrapper.clientWidth;
        
        // Move o track para o slide correto
        track.style.transform = `translateX(-${slideWidth * index}px)`;
        currentIndex = index;
        updateDots(index);
    }

    // 4. Configuração inicial
    function initializeCarousel() {
        // Só ativa o carrossel em telas móveis
        if (window.innerWidth <= 768) {
            if (dotsContainer.children.length === 0) {
                setupDots();
            }
            // Garante que a largura de cada slide seja 100% do wrapper
            slides.forEach(slide => {
                slide.style.width = `${wrapper.clientWidth}px`;
            });
            moveToSlide(0); // Garante a posição inicial correta
        } else {
            // Desktop: reseta o carrossel
            track.style.transform = 'translateX(0)';
            slides.forEach(slide => {
                slide.style.width = ''; // Reseta o width
            });
            dotsContainer.innerHTML = ''; // Remove os dots
        }
    }

    // --- Lógica de Swipe (Touch) ---
    let startX = 0;
    let endX = 0;

    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchmove', (e) => {
        endX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', () => {
        // Só dispara se for mobile
        if (window.innerWidth > 768) return;

        // Verifica a direção do swipe
        if (startX - endX > 50) { // Swipe para a esquerda (próximo)
            if (currentIndex < slides.length - 1) {
                moveToSlide(currentIndex + 1);
            }
        } else if (endX - startX > 50) { // Swipe para a direita (anterior)
            if (currentIndex > 0) {
                moveToSlide(currentIndex - 1);
            }
        }
        // Reseta os valores
        startX = 0;
        endX = 0;
    });

    // --- Event Listeners ---
    
    // Roda o setup inicial quando a página carrega
    initializeCarousel();

    // Re-calcula tudo se o usuário redimensionar a tela (ex: virar o celular)
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            initializeCarousel();
        }, 200);
    });
});
// --- FIM DO CARROSSEL DE PLANOS ---