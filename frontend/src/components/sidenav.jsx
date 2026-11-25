
import React, { useState } from "react";
import "./sidenav.css";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const openNav = () => {
    setIsOpen(true);
  };

  const closeNav = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button className="menu-button" onClick={openNav}>
        ☰
      </button>

      <div className={`sidenav ${isOpen ? "open" : ""}`}>
        <button className="closebtn" onClick={closeNav}>
          &times;
        </button>

        <div className="sidebar-brand">
          <h2>Tech<span>Verse</span></h2>
          <p>Explore Technology</p>
        </div>


        <nav className="sidebar-links">
          <a href="/">⌂ <span>Home</span></a>
          <a href="#">▦ <span>Shop All</span></a>
          <a href="#">⌕ <span>Categories</span></a>
          <a href="#">％ <span>Special Offers</span></a>

          <div className="sidebar-divider"></div>
          <a href="#">▤ <span>My Orders</span></a>
          <a href="#">♡ <span>Wishlist</span></a>
          <a href="#">ⓘ <span>About Us</span></a>
          <a href="#">✉ <span>Contact</span></a>
        </nav>
      </div>

      {isOpen && (
        <div className="sidebar-overlay" onClick={closeNav}></div>
      )}
    </>
  );
}

export default Sidebar;
