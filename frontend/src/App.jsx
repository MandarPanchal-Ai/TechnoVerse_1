
import { useState, useEffect  } from "react";
import Homepg from "./pages/homepg.jsx";
import Cart from "./components/cart.jsx";
import "./App.css";
import Sidebar from "./components/sidenav.jsx";

function App() {
  const [cart, setCart] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load existing cart from FastAPI when website starts
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch("https://techno-verse-1-c580ps9h9-mandarpof2501-4109.vercel.app/cart");

        if (!response.ok) {
          throw new Error("Could not fetch cart");
        }

        const cartData = await response.json();

        const productImages = {
          1: "/Asus_laptop.jpg",
          2: "/I_mouse.jpg",
          3: "/Asus_Keyboard.jpg",
          4: "/asus_monitor.jpg",
          5: "/alexa.jpg",
          6: "/EXtensionboard.jpg",
          7: "/POWer_bank.jpg",
          8: "/I_headphone.jpg"
        };

        const updatedCart = cartData.map((item) => ({
          id: item.product_id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: productImages[item.product_id]
        }));

        setCart(updatedCart);

      } catch (error) {
        console.error("Error loading cart:", error);
      }
    };

    fetchCart();
  }, []);

  const cartCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <>

      <header className="main-header">
        <img src="/peacock.jpg" alt="TechVerse"  className="brand-logo"  />

        <div className="search-bar">
          <input
            id="search"
            type="search"
            placeholder="Search for products..."
            list="search-suggestions"
            autoComplete="off"
          />
        </div>

        <button
          className="cart-button"
          onClick={() => setIsOpen(true)}
        >
          🛒 Cart ({cartCount})
        </button>

      </header>
      <Sidebar />

      <Homepg cart={cart} setCart={setCart} />

      <Cart
        cart={cart}
        setCart={setCart}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </>
  );
}

export default App;
