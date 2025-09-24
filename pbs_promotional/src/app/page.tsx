import Hero from "@/components/hero";
//import Servicios from "./components/Servicios";
import Main from "@/components/main";
import About from "@/components/about";
import ContactForm from "@/components/contactForm";

export default function Home() {
  return (
    <>
      <Hero />
      <Main/>
      <About/>
      <ContactForm />
    </>
  );
}
