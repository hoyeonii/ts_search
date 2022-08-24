import React, { useEffect, useState } from "react";
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
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  SelectChangeEvent,
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
    discountPercentage: number;
  }
  const [data, setData] = useState<IProduct[]>([]);
  const [filteredData, setFilteredData] = useState<IProduct[]>([]);
  const [brand, setBrand] = useState<string[]>([]);
  const [query, setQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("Rating");
  const [filterBrand, setFilterBrand] = useState<string | null>("All Brands");
  const [value, setValue] = useState<number[]>([30, 1500]);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    fetch("https://dummyjson.com/products?limit=100")
      .then((res) => res.json())
      .then((json) => {
        setData(json.products);
        console.log(json.products[0]);
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
        .sort((a, b) => {
          switch (sortBy) {
            case "Rating":
              return b.rating - a.rating;
            case "Deals":
              return b.discountPercentage - a.discountPercentage;
            case "Lowest":
              return a.price - b.price;
            case "Highest":
              return b.price - a.price;
            default:
              return b.price - a.price;
          }
        })
    );
    setPage(1);
  }, [data, query, filterBrand, value, sortBy]);

  const handleChange = (e: Event, newValue: number | number[]) => {
    setValue(newValue as number[]);
  };
  const handleSelectChange = (event: SelectChangeEvent) => {
    console.log(event.target.value);
    setSortBy(event.target.value);
  };

  return (
    <div className="App" style={{ margin: "3%" }}>
      <div className="filterContainer" style={{ display: "flex" }}>
        <input
          type="text"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setQuery(e.target.value);
          }}
        />
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
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Sort by</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={sortBy}
            label="sortBy"
            onChange={handleSelectChange}
          >
            <MenuItem value="Rating">Rating</MenuItem>
            <MenuItem value="Deals">Deals</MenuItem>
            <MenuItem value="Lowest">Lowest Price</MenuItem>
            <MenuItem value="Hightest">Hightest Price</MenuItem>
          </Select>
        </FormControl>
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
                <Typography variant="body1">
                  {"rating :" + el.rating}
                </Typography>
                <Typography variant="body1">
                  {"discountPercentage :" + el.discountPercentage}
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
                disabled={page === i + 1 ? true : false}
                onClick={() => {
                  setPage(i + 1);
                }}
              >
                {i + 1}
              </Button>
            ))}
      </ButtonGroup>
    </div>
  );
}

export default App;
