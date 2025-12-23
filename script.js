// ASCII Art Content
const asciiArtLines = [
    "████████████████████████████████████████████████████████████████████████████████",
    "████████████████████████████████████████████████████████████████████████████████",
    "████████████████████████████████████████████████████████████████████████████████",
    "████████████████████████████████████████████████████████████████████████████████",
    "████████████████████████████████████████████████████████████████████████████████"
];

// Content to be typed out in the description area
const descriptionLines = [
    "[ Forced Full Stack Developer | Tool Maker ]",
    "\"Passionate about leveraging efficient AI tools for innovation and development.\"",
    "",
    "Looking for new challenges and building useful things."
];

// About Bio Content
const aboutBioLines = [
    "Hello, I'm OKL137.",
    "I am a developer focused on creating specialized tools for the e-commerce industry. My goal is to automate workflows and simplify complex processes through clean, efficient code.",
    "I enjoy exploring new technologies and building projects that solve real-world problems. I believe in the power of software to enhance productivity."
];

// Elements
const asciiContainer = document.getElementById('ascii-art-container');
const typewriterElement = document.getElementById('typewriter');
const heroDesc = document.getElementById('hero-desc');
const aboutBio = document.getElementById('about-bio'); // New About Bio Element
const cursor = document.querySelector('.cursor');

// 1. ASCII Art Animation
function renderAscii() {
    if (!asciiContainer) return;
    asciiContainer.innerHTML = ''; // Clear existing
    asciiArtLines.forEach((line, index) => {
        const pre = document.createElement('pre');
        pre.className = 'ascii-art';
        
        // Split line into characters for individual hover effect
        const chars = line.split('');
        chars.forEach(char => {
            const span = document.createElement('span');
            span.textContent = char;
            pre.appendChild(span);
        });

        // pre.textContent = line; // Old method
        asciiContainer.appendChild(pre);
        
        // Staggered fade in
        setTimeout(() => {
            pre.style.opacity = '1';
            pre.style.transition = 'opacity 0.5s ease';
        }, index * 80);
    });

    // Add proximity hover effect
    asciiContainer.addEventListener('mousemove', (e) => {
        const spans = document.querySelectorAll('.ascii-art span');
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        spans.forEach(span => {
            const rect = span.getBoundingClientRect();
            const spanX = rect.left + rect.width / 2;
            const spanY = rect.top + rect.height / 2;
            
            const dist = Math.sqrt(Math.pow(mouseX - spanX, 2) + Math.pow(mouseY - spanY, 2));
            const maxDist = 50; // Radius of effect
            
            if (dist < maxDist) {
                // Calculate intensity based on distance
                const intensity = 1 - (dist / maxDist);
                
                // Lift effect
                const lift = intensity * -5;
                span.style.transform = `translateY(${lift}px)`;
                
                // Color effect
                // Using a brighter color for "pressed" state or active state
                // Mix between #333 and #fff based on intensity
                const val = Math.floor(51 + (204 * intensity)); // 51 is 0x33, 255 is 0xff
                span.style.color = `rgb(${val}, ${val}, ${val})`;
                
                if(intensity > 0.8) {
                    span.style.color = 'var(--accent-color)';
                    span.style.textShadow = '0 0 5px var(--accent-color)';
                } else {
                    span.style.textShadow = 'none';
                }
                
            } else {
                span.style.transform = 'translateY(0)';
                span.style.color = '#333';
                span.style.textShadow = 'none';
            }
        });
    });
    
    // Reset on mouse leave
    asciiContainer.addEventListener('mouseleave', () => {
        const spans = document.querySelectorAll('.ascii-art span');
        spans.forEach(span => {
            span.style.transform = 'translateY(0)';
            span.style.color = '#333';
            span.style.textShadow = 'none';
        });
    });
}

// 2. Typewriter Effect (Improved)
// Queue of text segments to type: [element, text, isHtml]
const typingQueue = [
    { el: typewriterElement, text: "okl137", isHtml: false },
    // We will handle description separately to allow multiline typing
];

let isTyping = false;

function typeString(element, text, speed = 50, callback) {
    // Clear any existing typing timer for this element
    if (element._typingTimer) clearTimeout(element._typingTimer);
    
    // Check if text contains HTML tags (specifically <br>)
    const hasHtml = text.includes('<') && text.includes('>');
    
    let i = 0;
    
    // If has HTML, we need a different approach or simply support <br>
    // For simple typewriter, we can replace <br> with newline if it's pre-wrap,
    // OR we can parse the string.
    // Given the issue is <br> showing as text, it means we are using textContent.
    
    if (hasHtml) {
        // Simple HTML parser for typewriter
        // We will accumulate content in a buffer and set innerHTML
        element.innerHTML = "";
        
        function typeCharHtml() {
            if (i < text.length) {
                // Check if we are at the start of a tag
                if (text.charAt(i) === '<') {
                    // Find the end of the tag
                    let tagEnd = text.indexOf('>', i);
                    if (tagEnd !== -1) {
                        // Append the whole tag at once
                        element.innerHTML += text.substring(i, tagEnd + 1);
                        i = tagEnd + 1;
                    } else {
                        // Malformed tag, just treat as char
                        element.innerHTML += text.charAt(i);
                        i++;
                    }
                } else {
                    element.innerHTML += text.charAt(i);
                    i++;
                }
                
                // Randomize speed slightly for realism
                const randomSpeed = speed + Math.random() * 50;
                element._typingTimer = setTimeout(typeCharHtml, randomSpeed);
            } else {
                element._typingTimer = null;
                if (callback) callback();
            }
        }
        typeCharHtml();
    } else {
        // Plain text mode
        element.textContent = "";
        
        function typeChar() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                // Randomize speed slightly for realism
                const randomSpeed = speed + Math.random() * 50;
                element._typingTimer = setTimeout(typeChar, randomSpeed);
            } else {
                element._typingTimer = null;
                if (callback) callback();
            }
        }
        
        typeChar();
    }
}

function typeDescription() {
    if (!heroDesc) return;
    
    // Move cursor to description area? 
    // Actually, Hakadao style keeps cursor at the prompt line, but let's make the description appear typed.
    // To mimic a real terminal output, we can append lines one by one.
    
    heroDesc.style.opacity = '1'; // Make container visible
    
    let lineIndex = 0;
    
    // Clear any existing timer to be safe
    if (window._heroTypingTimer) clearTimeout(window._heroTypingTimer);
    
    function typeNextLine() {
        if (lineIndex < descriptionLines.length) {
            const line = descriptionLines[lineIndex];
            const p = document.createElement('div');
            p.style.minHeight = '1.5em'; // Reserve space
            p.className = 'desc-line';
            heroDesc.appendChild(p);
            
            // If empty line, just append and continue
            if (line === "") {
                lineIndex++;
                window._heroTypingTimer = setTimeout(typeNextLine, 200);
                return;
            }
            
            // Type out the line
            typeString(p, line, 30, () => {
                lineIndex++;
                window._heroTypingTimer = setTimeout(typeNextLine, 300); // Pause between lines
            });
        }
    }
    
    typeNextLine();
}

// New: Typewriter for About Bio
let hasTypedBio = false;

function typeAboutBio() {
    if (!aboutBio || hasTypedBio) return;
    hasTypedBio = true;
    
    let lineIndex = 0;
    
    // Clear any existing timer
    if (window._bioTypingTimer) clearTimeout(window._bioTypingTimer);
    
    function typeNextBioLine() {
        if (lineIndex < aboutBioLines.length) {
            const line = aboutBioLines[lineIndex];
            const p = document.createElement('p');
            // p.style.minHeight = '1.5em'; 
            aboutBio.appendChild(p);
            
            typeString(p, line, 20, () => {
                lineIndex++;
                window._bioTypingTimer = setTimeout(typeNextBioLine, 400); // Pause between paragraphs
            });
        }
    }
    
    typeNextBioLine();
}

// Card Construction Animation
function constructCard(card, delay) {
    // Clear any existing construction timers on this card
    if (card._constructTimer1) clearTimeout(card._constructTimer1);
    if (card._constructTimer2) clearTimeout(card._constructTimer2);
    if (card._constructTimer3) clearTimeout(card._constructTimer3);

    card._constructTimer1 = setTimeout(() => {
        // 1. Show Binary Frame
        card.classList.add('constructing');
        card.classList.add('visible'); // Make sure it's visible layout-wise
        
        // Save original content and clear it
        const titleEl = card.querySelector('.work-title');
        const descEl = card.querySelector('.work-desc');
        const tagsEl = card.querySelector('.work-tags');
        
        // Handle Title text (exclude arrow span)
        let titleText = "";
        let arrowHtml = "";
        if(titleEl) {
            // Simple way to separate text from arrow span
            const arrow = titleEl.querySelector('.work-arrow');
            if(arrow) {
                arrowHtml = arrow.outerHTML;
                // Get text node content only
                titleText = titleEl.childNodes[0].textContent.trim();
            } else {
                titleText = titleEl.textContent.trim();
            }
            titleEl.innerHTML = ""; // Clear
        }

        const descText = descEl ? descEl.innerText : "";
        if(descEl) descEl.innerText = "";
        
        if(tagsEl) tagsEl.style.opacity = '0'; // Hide tags initially

        // 2. After frame construction (e.g. 500ms), show border and type content
        card._constructTimer2 = setTimeout(() => {
            card.classList.remove('constructing');
            card.classList.add('constructed'); // Solid border
            
            // Type Title
            if(titleEl) {
                typeString(titleEl, titleText, 30, () => {
                    if(arrowHtml) titleEl.innerHTML += arrowHtml; // Add arrow back
                });
            }
            
            // Type Description (Fast)
            if(descEl) {
                card._constructTimer3 = setTimeout(() => {
                   typeString(descEl, descText, 10, () => {
                       // Show Tags
                       if(tagsEl) {
                           tagsEl.style.opacity = '1';
                           tagsEl.style.transition = 'opacity 0.5s';
                       }
                   }); 
                }, 300);
            }
            
        }, 600); // Duration of binary frame animation

    }, delay);
}

function startTypingSequence() {
    // 1. Type username
    typeString(typewriterElement, "okl137", 100, () => {
        // Show Easter Egg Trigger
        const trigger = document.getElementById('matrix-trigger');
        if(trigger) {
            trigger.style.opacity = '1';
            trigger.addEventListener('click', toggleLanguage);
        }

        // After username is done
        // 2. Wait a bit then type description
        setTimeout(() => {
            typeDescription();
        }, 800);
    });
}

// Language Toggle (Matrix Easter Egg)
let isEnglish = true;
const translations = {
    en: {
        titles: {
            "about": "About Me",
            "works": "Works",
            "contact": "Get in Touch"
        },
        desc: [
            "[ Forced Full Stack Developer | Tool Maker ]",
            "\"Passionate about leveraging efficient AI tools for innovation and development.\"",
            "",
            "Looking for new challenges and building useful things."
        ],
        bio: [
            "Hello, I'm OKL137.",
            "I am a developer focused on creating specialized tools for the e-commerce industry. My goal is to automate workflows and simplify complex processes through clean, efficient code.",
            "I enjoy exploring new technologies and building projects that solve real-world problems. I believe in the power of software to enhance productivity."
        ],
        projects: [
            {
                title: "mylsfabu",
                desc: "Customized Online Shipping Assistant.<br>Streamlines the cross-border shipping process with automation and smart order management.",
                tags: ["Tool", "Automation", "E-commerce"]
            },
            {
                title: "myexefabu",
                desc: "Development Documentation Organizer.<br>A comprehensive tool for organizing technical specs and guides in cross-border scenarios.",
                tags: ["Docs", "Utility", "DevTool"]
            },
            {
                title: "mylingdongren",
                desc: "Interactive Personal Portal.<br>A physics-based \"Kawaii\" version of my persona. Features liquid glass UI that reacts to gravity and touch.",
                tags: ["Interactive", "Physics", "Cute"]
            },
            {
                title: "myckgrfb",
                desc: "GitHub Repository.<br>Explore my open source code, experiments, and other projects on GitHub.",
                tags: ["Open Source", "Code", "Git"]
            }
        ]
    },
    zh: {
        titles: {
            "about": "关于我",
            "works": "我的作品",
            "contact": "联系方式"
        },
        desc: [
            "[ 被迫全栈开发者 | 工具制造者 ]",
            "\"热衷于利用高效的 AI 工具进行创新和开发。\"",
            "",
            "寻找新的挑战，构建有用的事物。"
        ],
        bio: [
            "你好，我是 OKL137。",
            "我是一名专注于为电商行业创建专用工具的开发者。我的目标是通过整洁、高效的代码自动化工作流程并简化复杂流程。",
            "我喜欢探索新技术并构建解决现实世界问题的项目，我相信软件能够提升生产力。"
        ],
        projects: [
            {
                title: "mylsfabu",
                desc: "跨境定制订单线上发货助手。<br>通过自动化和智能订单管理简化跨境发货流程。",
                tags: ["工具", "自动化", "电商"]
            },
            {
                title: "myexefabu",
                desc: "开发文档整理工具。<br>跨境场景下整理技术规范和指南的综合工具。",
                tags: ["文档", "实用工具", "开发工具"]
            },
            {
                title: "mylingdongren",
                desc: "交互式个人门户。<br>基于物理引擎的“可爱”版个人形象。具有随重力和触摸反应的液态玻璃 UI。",
                tags: ["交互", "物理", "可爱"]
            },
            {
                title: "myckgrfb",
                desc: "GitHub 仓库。<br>在 GitHub 上探索我的开源代码、实验和其他项目。",
                tags: ["开源", "代码", "Git"]
            }
        ]
    }
};

function toggleLanguage() {
    isEnglish = !isEnglish;
    const lang = isEnglish ? translations.en : translations.zh;
    
    // Toggle body class for CSS styling
    document.body.classList.toggle('lang-zh', !isEnglish);

    // 1. Update Titles (No-op as per request, but keeping placeholder)
    
    // 2. Update Hero Description (Retype)
    const heroDesc = document.getElementById('hero-desc');
    // Clear current typing if any (though typeString handles it, heroDesc logic is custom)
    // Actually, typeHero below is custom. We should make it robust.
    // Ideally we should use typeString for heroDesc too, but it has custom logic for lines.
    // For now, let's just clear content.
    heroDesc.innerHTML = "";
    
    // Re-trigger Avatar Load Animation
    const avatarContainer = document.querySelector('.avatar-container');
    if(avatarContainer) {
        avatarContainer.classList.remove('animate-in');
        avatarContainer.offsetWidth; /* trigger reflow */
        avatarContainer.classList.add('animate-in');
    }
    
    // Re-trigger typing manually for hero desc
    let lineIndex = 0;
    // Clear any existing hero typing timer? 
    // The current typeHero uses recursive setTimeout but doesn't expose ID.
    // We'll define a new one and attach to window to cancel old one?
    if (window._heroTypingTimer) clearTimeout(window._heroTypingTimer);
    
    function typeHero() {
        if(lineIndex < lang.desc.length) {
            const p = document.createElement('div');
            p.className = 'desc-line';
            heroDesc.appendChild(p);
            // Use typeString for effect instead of instant
            typeString(p, lang.desc[lineIndex], 30, () => {
                lineIndex++;
                window._heroTypingTimer = setTimeout(typeHero, 300);
            });
        }
    }
    typeHero();

    // 3. Update About Bio
    const bioContainer = document.getElementById('about-bio');
    bioContainer.innerHTML = "";
    // Reset bio typing state
    hasTypedBio = false; 
    // We can call typeAboutBio logic again, but we need to update the source text first?
    // typeAboutBio uses `aboutBioLines` global variable. We should update it!
    // BUT `aboutBioLines` is const. We should modify typeAboutBio to use lang data.
    
    // Let's implement a direct re-type here similar to initial load
    if (window._bioTypingTimer) clearTimeout(window._bioTypingTimer);
    
    let bioLineIndex = 0;
    function typeBioReload() {
        if (bioLineIndex < lang.bio.length) {
            const p = document.createElement('p');
            bioContainer.appendChild(p);
            typeString(p, lang.bio[bioLineIndex], 20, () => {
                bioLineIndex++;
                window._bioTypingTimer = setTimeout(typeBioReload, 400);
            });
        }
    }
    typeBioReload();

    // 4. Reload Project Cards
    const cards = document.querySelectorAll('.work-card');
    cards.forEach((card, index) => {
        if(lang.projects[index]) {
            const p = lang.projects[index];
            
            // Clear any existing typing on title/desc
            const titleEl = card.querySelector('.work-title');
            const descEl = card.querySelector('.work-desc');
            const tagsEl = card.querySelector('.work-tags');
            
            if (titleEl && titleEl._typingTimer) clearTimeout(titleEl._typingTimer);
            if (descEl && descEl._typingTimer) clearTimeout(descEl._typingTimer);
            
            // Reset Card State
            card.classList.remove('visible', 'constructing', 'constructed');
            if (tagsEl) tagsEl.style.opacity = '0';
            
            // Update Content (Hidden)
            // Handle Title + Arrow
            if (titleEl) {
                // Preserve arrow if exists or re-add it
                // We'll just set text, constructCard handles arrow preservation if it exists in DOM?
                // No, constructCard expects text to be IN the element.
                // So we put the NEW text in.
                titleEl.innerHTML = p.title + ' <span class="work-arrow">→</span>';
            }
            if (descEl) descEl.innerText = p.desc;
            
            // Update Tags
            if (tagsEl) {
                const tags = tagsEl.querySelectorAll('.tag');
                tags.forEach((tag, tIndex) => {
                    if(p.tags[tIndex]) tag.innerText = p.tags[tIndex];
                });
            }
            
            // Re-trigger Animation
            // We use a slight delay so it feels like a reload
            constructCard(card, index * 200 + 100);
        }
    });

    // 5. Update Galgame Language if active
    if (typeof window.updateGalgameLanguage === 'function') {
        window.updateGalgameLanguage();
    }
}

// 3. Scroll Animations (Intersection Observer)
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = entry.target;
            target.classList.add('visible');
            
            // If it's the works section, trigger construction animation for cards
            if (target.id === 'works') {
                const cards = target.querySelectorAll('.work-card');
                cards.forEach((card, index) => {
                    constructCard(card, index * 300); // 300ms delay between cards
                });
            }
            
            // If it's the about bio container, start typing bio
            if (target.classList.contains('about-content')) {
                // Add a small delay to sync with fade-in
                setTimeout(typeAboutBio, 500);
            }

            // If it's the avatar container, trigger the cyber-load animation
            if (target.classList.contains('avatar-container')) {
                target.classList.add('animate-in');
            }
            
            observer.unobserve(target);
        }
    });
}, observerOptions);

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    // Run Boot Sequence first
    runBootSequence();
});

function runBootSequence() {
    // Force scroll to top
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    const bootScreen = document.getElementById('boot-screen');
    const bootLogo = document.querySelector('.boot-logo');
    const bootStatus = document.getElementById('boot-status');
    const bootLogs = document.getElementById('boot-logs');
    
    if (!bootScreen) {
        startMainFlow();
        return;
    }

    // 1. Logo Glitch In
    setTimeout(() => {
        bootLogo.style.opacity = '1';
        // Stop glitch after a bit
        setTimeout(() => {
            bootLogo.style.animation = 'none';
            bootLogo.style.textShadow = '0 0 10px #fff';
        }, 800);
    }, 200);

    // 2. Status Typing
    const statuses = [
        "> CONNECTING TO NEURAL NET...",
        "> VERIFYING SECURITY PROTOCOLS...",
        "> DOWNLOADING ASSETS...",
        "> ACCESS GRANTED."
    ];
    
    let statusIndex = 0;
    function nextStatus() {
        if(statusIndex < statuses.length) {
            bootStatus.innerText = statuses[statusIndex];
            statusIndex++;
            setTimeout(nextStatus, 600);
        } else {
            // Boot Complete
            finishBoot();
        }
    }
    setTimeout(nextStatus, 500);

    // 3. Fast scrolling logs
    const logData = [
        "0x001: KERNEL_LOAD_OK", "0x002: MEMORY_CHECK_PASS", "0x003: VUE_INSTANCE_MOUNTING",
        "0x004: REACT_DOM_RENDER", "0x005: STACK_OVERFLOW_PREVENTED", "0x006: COFFEE_MODULE_INIT",
        "0x007: MATRIX_GRID_ALIGN", "0x008: DECRYPTING_USER_DATA", "0x009: ESTABLISHING_UPLINK",
        "0x00A: BYPASSING_FIREWALL", "0x00B: INJECTING_CSS_STYLES", "0x00C: PARSING_JS_SCRIPTS"
    ];
    
    let logIndex = 0;
    const logInterval = setInterval(() => {
        if(logIndex < logData.length) {
            const div = document.createElement('div');
            div.innerText = logData[logIndex];
            bootLogs.prepend(div);
            logIndex++;
        } else {
            clearInterval(logInterval);
        }
    }, 150);

    function finishBoot() {
        // Ensure we are at top again before revealing
        window.scrollTo(0, 0);
        
        setTimeout(() => {
            // Fade out
            bootScreen.style.transition = 'opacity 0.8s ease-out';
            bootScreen.style.opacity = '0';
            
            // Start main page logic
            startMainFlow();
            
            // Remove from DOM
            setTimeout(() => {
                bootScreen.remove();
            }, 800);
        }, 500);
    }
}

function startMainFlow() {
    // Reset contents
    if (typewriterElement) typewriterElement.textContent = "";
    if (heroDesc) {
        heroDesc.innerHTML = "";
        heroDesc.style.opacity = '0';
    }
    
    // Start initial animations
    setTimeout(renderAscii, 300);
    
    // Scramble/Decode Animation for Main Title
    const mainTitle = document.querySelector('h1');
    if(mainTitle) {
        const originalText = mainTitle.innerText;
        // Set initial state to scrambled or keep it hidden and reveal
        let iterations = 0;
        const interval = setInterval(() => {
            mainTitle.innerText = originalText.split('')
                .map((letter, index) => {
                    if(index < iterations) {
                        return originalText[index];
                    }
                    // Random characters from matrix-like set
                    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join('');
            
            if(iterations >= originalText.length) {
                clearInterval(interval);
                mainTitle.innerText = originalText; // Ensure final text is correct
            }
            
            iterations += 1/2; // Speed of decoding
        }, 50);
    }
    
    // Start typing sequence
    setTimeout(startTypingSequence, 1500); // Start after ASCII is fully visible

    // Observe elements for scroll animation
    const animatedElements = document.querySelectorAll('h2, .about-content, .links-container, #works, .avatar-container');
    animatedElements.forEach(el => observer.observe(el));

    // Scroll Indicator Click
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Nav Active State on Scroll & Title Hover Effect
    const sections = document.querySelectorAll('section, #home');
    const navLinks = document.querySelectorAll('nav a');
    const titles = document.querySelectorAll('h2');

    // Mouse Move Effect for Background
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        document.documentElement.style.setProperty('--mouse-x', `${x}px`);
        document.documentElement.style.setProperty('--mouse-y', `${y}px`);
    });

    // Matrix Rain Effect
    const canvas = document.getElementById('matrix-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        
        const chars = '01';
        const fontSize = 14;
        const columns = width / fontSize;
        const drops = [];
        
        for(let x = 0; x < columns; x++) {
            drops[x] = 1;
        }
        
        function drawMatrix() {
            ctx.fillStyle = 'rgba(5, 5, 5, 0.05)'; // Fade effect
            ctx.fillRect(0, 0, width, height);
            
            ctx.fillStyle = '#0f0'; // Text color
            ctx.font = fontSize + 'px monospace';
            
            for(let i = 0; i < drops.length; i++) {
                const text = chars.charAt(Math.floor(Math.random() * chars.length));
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                
                if(drops[i] * fontSize > height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }
        
        setInterval(drawMatrix, 50);
        
        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });
    }

    // Title Hover Effect (Scramble)
    const originalTexts = new Map();
    titles.forEach(title => {
        if(title.dataset.text) {
            originalTexts.set(title, title.dataset.text);
            
            title.addEventListener('mouseenter', () => {
                let iterations = 0;
                const interval = setInterval(() => {
                    title.innerText = title.innerText.split('')
                        .map((letter, index) => {
                            if(index < iterations) {
                                return title.dataset.text[index];
                            }
                            return String.fromCharCode(65 + Math.floor(Math.random() * 26));
                        })
                        .join('');
                    
                    if(iterations >= title.dataset.text.length) {
                        clearInterval(interval);
                    }
                    
                    iterations += 1/3;
                }, 30);
            });
        }
    });

    window.addEventListener('scroll', () => {
        // Navbar style
        const nav = document.querySelector('nav');
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        // Active link & Dynamic Background Color
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 300)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
        
        // Change global background tint based on section
        const root = document.documentElement;
        if (current === 'home') {
            root.style.setProperty('--section-tint', 'rgba(0, 20, 0, 0.05)'); // Green tint
        } else if (current === 'about') {
            root.style.setProperty('--section-tint', 'rgba(20, 20, 20, 0.05)'); // Grey tint
        } else if (current === 'works') {
            root.style.setProperty('--section-tint', 'rgba(0, 10, 30, 0.08)'); // Blue tint
        } else if (current === 'contact') {
            root.style.setProperty('--section-tint', 'rgba(20, 0, 10, 0.05)'); // Red tint
        }
    });
}

// Galgame Easter Egg Logic
const galgameData = {
    en: {
        options: {
            confess: "Confess",
            attack: "Attack",
            skip: "Skip",
            money: "Give Money"
        },
        responses: {
            confess: "Why are you confessing to me directly?! This isn't how Galgames work! You should chat with me more, increase my affection. Send me gifts occasionally, then have special interactions with me during special holidays. Finally, confess to me during a mysterious event in my heart, and I'll agree to be with you, then I'll show you my special CG. How can you just come up and confess?! This isn't how Galgames work at all! I don't accept it!!",
            attack: "You're trying to conquer me? Is my affection going up? Not at all! My HP is dropping! This isn't a strategy, this is an attack! When I chat with you normally, you reply intermittently. Are you using delayed attacks? Do you think I'm some boss you're farming? I don't drop items, and I only have this one life.",
            skip: "How exactly are you playing this Galgame? Every time I chat with you, you just reply skip, skip, skip. What's wrong? Who plays Galgames like this? You should calm down and read my text, slowly savor my voice acting. Think about how to talk to me and which option increases my affection the most. Finally, experience different branches to get the perfect ending. You're just skipping all the Galgame dialogue and going straight for my special CG, aren't you? If you keep doing this, who will play with you? Start over immediately! I don't accept playing Galgame like this!",
            money: "Why are you asking me for money? Even if you're poor, I can't just give it to you. If I were the one conquering you, I could spend money to buy you gifts. But if you just ask me for money directly, what does that become? Hey, Galgames aren't like this at all. No one says someone is great just because I gave them money. This isn't romance, what do you take this for? If you're conquering me, you can't ask me for money either. If you ask me for money, my affection will drop. Do you not care about my affection at all? Then you're not here to conquer me. You're here to scam my money."
        },
        glitchText: "FATAL ERROR: SYSTEM OVERLOAD... INVALID OPERATION..."
    },
    zh: {
        options: {
            confess: "告白",
            attack: "攻击",
            skip: "跳过",
            money: "给点钱"
        },
        responses: {
            confess: "你为啥跟我直接表白啊？！嘎啦game里不是这样！你应该多跟我聊天，然后提升我的好感度。偶尔给我送送礼物，然后在那个特殊节日时候跟我有特殊互动。最后在某个我内心神秘事件中，向我表白，我同意跟你在一起，然后我给你看我的特殊CG啊。你怎么直接上来跟我表白！？嘎啦game里根本不是这样！我不接受！！",
            attack: "你攻略我，我亲密度有没有往上涨啊？根本没有！我血条一直往下掉啊，你这不是攻略，这是攻击！跟你正常聊天你也是时回时不回的，你还会快慢刀啊？你把我当什么BOSS在刷啊是不是，我根本不是掉掉落物，而且我就这一条命。",
            skip: "不是你到底咋玩的嘎啦game？每次一跟你聊天，你都一直回复skip，skip，skip。咋滴啊？嘎啦game哪有你这么玩的？你应该静下心看完我的文本，慢慢品味我的配音。思考怎么和我对话选哪个选项最能提升我的好感。最后体验不同分支打出最完美的结局。你现在直接把嘎啦game的对话全跳了，直接奔着我的特殊CG去了是吧？你要是老这样以后谁还跟你玩？你快点重新给我来!这样玩嘎啦game我不接受！",
            money: "你怎么找我要钱呢，你穷我也不可以给你呀。如果是我攻略你的话，我可以花钱给你买礼物啊。但是你直接找我要钱那成什么啦。嘿，旮旯game里根本不会这样，没有说谁是因为我给她钱，她多好的。这不是恋爱，你把这个当成什么了。如果是你攻略我，你也不能找我要钱啊。你找我要钱，我的好感度会低啊。你是不是根本不在乎我对你的好感度，那你就不是来攻略我的。你是来骗我的钱。"
        },
        glitchText: "FATAL ERROR: SYSTEM OVERLOAD... INVALID OPERATION..."
    }
};

function initGalgame() {
    const avatarContainer = document.querySelector('.avatar-container');
    const avatar = document.querySelector('.avatar');
    
    if (!avatarContainer || !avatar) return;

    // Create Dialog Elements
    const dialog = document.createElement('div');
    dialog.className = 'galgame-dialog';
    
    const content = document.createElement('div');
    content.className = 'galgame-content';
    
    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'galgame-options';
    
    const btnConfess = document.createElement('button');
    btnConfess.className = 'galgame-btn';
    btnConfess.dataset.action = 'confess';
    
    const btnAttack = document.createElement('button');
    btnAttack.className = 'galgame-btn';
    btnAttack.dataset.action = 'attack';
    
    const btnSkip = document.createElement('button');
    btnSkip.className = 'galgame-btn';
    btnSkip.dataset.action = 'skip';
    
    const btnMoney = document.createElement('button');
    btnMoney.className = 'galgame-btn';
    btnMoney.dataset.action = 'money';

    optionsDiv.appendChild(btnConfess);
    optionsDiv.appendChild(btnAttack);
    optionsDiv.appendChild(btnSkip);
    optionsDiv.appendChild(btnMoney);
    
    const textArea = document.createElement('div');
    textArea.className = 'galgame-text-area';
    
    const textP = document.createElement('div');
    textP.className = 'galgame-text';
    
    const cursorSpan = document.createElement('span');
    cursorSpan.className = 'galgame-cursor';
    
    textArea.appendChild(textP);
    
    content.appendChild(optionsDiv);
    content.appendChild(textArea);
    dialog.appendChild(content);
    
    avatarContainer.appendChild(dialog);
    
    // Update Button Texts function
    window.updateGalgameLanguage = function() {
        const langData = isEnglish ? galgameData.en : galgameData.zh;
        btnConfess.textContent = langData.options.confess;
        btnAttack.textContent = langData.options.attack;
        btnSkip.textContent = langData.options.skip;
        btnMoney.textContent = langData.options.money;
        
        // Also update glitch text if currently showing? 
        // No, keep it simple. If text is showing, it remains until action.
    };
    
    // Initial update
    window.updateGalgameLanguage();
    
    // Handle Actions
    const buttons = [btnConfess, btnAttack, btnSkip, btnMoney];
    let typingTimeout;
    let resetTimeout; // New: track reset timer
    let isPlaying = false; // Lock to prevent multiple clicks
    
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent closing
            if(isPlaying) return; // Ignore clicks if playing
            
            const action = btn.dataset.action;
            playSequence(action);
        });
    });

    // Toggle Dialog
    avatar.addEventListener('click', () => {
        const isActive = dialog.classList.contains('active');
        if (isActive) {
            dialog.classList.remove('active');
            // Clear any pending resets when closing
            if(resetTimeout) clearTimeout(resetTimeout);
            if(typingTimeout) clearTimeout(typingTimeout);
            isPlaying = false;
        } else {
            window.updateGalgameLanguage();
            dialog.classList.add('active');
            
            // Reset View
            textP.textContent = ""; 
            textP.style.display = 'none'; // Hide text initially
            optionsDiv.style.display = 'flex'; // Show options
            
            // Reset any playing sequence
            if(typingTimeout) clearTimeout(typingTimeout);
            if(resetTimeout) clearTimeout(resetTimeout);
            isPlaying = false;
        }
    });
    
    function playSequence(action) {
        isPlaying = true;
        
        // Hide Options, Show Text Area
        optionsDiv.style.display = 'none';
        textP.style.display = 'block';

        // Trigger Avatar Animation
        if(avatar) {
            // Reset animations
            avatar.classList.remove('anim-confess', 'anim-attack', 'anim-skip', 'anim-money');
            void avatar.offsetWidth; // Force reflow
            
            // Add specific animation
            if (action === 'confess') avatar.classList.add('anim-confess');
            if (action === 'attack') avatar.classList.add('anim-attack');
            if (action === 'skip') avatar.classList.add('anim-skip');
            if (action === 'money') avatar.classList.add('anim-money');
        }

        const langData = isEnglish ? galgameData.en : galgameData.zh;
        const responseText = langData.responses[action];
        // const glitchText = langData.glitchText; // Removed glitch text
        
        // Reset
        if(typingTimeout) clearTimeout(typingTimeout);
        if(resetTimeout) clearTimeout(resetTimeout); // Clear existing reset timer
        textP.textContent = "";
        textP.className = 'galgame-text'; // No glitch class
        
        // Directly type out text
        typeGalgameText(textP, responseText);
    }
    
    function typeGalgameText(element, text) {
        let i = 0;
        element.textContent = "";
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                // Random speed
                const speed = 30 + Math.random() * 50;
                typingTimeout = setTimeout(type, speed);
                
                // Auto scroll to bottom
                element.scrollTop = element.scrollHeight;
            } else {
                // Typing Finished
                // Wait 5 seconds then reset to options
                resetTimeout = setTimeout(() => {
                    resetToOptions();
                }, 5000);
            }
        }
        
        type();
    }

    function resetToOptions() {
        textP.style.display = 'none';
        textP.textContent = "";
        optionsDiv.style.display = 'flex';
        isPlaying = false; // Release lock
    }
}

// Initialize Galgame
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGalgame);
} else {
    initGalgame();
}
