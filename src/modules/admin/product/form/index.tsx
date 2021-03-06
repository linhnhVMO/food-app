/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-self-assign */
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-debugger */
import React, { useMemo, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useFormik, FormikProvider } from 'formik';
import clsx from 'clsx';
import { uuid } from 'short-uuid';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import InputAdornment from '@material-ui/core/InputAdornment';
import { RiArrowRightSLine } from 'react-icons/ri';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { AiOutlineDelete } from 'react-icons/ai';

import { useAppDispatch, useAppSelector } from 'store/hook';
import Paper from 'components/paper';
import {
  addProduct,
  updateProduct,
  getProduct
} from 'store/Products/products.slide';
import Button from 'components/button';
import {
  Product,
  Productclassification,
  ModelList,
  ValidateProductclassification
} from 'types/Product';
import { productSChema } from './product-form.schema';
import validateInfo from './validate';
import './styles.css';

interface ProductFormProps {
  mode: 'create' | 'edit';
}

const ProductForm = ({ mode }: ProductFormProps) => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const { productDetail, loading } = useAppSelector((state) => state.products);
  const { token } = useAppSelector((state) => state.auth);
  const { id } = useParams<{ id: string }>();
  const [imagesT, setImages] = useState<any>([]);
  const [imagesPreview, setImagesPreview] = useState<any>([]);
  const [isFocus, setIsFocus] = useState<Boolean>(false);
  const [isBlur, setIsBlur] = useState<Boolean>(false);

  const [productClassificationGroup, setProductClassificationGroup] = useState<
    Productclassification[]
  >([]);

  const [modelList, setModelList] = useState<ModelList[]>([]);

  const [errors, setErrors] = useState<Productclassification[]>([]);

  useEffect(() => {
    if (mode === 'edit') {
      if (productDetail && productDetail._id !== id) {
        dispatch(getProduct(id));
      } else {
        setImagesPreview(productDetail.images);
      }
    }

    if (mode === 'create' && productDetail.name === '') {
      history.replace('/admin/products/category');
    }
  }, [
    id,
    dispatch,
    token,
    productDetail,
    productClassificationGroup,
    modelList,
    errors,
    isFocus,
    isBlur
  ]);

  const ProductImagesChange = (e: any) => {
    const files = Array.from(e.target.files);
    files.forEach((file: any) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.readyState === 2) {
          setImagesPreview((old: any) => [
            ...old,
            { public_id: '', url: reader.result }
          ]);
          setImages([...imagesT, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDestroy = (item: string) => {
    setImages(imagesT.filter((image: any) => image !== item));
    setImagesPreview(imagesPreview.filter((image: any) => image !== item));
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocus(true);
    setIsBlur(false);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocus(false);
    setIsBlur(true);
  };

  const handleAddProductClassificationGroup = () => {
    setProductClassificationGroup([
      ...productClassificationGroup,
      { groupName: '', attributes: [''], _id: uuid() }
    ]);

    setModelList([
      ...modelList,
      {
        id_model: uuid(),
        modelListName: '',
        price: '',
        stock: '',
        sku: ''
      }
    ]);

    setErrors([...errors, { _id: '', groupName: '', attributes: [''] }]);
  };

  const handleAddProductClassificationGroup2 = () => {
    setProductClassificationGroup([
      ...productClassificationGroup,
      { groupName: '', attributes: [''], _id: uuid() }
    ]);
    const newModel = [...modelList];

    for (let i = 0; i < newModel.length; i++) {
      newModel[i].price = '';
      newModel[i].sku = '';
      newModel[i].stock = '';
    }
    // const a = newModel.map(
    //   (item: ModelList) => item.price = '' && item.stock = '' && item.sku = '')
    // );

    setModelList(newModel);
  };

  const handleAddProductClassification = (index: number) => {
    const newProductClassificationGroup = [...productClassificationGroup];
    newProductClassificationGroup[index].attributes.push('');

    setProductClassificationGroup(newProductClassificationGroup);

    if (productClassificationGroup.length === 1) {
      setModelList([
        ...modelList,
        {
          id_model: uuid(),
          modelListName: '',
          price: '',
          stock: '',
          sku: ''
        }
      ]);
    }

    if (productClassificationGroup.length > 1) {
      const newModel: ModelList[] = [...modelList];
      for (
        let i = 0;
        i < productClassificationGroup[0].attributes.length;
        i++
      ) {
        for (
          let j = 0;
          j < productClassificationGroup[1].attributes.length;
          j++
        ) {
          const nameAttribute = `${productClassificationGroup[0].attributes[i]},${productClassificationGroup[1].attributes[j]}`;
          newModel.push({
            id_model: uuid(),
            modelListName: nameAttribute,
            price: '',
            stock: '',
            sku: ''
          });
          console.log('newModule', newModel);

          // newModel.sort(function (arr1, arr2) {
          //   // eslint-disable-next-line prefer-const
          //   let a = arr1.modelListName;
          //   // eslint-disable-next-line prefer-const
          //   let b = arr2.modelListName;
          //   return a === b ? 0 : a > b ? 1 : -1;
          // });
          const filtered = newModel.filter(
            (v, newIndex, a) =>
              a.findIndex(
                (t) =>
                  t.modelListName === v.modelListName &&
                  v.price !== '' &&
                  v.stock !== '' &&
                  v.sku !== ''
              ) === newIndex
          );
          // const filtered = newModel.filter(
          //   (item: ModelList) => item.modelListName !== undefined
          // );
          console.log('filtered', filtered);
          setModelList(filtered);
        }
      }
    }
  };

  const handleDeleteProductClassification = (
    index: number,
    index2: number,
    name: string
  ) => {
    const newProductClassificationGroup = [...productClassificationGroup];
    newProductClassificationGroup[index].attributes.splice(index2, 1);
    setProductClassificationGroup(newProductClassificationGroup);

    if (index === 0) {
      const newModel = [...modelList];
      const a = newModel.filter(
        (item: ModelList) => !item.modelListName.includes(`${name}`)
      );

      setModelList(a);

      console.log('aaa', a);
    }

    if (index === 1) {
      const a = modelList.filter(
        (item: ModelList) => !item.modelListName.includes(`,${name}`)
      );

      setModelList(
        modelList.filter(
          (item: ModelList) => !item.modelListName.includes(`,${name}`)
        )
      );
    }

    // if (productClassificationGroup.length === 1) {
    //   const newModel: ModelList[] = [];
    //   for (
    //     let i = 0;
    //     i < productClassificationGroup[0].attributes.length;
    //     i++
    //   ) {
    //     const nameAttribute = productClassificationGroup[0].attributes[i];

    //     newModel.push({
    //       id_model: uuid(),
    //       modelListName: nameAttribute,
    //       price: '',
    //       stock: '',
    //       sku: ''
    //     });
    //     setModelList(newModel);
    //   }
    // }
  };

  const handleDeleteProductClassificationGroup = (
    _id: string,
    index: number
  ) => {
    setProductClassificationGroup(
      productClassificationGroup.filter(
        (item: Productclassification) => item._id !== _id
      )
    );

    setErrors(errors.filter((item, _index) => _index !== index && item));

    setModelList([]);

    const newModel: ModelList[] = [];

    if (index === 0) {
      for (
        let i = 0;
        i < productClassificationGroup[1]?.attributes.length;
        i++
      ) {
        const nameAttribute = productClassificationGroup[1]?.attributes[i];
        newModel.push({
          id_model: uuid(),
          modelListName: nameAttribute,
          price: '',
          stock: '',
          sku: ''
        });
        setModelList(newModel);
      }
    }

    if (index === 1) {
      for (
        let i = 0;
        i < productClassificationGroup[0]?.attributes.length;
        i++
      ) {
        const nameAttribute = productClassificationGroup[0]?.attributes[i];
        newModel.push({
          id_model: uuid(),
          modelListName: nameAttribute,
          price: '',
          stock: '',
          sku: ''
        });
        setModelList(newModel);
      }
    }
  };

  const handleOnChangeGroupName = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newProductClassificationGroup = [...productClassificationGroup];

    newProductClassificationGroup[index].groupName = e.target.value;

    setProductClassificationGroup(newProductClassificationGroup);

    // setErrors(validateInfo(productClassificationGroup));
  };

  const handleOnChangeAttributes = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    index2: number
  ) => {
    const newYProductClassificationGroup = [...productClassificationGroup];

    newYProductClassificationGroup[index].attributes[index2] = e.target.value;

    setProductClassificationGroup(newYProductClassificationGroup);

    if (productClassificationGroup.length === 1) {
      const newModel: ModelList[] = [...modelList];
      const nameAttribute = [];
      for (
        let i = 0;
        i < productClassificationGroup[0].attributes.length;
        i++
      ) {
        nameAttribute.push(`${productClassificationGroup[0].attributes[i]}`);
      }

      for (let j = 0; j < newModel.length; j++) {
        newModel[j].modelListName = nameAttribute[j];
        newModel[j].price = newModel[j].price;
        newModel[j].stock = newModel[j].stock;
        newModel[j].sku = newModel[j].sku;
      }

      setModelList(newModel);
    }

    if (productClassificationGroup.length > 1) {
      const newModel: ModelList[] = [...modelList];
      const nameAttribute = [];
      for (
        let i = 0;
        i < productClassificationGroup[0].attributes.length;
        i++
      ) {
        for (
          let j = 0;
          j < productClassificationGroup[1].attributes.length;
          j++
        ) {
          nameAttribute.push(
            `${productClassificationGroup[0].attributes[i]},${productClassificationGroup[1].attributes[j]}`
          );
        }
      }

      for (let j = 0; j < newModel.length; j++) {
        newModel[j].modelListName = nameAttribute[j];
        newModel[j].price = newModel[j].price;
        newModel[j].stock = newModel[j].stock;
        newModel[j].sku = newModel[j].sku;
      }

      setModelList(newModel);
    }
    // setErrors(validateInfo(productClassificationGroup, errors));
  };

  const handleChangeModelList = (
    e: React.ChangeEvent<HTMLInputElement>,
    _id: string
  ) => {
    const { name, value } = e.target;
    setModelList(
      modelList.map((item) =>
        item.id_model === _id ? { ...item, [name]: value } : item
      )
    );
  };

  const initialValues = useMemo(() => {
    if (mode === 'edit') {
      return {
        _id: productDetail._id,
        name: productDetail.name,
        description: productDetail.description,
        price: productDetail.price,
        ratings: productDetail.ratings,
        images: productDetail.images,
        category: productDetail.category,
        stock: productDetail.stock,
        numOfReviews: productDetail.numOfReviews,
        reviews: productDetail.reviews,
        createAt: productDetail.createAt
      };
    }

    return {
      name: productDetail.name,
      description: '',
      price: 0,
      ratings: 0,
      category: productDetail.category,
      stock: 0,
      numOfReviews: 0,
      createAt: ''
    };
  }, [productDetail, mode]);

  function handleSubmit(values: Product) {
    if (mode === 'edit') {
      const product: Product = { ...values, images: imagesPreview };
      const data = { product, token, id };
      dispatch(updateProduct(data));
      history.push('/admin/products');
    }
    if (mode === 'create') {
      const product: Product = { ...values, images: imagesT };
      const data = { product, token };

      dispatch(addProduct(data));
      history.push('/admin/products');
    }
    setIsFocus(true);
    setErrors(validateInfo(productClassificationGroup));
  }

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: productSChema,
    onSubmit: handleSubmit
  });

  console.log('hellloooo', productClassificationGroup);
  console.log('Model List', modelList);
  // console.log('Errors', errors);

  // console.log('Focus', isFocus);
  // console.log('Blur', isBlur);

  return (
    <FormikProvider value={formik}>
      <form onSubmit={formik.handleSubmit}>
        <Grid
          container
          spacing={2}
          className="flex flex-row justify-center items-center"
        >
          <Paper
            loading={loading}
            heading="Product Basic Information"
            className="w-4_5 mb-5"
          >
            <Grid container item spacing={2}>
              <Grid item lg={2} md={2}>
                <p>Product pictures</p>
              </Grid>
              <Grid item lg={10} md={10}>
                <div className="flex flex-col my-6">
                  <div
                    id="createProductFormImage"
                    className="flex mb-6 flex-wrap items-center"
                  >
                    <div className="wrapper_image mr-3 mb-3">
                      <img src={imagesPreview[0]?.url} alt="" />
                      <div className="remove_image">
                        <IconButton
                          onClick={() => handleDestroy(imagesPreview[0])}
                        >
                          <CloseIcon />
                        </IconButton>
                      </div>
                      <div
                        id="createProductFormFile"
                        className="drop-file-input"
                      >
                        <input
                          type="file"
                          name="images"
                          accept="image/*"
                          onChange={ProductImagesChange}
                          multiple
                        />
                      </div>
                    </div>

                    <div className="wrapper_image mr-3 mb-3">
                      <img src={imagesPreview[1]?.url} alt="" />
                      <div className="remove_image">
                        <IconButton
                          onClick={() => handleDestroy(imagesPreview[1])}
                        >
                          <CloseIcon />
                        </IconButton>
                      </div>
                      <div
                        id="createProductFormFile1"
                        className="drop-file-input"
                      >
                        <input
                          type="file"
                          name="images"
                          accept="image/*"
                          onChange={ProductImagesChange}
                          multiple
                        />
                      </div>
                    </div>
                    <div className="wrapper_image mr-3 mb-3">
                      <img src={imagesPreview[2]?.url} alt="" />
                      <div className="remove_image">
                        <IconButton
                          onClick={() => handleDestroy(imagesPreview[2])}
                        >
                          <CloseIcon />
                        </IconButton>
                      </div>
                      <div
                        id="createProductFormFile2"
                        className="drop-file-input"
                      >
                        <input
                          type="file"
                          name="images"
                          accept="image/*"
                          onChange={ProductImagesChange}
                          multiple
                        />
                      </div>
                    </div>
                    <div className="wrapper_image mr-3 mb-3">
                      <img src={imagesPreview[3]?.url} alt="" />
                      <div className="remove_image">
                        <IconButton
                          onClick={() => handleDestroy(imagesPreview[3])}
                        >
                          <CloseIcon />
                        </IconButton>
                      </div>
                      <div
                        id="createProductFormFile3"
                        className="drop-file-input"
                      >
                        <input
                          type="file"
                          name="images"
                          accept="image/*"
                          onChange={ProductImagesChange}
                          multiple
                        />
                      </div>
                    </div>
                    <div className="wrapper_image mr-3 mb-3">
                      <img src={imagesPreview[4]?.url} alt="" />
                      <div className="remove_image">
                        <IconButton
                          onClick={() => handleDestroy(imagesPreview[4])}
                        >
                          <CloseIcon />
                        </IconButton>
                      </div>
                      <div
                        id="createProductFormFile4"
                        className="drop-file-input"
                      >
                        <input
                          type="file"
                          name="images"
                          accept="image/*"
                          onChange={ProductImagesChange}
                          multiple
                        />
                      </div>
                    </div>
                    <div className="wrapper_image mr-3 mb-3">
                      <img src={imagesPreview[5]?.url} alt="" />
                      <div className="remove_image">
                        <IconButton
                          onClick={() => handleDestroy(imagesPreview[5])}
                        >
                          <CloseIcon />
                        </IconButton>
                      </div>
                      <div
                        id="createProductFormFile5"
                        className="drop-file-input"
                      >
                        <input
                          type="file"
                          name="images"
                          accept="image/*"
                          onChange={ProductImagesChange}
                          multiple
                        />
                      </div>
                    </div>
                    <div className="wrapper_image mr-3 mb-3">
                      <img src={imagesPreview[6]?.url} alt="" />
                      <div className="remove_image">
                        <IconButton
                          onClick={() => handleDestroy(imagesPreview[6])}
                        >
                          <CloseIcon />
                        </IconButton>
                      </div>
                      <div
                        id="createProductFormFile6"
                        className="drop-file-input"
                      >
                        <input
                          type="file"
                          name="images"
                          accept="image/*"
                          onChange={ProductImagesChange}
                          multiple
                        />
                      </div>
                    </div>
                    <div className="wrapper_image mr-3 mb-3">
                      <img src={imagesPreview[7]?.url} alt="" />
                      <div className="remove_image">
                        <IconButton
                          onClick={() => handleDestroy(imagesPreview[7])}
                        >
                          <CloseIcon />
                        </IconButton>
                      </div>
                      <div
                        id="createProductFormFile7"
                        className="drop-file-input"
                      >
                        <input
                          type="file"
                          name="images"
                          accept="image/*"
                          onChange={ProductImagesChange}
                          multiple
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Grid>
            </Grid>

            <Grid container item spacing={2}>
              <Grid item lg={2} md={2}>
                <p>Product Name</p>
              </Grid>
              <Grid item lg={10} md={10}>
                <TextField
                  id="name"
                  fullWidth
                  name="name"
                  type="text"
                  variant="outlined"
                  inputProps={{
                    maxLength: 120
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {formik.values.name.length}/120
                      </InputAdornment>
                    )
                  }}
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={!!formik.touched.name && !!formik.errors.name}
                  helperText={
                    formik.touched.name &&
                    formik.errors.name &&
                    formik.errors.name
                  }
                />
              </Grid>
            </Grid>
            <Grid container item spacing={2}>
              <Grid item lg={2} md={2}>
                <p>Description</p>
              </Grid>
              <Grid item lg={10} md={10}>
                <TextField
                  id="description"
                  name="description"
                  type="text"
                  multiline
                  rows={10}
                  fullWidth
                  variant="outlined"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  error={
                    !!formik.touched.description && !!formik.errors.description
                  }
                  helperText={
                    formik.touched.description &&
                    formik.errors.description &&
                    formik.errors.description
                  }
                />
              </Grid>
            </Grid>
            <Grid container item spacing={2}>
              <Grid item lg={2} md={2}>
                <p>Category</p>
              </Grid>
              <Grid item lg={10} md={10} className="flex items-center">
                <div className="flex category-product">
                  {formik.values.category?.map((category: any) => (
                    <span
                      key={Math.random()}
                      className="flex items-center justify-center category-product-item"
                    >
                      <RiArrowRightSLine className="iconArrows mx-1" />

                      {category}
                    </span>
                  ))}
                </div>
              </Grid>
            </Grid>
          </Paper>

          <Paper
            loading={loading}
            heading="Sales Information"
            className="w-4_5 mb-5"
          >
            {productClassificationGroup.length === 0 && (
              <>
                <Grid container item spacing={2}>
                  <Grid item lg={2} md={2}>
                    <p>Product classification</p>
                  </Grid>
                  <Grid item lg={10} md={10}>
                    <div
                      onClick={handleAddProductClassificationGroup}
                      className="flex justify-center items-center border border-green-500 border-dashed"
                    >
                      <IoIosAddCircleOutline className="text-xl mr-3" />
                      <p>Add taxonomy group</p>
                    </div>
                  </Grid>
                </Grid>
                <Grid container item spacing={2}>
                  <Grid item lg={2} md={2}>
                    <p>Price</p>
                  </Grid>
                  <Grid item lg={10} md={10}>
                    <TextField
                      fullWidth
                      defaultValue
                      name="price"
                      id="price"
                      type="number"
                      variant="outlined"
                      value={formik.values.price}
                      onChange={formik.handleChange}
                      error={!!formik.touched.price && !!formik.errors.price}
                      helperText={
                        formik.touched.price &&
                        formik.errors.price &&
                        formik.errors.price
                      }
                    />
                  </Grid>
                </Grid>
                <Grid container item spacing={2}>
                  <Grid item lg={2} md={2}>
                    <p>Stock</p>
                  </Grid>
                  <Grid item lg={10} md={10}>
                    <TextField
                      id="stock"
                      fullWidth
                      name="stock"
                      type="number"
                      variant="outlined"
                      required
                      value={formik.values.stock}
                      onChange={formik.handleChange}
                      error={!!formik.touched.stock && !!formik.errors.stock}
                      helperText={
                        formik.touched.stock &&
                        formik.errors.stock &&
                        formik.errors.stock
                      }
                    />
                  </Grid>
                </Grid>
              </>
            )}

            {productClassificationGroup.length > 0 &&
              productClassificationGroup.map(
                (classification: Productclassification, index: number) => (
                  <Grid
                    container
                    item
                    spacing={3}
                    key={classification._id}
                    className="mb-8"
                  >
                    <Grid item lg={2} md={2}>
                      <p>Classification group {index + 1}</p>
                      <div
                        className="pointer text-xl"
                        onClick={(_id) =>
                          handleDeleteProductClassificationGroup(
                            classification._id,
                            index
                          )
                        }
                      >
                        <AiOutlineDelete />
                      </div>
                    </Grid>
                    <Grid
                      item
                      lg={10}
                      md={10}
                      className="flex flex-row classify"
                    >
                      <div className="flex mb-5">
                        <p className="w-1_5">T??n nh??m ph??n lo???i</p>
                        <div className="w-full">
                          <TextField
                            type="text"
                            variant="outlined"
                            className="w-11_12"
                            value={classification.groupName}
                            inputProps={{
                              maxLength: 15
                            }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  {classification.groupName.length}/15
                                </InputAdornment>
                              )
                            }}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => handleOnChangeGroupName(e, index)}
                            error={!classification.groupName && !!isFocus}
                            helperText={
                              classification.groupName === '' && isFocus
                                ? 'Group Name cannot be emppty'
                                : null
                            }
                          />
                        </div>
                      </div>
                      <div className="flex">
                        <p className="w-1_5">Ph??n lo???i h??ng</p>
                        <div className="w-full">
                          {classification.attributes.map(
                            (attribute: string, index2: number) => (
                              <div
                                key={index2}
                                className="flex items-center mb-5"
                              >
                                <TextField
                                  type="text"
                                  variant="outlined"
                                  className="w-11_12"
                                  value={attribute}
                                  inputProps={{
                                    maxLength: 20
                                  }}
                                  InputProps={{
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        {attribute.length}/20
                                      </InputAdornment>
                                    )
                                  }}
                                  onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                  ) =>
                                    handleOnChangeAttributes(e, index, index2)
                                  }
                                  error={!attribute && !!isFocus}
                                  helperText={
                                    attribute === '' && isFocus
                                      ? 'Attribute Name cannot be emppty'
                                      : null
                                  }
                                />

                                {classification.attributes.length > 1 && (
                                  <div
                                    className="pointer text-xl ml-5"
                                    onClick={() =>
                                      handleDeleteProductClassification(
                                        index,
                                        index2,
                                        attribute
                                      )
                                    }
                                  >
                                    <AiOutlineDelete />
                                  </div>
                                )}
                              </div>
                            )
                          )}
                          <div
                            onClick={() =>
                              handleAddProductClassification(index)
                            }
                            className="flex justify-center items-center w-11_12 bg-primary text-white opacity-80"
                          >
                            <IoIosAddCircleOutline className="text-xl mr-3" />
                            <p>Add</p>
                          </div>
                        </div>
                      </div>
                    </Grid>
                    {productClassificationGroup.length === 1 && (
                      <>
                        <Grid item lg={2} md={2}>
                          <p>Classification group 2</p>
                        </Grid>
                        <Grid item lg={10} md={10}>
                          <div
                            onClick={handleAddProductClassificationGroup2}
                            className="flex justify-center items-center border border-green-500 border-dashed"
                          >
                            <IoIosAddCircleOutline className="text-xl mr-3" />
                            <p>Add group 2</p>
                          </div>
                        </Grid>
                      </>
                    )}
                  </Grid>
                )
              )}

            {productClassificationGroup.length > 0 && (
              <Grid container item spacing={3}>
                <Grid item lg={2} md={2}>
                  <p>Danh s??ch ph??n lo???i h??ng</p>
                </Grid>
                <Grid item lg={10} md={10}>
                  <div className="flex classification-table">
                    <div className="flex-2">
                      <div className="flex name">
                        {productClassificationGroup.map((item) => (
                          <>
                            {item.groupName ? (
                              <div className="w-full py-3 text-center border border-gray-200 border-solid">
                                {item.groupName}
                              </div>
                            ) : (
                              <div className="w-full py-3 text-center border border-gray-200 border-solid">
                                Name
                              </div>
                            )}
                          </>
                        ))}
                      </div>
                      <div className="flex flex-direction flex-col">
                        {productClassificationGroup[0]?.attributes.map(
                          (item) => (
                            <div className="table-data flex" key={uuid()}>
                              {item ? (
                                <div className="w-full py-3 flex justify-center items-center border border-gray-200 border-solid">
                                  {item}
                                </div>
                              ) : (
                                <div className="w-full py-3 text-center border border-gray-200 border-solid">
                                  Lo???i
                                </div>
                              )}

                              <div
                                className={clsx(
                                  productClassificationGroup[1] ? 'w-full' : ''
                                )}
                              >
                                {productClassificationGroup[1]?.attributes.map(
                                  (lii) => (
                                    <>
                                      {lii ? (
                                        <div className="w-full h-5 py-3 text-center border border-gray-200 border-solid">
                                          {lii}
                                        </div>
                                      ) : (
                                        <div className="w-full h-5 py-3 text-center border border-gray-200 border-solid">
                                          Lo???i
                                        </div>
                                      )}
                                    </>
                                  )
                                )}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    <div className="flex-3">
                      <div>
                        <div className="flex">
                          <div className="py-3 w-full text-center border border-gray-200 border-solid">
                            Price
                          </div>
                          <div className="py-3 w-full text-center border border-gray-200 border-solid">
                            Stock
                          </div>
                          <div className="py-3 w-full text-center border border-gray-200 border-solid">
                            SKU
                          </div>
                        </div>
                        <div>
                          {modelList.map((item) => (
                            <div key={item.id_model} className="flex w-full">
                              <div className="flex flex-row flex-1 relative">
                                <input
                                  type="text"
                                  name="price"
                                  className="h-5 text-center py-3 border border-gray-200 border-solid"
                                  value={item.price}
                                  onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                  ) => handleChangeModelList(e, item.id_model)}
                                />
                                {!item.price && isFocus && (
                                  <span className="error absolute w-11_12 bg-primary text-white text-center text-xs py-1 ml-1 -top-9 rounded-sm">
                                    Price can't empty
                                  </span>
                                )}
                              </div>

                              <div className="flex flex-row flex-1 relative">
                                <input
                                  type="text"
                                  name="stock"
                                  className="h-5 text-center py-3 border border-gray-200 border-solid"
                                  value={item.stock}
                                  onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                  ) => handleChangeModelList(e, item.id_model)}
                                />
                                {!item.stock && isFocus && (
                                  <span className="error absolute w-11_12 bg-primary text-white text-center text-xs py-1 ml-1 -top-9 rounded-sm">
                                    Stock can't empty
                                  </span>
                                )}
                              </div>

                              <div className="flex flex-row flex-1 relative">
                                <input
                                  type="text"
                                  name="sku"
                                  className="h-5 text-center py-3 border border-gray-200 border-solid"
                                  value={item.sku}
                                  onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                  ) => handleChangeModelList(e, item.id_model)}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Grid>
              </Grid>
            )}
          </Paper>
          <Grid container item spacing={2} className="w-4_5 justify-end">
            <div className="mb-9">
              <Button
                onClick={() => history.push('/admin/products')}
                className="mr-5 w-32 btn-cancel"
              >
                Cancel
              </Button>
              <Button type="submit" className="w-32">
                Save
              </Button>
            </div>
          </Grid>
        </Grid>
      </form>
    </FormikProvider>
  );
};

export default ProductForm;
