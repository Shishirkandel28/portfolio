interface RoadmapCardProps {
  title: string;
  description: string;
  icon: string;
  skills: string[];
  salaryRange: string;
  timeToLearn: string;
  iconColor: string;
}

function RoadmapCard({ title, description, icon, skills, salaryRange, timeToLearn, iconColor }: RoadmapCardProps) {
  return (
    <div className="roadmap-card bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center">
      <div className={`w-16 h-16 mx-auto mb-6 rounded-full ${iconColor} flex items-center justify-center`}>
        <i className={`${icon} text-3xl text-white`}></i>
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-4">{title}</h3>
      <p className="text-slate-600 mb-6 leading-relaxed">{description}</p>
      
      <div className="space-y-4 mb-6">
        <div className="bg-slate-50 p-3 rounded-lg">
          <h4 className="font-semibold text-slate-900 text-sm mb-2">Key Skills</h4>
          <div className="flex flex-wrap gap-1 justify-center">
            {skills.map((skill, index) => (
              <span 
                key={index}
                className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-50 p-3 rounded-lg">
            <h4 className="font-semibold text-green-800 text-sm">Salary Range</h4>
            <p className="text-green-600 text-sm">{salaryRange}</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="font-semibold text-blue-800 text-sm">Time to Learn</h4>
            <p className="text-blue-600 text-sm">{timeToLearn}</p>
          </div>
        </div>
      </div>
      
      <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-300">
        Learn More
      </button>
    </div>
  );
}

export default function CareerRoadmap() {
  const careerPaths = [
    {
      title: "Graphic Design",
      description: "Create visual content for digital and print media, including logos, brochures, advertisements, and brand identity materials.",
      icon: "fas fa-palette",
      skills: ["Photoshop", "Illustrator", "InDesign", "Typography", "Color Theory", "Branding"],
      salaryRange: "Rs 25,000 - 80,000/month",
      timeToLearn: "6-12 months",
      iconColor: "bg-pink-500"
    },
    {
      title: "Cyber Security",
      description: "Protect organizations from digital threats by implementing security measures, monitoring networks, and responding to cyber attacks.",
      icon: "fas fa-shield-alt",
      skills: ["Network Security", "Ethical Hacking", "Risk Assessment", "Incident Response", "Compliance"],
      salaryRange: "Rs 40,000 - 120,000/month",
      timeToLearn: "12-18 months",
      iconColor: "bg-red-500"
    },
    {
      title: "Networking",
      description: "Design, implement, and maintain computer networks to ensure reliable connectivity and communication within organizations.",
      icon: "fas fa-network-wired",
      skills: ["TCP/IP", "Routing", "Switching", "Network Protocols", "Troubleshooting", "Security"],
      salaryRange: "Rs 30,000 - 90,000/month",
      timeToLearn: "8-15 months",
      iconColor: "bg-blue-500"
    },
    {
      title: "Digital Marketing",
      description: "Promote products and services through digital channels, including social media, search engines, and online advertising.",
      icon: "fas fa-bullhorn",
      skills: ["SEO", "Social Media", "Content Marketing", "Google Ads", "Analytics", "Email Marketing"],
      salaryRange: "Rs 20,000 - 70,000/month",
      timeToLearn: "4-8 months",
      iconColor: "bg-green-500"
    },
    {
      title: "Web Development",
      description: "Build and maintain websites and web applications using programming languages and modern development frameworks.",
      icon: "fas fa-code",
      skills: ["HTML/CSS", "JavaScript", "React", "Node.js", "Databases", "Git"],
      salaryRange: "Rs 35,000 - 100,000/month",
      timeToLearn: "10-16 months",
      iconColor: "bg-indigo-500"
    },
    {
      title: "Data Science",
      description: "Analyze large datasets to extract insights and help organizations make data-driven decisions using statistical methods and machine learning.",
      icon: "fas fa-chart-bar",
      skills: ["Python", "Statistics", "Machine Learning", "SQL", "Data Visualization", "Excel"],
      salaryRange: "Rs 45,000 - 150,000/month",
      timeToLearn: "12-20 months",
      iconColor: "bg-purple-500"
    },
  ];

  return (
    <section id="roadmap" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Career Opportunities in Nepal</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto rounded-full"></div>
          <p className="text-lg text-slate-600 mt-6 max-w-2xl mx-auto">
            Explore different career paths in technology and digital fields with growth opportunities in Nepal
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {careerPaths.map((career, index) => (
            <RoadmapCard key={index} {...career} />
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="bg-slate-50 p-8 rounded-2xl">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Ready to Start Your Journey?</h3>
            <p className="text-lg text-slate-600 mb-6">
              Choose a career path that aligns with your interests and start building your skills today!
            </p>
            <button 
              onClick={() => {
                const contactSection = document.getElementById('contact');
                contactSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              Get Career Guidance
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}