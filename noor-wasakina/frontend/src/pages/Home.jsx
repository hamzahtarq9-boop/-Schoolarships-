import Navbar from '../components/Navbar.jsx';
import Hero from '../components/Hero.jsx';
import Values from '../components/Values.jsx';
import ReelsSection from '../components/reels/ReelsSection.jsx';
import DhikrSection from '../components/dhikr/DhikrSection.jsx';
import ContactSection from '../components/ContactSection.jsx';
import Footer from '../components/Footer.jsx';
import AmbientBackground from '../components/AmbientBackground.jsx';

export default function Home() {
  return (
    <>
      <AmbientBackground />
      <Navbar />
      <main>
        <Hero />
        <Values />
        <ReelsSection />
        <DhikrSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
