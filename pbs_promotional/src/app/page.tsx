import Hero from "@/components/hero";
//import Servicios from "./components/Servicios";
import Main from "@/components/main";
import About from "@/components/about";
import ContactForm from "@/components/contactForm";
import Footer from "@/components/footer";

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
