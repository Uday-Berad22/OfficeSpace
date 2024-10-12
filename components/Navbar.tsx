import React from "react";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <ul className="flex space-x-4">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/book-parking">Book Parking</Link>
        </li>
        <li>
          <Link href="/parking-allotted">Parking Allotted</Link>
        </li>
        <li>
          <Link href="/car-pooling">Car Pooling</Link>
        </li>
        <li>
          <Link href="/make-complaint">Make Complaint</Link>
        </li>
        <li>
          <Link href="/sign-in">SignIn</Link>
        </li>
        <li>
          <Link href="/sign-up">SignUp</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
