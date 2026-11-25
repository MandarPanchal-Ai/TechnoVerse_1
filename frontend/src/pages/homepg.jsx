
import { useState, useEffect } from "react";
import "./homepg.css";

export default function Homepg({ cart, setCart }) {
  const [notification, setNotification] = useState("");
  const [products, setProducts] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);


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


  const featuredProducts = [
    {
      name: "ASUS Laptop",
      description:
        "Powerful performance for work, gaming and everything in between.",
      price: 999,
      image: "/Asus_laptop.jpg"
    },
    {
      name: "ASUS Gaming Keyboard",
      description: "Upgrade your setup with precision and style.",
      price: 199,
      image: "/Asus_Keyboard.jpg"
    },
    {
      name: "ASUS Monitor",
      description: "Experience every detail with a stunning display.",
      price: 299,
      image: "/asus_monitor.jpg"
    },
    {
      name: "AirPods Max",
      description: "Premium sound. Immersive listening. Incredible comfort.",
      price: 549,
      image: "/I_headphone.jpg"
    }
  ];


  useEffect(() => {
    fetch("http://127.0.0.1:8000/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Could not fetch products");
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);
        console.log("Products received from FastAPI:", data);
      })
      .catch((error) => {
        console.error("Error connecting to FastAPI:", error);
      });
  }, []);


  useEffect(() => {
    const sliderInterval = setInterval(() => {
      setActiveSlide((previousSlide) =>
        (previousSlide + 1) % featuredProducts.length
      );
    }, 4000);

    return () => clearInterval(sliderInterval);
  }, []);


  function showNotification(productName) {
    setNotification(productName + " added to cart!");

    setTimeout(() => {
      setNotification("");
    }, 3000);
  }


  const addToCart = async (product) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          product_id: product.id,
          quantity: 1
        })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Could not add product to cart");
        return;
      }


      const cartResponse = await fetch("http://127.0.0.1:8000/cart");

      if (!cartResponse.ok) {
        throw new Error("Could not fetch updated cart");
      }

      const cartData = await cartResponse.json();


      const updatedCart = cartData.map((item) => ({
        id: item.product_id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: productImages[item.product_id]
      }));

      setCart(updatedCart);
      showNotification(product.name);

    } catch (error) {
      console.error("Cart error:", error);
      alert("Unable to connect to the backend");
    }
  };


  const cartCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <>

      <div className="hero-banner">
        <div className="hero-content">
          <p className="hero-tag">FEATURED PRODUCT</p>

          <h1>{featuredProducts[activeSlide].name}</h1>

          <p className="hero-description">
            {featuredProducts[activeSlide].description}
          </p>

          <h2>${featuredProducts[activeSlide].price}</h2>

          <button
            className="hero-button"
            onClick={() => {
              document.getElementById("products").scrollIntoView({
                behavior: "smooth"
              });
            }}
          >
            Shop Now →
          </button>

          <div className="hero-dots">
            {featuredProducts.map((product, index) => (
              <button
                key={product.name}
                className={activeSlide === index ? "active" : ""}
                onClick={() => setActiveSlide(index)}
                aria-label={`Show ${product.name}`}
              />
            ))}
          </div>
        </div>

        <div className="hero-image">
          <img
            src={featuredProducts[activeSlide].image}
            alt={featuredProducts[activeSlide].name}
          />
        </div>
      </div>


      <div className="products" id="products">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <img
              src={productImages[product.id]}
              alt={product.name}
              width="150"
              height="150"
            />

            <h1>{product.name}</h1>

            <p>{product.desc}</p>

            <p>Price: ${product.price}</p>

            <button
              onClick={() =>
                addToCart({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: productImages[product.id]
                })
              }
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>


      {notification && (
        <div className="toast">
          <strong>✓ Success!</strong>
          <p>{notification}</p>
        </div>
      )}
    </>
  );
}
