import Navbar from "@/components/navbar";
import axiosInstance from "@/utils/axiosInstance";
import { GetServerSidePropsContext } from "next";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  if (context?.params?.id) {
    const data = await axiosInstance.get(
      `getSingleProduct/${context?.params?.id}`
    );
    return {
      props: { data: data.data },
    };
  }
}

export default function ProductDetails({ data }: { data: any }) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
    </div>
  );
}
