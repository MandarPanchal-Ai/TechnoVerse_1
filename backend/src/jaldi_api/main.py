
from fastapi import FastAPI ,HTTPException, Query
from jaldi_api.models import Product, ProductUpdate, CartItem
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173",
    "https://technoverse1.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)



# Temporary product storage
products = [
    Product(id=1, name="Asus Laptop", price=999, desc="High-performance Asus laptop", quant=30),
    Product(id=2, name="IMouse", price=699, desc="Wireless precision computer mouse", quant=30),
    Product(id=3, name="Asus Keyboard", price=199, desc="Responsive Asus mechanical keyboard", quant=30),
    Product(id=4, name="Asus Monitor", price=299, desc="High-resolution Asus display", quant=30),
    Product(id=5, name="Alexa", price=99, desc="Smart voice assistant", quant=30),
    Product(id=6, name="Extension Board", price=49, desc="Multi-socket power extension", quant=30),
    Product(id=7, name="Power Bank", price=79, desc="Portable device charger", quant=30),
    Product(id=8, name="AirPods Max", price=549, desc="Premium wireless headphones", quant=30)
]

cart = []


# GET all products
@app.get("/products")
def get_products():
    return sorted(products, key=lambda item: item.id)


# GET product by ID
@app.get("/products/{product_id}")
def get_product_by_id(product_id: int):
    for item in products:
        if item.id == product_id:
            return item

    return {"error": "Product not found"}


# POST a new product
@app.post("/products/")
def create_product(new_product: Product):
    products.append(new_product)

    return {
        "message": "Product created successfully",
        "product": new_product
    }

# Delete a Product
@app.delete("/products/{product_id}")
def delete_product(product_id: int):

    for item in products:
        if item.id == product_id:
            products.remove(item)

            return {
                "message": "Product deleted successfully"
            }

    raise HTTPException(
        status_code=404,
        detail="Product not found"
    )    

# Update a Product
@app.put("/products/{product_id}")
def update_product(product_id: int, updated_product: Product):

    for index, item in enumerate(products):

        if item.id == product_id:

            products[index] = updated_product

            return {
                "message": "Product updated successfully",
                "product": updated_product
            }

    raise HTTPException(
        status_code=404,
        detail="Product not found"
    )

# Patch
@app.patch("/products/{product_id}")
def update_product_partial(product_id: int, update_data: ProductUpdate):

    for item in products:

        if item.id == product_id:

            update_fields = update_data.model_dump(exclude_unset=True)

            for key, value in update_fields.items():
                setattr(item, key, value)

            return {
                "message": "Product updated successfully",
                "product": item
            }

    raise HTTPException(
        status_code=404,
        detail="Product not found"
    )

@app.post("/cart")
def add_to_cart(item: CartItem):

    for product in products:

        if product.id == item.product_id:

            existing_item = None

            for cart_item in cart:
                if cart_item["product_id"] == item.product_id:
                    existing_item = cart_item
                    break

            if existing_item:
                new_quantity = existing_item["quantity"] + item.quantity
            else:
                new_quantity = item.quantity

            if new_quantity > product.quant:
                raise HTTPException(
                    status_code=400,
                    detail="Not enough stock available"
                )

            if existing_item:
                existing_item["quantity"] = new_quantity

                return {
                    "message": "Cart quantity increased",
                    "cart_item": existing_item
                }

            cart_item = {
                "product_id": product.id,
                "name": product.name,
                "price": product.price,
                "quantity": item.quantity
            }

            cart.append(cart_item)

            return {
                "message": "Product added to cart",
                "cart_item": cart_item
            }

    raise HTTPException(
        status_code=404,
        detail="Product not found"
    )


@app.get("/cart")
def get_cart():
    return cart

@app.delete("/cart/{product_id}")
def remove_from_cart(product_id: int):

    for item in cart:

        if item["product_id"] == product_id:

            cart.remove(item)

            return {
                "message": "Product removed from cart"
            }

    raise HTTPException(
        status_code=404,
        detail="Product not found in cart"
    )

@app.put("/cart/{product_id}")
def update_cart_quantity(
    product_id: int,
    quantity: int = Query(gt=0)
):

    for item in cart:

        if item["product_id"] == product_id:

            # Check stock availability
            for product in products:
                if product.id == product_id:
                    if quantity > product.quant:
                        raise HTTPException(
                            status_code=400,
                            detail="Not enough stock available"
                        )

            item["quantity"] = quantity

            return {
                "message": "Cart quantity updated",
                "cart_item": item
            }

    raise HTTPException(
        status_code=404,
        detail="Product not found in cart"
    )

@app.get("/cart/total")
def get_cart_total():

    total = 0

    for item in cart:
        total += item["price"] * item["quantity"]

    return {
        "total_items": sum(item["quantity"] for item in cart),
        "total_price": total
    }
#.\.venv\Scripts\uvicorn jaldi_api.main:app --host 127.0.0.1 --port 8000