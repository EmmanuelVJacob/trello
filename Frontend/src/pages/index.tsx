import Navbar from "@/components/navbar";
import TrelloMain from "@/components/trellMain";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
        <TrelloMain/>
    </div>
  );
}
