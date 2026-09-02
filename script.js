/**
 * RUCHIR GUPTA - APPLE-INSPIRED 3D EXPERIENCE ENGINE
 * 
 * 1. Three.js Studio Titanium 3D Engine (Sculpted geometry, studio 3-point lighting, stardust)
 * 2. Pure Web Audio Haptic Tap Synthesizer (Subtle Apple-grade feedback)
 * 3. 3D Perspective Tilt Physics Engine
 * 4. macOS Developer Terminal (Clean CLI Emulator)
 * 5. Bento Grid & Capabilities Filtering
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. WEB AUDIO API - SUBTLE HAPTIC TAP SYNTHESIZER
       ========================================================================== */
    class HapticAudioEngine {
        constructor() {
            this.ctx = null;
            this.enabled = false;
            this.init();
        }

        init() {
            const savedPref = localStorage.getItem('rg_apple_sound');
            if (savedPref === 'true') {
                this.enabled = true;
            }
            this.updateUi();
        }

        ensureContext() {
            if (!this.ctx) {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                if (AudioContext) {
                    this.ctx = new AudioContext();
                }
            }
            if (this.ctx && this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
        }

        toggle() {
            this.ensureContext();
            this.enabled = !this.enabled;
            localStorage.setItem('rg_apple_sound', this.enabled ? 'true' : 'false');
            this.updateUi();
            if (this.enabled) {
                this.playTap(600);
            }
            return this.enabled;
        }

        updateUi() {
            const toggleBtn = document.getElementById('sound-toggle');
            if (!toggleBtn) return;
            const onSvg = toggleBtn.querySelector('.sound-on-svg');
            const offSvg = toggleBtn.querySelector('.sound-off-svg');

            if (this.enabled) {
                toggleBtn.classList.add('active');
                if (onSvg) onSvg.style.display = 'block';
                if (offSvg) offSvg.style.display = 'none';
            } else {
                toggleBtn.classList.remove('active');
                if (onSvg) onSvg.style.display = 'none';
                if (offSvg) offSvg.style.display = 'block';
            }
        }

        // Extremely subtle Apple-style haptic tap click
        playTap(freq = 520) {
            if (!this.enabled) return;
            try {
                this.ensureContext();
                if (!this.ctx) return;

                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';

                osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.035);

                gain.gain.setValueAtTime(0.018, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.035);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start();
                osc.stop(this.ctx.currentTime + 0.035);
            } catch (e) { }
        }

        playHover() {
            this.playTap(750);
        }

        playKey() {
            this.playTap(380 + Math.random() * 50);
        }
    }

    const hapticAudio = new HapticAudioEngine();

    const soundToggleBtn = document.getElementById('sound-toggle');
    if (soundToggleBtn) {
        soundToggleBtn.addEventListener('click', () => hapticAudio.toggle());
    }

    document.querySelectorAll('[data-sound="hover"]').forEach(el => {
        el.addEventListener('mouseenter', () => hapticAudio.playHover());
    });
    document.querySelectorAll('[data-sound="tap"]').forEach(el => {
        el.addEventListener('click', () => hapticAudio.playTap(580));
    });


    /* ==========================================================================
       2. THREE.JS STUDIO TITANIUM 3D ENGINE
       ========================================================================== */
    class StudioUniverse3D {
        constructor() {
            this.canvas = document.getElementById('webgl-canvas');
            if (!this.canvas || typeof THREE === 'undefined') {
                console.warn('Three.js or Canvas not available');
                return;
            }

            this.init();
        }

        init() {
            // Scene & Camera
            this.scene = new THREE.Scene();
            this.camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
            this.camera.position.z = 18;

            // WebGL Renderer
            this.renderer = new THREE.WebGLRenderer({
                canvas: this.canvas,
                alpha: true,
                antialias: true
            });
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

            // Studio Objects
            this.createStudioLighting();
            this.createTitaniumSculpture();
            this.createStardustField();

            // Interactions
            this.mouseX = 0;
            this.mouseY = 0;
            this.targetRotX = 0;
            this.targetRotY = 0;
            this.isDragging = false;
            this.prevMouse = { x: 0, y: 0 };
            this.dragVelocity = { x: 0, y: 0 };
            this.scrollProgress = 0;
            this.clock = new THREE.Clock();

            // Bind Events
            this.bindEvents();

            // Animation Loop
            this.animate();
        }

        createStudioLighting() {
            // Soft Studio Ambient Fill
            const ambient = new THREE.AmbientLight(0xffffff, 0.8);
            this.scene.add(ambient);

            // Key Light (Warm Neutral Key)
            this.keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
            this.keyLight.position.set(12, 14, 12);
            this.scene.add(this.keyLight);

            // Rim Light 1 (Apple Electric Blue)
            this.rimBlue = new THREE.PointLight(0x2997ff, 2.2, 50);
            this.rimBlue.position.set(-14, -8, 10);
            this.scene.add(this.rimBlue);

            // Rim Light 2 (Apple Indigo Accent)
            this.rimIndigo = new THREE.PointLight(0x5e5ce6, 1.8, 50);
            this.rimIndigo.position.set(10, -10, -8);
            this.scene.add(this.rimIndigo);
        }

        createTitaniumSculpture() {
            this.sculptureGroup = new THREE.Group();

            // Continuous, Silky Sculpted Torus Knot Geometry
            const knotGeo = new THREE.TorusKnotGeometry(3.3, 0.9, 128, 32, 2, 3);
            const knotMat = new THREE.MeshStandardMaterial({
                color: 0xdedee8,
                metalness: 0.88,
                roughness: 0.2,
                wireframe: false
            });
            this.knotMesh = new THREE.Mesh(knotGeo, knotMat);
            this.sculptureGroup.add(this.knotMesh);

            // Subtle Internal Luminous Orb
            const innerGeo = new THREE.SphereGeometry(1.4, 28, 28);
            const innerMat = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.4
            });
            this.innerOrb = new THREE.Mesh(innerGeo, innerMat);
            this.sculptureGroup.add(this.innerOrb);

            // Positioning
            if (window.innerWidth > 1024) {
                this.sculptureGroup.position.set(6.6, 0.3, 0);
            } else {
                this.sculptureGroup.position.set(0, 1.2, 0);
            }

            this.scene.add(this.sculptureGroup);
        }

        createStardustField() {
            const count = 900;
            const geometry = new THREE.BufferGeometry();
            const positions = new Float32Array(count * 3);

            for (let i = 0; i < count; i++) {
                positions[i * 3] = (Math.random() - 0.5) * 75;
                positions[i * 3 + 1] = (Math.random() - 0.5) * 75;
                positions[i * 3 + 2] = (Math.random() - 0.5) * 55;
            }

            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

            const material = new THREE.PointsMaterial({
                color: 0xffffff,
                size: 0.08,
                transparent: true,
                opacity: 0.45
            });

            this.stardust = new THREE.Points(geometry, material);
            this.scene.add(this.stardust);
        }

        bindEvents() {
            window.addEventListener('resize', () => {
                this.camera.aspect = window.innerWidth / window.innerHeight;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(window.innerWidth, window.innerHeight);
                this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

                if (window.innerWidth > 1024) {
                    this.sculptureGroup.position.set(6.6, 0.3, 0);
                } else {
                    this.sculptureGroup.position.set(0, 1.2, 0);
                }
            });

            window.addEventListener('mousemove', (e) => {
                this.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
                this.mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
            });

            window.addEventListener('scroll', () => {
                const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
                this.scrollProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
            }, { passive: true });

            // Interactive Dragging on 3D canvas
            const container = document.getElementById('webgl-container');
            if (container) {
                const onPointerDown = (e) => {
                    this.isDragging = true;
                    this.prevMouse = { x: e.clientX, y: e.clientY };
                    this.dragVelocity = { x: 0, y: 0 };
                };

                const onPointerMove = (e) => {
                    if (!this.isDragging) return;
                    const deltaX = e.clientX - this.prevMouse.x;
                    const deltaY = e.clientY - this.prevMouse.y;

                    this.dragVelocity = { x: deltaX * 0.004, y: deltaY * 0.004 };
                    this.sculptureGroup.rotation.y += this.dragVelocity.x;
                    this.sculptureGroup.rotation.x += this.dragVelocity.y;

                    this.prevMouse = { x: e.clientX, y: e.clientY };
                };

                const onPointerUp = () => {
                    this.isDragging = false;
                };

                container.addEventListener('pointerdown', onPointerDown);
                window.addEventListener('pointermove', onPointerMove);
                window.addEventListener('pointerup', onPointerUp);
            }
        }

        animate() {
            requestAnimationFrame(() => this.animate());

            const delta = this.clock.getDelta();
            const elapsed = this.clock.getElapsedTime();

            // Smooth Sculpture Rotation
            if (this.knotMesh) {
                this.knotMesh.rotation.x += 0.004;
                this.knotMesh.rotation.y += 0.006;
            }

            if (this.innerOrb) {
                const scale = 1 + Math.sin(elapsed * 2) * 0.08;
                this.innerOrb.scale.set(scale, scale, scale);
            }

            if (this.stardust) {
                this.stardust.rotation.y = elapsed * 0.008;
            }

            // Drag momentum decay
            if (!this.isDragging) {
                this.dragVelocity.x *= 0.95;
                this.dragVelocity.y *= 0.95;
                this.sculptureGroup.rotation.y += this.dragVelocity.x;
                this.sculptureGroup.rotation.x += this.dragVelocity.y;
            }

            // Scroll Parallax Camera Transitions
            const targetCamZ = 18 - this.scrollProgress * 5;
            const targetCamY = -this.scrollProgress * 7;
            this.camera.position.z += (targetCamZ - this.camera.position.z) * 0.05;
            this.camera.position.y += (targetCamY - this.camera.position.y) * 0.05;

            // Gentle Fluid Mouse Parallax
            this.targetRotX = this.mouseY * 0.18;
            this.targetRotY = this.mouseX * 0.25;
            this.scene.rotation.x += (this.targetRotX - this.scene.rotation.x) * 0.04;
            this.scene.rotation.y += (this.targetRotY - this.scene.rotation.y) * 0.04;

            this.renderer.render(this.scene, this.camera);
        }
    }

    const studioUniverse = new StudioUniverse3D();


    /* ==========================================================================
       3. 3D PERSPECTIVE TILT CARDS ENGINE
       ========================================================================== */
    class AppleTiltEngine {
        constructor() {
            this.cards = document.querySelectorAll('[data-tilt]');
            this.init();
        }

        init() {
            if (!this.cards.length) return;

            this.cards.forEach(card => {
                card.addEventListener('mousemove', (e) => this.handleMove(e, card));
                card.addEventListener('mouseleave', () => this.handleLeave(card));
            });
        }

        handleMove(e, card) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -6;
            const rotateY = ((x - centerX) / centerX) * 6;

            card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`;
        }

        handleLeave(card) {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        }
    }

    new AppleTiltEngine();


    /* ==========================================================================
       4. macOS DEVELOPER TERMINAL (CLEAN CLI MODAL)
       ========================================================================== */
    class MacosTerminalModal {
        constructor() {
            this.modal = document.getElementById('terminal-modal');
            this.output = document.getElementById('modal-terminal-output');
            this.input = document.getElementById('modal-command-input');
            this.submitBtn = document.getElementById('cli-submit-btn');
            this.closeBtn = document.getElementById('modal-close-btn');

            this.history = [];
            this.historyIndex = -1;

            this.commands = this.createCommands();
            this.init();
        }

        init() {
            if (!this.modal) return;

            const openBtns = [
                document.getElementById('open-terminal-btn'),
                document.getElementById('hero-terminal-trigger')
            ];
            openBtns.forEach(btn => {
                if (btn) {
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.open();
                    });
                }
            });

            if (this.closeBtn) {
                this.closeBtn.addEventListener('click', () => this.close());
            }

            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.close();
                }
            });

            window.addEventListener('keydown', (e) => {
                if (e.key === '`' || e.key === '~') {
                    if (document.activeElement !== this.input) {
                        e.preventDefault();
                        this.toggle();
                    }
                } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                    e.preventDefault();
                    this.toggle();
                } else if (e.key === 'Escape' && this.isOpen()) {
                    this.close();
                }
            });

            if (this.input) {
                this.input.addEventListener('keydown', (e) => {
                    hapticAudio.playKey();
                    if (e.key === 'Enter') {
                        const cmd = this.input.value.trim();
                        if (cmd) {
                            this.history.push(cmd);
                            this.historyIndex = this.history.length;
                            this.execute(cmd);
                        }
                        this.input.value = '';
                    } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        if (this.historyIndex > 0) {
                            this.historyIndex--;
                            this.input.value = this.history[this.historyIndex];
                        }
                    } else if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        if (this.historyIndex < this.history.length - 1) {
                            this.historyIndex++;
                            this.input.value = this.history[this.historyIndex];
                        } else {
                            this.historyIndex = this.history.length;
                            this.input.value = '';
                        }
                    }
                });
            }

            if (this.submitBtn && this.input) {
                this.submitBtn.addEventListener('click', () => {
                    const cmd = this.input.value.trim();
                    if (cmd) {
                        this.history.push(cmd);
                        this.historyIndex = this.history.length;
                        this.execute(cmd);
                    }
                    this.input.value = '';
                    this.input.focus();
                });
            }

            document.querySelectorAll('.quick-chip').forEach(btn => {
                btn.addEventListener('click', () => {
                    hapticAudio.playTap(620);
                    const cmd = btn.getAttribute('data-cmd');
                    if (cmd) {
                        this.execute(cmd);
                        if (this.input) this.input.focus();
                    }
                });
            });

            this.printInitialBanner();
        }

        isOpen() {
            return this.modal.classList.contains('open');
        }

        open() {
            this.modal.classList.add('open');
            hapticAudio.playTap(650);
            setTimeout(() => {
                if (this.input) this.input.focus();
                this.scrollToBottom();
            }, 100);
        }

        close() {
            this.modal.classList.remove('open');
            hapticAudio.playTap(450);
        }

        toggle() {
            if (this.isOpen()) {
                this.close();
            } else {
                this.open();
            }
        }

        scrollToBottom() {
            if (this.output) {
                this.output.scrollTop = this.output.scrollHeight;
            }
        }

        printInitialBanner() {
            this.output.innerHTML = `
                <div class="term-block">
                    <span class="term-highlight">Last login: Today on ttys001</span><br>
                    Welcome to Ruchir Gupta's Developer Terminal.<br>
                    Type <span class="term-accent">'help'</span> or select any command above to begin.<br>
                </div>
            `;
        }

        appendCommandPrompt(cmd) {
            const block = document.createElement('div');
            block.className = 'term-block';
            block.innerHTML = `
                <div class="term-prompt-line">
                    <span class="user-txt">ruchir</span><span class="at-txt">@</span><span class="host-txt">portfolio</span> <span class="path-txt">~</span> % <span class="text-white">${cmd}</span>
                </div>
            `;
            this.output.appendChild(block);
        }

        appendOutput(html) {
            const block = document.createElement('div');
            block.className = 'term-block';
            block.innerHTML = html;
            this.output.appendChild(block);
            this.scrollToBottom();
        }

        execute(rawCmd) {
            this.appendCommandPrompt(rawCmd);
            const cmd = rawCmd.toLowerCase().trim();

            if (this.commands[cmd]) {
                this.commands[cmd]();
            } else if (cmd === 'clear') {
                this.output.innerHTML = '';
            } else if (cmd === 'sudo') {
                this.appendOutput('<span class="text-secondary">Password: **********<br>Permission granted. Welcome, administrator.</span>');
            } else {
                this.appendOutput(`zsh: command not found: ${rawCmd}. Type <span class="term-accent">'help'</span> for available commands.`);
            }
            this.scrollToBottom();
        }

        createCommands() {
            return {
                'help': () => {
                    this.appendOutput(`
                        <span class="term-highlight">Available Commands:</span><br>
                        &bull; <span class="term-accent">whoami</span>     - Professional overview &amp; summary<br>
                        &bull; <span class="term-accent">experience</span> - Work history (Accenture, EV Software, iEnergizer)<br>
                        &bull; <span class="term-accent">projects</span>   - Core architectural systems &amp; AI engines<br>
                        &bull; <span class="term-accent">skills</span>     - Technical capabilities matrix<br>
                        &bull; <span class="term-accent">resume</span>     - Download resume (PDF)<br>
                        &bull; <span class="term-accent">contact</span>    - Direct links to LinkedIn &amp; GitHub<br>
                        &bull; <span class="term-accent">clear</span>      - Clear terminal window<br>
                        &bull; <span class="term-accent">exit</span>       - Close developer terminal<br>
                    `);
                },
                'whoami': () => {
                    this.appendOutput(`
                        <span class="term-highlight">Ruchir Gupta</span><br>
                        <span class="text-secondary">Senior Software Engineer &bull; Backend &amp; Distributed Systems</span><br>
                        Experience: 5+ Years<br>
                        Current: Accenture (Senior Software Engineer - Backend Developer)<br><br>
                        Specialized in high-concurrency Node.js, real-time WebSocket systems, MS SQL optimization, and enterprise Azure OpenAI automation.<br><br>
                        &bull; LinkedIn: <a href="https://www.linkedin.com/in/ruxchir" target="_blank">linkedin.com/in/ruxchir</a><br>
                        &bull; GitHub: <a href="https://github.com/ruchirgupta" target="_blank">github.com/ruchirgupta</a><br>
                    `);
                },
                'experience': () => {
                    this.appendOutput(`
                        <span class="term-highlight">Professional Experience</span><br><br>
                        <span class="term-accent">[12/2024 - Present] Senior Software Engineer @ Accenture</span><br>
                        &bull; Automated Chat Auditing Engine (OpenAI API + MS SQL, -70% QA overhead).<br>
                        &bull; Real-time Break Management Portal (WebSockets, 500+ concurrent agents).<br>
                        &bull; AI Rapid Response Ticket Resolution Engine (Azure OpenAI, -60% response time).<br>
                        &bull; Microsoft Teams Voice Bot for automated IT support triage.<br><br>
                        <span class="term-accent">[08/2022 - 12/2024] Software Engineer - Full Stack @ EV Software Solutions</span><br>
                        &bull; Accelerated team dev velocity by 55% using standardized React patterns.<br>
                        &bull; Led enterprise customer platform driving a 45% lift in engagement.<br>
                        &bull; Improved UI performance by 60% and slashed load times by 40%.<br>
                        &bull; Integrated DataDog, Sentry observability, and full RBAC security.<br><br>
                        <span class="term-accent">[09/2020 - 08/2022] CS Executive &amp; Operations @ iEnergizer</span><br>
                        &bull; Online game operations, UX balancing, and asset integration.<br>
                    `);
                },
                'projects': () => {
                    this.appendOutput(`
                        <span class="term-highlight">Featured Architectural Systems</span><br><br>
                        1. <span class="term-accent">Chat Sentinel:</span> Automated QA audit engine parsing support chats via OpenAI API &amp; MS SQL (-70% QA overhead).<br>
                        2. <span class="term-accent">SyncShift:</span> Real-time workforce break portal managing 500+ concurrent agents with WebSockets.<br>
                        3. <span class="term-accent">ApexResolve:</span> Azure OpenAI tier-1 ticket resolution engine (-60% first response time).<br>
                        4. <span class="term-accent">Teams VoiceBot:</span> Conversational voice assistant for enterprise internal IT support.<br>
                        5. <span class="term-accent">OmniPortal:</span> High-scale customer frontend platform built on React/Redux (+45% engagement).<br>
                        6. <span class="term-accent">Titanium 3D:</span> Sculpted Three.js WebGL experience with studio lighting &amp; Bento grids.<br>
                    `);
                },
                'skills': () => {
                    this.appendOutput(`
                        <span class="term-highlight">Technical Capabilities Matrix</span><br><br>
                        <span class="text-secondary">[Backend &amp; Systems]</span> Node.js, Express.js, MS SQL, PostgreSQL, WebSockets, RESTful APIs, Microservices.<br>
                        <span class="text-secondary">[AI &amp; Automation]</span> OpenAI API, Azure OpenAI Services, LLM Workflows, Teams Voice Bots, Automated QA.<br>
                        <span class="text-secondary">[Frontend Architecture]</span> React.js, Next.js, Redux, TypeScript, JavaScript (ES6+), HTML5/CSS3, Tailwind CSS.<br>
                        <span class="text-secondary">[Cloud &amp; DevOps]</span> Docker, Azure Cloud, Git/GitHub, CI/CD, DataDog, Sentry, Bash/Zsh.<br>
                    `);
                },
                'resume': () => {
                    this.appendOutput(`
                        <span class="text-secondary">Initiating download...</span><br>
                        File: <span class="term-highlight">RuchirGupta-SoftwareEngineer.pdf</span><br>
                    `);
                    const link = document.createElement('a');
                    link.href = 'RuchirGupta-SoftwareEngineer.pdf';
                    link.download = 'RuchirGupta-SoftwareEngineer.pdf';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                },
                'contact': () => {
                    this.appendOutput(`
                        <span class="term-highlight">Contact Channels</span><br><br>
                        &bull; LinkedIn: <a href="https://www.linkedin.com/in/ruxchir" target="_blank">linkedin.com/in/ruxchir</a><br>
                        &bull; GitHub: <a href="https://github.com/ruchirgupta" target="_blank">github.com/ruchirgupta</a><br>
                        &bull; Resume: <a href="RuchirGupta-SoftwareEngineer.pdf" download="RuchirGupta-SoftwareEngineer.pdf">RuchirGupta-SoftwareEngineer.pdf</a><br>
                    `);
                },
                'exit': () => {
                    this.appendOutput('<span class="text-secondary">Closing terminal session...</span>');
                    setTimeout(() => this.close(), 250);
                }
            };
        }
    }

    new MacosTerminalModal();


    /* ==========================================================================
       5. CAPABILITIES FILTERING ENGINE
       ========================================================================== */
    const filterPills = document.querySelectorAll('.filter-pill');
    const skillTiles = document.querySelectorAll('.skill-tile');

    filterPills.forEach(pill => {
        pill.addEventListener('click', () => {
            hapticAudio.playTap(600);
            filterPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            const filter = pill.getAttribute('data-filter');

            skillTiles.forEach(tile => {
                const category = tile.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    tile.classList.remove('hidden');
                    tile.style.opacity = '0';
                    tile.style.transform = 'translateY(6px)';
                    setTimeout(() => {
                        tile.style.opacity = '1';
                        tile.style.transform = 'translateY(0)';
                    }, 30);
                } else {
                    tile.classList.add('hidden');
                }
            });
        });
    });


    /* ==========================================================================
       6. NAVBAR SCROLL & ACTIVE SECTION OBSERVER
       ========================================================================== */
    const navbar = document.getElementById('navbar');
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks = document.getElementById('nav-links');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            hapticAudio.playTap(550);
        });

        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
            });
        });
    }

    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset + 140;
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop;
            const sectionId = current.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add('active');
                } else {
                    navLink.classList.remove('active');
                }
            }
        });
    }, { passive: true });

});
