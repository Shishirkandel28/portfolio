export default function Hero() {
  const scrollToProjects = () => {
    const element = document.getElementById("projects");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToContact = () => {
    const element = document.getElementById("contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 pt-16 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <div className="animate-fadeInUp">
          {/* Professional headshot placeholder */}
          <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6 sm:mb-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl sm:text-4xl font-bold animate-float">
            SK
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-slate-900 mb-4 sm:mb-6 px-2">
            Hi, I'm{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent block sm:inline">
              Shishir Kandel
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-slate-600 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-4">
            Creative Graphic Designer crafting exceptional visual experiences with modern design tools and creative solutions
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-12 px-4">
            <button
              onClick={() => {
                const element = document.getElementById("roadmap");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 sm:px-8 py-3 rounded-lg font-medium transition-colors duration-300 shadow-lg hover:shadow-xl w-full sm:w-auto"
            >
              View Career Roadmap
            </button>
            <button
              onClick={scrollToContact}
              className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-6 sm:px-8 py-3 rounded-lg font-medium transition-all duration-300 w-full sm:w-auto"
            >
              Get In Touch
            </button>
          </div>
          
          <div className="flex justify-center space-x-4 sm:space-x-6">
            <a href="https://github.com/Shishirkdl" className="text-slate-600 hover:text-purple-600 transition-colors text-2xl" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-github"></i>
            </a>
            <a href="https://www.linkedin.com/in/shishirkandel/" className="text-slate-600 hover:text-purple-600 transition-colors text-2xl" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-linkedin"></i>
            </a>
            <a href="https://www.facebook.com/shishir.kandel.772476" className="text-slate-600 hover:text-purple-600 transition-colors text-2xl" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="https://www.behance.net/theshishirkandel" className="text-slate-600 hover:text-purple-600 transition-colors text-2xl" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-behance"></i>
            </a>
            <a href="https://www.instagram.com/the_shishir.kandel/" className="text-slate-600 hover:text-purple-600 transition-colors text-2xl" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="mailto:shishirxkandel@gmail.com" className="text-slate-600 hover:text-purple-600 transition-colors text-2xl">
              <i className="fas fa-envelope"></i>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
