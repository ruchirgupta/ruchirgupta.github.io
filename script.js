document.addEventListener('DOMContentLoaded', () => {
    const terminal = document.getElementById('terminal');
    const output = document.getElementById('output');
    const input = document.getElementById('command-input');
    // Focus input when clicking anywhere in terminal
    terminal.addEventListener('click', () => {
        input.focus();
    });

    // Ensure input is always focused when the user types
    document.addEventListener('keydown', (e) => {
        // Don't interfere if they are using modifier keys (copy/paste)
        if (!e.ctrlKey && !e.metaKey && !e.altKey) {
            input.focus();
        }
    });

    // Keep terminal scrolled to bottom
    const scrollToBottom = () => {
        terminal.scrollTop = terminal.scrollHeight;
    };

    // Command History
    let history = [];
    let historyIndex = -1;

    // Handle Enter and Arrow keys
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = input.value.trim();
            if (command) {
                history.push(command);
                historyIndex = history.length;
                processCommand(command);
            } else {
                appendPromptOnly();
            }
            input.value = '';
            scrollToBottom();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                input.value = history[historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex < history.length - 1) {
                historyIndex++;
                input.value = history[historyIndex];
            } else {
                historyIndex = history.length;
                input.value = '';
            }
        }
    });

    // Formatting helpers
    const promptStr = `<span class="prompt"><span class="user">ruchir@portfolio</span>:<span class="path">~</span>$</span>`;

    function appendPromptOnly() {
        const div = document.createElement('div');
        div.className = 'block';
        div.innerHTML = promptStr;
        output.appendChild(div);
    }

    function appendCommand(cmd) {
        const div = document.createElement('div');
        div.className = 'block';
        div.innerHTML = `${promptStr} <span class="highlight">${cmd}</span>`;
        output.appendChild(div);
    }

    function appendOutput(htmlContent) {
        const div = document.createElement('div');
        div.className = 'block';
        div.innerHTML = htmlContent;
        output.appendChild(div);
    }

    // Command Processing
    function processCommand(rawCmd) {
        appendCommand(rawCmd);

        // simple parsing: lowercased, remove extra spaces
        const cmd = rawCmd.toLowerCase().trim();

        if (commands[cmd]) {
            commands[cmd]();
        } else if (cmd === 'clear') {
            output.innerHTML = '';
        } else if (cmd === 'sudo') {
            appendOutput('<span class="error">ruchir is not in the sudoers file. This incident will be reported.</span>');
        } else {
            appendOutput(`bash: ${rawCmd}: command not found. Type <span class="highlight">'help'</span> to see available commands.`);
        }
    }

    // Define Commands
    const commands = {
        'help': () => {
            appendOutput(`
                <br>
                Available commands:<br>
                <span class="highlight">whoami</span>     - Display information about me<br>
                <span class="highlight">experience</span> - Check my work history (6 YOE)<br>
                <span class="highlight">skills</span>     - View my tech stack<br>
                <span class="highlight">resume</span>     - Download my resume (PDF)<br>
                <span class="highlight">contact</span>    - How to reach me<br>
                <span class="highlight">clear</span>      - Clear terminal output<br>
                <span class="highlight">exit</span>       - Close the current tab<br>
                <br>
            `);
        },
        'whoami': () => {
            appendOutput(`
                <br>
                <span class="highlight">Name:</span> Ruchir Gupta<br>
                <span class="highlight">Role:</span> Senior Software Engineer<br>
                <span class="highlight">Experience:</span> 5+ Years<br><br>
                Hello! I am a software engineer passionate about building scalable, robust backend systems alongside beautiful terminal interfaces. <br>
                I thrive in environments that challenge me to solve complex problems and deliver high-quality performant code.<br>
                <span class="blue">LinkedIn:</span> <a href="https://www.linkedin.com/in/ruxchir">Click Here</a><br>
                <span class="blue">GitHub:</span> <a href="https://github.com/ruchirgupta">Click Here</a><br>
                <br>
            `);
        },
        'about': () => {
            commands['whoami'](); // alias
        },
        'experience': () => {
            appendOutput(`
                <br>
                <span class="highlight">### WORK HISTORY ###</span><br><br>
                <span class="highlight">[12/2024 - Present] Senior Software Engineer - Backend Developer @ Accenture</span><br>
                <ul>
                    <li>Worked on designing and implementing scalable backend systems and AI-driven automation solutions using Node.js, Express, MS SQL, OpenAI, Azure OpenAI, APIs, and scheduling tools. Focused on improving support efficiency, real-time operations, and automated reporting.</li>
                    <li><span class="highlight">Automated Chat Auditing:</span> Built an auditing system for customer support chats using Node.js, OpenAI API, Bing Spell Check API, and MS SQL, reducing manual QA efforts by ~70%.</li>
                    <li><span class="highlight">Break Management Portal:</span> Designed backend services for a real-time agent break scheduling portal with Node.js, Express APIs, WebSockets, MS SQL, and cron jobs, reducing scheduling conflicts by 40% and ensuring scalability for 500+ concurrent users.</li>
                    <li><span class="highlight">AI Rapid Response System:</span> Developed an AI-powered ticket resolution engine using Node.js, Azure OpenAI, and MS SQL, reducing first-response time by 60% and auto-resolving ~35% of repetitive support tickets.</li>
                    <li><span class="highlight">Voice Bot:</span> Developed a voice-enabled Microsoft Teams bot using Node.js and Azure OpenAI Services to automate internal IT support workflows.</li>
                </ul><br>
                <span class="highlight">[08/2022 - 12/2024] Software Engineer - Full Stack Developer @ EV Software Solutions Pvt Ltd</span><br>
                <ul>
                    <li>Increased code implementation efficiency by 55% using key React JS strategies for the development team of 25.</li>
                    <li>Led the development of a large scale, customer-facing web application that saw a 45% increase in user engagement, using React JS and Redux.</li>
                    <li>Improved UI performance by 60% by identifying bottlenecks, leveraging technologies like Context API and React Hooks.</li>
                    <li>Achieved a reduction of up to 40% in loading time by optimizing components and effectively using React life cycle methods.</li>
                    <li>Integrated responsive design principles, reducing device-specific bugs by 35%.</li>
                    <li>Utilized error logging technologies such as Data Dog and Sentry.</li>
                    <li>Implemented role management system on both frontend and backend platforms for comprehensive user role and permission management.</li>
                    <li>Initiated end-to-end testing, improving detection of upfront bugs by 40%.</li>
                </ul><br>
                <span class="highlight">[09/2020 - 08/2022] CS Executive @ iEnergizer Services Pvt Ltd</span><br>
                <ul>
                    <li>Moderated and supported online players by responding to gameplay inquiries, resolving technical issues, and ensuring fair play.</li>
                    <li>Handled conflict resolution by addressing player disputes and enforcing community guidelines.</li>
                    <li>Assisted players with onboarding and troubleshooting, creating clear support documentation.</li>
                    <li>Collaborated with the development team to design and implement engaging quest lines, storylines, and in-game dialogue.</li>
                    <li>Contributed to graphics-related tasks such as asset integration, UI improvements, and visual consistency.</li>
                    <li>Provided continuous feedback to developers based on player interactions, resulting in improved balancing and feature enhancements.</li>
                </ul><br>
            `);
        },
        'skills': () => {
            appendOutput(`
                <br>
                <span class="highlight">### TECH STACK ###</span><br><br>
                <span class="blue">[Frontend]</span><br>
                HTML5, CSS3, JavaScript (ES6+), React.js, Redux, Next.js, Tailwind CSS, TypeScript<br><br>
                <span class="blue">[Backend]</span><br>
                Node.js, Express.js, SQL/PostgreSQL, RESTful APIs, Microservices<br><br>
                <span class="blue">[DevOps & Tools]</span><br>
                Git/GitHub, Docker, AWS, CI/CD, Bash/Zsh, Azure<br>
                <br>
            `);
        },
        'contact': () => {
            appendOutput(`
                <br>
                <span class="highlight">### CONTACT INFO ###</span><br><br>
                My inbox is always open. Whether you have a question or just want to say hi:<br>
                <span class="blue">LinkedIn:</span> <a href="https://www.linkedin.com/in/ruxchir">Click Here</a><br>
                <span class="blue">GitHub:</span> <a href="https://github.com/ruchirgupta">Click Here</a><br>
                <br>
            `);
        },
        'resume': () => {
            appendOutput(`
                <br>
                <span class="highlight">Downloading resume...</span><br>
                Opening "Ruchir Gupta - Software Engineer - Resume.pdf"<br>
                <br>
            `);
            // Trigger the download programmatically
            const link = document.createElement('a');
            link.href = 'Ruchir Gupta - Software Engineer - Resume.pdf';
            link.download = 'Ruchir Gupta - Software Engineer - Resume.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
        'exit': () => {
            appendOutput(`
                <br>
                <span class="highlight">Terminating session...</span><br>
                Connection closed.<br>
                <br>
            `);
            setTimeout(() => {
                // Browsers often block window.close() unless opened by script, so we handle that case.
                try {
                    window.close();
                } catch (e) { }

                // If the window is still open after a moment, display a message.
                setTimeout(() => {
                    if (!document.hidden) {
                        appendOutput('<span class="warning">Your browser prevented auto-closing the tab. Please close it manually (Ctrl+W or Cmd+W).</span><br><br>');
                        scrollToBottom();
                    }
                }, 200);
            }, 800);
        }
    };

    // Initial Boot Sequence
    const bootText = [
        "Initializing RuchirOS v1.0...",
        "Loading kernel modules...",
        "[OK] Mounted file systems.",
        "[OK] Started Network Manager.",
        "Loading GUI... <span class='error'>FAILED (X11 not found)</span>",
        "Falling back to terminal interface.",
        "<br>",
        "Welcome to the interactive portfolio of Ruchir Gupta.",
        "Type <span class=\"highlight\">'help'</span> to see available commands.",
        "<br>"
    ];

    let bootDelay = 0;
    bootText.forEach((line, index) => {
        setTimeout(() => {
            const div = document.createElement('div');
            div.className = 'block';
            div.innerHTML = line;
            output.appendChild(div);
            scrollToBottom();

            // Focus input after boot finishes
            if (index === bootText.length - 1) {
                input.focus();
            }
        }, bootDelay);
        bootDelay += Math.random() * 200 + 100; // random delay between 100-300ms per line
    });

});
