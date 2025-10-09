import Hero from "@/components/hero";
import Main from "@/components/main";
import About from "@/components/about";
import ContactForm from "@/components/contactForm";
import WhatsAppCTA from "@/components/whatsAppCTA";
import DownloadCatalog from "@/components/downloadCatalog";

export default function Home() {
  return (
    <>
      <Hero />
      <WhatsAppCTA/>
      <Main/>
      <DownloadCatalog/>
      <About/>
      <ContactForm />
    </>
  );
}
