export default function Footer() {
  return (
    <footer className="relative">
      {/* Curved top with gold line */}
      <div className="bg-white h-12 relative">
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-[#0B281F] rounded-t-[50px] overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent rounded-t-[50px]" />
        </div>
      </div>
      
      {/* Footer content */}
      <div className="bg-[#0B281F] py-8">
        
        <div className="container mx-auto px-6">
          <div className="flex justify-center items-center">
            <p className="text-white/50 text-sm font-sans">
              by{" "}
              <a 
                href="https://frontique.site" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#D4AF37] hover:text-white transition-colors font-medium"
              >
                frontique
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
