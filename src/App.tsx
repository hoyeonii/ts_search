import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Slider } from "@mui/material";
function App() {
  interface IProduct {
    brand: string;
    category: string;
    description: string;
    id: number;
    images: string[];
    price: number;
    rating: number;
    stock: number;
    thumbnail: string;
    title: string;
  }
  const [data, setData] = useState<IProduct[]>([]);
  const [brand, setBrand] = useState<string[]>([]);
  const [query, setQuery] = useState<string>("");
  const [filterBrand, setFilterBrand] = useState<string>("");
  const [value, setValue] = useState<number[]>([2, 37]);

  useEffect(() => {
    fetch("https://dummyjson.com/products?limit=100")
      .then((res) => res.json())
      .then((json) => {
        setData(json.products);
        console.log(json.products);
        setBrand(json.products.map((product: IProduct) => product.brand));
      });
  }, []);

  const handleChange = (e: Event, newValue: number | number[]) => {
    setValue(newValue as number[]);
  };

  return (
    <div className="App">
      <select
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          setFilterBrand(e.target.value);
        }}
      >
        {brand.map((el) => (
          <option>{el}</option>
        ))}
      </select>
      <Slider
        getAriaLabel={() => "slider"}
        value={value}
        onChange={handleChange}
        valueLabelDisplay="on"
      />

      <input
        type="text"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setQuery(e.target.value);
        }}
      />
      {data
        .filter(
          (el) =>
            el.description.toLowerCase().includes(query) ||
            el.title.toLowerCase().includes(query)
        )
        .filter((el) => el.brand === filterBrand)
        .map((el) => (
          <div key={el.id}>
            <img
              src={el.thumbnail}
              style={{ width: "100px", height: "80px" }}
            />
            {el.title}
            {el.description}
          </div>
        ))}
    </div>
  );
}

export default App;
