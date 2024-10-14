// import React from "react";
// import Link from "next/link";

// const Navbar = () => {
//   return (
//     <nav className="bg-gray-800 text-white p-4">
//       <ul className="flex space-x-4">
//         <li>
//           <Link href="/">Home</Link>
//         </li>
//         <li>
//           <Link href="/book-parking">Book Parking</Link>
//         </li>
//         <li>
//           <Link href="/parking-allotted">Parking Allotted</Link>
//         </li>
//         <li>
//           <Link href="/car-pooling">Car Pooling</Link>
//         </li>
//         <li>
//           <Link href="/make-complaint">Make Complaint</Link>
//         </li>
//         <li>
//           <Link href="/sign-in">SignIn</Link>
//         </li>
//         <li>
//           <Link href="/sign-up">SignUp</Link>
//         </li>
//       </ul>
//     </nav>
//   );
// };

// export default Navbar;

"use client";

import React from "react";
import Link from "next/link";
import { useUser, SignedIn, SignedOut, useClerk } from "@clerk/nextjs";

const Navbar = () => {
  const { user } = useUser();
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    await signOut();
    // No need to use router.push here, Clerk will handle the redirect
  };

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
        <SignedIn>
          <li>
            <span className="mr-2">Welcome, {user?.firstName}!</span>
          </li>
          <li>
            <button
              onClick={handleSignOut}
              className="text-white hover:text-gray-300"
            >
              Sign Out
            </button>
          </li>
        </SignedIn>
        <SignedOut>
          <li>
            <Link href="/sign-in">Sign In</Link>
          </li>
          <li>
            <Link href="/sign-up">Sign Up</Link>
          </li>
        </SignedOut>
      </ul>
    </nav>
  );
};

export default Navbar;
