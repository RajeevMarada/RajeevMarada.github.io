import React, { useState, useEffect, useRef } from 'react';
import {
    Menu, X, ChevronRight, ArrowRight, Github, Linkedin, Mail,
    Cpu, Zap, Activity, Layers,
    Box, Terminal, Globe, Award, FileText,
    CircuitBoard, CheckCircle2, ArrowUpRight,
    BookOpen, Camera, Music, Monitor, Coffee,
    Calendar, MapPin, MousePointer2, Smartphone, HardDrive,
    ChevronDown, ArrowUp
} from 'lucide-react';

/* --- THEME & ANIMATIONS --- */
const FontStyles = () => (
    <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Roboto:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap');
    
    body {
      font-family: 'Roboto', sans-serif;
      background-color: #FAFAFA;
      color: #1F1F1F;
      overflow-x: hidden;
      scroll-behavior: smooth;
      cursor: none; 
    }
    
    /* Custom Cursor */
    #cursor-follower {
      position: fixed;
      top: 0;
      left: 0;
      width: 20px;
      height: 20px;
      background-color: rgba(11, 87, 208, 0.2);
      border: 1px solid rgba(11, 87, 208, 0.5);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
      transition: width 0.2s, height 0.2s, background-color 0.2s;
      backdrop-filter: blur(2px);
    }
    body:hover #cursor-follower {
      opacity: 1;
    }
    a:hover ~ #cursor-follower, button:hover ~ #cursor-follower, .click-scale:hover ~ #cursor-follower {
      width: 40px;
      height: 40px;
      background-color: rgba(11, 87, 208, 0.1);
    }

    h1, h2, h3, h4, h5, .brand-font {
      font-family: 'Plus Jakarta Sans', sans-serif;
    }

    .mono-font {
      font-family: 'JetBrains+Mono', monospace;
    }

    /* Custom Scrollbar */
    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #E0E2EC; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #C4C7C5; }

    /* Staggered Reveal Animations */
    .reveal-up {
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 0.8s cubic-bezier(0.2, 0.0, 0.2, 1), transform 0.8s cubic-bezier(0.2, 0.0, 0.2, 1);
    }
    .reveal-up.active {
      opacity: 1;
      transform: translateY(0);
    }
    
    .stagger-1 { transition-delay: 100ms; }
    .stagger-2 { transition-delay: 200ms; }
    .stagger-3 { transition-delay: 300ms; }
    .stagger-4 { transition-delay: 400ms; }

    /* Idle Animations */
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-12px); }
    }
    .animate-float {
      animation: float 6s ease-in-out infinite;
    }
    
    @keyframes float-delayed {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-8px); }
    }
    .animate-float-delayed {
      animation: float-delayed 7s ease-in-out infinite 1s;
    }

    @keyframes pulse-glow {
      0%, 100% { box-shadow: 0 0 0 0px rgba(11, 87, 208, 0.2); }
      50% { box-shadow: 0 0 0 10px rgba(11, 87, 208, 0); }
    }
    
    .animate-pulse-soft {
      animation: pulse-glow 3s infinite;
    }

    /* UPDATED: Elegant Underline Highlighter */
    .highlight-hover {
      position: relative;
      font-weight: 600;
      color: #1F1F1F;
      cursor: default;
    }
    
    .highlight-hover::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 3px;
      bottom: 0;
      left: 0;
      background-color: #0B57D0; /* Google Blue */
      transform: scaleX(0);
      transform-origin: bottom right;
      transition: transform 0.3s ease-out;
      opacity: 0.8;
    }
    
    .highlight-hover:hover::after {
      transform: scaleX(1);
      transform-origin: bottom left;
    }

    /* Interactive Cards with Spring Physics */
    .hover-card {
      transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .hover-card:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.15);
      z-index: 10;
    }
    
    /* Click Feedback */
    .click-scale:active {
      transform: scale(0.92);
      transition: transform 0.1s;
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

            const elements = document.querySelectorAll('.reveal-up');
            elements.forEach(el => observer.observe(el));

            return () => observer.disconnect();
        }, 100);

        return () => clearTimeout(timer);
    }, [loading]);
};

const useActiveSection = () => {
    const [activeSection, setActiveSection] = useState('home');

    useEffect(() => {
        const handleScroll = () => {
            const sections = ['story', 'arsenal', 'journey', 'work', 'patents', 'contact'];
            let current = '';

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element && window.scrollY >= (element.offsetTop - 300)) {
                    current = section;
                }
            }
            setActiveSection(current);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return activeSection;
};

/* --- COMPONENTS --- */

const CustomCursor = () => {
    const cursorRef = useRef(null);

    useEffect(() => {
        const moveCursor = (e) => {
            if (cursorRef.current) {
                cursorRef.current.style.left = `${e.clientX}px`;
                cursorRef.current.style.top = `${e.clientY}px`;
            }
        };
        window.addEventListener('mousemove', moveCursor);
        return () => window.removeEventListener('mousemove', moveCursor);
    }, []);

    return <div id="cursor-follower" ref={cursorRef} className="hidden md:block pointer-events-none"></div>;
};

const LoadingScreen = ({ onComplete }) => {
    const [status, setStatus] = useState("Initializing...");

    useEffect(() => {
        // Optimized sequence for snappier load (approx 1.5s total)
        const timer1 = setTimeout(() => setStatus("Verifying Architecture..."), 400);
        const timer2 = setTimeout(() => setStatus("Loading Modules..."), 900);
        const timer3 = setTimeout(() => onComplete(), 1500);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
        };
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-6 transition-opacity duration-500">
            <div className="w-16 h-16 bg-[#F2F6FC] rounded-2xl flex items-center justify-center mb-8 animate-pulse">
                <CircuitBoard size={32} className="text-[#0B57D0]" />
            </div>

            <div className="w-64 h-1 bg-[#E0E2EC] rounded-full overflow-hidden mb-4">
                {/* Faster animation to match the 1.5s timeout */}
                <div className="h-full bg-[#0B57D0] animate-[load_1.5s_ease-in-out_forwards]" style={{ width: '0%', animationFillMode: 'forwards', animationName: 'loader-bar' }}></div>
            </div>

            <div className="font-mono text-sm text-[#444746]">{status}</div>
            <style>{`@keyframes loader-bar { 0% { width: 0%; } 100% { width: 100%; } }`}</style>
        </div>
    );
};

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const activeSection = useActiveSection();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/80 backdrop-blur-xl border-b border-gray-100 py-3 shadow-sm' : 'bg-transparent py-6'}`}>
            <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
                <a href="#" className="flex items-center gap-2 group click-scale">
                    <div className="w-10 h-10 rounded-xl bg-[#0B57D0] flex items-center justify-center text-white group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-blue-500/30">
                        <CircuitBoard size={20} />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold brand-font text-lg leading-none text-[#1F1F1F]">Rajeev Marada</span>
                        <span className="text-xs text-[#0B57D0] font-bold tracking-wide">VLSI ENGINEER</span>
                    </div>
                </a>

                <div className="hidden md:flex items-center bg-white/80 backdrop-blur-md border border-gray-200 rounded-full px-1.5 py-1.5 shadow-sm transition-all hover:shadow-md hover:border-gray-300">
                    {['Story', 'Arsenal', 'Journey', 'Work', 'Patents'].map((item) => (
                        <a
                            key={item}
                            href={`#${item.toLowerCase()}`}
                            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 click-scale ${activeSection === item.toLowerCase() ? 'bg-[#1F1F1F] text-white shadow-md' : 'text-[#444746] hover:bg-gray-100'}`}
                        >
                            {item}
                        </a>
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    <a
                        href="mailto:rajeevmarada02@gmail.com"
                        className="px-5 py-2.5 bg-[#1F1F1F] text-white rounded-full text-sm font-medium hover:bg-[#0B57D0] hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 flex items-center gap-2 click-scale group"
                    >
                        <Mail size={16} className="group-hover:animate-bounce" /> <span className="hidden sm:inline">Connect</span>
                    </a>
                    <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-[#444746] bg-white rounded-full shadow-sm border border-gray-100">
                        {isOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-100 p-6 shadow-xl md:hidden flex flex-col gap-4 animate-in slide-in-from-top-4">
                    {['Story', 'Arsenal', 'Journey', 'Work', 'Patents'].map((item) => (
                        <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setIsOpen(false)} className="text-lg font-medium text-[#1F1F1F] py-3 border-b border-gray-50 flex items-center justify-between">
                            {item} <ChevronRight size={16} className="text-gray-400" />
                        </a>
                    ))}
                </div>
            )}
        </nav>
    );
};

const Hero = () => {
    return (
        <section className="pt-32 pb-20 px-6 max-w-[1400px] mx-auto min-h-[90vh] flex items-center relative">
            {/* Ambient Background Blobs */}
            <div className="absolute top-20 left-[-10%] w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-[100px] animate-float -z-10 pointer-events-none"></div>
            <div className="absolute bottom-20 right-[-10%] w-[500px] h-[500px] bg-green-100/40 rounded-full blur-[100px] animate-float-delayed -z-10 pointer-events-none"></div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">

                <div className="flex flex-col items-start text-left space-y-8 reveal-up active">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E0E2EC] shadow-sm text-[#1F1F1F] text-xs font-bold tracking-wider uppercase animate-float hover:shadow-md transition-shadow cursor-default">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Available for new roles
                    </div>

                    <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-[#1F1F1F] leading-[0.95] brand-font">
                        Hardware. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0B57D0] to-[#1F1F1F]">Defined.</span>
                    </h1>

                    <p className="text-xl text-[#444746] max-w-lg leading-relaxed font-light">
                        Dedicated VLSI engineer with advanced certification from IISc Bangalore.
                        Specializing in <span className="highlight-hover">SoC Architecture</span>, <span className="highlight-hover">RISC-V</span>, and <span className="highlight-hover">UVM Verification</span>.
                    </p>

                    <div className="flex flex-wrap gap-4 pt-4">
                        <a href="#work" className="px-8 py-4 bg-[#1F1F1F] text-white rounded-2xl font-medium text-lg hover:bg-[#333] hover:shadow-2xl hover:shadow-black/20 transition-all flex items-center gap-2 click-scale hover:-translate-y-1">
                            View Benchmarks <ArrowRight size={18} />
                        </a>
                        <a href="Rajeev-Marada-Updated-Resume.pdf" target="_blank" className="px-8 py-4 bg-white border border-gray-200 text-[#1F1F1F] rounded-2xl font-medium text-lg hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center gap-2 click-scale hover:-translate-y-1">
                            Resume <FileText size={18} />
                        </a>
                    </div>
                </div>

                {/* Right Pane: KPI Dashboard with Idle Animations */}
                <div className="relative reveal-up active" style={{ transitionDelay: '200ms' }}>
                    {/* Abstract Card Stack Effect */}
                    <div className="absolute inset-0 bg-[#F2F6FC] rounded-[40px] -z-10 rotate-3 scale-105 opacity-50 animate-pulse-soft" />
                    <div className="absolute inset-0 bg-[#E8F0FE] rounded-[40px] -z-20 -rotate-2 scale-105 opacity-30" />

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#1F1F1F] text-white p-6 rounded-[32px] hover-card col-span-2 sm:col-span-1 min-h-[180px] flex flex-col justify-between relative overflow-hidden group cursor-default stagger-1">
                            <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity animate-float" style={{ animationDelay: '1s' }}>
                                <Award size={64} />
                            </div>
                            <div>
                                <div className="text-[#C4EED0] text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <span className="w-1 h-1 bg-[#C4EED0] rounded-full"></span> Granted IP
                                </div>
                                <div className="text-3xl font-bold brand-font">IN 564400</div>
                            </div>
                            <div className="text-sm text-gray-400 mt-4 leading-tight">
                                Autonomous Vehicle Safety System with Bio-Feedback.
                            </div>
                        </div>

                        <div className="bg-white border border-gray-100 p-6 rounded-[32px] hover-card col-span-2 sm:col-span-1 min-h-[180px] flex flex-col justify-between cursor-default stagger-2">
                            <div className="w-12 h-12 bg-[#E0E2EC] rounded-full flex items-center justify-center text-[#1F1F1F] mb-4 animate-float" style={{ animationDelay: '2s' }}>
                                <Calendar size={24} />
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-[#1F1F1F] brand-font mb-1">2+ Yrs</div>
                                <div className="text-sm text-[#444746]">
                                    Industrial Experience<br />
                                    <span className="text-xs text-gray-400">Cognizant • InSemi • CoreEL</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-100 p-6 rounded-[32px] hover-card col-span-2 sm:col-span-1 min-h-[180px] flex flex-col justify-between cursor-default stagger-3">
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

                        <div className="bg-[#C4EED0] p-6 rounded-[32px] hover-card col-span-2 sm:col-span-1 min-h-[180px] flex flex-col justify-between relative overflow-hidden cursor-default stagger-4">
                            <CircuitBoard className="absolute -bottom-4 -right-4 text-[#0D3818] opacity-10 w-32 h-32 animate-pulse-soft" />
                            <div>
                                <div className="text-[#0D3818] text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <span className="w-1 h-1 bg-[#0D3818] rounded-full"></span> Portfolio
                                </div>
                                <div className="text-4xl font-bold text-[#0D3818] brand-font">5 Major</div>
                            </div>
                            <div className="text-[#0D3818] font-medium mt-2">
                                Architectures Deployed <br />
                                <span className="text-xs opacity-70">RTL • UVM • FPGA</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

/* --- ORIGIN STORY (With Correct Data) --- */
const OriginStory = () => {
    return (
        <section className="py-24 bg-white relative" id="story">
            <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

                <div className="reveal-up">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="w-12 h-1 bg-[#0B57D0] rounded-full"></span>
                        <span className="text-[#0B57D0] font-bold tracking-wider uppercase text-sm">The Origin</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold text-[#1F1F1F] mb-8 brand-font leading-tight">
                        It started with a <span className="text-[#0B57D0]">broken PS2.</span>
                    </h2>

                    <div className="space-y-6 text-lg text-[#444746] leading-relaxed">
                        <p>
                            My journey didn't start in a lecture hall. It began when my <span className="highlight-hover">PlayStation 2 died</span>.
                            Instead of replacing it, I decided to investigate. Troubleshooting that console taught me the most valuable engineering lesson:
                            <span className="italic text-[#1F1F1F]"> everything is built by someone, and everything can be fixed.</span>
                        </p>
                        <p>
                            This curiosity evolved. I obtained a <span className="highlight-hover">Samsung Galaxy Tab 2</span> and learned about custom ROMs—modified OS versions to squeeze out extra performance. Eventually, I <span className="highlight-hover">built my first PC</span> from scratch, learning to respect thermals, voltages, and component compatibility.
                        </p>
                        <p>
                            Today, I don't just assemble hardware; I architect the silicon that makes it possible.
                        </p>
                    </div>
                </div>

                <div className="relative h-[600px] lg:h-[500px] bg-[#F8FAFC] rounded-[40px] border border-gray-100 p-8 flex flex-col justify-center overflow-hidden reveal-up" style={{ transitionDelay: '200ms' }}>
                    {/* Connecting Trace Line */}
                    <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 md:-translate-x-1/2" />

                    <div className="space-y-12 relative z-10">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:translate-x-[-20px] group hover-card p-4 bg-white rounded-2xl border border-gray-100 transition-all duration-300 cursor-default">
                            <div className="w-14 h-14 bg-[#fffbf0] border-2 border-[#1F1F1F] rounded-2xl flex items-center justify-center shadow-lg z-10 shrink-0">
                                <MousePointer2 size={24} className="text-[#1F1F1F]" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-[#1F1F1F] text-lg">The Tinkerer</h4>
                                <p className="text-sm text-[#444746]">PlayStation 2 Teardown & Repair</p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row-reverse items-start md:items-center gap-6 md:translate-x-[20px] group hover-card p-4 bg-white rounded-2xl border border-gray-100 transition-all duration-300 cursor-default">
                            <div className="w-14 h-14 bg-[#eef5ff] border-2 border-[#0B57D0] rounded-2xl flex items-center justify-center shadow-lg z-10 shrink-0">
                                <Smartphone size={24} className="text-[#0B57D0]" />
                            </div>
                            <div className="flex-1 md:text-right">
                                <h4 className="font-bold text-[#1F1F1F] text-lg">The Optimizer</h4>
                                <p className="text-sm text-[#444746]">Galaxy Tab 2 Custom ROMs</p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:translate-x-[-20px] group hover-card p-4 bg-white rounded-2xl border border-gray-100 transition-all duration-300 cursor-default">
                            <div className="w-14 h-14 bg-[#f0fdf4] border-2 border-[#0D3818] rounded-2xl flex items-center justify-center shadow-lg z-10 shrink-0">
                                <HardDrive size={24} className="text-[#0D3818]" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-[#1F1F1F] text-lg">The Builder</h4>
                                <p className="text-sm text-[#444746]">Custom PC Assembly & Overclocking</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

/* --- TECH ARSENAL (Updated Data) --- */
const TechArsenal = () => {
    return (
        <section className="py-24 px-6 max-w-[1400px] mx-auto" id="arsenal">
            <div className="mb-16 reveal-up">
                <h2 className="text-4xl md:text-5xl font-bold text-[#1F1F1F] mb-6 brand-font">
                    Tech Arsenal.
                </h2>
                <p className="text-xl text-[#444746] max-w-2xl">
                    My toolbox for converting requirements into silicon.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div className="md:col-span-2 bg-[#1F1F1F] text-white rounded-[32px] p-10 relative overflow-hidden group hover-card reveal-up">
                    <div className="relative z-10">
                        <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md animate-float">
                            <Cpu size={28} />
                        </div>
                        <h3 className="text-3xl font-bold mb-4 brand-font">Digital Design & Verification</h3>
                        <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-xl">
                            Expertise in constructing robust UVM testbenches, achieving 100% coverage, and synthesizing RTL for high-performance SoCs.
                        </p>

                        <div className="flex flex-wrap gap-3">
                            {['SystemVerilog', 'UVM', 'RTL Design', 'FPGA Prototyping', 'Xilinx Vivado', 'Verification'].map((skill) => (
                                <span key={skill} className="px-4 py-2 bg-white/10 border border-white/20 rounded-full text-sm font-medium hover:bg-white hover:text-black transition-colors cursor-default">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="absolute right-0 bottom-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                        <CircuitBoard size={300} className="animate-pulse-soft" />
                    </div>
                </div>

                <div className="bg-[#F2F6FC] rounded-[32px] p-8 flex flex-col hover-card group reveal-up stagger-1">
                    <div className="flex items-center gap-3 mb-6">
                        <Terminal className="text-[#0B57D0]" />
                        <h3 className="text-xl font-bold text-[#1F1F1F]">Languages</h3>
                    </div>
                    <div className="flex flex-wrap gap-2 content-start">
                        {[
                            { name: 'SystemVerilog', color: 'bg-[#0B57D0] text-white' },
                            { name: 'Verilog RTL', color: 'bg-[#0B57D0] text-white' },
                            { name: 'Python', color: 'bg-white text-[#1F1F1F] border border-gray-200' },
                            { name: 'C / C++', color: 'bg-white text-[#1F1F1F] border border-gray-200' },
                            { name: 'MATLAB', color: 'bg-white text-[#1F1F1F] border border-gray-200' }
                        ].map((lang, idx) => (
                            <span
                                key={lang.name}
                                className={`px-4 py-2 rounded-xl font-medium text-sm ${lang.color} hover:scale-105 transition-transform cursor-default shadow-sm`}
                                style={{ transitionDelay: `${idx * 50}ms` }}
                            >
                                {lang.name}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="bg-white border border-gray-100 rounded-[32px] p-8 hover-card reveal-up stagger-2">
                    <div className="flex items-center gap-3 mb-6">
                        <Box className="text-[#1F1F1F]" />
                        <h3 className="text-xl font-bold text-[#1F1F1F]">Toolchain</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {['Vivado', 'ModelSim', 'Questa Sim', 'Cadence Virtuoso', 'LaTeX', 'HOMER Pro', 'Git'].map((tool) => (
                            <div key={tool} className="p-3 rounded-xl bg-[#FAFAFA] border border-gray-100 text-sm font-medium text-[#444746] text-center hover:bg-[#1F1F1F] hover:text-white hover:border-transparent transition-colors cursor-default">
                                {tool}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="md:col-span-2 bg-[#E0E2EC] rounded-[32px] p-8 flex flex-col md:flex-row items-center gap-8 hover-card group reveal-up stagger-3">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                            <Layers className="text-[#1F1F1F]" />
                            <h3 className="text-2xl font-bold text-[#1F1F1F]">System Architecture</h3>
                        </div>
                        <p className="text-[#444746] mb-6">
                            Designing heterogeneous SoCs with custom accelerators.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm hover:scale-105 transition-transform cursor-default group/item">
                                <Activity size={16} className="text-green-600 group-hover/item:animate-bounce" />
                                <span className="font-bold text-sm">RISC-V Core</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm hover:scale-105 transition-transform cursor-default group/item">
                                <Zap size={16} className="text-yellow-600 group-hover/item:animate-pulse" />
                                <span className="font-bold text-sm">Low Power</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm hover:scale-105 transition-transform cursor-default group/item">
                                <Globe size={16} className="text-blue-600 group-hover/item:animate-spin" />
                                <span className="font-bold text-sm">AMBA AXI/APB</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm hover:scale-105 transition-transform cursor-default group/item">
                                <Cpu size={16} className="text-purple-600 group-hover/item:animate-pulse" />
                                <span className="font-bold text-sm">Neuromorphic</span>
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-1/3 aspect-video bg-white rounded-xl border border-white/50 shadow-inner flex items-center justify-center relative overflow-hidden group-hover:shadow-lg transition-shadow">
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.05)_25%,rgba(0,0,0,0.05)_50%,transparent_50%,transparent_75%,rgba(0,0,0,0.05)_75%,rgba(0,0,0,0.05)_100%)] bg-[length:20px_20px]"></div>
                        <div className="font-mono text-xs text-[#444746] z-10">
                    // Architecture Spec<br />
                            module soc_top (<br />
                            &nbsp;&nbsp;input clk,<br />
                            &nbsp;&nbsp;input rst_n<br />
                            );
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

/* --- JOURNEY (Updated Data) --- */
const Journey = () => {
    return (
        <section className="py-24 bg-[#1F1F1F] text-white" id="journey">
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="text-center mb-20 reveal-up">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 brand-font">The Circuit Path</h2>
                    <p className="text-gray-400">My professional execution pipeline.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">

                    <div className="reveal-up">
                        <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                            <BriefcaseIcon size={24} className="text-[#0B57D0]" /> Experience
                        </h3>
                        <div className="space-y-12 border-l border-gray-800 ml-3 pl-8">
                            <div className="relative group cursor-default">
                                <div className="absolute -left-[37px] top-1 w-4 h-4 rounded-full bg-[#0B57D0] shadow-[0_0_15px_#0B57D0] group-hover:scale-150 transition-transform duration-300"></div>
                                <div className="text-[#0B57D0] font-bold text-sm mb-1">Aug 2024 - Present</div>
                                <h4 className="text-xl font-bold mb-1 group-hover:text-[#0B57D0] transition-colors">Programmer Analyst</h4>
                                <div className="text-gray-400 mb-3">Cognizant Technology Solutions</div>
                                <p className="text-sm text-gray-500 leading-relaxed group-hover:text-gray-300 transition-colors">
                                    Automated key business workflows on the APPIAN low-code platform. Collaborated on cross-functional projects to analyze and optimize enterprise-level processes.
                                </p>
                            </div>

                            <div className="relative group cursor-default">
                                <div className="absolute -left-[37px] top-1 w-4 h-4 rounded-full bg-gray-600 group-hover:bg-[#C4EED0] group-hover:scale-150 transition-all duration-300"></div>
                                <div className="text-gray-400 font-bold text-sm mb-1">Jul 2023 - Oct 2023</div>
                                <h4 className="text-xl font-bold mb-1 group-hover:text-[#C4EED0] transition-colors">Junior Design Verification Engineer</h4>
                                <div className="text-gray-400 mb-3">Insemi Technology Services</div>
                                <p className="text-sm text-gray-500 leading-relaxed group-hover:text-gray-300 transition-colors">
                                    Developed UVM testbench for Dual-Port RAM with 100% functional coverage. Wrote SystemVerilog assertions to validate protocol compliance and debug flaws.
                                </p>
                            </div>

                            <div className="relative group cursor-default">
                                <div className="absolute -left-[37px] top-1 w-4 h-4 rounded-full bg-gray-600 group-hover:bg-[#FBBC04] group-hover:scale-150 transition-all duration-300"></div>
                                <div className="text-gray-400 font-bold text-sm mb-1">Dec 2022 - Jan 2023</div>
                                <h4 className="text-xl font-bold mb-1 group-hover:text-[#FBBC04] transition-colors">Intern</h4>
                                <div className="text-gray-400 mb-3">Maven Silicon</div>
                                <p className="text-sm text-gray-500 leading-relaxed group-hover:text-gray-300 transition-colors">
                                    Designed compliant AMBA AHB-APB bridge in Verilog. Deepened understanding of FSM architecture and module integration.
                                </p>
                            </div>

                            <div className="relative group cursor-default">
                                <div className="absolute -left-[37px] top-1 w-4 h-4 rounded-full bg-gray-600 group-hover:bg-white group-hover:scale-150 transition-all duration-300"></div>
                                <div className="text-gray-400 font-bold text-sm mb-1">Jun 2022 - Jul 2022</div>
                                <h4 className="text-xl font-bold mb-1 group-hover:text-white transition-colors">Intern</h4>
                                <div className="text-gray-400 mb-3">CoreEl Technologies</div>
                                <p className="text-sm text-gray-500 leading-relaxed group-hover:text-gray-300 transition-colors">
                                    Developed SystemVerilog testbench for full adder DUT. Achieved 100% functional and code coverage through assertion-based verification.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="reveal-up" style={{ transitionDelay: '200ms' }}>
                        <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                            <GraduationCapIcon size={24} className="text-[#C4EED0]" /> Education
                        </h3>
                        <div className="space-y-12 border-l border-gray-800 ml-3 pl-8">
                            <div className="relative group cursor-default">
                                <div className="absolute -left-[37px] top-1 w-4 h-4 rounded-full bg-[#C4EED0] shadow-[0_0_10px_#C4EED0] group-hover:scale-150 transition-transform duration-300"></div>
                                <div className="text-[#C4EED0] font-bold text-sm mb-1">Feb 2024 - Dec 2024</div>
                                <h4 className="text-xl font-bold mb-1 group-hover:text-[#C4EED0] transition-colors">PG Advanced Certification</h4>
                                <div className="text-gray-400 mb-3">Indian Institute of Science (IISc)</div>
                                <div className="inline-block bg-[#1F1F1F] border border-gray-700 px-3 py-1 rounded-full text-xs text-gray-300 group-hover:border-[#C4EED0] transition-colors">
                                    VLSI Chip Design • 80% Score
                                </div>
                            </div>

                            <div className="relative group cursor-default">
                                <div className="absolute -left-[37px] top-1 w-4 h-4 rounded-full bg-gray-600 group-hover:bg-white group-hover:scale-150 transition-all duration-300"></div>
                                <div className="text-gray-400 font-bold text-sm mb-1">Jun 2019 - May 2023</div>
                                <h4 className="text-xl font-bold mb-1 group-hover:text-white transition-colors">B.Tech, ECE</h4>
                                <div className="text-gray-400 mb-3">SRM Institute of Science and Technology</div>
                                <div className="inline-block bg-[#1F1F1F] border border-gray-700 px-3 py-1 rounded-full text-xs text-gray-300 group-hover:border-white transition-colors">
                                    9.4 CGPA
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

/* --- PROJECTS (Updated Data) --- */
const Projects = () => {
    const [activeProject, setActiveProject] = useState(null);

    const toggleProject = (index) => {
        setActiveProject(activeProject === index ? null : index);
    };

    const projects = [
        {
            title: "RISC-V ECG Accelerator",
            category: "Heterogeneous SoC Design",
            img: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1035&auto=format&fit=crop",
            desc: "Engineered a heterogeneous SoC integrating a RISC-V processor and a custom neural network via AXI Stream, achieving 92% accuracy in real-time ECG classification through Q1.15 fixed-point arithmetic optimization.",
            tech: ["RISC-V", "AXI Stream", "Neural Networks", "FPGA"],
            deepContext: "Engineered a heterogeneous SoC integrating a RISC-V processor and a custom neural network via the AXI Stream protocol. The system achieved 92% accuracy in real-time ECG classification using Q1.15 fixed-point arithmetic optimization. Validated the complete design through simulation and deployment on FPGA hardware, demonstrating robust real-time performance."
        },
        {
            title: "Neural Net RTL Engine",
            category: "Hardware Inference",
            img: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=1035&auto=format&fit=crop",
            desc: "Designed a Verilog RTL 3-layer neural network inference engine with ROM-based weights and FIFO input, achieving over 85% accuracy on the Semeion dataset.",
            tech: ["Verilog RTL", "Neural Networks", "Vivado"],
            deepContext: "Designed and implemented a Verilog RTL 3-layer neural network inference engine with custom ROM-based weights and FIFO input. Achieved over 85% accuracy on the Semeion dataset through efficient fixed-point hardware conversion. Performed full simulation, synthesis, and implementation in Xilinx Vivado, establishing timing closure for FPGA deployment."
        },
        {
            title: "APB UVM Testbench",
            category: "Advanced Verification",
            img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1035&auto=format&fit=crop",
            desc: "Architected a modular UVM testbench with reusable master/slave agents to rigorously validate APB protocol compliance. Achieved 100% functional and code coverage.",
            tech: ["UVM", "SystemVerilog", "100% Coverage"],
            deepContext: "Architected a modular UVM testbench, developing reusable master/slave agents and environment components to rigorously validate APB protocol compliance. Achieved 100% functional and code coverage and confirmed design robustness through complete assertion coverage, ensuring error-free operation."
        },
        {
            title: "SEC-DED-DAEC Module",
            category: "Data Integrity (IEEE Published)",
            img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1067&auto=format&fit=crop",
            desc: "Led development of a novel SEC-DED-DAEC error-correcting module, optimizing reversible logic to achieve 5.67% power reduction and 4.52% delay improvement.",
            tech: ["Error Correction", "Low-Power", "IEEE Published"],
            deepContext: "Led development of a novel SEC-DED-DAEC error-correcting module and integrated it into an AHB-APB bridge to ensure data integrity for system-on-chip pathways. Optimized the reversible logic implementation to achieve a 5.67% reduction in power consumption and a 4.52% improvement in critical path delay, culminating in an IEEE publication."
        },
        {
            title: "Hybrid Hack 2021 Finalist",
            category: "Cross-Domain Innovation",
            img: "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1458",
            desc: "Co-developed 'Charge On Go,' a novel vehicle-mounted hybrid power system. Simulated electrical performance projecting 465.15 kWh annual energy generation.",
            tech: ["Python", "HOMER Pro", "Unity & C#"],
            deepContext: "Co-developed a novel vehicle-mounted hybrid power system to generate electricity during transit and supply it back to the grid. Simulated the system's electrical performance using Python and HOMER Pro, projecting an annual energy generation of 465.15 kWh per unit. Leveraged game development hobby to build an interactive 3D simulation in Unity for investor demonstration."
        }
    ];

    return (
        <section className="py-24 px-6 max-w-[1400px] mx-auto" id="work">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1F1F1F] mb-16 brand-font reveal-up">ARCHIVES</h2>

            <div className="space-y-20">
                {projects.map((project, idx) => (
                    <div
                        key={idx}
                        className={`flex flex-col md:flex-row gap-12 items-center reveal-up ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                    >
                        <div className="w-full md:w-1/2 aspect-[4/3] rounded-[32px] overflow-hidden shadow-2xl relative group hover-card cursor-pointer" onClick={() => toggleProject(idx)}>
                            <img
                                src={project.img}
                                alt={project.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>

                            {/* Image Overlay Hint */}
                            <div className="absolute bottom-4 right-4 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <ArrowUpRight size={24} className="text-[#1F1F1F]" />
                            </div>
                        </div>

                        <div className="w-full md:w-1/2">
                            <div className="text-[#0B57D0] font-bold text-sm tracking-widest uppercase mb-3">{project.category}</div>
                            <h3 className="text-3xl md:text-4xl font-bold text-[#1F1F1F] mb-6 brand-font">{project.title}</h3>
                            <p className="text-lg text-[#444746] leading-relaxed mb-6">
                                {project.desc}
                            </p>

                            <ul className="flex flex-wrap gap-2 mb-8">
                                {project.tech.map((t) => (
                                    <li key={t} className="px-3 py-1 bg-[#F2F6FC] text-[#1F1F1F] text-sm font-medium rounded-lg hover:bg-[#E0E2EC] transition-colors cursor-default">
                                        {t}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => toggleProject(idx)}
                                className="group flex items-center gap-2 text-[#1F1F1F] font-bold border-b-2 border-transparent hover:border-[#0B57D0] transition-all pb-1 click-scale"
                            >
                                {activeProject === idx ? 'Close Details' : 'Read More'}
                                <ChevronDown
                                    size={18}
                                    className={`transition-transform duration-300 ${activeProject === idx ? 'rotate-180' : ''}`}
                                />
                            </button>

                            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${activeProject === idx ? 'max-h-[500px] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
                                <div className="p-6 bg-[#F8FAFC] rounded-2xl border border-gray-100 text-[#444746] text-sm leading-relaxed shadow-inner">
                                    {project.deepContext}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

/* --- IDLE CYCLES --- */
const IdleCycles = () => {
    return (
        <section className="py-24 bg-[#FAFAFA]" id="lifestyle">
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="flex items-center gap-4 mb-12 reveal-up">
                    <Coffee className="text-[#1F1F1F] w-8 h-8 animate-float" />
                    <h2 className="text-3xl font-bold text-[#1F1F1F] brand-font">Idle Cycles</h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 reveal-up stagger-1">
                    <div className="aspect-[4/3] bg-white rounded-[32px] flex flex-col items-center justify-center p-6 hover:bg-[#E0E2EC] transition-colors border border-gray-100 cursor-default group hover-card">
                        <Camera size={32} className="text-[#444746] mb-4 group-hover:scale-110 transition-transform" />
                        <span className="font-bold text-[#1F1F1F] text-lg">Photography</span>
                        <span className="text-sm text-[#444746] mt-1">Chasing shots</span>
                    </div>
                    <div className="aspect-[4/3] bg-white rounded-[32px] flex flex-col items-center justify-center p-6 hover:bg-[#E0E2EC] transition-colors border border-gray-100 cursor-default group hover-card">
                        <Music size={32} className="text-[#444746] mb-4 group-hover:scale-110 transition-transform" />
                        <span className="font-bold text-[#1F1F1F] text-lg">Music</span>
                        <span className="text-sm text-[#444746] mt-1">Curating playlists</span>
                    </div>
                    <div className="aspect-[4/3] bg-white rounded-[32px] flex flex-col items-center justify-center p-6 hover:bg-[#E0E2EC] transition-colors border border-gray-100 cursor-default group hover-card">
                        <Monitor size={32} className="text-[#444746] mb-4 group-hover:scale-110 transition-transform" />
                        <span className="font-bold text-[#1F1F1F] text-lg">eSports</span>
                        <span className="text-sm text-[#444746] mt-1">Competitive analysis</span>
                    </div>
                    <div className="aspect-[4/3] bg-white rounded-[32px] flex flex-col items-center justify-center p-6 hover:bg-[#E0E2EC] transition-colors border border-gray-100 cursor-default group hover-card">
                        <Activity size={32} className="text-[#444746] mb-4 group-hover:scale-110 transition-transform" />
                        <span className="font-bold text-[#1F1F1F] text-lg">Cricket</span>
                        <span className="text-sm text-[#444746] mt-1">On-field strategy</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

/* --- WHITEPAPERS & IP (Updated Data) --- */
const TheVault = () => {
    return (
        <section className="py-24 px-6 max-w-[1400px] mx-auto" id="patents">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1F1F1F] mb-12 brand-font text-center reveal-up">Intellectual Property</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div className="bg-white p-8 rounded-[32px] shadow-xl border border-yellow-100 relative overflow-hidden group hover:transform hover:scale-105 transition-all duration-300 reveal-up">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FBBC04] to-[#F2F6FC]"></div>
                    <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#FBBC04] opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity"></div>

                    <div className="flex justify-between items-start mb-8">
                        <div className="p-3 bg-yellow-50 rounded-xl text-[#FBBC04] animate-float">
                            <Award size={32} />
                        </div>
                        <span className="px-3 py-1 bg-[#1F1F1F] text-white text-xs font-bold uppercase rounded-full tracking-wider">Granted</span>
                    </div>

                    <h3 className="text-2xl font-bold text-[#1F1F1F] mb-2 brand-font">Autonomous Vehicle Safety System</h3>
                    <p className="font-mono text-sm text-[#0B57D0] mb-4">Patent No: IN 564400</p>
                    <p className="text-[#444746] text-sm leading-relaxed mb-6">
                        Addressed driver incapacitation risks by developing a real-time controller for vital-sign sensors and actuator feedback loops. Dual-processor architecture triggers safe autonomous takeover.
                    </p>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">March 2025</div>
                </div>

                <div className="space-y-6 reveal-up" style={{ transitionDelay: '100ms' }}>
                    <div className="bg-white p-6 rounded-[24px] border border-gray-100 hover:border-[#0B57D0] transition-colors shadow-sm group cursor-pointer hover-card">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-blue-50 rounded-lg text-[#0B57D0]">
                                <FileText size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-[#1F1F1F] group-hover:text-[#0B57D0] transition-colors">Error Correction in SoC</h4>
                                <p className="text-xs text-[#444746]">IEEE RAEEUCCI 2023 • Reversible Logic Implementation</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-[24px] border border-gray-100 hover:border-[#0B57D0] transition-colors shadow-sm group cursor-pointer hover-card">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-blue-50 rounded-lg text-[#0B57D0]">
                                <FileText size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-[#1F1F1F] group-hover:text-[#0B57D0] transition-colors">IoT Healthcare Systems</h4>
                                <p className="text-xs text-[#444746]">GIJET 2022 • Affordable Architecture Survey</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

/* --- CONTACT --- */
const Contact = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="bg-white py-20 border-t border-gray-100 relative" id="contact">
            <div className="max-w-[1000px] mx-auto px-6 text-center reveal-up">
                <div className="w-16 h-16 bg-[#F2F6FC] rounded-2xl flex items-center justify-center mx-auto mb-8 text-[#0B57D0] animate-float">
                    <Mail size={32} />
                </div>

                <h2 className="text-4xl md:text-5xl font-bold text-[#1F1F1F] mb-6 brand-font">Let's build next-gen silicon.</h2>
                <p className="text-xl text-[#444746] max-w-xl mx-auto mb-10">
                    Open to collaborations on VLSI research, hardware innovation, and next-gen computing challenges.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                    <a
                        href="mailto:rajeevmarada02@gmail.com"
                        className="px-8 py-4 bg-[#1F1F1F] text-white rounded-full font-bold text-lg hover:bg-[#0B57D0] transition-colors shadow-lg shadow-blue-900/10 w-full sm:w-auto click-scale"
                    >
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

            {/* Back to Top Button */}
            <button
                onClick={scrollToTop}
                className="absolute bottom-10 right-10 p-3 bg-[#1F1F1F] text-white rounded-full shadow-lg hover:bg-[#0B57D0] transition-colors animate-bounce hidden md:block"
                title="Back to Top"
            >
                <ArrowUp size={20} />
            </button>
        </footer>
    )
}

/* --- ICONS HELPER --- */
const BriefcaseIcon = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="14" x="2" y="7" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
)
const GraduationCapIcon = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
)

const App = () => {
    const [loading, setLoading] = useState(true);
    useScrollObserver(loading);

    if (loading) {
        return (
            <>
                <FontStyles />
                <LoadingScreen onComplete={() => setLoading(false)} />
            </>
        )
    }

    return (
        <div className="min-h-screen bg-white selection:bg-[#D2E3FC] selection:text-[#174EA6]">
            <FontStyles />
            <CustomCursor />
            <Navbar />
            <main className="relative z-10">
                <Hero />
                <OriginStory />
                <TechArsenal />
                <Journey />
                <Projects />
                <TheVault />
                <IdleCycles />
            </main>
            <Contact />
        </div>
    );
};

export default App;