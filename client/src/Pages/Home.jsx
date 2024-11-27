import React, { useEffect } from "react";
import { Navbar } from "../Components/Navbar";
import { ProductCard } from "../Components/ProductCard";
import noProducts from "../Assets/product-not-found.jpg";

const Home = ({
  userStatus,
  setUserStatus,
  allProducts,
  setAllProducts,
  products,
  setProducts,
}) => {
  useEffect(() => {
    const getProductData = async () => {
      fetch("http://localhost:5000/products/get-products", {
        method: "GET",
        mode: "cors",
      })
        .then((res) => res.json())
        .then((res) => {
          const userEmail = localStorage.getItem("userEmail");
          const products = res.productData.filter(
            (product) => product.sellerEmail !== userEmail
          );
          setAllProducts(products);
          setProducts(products);
          console.log(products.sellerEmail);
          console.log(products);
        });
    };
    getProductData();
    if (localStorage.getItem("token")) setUserStatus(true);
  }, [setAllProducts, setProducts, setUserStatus]);

  return (
    <div>
      <Navbar
        key="navbar"
        userStatus={userStatus}
        setUserStatus={setUserStatus}
        setProducts={setProducts}
        allProducts={allProducts}
      />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 m-4">
        {products.length > 0 &&
          products.map((item, index) => {
            return <ProductCard key={index} product={item} />;
          })}
      </div>
      {products.length === 0 && (
        <img
          src={noProducts}
          className="m-auto my-10"
          alt="No products found"
        />
      )}
    </div>
  );
};

export { Home };
