import HeroTentang from "./sections/HeroTentang";
import SejarahTentang from "./sections/SejarahTentang";
import FilosofiLogo from "./sections/FilosofiLogo";
import VisiMisiTentang from "./sections/VisiMisiTentang";
import PilarTentang from "./sections/PilarTentang";

export default function TentangPage() {
    return (
        <div className="w-full relative z-10 flex flex-col bg-white">
            <HeroTentang />
            <SejarahTentang />
            <FilosofiLogo />
            <VisiMisiTentang />
            <PilarTentang />
        </div>
    );
}
