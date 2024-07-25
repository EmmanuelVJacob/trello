import Navbar from "@/components/navbar";
import ProductsCards from "@/components/featuredProductListCards";
import AddButton from "@/components/addButton";
import TrelloMain from "@/components/trellMain";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
        <TrelloMain/>
    </div>
  );
}
