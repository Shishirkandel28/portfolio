export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">Shishir Kandel</h3>
          <p className="text-slate-400 mb-6 max-w-md mx-auto">
            Creative Graphic Designer passionate about crafting exceptional visual experiences that tell compelling stories.
          </p>
          <div className="flex justify-center space-x-6 mb-8">
            <a 
              href="https://github.com/Shishirkdl" 
              className="text-slate-400 hover:text-white transition-colors text-xl"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-github"></i>
            </a>
            <a 
              href="https://www.linkedin.com/in/shishirkandel/" 
              className="text-slate-400 hover:text-white transition-colors text-xl"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-linkedin"></i>
            </a>
            <a 
              href="https://www.behance.net/theshishirkandel" 
              className="text-slate-400 hover:text-white transition-colors text-xl"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-behance"></i>
            </a>
            <a 
              href="https://www.facebook.com/shishir.kandel.772476" 
              className="text-slate-400 hover:text-white transition-colors text-xl"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-facebook"></i>
            </a>
            <a 
              href="https://www.instagram.com/the_shishir.kandel/" 
              className="text-slate-400 hover:text-white transition-colors text-xl"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a 
              href="mailto:shishirxkandel@gmail.com" 
              className="text-slate-400 hover:text-white transition-colors text-xl"
            >
              <i className="fas fa-envelope"></i>
            </a>
          </div>
          <div className="border-t border-slate-800 pt-8">
            <p className="text-slate-400">
              © {currentYear} Shishir Kandel. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
