interface ProjectCardProps {
  title: string;
  description: string;
  imageUrl: string;
  technologies: string[];
  liveUrl?: string;
  codeUrl?: string;
}

function ProjectCard({ title, description, imageUrl, technologies, liveUrl, codeUrl }: ProjectCardProps) {
  return (
    <div className="project-card bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
      <img 
        src={imageUrl} 
        alt={`${title} interface`} 
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-600 mb-4 leading-relaxed">{description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {technologies.map((tech, index) => (
            <span 
              key={index}
              className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded"
            >
              {tech}
            </span>
          ))}
        </div>
        <div className="flex space-x-3">
          {liveUrl && (
            <a 
              href={liveUrl} 
              className="text-blue-600 hover:text-blue-800 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fas fa-external-link-alt"></i> Live Demo
            </a>
          )}
          {codeUrl && (
            <a 
              href={codeUrl} 
              className="text-slate-600 hover:text-slate-800 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-github"></i> Code
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const projects = [
    {
      title: "E-Commerce Platform",
      description: "A full-stack e-commerce solution with React, Node.js, and MongoDB. Features include user authentication, payment integration, and admin dashboard.",
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=300",
      technologies: ["React", "Node.js", "MongoDB"],
      liveUrl: "https://example.com",
      codeUrl: "https://github.com"
    },
    {
      title: "Task Management App",
      description: "A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.",
      imageUrl: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=300",
      technologies: ["React", "Socket.io", "Express"],
      liveUrl: "https://example.com",
      codeUrl: "https://github.com"
    },
    {
      title: "Weather Forecast App",
      description: "A responsive weather application with location-based forecasts, interactive maps, and detailed weather analytics using external APIs.",
      imageUrl: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=300",
      technologies: ["React", "API Integration", "Charts.js"],
      liveUrl: "https://example.com",
      codeUrl: "https://github.com"
    },
    {
      title: "Social Media Dashboard",
      description: "A comprehensive social media management platform with analytics, post scheduling, and engagement tracking across multiple platforms.",
      imageUrl: "https://images.unsplash.com/photo-1611262588024-d12430b98920?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=300",
      technologies: ["Vue.js", "Django", "PostgreSQL"],
      liveUrl: "https://example.com",
      codeUrl: "https://github.com"
    },
    {
      title: "Learning Management System",
      description: "An educational platform with course management, progress tracking, quizzes, and video streaming capabilities for online learning.",
      imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=300",
      technologies: ["Next.js", "Prisma", "Stripe"],
      liveUrl: "https://example.com",
      codeUrl: "https://github.com"
    },
    {
      title: "Real Estate Platform",
      description: "A modern real estate platform with property listings, virtual tours, mortgage calculators, and agent management system.",
      imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=300",
      technologies: ["React", "Ruby on Rails", "Maps API"],
      liveUrl: "https://example.com",
      codeUrl: "https://github.com"
    },
  ];

  return (
    <section id="projects" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Featured Projects</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-cyan-600 mx-auto rounded-full"></div>
          <p className="text-lg text-slate-600 mt-6 max-w-2xl mx-auto">
            Here are some of my recent projects that showcase my skills and experience
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))}
        </div>

        <div className="text-center mt-12">
          <a 
            href="https://github.com" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-300 shadow-lg hover:shadow-xl"
            target="_blank"
            rel="noopener noreferrer"
          >
            View All Projects
          </a>
        </div>
      </div>
    </section>
  );
}
