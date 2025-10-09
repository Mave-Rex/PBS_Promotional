import Image from "next/image";
export default function About() {
  return (
    <section id="about" className="py-2 md:pt-2 md:pb-0 bg-white text-gray-800">
      <div className="max-w-5xl mx-auto px-4 space-y-2">

        {/* Título principal */}
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-700 mb-4">
            Acerca de nosotros
          </h2>
          <h3 className="text-xl font-bold text-pink-600 mb-6">
            Nuestra Historia
          </h3>

          <div className="text-center">
          <Image 
            src="/images/acerca_de.png"
            alt="Acerca de PBS"
            width={550} 
            height={350} 
            className="mx-auto rounded-2xl shadow-lg max-h-80 object-cover"
          />
        </div>
        <div className="h-10"></div> 


          <p className="text-base md:text-lg leading-relaxed text-gray-700 text-justify">
            <span className="font-bold">PBS Promotional</span> ofrece sus
            servicios en el área metropolitana desde 2010. Esta empresa,
            fundada por un excelente equipo de profesionales en{" "}
            <span className="font-semibold">Marketing, Branding y Publicidad</span>. 
            Ofrece servicios <span className="font-semibold">publicitarios</span> que te ayudarán
            a hacer realidad tus ideas, impulsando tu imagen corporativa
            mediante productos de alta gama por su impacto en el mercado.
          </p>
        </div>
        <hr className="border-t-2 border-pink-500 my-8" />


        
        {/* Misión */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold text-center text-gray-700">
            Misión y Visión
          </h3>

         {/* Contenedor flex para alinear horizontalmente */}
    <div className="flex flex-col md:flex-row justify-center items-stretch gap-8">
      
      {/* Misión */}
      <div className="flex-1 text-center bg-white rounded-2xl shadow-md p-6">
        <Image 
          src="/images/misión.png"  
          alt="Misión PBS"
          width={550} 
          height={350} 
          className="mx-auto rounded-2xl shadow-lg max-h-64 object-cover"
        />
        <h4 className="text-lg font-bold text-pink-600 mt-4">MISIÓN</h4>
        <p className="text-base leading-relaxed text-gray-700 mt-2">
          Dar acompañamiento a nuestros clientes a lo largo de todo el
          desarrollo de su estrategia de marca para el cumplimiento con el
          plan de marketing del negocio.
        </p>
      </div>

      {/* Visión */}
      <div className="flex-1 text-center bg-white rounded-2xl shadow-md p-6">
        <Image 
          src="/images/visión.png"
          alt="Visión PBS"
          width={550} 
          height={350} 
          className="mx-auto rounded-2xl shadow-lg max-h-64 object-cover"
        />
        <h4 className="text-lg font-bold text-pink-600 mt-4">VISIÓN</h4>
        <p className="text-base leading-relaxed text-gray-700 mt-2">
          Ser reconocidos por nuestros clientes y por el mercado como la
          principal agencia de marketing y publicidad en la región.
        </p>
      </div>
    </div>

    <hr className="border-t-2 border-pink-500 my-8 w-2/3 mx-auto" />
  </div>
  </div>
    </section>
  );
}
