import React, { ChangeEvent, useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import {
  Slider,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Grid,
  Autocomplete,
  TextField,
  ButtonGroup,
} from "@mui/material";
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
  const [filteredData, setFilteredData] = useState<IProduct[]>([]);
  const [brand, setBrand] = useState<string[]>([]);
  const [query, setQuery] = useState<string>("");
  const [filterBrand, setFilterBrand] = useState<string | null>("All Brands");
  const [value, setValue] = useState<number[]>([30, 1500]);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    fetch("https://dummyjson.com/products?limit=100")
      .then((res) => res.json())
      .then((json) => {
        setData(json.products);
        setBrand(
          json.products
            .map((product: IProduct) => product.brand)
            .filter((v: string, i: number, a: string[]) => a.indexOf(v) === i)
        );
      });
  }, []);
  useEffect(() => {
    setFilteredData(
      data
        .filter(
          (el) =>
            el.description.toLowerCase().includes(query) ||
            el.title.toLowerCase().includes(query)
        )
        .filter((el) =>
          filterBrand && filterBrand !== "All Brands"
            ? el.brand === filterBrand
            : true
        )
        .filter((el) => el.price > value[0] && el.price < value[1])
    );
    setPage(1);
  }, [data, query, filterBrand, value]);

  console.log(Math.ceil(12 / (window.innerWidth / 300)));
  const handleChange = (e: Event, newValue: number | number[]) => {
    setValue(newValue as number[]);
  };

  return (
    <div className="App">
      {/* <select
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          setFilterBrand(e.target.value);
        }}
      >
        <option>All Brands</option>
        {brand.map((el) => (
          <option>{el}</option>
        ))}
      </select> */}
      <Autocomplete
        value={filterBrand}
        onChange={(e: any, value: string | null) => {
          setFilterBrand(value);
        }}
        disablePortal
        id="combo-box-demo"
        options={["All Brands", ...brand]}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Brand" />}
      />
      {filterBrand}
      <div style={{ width: "30%" }}>
        <Slider
          getAriaLabel={() => "slider"}
          value={value}
          step={30}
          onChange={handleChange}
          valueLabelDisplay="on"
          min={Math.min(...data.map((el) => el.price))}
          max={Math.max(...data.map((el) => el.price))}
        />
      </div>
      <input
        type="text"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setQuery(e.target.value);
        }}
      />
      <Grid container spacing={2} justifyContent="space-around">
        {filteredData.slice((page - 1) * 12, (page - 1) * 12 + 12).map((el) => (
          <Grid item xs={Math.ceil(12 / (window.innerWidth / 300))}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={el.thumbnail}
                alt="green iguana"
              />
              <CardContent>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  sx={{
                    display: "-webkit-box",
                    overflow: "hidden",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 1,
                  }}
                >
                  {el.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    display: "-webkit-box",
                    overflow: "hidden",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 2,
                  }}
                >
                  {el.description}
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  ${el.price}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Share</Button>
                <Button size="small">Learn More</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <ButtonGroup
        variant="contained"
        aria-label="outlined primary button group"
      >
        {filteredData.length > 12 &&
          Array(Math.ceil(filteredData.length / 12))
            .fill(0)
            .map((el, i) => (
              <Button
                onClick={() => {
                  setPage(i + 1);
                }}
                sx={{ color: page == i + 1 ? "gray" : "white" }}
              >
                {i + 1}
              </Button>
            ))}
      </ButtonGroup>
    </div>
  );
}

export default App;
