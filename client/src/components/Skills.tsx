import { useEffect, useRef } from "react";

interface SkillCardProps {
  icon: string;
  title: string;
  percentage: number;
  color: string;
}

function SkillCard({ icon, title, percentage, color }: SkillCardProps) {
  const progressRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && progressRef.current) {
            setTimeout(() => {
              if (progressRef.current) {
                progressRef.current.style.width = `${percentage}%`;
              }
            }, 300);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [percentage]);

  return (
    <div 
      ref={cardRef}
      className="skill-card bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center"
    >
      <i className={`${icon} text-4xl ${color} mb-4`}></i>
      <h4 className="font-semibold text-slate-900 mb-2">{title}</h4>
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div 
          ref={progressRef}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-1000 ease-out"
          style={{ width: "0%" }}
        ></div>
      </div>
    </div>
  );
}

export default function Skills() {
  const designSkills = [
    { icon: "fas fa-paint-brush", title: "Adobe Photoshop", percentage: 95, color: "text-blue-600" },
    { icon: "fas fa-vector-square", title: "Adobe Illustrator", percentage: 90, color: "text-orange-500" },
    { icon: "fas fa-film", title: "Adobe Premiere", percentage: 85, color: "text-purple-600" },
    { icon: "fas fa-camera", title: "Canva", percentage: 88, color: "text-cyan-500" },
  ];

  const skillsSkills = [
    { icon: "fas fa-palette", title: "Brand Design", percentage: 92, color: "text-pink-500" },
    { icon: "fas fa-bullhorn", title: "Marketing Materials", percentage: 88, color: "text-green-500" },
    { icon: "fas fa-mobile-alt", title: "Social Media Design", percentage: 90, color: "text-blue-500" },
    { icon: "fas fa-print", title: "Print Design", percentage: 85, color: "text-red-500" },
  ];

  const otherSkills = [
    { icon: "fas fa-photo-video", title: "Photo Editing", percentage: 93, color: "text-indigo-500" },
    { icon: "fas fa-video", title: "Video Editing", percentage: 80, color: "text-purple-500" },
    { icon: "fas fa-font", title: "Typography", percentage: 87, color: "text-gray-600" },
    { icon: "fas fa-swatchbook", title: "Color Theory", percentage: 90, color: "text-yellow-500" },
  ];

  return (
    <section id="skills" className="py-20 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Design Skills & Tools</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto rounded-full"></div>
          <p className="text-lg text-slate-600 mt-6 max-w-2xl mx-auto">
            I work with industry-leading design tools to create stunning visual experiences
          </p>
        </div>
        
        {/* Design Software */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">Design Software</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {designSkills.map((skill, index) => (
              <SkillCard key={index} {...skill} />
            ))}
          </div>
        </div>

        {/* Design Specializations */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">Design Specializations</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {skillsSkills.map((skill, index) => (
              <SkillCard key={index} {...skill} />
            ))}
          </div>
        </div>

        {/* Additional Skills */}
        <div>
          <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">Additional Skills</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {otherSkills.map((skill, index) => (
              <SkillCard key={index} {...skill} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
