import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
    Menu, X, ChevronRight, ArrowRight, Github, Linkedin, Mail,
    Cpu, Zap, Activity, Layers, Box, Terminal, Globe, Award,
    FileText, CircuitBoard, CheckCircle2, ArrowUpRight, BookOpen,
    Camera, Music, Monitor, Coffee, Calendar, MapPin, MousePointer2,
    Smartphone, HardDrive, ChevronDown, ArrowUp, Code2, Cpu as Chip,
    Briefcase, GraduationCap, MessageSquare, Send, Loader2,
    Copy, Check, HelpCircle, ExternalLink, ChevronUp,
    Sun, Moon, Search, Command
} from 'lucide-react';

/* --- THEME & ANIMATIONS --- */
const FontStyles = () => (
    <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Roboto:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap');
    
    html { scroll-behavior: smooth; }

    :root {
        --bg-main: #FAFAFA;
        --bg-card: #FFFFFF;
        --bg-card-hover: #F2F6FC;
        --text-main: #1F1F1F;
        --text-secondary: #444746;
        --border-color: #E0E2EC;
        --accent: #0B57D0;
        --accent-rgb: 11, 87, 208;
        --shadow-color: rgba(0, 0, 0, 0.08);
        --scrollbar-track: #F2F6FC;
        --scrollbar-thumb: #444746;
    }

    body.dark {
        --bg-main: #050505;
        --bg-card: #121212;
        --bg-card-hover: #18181b;
        --text-main: #E5E5E5;
        --text-secondary: #A1A1AA;
        --border-color: #27272a;
        --accent: #3b82f6;
        --accent-rgb: 59, 130, 246;
        --shadow-color: rgba(0, 0, 0, 0.5);
        --scrollbar-track: #0a0a0a;
        --scrollbar-thumb: #3f3f46;
    }

    /* --- PERFORMANCE OPTIMIZED TRANSITIONS --- */
    body, .bg-card, .hover-card, .dock-container, .dock-item, .interactive-tag, button, a {
        transition-property: background-color, border-color, color, fill, stroke, box-shadow;
        transition-duration: 0.3s;
        transition-timing-function: ease-out;
    }

    body {
        font-family: 'Roboto', sans-serif;
        overflow-x: hidden;
        cursor: none; 
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        background-color: var(--bg-main);
        color: var(--text-main);
    }

    /* Utility Classes using Vars */
    .bg-main { background-color: var(--bg-main); }
    .bg-card { background-color: var(--bg-card); }
    .text-main { color: var(--text-main); }
    .text-sec { color: var(--text-secondary); }
    .border-std { border-color: var(--border-color); }

    /* ACCESSIBILITY: Focus Styles */
    :focus-visible {
        outline: 2px solid var(--accent);
        outline-offset: 4px;
        border-radius: 4px;
    }
    
    /* ACCESSIBILITY: Reduced Motion */
    @media (prefers-reduced-motion: reduce) {
        *, ::before, ::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
        }
        .reveal-up { opacity: 1 !important; transform: none !important; }
    }

    /* PRINT STYLES */
    @media print {
        nav, #cursor-follower, .dock-container, button { display: none !important; }
        body { background: white; color: black; cursor: auto; }
        a { text-decoration: underline; color: black; }
        .text-sec { color: #444; }
        .circuit-bg { display: none; }
    }
    
    /* --- CUSTOM CURSOR --- */
    #cursor-follower {
        position: fixed;
        top: 0; left: 0;
        width: 20px; height: 20px;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transform: translate3d(-50%, -50%, 0);
        will-change: transform; 
        transition: width 0.3s cubic-bezier(0.2, 0, 0.2, 1), 
                    height 0.3s cubic-bezier(0.2, 0, 0.2, 1), 
                    background-color 0.4s, border-color 0.4s;
        opacity: 0; 
    }

    body.light #cursor-follower { background-color: rgba(11, 87, 208, 0.05); border: 2px solid rgba(11, 87, 208, 0.5); }
    body.dark #cursor-follower { background-color: rgba(96, 165, 250, 0.1); border: 2px solid rgba(96, 165, 250, 0.5); box-shadow: 0 0 15px rgba(96, 165, 250, 0.2); }
    body:hover #cursor-follower { opacity: 1; }
    body:hover #cursor-follower.hidden-cursor { opacity: 0; }

    a:hover ~ #cursor-follower, button:hover ~ #cursor-follower, 
    .click-scale:hover ~ #cursor-follower, .interactive-tag:hover ~ #cursor-follower,
    .cursor-active ~ #cursor-follower {
        width: 50px; height: 50px;
        border-color: transparent;
        background-color: rgba(var(--accent-rgb), 0.15);
    }

    h1, h2, h3, h4, h5, .brand-font { font-family: 'Plus Jakarta Sans', sans-serif; }
    .mono-font { font-family: 'JetBrains+Mono', monospace; }

    /* SCROLLBAR */
    @media (min-width: 768px) {
        ::-webkit-scrollbar { width: 12px; }
        ::-webkit-scrollbar-track { background: var(--scrollbar-track); border-left: 1px solid var(--border-color); }
        ::-webkit-scrollbar-thumb { background: var(--scrollbar-thumb); border-radius: 7px; border: 3px solid var(--scrollbar-track); }
        ::-webkit-scrollbar-thumb:hover { background: var(--accent); }
    }
    @media (max-width: 767px) { ::-webkit-scrollbar { width: 0px; background: transparent; } }

    /* CUSTOM COMPONENT SCROLLBAR (Patents etc) */
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(156, 163, 175, 0.5); border-radius: 10px; }
    body.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(75, 85, 99, 0.8); }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: var(--accent); }

    /* ANIMATIONS */
    .reveal-up { opacity: 0; transform: translateY(30px); transition: opacity 0.8s cubic-bezier(0.2, 0.0, 0.2, 1), transform 0.8s cubic-bezier(0.2, 0.0, 0.2, 1); will-change: opacity, transform; }
    .reveal-up.active { opacity: 1; transform: translateY(0); }
    .stagger-1 { transition-delay: 100ms; }
    .stagger-2 { transition-delay: 200ms; }
    .stagger-3 { transition-delay: 300ms; }
    .stagger-4 { transition-delay: 400ms; }

    @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
    .animate-float { animation: float 6s ease-in-out infinite; will-change: transform; }
    @keyframes float-delayed { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
    .animate-float-delayed { animation: float-delayed 7s ease-in-out infinite; will-change: transform; animation-delay: 2s; }
    @keyframes pulse-glow { 0%, 100% { box-shadow: 0 0 0 0px rgba(var(--accent-rgb), 0.2); } 50% { box-shadow: 0 0 0 10px rgba(var(--accent-rgb), 0); } }
    .animate-pulse-soft { animation: pulse-glow 3s infinite; }

    /* HIGHLIGHTER */
    .imp-text { position: relative; font-weight: 700; cursor: default; display: inline-block; z-index: 1; color: var(--text-main); transition: color 0.2s ease; }
    .imp-text::after { content: ''; position: absolute; width: 0%; height: 3px; bottom: 1px; left: 0; background-color: var(--accent); opacity: 0.6; transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1); z-index: -1; }
    .imp-text:hover::after { width: 100%; }

    .imp-text-dark { position: relative; font-weight: 700; color: #FFFFFF; cursor: default; display: inline-block; z-index: 1; transition: color 0.2s ease; }
    .imp-text-dark::after { content: ''; position: absolute; width: 0%; height: 3px; bottom: 1px; left: 0; background-color: #60a5fa; opacity: 0.6; transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1); z-index: -1; }
    .imp-text-dark:hover::after { width: 100%; }

    /* DOCK */
    .dock-container { pointer-events: auto; display: flex; align-items: center; gap: 8px; backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-radius: 9999px; padding: 6px; will-change: transform; }
    body.light .dock-container { background: rgba(255, 255, 255, 0.9); border: 1px solid #CBD5E1; box-shadow: 0 10px 30px -10px rgba(0,0,0,0.1); }
    body.dark .dock-container { background: rgba(20, 20, 20, 0.85); border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5); }
    .dock-container:hover { transform: translateY(-2px); }

    .dock-item { height: 44px; border-radius: 9999px; display: flex; align-items: center; background: transparent; padding: 0 12px; position: relative; cursor: pointer; max-width: 44px; transition: max-width 0.5s cubic-bezier(0.25, 1, 0.5, 1), background-color 0.4s ease, color 0.4s ease; overflow: hidden; white-space: nowrap; color: var(--text-secondary); }
    .dock-item:hover { max-width: 160px; background-color: var(--bg-card-hover); color: var(--text-main); }
    .dock-active { background-color: var(--text-main) !important; color: var(--bg-main) !important; max-width: 160px; }
    .dock-text { opacity: 0; margin-left: 10px; font-weight: 600; font-size: 0.875rem; transition: opacity 0.2s ease 0.1s; }
    .dock-item:hover .dock-text, .dock-active .dock-text { opacity: 1; }

    .hover-card { transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.4s cubic-bezier(0.25, 1, 0.5, 1), background-color 0.3s ease, border-color 0.3s ease; }
    .hover-card:hover { transform: translateY(-6px) scale(1.01); box-shadow: 0 20px 40px -10px var(--shadow-color); z-index: 10; }
    .click-scale:active { transform: scale(0.96); transition: transform 0.1s; }

    .circuit-bg { transition: background-image 0.4s ease; }
    body.light .circuit-bg { background-image: radial-gradient(#CBD5E1 1px, transparent 1px); background-size: 32px 32px; mask-image: linear-gradient(to bottom, black 20%, transparent 90%); }
    body.dark .circuit-bg { background-image: radial-gradient(#3f3f46 1px, transparent 1px); background-size: 32px 32px; mask-image: linear-gradient(to bottom, black 20%, transparent 90%); }

    .hero-heading { background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; transition: background-image 0.4s ease; }
    body.light .hero-heading { background-image: linear-gradient(to right, #1F1F1F 0%, #0B57D0 50%, #1F1F1F 100%); }
    body.dark .hero-heading { background-image: linear-gradient(to right, #FFFFFF 0%, #0B57D0 50%, #FFFFFF 100%); }

    @media (max-width: 640px) {
        .dock-container { gap: 2px; padding: 6px; width: 92vw; max-width: 400px; justify-content: space-evenly; }
        .dock-item { padding: 0; justify-content: center; width: 40px; height: 40px; }
        .dock-item:hover { max-width: 40px; background: transparent; }
        .dock-active { width: 40px; max-width: 40px; padding: 0; justify-content: center; }
        .dock-text { display: none !important; }
    }
    `}</style>
);

/* --- HOOKS --- */
const useScrollObserver = (loading, theme) => {
    useEffect(() => {
        if (loading) return;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

        const timeout = setTimeout(() => {
            document.querySelectorAll('.reveal-up').forEach(el => observer.observe(el));
        }, 50);

        return () => {
            clearTimeout(timeout);
            observer.disconnect();
        };
    }, [loading, theme]);
};

const useActiveSection = () => {
    const [activeSection, setActiveSection] = useState('hero');
    const [showTop, setShowTop] = useState(false);

    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    const windowHeight = window.innerHeight;
                    const sections = ['story', 'arsenal', 'journey', 'work', 'patents', 'contact'];
                    let current = 'hero';
                    for (const section of sections) {
                        const element = document.getElementById(section);
                        if (element && scrollY >= (element.offsetTop - windowHeight * 0.4)) {
                            current = section;
                        }
                    }
                    setActiveSection(current);
                    const heroHeight = document.getElementById('hero')?.offsetHeight || 500;
                    setShowTop(scrollY > heroHeight);
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    return { activeSection, showTop };
};

const useScrollProgress = () => {
    const [progress, setProgress] = useState(0);
    useEffect(() => {
        const updateProgress = () => {
            const scrollY = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            setProgress(Math.min(100, Math.max(0, (scrollY / docHeight) * 100)));
        };
        window.addEventListener('scroll', updateProgress, { passive: true });
        return () => window.removeEventListener('scroll', updateProgress);
    }, []);
    return progress;
};

/* --- COMPONENTS --- */

const Toast = ({ message, isVisible, onClose, theme }) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(onClose, 3000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    const isDark = theme === 'dark';

    return (
        <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full shadow-xl z-[60] flex items-center gap-3 transition-all duration-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'} ${isDark ? 'bg-[#27272a] text-white border border-gray-700' : 'bg-white text-gray-900 border border-gray-200'}`}>
            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600'}`}>
                <Check size={12} />
            </div>
            <span className="text-sm font-semibold">{message}</span>
        </div>
    );
};

const ScrollProgress = ({ progress, theme }) => {
    const isDark = theme === 'dark';
    return (
        <div className="fixed top-0 left-0 right-0 h-1 z-[60] pointer-events-none">
            <div
                className={`h-full transition-all duration-100 ease-out ${isDark ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-[#0B57D0]'}`}
                style={{ width: `${progress}%` }}
            />
        </div>
    );
};

const CustomCursor = () => {
    const cursorRef = useRef(null);
    useEffect(() => {
        const isTouch = typeof window !== 'undefined' && (('ontouchstart' in window) || (navigator.maxTouchPoints > 0));
        if (isTouch) return;

        let requestRef;
        const moveCursor = (e) => {
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

    if (typeof window !== 'undefined' && (('ontouchstart' in window) || (navigator.maxTouchPoints > 0))) return null;
    return <div id="cursor-follower" ref={cursorRef} className="hidden lg:block"></div>;
};

const LoadingScreen = ({ onComplete, isExiting, theme }) => {
    const [progress, setProgress] = useState(0);
    const requestRef = useRef();
    const startTimeRef = useRef();

    const animate = (time) => {
        if (!startTimeRef.current) startTimeRef.current = time;
        const deltaTime = time - startTimeRef.current;
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

    const isDark = theme === 'dark';

    return (
        <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 transition-opacity duration-700 ease-out ${isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'} ${isDark ? 'bg-[#050505]' : 'bg-white'}`}>
            <div className="w-full max-w-xs relative">
                <div className="flex justify-between items-end mb-2">
                    <span className={`text-xs font-bold tracking-widest font-mono ${isDark ? 'text-white' : 'text-[#1F1F1F]'}`}>SYSTEM BOOT</span>
                    <span className={`text-xs font-bold font-mono ${isDark ? 'text-blue-400' : 'text-[#0B57D0]'}`}>{Math.floor(progress)}%</span>
                </div>
                <div className={`h-1 w-full overflow-hidden rounded-full ${isDark ? 'bg-gray-800' : 'bg-[#F2F6FC]'}`}>
                    <div className={`h-full rounded-full ${isDark ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'bg-[#1F1F1F]'}`} style={{ width: `${progress}%` }}></div>
                </div>
            </div>
        </div>
    );
};

const Navbar = ({ activeSection, theme, toggleTheme }) => {
    const navItems = [
        { id: 'story', icon: BookOpen, label: 'Story' },
        { id: 'arsenal', icon: Cpu, label: 'Arsenal' },
        { id: 'journey', icon: MapPin, label: 'Journey' },
        { id: 'work', icon: Layers, label: 'Work' },
        { id: 'patents', icon: Award, label: 'Patents' }
    ];

    const [isVisible, setIsVisible] = useState(true);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY < 50) setIsVisible(true);
            else if (currentScrollY > lastScrollY.current) setIsVisible(false);
            else setIsVisible(true);
            lastScrollY.current = currentScrollY;
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isDark = theme === 'dark';

    return (
        <nav className={`fixed top-4 left-0 right-0 z-50 flex justify-center pointer-events-none px-4 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-[150%]'}`}>
            <div className="dock-container">
                <a href="#hero" className={`w-10 h-10 rounded-full flex items-center justify-center font-bold font-mono text-sm shrink-0 shadow-lg ${isDark ? 'bg-white text-black hover:bg-blue-500 hover:text-white' : 'bg-[#1F1F1F] text-white hover:bg-[#0B57D0]'}`}>RM</a>

                <div className={`w-[1px] h-5 mx-1 sm:mx-2 border-l border-std`}></div>

                {navItems.map((item) => {
                    const isActive = activeSection === item.id;
                    return (
                        <a key={item.id} href={`#${item.id}`} className={`dock-item ${isActive ? 'dock-active' : ''}`} aria-label={item.label}>
                            <item.icon size={18} className="dock-icon shrink-0" />
                            <span className="dock-text">{item.label}</span>
                        </a>
                    )
                })}

                <div className={`w-[1px] h-5 mx-1 sm:mx-2 border-l border-std`}></div>

                <button onClick={toggleTheme} className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isDark ? 'bg-[#27272a] text-white hover:bg-yellow-500 hover:text-black' : 'bg-[#E0E2EC] text-[#1F1F1F] hover:bg-[#1F1F1F] hover:text-white'}`} title="Toggle Theme">
                    {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                <a href="mailto:rajeevmarada02@gmail.com" className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ml-1 ${isDark ? 'bg-[#27272a] text-white hover:bg-blue-600' : 'bg-[#E0E2EC] text-[#1F1F1F] hover:bg-[#0B57D0] hover:text-white'}`}>
                    <Mail size={18} />
                </a>
            </div>
        </nav>
    );
};

const Hero = ({ theme }) => {
    const headingRef = useRef(null);
    const isDark = theme === 'dark';

    const handleMouseMove = (e) => {
        if (!headingRef.current) return;
        const rect = headingRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const width = rect.width;
        const percent = Math.max(0, Math.min(100, (x / width) * 100));
        headingRef.current.style.backgroundPosition = `${percent}% center`;
    };

    return (
        <section id="hero" className="pt-32 pb-20 px-6 max-w-[1400px] mx-auto min-h-[90vh] flex items-center relative overflow-hidden">
            <div className="absolute inset-0 circuit-bg opacity-30 pointer-events-none"></div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full relative z-10">

                <div className="flex flex-col items-start text-left space-y-6 lg:space-y-8 reveal-up active">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border shadow-sm text-xs font-bold tracking-wider uppercase animate-float cursor-default ${isDark ? 'bg-[#18181b] border-[#27272a] text-gray-300 hover:border-blue-500/50' : 'bg-white border-[#E0E2EC] text-[#1F1F1F]'}`}>
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        Engineer • Tinkerer • Innovator
                    </div>

                    <h1 className={`text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1] sm:leading-[0.95] brand-font cursor-default text-main`}>
                        Systems <br />
                        <span
                            ref={headingRef}
                            onMouseMove={handleMouseMove}
                            className="hero-heading"
                            style={{ backgroundPosition: '0% center' }}
                        >
                            Reimagined.
                        </span>
                    </h1>

                    <p className={`text-base sm:text-xl max-w-lg leading-relaxed font-light text-sec`}>
                        From <span className="imp-text">repairing consoles</span> to architecting <span className="imp-text">RISC-V SoCs</span>.
                        I bridge the gap between abstract logic and physical reality, combining <span className="imp-text">VLSI expertise</span> with a passion for <span className="imp-text">automation</span> and <span className="imp-text">social innovation</span>.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
                        <a href="#work" className={`px-8 py-4 rounded-2xl font-medium text-lg transition-transform duration-300 flex items-center justify-center gap-2 click-scale hover:-translate-y-1 ${isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-[#1F1F1F] text-white hover:bg-[#333] shadow-xl'}`}>
                            View Projects <ArrowRight size={18} />
                        </a>
                        <a href="https://rajeevmarada.github.io/assets/resume.pdf" target="_blank" rel="noopener noreferrer" className={`px-8 py-4 bg-transparent border rounded-2xl font-medium text-lg transition-transform duration-300 flex items-center justify-center gap-2 click-scale hover:-translate-y-1 border-std text-main hover:bg-card-hover`}>
                            Resume <FileText size={18} />
                        </a>
                    </div>
                </div>

                <div className="relative reveal-up active" style={{ transitionDelay: '200ms' }}>
                    <div className={`absolute inset-0 rounded-[40px] -z-10 scale-105 animate-pulse-soft ${isDark ? 'bg-blue-900/20 blur-3xl' : 'bg-[#F2F6FC] opacity-50'}`} />

                    <div className="grid grid-cols-2 gap-4 p-4">
                        {/* KPI 1: Patent */}
                        <div className={`p-6 rounded-[32px] hover-card col-span-2 sm:col-span-1 min-h-[160px] flex flex-col justify-between relative overflow-hidden group cursor-default stagger-1 ${isDark ? 'bg-[#121212] text-white border border-[#27272a]' : 'bg-[#1F1F1F] text-white border border-[#1F1F1F]'}`}>
                            <div className={`absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity animate-float ${isDark ? 'text-blue-400' : ''}`}>
                                <Award size={64} />
                            </div>
                            <div>
                                <div className={`text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2 ${isDark ? 'text-blue-300' : 'text-[#C4EED0]'}`}>
                                    <span className={`w-1 h-1 rounded-full ${isDark ? 'bg-blue-400' : 'bg-[#C4EED0]'}`}></span> Granted IP
                                </div>
                                <div className={`text-2xl sm:text-3xl font-bold brand-font ${isDark ? 'text-blue-100' : 'text-[#C4EED0]'}`}>IN 564400</div>
                            </div>
                            <div className="text-sm text-gray-400 mt-4 leading-tight">
                                Autonomous Vehicle Safety System with Bio-Feedback.
                            </div>
                        </div>

                        {/* KPI 2: Papers */}
                        <div className={`border p-6 rounded-[32px] hover-card col-span-2 sm:col-span-1 min-h-[160px] flex flex-col justify-between cursor-default stagger-2 relative overflow-hidden bg-card border-std`}>
                            {isDark && <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-600/10 rounded-full blur-xl"></div>}
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 shadow-lg animate-float-delayed ${isDark ? 'bg-blue-900/30 text-blue-400 border border-blue-800/50' : 'bg-[#0B57D0] text-white shadow-blue-200'}`}>
                                <FileText size={24} />
                            </div>
                            <div>
                                <div className={`text-3xl sm:text-4xl font-bold brand-font mb-1 text-main`}>2 Papers</div>
                                <div className={`text-sm text-sec`}>
                                    Published Research<br />
                                    <span className={`text-xs font-bold ${isDark ? 'text-blue-400' : 'text-[#0B57D0]'}`}>IEEE • GIJET</span>
                                </div>
                            </div>
                        </div>

                        {/* KPI 3: IISc */}
                        <div className={`p-6 rounded-[32px] hover-card col-span-2 sm:col-span-1 min-h-[160px] flex flex-col justify-between cursor-default stagger-3 relative overflow-hidden ${isDark ? 'bg-[#0a1a0f] text-white border border-green-900/30' : 'bg-[#0D3818] text-white border border-[#0D3818]'}`}>
                            <div className={`absolute -right-4 -bottom-4 opacity-10 rotate-12 ${isDark ? 'text-green-500' : ''}`}>
                                <BookOpen size={100} />
                            </div>
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <div className={`text-xs font-bold uppercase px-2 py-1 rounded backdrop-blur-sm ${isDark ? 'text-green-400 bg-green-900/30 border border-green-800' : 'text-[#34A853] bg-white/10'}`}>IISc Bangalore</div>
                                </div>
                                <div className="text-lg font-bold text-white leading-tight mt-2">Advanced VLSI Design</div>
                            </div>
                            <div className="mt-4">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className={`${isDark ? 'text-gray-400' : 'text-gray-300'}`}>Performance</span>
                                    <span className={`font-bold ${isDark ? 'text-green-400' : 'text-[#34A853]'}`}>80%</span>
                                </div>
                                <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white/20'}`}>
                                    <div className={`h-full w-[80%] animate-[load_1.5s_ease-out_forwards] ${isDark ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-[#34A853]'}`} />
                                </div>
                            </div>
                        </div>

                        {/* KPI 4: Diverse Background */}
                        <div className={`p-6 rounded-[32px] hover-card col-span-2 sm:col-span-1 min-h-[160px] flex flex-col justify-between relative overflow-hidden cursor-default stagger-4 ${isDark ? 'bg-[#18181b] border border-[#27272a]' : 'bg-[#C4EED0] border border-[#C4EED0]'}`}>
                            <CircuitBoard className={`absolute -bottom-4 -right-4 w-32 h-32 animate-float ${isDark ? 'text-gray-700 opacity-20' : 'text-[#0D3818] opacity-10'}`} />
                            <div>
                                <div className={`text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2 ${isDark ? 'text-yellow-500' : 'text-[#0D3818]'}`}>
                                    <span className={`w-1 h-1 rounded-full ${isDark ? 'bg-yellow-500' : 'bg-[#0D3818]'}`}></span> Background
                                </div>
                                <div className={`text-3xl sm:text-4xl font-bold brand-font ${isDark ? 'text-white' : 'text-[#0D3818]'}`}>Diverse</div>
                            </div>
                            <div className={`font-medium mt-2 ${isDark ? 'text-gray-300' : 'text-[#0D3818]'}`}>
                                Expertise <br />
                                <span className={`text-xs font-semibold ${isDark ? 'text-gray-500' : 'opacity-70'}`}>VLSI • IoT • Automation</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const OriginStory = ({ theme }) => {
    const isDark = theme === 'dark';
    const chapters = [
        {
            icon: MousePointer2,
            title: "The Tinkerer",
            text: "It started when my PlayStation 2 died. Instead of replacing it, I tore it apart. That was the moment I realized: everything is built by someone, and everything can be fixed.",
            accent: isDark ? "text-white" : "text-[#1F1F1F]",
            bg: isDark ? "bg-[#27272a]" : "bg-[#fffbf0]",
            keyTerms: ["PlayStation 2", "tore it apart"],
            borderColor: isDark ? "#ffffff" : "#1F1F1F"
        },
        {
            icon: Smartphone,
            title: "The Optimizer",
            text: "Curiosity grew into optimization. I rooted my Samsung Galaxy Tab 2 to install custom ROMs, squeezing every drop of performance out of limited hardware.",
            accent: isDark ? "text-blue-400" : "text-[#0B57D0]",
            bg: isDark ? "bg-blue-950/30" : "bg-[#eef5ff]",
            keyTerms: ["Samsung Galaxy Tab 2", "Custom ROMs"],
            borderColor: isDark ? "#60a5fa" : "#0B57D0"
        },
        {
            icon: HardDrive,
            title: "The Builder",
            text: "Finally, I built my first PC from scratch. Researching thermals, voltages, and component compatibility laid the foundation for my career in hardware architecture.",
            accent: isDark ? "text-green-400" : "text-[#0D3818]",
            bg: isDark ? "bg-green-950/30" : "bg-[#f0fdf4]",
            keyTerms: ["built my first PC", "hardware architecture"],
            borderColor: isDark ? "#4ade80" : "#0D3818"
        }
    ];

    return (
        <section className={`py-24 bg-main`} id="story">
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="text-center mb-16 reveal-up">
                    <h2 className={`text-4xl md:text-5xl font-bold mb-4 brand-font text-main`}>The Origin Story</h2>
                    <p className={`text-lg text-sec`}>From repairing consoles to architecting silicon.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {chapters.map((chap, i) => (
                        <div
                            key={i}
                            className={`p-8 rounded-[32px] border border-t-4 reveal-up stagger-${i + 1} group cursor-default hover:shadow-xl hover:-translate-y-2 hover-card bg-card border-std`}
                            style={{ borderTopColor: chap.borderColor }}
                        >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${chap.bg} ${isDark ? 'border border-white/5' : 'border border-gray-100'}`}>
                                <chap.icon size={28} className={chap.accent} />
                            </div>
                            <h3 className={`text-2xl font-bold mb-4 text-main`}>{chap.title}</h3>
                            <p className={`leading-relaxed text-sm flex-1 text-sec`}>
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

const TechArsenal = ({ theme }) => {
    const isDark = theme === 'dark';
    const TechTag = ({ children, className = "" }) => (
        <div className={`px-4 py-2 rounded-full text-sm font-medium cursor-default ${className} ${isDark ? 'bg-[#18181b] border border-[#27272a] text-gray-300 hover:bg-blue-600 hover:text-white hover:border-blue-600' : 'bg-[#F2F6FC] border border-gray-300 text-[#1F1F1F] hover:bg-[#0B57D0] hover:text-white'}`}>
            {children}
        </div>
    );

    return (
        <section className="py-24 px-6 max-w-[1400px] mx-auto" id="arsenal">
            <div className="mb-16 reveal-up">
                <h2 className={`text-4xl md:text-5xl font-bold mb-6 brand-font text-main`}>
                    Tech Arsenal.
                </h2>
                <p className={`text-xl max-w-2xl text-sec`}>
                    My toolbox for converting requirements into silicon.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-auto">
                <div
                    className={`md:col-span-2 rounded-[24px] p-10 relative overflow-hidden reveal-up hover-card flex flex-col justify-center min-h-[300px] bg-card border-t-4 border border-std`}
                    style={{ borderTopColor: isDark ? '#3b82f6' : '#0B57D0' }}
                >
                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-6">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isDark ? 'bg-[#18181b] text-blue-400 border border-[#27272a]' : 'bg-[#F2F6FC] text-[#0B57D0]'}`}>
                                <Cpu size={28} />
                            </div>
                            <h3 className={`text-3xl font-bold brand-font text-main`}>Digital Design & Verification</h3>
                        </div>
                        <p className={`text-lg leading-relaxed mb-8 max-w-xl text-sec`}>
                            Expertise in constructing robust <span className="imp-text">UVM testbenches</span>, achieving <span className="imp-text">100% coverage</span>, and synthesizing RTL for high-performance SoCs.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            {['SystemVerilog', 'UVM', 'RTL Design', 'FPGA Prototyping', 'Xilinx Vivado'].map((skill) => (
                                <TechTag key={skill}>{skill}</TechTag>
                            ))}
                        </div>
                    </div>
                    <div className={`absolute right-0 bottom-0 transition-opacity duration-500 ${isDark ? 'opacity-10 text-white' : 'opacity-5 text-[#1F1F1F]'}`}>
                        <CircuitBoard size={300} />
                    </div>
                </div>

                <div
                    className={`tech-card flex flex-col p-8 rounded-[24px] border border-t-4 reveal-up stagger-1 hover-card bg-card border-std`}
                    style={{ borderTopColor: isDark ? '#3b82f6' : '#0B57D0' }}
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? 'bg-blue-900/30 text-blue-400 border border-blue-800/30' : 'bg-blue-50 text-[#0B57D0]'}`}>
                            <Terminal size={20} />
                        </div>
                        <h3 className={`text-xl font-bold text-main`}>Languages</h3>
                    </div>
                    <div className="flex flex-wrap gap-2 content-start flex-1">
                        {['SystemVerilog', 'Verilog RTL', 'Python', 'C / C++', 'MATLAB'].map((lang) => (
                            <div key={lang} className={`px-4 py-2 rounded-xl font-medium text-sm border cursor-default ${isDark ? 'bg-[#18181b] text-blue-300 border-[#27272a] hover:bg-blue-900/20 hover:border-blue-800/50' : 'bg-blue-50/50 text-[#0B57D0] border-blue-100 hover:bg-blue-100'}`}>
                                {lang}
                            </div>
                        ))}
                    </div>
                </div>

                <div
                    className={`tech-card flex flex-col p-8 rounded-[24px] border border-t-4 reveal-up stagger-2 hover-card bg-card border-std`}
                    style={{ borderTopColor: isDark ? '#f97316' : '#E37400' }}
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? 'bg-orange-900/30 text-orange-400 border border-orange-800/30' : 'bg-orange-50 text-[#E37400]'}`}>
                            <Box size={20} />
                        </div>
                        <h3 className={`text-xl font-bold text-main`}>Toolchain</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3 flex-1">
                        {['Vivado', 'ModelSim', 'Questa Sim', 'Cadence', 'LaTeX', 'HOMER Pro'].map((tool) => (
                            <div key={tool} className={`w-full h-full p-3 rounded-xl text-sm font-medium text-center cursor-default flex items-center justify-center border ${isDark ? 'bg-[#18181b] border-[#27272a] text-gray-400 hover:bg-orange-900/20 hover:text-orange-300 hover:border-orange-800/50' : 'bg-orange-50/30 border-orange-100 text-[#444746] hover:bg-orange-100'}`}>
                                {tool}
                            </div>
                        ))}
                    </div>
                </div>

                <div
                    className={`md:col-span-2 flex flex-col md:flex-row items-center gap-8 p-8 rounded-[24px] border border-t-4 reveal-up stagger-3 hover-card bg-card border-std`}
                    style={{ borderTopColor: isDark ? '#22c55e' : '#34A853' }}
                >
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? 'bg-green-900/30 text-green-400 border border-green-800/30' : 'bg-green-50 text-[#34A853]'}`}>
                                <Layers size={20} />
                            </div>
                            <h3 className={`text-2xl font-bold text-main`}>System Architecture</h3>
                        </div>
                        <p className={`mb-6 text-sec`}>
                            Designing heterogeneous SoCs with custom accelerators.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            {['RISC-V Core', 'Low Power', 'AMBA AXI/APB', 'Neuromorphic'].map((item) => (
                                <div key={item} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm cursor-default border ${isDark ? 'bg-[#18181b] border-[#27272a] text-green-400 hover:bg-green-900/20 hover:border-green-800/50' : 'bg-green-50/50 border-green-100 text-[#1F7A43] hover:bg-green-100'}`}>
                                    <CheckCircle2 size={14} /> {item}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={`w-full md:w-1/3 aspect-video rounded-xl border flex items-center justify-center relative overflow-hidden ${isDark ? 'bg-[#050505] border-[#27272a]' : 'bg-[#F2F6FC] border-gray-300'}`}>
                        <div className={`font-mono text-xs p-4 opacity-70 ${isDark ? 'text-gray-500' : 'text-[#444746]'}`}>
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

/* --- JOURNEY --- */
const Journey = ({ theme }) => {
    const isDark = theme === 'dark';
    const [expandedId, setExpandedId] = useState(null);
    const toggleExpand = (id) => setExpandedId(expandedId === id ? null : id);

    const experiences = [
        {
            id: "exp1",
            role: "Programmer Analyst",
            company: "Cognizant Technology Solutions",
            duration: "Aug 2024 - Present",
            desc: "Automated key business workflows using APPIAN low-code platform. Collaborated on cross-functional projects to optimize enterprise processes.",
            borderColorHex: isDark ? "#3b82f6" : "#0B57D0",
            dotColorClass: isDark ? "bg-blue-500" : "bg-[#0B57D0]",
            bg: isDark ? "bg-blue-900/10" : "bg-blue-50/30",
            buttonColor: isDark ? "text-blue-400 hover:bg-blue-900/20" : "text-[#0B57D0] hover:bg-blue-50",
            details: ["Automated key business workflows.", "Collaborated on cross-functional projects."]
        },
        {
            id: "exp2",
            role: "Jr. Design Verification Eng.",
            company: "Insemi Technology Services",
            duration: "Jul 2023 - Oct 2023",
            desc: "Developed UVM testbench for Dual-Port RAM with 100% functional coverage. Analyzed protocol compliance using SystemVerilog assertions.",
            borderColorHex: isDark ? "#22c55e" : "#34A853",
            dotColorClass: isDark ? "bg-green-500" : "bg-[#34A853]",
            bg: isDark ? "bg-green-900/10" : "bg-green-50/30",
            buttonColor: isDark ? "text-green-400 hover:bg-green-900/20" : "text-[#34A853] hover:bg-green-50",
            details: ["Developed comprehensive UVM testbench.", "Analyzed protocol compliance."]
        },
        {
            id: "exp3",
            role: "Intern",
            company: "Maven Silicon",
            duration: "Dec 2022 - Jan 2023",
            desc: "Designed AMBA AHB-APB bridge in Verilog. Deepened understanding of FSM architecture.",
            borderColorHex: isDark ? "#eab308" : "#FBBC04",
            dotColorClass: isDark ? "bg-yellow-500" : "bg-[#FBBC04]",
            bg: isDark ? "bg-yellow-900/10" : "bg-yellow-50/30",
            buttonColor: isDark ? "text-yellow-400 hover:bg-yellow-900/20" : "text-[#FBBC04] hover:bg-yellow-50",
            details: ["Deepened understanding of digital design.", "Designed AMBA AHB-APB bridge."]
        },
        {
            id: "exp4",
            role: "Intern",
            company: "CoreEl Technologies",
            duration: "Jun 2022 - Jul 2022",
            desc: "Built SystemVerilog testbench for full adder DUT. Achieved 100% coverage.",
            borderColorHex: isDark ? "#ef4444" : "#EA4335",
            dotColorClass: isDark ? "bg-red-500" : "bg-[#EA4335]",
            bg: isDark ? "bg-red-900/10" : "bg-red-50/30",
            buttonColor: isDark ? "text-red-400 hover:bg-red-900/20" : "text-[#EA4335] hover:bg-red-50",
            details: ["Learned SystemVerilog verification.", "Developed SV testbench."]
        }
    ];

    const education = [
        {
            id: "edu1",
            degree: "PG Advanced Cert. in VLSI",
            school: "IISc Bangalore",
            year: "2024",
            score: "80% Score",
            icon: GraduationCap,
            borderColorHex: isDark ? "#16a34a" : "#16a34a",
            dotColorClass: isDark ? "bg-green-600" : "bg-[#0D3818]",
            iconColor: isDark ? "text-green-400" : "text-[#0D3818]",
            bg: isDark ? "bg-green-900/10" : "bg-green-50/30",
            buttonColor: isDark ? "text-green-400 hover:bg-green-900/20" : "text-[#0D3818] hover:bg-green-50",
            barColor: isDark ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-[#34A853]',
            barScoreColor: isDark ? 'text-green-400' : 'text-[#34A853]',
            details: ["Intensive 11-month program.", "Coursework: Analog/Digital IC Design, RISC-V."]
        },
        {
            id: "edu2",
            degree: "B.Tech, Electronics & Comm.",
            school: "SRM Institute",
            year: "2019 - 2023",
            score: "9.4 CGPA",
            icon: BookOpen,
            borderColorHex: isDark ? "#3b82f6" : "#0B57D0",
            dotColorClass: isDark ? "bg-blue-500" : "bg-[#0B57D0]",
            iconColor: isDark ? "text-blue-400" : "text-[#0B57D0]",
            bg: isDark ? "bg-blue-900/10" : "bg-blue-50/30",
            buttonColor: isDark ? "text-blue-400 hover:bg-blue-900/20" : "text-[#0B57D0] hover:bg-blue-50",
            barColor: isDark ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-[#0B57D0]',
            barScoreColor: isDark ? 'text-blue-400' : 'text-[#0B57D0]',
            details: ["Graduated with 9.4/10.0.", "Coursework: Digital Design, Embedded Systems."]
        }
    ];

    return (
        <section className={`py-24 bg-main`} id="journey">
            <div className="max-w-[1200px] mx-auto px-6">
                <div className="text-center mb-16 reveal-up">
                    <h2 className={`text-4xl md:text-5xl font-bold mb-4 brand-font text-main`}>The Circuit Path</h2>
                    <p className={`text-sec`}>Chronicles of execution and learning.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Experience */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-6 reveal-up">
                            <div className={`p-2 rounded-lg ${isDark ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-50 text-[#0B57D0]'}`}><Briefcase size={24} /></div>
                            <h3 className={`text-2xl font-bold text-main`}>Experience Bus</h3>
                        </div>
                        <div className={`relative border-l-2 border-dashed ml-4 pl-8 space-y-8 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                            {experiences.map((exp, i) => (
                                <div key={exp.id}
                                    className={`group relative rounded-2xl p-6 border shadow-sm hover:shadow-md hover:-translate-y-1 hover-card border-l-[6px] reveal-up stagger-${i + 1} bg-card border-std`}
                                    style={{ borderLeftColor: exp.borderColorHex }}
                                >
                                    <div className={`absolute -left-[43px] top-6 w-5 h-5 border-4 rounded-full transition-all duration-300 z-10 
                                        ${expandedId === exp.id ? `scale-125 ${exp.dotColorClass}` : `bg-main border-std group-hover:${exp.dotColorClass} group-hover:border-transparent group-hover:scale-125`}`}>
                                    </div>

                                    <div className="flex flex-col sm:flex-row justify-between items-start mb-2 gap-2">
                                        <div>
                                            <h4 className={`font-bold text-lg text-main`}>{exp.role}</h4>
                                            <div className={`text-sm font-semibold text-sec`}>{exp.company}</div>
                                        </div>
                                        <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded whitespace-nowrap ${isDark ? 'bg-[#18181b] border border-[#27272a] text-gray-400' : 'bg-gray-100 text-gray-600'}`}>{exp.duration}</span>
                                    </div>
                                    <p className={`text-sm leading-relaxed mt-2 text-sec`}>{exp.desc}</p>

                                    <button onClick={() => toggleExpand(exp.id)} className={`mt-4 text-xs font-bold flex items-center gap-1 hover:underline uppercase tracking-wide py-1 px-2 -ml-2 rounded ${exp.buttonColor}`}>
                                        {expandedId === exp.id ? "Show Less" : "View Details"} {expandedId === exp.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                    </button>
                                    <div className={`grid transition-all duration-500 ease-in-out ${expandedId === exp.id ? `grid-rows-[1fr] opacity-100 mt-4 pt-4 border-t ${isDark ? 'border-gray-800' : 'border-gray-100'}` : 'grid-rows-[0fr] opacity-0'}`}>
                                        <div className="overflow-hidden">
                                            <ul className="list-disc pl-4 space-y-2">
                                                {exp.details.map((detail, idx) => (<li key={idx} className={`text-sm leading-relaxed text-sec`}>{detail}</li>))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Education */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-6 reveal-up" style={{ transitionDelay: '200ms' }}>
                            <div className={`p-2 rounded-lg ${isDark ? 'bg-green-900/20 text-green-400' : 'bg-green-50 text-[#34A853]'}`}><GraduationCap size={24} /></div>
                            <h3 className={`text-2xl font-bold text-main`}>Education Core</h3>
                        </div>
                        <div className={`relative border-l-2 border-dashed ml-4 pl-8 space-y-8 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                            {education.map((edu, i) => (
                                <div key={edu.id}
                                    className={`group relative rounded-[24px] p-8 border shadow-sm border-l-[6px] hover:shadow-lg hover:-translate-y-1 hover-card reveal-up stagger-1 bg-card border-std`}
                                    style={{ borderLeftColor: edu.borderColorHex }}
                                >
                                    <div className={`absolute -left-[43px] top-8 w-5 h-5 border-4 rounded-full transition-all duration-300 z-10
                                        ${expandedId === edu.id ? `scale-125 ${edu.dotColorClass}` : `bg-main border-std group-hover:${edu.dotColorClass} group-hover:border-transparent group-hover:scale-125`}`}>
                                    </div>

                                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform ${edu.iconColor} ${isDark ? 'bg-[#18181b] border border-[#27272a]' : 'bg-gray-50'}`}><edu.icon size={24} /></div>
                                            <div>
                                                <h4 className={`text-xl font-bold text-main`}>{edu.degree}</h4>
                                                <div className={`text-sec font-medium`}>{edu.school}</div>
                                            </div>
                                        </div>
                                        <span className={`text-xl font-bold opacity-20 group-hover:opacity-100 transition-opacity font-mono text-sec`}>{edu.year}</span>
                                    </div>
                                    <div className="mt-6 flex items-center gap-2">
                                        <div className={`h-1.5 flex-1 rounded-full overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                            <div className={`h-full w-[90%] ${edu.barColor}`}></div>
                                        </div>
                                        <span className={`text-sm font-bold ${edu.barScoreColor}`}>{edu.score}</span>
                                    </div>

                                    <button onClick={() => toggleExpand(edu.id)} className={`mt-6 text-xs font-bold flex items-center gap-1 hover:underline uppercase tracking-wide py-1 px-2 -ml-2 rounded ${edu.buttonColor}`}>
                                        {expandedId === edu.id ? "Show Less" : "View Curriculum"} {expandedId === edu.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                    </button>
                                    <div className={`grid transition-all duration-500 ease-in-out ${expandedId === edu.id ? `grid-rows-[1fr] opacity-100 mt-4 pt-4 border-t ${isDark ? 'border-gray-800' : 'border-gray-100'}` : 'grid-rows-[0fr] opacity-0'}`}>
                                        <div className="overflow-hidden">
                                            <ul className="list-disc pl-4 space-y-2">
                                                {edu.details.map((detail, idx) => (<li key={idx} className={`text-sm leading-relaxed text-sec`}>{detail}</li>))}
                                            </ul>
                                        </div>
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

const ProjectCard = ({ project, idx, activeProject, toggleProject, isDark }) => {
    const isRightAligned = idx % 2 === 1;
    const [imgLoaded, setImgLoaded] = useState(false);

    return (
        <div className={`flex flex-col md:flex-row gap-12 items-center reveal-up ${isRightAligned ? 'md:flex-row-reverse' : ''}`}>
            <div className={`w-full md:w-1/2 aspect-[4/3] rounded-[32px] overflow-hidden shadow-xl relative group hover-card cursor-pointer ${isDark ? 'border border-[#27272a]' : ''}`} onClick={() => toggleProject(idx)}>
                {/* Skeleton Loader */}
                <div className={`absolute inset-0 z-0 bg-gray-200 animate-pulse transition-opacity duration-500 ${imgLoaded ? 'opacity-0' : 'opacity-100'} ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}></div>

                <img
                    src={project.img}
                    alt={project.title}
                    loading="lazy"
                    onLoad={() => setImgLoaded(true)}
                    className={`w-full h-full object-cover relative z-10 transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                />
                <div className={`absolute inset-0 z-20 ${isDark ? 'bg-black/40 group-hover:bg-transparent' : 'bg-black/10 group-hover:bg-transparent'}`}></div>
                <div className={`absolute bottom-4 right-4 z-30 w-12 h-12 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isDark ? 'bg-black/90 border border-gray-700' : 'bg-white/90'}`}>
                    <ArrowUpRight size={24} className={isDark ? "text-white" : "text-[#1F1F1F]"} />
                </div>
            </div>

            <div className="w-full md:w-1/2">
                <div className={`font-bold text-sm tracking-widest uppercase mb-3 ${isDark ? 'text-blue-400' : 'text-[#0B57D0]'}`}>{project.category}</div>
                <h3 className={`text-3xl md:text-4xl font-extrabold tracking-tight mb-6 brand-font leading-tight text-main`}>{project.title}</h3>

                <p className={`text-lg leading-relaxed mb-6 text-sec`}>
                    {project.desc.split(new RegExp(`(${project.keyOutcomes.join('|')})`)).map((part, i) =>
                        project.keyOutcomes.some(k => part.includes(k.split(' ')[0]))
                            ? <span key={i} className="imp-text">{part}</span>
                            : part
                    )}
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                    {project.tech.map(t => (
                        <span key={t} className={`interactive-tag px-3 py-1 text-sm font-medium rounded-lg cursor-default ${isDark ? 'bg-[#18181b] border border-[#27272a] text-gray-300 hover:bg-blue-600 hover:text-white hover:border-blue-600' : 'bg-[#F2F6FC] border border-[#E0E2EC] text-[#1F1F1F] hover:bg-[#0B57D0] hover:text-white'}`}>
                            {t}
                        </span>
                    ))}
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                    <button onClick={() => toggleProject(idx)} className={`group flex items-center gap-2 font-bold text-lg border-b-2 transition-all duration-500 py-2 click-scale ${isDark ? 'text-white border-gray-700 hover:border-blue-500' : 'text-[#1F1F1F] border-[#E0E2EC] hover:border-[#0B57D0]'}`}>
                        {activeProject === idx ? 'Close Analysis' : 'View Tech Specs'}
                        <ChevronDown size={20} className={`transition-transform duration-300 ${activeProject === idx ? 'rotate-180' : ''}`} />
                    </button>
                    {project.link && (
                        <a href={project.link} target="_blank" rel="noopener noreferrer" className={`group flex items-center gap-2 font-bold text-lg border-b-2 border-transparent transition-all duration-500 py-2 click-scale ${isDark ? 'text-blue-400 hover:border-blue-400' : 'text-[#0B57D0] hover:border-[#0B57D0]'}`}>
                            Read Paper <ExternalLink size={18} />
                        </a>
                    )}
                </div>

                <div className={`grid transition-all duration-700 ease-in-out ${activeProject === idx ? 'grid-rows-[1fr] opacity-100 mt-6' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden">
                        <div className={`p-8 rounded-[24px] border shadow-inner ${isRightAligned ? 'border-r-4 border-l-0' : 'border-l-4'} ${isDark ? `bg-[#121212] border-[#27272a] ${isRightAligned ? 'border-r-blue-500' : 'border-l-blue-500'}` : `bg-[#F8FAFC] border-gray-100 ${isRightAligned ? 'border-r-[#0B57D0]' : 'border-l-[#0B57D0]'}`}`}>
                            <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 text-sec`}>Key Outcomes</h4>
                            <div className="flex flex-wrap gap-3 mb-4">
                                {project.keyOutcomes.map(tag => (
                                    <span key={tag} className={`interactive-tag px-3 py-1.5 text-sm font-bold rounded-lg border cursor-default ${isDark ? 'bg-blue-900/20 text-blue-400 border-blue-800/30 hover:bg-blue-600 hover:text-white' : 'bg-blue-50 text-[#0B57D0] border-blue-100 hover:bg-[#0B57D0] hover:text-white'}`}>
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <p className={`text-base leading-relaxed text-sec`}>
                                {project.deepContext.split(new RegExp(`(${project.contextHighlights.join('|')})`, 'gi')).map((part, i) =>
                                    project.contextHighlights.some(highlight => highlight.toLowerCase() === part.toLowerCase())
                                        ? <span key={i} className="imp-text">{part}</span>
                                        : part
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const Projects = ({ theme }) => {
    const isDark = theme === 'dark';
    const [activeProject, setActiveProject] = useState(null);
    const toggleProject = (index) => setActiveProject(activeProject === index ? null : index);

    const projects = [
        {
            title: "RISC-V ECG Accelerator",
            category: "Heterogeneous SoC Design",
            img: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1035&auto=format&fit=crop",
            desc: "Engineered a heterogeneous SoC integrating a RISC-V processor and a custom neural network via AXI Stream.",
            deepContext: "Engineered a heterogeneous SoC integrating a RISC-V processor and a custom neural network via the AXI Stream protocol. The system achieved 92% accuracy in real-time ECG classification using Q1.15 fixed-point arithmetic optimization. Validated the complete design through simulation and deployment on FPGA hardware.",
            keyOutcomes: ["Q1.15 Fixed-Point", "92% Accuracy", "Real-time"],
            contextHighlights: ["heterogeneous SoC", "RISC-V processor", "AXI Stream protocol", "92% accuracy", "Q1.15 fixed-point arithmetic", "FPGA hardware"],
            tech: ["RISC-V", "AXI Stream", "FPGA"]
        },
        {
            title: "Neural Net RTL Engine",
            category: "Hardware Inference",
            img: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=1035&auto=format&fit=crop",
            desc: "Designed a Verilog RTL 3-layer neural network inference engine with ROM-based weights and FIFO input.",
            deepContext: "Designed and implemented a Verilog RTL 3-layer neural network inference engine with custom ROM-based weights and FIFO input. Achieved over 85% accuracy on the Semeion dataset through efficient fixed-point hardware conversion. Performed full simulation, synthesis, and implementation in Xilinx Vivado.",
            keyOutcomes: ["85% Accuracy", "Timing Closure", "Semeion Dataset"],
            contextHighlights: ["Verilog RTL", "3-layer neural network", "ROM-based weights", "85% accuracy", "Semeion dataset", "Xilinx Vivado"],
            tech: ["Verilog RTL", "Vivado", "Neural Networks"]
        },
        {
            title: "APB UVM Testbench",
            category: "Advanced Verification",
            img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1035&auto=format&fit=crop",
            desc: "Architected a modular UVM testbench with reusable master/slave agents to rigorously validate APB protocol.",
            deepContext: "Architected a modular UVM testbench, developing reusable master/slave agents and environment components to rigorously validate APB protocol compliance. Achieved 100% functional and code coverage and confirmed design robustness through complete assertion coverage.",
            keyOutcomes: ["100% Coverage", "Reusable Agents", "Protocol Check"],
            contextHighlights: ["modular UVM testbench", "reusable master/slave agents", "APB protocol compliance", "100% functional and code coverage", "assertion coverage"],
            tech: ["UVM", "SystemVerilog", "Coverage"]
        },
        {
            title: "SEC-DED-DAEC Module",
            category: "Data Integrity",
            img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1067&auto=format&fit=crop",
            desc: "Led development of a novel SEC-DED-DAEC error-correcting module, optimizing reversible logic.",
            deepContext: "Led development of a novel SEC-DED-DAEC error-correcting module and integrated it into an AHB-APB bridge to ensure data integrity for system-on-chip pathways. Optimized the reversible logic implementation to achieve a 5.67% reduction in power consumption. Published in IEEE.",
            keyOutcomes: ["5.67% Power Reduction", "4.52% Delay Imp.", "IEEE"],
            contextHighlights: ["novel SEC-DED-DAEC", "error-correcting module", "AHB-APB bridge", "data integrity", "5.67% reduction in power consumption"],
            tech: ["Error Correction", "Low-Power"],
            link: "https://ieeexplore.ieee.org/document/10134491"
        },
        {
            title: "Hybrid Hack 2021 Finalist",
            category: "Cross-Domain Innovation",
            img: "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1458",
            desc: "Co-developed 'Charge On Go,' a novel vehicle-mounted hybrid power system. Simulated electrical performance.",
            deepContext: "Co-developed a novel vehicle-mounted hybrid power system to generate electricity during transit. Simulated the system's electrical performance using Python and HOMER Pro, projecting an annual energy generation of 465.15 kWh per unit. Built an interactive 3D simulation in Unity.",
            keyOutcomes: ["465.15 kWh/yr", "3D Simulation", "Investor Demo"],
            contextHighlights: ["vehicle-mounted hybrid power system", "Python", "HOMER Pro", "465.15 kWh per unit", "3D simulation in Unity"],
            tech: ["Python", "HOMER Pro", "Unity"]
        }
    ];

    return (
        <section className="py-24 px-6 max-w-[1400px] mx-auto" id="work">
            <h2 className={`text-4xl md:text-5xl font-extrabold mb-10 brand-font reveal-up tracking-tight text-main`}>ARCHIVES</h2>

            <div className="space-y-16 min-h-[500px]">
                {projects.map((project, idx) => (
                    <ProjectCard
                        key={project.title}
                        project={project}
                        idx={idx}
                        activeProject={activeProject}
                        toggleProject={toggleProject}
                        isDark={isDark}
                    />
                ))}
            </div>
        </section>
    );
};

const TheVault = ({ theme }) => {
    const isDark = theme === 'dark';
    const [isPatentOpen, setIsPatentOpen] = useState(false);

    return (
        <section className="py-24 px-6 max-w-[1400px] mx-auto" id="patents">
            <h2 className={`text-4xl md:text-5xl font-bold mb-16 brand-font text-center reveal-up text-main`}>Intellectual Property & Research</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">

                {/* Patent Card - Always Dark/Navy but adapts slightly */}
                <div className={`p-10 rounded-[40px] shadow-2xl relative overflow-hidden group hover:transform reveal-up border hover-card ${isDark ? 'bg-[#0f172a] text-white border-blue-900/30' : 'bg-[#1e293b] text-white border-[#334155]'}`}>
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#3b82f6]/10 to-transparent pointer-events-none"></div>
                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-8">
                            <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#1e293b] border-blue-800/30' : 'bg-[#334155] border-[#475569]'}`}>
                                <Award size={40} className={`animate-pulse-soft ${isDark ? 'text-blue-400' : 'text-[#60a5fa]'}`} />
                            </div>
                            <div className={`px-4 py-1.5 text-xs font-bold uppercase rounded-full tracking-wider flex items-center gap-2 ${isDark ? 'bg-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.5)]' : 'bg-[#60a5fa] text-[#0f172a]'}`}>
                                <CheckCircle2 size={12} /> Granted Patent
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold mb-4 brand-font leading-tight text-white">Autonomous Vehicle Safety System</h3>
                        <div className={`font-mono text-3xl sm:text-4xl mb-6 font-bold tracking-tight ${isDark ? 'text-blue-400' : 'text-[#60a5fa]'}`}>IN 564400</div>
                        <p className={`text-lg leading-relaxed mb-8 border-l-4 pl-6 ${isDark ? 'text-gray-300 border-blue-500' : 'text-slate-300 border-[#60a5fa]'}`}>
                            Dual-processor architecture monitoring vital signs to trigger autonomous takeover.
                        </p>

                        <div className="flex justify-between items-end mt-auto">
                            <div className={`text-sm font-bold uppercase tracking-widest ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>March 2025</div>
                            <button onClick={() => setIsPatentOpen(!isPatentOpen)} className={`flex items-center gap-2 px-6 py-3 font-bold rounded-xl transition-all click-scale duration-300 ${isDark ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20' : 'bg-[#60a5fa] hover:bg-[#3b82f6] text-[#0f172a]'}`}>
                                {isPatentOpen ? 'Close Blueprint' : 'Inspect System'} <ChevronDown size={18} className={`transition-transform duration-300 ${isPatentOpen ? 'rotate-180' : ''}`} />
                            </button>
                        </div>

                        <div className={`grid transition-all duration-700 ease-in-out ${isPatentOpen ? `grid-rows-[1fr] opacity-100 mt-8 pt-8 border-t ${isDark ? 'border-blue-900/30' : 'border-[#334155]'}` : 'grid-rows-[0fr] opacity-0'}`}>
                            <div className="overflow-hidden space-y-8 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                <div>
                                    <h4 className={`font-bold uppercase tracking-widest text-sm mb-2 ${isDark ? 'text-blue-400' : 'text-[#60a5fa]'}`}>The Concept</h4>
                                    <p className={`leading-relaxed text-sm ${isDark ? 'text-gray-300' : 'text-slate-300'}`}>An autonomous fail-safe system designed to intervene during sudden <span className="imp-text-dark">driver incapacitation</span>. Unlike standard ADAS that looks for drowsiness, this system monitors <span className="imp-text-dark">physiological data</span> to detect acute medical emergencies (e.g., cardiac arrest, seizures) and autonomously navigates the vehicle to safety.</p>
                                </div>
                                <div>
                                    <h4 className={`font-bold uppercase tracking-widest text-sm mb-2 ${isDark ? 'text-blue-400' : 'text-[#60a5fa]'}`}>The Novelty</h4>
                                    <p className={`leading-relaxed text-sm ${isDark ? 'text-gray-300' : 'text-slate-300'}`}>Existing systems focus on driver behavior (eye movement, head tilt). This patent introduces a <span className="imp-text-dark">Resolution Module</span> based on vital parameters. It uniquely distinguishes between <span className="imp-text-dark">'Moderate' and 'Critical' states</span>, enabling context-aware decisions: it doesn't just stop the car; it intelligently decides whether to pull over safely or <span className="imp-text-dark">re-route directly to the nearest hospital</span> based on the severity of the medical event.</p>
                                </div>
                                <div>
                                    <h4 className={`font-bold uppercase tracking-widest text-sm mb-4 ${isDark ? 'text-blue-400' : 'text-[#60a5fa]'}`}>System Architecture</h4>
                                    <ul className="space-y-4">
                                        {[
                                            { step: '01', title: 'Sense', desc: 'Continuous bio-feedback monitoring (Pulse, IR, Ultrasonic sensors) feeds data to a dual-processor control unit (Arduino + Raspberry Pi).' },
                                            { step: '02', title: 'Analyze', desc: 'The system compares real-time vitals against a repository of pre-set medical rules.' },
                                            { step: '03', title: 'Takeover & Resolve', desc: 'If a threshold is breached, the Takeover Module overrides manual control.' }
                                        ].map((item, i) => (
                                            <li key={i} className="flex gap-4">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-xs ${isDark ? 'bg-[#1e293b] text-blue-400' : 'bg-[#334155] text-[#60a5fa]'}`}>{item.step}</div>
                                                <div>
                                                    <span className="font-bold text-white block mb-1">{item.title}</span>
                                                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-slate-400'}`}>{item.desc}</span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Papers Stack */}
                <div className="space-y-6 reveal-up" style={{ transitionDelay: '100ms' }}>
                    {[
                        { type: 'IEEE Published', title: 'Error Correction in SoC', desc: 'Implemented reversible logic based error detection and correction for AHB-APB bridge. Optimized for low power consumption.', id: 'RAEEUCCI 2023', link: 'https://ieeexplore.ieee.org/document/10134491', color: 'blue', accent: isDark ? 'text-blue-400' : 'text-[#0B57D0]' },
                        { type: 'International Journal', title: 'IoT Healthcare Systems', desc: 'Comprehensive survey on affordable IoT architecture for remote patient monitoring and healthcare access.', id: 'GIJET 2022', link: 'https://thegrenze.com/index.php?display=page&view=journalabstract&absid=1238&id=8', color: 'green', accent: isDark ? 'text-green-400' : 'text-[#1F7A43]' }
                    ].map((paper, i) => (
                        <div key={i} className={`p-8 rounded-[32px] border transition-all shadow-sm group hover:shadow-xl hover:-translate-y-2 duration-500 relative overflow-hidden hover-card ${isDark ? `bg-[#121212] border-[#27272a] hover:border-${paper.color}-600` : `bg-white border-gray-300 hover:border-${paper.color === 'blue' ? '[#0B57D0]' : '[#34A853]'}`}`}>
                            <div className={`absolute right-0 top-0 w-24 h-24 rounded-bl-[100px] -z-0 transition-transform group-hover:scale-150 ${isDark ? `bg-${paper.color}-900/20` : `bg-${paper.color}-50`}`}></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full tracking-wider ${isDark ? `bg-${paper.color}-900/30 text-${paper.color}-400 border border-${paper.color}-800/30` : `bg-${paper.color}-100 ${paper.accent}`}`}>{paper.type}</span>
                                </div>
                                <h4 className={`text-2xl font-bold mb-3 text-main`}>{paper.title}</h4>
                                <p className={`text-sm mb-4 text-sec`}>{paper.desc}</p>
                                <div className={`flex items-center justify-between mt-6 pt-4 border-t ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
                                    <div className={`text-lg font-mono font-bold ${paper.accent}`}>{paper.id}</div>
                                    <a href={paper.link} target="_blank" rel="noopener noreferrer" className={`text-xs font-bold flex items-center gap-1 hover:underline px-3 py-1.5 rounded-full transition-all duration-300 ${isDark ? `text-${paper.color}-400 bg-${paper.color}-900/20 hover:bg-${paper.color}-600 hover:text-white` : `${paper.accent} bg-${paper.color}-50`}`}>
                                        Read Paper <ArrowUpRight size={12} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const IdleCycles = ({ theme }) => {
    const isDark = theme === 'dark';
    return (
        <section className={`py-24 bg-main`} id="lifestyle">
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="flex items-center gap-4 mb-12 reveal-up">
                    <Coffee className={`w-8 h-8 animate-float text-main`} />
                    <h2 className={`text-3xl font-bold brand-font text-main`}>Idle Cycles</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 reveal-up stagger-1">
                    {[
                        { title: 'Photography', sub: 'Chasing shots', icon: Camera, color: isDark ? 'text-red-400' : 'text-[#EA4335]', bg: isDark ? 'group-hover:bg-red-900/20' : 'group-hover:bg-[#FEF2F2]' },
                        { title: 'Music', sub: 'Curating playlists', icon: Music, color: isDark ? 'text-yellow-400' : 'text-[#FBBC04]', bg: isDark ? 'group-hover:bg-yellow-900/20' : 'group-hover:bg-[#FFFBEB]' },
                        { title: 'eSports', sub: 'Competitive analysis', icon: Monitor, color: isDark ? 'text-blue-400' : 'text-[#0B57D0]', bg: isDark ? 'group-hover:bg-blue-900/20' : 'group-hover:bg-[#EFF6FF]' },
                        { title: 'Cricket', sub: 'On-field strategy', icon: Activity, color: isDark ? 'text-green-400' : 'text-[#34A853]', bg: isDark ? 'group-hover:bg-green-900/20' : 'group-hover:bg-[#F0FDF4]' }
                    ].map((item, i) => (
                        <div key={i} className={`aspect-[4/3] rounded-[32px] flex flex-col items-center justify-center p-6 hover-card cursor-default group relative overflow-hidden ${item.bg} bg-card border-std border`}>
                            <item.icon className={`absolute -bottom-8 -right-8 w-32 h-32 opacity-0 group-hover:opacity-10 transition-opacity duration-500 rotate-12 ${item.color}`} />
                            <div className="relative z-10 flex flex-col items-center">
                                <div className={`p-4 rounded-full transition-colors duration-300 mb-4 shadow-sm ${isDark ? 'bg-[#18181b] group-hover:bg-black border border-[#27272a]' : 'bg-gray-50 group-hover:bg-white'}`}>
                                    <item.icon size={32} className={`${item.color} transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110`} />
                                </div>
                                <span className={`font-bold text-lg text-main`}>{item.title}</span>
                                <span className={`text-sm mt-1 text-center text-sec`}>{item.sub}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const Contact = ({ showTop, theme, triggerToast }) => {
    const isDark = theme === 'dark';
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    const copyEmail = (e) => {
        e.preventDefault();
        navigator.clipboard.writeText('rajeevmarada02@gmail.com');
        triggerToast("Email copied to clipboard!");
    };

    return (
        <footer className={`py-20 border-t relative bg-main border-std`} id="contact">
            <div className="max-w-[800px] mx-auto px-6 text-center reveal-up">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-8 animate-float shadow-sm ${isDark ? 'bg-blue-900/20 text-blue-400 border border-blue-800/30' : 'bg-[#F2F6FC] text-[#0B57D0]'}`}>
                    <Send size={32} />
                </div>

                <h2 className={`text-3xl md:text-4xl font-bold mb-6 brand-font leading-tight text-main`}>
                    Open for interesting conversations.
                </h2>
                <p className={`text-lg max-w-lg mx-auto mb-12 leading-relaxed text-sec`}>
                    Whether it's about the future of RISC-V, a game of cricket, or just saying hello—my inbox is always open.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                    <a href="mailto:rajeevmarada02@gmail.com" className={`px-8 py-3 rounded-xl font-medium text-base transition-all duration-300 shadow-lg w-full sm:w-auto hover:-translate-y-1 ${isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-[#1F1F1F] text-white hover:bg-[#333] shadow-gray-200'}`}>
                        Say Hello
                    </a>
                    {/* Improved Copy Email Button */}
                    <button onClick={copyEmail} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-base transition-all duration-300 border hover:-translate-y-1 ${isDark ? 'border-gray-700 text-gray-400 hover:bg-white hover:text-black' : 'border-gray-200 text-[#444746] hover:bg-[#1F1F1F] hover:text-white'}`} title="Copy Email">
                        <Copy size={18} />
                        <span>Copy Email</span>
                    </button>
                    <div className="w-[1px] h-8 bg-gray-300 hidden sm:block mx-2"></div>
                    <div className="flex gap-3">
                        <a href="https://linkedin.com/in/rajeevmarada" className={`w-12 h-12 flex items-center justify-center rounded-xl border transition-all duration-300 hover:-translate-y-1 ${isDark ? 'border-gray-700 text-gray-400 hover:bg-[#0077B5] hover:text-white hover:border-[#0077B5]' : 'border-gray-200 text-[#444746] hover:bg-[#0077B5] hover:text-white hover:border-[#0077B5]'}`}>
                            <Linkedin size={20} />
                        </a>
                        <a href="https://github.com/RajeevMarada" className={`w-12 h-12 flex items-center justify-center rounded-xl border transition-all duration-300 hover:-translate-y-1 ${isDark ? 'border-gray-700 text-gray-400 hover:bg-white hover:text-black hover:border-white' : 'border-gray-200 text-[#444746] hover:bg-[#1F1F1F] hover:text-white hover:border-[#1F1F1F]'}`}>
                            <Github size={20} />
                        </a>
                    </div>
                </div>

                <div className={`text-xs flex flex-col md:flex-row items-center justify-center gap-6 uppercase tracking-widest font-bold text-sec`}>
                    <span>© 2025 Rajeev Marada</span>
                </div>
            </div>

            <button onClick={scrollToTop} className={`fixed bottom-10 right-10 p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 z-40 ${showTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'} ${isDark ? 'bg-white text-black hover:bg-blue-500 hover:text-white' : 'bg-[#1F1F1F] text-white hover:bg-[#0B57D0]'}`} title="Back to Top">
                <ArrowUp size={20} />
            </button>
        </footer>
    )
}

const App = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);
    const scrollProgress = useScrollProgress();

    // Toast State
    const [toast, setToast] = useState({ visible: false, message: '' });
    const triggerToast = (msg) => {
        setToast({ visible: true, message: msg });
    };

    // Enhanced Theme Logic: LocalStorage + System Preference
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('theme'); // Changed to localStorage
            if (savedTheme) return savedTheme;
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return 'light';
    });

    useEffect(() => {
        document.body.className = theme;
        localStorage.setItem('theme', theme); // Changed to localStorage
    }, [theme]);

    useEffect(() => {
        const favicon = document.createElement("link");
        favicon.rel = "icon";
        favicon.type = "image/svg+xml";
        favicon.href = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%231F1F1F'/%3E%3Ctext x='50' y='58' font-size='42' font-family='Plus Jakarta Sans, Roboto, sans-serif' fill='white' text-anchor='middle' font-weight='700'%3ERM%3C/text%3E%3C/svg%3E";

        // Remove existing icon if any
        const existingIcon = document.querySelector("link[rel*='icon']");
        if (existingIcon) {
            document.head.removeChild(existingIcon);
        }

        document.head.appendChild(favicon);

        return () => {
            // Cleanup on unmount (optional)
            if (document.head.contains(favicon)) {
                document.head.removeChild(favicon);
            }
        }
    }, []);

    const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
    useScrollObserver(isLoading, theme);
    const { activeSection, showTop } = useActiveSection();

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'selection:bg-blue-500/30 selection:text-blue-200' : 'selection:bg-[#D2E3FC] selection:text-[#174EA6]'}`}>
            <FontStyles />

            {/* New Global UI Elements */}
            <ScrollProgress progress={scrollProgress} theme={theme} />
            <Toast
                theme={theme}
                message={toast.message}
                isVisible={toast.visible}
                onClose={() => setToast({ ...toast, visible: false })}
            />

            {/* Loading Screen */}
            {isLoading && (
                <LoadingScreen
                    theme={theme}
                    isExiting={isLoaded}
                    onComplete={() => {
                        setIsLoaded(true);
                        setTimeout(() => setIsLoading(false), 700);
                    }}
                />
            )}

            {/* Main Content */}
            <div className={`transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                <CustomCursor />
                <Navbar
                    activeSection={activeSection}
                    theme={theme}
                    toggleTheme={toggleTheme}
                />
                <main className="relative z-10">
                    <Hero theme={theme} />
                    <OriginStory theme={theme} />
                    <TechArsenal theme={theme} />
                    <Journey theme={theme} />
                    <Projects theme={theme} />
                    <TheVault theme={theme} />
                    <IdleCycles theme={theme} />
                </main>
                <Contact showTop={showTop} theme={theme} triggerToast={triggerToast} />
            </div>
        </div>
    );
};

export default App;