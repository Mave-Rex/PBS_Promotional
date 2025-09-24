export default function About() {
  return (
    <section id="about" className="py-16 md:py-24 bg-white text-gray-800">
      <div className="max-w-5xl mx-auto px-4 space-y-12">

        {/* Título principal */}
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-700 mb-4">
            Acerca de nosotros
          </h2>
          <h3 className="text-xl font-bold text-pink-600 mb-6">
            Nuestra Historia
          </h3>

          <div className="text-center">
          <img
            src="/images/acerca_de.png"
            alt="Equipo de trabajo PBS Promotional"
            className="mx-auto rounded-2xl shadow-lg max-h-80 object-cover"
          />
        </div>
        <div className="h-10"></div> 


          <p className="text-base md:text-lg leading-relaxed text-gray-700 text-justify">
            <span className="font-bold">PBS Promotional.</span> ofrece sus
            servicios en el área metropolitana desde 2010. Esta empresa,
            fundada por un excelente equipo de profesionales en{" "}
            <span className="font-semibold">Marketing, Branding y Publicidad</span>. 
            Ofrece servicios <span className="font-semibold">publicitarios</span> que te ayudarán
            a hacer realidad tus ideas, impulsando tu imagen corporativa
            mediante productos de alta gama por su impacto en el mercado.
          </p>
        </div>

        
        {/* Misión */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold text-center text-gray-700">
            Misión y Visión
          </h3>

        <div className="text-center">
          <img
            src="/images/misión.png"  
            alt="Equipo de trabajo PBS Promotional"
            className="mx-auto rounded-2xl shadow-lg max-h-80 object-cover"
          />
        </div>

          <div className="text-center space-y-3">
            <h4 className="text-lg font-bold text-gray-800">MISIÓN</h4>
            <p className="text-base leading-relaxed text-gray-700 max-w-3xl mx-auto">
              Dar acompañamiento a nuestros clientes a lo largo de todo el
              desarrollo de su estrategia de marca para el cumplimiento con el
              plan de marketing del negocio.
            </p>
          </div>

          {/* Visión */}
          <div className="text-center">
          <img
            src="/images/visión.png"
            alt="Equipo de trabajo PBS Promotional"
            className="mx-auto rounded-2xl shadow-lg max-h-80 object-cover"
          />
        </div>
          <div className="text-center space-y-3 pt-6">
            <h4 className="text-lg font-bold text-gray-800">VISIÓN</h4>
            <p className="text-base leading-relaxed text-gray-700 max-w-3xl mx-auto">
              Ser reconocidos por nuestros clientes y por el mercado como la
              principal agencia de marketing y publicidad en la región.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
