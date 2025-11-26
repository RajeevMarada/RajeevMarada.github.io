import React, { useState, useEffect, useRef } from 'react';
import {
    Menu, X, ChevronRight, ArrowRight, Github, Linkedin, Mail,
    Cpu, Zap, Activity, Layers,
    Box, Terminal, Globe, Award, FileText,
    CircuitBoard, CheckCircle2, ArrowUpRight,
    BookOpen, Camera, Music, Monitor, Coffee,
    Calendar, MapPin, MousePointer2, Smartphone, HardDrive,
    ChevronDown, ArrowUp, Code2, Cpu as Chip,
    Briefcase, GraduationCap, MessageSquare, Send, Sparkles, Loader2,
    Copy, Check
} from 'lucide-react';

/* ========================================
  ⚠️ IMPORTANT: PASTE YOUR API KEY HERE ⚠️
  ========================================
*/
const API_KEY = "AIzaSyBs0l1D7ojmZBikkNYFOQnDIhT1JZ8sZYA"; // Paste your Google Gemini API Key inside the quotes

/* --- THEME & ANIMATIONS --- */
const FontStyles = () => (
    <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Roboto:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap');
    
    html {
      scroll-behavior: smooth;
    }

    body {
      font-family: 'Roboto', sans-serif;
      background-color: #FAFAFA;
      color: #1F1F1F;
      overflow-x: hidden;
      cursor: none; 
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    
    /* Custom Cursor - Optimized for High Refresh Rate */
    #cursor-follower {
      position: fixed;
      top: 0;
      left: 0;
      width: 20px;
      height: 20px;
      background-color: rgba(11, 87, 208, 0.05); 
      border: 2px solid rgba(11, 87, 208, 0.5); 
      box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      transform: translate3d(-50%, -50%, 0); /* Force GPU */
      will-change: transform, width, height; /* Hint browser for optimization */
      transition: width 0.2s cubic-bezier(0.25, 1, 0.5, 1), 
                  height 0.2s cubic-bezier(0.25, 1, 0.5, 1), 
                  background-color 0.2s;
      mix-blend-mode: multiply; 
      opacity: 0; 
    }
    
    @media (prefers-color-scheme: dark) {
        #cursor-follower {
            border-color: rgba(255, 255, 255, 0.5);
            mix-blend-mode: exclusion;
        }
    }
    
    body:hover #cursor-follower { opacity: 1; }
    body:hover #cursor-follower.hidden-cursor { opacity: 0; }

    /* Interactive State */
    a:hover ~ #cursor-follower, 
    button:hover ~ #cursor-follower, 
    .click-scale:hover ~ #cursor-follower, 
    .interactive-tag:hover ~ #cursor-follower {
      width: 50px;
      height: 50px;
      background-color: rgba(11, 87, 208, 0.1);
      border-color: transparent;
    }

    h1, h2, h3, h4, h5, .brand-font {
      font-family: 'Plus Jakarta Sans', sans-serif;
    }

    .mono-font {
      font-family: 'JetBrains+Mono', monospace;
    }

    /* Custom Scrollbar */
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #E0E2EC; border-radius: 10px; }
    ::-webkit-scrollbar-thumb:hover { background: #C4C7C5; }

    /* Staggered Reveal Animations */
    .reveal-up {
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 0.8s cubic-bezier(0.2, 0.0, 0.2, 1), transform 0.8s cubic-bezier(0.2, 0.0, 0.2, 1);
      will-change: opacity, transform; 
    }
    .reveal-up.active {
      opacity: 1;
      transform: translateY(0);
    }
    
    .stagger-1 { transition-delay: 100ms; }
    .stagger-2 { transition-delay: 200ms; }
    .stagger-3 { transition-delay: 300ms; }
    .stagger-4 { transition-delay: 400ms; }

    /* Floating Animations */
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }
    .animate-float {
      animation: float 6s ease-in-out infinite;
      will-change: transform;
    }

    @keyframes float-delayed {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-8px); }
    }
    .animate-float-delayed {
      animation: float-delayed 7s ease-in-out infinite;
      will-change: transform;
      animation-delay: 2s;
    }
    
    @keyframes pulse-glow {
      0%, 100% { box-shadow: 0 0 0 0px rgba(11, 87, 208, 0.2); }
      50% { box-shadow: 0 0 0 10px rgba(11, 87, 208, 0); }
    }
    .animate-pulse-soft {
      animation: pulse-glow 3s infinite;
    }

    /* IMPROVED HIGHLIGHTER */
    .imp-text {
      position: relative;
      font-weight: 700; 
      color: #1F1F1F;
      cursor: default;
      display: inline-block;
      z-index: 1;
      transition: color 0.2s ease;
    }
    
    .imp-text::after {
      content: '';
      position: absolute;
      width: 0%; 
      height: 3px;
      bottom: 1px;
      left: 0;
      background-color: #0B57D0; 
      opacity: 0.6;
      transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: -1;
    }
    
    .imp-text:hover::after {
      width: 100%; 
    }

    /* Cards */
    .tech-card, .story-card {
        background: white;
        border-radius: 24px;
        padding: 2rem;
        border: 1px solid #E0E2EC;
        height: 100%;
        transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.4s cubic-bezier(0.25, 1, 0.5, 1);
        position: relative;
        overflow: hidden;
    }
    .tech-card:hover, .story-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 30px -10px rgba(0,0,0,0.08);
        border-color: #0B57D0;
    }
    .tech-card.flavor-blue { border-top: 4px solid #0B57D0; }
    .tech-card.flavor-orange { border-top: 4px solid #FBBC04; }
    .tech-card.flavor-green { border-top: 4px solid #34A853; }


    /* DOCK - RE-ENGINEERED FOR PERFORMANCE */
    .dock-container {
        pointer-events: auto;
        display: flex;
        align-items: center;
        gap: 8px;
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(224, 226, 236, 0.8);
        border-radius: 9999px;
        padding: 6px;
        box-shadow: 0 10px 30px -10px rgba(0,0,0,0.1);
        transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1);
        will-change: transform;
    }
    .dock-container:hover {
        box-shadow: 0 20px 40px -12px rgba(0,0,0,0.15);
        transform: translateY(-2px);
    }

    .dock-item {
      height: 44px;
      border-radius: 9999px;
      display: flex;
      align-items: center;
      color: #444746;
      background: transparent;
      padding: 0 12px; 
      position: relative;
      cursor: pointer;
      /* Max-width transition is smoother than auto width */
      max-width: 44px; 
      transition: max-width 0.5s cubic-bezier(0.25, 1, 0.5, 1),
                  background-color 0.3s ease, 
                  color 0.3s ease;
      overflow: hidden;
      white-space: nowrap;
    }
    
    .dock-item:hover {
      max-width: 160px; 
      background-color: #F2F6FC;
      color: #1F1F1F;
    }
    
    .dock-active {
      background-color: #1F1F1F !important;
      color: white !important;
      max-width: 160px; 
    }

    .dock-active .dock-icon { color: white !important; }
    
    .dock-text {
        opacity: 0;
        margin-left: 10px;
        font-weight: 500;
        font-size: 0.875rem;
        transition: opacity 0.2s ease 0.1s; /* Delay text fade in */
    }
    
    /* Show text only when expanded */
    .dock-item:hover .dock-text,
    .dock-active .dock-text {
        opacity: 1;
    }

    /* Mobile Dock Overrides */
    @media (max-width: 640px) {
        .dock-item { padding: 0; justify-content: center; width: 44px; }
        .dock-item:hover { max-width: 44px; background: transparent; }
        .dock-active { width: 44px; max-width: 44px; padding: 0; justify-content: center; }
        .dock-text { display: none !important; }
    }


    /* Interactive Cards */
    .hover-card {
      transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.4s cubic-bezier(0.25, 1, 0.5, 1);
    }
    .hover-card:hover {
      transform: translateY(-6px) scale(1.01);
      box-shadow: 0 20px 40px -10px rgba(0,0,0,0.08);
      z-index: 10;
    }
    
    .click-scale:active {
      transform: scale(0.96);
      transition: transform 0.1s;
    }

    /* Circuit Background */
    .circuit-bg {
        background-image: radial-gradient(#E0E2EC 1px, transparent 1px);
        background-size: 32px 32px;
        mask-image: linear-gradient(to bottom, black 20%, transparent 90%);
    }
    
    /* Hero Heading Hover */
    .hero-heading {
        background-size: 200% auto;
        background-image: linear-gradient(to right, #1F1F1F 0%, #0B57D0 50%, #1F1F1F 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        transition: background-position 0.5s ease;
    }
    .hero-heading:hover {
        background-position: right center;
    }

  `}</style>
);

/* --- HOOKS --- */
const useScrollObserver = (loading) => {
    useEffect(() => {
        if (loading) return;
        const timer = setTimeout(() => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
            document.querySelectorAll('.reveal-up').forEach(el => observer.observe(el));
            return () => observer.disconnect();
        }, 100);
        return () => clearTimeout(timer);
    }, [loading]);
};

const useActiveSection = () => {
    const [activeSection, setActiveSection] = useState('hero');
    const [showTop, setShowTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Optimized active section logic
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;

            const sections = ['story', 'arsenal', 'journey', 'work', 'patents', 'contact'];
            let current = 'hero';

            for (const section of sections) {
                const element = document.getElementById(section);
                // Trigger slightly earlier for better feel
                if (element && scrollY >= (element.offsetTop - windowHeight * 0.4)) {
                    current = section;
                }
            }
            setActiveSection(current);

            // Show Top Button Logic
            const heroHeight = document.getElementById('hero')?.offsetHeight || 500;
            setShowTop(scrollY > heroHeight);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return { activeSection, showTop };
};

/* --- COMPONENTS --- */

const CustomCursor = () => {
    const cursorRef = useRef(null);
    useEffect(() => {
        const isTouch = typeof window !== 'undefined' && (('ontouchstart' in window) || (navigator.maxTouchPoints > 0));
        if (isTouch) return;

        let requestRef;

        const moveCursor = (e) => {
            // Use requestAnimationFrame for >60Hz smoothness
            if (requestRef) cancelAnimationFrame(requestRef);
            requestRef = requestAnimationFrame(() => {
                if (cursorRef.current) {
                    cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
                }
            });
        };

        const hideCursor = () => cursorRef.current?.classList.add('hidden-cursor');
        const showCursor = () => cursorRef.current?.classList.remove('hidden-cursor');

        window.addEventListener('mousemove', moveCursor, { passive: true });
        document.body.addEventListener('mouseleave', hideCursor);
        document.body.addEventListener('mouseenter', showCursor);

        return () => {
            if (requestRef) cancelAnimationFrame(requestRef);
            window.removeEventListener('mousemove', moveCursor);
            document.body.removeEventListener('mouseleave', hideCursor);
            document.body.removeEventListener('mouseenter', showCursor);
        };
    }, []);

    if (typeof window !== 'undefined' && (('ontouchstart' in window) || (navigator.maxTouchPoints > 0))) {
        return null;
    }

    return <div id="cursor-follower" ref={cursorRef} className="hidden lg:block"></div>;
};

const LoadingScreen = ({ onComplete, isExiting }) => {
    const [progress, setProgress] = useState(0);
    const requestRef = useRef();
    const startTimeRef = useRef();

    // High Refresh Rate Optimized Animation Loop
    const animate = (time) => {
        if (!startTimeRef.current) startTimeRef.current = time;
        const deltaTime = time - startTimeRef.current;

        // Calculate progress based on time (approx 1.2s duration)
        const newProgress = Math.min((deltaTime / 1200) * 100, 100);

        setProgress(newProgress);

        if (newProgress < 100) {
            requestRef.current = requestAnimationFrame(animate);
        } else {
            setTimeout(onComplete, 200);
        }
    };

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, [onComplete]);

    return (
        <div
            className={`fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-6 transition-opacity duration-700 ease-out ${isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
            <div className="w-full max-w-xs relative">
                <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-bold text-[#1F1F1F] tracking-widest font-mono">SYSTEM BOOT</span>
                    <span className="text-xs font-bold text-[#0B57D0] font-mono">{Math.floor(progress)}%</span>
                </div>

                <div className="h-1 w-full bg-[#F2F6FC] overflow-hidden rounded-full">
                    <div
                        className="h-full bg-[#1F1F1F] rounded-full"
                        style={{ width: `${progress}%` }}
                    // No transition here, updated via state frame-by-frame for max smoothness
                    ></div>
                </div>

                <div className="mt-2 text-[10px] text-[#444746] font-mono uppercase flex justify-between">
                    <span>{progress < 30 ? 'Loading Modules...' : progress < 70 ? 'Verifying Architecture...' : 'Ready.'}</span>
                    {progress >= 100 && <span className="text-green-600 font-bold">OK</span>}
                </div>
            </div>
        </div>
    );
};

const Navbar = ({ activeSection }) => {
    const navItems = [
        { id: 'story', icon: BookOpen, label: 'Story' },
        { id: 'arsenal', icon: Cpu, label: 'Arsenal' },
        { id: 'journey', icon: MapPin, label: 'Journey' },
        { id: 'work', icon: Layers, label: 'Work' },
        { id: 'patents', icon: Award, label: 'Patents' }
    ];

    return (
        <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
            <div className="dock-container">

                {/* Pro Monogram Logo */}
                <a href="#hero" className="w-10 h-10 rounded-full bg-[#1F1F1F] text-white flex items-center justify-center font-bold font-mono text-sm hover:bg-[#0B57D0] transition-colors shrink-0">
                    RM
                </a>

                <div className="w-[1px] h-5 bg-gray-300 mx-2"></div>

                {/* Dynamic Dock */}
                {navItems.map((item) => {
                    const isActive = activeSection === item.id;
                    return (
                        <a
                            key={item.id}
                            href={`#${item.id}`}
                            className={`dock-item ${isActive ? 'dock-active' : ''}`}
                            aria-label={item.label}
                        >
                            <item.icon size={18} className="dock-icon shrink-0" />
                            <span className="dock-text">
                                {item.label}
                            </span>
                        </a>
                    )
                })}

                <div className="w-[1px] h-5 bg-gray-300 mx-2"></div>

                <a href="mailto:rajeevmarada02@gmail.com" className="w-10 h-10 rounded-full bg-[#E0E2EC] text-[#1F1F1F] flex items-center justify-center hover:bg-[#0B57D0] hover:text-white transition-colors shrink-0">
                    <Mail size={18} />
                </a>
            </div>
        </nav>
    );
};

/* --- GEMINI INTEGRATED MODALS --- */

const TechExplainerModal = ({ term, onClose }) => {
    const [explanation, setExplanation] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExplanation = async () => {
            setLoading(true);
            const prompt = `Explain the VLSI technical term "${term}" to a non-technical person in 2 simple sentences. Then, add one sentence explaining why this skill is critical for a Silicon Architect like Rajeev. Keep it professional but accessible.`;

            try {
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${API_KEY}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }] })
                });
                const data = await response.json();
                const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Could not retrieve explanation.";
                setExplanation(text);
            } catch (e) {
                setExplanation("System offline. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        if (term) fetchExplanation();
    }, [term]);

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-[#E0E2EC] relative overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0B57D0] via-[#34A853] to-[#FBBC04]"></div>
                <button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"><X size={18} /></button>

                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-50 rounded-lg text-[#0B57D0]"><Sparkles size={20} /></div>
                    <h3 className="text-xl font-bold text-[#1F1F1F] brand-font">{term}</h3>
                </div>

                {loading ? (
                    <div className="flex items-center gap-3 text-gray-500 py-4">
                        <Loader2 size={20} className="animate-spin" />
                        <span className="text-sm">Consulting silicon archives...</span>
                    </div>
                ) : (
                    <div className="text-[#444746] leading-relaxed text-sm">
                        {explanation}
                    </div>
                )}

                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Powered by Gemini 2.0 Flash</span>
                    <button onClick={onClose} className="text-sm font-bold text-[#0B57D0] hover:underline">Close</button>
                </div>
            </div>
        </div>
    );
};

/* --- GEMINI AI CHAT COMPONENT --- */
const AIChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', text: "Hi! I'm Rajeev's AI assistant. Ask me about his projects, skills, or experience!" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const systemPrompt = `
      You are a helpful AI assistant for Rajeev Marada's portfolio website.
      Answer questions about Rajeev based on this information:
      - Name: Rajeev Marada, VLSI Engineer & SoC Architect.
      - Summary: Dedicated VLSI engineer with advanced certification from IISc Bangalore. Specializing in SoC Architecture, RISC-V, and UVM Verification.
      - Experience: 
        - Programmer Analyst at Cognizant (Aug 2024 - Present): Automated workflows on APPIAN.
        - Jr. Design Verification Eng. at Insemi (Jul 2023 - Oct 2023): UVM testbench for Dual-Port RAM, 100% coverage.
        - Intern at Maven Silicon (Dec 2022 - Jan 2023): Designed AMBA AHB-APB bridge in Verilog.
        - Intern at CoreEl Technologies (Jun 2022 - Jul 2022): SystemVerilog testbench for full adder.
      - Education:
        - PG Advanced Certification in VLSI Chip Design, IISc Bangalore (2024), 80% Score.
        - B.Tech ECE, SRM Institute (2019-2023), 9.4 CGPA.
      - Key Projects:
        - RISC-V ECG Accelerator: Heterogeneous SoC, 92% accuracy, FPGA deployed.
        - Neural Net RTL Engine: Verilog RTL 3-layer NN, 85% accuracy on Semeion.
        - APB UVM Testbench: 100% functional coverage.
        - SEC-DED-DAEC Module: Error correction, 5.67% power reduction, IEEE Published.
        - Hybrid Hack 2021: "Charge On Go" vehicle power system, Unity simulation.
      - Patent: "Autonomous Vehicle Safety System" (IN 564400), Granted March 2025.
      - Skills: SystemVerilog, UVM, RTL Design, FPGA, Xilinx Vivado, Python, C/C++, MATLAB.
      - Interests: Photography, Music, eSports, Cricket.
      
      Keep answers concise (under 3 sentences if possible) and professional but friendly. 
      If asked about something not in this list, politely say you don't have that info but suggest contacting Rajeev directly.
    `;

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [
                        { role: 'user', parts: [{ text: systemPrompt + "\n\nUser Question: " + input }] }
                    ]
                })
            });

            if (!response.ok) {
                if (response.status === 429) {
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    throw new Error("Rate limit exceeded. Please try again in a moment.");
                }
                throw new Error('API request failed');
            }

            const data = await response.json();
            const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm having trouble connecting right now. Please try again.";

            setMessages(prev => [...prev, { role: 'assistant', text: aiText }]);
        } catch (error) {
            console.error("AI Chat Error:", error);
            setMessages(prev => [...prev, { role: 'assistant', text: "Sorry, I encountered an error. Please try again later." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Trigger Button - STRICTLY SIZED AND POSITIONED */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 lg:bottom-10 lg:left-10 z-50 p-3 lg:p-4 bg-white text-[#0B57D0] rounded-full shadow-2xl hover:scale-110 transition-all duration-300 border border-[#E0E2EC] group click-scale flex items-center gap-2 w-fit max-w-[200px]"
                title="Ask AI"
            >
                {isOpen ? <X size={24} /> : <Sparkles size={24} className="animate-pulse" />}
                {!isOpen && <span className="hidden lg:block max-w-0 overflow-hidden group-hover:max-w-[100px] transition-all duration-500 whitespace-nowrap font-medium text-sm">Ask AI</span>}
            </button>

            {/* Chat Window - Fixed Width and Constraints */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 lg:bottom-28 lg:left-6 w-full max-w-[calc(100vw-3rem)] md:max-w-[400px] bg-white rounded-2xl shadow-2xl border border-[#E0E2EC] z-50 flex flex-col overflow-hidden chat-window-enter origin-bottom-right lg:origin-bottom-left max-h-[600px]">
                    {/* Header */}
                    <div className="p-4 bg-[#0B57D0] text-white flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Sparkles size={18} />
                            <span className="font-bold brand-font">Rajeev AI</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded"><X size={16} /></button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-4 overflow-y-auto bg-[#FAFAFA] space-y-3 min-h-[300px] max-h-[400px]">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === 'user'
                                    ? 'bg-[#0B57D0] text-white rounded-br-none'
                                    : 'bg-white border border-gray-200 text-[#1F1F1F] rounded-bl-none shadow-sm'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
                                    <Loader2 size={16} className="animate-spin text-[#0B57D0]" />
                                    <span className="text-xs text-gray-500">Thinking...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-3 bg-white border-t border-[#E0E2EC] flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask about my skills..."
                            className="flex-1 bg-[#F2F6FC] border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-[#0B57D0] outline-none transition-all"
                        />
                        <button
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                            className="p-2 bg-[#0B57D0] text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

const Hero = () => {
    return (
        <section id="hero" className="pt-32 pb-20 px-6 max-w-[1400px] mx-auto min-h-[90vh] flex items-center relative overflow-hidden">
            {/* Subtle Background Grid */}
            <div className="absolute inset-0 circuit-bg opacity-30 pointer-events-none"></div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full relative z-10">

                <div className="flex flex-col items-start text-left space-y-6 lg:space-y-8 reveal-up active">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E0E2EC] shadow-sm text-[#1F1F1F] text-xs font-bold tracking-wider uppercase animate-float cursor-default hover:scale-105 transition-transform">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        Available for Roles
                    </div>

                    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-[#1F1F1F] leading-[0.95] brand-font cursor-default">
                        Hardware <br />
                        <span className="hero-heading">Defined.</span>
                    </h1>

                    <p className="text-lg sm:text-xl text-[#444746] max-w-lg leading-relaxed font-light">
                        Dedicated <span className="imp-text">VLSI Engineer</span>. Bridging abstract logic and physical silicon through <span className="imp-text">SoC Architecture</span>, <span className="imp-text">RISC-V</span>, and rigorous <span className="imp-text">UVM Verification</span>.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
                        <a href="#work" className="px-8 py-4 bg-[#1F1F1F] text-white rounded-2xl font-medium text-lg hover:bg-[#333] hover:shadow-xl transition-all flex items-center justify-center gap-2 click-scale hover:-translate-y-1">
                            View Benchmarks <ArrowRight size={18} />
                        </a>
                        <a href="/assets/resume.pdf" target="_blank" className="px-8 py-4 bg-white border border-gray-200 text-[#1F1F1F] rounded-2xl font-medium text-lg hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2 click-scale hover:-translate-y-1">
                            Resume <FileText size={18} />
                        </a>
                    </div>
                </div>

                <div className="relative reveal-up active" style={{ transitionDelay: '200ms' }}>
                    <div className="absolute inset-0 bg-[#F2F6FC] rounded-[40px] -z-10 scale-105 opacity-50 animate-pulse-soft" />

                    <div className="grid grid-cols-2 gap-4 p-4">
                        <div className="bg-[#1F1F1F] text-white p-6 rounded-[32px] hover-card col-span-2 sm:col-span-1 min-h-[160px] flex flex-col justify-between relative overflow-hidden group cursor-default stagger-1">
                            <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity animate-float">
                                <Award size={64} />
                            </div>
                            <div>
                                <div className="text-[#C4EED0] text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <span className="w-1 h-1 bg-[#C4EED0] rounded-full"></span> Granted IP
                                </div>
                                <div className="text-2xl sm:text-3xl font-bold brand-font text-[#C4EED0]">IN 564400</div>
                            </div>
                            <div className="text-sm text-gray-400 mt-4 leading-tight">
                                Autonomous Vehicle Safety System with Bio-Feedback.
                            </div>
                        </div>

                        <div className="bg-white border border-gray-100 p-6 rounded-[32px] hover-card col-span-2 sm:col-span-1 min-h-[160px] flex flex-col justify-between cursor-default stagger-2">
                            <div className="w-12 h-12 bg-[#E0E2EC] rounded-full flex items-center justify-center text-[#1F1F1F] mb-4 animate-float-delayed">
                                <Calendar size={24} />
                            </div>
                            <div>
                                <div className="text-3xl sm:text-4xl font-bold text-[#1F1F1F] brand-font mb-1">2+ Yrs</div>
                                <div className="text-sm text-[#444746]">
                                    Industrial Experience<br />
                                    <span className="text-xs text-gray-400 font-medium">Cognizant • InSemi • CoreEL</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-100 p-6 rounded-[32px] hover-card col-span-2 sm:col-span-1 min-h-[160px] flex flex-col justify-between cursor-default stagger-3">
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <div className="text-xs font-bold text-[#0B57D0] uppercase bg-[#F2F6FC] px-2 py-1 rounded">IISc Bangalore</div>
                                    <BookOpen size={20} className="text-[#444746]" />
                                </div>
                                <div className="text-lg font-bold text-[#1F1F1F] leading-tight">Advanced VLSI Design</div>
                            </div>
                            <div className="mt-4">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-[#444746]">Score</span>
                                    <span className="font-bold text-[#1F1F1F]">80%</span>
                                </div>
                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#0B57D0] w-[80%] animate-[load_1.5s_ease-out_forwards]" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#C4EED0] p-6 rounded-[32px] hover-card col-span-2 sm:col-span-1 min-h-[160px] flex flex-col justify-between relative overflow-hidden cursor-default stagger-4">
                            <CircuitBoard className="absolute -bottom-4 -right-4 text-[#0D3818] opacity-10 w-32 h-32 animate-float" />
                            <div>
                                <div className="text-[#0D3818] text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <span className="w-1 h-1 bg-[#0D3818] rounded-full"></span> Portfolio
                                </div>
                                <div className="text-3xl sm:text-4xl font-bold text-[#0D3818] brand-font">5 Major</div>
                            </div>
                            <div className="text-[#0D3818] font-medium mt-2">
                                Architectures Deployed <br />
                                <span className="text-xs opacity-70 font-semibold">RTL • UVM • FPGA</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

/* --- ORIGIN STORY (Digestible Cards) --- */
const OriginStory = () => {
    const chapters = [
        {
            icon: MousePointer2,
            title: "The Tinkerer",
            text: "It started when my PlayStation 2 died. Instead of replacing it, I tore it apart. That was the moment I realized: everything is built by someone, and everything can be fixed.",
            accent: "text-[#1F1F1F]",
            bg: "bg-[#fffbf0]",
            keyTerms: ["PlayStation 2", "tore it apart"]
        },
        {
            icon: Smartphone,
            title: "The Optimizer",
            text: "Curiosity grew into optimization. I rooted my Samsung Galaxy Tab 2 to install custom ROMs, squeezing every drop of performance out of limited hardware.",
            accent: "text-[#0B57D0]",
            bg: "bg-[#eef5ff]",
            keyTerms: ["Samsung Galaxy Tab 2", "Custom ROMs"]
        },
        {
            icon: HardDrive,
            title: "The Builder",
            text: "Finally, I built my first PC from scratch. Researching thermals, voltages, and component compatibility laid the foundation for my career in hardware architecture.",
            accent: "text-[#0D3818]",
            bg: "bg-[#f0fdf4]",
            keyTerms: ["built my first PC", "hardware architecture"]
        }
    ];

    return (
        <section className="py-24 bg-white" id="story">
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="text-center mb-16 reveal-up">
                    <h2 className="text-4xl md:text-5xl font-bold text-[#1F1F1F] mb-4 brand-font">The Origin Story</h2>
                    <p className="text-[#444746] text-lg">From repairing consoles to architecting silicon.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {chapters.map((chap, i) => (
                        <div key={i} className={`story-card reveal-up stagger-${i + 1} group cursor-default`}>
                            <div className={`w-14 h-14 ${chap.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                <chap.icon size={28} className={chap.accent} />
                            </div>
                            <h3 className="text-2xl font-bold text-[#1F1F1F] mb-4">{chap.title}</h3>
                            <p className="text-[#444746] leading-relaxed text-sm flex-1">
                                {chap.text.split(new RegExp(`(${chap.keyTerms.join('|')})`)).map((part, idx) =>
                                    chap.keyTerms.includes(part)
                                        ? <span key={idx} className="imp-text">{part}</span>
                                        : part
                                )}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

/* --- TECH ARSENAL (Coherent Flavors) --- */
const TechArsenal = () => {
    const [selectedTerm, setSelectedTerm] = useState(null);

    // Reusable tooltip component for tech tags
    const TechTooltip = ({ children, text = "AI Explain", className = "" }) => (
        <div className={`relative group inline-block ${className}`}>
            {children}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-[#1F1F1F] text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20 flex items-center gap-1 shadow-lg">
                <Sparkles size={10} className="text-[#FBBC04]" />
                <span>{text}</span>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-[1px] border-4 border-transparent border-t-[#1F1F1F]"></div>
            </div>
        </div>
    );

    return (
        <section className="py-24 px-6 max-w-[1400px] mx-auto" id="arsenal">
            <div className="mb-16 reveal-up">
                <h2 className="text-4xl md:text-5xl font-bold text-[#1F1F1F] mb-6 brand-font">
                    Tech Arsenal.
                </h2>
                <p className="text-xl text-[#444746] max-w-2xl">
                    My toolbox for converting requirements into silicon.
                    <span className="text-[#0B57D0] text-sm block mt-2 font-medium flex items-center gap-1">
                        <Sparkles size={14} /> Click any tech tag for an AI-powered breakdown.
                    </span>
                </p>
            </div>

            {selectedTerm && <TechExplainerModal term={selectedTerm} onClose={() => setSelectedTerm(null)} />}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-auto">

                {/* Core Domain - The Anchor */}
                <div className="md:col-span-2 bg-white border border-[#E0E2EC] rounded-[24px] p-10 relative overflow-hidden reveal-up hover-card flex flex-col justify-center min-h-[300px]">
                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 bg-[#F2F6FC] rounded-2xl flex items-center justify-center text-[#0B57D0]">
                                <Cpu size={28} />
                            </div>
                            <h3 className="text-3xl font-bold text-[#1F1F1F] brand-font">Digital Design & Verification</h3>
                        </div>
                        <p className="text-[#444746] text-lg leading-relaxed mb-8 max-w-xl">
                            Expertise in constructing robust <span className="imp-text">UVM testbenches</span>, achieving <span className="imp-text">100% coverage</span>, and synthesizing RTL for high-performance SoCs.
                        </p>

                        <div className="flex flex-wrap gap-3">
                            {['SystemVerilog', 'UVM', 'RTL Design', 'FPGA Prototyping', 'Xilinx Vivado'].map((skill) => (
                                <TechTooltip key={skill}>
                                    <button
                                        onClick={() => setSelectedTerm(skill)}
                                        className="px-4 py-2 bg-[#F2F6FC] border border-[#E0E2EC] rounded-full text-sm font-medium text-[#1F1F1F] hover:bg-[#0B57D0] hover:text-white transition-all cursor-pointer active:scale-95"
                                    >
                                        {skill}
                                    </button>
                                </TechTooltip>
                            ))}
                        </div>
                    </div>
                    <div className="absolute right-0 bottom-0 opacity-5 transition-opacity duration-500">
                        <CircuitBoard size={300} className="text-[#1F1F1F]" />
                    </div>
                </div>

                {/* Languages - Blue Flavor */}
                <div className="tech-card flavor-blue reveal-up stagger-1 flex flex-col">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-[#0B57D0]">
                            <Terminal size={20} />
                        </div>
                        <h3 className="text-xl font-bold text-[#1F1F1F]">Languages</h3>
                    </div>
                    <div className="flex flex-wrap gap-2 content-start flex-1">
                        {['SystemVerilog', 'Verilog RTL', 'Python', 'C / C++', 'MATLAB'].map((lang) => (
                            <TechTooltip key={lang}>
                                <button
                                    onClick={() => setSelectedTerm(lang)}
                                    className="px-4 py-2 rounded-xl bg-blue-50/50 text-[#0B57D0] font-medium text-sm border border-blue-100 hover:bg-blue-100 transition-all cursor-pointer active:scale-95"
                                >
                                    {lang}
                                </button>
                            </TechTooltip>
                        ))}
                    </div>
                </div>

                {/* Toolchain - Orange Flavor */}
                <div className="tech-card flavor-orange reveal-up stagger-2 flex flex-col">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-[#E37400]">
                            <Box size={20} />
                        </div>
                        <h3 className="text-xl font-bold text-[#1F1F1F]">Toolchain</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3 flex-1">
                        {['Vivado', 'ModelSim', 'Questa Sim', 'Cadence', 'LaTeX', 'HOMER Pro'].map((tool) => (
                            <TechTooltip key={tool} className="w-full h-full">
                                <button
                                    onClick={() => setSelectedTerm(tool)}
                                    className="w-full h-full p-3 rounded-xl bg-orange-50/30 border border-orange-100 text-sm font-medium text-[#444746] text-center hover:bg-orange-100 transition-all cursor-pointer active:scale-95 flex items-center justify-center"
                                >
                                    {tool}
                                </button>
                            </TechTooltip>
                        ))}
                    </div>
                </div>

                {/* Architecture - Green Flavor - FIXED HOVER */}
                <div className="md:col-span-2 tech-card flavor-green reveal-up stagger-3 flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-[#34A853]">
                                <Layers size={20} />
                            </div>
                            <h3 className="text-2xl font-bold text-[#1F1F1F]">System Architecture</h3>
                        </div>
                        <p className="text-[#444746] mb-6">
                            Designing heterogeneous SoCs with custom accelerators.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            {['RISC-V Core', 'Low Power', 'AMBA AXI/APB', 'Neuromorphic'].map((item) => (
                                <TechTooltip key={item}>
                                    <button
                                        onClick={() => setSelectedTerm(item)}
                                        className="flex items-center gap-2 bg-green-50/50 border border-green-100 px-4 py-2 rounded-lg text-[#1F7A43] font-bold text-sm cursor-pointer hover:bg-green-100 transition-all active:scale-95"
                                    >
                                        <CheckCircle2 size={14} /> {item}
                                    </button>
                                </TechTooltip>
                            ))}
                        </div>
                    </div>
                    <div className="w-full md:w-1/3 aspect-video bg-[#F2F6FC] rounded-xl border border-[#E0E2EC] flex items-center justify-center relative overflow-hidden">
                        <div className="font-mono text-xs text-[#444746] p-4 opacity-70">
                            module soc_top (<br />
                            &nbsp;&nbsp;input clk,<br />
                            &nbsp;&nbsp;input rst_n<br />
                            );<br />
                    // ...
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

/* --- JOURNEY (Bento Circuit Grid) --- */
const Journey = () => {
    // Bento-style Circuit Grid with clear Chronology
    const experiences = [
        {
            role: "Programmer Analyst",
            company: "Cognizant Technology Solutions",
            duration: "Aug 2024 - Present",
            desc: "Automated business workflows using APPIAN low-code.",
            color: "border-l-[#0B57D0]",
            bg: "bg-blue-50/30"
        },
        {
            role: "Jr. Design Verification Eng.",
            company: "Insemi Technology Services",
            duration: "Jul 2023 - Oct 2023",
            desc: "UVM testbench for Dual-Port RAM, 100% coverage.",
            color: "border-l-[#34A853]",
            bg: "bg-green-50/30"
        },
        {
            role: "Intern",
            company: "Maven Silicon",
            duration: "Dec 2022 - Jan 2023",
            desc: "Designed AMBA AHB-APB bridge in Verilog.",
            color: "border-l-[#FBBC04]",
            bg: "bg-yellow-50/30"
        },
        {
            role: "Intern",
            company: "CoreEl Technologies",
            duration: "Jun 2022 - Jul 2022",
            desc: "SystemVerilog testbench for full adder DUT.",
            color: "border-l-[#EA4335]",
            bg: "bg-red-50/30"
        }
    ];

    const education = [
        {
            degree: "PG Advanced Cert. in VLSI",
            school: "IISc Bangalore",
            year: "2024",
            score: "80% Score",
            icon: GraduationCap,
            color: "text-[#0D3818]"
        },
        {
            degree: "B.Tech, Electronics & Comm.",
            school: "SRM Institute",
            year: "2019 - 2023",
            score: "9.4 CGPA",
            icon: BookOpen,
            color: "text-[#1F1F1F]"
        }
    ];

    return (
        <section className="py-24 bg-white" id="journey">
            <div className="max-w-[1200px] mx-auto px-6">
                <div className="text-center mb-16 reveal-up">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 brand-font text-[#1F1F1F]">The Circuit Path</h2>
                    <p className="text-[#444746]">Chronicles of execution and learning.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

                    {/* Left Column: EXPERIENCE BUS */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-6 reveal-up">
                            <div className="p-2 bg-blue-50 rounded-lg text-[#0B57D0]"><Briefcase size={24} /></div>
                            <h3 className="text-2xl font-bold text-[#1F1F1F]">Experience Bus</h3>
                        </div>

                        <div className="relative border-l-2 border-dashed border-gray-200 ml-4 pl-8 space-y-8">
                            {experiences.map((exp, i) => (
                                <div key={i} className={`relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 hover-card border-l-4 ${exp.color} reveal-up stagger-${i + 1}`}>
                                    {/* Circuit Node */}
                                    <div className="absolute -left-[41px] top-6 w-5 h-5 bg-white border-4 border-gray-300 rounded-full"></div>

                                    <div className="flex flex-col sm:flex-row justify-between items-start mb-2 gap-2">
                                        <div>
                                            <h4 className="font-bold text-lg text-[#1F1F1F]">{exp.role}</h4>
                                            <div className="text-sm font-semibold text-gray-500">{exp.company}</div>
                                        </div>
                                        <span className="text-xs font-bold uppercase tracking-wider bg-gray-100 px-2 py-1 rounded text-gray-600 whitespace-nowrap">{exp.duration}</span>
                                    </div>
                                    <p className="text-sm text-[#444746] leading-relaxed mt-2">{exp.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: EDUCATION CORE */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-6 reveal-up" style={{ transitionDelay: '200ms' }}>
                            <div className="p-2 bg-green-50 rounded-lg text-[#34A853]"><GraduationCap size={24} /></div>
                            <h3 className="text-2xl font-bold text-[#1F1F1F]">Education Core</h3>
                        </div>

                        <div className="grid gap-6">
                            {education.map((edu, i) => (
                                <div key={i} className="bg-white rounded-[24px] p-8 border border-[#E0E2EC] hover:border-[#34A853] hover:shadow-lg transition-all hover:-translate-y-1 hover-card reveal-up stagger-1 group">
                                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center ${edu.color} group-hover:scale-110 transition-transform`}>
                                                <edu.icon size={24} />
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-bold text-[#1F1F1F]">{edu.degree}</h4>
                                                <div className="text-[#444746] font-medium">{edu.school}</div>
                                            </div>
                                        </div>
                                        <span className="text-xl font-bold text-[#1F1F1F] opacity-20 group-hover:opacity-100 transition-opacity font-mono">{edu.year}</span>
                                    </div>
                                    <div className="mt-6 flex items-center gap-2">
                                        <div className="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-[#34A853] w-[90%]"></div>
                                        </div>
                                        <span className="text-sm font-bold text-[#34A853]">{edu.score}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

/* --- PROJECTS --- */
const Projects = () => {
    const [activeProject, setActiveProject] = useState(null);
    const toggleProject = (index) => setActiveProject(activeProject === index ? null : index);

    const projects = [
        {
            title: "RISC-V ECG Accelerator",
            category: "Heterogeneous SoC Design",
            img: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1035&auto=format&fit=crop",
            desc: "Engineered a heterogeneous SoC integrating a RISC-V processor and a custom neural network via AXI Stream.",
            deepContext: "Engineered a heterogeneous SoC integrating a RISC-V processor and a custom neural network via the AXI Stream protocol. The system achieved 92% accuracy in real-time ECG classification using Q1.15 fixed-point arithmetic optimization. Validated the complete design through simulation and deployment on FPGA hardware, demonstrating robust real-time performance.",
            keyOutcomes: ["Q1.15 Fixed-Point", "92% Accuracy", "Real-time"],
            tech: ["RISC-V", "AXI Stream", "FPGA"]
        },
        {
            title: "Neural Net RTL Engine",
            category: "Hardware Inference",
            img: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=1035&auto=format&fit=crop",
            desc: "Designed a Verilog RTL 3-layer neural network inference engine with ROM-based weights and FIFO input.",
            deepContext: "Designed and implemented a Verilog RTL 3-layer neural network inference engine with custom ROM-based weights and FIFO input. Achieved over 85% accuracy on the Semeion dataset through efficient fixed-point hardware conversion. Performed full simulation, synthesis, and implementation in Xilinx Vivado.",
            keyOutcomes: ["85% Accuracy", "Timing Closure", "Semeion Dataset"],
            tech: ["Verilog RTL", "Vivado", "Neural Networks"]
        },
        {
            title: "APB UVM Testbench",
            category: "Advanced Verification",
            img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1035&auto=format&fit=crop",
            desc: "Architected a modular UVM testbench with reusable master/slave agents to rigorously validate APB protocol.",
            deepContext: "Architected a modular UVM testbench, developing reusable master/slave agents and environment components to rigorously validate APB protocol compliance. Achieved 100% functional and code coverage and confirmed design robustness through complete assertion coverage.",
            keyOutcomes: ["100% Coverage", "Reusable Agents", "Protocol Check"],
            tech: ["UVM", "SystemVerilog", "Coverage"]
        },
        {
            title: "SEC-DED-DAEC Module",
            category: "Data Integrity",
            img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1067&auto=format&fit=crop",
            desc: "Led development of a novel SEC-DED-DAEC error-correcting module, optimizing reversible logic.",
            deepContext: "Led development of a novel SEC-DED-DAEC error-correcting module and integrated it into an AHB-APB bridge to ensure data integrity for system-on-chip pathways. Optimized the reversible logic implementation to achieve a 5.67% reduction in power consumption.",
            keyOutcomes: ["5.67% Power Reduction", "4.52% Delay Imp.", "IEEE"],
            tech: ["Error Correction", "Low-Power"]
        },
        {
            title: "Hybrid Hack 2021 Finalist",
            category: "Cross-Domain Innovation",
            img: "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1458",
            desc: "Co-developed 'Charge On Go,' a novel vehicle-mounted hybrid power system. Simulated electrical performance.",
            deepContext: "Co-developed a novel vehicle-mounted hybrid power system to generate electricity during transit. Simulated the system's electrical performance using Python and HOMER Pro, projecting an annual energy generation of 465.15 kWh per unit. Built an interactive 3D simulation in Unity.",
            keyOutcomes: ["465.15 kWh/yr", "3D Simulation", "Investor Demo"],
            tech: ["Python", "HOMER Pro", "Unity"]
        }
    ];

    return (
        <section className="py-24 px-6 max-w-[1400px] mx-auto" id="work">
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#1F1F1F] mb-16 brand-font reveal-up tracking-tight">ARCHIVES</h2>

            <div className="space-y-16">
                {projects.map((project, idx) => (
                    <div
                        key={idx}
                        className={`flex flex-col md:flex-row gap-12 items-center reveal-up ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                    >
                        <div className="w-full md:w-1/2 aspect-[4/3] rounded-[32px] overflow-hidden shadow-xl relative group hover-card cursor-pointer" onClick={() => toggleProject(idx)}>
                            <img
                                src={project.img}
                                alt={project.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                            <div className="absolute bottom-4 right-4 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <ArrowUpRight size={24} className="text-[#1F1F1F]" />
                            </div>
                        </div>

                        <div className="w-full md:w-1/2">
                            <div className="text-[#0B57D0] font-bold text-sm tracking-widest uppercase mb-3">{project.category}</div>
                            {/* FIXED FONT WEIGHT AND TRACKING FOR TITLES */}
                            <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#1F1F1F] mb-6 brand-font leading-tight">{project.title}</h3>

                            <p className="text-lg text-[#444746] leading-relaxed mb-6">
                                {project.desc.split(new RegExp(`(${project.keyOutcomes.join('|')})`)).map((part, i) =>
                                    project.keyOutcomes.some(k => part.includes(k.split(' ')[0])) // Heuristic match
                                        ? <span key={i} className="imp-text">{part}</span>
                                        : part
                                )}
                            </p>

                            {/* HOVERABLE TAGS */}
                            <div className="flex flex-wrap gap-2 mb-8">
                                {project.tech.map(t => (
                                    <span key={t} className="interactive-tag px-3 py-1 bg-[#F2F6FC] border border-[#E0E2EC] text-[#1F1F1F] text-sm font-medium rounded-lg hover:bg-[#0B57D0] hover:text-white transition-all cursor-default">
                                        {t}
                                    </span>
                                ))}
                            </div>

                            <button
                                onClick={() => toggleProject(idx)}
                                className="group flex items-center gap-2 text-[#1F1F1F] font-bold text-lg border-b-2 border-[#E0E2EC] hover:border-[#0B57D0] transition-all pb-1 click-scale"
                            >
                                {activeProject === idx ? 'Close Analysis' : 'View Tech Specs'}
                                <ChevronDown size={20} className={`transition-transform duration-300 ${activeProject === idx ? 'rotate-180' : ''}`} />
                            </button>

                            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${activeProject === idx ? 'max-h-[500px] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
                                <div className="p-8 bg-[#F8FAFC] rounded-[24px] border border-gray-100 shadow-inner border-l-4 border-l-[#0B57D0]">
                                    <h4 className="text-xs font-bold text-[#444746] uppercase tracking-wider mb-3">Key Outcomes</h4>
                                    {/* HOVERABLE TAGS IN EXPANDED VIEW */}
                                    <div className="flex flex-wrap gap-3 mb-4">
                                        {project.keyOutcomes.map(tag => (
                                            <span key={tag} className="interactive-tag px-3 py-1.5 bg-blue-50 text-[#0B57D0] text-sm font-bold rounded-lg border border-blue-100 hover:bg-[#0B57D0] hover:text-white transition-all cursor-default">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-[#444746] text-base leading-relaxed">
                                        {project.deepContext}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

/* --- WHITEPAPERS & IP (Slate/Navy Theme) --- */
const TheVault = () => {
    return (
        <section className="py-24 px-6 max-w-[1400px] mx-auto" id="patents">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1F1F1F] mb-16 brand-font text-center reveal-up">Intellectual Property</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">

                {/* Patent Card - Navy Blue Enterprise Look - FIXED HOVER */}
                <div className="bg-[#1e293b] text-white p-10 rounded-[40px] shadow-2xl relative overflow-hidden group hover:transform hover:scale-[1.02] transition-all duration-500 reveal-up border border-[#334155] hover-card">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#3b82f6]/10 to-transparent pointer-events-none"></div>

                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-8">
                            <div className="p-4 bg-[#334155] rounded-2xl border border-[#475569]">
                                <Award size={40} className="text-[#60a5fa] animate-pulse-soft" />
                            </div>
                            <div className="px-4 py-1.5 bg-[#60a5fa] text-[#0f172a] text-xs font-bold uppercase rounded-full tracking-wider flex items-center gap-2">
                                <CheckCircle2 size={12} /> Granted Patent
                            </div>
                        </div>

                        <h3 className="text-3xl font-bold mb-4 brand-font leading-tight text-white">Autonomous Vehicle Safety System</h3>
                        <div className="font-mono text-3xl sm:text-4xl text-[#60a5fa] mb-6 font-bold tracking-tight">IN 564400</div>

                        <p className="text-slate-300 text-lg leading-relaxed mb-8 border-l-4 border-[#60a5fa] pl-6">
                            Dual-processor architecture monitoring vital signs to trigger autonomous takeover.
                        </p>

                        <div className="flex justify-between items-end">
                            <div className="text-sm text-slate-400 font-bold uppercase tracking-widest">March 2025</div>
                            <div className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors cursor-pointer">
                                <ArrowUpRight size={24} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Papers Stack */}
                <div className="space-y-6 reveal-up" style={{ transitionDelay: '100ms' }}>
                    <div className="bg-white p-8 rounded-[32px] border border-[#E0E2EC] hover:border-[#0B57D0] transition-colors shadow-sm group cursor-pointer hover:shadow-xl hover:-translate-y-2 duration-300 relative overflow-hidden hover-card">
                        <div className="absolute right-0 top-0 w-24 h-24 bg-blue-50 rounded-bl-[100px] -z-0 transition-transform group-hover:scale-150"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="px-3 py-1 bg-blue-100 text-[#0B57D0] text-[10px] font-bold uppercase rounded-full tracking-wider">IEEE Published</span>
                            </div>
                            <h4 className="text-2xl font-bold text-[#1F1F1F] mb-3 group-hover:text-[#0B57D0] transition-colors">Error Correction in SoC</h4>
                            <p className="text-sm text-[#444746] mb-4">Reversible logic-based error detection and correction.</p>
                            <div className="flex items-center gap-2 text-lg font-mono text-[#0B57D0] font-bold">
                                <FileText size={20} /> RAEEUCCI 2023
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[32px] border border-[#E0E2EC] hover:border-[#34A853] transition-colors shadow-sm group cursor-pointer hover:shadow-xl hover:-translate-y-2 duration-300 relative overflow-hidden hover-card">
                        <div className="absolute right-0 top-0 w-24 h-24 bg-green-50 rounded-bl-[100px] -z-0 transition-transform group-hover:scale-150"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="px-3 py-1 bg-green-100 text-[#1F7A43] text-[10px] font-bold uppercase rounded-full tracking-wider">International Journal</span>
                            </div>
                            <h4 className="text-2xl font-bold text-[#1F1F1F] mb-3 group-hover:text-[#1F7A43] transition-colors">IoT Healthcare Systems</h4>
                            <p className="text-sm text-[#444746] mb-4">Comprehensive survey on affordable IoT architecture.</p>
                            <div className="flex items-center gap-2 text-lg font-mono text-[#1F7A43] font-bold">
                                <FileText size={20} /> GIJET 2022
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

/* --- IDLE CYCLES (Clean Hover) --- */
const IdleCycles = () => {
    return (
        <section className="py-24 bg-[#FAFAFA]" id="lifestyle">
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="flex items-center gap-4 mb-12 reveal-up">
                    <Coffee className="text-[#1F1F1F] w-8 h-8 animate-float" />
                    <h2 className="text-3xl font-bold text-[#1F1F1F] brand-font">Idle Cycles</h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 reveal-up stagger-1">
                    {[
                        { title: 'Photography', sub: 'Chasing shots', icon: Camera, color: 'text-[#EA4335]' },
                        { title: 'Music', sub: 'Curating playlists', icon: Music, color: 'text-[#FBBC04]' },
                        { title: 'eSports', sub: 'Competitive analysis', icon: Monitor, color: 'text-[#0B57D0]' },
                        { title: 'Cricket', sub: 'On-field strategy', icon: Activity, color: 'text-[#34A853]' }
                    ].map((item, i) => (
                        <div key={i} className="aspect-[4/3] bg-white rounded-[32px] flex flex-col items-center justify-center p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-default group hover:scale-105 hover-card">
                            <item.icon size={32} className={`${item.color} mb-4 transition-transform group-hover:scale-110`} />
                            <span className="font-bold text-[#1F1F1F] text-lg">{item.title}</span>
                            <span className="text-sm text-[#444746] mt-1">{item.sub}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

/* --- CONTACT --- */
const Contact = ({ showTop }) => {
    const [emailIntent, setEmailIntent] = useState("");
    const [generatedEmail, setGeneratedEmail] = useState("");
    const [isDrafting, setIsDrafting] = useState(false);
    const apiKey = "AIzaSyBs0l1D7ojmZBikkNYFOQnDIhT1JZ8sZYA"; // API Key handled by environment

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    const handleDraftEmail = async () => {
        if (!emailIntent.trim()) return;
        setIsDrafting(true);

        const prompt = `Write a professional, short, and effective email from a recruiter/collaborator to Rajeev Marada (VLSI Engineer). 
        The sender's intent is: "${emailIntent}".
        Mention Rajeev's skills in SystemVerilog, UVM, or RISC-V if relevant to the intent.
        Keep it under 100 words. No subject line, just the body.`;

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }] })
            });
            const data = await response.json();
            setGeneratedEmail(data.candidates?.[0]?.content?.parts?.[0]?.text || "Could not generate draft.");
        } catch (e) {
            setGeneratedEmail("Error generating draft.");
        } finally {
            setIsDrafting(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedEmail);
        alert("Draft copied to clipboard!");
    };

    return (
        <footer className="bg-white py-20 border-t border-gray-100 relative" id="contact">
            <div className="max-w-[1000px] mx-auto px-6 text-center reveal-up">
                <div className="w-20 h-20 bg-[#F2F6FC] rounded-3xl flex items-center justify-center mx-auto mb-8 text-[#0B57D0] animate-float shadow-sm">
                    <Mail size={40} />
                </div>

                <h2 className="text-4xl md:text-5xl font-bold text-[#1F1F1F] mb-6 brand-font">Let's build next-gen silicon.</h2>
                <p className="text-xl text-[#444746] max-w-xl mx-auto mb-10">
                    Open to collaborations on VLSI research, hardware innovation, and next-gen computing challenges.
                </p>

                {/* Helper Line */}
                <div className="flex flex-col items-center justify-center gap-2 mb-6">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#0B57D0] text-[10px] font-bold uppercase tracking-wider">
                        <Sparkles size={10} /> Smart Assist
                    </span>
                    <p className="text-sm text-[#444746] max-w-md">
                        Looking to connect? Type your intent below, and AI will draft a professional message for you.
                    </p>
                </div>

                {/* --- GEMINI POWERED EMAIL DRAFTER --- */}
                <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-2xl p-1 mb-12 shadow-sm hover:shadow-md transition-shadow">
                    {!generatedEmail ? (
                        <div className="flex gap-2 p-2">
                            <input
                                type="text"
                                value={emailIntent}
                                onChange={(e) => setEmailIntent(e.target.value)}
                                placeholder="e.g., 'We have a Senior DV role at Intel'"
                                className="flex-1 bg-transparent border-none outline-none text-sm px-2"
                            />
                            <button
                                onClick={handleDraftEmail}
                                disabled={isDrafting || !emailIntent}
                                className="bg-[#1F1F1F] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-[#0B57D0] transition-colors disabled:opacity-50"
                            >
                                {isDrafting ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                                Draft Email
                            </button>
                        </div>
                    ) : (
                        <div className="text-left p-4 bg-[#F8FAFC] rounded-xl">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-[#0B57D0] uppercase tracking-wider flex items-center gap-1"><Sparkles size={10} /> AI Draft</span>
                                <button onClick={() => setGeneratedEmail("")} className="text-gray-400 hover:text-gray-600"><X size={14} /></button>
                            </div>
                            <p className="text-sm text-gray-600 mb-4 whitespace-pre-wrap italic leading-relaxed">"{generatedEmail}"</p>
                            <button
                                onClick={copyToClipboard}
                                className="w-full py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-[#1F1F1F] hover:bg-gray-50 flex items-center justify-center gap-2"
                            >
                                <Copy size={12} /> Copy to Clipboard
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                    <a href="mailto:rajeevmarada02@gmail.com" className="px-8 py-4 bg-[#1F1F1F] text-white rounded-full font-bold text-lg hover:bg-[#0B57D0] transition-colors shadow-lg shadow-blue-900/10 w-full sm:w-auto click-scale">
                        rajeevmarada02@gmail.com
                    </a>
                    <div className="flex gap-4">
                        <a href="https://linkedin.com/in/rajeevmarada" className="w-14 h-14 flex items-center justify-center rounded-full border border-gray-200 text-[#444746] hover:bg-[#0077B5] hover:text-white hover:border-[#0077B5] transition-all click-scale">
                            <Linkedin size={24} />
                        </a>
                        <a href="https://github.com/RajeevMarada" className="w-14 h-14 flex items-center justify-center rounded-full border border-gray-200 text-[#444746] hover:bg-[#1F1F1F] hover:text-white hover:border-[#1F1F1F] transition-all click-scale">
                            <Github size={24} />
                        </a>
                    </div>
                </div>

                <div className="text-sm text-[#444746] flex flex-col md:flex-row items-center justify-center gap-6">
                    <span>© 2025 Rajeev Marada</span>
                    <span className="hidden md:inline text-gray-300">•</span>
                    <span className="flex items-center gap-2">
                        <MapPin size={14} /> Bangalore, India
                    </span>
                </div>
            </div>

            {/* Persistent Back to Top Button */}
            <button
                onClick={scrollToTop}
                className={`fixed bottom-10 right-10 p-4 bg-[#1F1F1F] text-white rounded-full shadow-2xl hover:bg-[#0B57D0] hover:scale-110 transition-all duration-300 z-40 ${showTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
                title="Back to Top"
                aria-label="Back to Top"
            >
                <ArrowUp size={20} />
            </button>
        </footer>
    )
}

const App = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);

    useScrollObserver(isLoading);
    const { activeSection, showTop } = useActiveSection();

    return (
        <div className="min-h-screen bg-white selection:bg-[#D2E3FC] selection:text-[#174EA6]">
            <FontStyles />

            {/* Loading Screen - Renders ON TOP, then fades out */}
            {isLoading && (
                <LoadingScreen
                    isExiting={isLoaded}
                    onComplete={() => {
                        setIsLoaded(true);
                        // Wait for fade out animation (700ms) before unmounting
                        setTimeout(() => setIsLoading(false), 700);
                    }}
                />
            )}

            {/* Main Content - Renders underneath immediately */}
            <div className={`transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                <CustomCursor />
                <Navbar activeSection={activeSection} />
                <main className="relative z-10">
                    <Hero />
                    <OriginStory />
                    <TechArsenal />
                    <Journey />
                    <Projects />
                    <TheVault />
                    <IdleCycles />
                </main>
                <AIChat />
                <Contact showTop={showTop} />
            </div>
        </div>
    );
};

export default App;