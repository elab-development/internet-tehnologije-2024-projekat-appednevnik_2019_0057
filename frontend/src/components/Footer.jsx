import React from "react";
import { AiFillPhone } from "react-icons/ai";
import { MdEmail } from "react-icons/md";

export default function Footer() {
  return (
    <footer className="footer">
      <div>
        <MdEmail /> <span>kontakt@ednevnik.rs</span>
      </div>
      <div>
        <AiFillPhone /> <span>060 123 456</span>
      </div>
      <div>&copy; 2025 e-Dnevnik</div>
    </footer>
  );
}