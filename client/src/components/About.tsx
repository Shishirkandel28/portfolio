export default function About() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">About Me</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-cyan-600 mx-auto rounded-full"></div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="order-2 md:order-1">
            {/* Professional portrait placeholder */}
            <div className="w-full h-64 sm:h-80 md:h-96 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center text-slate-600 shadow-xl">
              <i className="fas fa-user text-6xl sm:text-8xl opacity-30"></i>
            </div>
          </div>
          
          <div className="order-1 md:order-2">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-6">Creative Graphic Designer</h3>
            
            <p className="text-base sm:text-lg text-slate-600 mb-4 sm:mb-6 leading-relaxed">
              I'm a passionate graphic designer with extensive experience in creating compelling visual content that communicates ideas effectively. My journey in design started with a love for art and creativity, which evolved into a professional pursuit of visual excellence and brand storytelling.
            </p>
            
            <p className="text-base sm:text-lg text-slate-600 mb-6 sm:mb-8 leading-relaxed">
              I specialize in Adobe Creative Suite, brand identity design, and digital marketing materials. When I'm not designing, you'll find me exploring new design trends, experimenting with different creative techniques, or helping businesses build their visual identity.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-semibold text-slate-900 mb-2">Experience</h4>
                <p className="text-slate-600">3+ Years</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-semibold text-slate-900 mb-2">Projects</h4>
                <p className="text-slate-600">100+ Designs</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-semibold text-slate-900 mb-2">Location</h4>
                <p className="text-slate-600">Bharatpur, Nepal</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-semibold text-slate-900 mb-2">Availability</h4>
                <p className="text-slate-600">Open to Work</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
