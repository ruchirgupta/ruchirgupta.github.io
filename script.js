/**
 * RUCHIR GUPTA - LINUX WORKSTATION & CYBER TERMINAL ENGINE
 * 
 * 1. Web Audio Mechanical Switch Synthesizer (Authentic Terminal Audio)
 * 2. 3D Linux Cyber Tesseract & Matrix Particle Engine (Three.js)
 * 3. Polybar Live Telemetry Ticker (Uptime, Clock, CPU Load)
 * 4. Linux Terminal Window CLI Emulator
 * 5. Capabilities Matrix Filter
 * 6. Responsive Polybar Navigation
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. WEB AUDIO API - MECHANICAL TERMINAL CLICK SYNTHESIZER
       ========================================================================== */
    class TerminalAudioEngine {
        constructor() {
            this.ctx = null;
            this.enabled = false;
            this.init();
        }

        init() {
            const savedPref = localStorage.getItem('rg_linux_sound');
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
            localStorage.setItem('rg_linux_sound', this.enabled ? 'true' : 'false');
            this.updateUi();
            if (this.enabled) {
                this.playClick(800);
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

        playClick(freq = 600) {
            if (!this.enabled) return;
            try {
                this.ensureContext();
                if (!this.ctx) return;

                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'triangle';

                osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.025);

                gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.025);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start();
                osc.stop(this.ctx.currentTime + 0.025);
            } catch (e) { }
        }

        playKey() {
            this.playClick(420 + Math.random() * 80);
        }
    }

    const termAudio = new TerminalAudioEngine();

    const soundToggleBtn = document.getElementById('sound-toggle');
    if (soundToggleBtn) {
        soundToggleBtn.addEventListener('click', () => termAudio.toggle());
    }

    document.querySelectorAll('[data-sound="hover"]').forEach(el => {
        el.addEventListener('mouseenter', () => termAudio.playClick(900));
    });
    document.querySelectorAll('[data-sound="tap"]').forEach(el => {
        el.addEventListener('click', () => termAudio.playClick(650));
    });


    /* ==========================================================================
       2. THREE.JS 3D LINUX CYBER TESSERACT & MATRIX PARTICLE FIELD
       ========================================================================== */
    class LinuxCyberMatrix3D {
        constructor() {
            this.canvas = document.getElementById('webgl-canvas');
            if (!this.canvas || typeof THREE === 'undefined') {
                console.warn('Three.js or Canvas not available');
                return;
            }

            this.init();
        }

        init() {
            // Scene Setup
            this.scene = new THREE.Scene();
            this.scene.fog = new THREE.FogExp2(0x050508, 0.025);

            this.camera = new THREE.PerspectiveCamera(54, window.innerWidth / window.innerHeight, 0.1, 1000);
            this.camera.position.z = 18;

            this.renderer = new THREE.WebGLRenderer({
                canvas: this.canvas,
                alpha: true,
                antialias: true
            });
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

            // Lighting
            this.createLighting();

            // 3D Linux Cyber Wireframe Geometry
            this.createCyberTesseract();

            // Matrix Data Particle Stream
            this.createMatrixParticles();

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

            this.bindEvents();
            this.animate();
        }

        createLighting() {
            const ambient = new THREE.AmbientLight(0xffffff, 0.6);
            this.scene.add(ambient);

            // Phosphor Green Key Light
            this.keyGreen = new THREE.DirectionalLight(0x00ff66, 2.0);
            this.keyGreen.position.set(12, 14, 10);
            this.scene.add(this.keyGreen);

            // Electric Cyan Rim Light
            this.rimCyan = new THREE.PointLight(0x00f0ff, 2.5, 45);
            this.rimCyan.position.set(-14, -8, 8);
            this.scene.add(this.rimCyan);
        }

        createCyberTesseract() {
            this.coreGroup = new THREE.Group();

            // Outer Wireframe Tesseract Cage (Dodecahedron)
            const outerGeo = new THREE.DodecahedronGeometry(3.6, 0);
            const outerMat = new THREE.MeshBasicMaterial({
                color: 0x00ff66,
                wireframe: true,
                transparent: true,
                opacity: 0.75
            });
            this.outerCage = new THREE.Mesh(outerGeo, outerMat);
            this.coreGroup.add(this.outerCage);

            // Inner Wireframe Icosahedron (Cyan)
            const innerGeo = new THREE.IcosahedronGeometry(2.4, 0);
            const innerMat = new THREE.MeshBasicMaterial({
                color: 0x00f0ff,
                wireframe: true,
                transparent: true,
                opacity: 0.65
            });
            this.innerCage = new THREE.Mesh(innerGeo, innerMat);
            this.coreGroup.add(this.innerCage);

            // Concentric Coordinate Gyro Rings
            const ringGeo1 = new THREE.TorusGeometry(4.8, 0.03, 16, 80);
            const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x00ff66, transparent: true, opacity: 0.35 });
            this.ring1 = new THREE.Mesh(ringGeo1, ringMat1);
            this.coreGroup.add(this.ring1);

            const ringGeo2 = new THREE.TorusGeometry(5.2, 0.025, 16, 80);
            const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.3 });
            this.ring2 = new THREE.Mesh(ringGeo2, ringMat2);
            this.ring2.rotation.x = Math.PI / 3;
            this.coreGroup.add(this.ring2);

            // Pulsing Matrix Core Node
            const coreGeo = new THREE.SphereGeometry(0.9, 24, 24);
            const coreMat = new THREE.MeshBasicMaterial({
                color: 0x00ff66,
                transparent: true,
                opacity: 0.4
            });
            this.centerNode = new THREE.Mesh(coreGeo, coreMat);
            this.coreGroup.add(this.centerNode);

            this.updateResponsivePosition();
            this.scene.add(this.coreGroup);
        }

        createMatrixParticles() {
            const count = 1200;
            const geometry = new THREE.BufferGeometry();
            const positions = new Float32Array(count * 3);
            const colors = new Float32Array(count * 3);

            const green = new THREE.Color(0x00ff66);
            const cyan = new THREE.Color(0x00f0ff);
            const amber = new THREE.Color(0xffb454);

            for (let i = 0; i < count; i++) {
                positions[i * 3] = (Math.random() - 0.5) * 80;
                positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
                positions[i * 3 + 2] = (Math.random() - 0.5) * 60;

                const choice = Math.random();
                const col = choice < 0.6 ? green : (choice < 0.9 ? cyan : amber);
                colors[i * 3] = col.r;
                colors[i * 3 + 1] = col.g;
                colors[i * 3 + 2] = col.b;
            }

            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

            const material = new THREE.PointsMaterial({
                size: 0.08,
                vertexColors: true,
                transparent: true,
                opacity: 0.5
            });

            this.matrixParticles = new THREE.Points(geometry, material);
            this.scene.add(this.matrixParticles);
        }

        updateResponsivePosition() {
            if (!this.coreGroup) return;

            if (window.innerWidth > 1024) {
                this.coreGroup.position.set(6.8, 0.2, 0);
                this.coreGroup.scale.set(1, 1, 1);
            } else if (window.innerWidth > 768) {
                this.coreGroup.position.set(0, 1.2, 0);
                this.coreGroup.scale.set(0.85, 0.85, 0.85);
            } else {
                this.coreGroup.position.set(0, 1.0, 0);
                this.coreGroup.scale.set(0.72, 0.72, 0.72);
            }
        }

        bindEvents() {
            window.addEventListener('resize', () => {
                this.camera.aspect = window.innerWidth / window.innerHeight;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(window.innerWidth, window.innerHeight);
                this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
                this.updateResponsivePosition();
            });

            window.addEventListener('mousemove', (e) => {
                this.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
                this.mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
            });

            window.addEventListener('scroll', () => {
                const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
                this.scrollProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
            }, { passive: true });

            // Interactive 3D Dragging
            const container = document.getElementById('webgl-container');
            if (container) {
                const onPointerDown = (e) => {
                    if (e.pointerType === 'touch' && window.innerWidth <= 768) return;
                    this.isDragging = true;
                    this.prevMouse = { x: e.clientX, y: e.clientY };
                    this.dragVelocity = { x: 0, y: 0 };
                };

                const onPointerMove = (e) => {
                    if (!this.isDragging) return;
                    const deltaX = e.clientX - this.prevMouse.x;
                    const deltaY = e.clientY - this.prevMouse.y;

                    this.dragVelocity = { x: deltaX * 0.005, y: deltaY * 0.005 };
                    this.coreGroup.rotation.y += this.dragVelocity.x;
                    this.coreGroup.rotation.x += this.dragVelocity.y;

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

            const elapsed = this.clock.getElapsedTime();

            // Rotations
            if (this.outerCage) {
                this.outerCage.rotation.x += 0.004;
                this.outerCage.rotation.y += 0.006;
            }

            if (this.innerCage) {
                this.innerCage.rotation.x -= 0.005;
                this.innerCage.rotation.y -= 0.004;
            }

            if (this.ring1) this.ring1.rotation.z += 0.003;
            if (this.ring2) this.ring2.rotation.y -= 0.004;

            if (this.centerNode) {
                const scale = 1 + Math.sin(elapsed * 2.5) * 0.12;
                this.centerNode.scale.set(scale, scale, scale);
            }

            if (this.matrixParticles) {
                this.matrixParticles.rotation.y = elapsed * 0.008;
            }

            // Inertial decay
            if (!this.isDragging) {
                this.dragVelocity.x *= 0.94;
                this.dragVelocity.y *= 0.94;
                this.coreGroup.rotation.y += this.dragVelocity.x;
                this.coreGroup.rotation.x += this.dragVelocity.y;
            }

            // Parallax
            const targetCamZ = 18 - this.scrollProgress * 5;
            const targetCamY = -this.scrollProgress * 6;
            this.camera.position.z += (targetCamZ - this.camera.position.z) * 0.05;
            this.camera.position.y += (targetCamY - this.camera.position.y) * 0.05;

            this.targetRotX = this.mouseY * 0.16;
            this.targetRotY = this.mouseX * 0.22;
            this.scene.rotation.x += (this.targetRotX - this.scene.rotation.x) * 0.04;
            this.scene.rotation.y += (this.targetRotY - this.scene.rotation.y) * 0.04;

            this.renderer.render(this.scene, this.camera);
        }
    }

    new LinuxCyberMatrix3D();


    /* ==========================================================================
       3. POLYBAR LIVE TELEMETRY TICKER (UPTIME, CLOCK, LOAD)
       ========================================================================== */
    function initPolybarTelemetry() {
        const timeEl = document.getElementById('poly-clock');
        const cpuEl = document.getElementById('poly-cpu');

        function updateClock() {
            if (timeEl) {
                const now = new Date();
                const h = String(now.getHours()).padStart(2, '0');
                const m = String(now.getMinutes()).padStart(2, '0');
                const s = String(now.getSeconds()).padStart(2, '0');
                timeEl.textContent = `${h}:${m}:${s}`;
            }
        }

        function updateCpu() {
            if (cpuEl) {
                const cpu = (1.2 + Math.random() * 2.2).toFixed(1);
                cpuEl.textContent = `CPU: ${cpu}%`;
            }
        }

        setInterval(updateClock, 1000);
        setInterval(updateCpu, 3500);
        updateClock();
        updateCpu();
    }

    initPolybarTelemetry();


    /* ==========================================================================
       4. LINUX TERMINAL WINDOW CLI EMULATOR
       ========================================================================== */
    class LinuxTerminalModal {
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
                    termAudio.playKey();
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
                    termAudio.playClick(720);
                    const cmd = btn.getAttribute('data-cmd');
                    if (cmd) {
                        this.execute(cmd);
                        if (this.input && window.innerWidth > 768) this.input.focus();
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
            termAudio.playClick(650);
            setTimeout(() => {
                if (this.input && window.innerWidth > 768) this.input.focus();
                this.scrollToBottom();
            }, 100);
        }

        close() {
            this.modal.classList.remove('open');
            termAudio.playClick(450);
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
                    <span class="text-green">Linux ruchir-workstation 6.8.0-enterprise #1 SMP PREEMPT_DYNAMIC x86_64</span><br>
                    Type <span class="term-accent">'help'</span> or <span class="term-accent">'neofetch'</span> to display system diagnostics.<br>
                </div>
            `;
        }

        appendCommandPrompt(cmd) {
            const block = document.createElement('div');
            block.className = 'term-block';
            block.innerHTML = `
                <div class="term-prompt-line">
                    <span class="text-green">ruchir@arch-server</span>:<span class="text-amber">~</span>$ <span class="text-white">${cmd}</span>
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
            } else if (cmd === 'uname' || cmd === 'uname -a') {
                this.appendOutput('Linux ruchir-enterprise 6.8.0-42-generic #42-Ubuntu SMP PREEMPT_DYNAMIC x86_64 GNU/Linux');
            } else if (cmd === 'uptime') {
                this.appendOutput('up 5 years, 142 days, 3 users, load average: 0.12, 0.08, 0.05');
            } else if (cmd === 'sudo') {
                this.appendOutput('<span class="text-secondary">[sudo] password for ruchir: **********<br>ruchir is in the sudoers file. This incident will not be reported.</span>');
            } else {
                this.appendOutput(`bash: command not found: ${rawCmd}. Type <span class="term-accent">'help'</span> for available commands.`);
            }
            this.scrollToBottom();
        }

        createCommands() {
            return {
                'help': () => {
                    this.appendOutput(`
                        <span class="term-highlight">Builtin Linux Commands:</span><br>
                        &bull; <span class="term-accent">neofetch</span>   - Print system telemetry &amp; architecture summary<br>
                        &bull; <span class="term-accent">whoami</span>     - Engineer identity &amp; focus<br>
                        &bull; <span class="term-accent">experience</span> - Career history (Accenture, EV Software, iEnergizer)<br>
                        &bull; <span class="term-accent">projects</span>   - Production microservices &amp; AI engines<br>
                        &bull; <span class="term-accent">skills</span>     - Capabilities matrix<br>
                        &bull; <span class="term-accent">resume</span>     - Fetch PDF curriculum vitae<br>
                        &bull; <span class="term-accent">contact</span>    - Communication sockets (LinkedIn, GitHub)<br>
                        &bull; <span class="term-accent">clear</span>      - Flush terminal buffer<br>
                        &bull; <span class="term-accent">exit</span>       - Exit CLI session<br>
                    `);
                },
                'neofetch': () => {
                    this.appendOutput(`
                        <span class="text-green">       /\\         ruchir@enterprise-arch</span><br>
                        <span class="text-green">      /  \\        ----------------------</span><br>
                        <span class="text-green">     /\\   \\       OS:</span> RuchirOS Linux x86_64<br>
                        <span class="text-green">    /      \\      Host:</span> Accenture High-Concurrency Node<br>
                        <span class="text-green">   /   ,,   \\     Kernel:</span> 6.8.0-distributed-sys<br>
                        <span class="text-green">  /   |  |  -\\    Uptime:</span> 5+ Years Active<br>
                        <span class="text-green"> /_-''    ''-_\\   Packages:</span> 16 (Node.js, MSSQL, React, Redis)<br>
                        <span class="text-green">                  Shell:</span> zsh 5.9 (powerlevel10k)<br>
                        <span class="text-green">                  Throughput:</span> 500+ WebSocket Connections<br>
                    `);
                },
                'whoami': () => {
                    this.appendOutput(`
                        <span class="term-highlight">Ruchir Gupta</span><br>
                        <span class="text-secondary">Senior Software Engineer &bull; Backend Developer</span><br>
                        Organization: Accenture (12/2024 &mdash; Present)<br>
                        Core Focus: Distributed Systems, High-Concurrency WebSockets, MS SQL Tuning, Azure OpenAI Automation.<br>
                        Experience: 5+ Years in production enterprise software.<br>
                    `);
                },
                'experience': () => {
                    this.appendOutput(`
                        <span class="term-highlight">Production Career Log</span><br><br>
                        <span class="term-accent">[12/2024 - Present] Accenture &mdash; Senior Software Engineer</span><br>
                        &bull; Automated Chat Auditing Engine (OpenAI API + MS SQL, -70% QA overhead).<br>
                        &bull; Real-time Break Management Portal (WebSockets, 500+ live concurrent nodes).<br>
                        &bull; AI Rapid Response Resolution Engine (Azure OpenAI, -60% latency).<br>
                        &bull; Teams Voice Bot IT Assistant.<br><br>
                        <span class="term-accent">[08/2022 - 12/2024] EV Software Solutions &mdash; Full Stack Engineer</span><br>
                        &bull; Scaled React architecture for dev team of 25 engineers (+55% velocity).<br>
                        &bull; Spearheaded enterprise platform (+45% engagement lift).<br>
                        &bull; Improved UI speed by 60% with custom state lifecycle tuning.<br>
                        &bull; Integrated DataDog &amp; Sentry observability.<br>
                    `);
                },
                'projects': () => {
                    this.appendOutput(`
                        <span class="term-highlight">Deployed Systems</span><br><br>
                        1. <span class="term-accent">Chat Sentinel:</span> Automated QA audit pipeline via OpenAI API &amp; MS SQL (-70% QA overhead).<br>
                        2. <span class="term-accent">SyncShift:</span> WebSocket synchronization portal for 500+ concurrent agents.<br>
                        3. <span class="term-accent">ApexResolve:</span> Azure OpenAI tier-1 ticket resolution pipeline (-60% response time).<br>
                        4. <span class="term-accent">Teams VoiceBot:</span> Conversational voice bot for enterprise IT triage.<br>
                        5. <span class="term-accent">OmniPortal:</span> High-velocity React/Redux platform (+45% user engagement).<br>
                        6. <span class="term-accent">Cyber Tesseract 3D:</span> Hardware-accelerated Three.js WebGL matrix wireframe.<br>
                    `);
                },
                'skills': () => {
                    this.appendOutput(`
                        <span class="term-highlight">Stack Matrix</span><br><br>
                        [Backend] Node.js, Express.js, MS SQL, PostgreSQL, WebSockets, RESTful APIs.<br>
                        [AI/LLM] Azure OpenAI, OpenAI API, LLM Triage, Voice Bots, Prompt Engineering.<br>
                        [Frontend] React.js, Next.js, Redux, TypeScript, Modern CSS/HTML.<br>
                        [DevOps/Infra] Docker, Azure Cloud, Git/GitHub, CI/CD, DataDog, Sentry, Zsh/Bash.<br>
                    `);
                },
                'resume': () => {
                    this.appendOutput('<span class="text-secondary">Initiating wget RuchirGupta-SoftwareEngineer.pdf...</span>');
                    const link = document.createElement('a');
                    link.href = 'RuchirGupta-SoftwareEngineer.pdf';
                    link.download = 'RuchirGupta-SoftwareEngineer.pdf';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                },
                'contact': () => {
                    this.appendOutput(`
                        <span class="term-highlight">Socket Endpoints:</span><br>
                        &bull; LinkedIn: <a href="https://www.linkedin.com/in/ruxchir" target="_blank">linkedin.com/in/ruxchir</a><br>
                        &bull; GitHub: <a href="https://github.com/ruchirgupta" target="_blank">github.com/ruchirgupta</a><br>
                    `);
                },
                'exit': () => {
                    this.appendOutput('<span class="text-secondary">Session terminated.</span>');
                    setTimeout(() => this.close(), 200);
                }
            };
        }
    }

    new LinuxTerminalModal();


    /* ==========================================================================
       5. CAPABILITIES FILTERING ENGINE
       ========================================================================== */
    const filterPills = document.querySelectorAll('.filter-pill');
    const skillTiles = document.querySelectorAll('.skill-tile');

    filterPills.forEach(pill => {
        pill.addEventListener('click', () => {
            termAudio.playClick(600);
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
       6. POLYBAR MOBILE DRAWER & ACTIVE WORKSPACE OBSERVER
       ========================================================================== */
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks = document.getElementById('nav-links');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('open');
            mobileToggle.classList.toggle('active', isOpen);
            termAudio.playClick(550);
        });

        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                mobileToggle.classList.remove('active');
            });
        });
    }

    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset + 120;
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
