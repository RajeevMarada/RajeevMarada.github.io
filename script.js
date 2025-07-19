document.addEventListener('DOMContentLoaded', function() {

    // --- Data for Dynamic Content ---

    const experienceData = [
        {
            company: "Cognizant Technology Solutions",
            role: "Programmer Analyst Trainee",
            date: "Jun 2024 - Present",
            description: "Contributing to the Enterprise Platform Services (EPS) team, focusing on Intelligent Process Management (IPM) using the APPIAN low-code platform. Collaborating on process automation and workflow optimization projects to enhance business efficiency."
        },
        {
            company: "Insemi Technology Services Pvt Ltd",
            role: "Junior Engineer - DV",
            date: "Jul 2023 - Oct 2023",
            description: "Developed proficiency in SystemVerilog (SV) and gained practical experience in Universal Verification Methodology (UVM) by developing test benches for various designs, including a Dual-Port RAM verification project."
        }
    ];

    const projectData = [
        {
            title: "RISC-V Based Hardware Accelerator for ECG Classification",
            description: "Designed a heterogeneous system integrating a RISC-V processor with a custom Verilog RTL hardware accelerator for real-time, 5-class ECG signal classification. Implemented a 5-layer neural network using fixed-point arithmetic and AXI Stream for efficient data transfer.",
            tech: ["Verilog", "RISC-V", "AXI Stream", "Neural Networks", "Fixed-Point Arithmetic"]
        },
        {
            title: "Neural Network Inference Engine",
            description: "Implemented a 3-layer neural network for handwritten digit classification. Developed Python code for model training (>85% accuracy) and designed the Verilog RTL inference engine with custom ROMs and FIFOs.",
            tech: ["Verilog", "Python", "Machine Learning", "Xilinx Vivado", "FIFO"]
        },
        {
            title: "APB Master UVC Development & Verification",
            description: "Created an end-to-end UVM-based testbench for APB protocol verification using master and slave UVCs. Developed UVM components and test cases to verify protocol compliance through assertions and functional coverage.",
            tech: ["SystemVerilog", "UVM", "APB Protocol", "Questa Sim", "Verification"]
        },
        {
            title: "SEC-DED-DAEC ECC on AHB-APB Bridge",
            description: "Developed a novel SEC-DED-DAEC ECC algorithm for SoC data pathways. Engineered and integrated a complete ECC module into an AHB-APB bridge to guarantee data integrity, optimizing the architecture for 16-bit data operations.",
            tech: ["Verilog", "SystemVerilog", "ECC", "AMBA", "Data Integrity", "IEEE Publication"]
        }
    ];

    const skillsData = [
        "Digital Design", "Verilog", "SystemVerilog (SV)", "UVM",
        "C", "C++", "Python",
        "Xilinx Vivado", "ModelSim", "Questa Sim",
        "Computer Architecture", "Hardware Acceleration", "AMBA (AHB/APB)",
        "AXI Protocol", "ECC", "Fixed-Point Arithmetic"
    ];


    // --- Functions to Populate Content ---

    function populateExperience() {
        const timeline = document.querySelector('.timeline');
        experienceData.forEach((job, index) => {
            const side = index % 2 === 0 ? 'left' : 'right';
            const timelineItem = document.createElement('div');
            timelineItem.className = `timeline-item ${side}`;
            timelineItem.innerHTML = `
                <div class="timeline-content">
                    <h3>${job.role}</h3>
                    <div class="date">${job.company} | ${job.date}</div>
                    <p>${job.description}</p>
                </div>
            `;
            timeline.appendChild(timelineItem);
        });
    }

    function populateProjects() {
        const projectGrid = document.querySelector('.project-grid');
        projectData.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            
            const techTags = project.tech.map(tag => `<span class="tech-tag">${tag}</span>`).join('');

            projectCard.innerHTML = `
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-tech">
                    ${techTags}
                </div>
            `;
            projectGrid.appendChild(projectCard);
        });
    }

    function populateSkills() {
        const skillsGrid = document.querySelector('.skills-grid');
        skillsData.forEach(skill => {
            const skillTag = document.createElement('div');
            skillTag.className = 'skill-tag';
            skillTag.textContent = skill;
            skillsGrid.appendChild(skillTag);
        });
    }

    // --- Smooth Scrolling ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // --- Scroll Animations ---
    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.scroll-fade').forEach(element => {
        scrollObserver.observe(element);
    });

    // --- Initial Population Calls ---
    populateExperience();
    populateProjects();
    populateSkills();

});
