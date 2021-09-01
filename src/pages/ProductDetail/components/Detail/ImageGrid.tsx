import { Button, Grid } from "@material-ui/core";
import React from "react";

export interface ImageGridProps {
  images: [];
  onSelect: any;
  selectedImage: any;
}

export default function ImageGrid({
  images,
  onSelect,
  selectedImage
}: ImageGridProps) {
  return (
    <Grid container direction="column" justifyContent="space-between">
      {images.map((image, index) => (
        <Button key={image[index]} onClick={() => onSelect(index)}>
          <img
            src={image}
            alt=""
            width="100%"
            style={{
              border:
                index === selectedImage
                  ? "solid 2px #009e7f"
                  : "solid 1px #eee",
              borderRadius: "5px"
            }}
          />
        </Button>
      ))}
    </Grid>
  );
}
