
import React from "react";
import "./cart.css";

function Cart({ cart, setCart, isOpen, setIsOpen }) {


  const fetchCart = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/cart");

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
      console.error("Fetch cart error:", error);
    }
  };



  const updateQuantity = async (id, amount) => {
    const item = cart.find((item) => item.id === id);

    if (!item) return;

    const newQuantity = item.quantity + amount;

    try {
      if (newQuantity === 0) {
        const response = await fetch(
          `https://techno-verse-1-c580ps9h9-mandarpof2501-4109.vercel.app/cart/${id}`,
          { method: "DELETE" }
        );

        if (!response.ok) {
          throw new Error("Could not remove product");
        }
      } else {
        const response = await fetch(
          `https://techno-verse-1-c580ps9h9-mandarpof2501-4109.vercel.app/cart/${id}?quantity=${newQuantity}`,
          { method: "PUT" }
        );

        if (!response.ok) {
          throw new Error("Could not update quantity");
        }
      }

      await fetchCart();

    } catch (error) {
      console.error("Quantity update error:", error);
      alert("Unable to update cart");
    }
  };


  const removeItem = async (id) => {
    try {
      const response = await fetch(
        `https://techno-verse-1-c580ps9h9-mandarpof2501-4109.vercel.app/cart/${id}`,
        {
          method: "DELETE"
        }
      );

      if (!response.ok) {
        throw new Error("Could not remove product");
      }

      await fetchCart();

    } catch (error) {
      console.error("Remove item error:", error);
      alert("Unable to remove product");
    }
  };


  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <>
      {isOpen && (
        <div className="cart-overlay" onClick={() => setIsOpen(false)}>
          <div
            className="cart-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="cart-header">
              <h2>Your Cart</h2>
              <button onClick={() => setIsOpen(false)}>✕</button>
            </div>

            <div className="cart-items">
              {cart.length === 0 ? (
                <p className="empty-cart">Your cart is empty!</p>
              ) : (
                cart.map((item) => (
                  <div className="cart-item" key={item.id}>
                    <img src={item.image} alt={item.name} />

                    <div className="cart-item-details">
                      <h3>{item.name}</h3>
                      <p>${item.price}</p>

                      <div className="quantity-controls">
                        <button onClick={() => updateQuantity(item.id, -1)}>
                          −
                        </button>

                        <span>{item.quantity}</span>

                        <button onClick={() => updateQuantity(item.id, 1)}>
                          +
                        </button>
                      </div>

                      <button
                        className="remove-btn"
                        onClick={() => removeItem(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="cart-footer">
              <h3>Total: ${total.toFixed(2)}</h3>
              <button className="checkout-btn" disabled={cart.length === 0}>
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Cart;
