import ActualiteContentDetail from "@/components/ActualiteContentDetail";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import Topbar from "@/components/Topbar";
import React from "react";


const ActualiteDetail = () => {
  return (
    <div>
     <Topbar/>
      <Navigation/>
      <ActualiteContentDetail />
      <Footer />
    </div>
  );
};

export default ActualiteDetail;