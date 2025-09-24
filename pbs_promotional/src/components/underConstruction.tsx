import Image from "next/image";
export default function UnderConstruction() {
  return (
    <section id="about" className="py-16 md:pt-0 md:pb-0 bg-white text-gray-800">

        <div className="text-center">
          <Image 
            src="/images/under_construction.png"  
            alt="Under Construction"
            className="mx-auto rounded-2xl  max-h-80 object-cover"
          />
        </div>

        </section>
  );
}
