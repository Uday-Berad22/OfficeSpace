import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 absolute bottom-0 w-full">
      <div className="container mx-auto text-center">
        <p>
          &copy; {new Date().getFullYear()} All rights reserved. Commvault Pune
        </p>
      </div>
    </footer>
  );
};

export default Footer;
