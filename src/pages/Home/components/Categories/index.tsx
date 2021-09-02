import React, { useEffect } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  makeStyles,
  Button
} from "@material-ui/core";
import { useAppSelector, useAppDispatch } from "store/hook";

import { getCategorys } from "store/Categories/categories.slice";

export interface CategoriesProps {}

const useStyle = makeStyles((theme) => ({
  root: {
    display: "flex !important",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "#fff",
    padding: "20px 0",
    borderRadius: "5px"
  },
  space: {
    margin: "30px 0"
  },
  nameStyle: {
    fontSize: "13px",
    fontWeight: 500,
    color: "#0d1136"
  },
  titleStyle: {
    color: "#192a56",
    marginBottom: "10px",
    fontSize: "1.5rem",
    fontWeight: 500
  }
}));

function SampleArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#888",
        height: "35px",
        width: "35px",
        borderRadius: "50%",
        zIndex: "1"
      }}
      onClick={onClick}
    />
  );
}

export default function Categories(props: CategoriesProps) {
  const classes = useStyle();
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 1,
    nextArrow: <SampleArrow />,
    prevArrow: <SampleArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      }
    ]
  };
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getCategorys());
  }, [dispatch]);

  const categorys = useAppSelector((state) => state.categories.cateloryList);

  return (
    <Box className={classes.space}>
      <Container>
        <Typography className={classes.titleStyle}>Categories</Typography>
        <Slider {...settings}>
          {categorys.map((category: any) => (
            <Button key={category.id}>
              <Link to={`/products?category=${category.sku}`}>
                <Box className={classes.root}>
                  <Box marginBottom="10px">
                    <img src={category.image} alt="" />
                  </Box>
                  <Typography className={classes.nameStyle}>
                    {category.name}
                  </Typography>
                </Box>
              </Link>
            </Button>
          ))}
        </Slider>
      </Container>
    </Box>
  );
}