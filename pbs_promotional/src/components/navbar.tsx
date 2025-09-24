export default function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-[#0b0c0f]/80 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <img src="/logo.png" alt="pbs" className="h-7 w-7" />
            <span className="font-semibold text-white">PBS Promotional</span>
          </a>
          <nav className="hidden md:flex gap-6 text-white/80">
            <a href="#inicio">Inicio</a>
            <a href="#servicios">Servicios</a>
            <a href="#about">Quiénes somos</a>
            <a href="#contacto">Contacto</a>
            <a href="#cursos">Cursos Online</a>
          </nav>
        </div>
      </div>
    </header>
  );
}
