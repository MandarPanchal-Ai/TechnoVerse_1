from pydantic import BaseModel, Field
from typing import Optional

class Product(BaseModel):
    id: int
    name: str
    price: float
    desc:str
    quant:int

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None
    desc: Optional[str] = None
    quant: Optional[int] = None

class CartItem(BaseModel):
    product_id: int
    quantity: int = Field(default=1, gt=0)