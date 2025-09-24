import Hero from "@/components/hero";
import Main from "@/components/main";
import About from "@/components/about";
import ContactForm from "@/components/contactForm";
import WhatsAppCTA from "@/components/whatsAppCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <WhatsAppCTA/>
      <Main/>
      <About/>
      <ContactForm />
    </>
  );
}
