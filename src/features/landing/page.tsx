import About from "./sections/about";
import CTA from "./sections/cta";
import Hero from "./sections/hero";
import Kegiatan from "./sections/kegiatan";
import Pengumuman from "./sections/pengumuman";
import Footer from "../../components/footer";
import Navbar from "../../components/navbar";

export default function LandingPage() {
    return (
        <>
            <Navbar />
            <Hero />
            <About />
            <Kegiatan />
            <Pengumuman />
            <CTA />
            <Footer />
        </>
    );
}