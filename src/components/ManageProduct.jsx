import React, { useState, useEffect } from "react";
import { Container, Header, Card, Image, Button, Modal, Form, Grid, Message } from "semantic-ui-react";
import { Formik, Field, Form as FormikForm, ErrorMessage } from "formik";
import * as Yup from "yup";
import { getCategories, addProduct, updateProduct, deleteProduct } from "../services/productService";

const ManageProducts = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [initialValues, setInitialValues] = useState({ name: "", price: "", description: "", image: "", stock: "" });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setProducts(category.products || []);
  };

  const handleEdit = (product) => {
    setInitialValues(product);
    setIsEditing(true);
    setModalOpen(true);
  };

  const handleDelete = async (productId) => {
    try {
      await deleteProduct(selectedCategory.id, productId);
      await refreshProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const refreshProducts = async () => {
    try {
      const res = await getCategories();
      const updatedCategory = res.data.find((cat) => cat.id === selectedCategory?.id);
      setProducts(updatedCategory ? updatedCategory.products || [] : []);
    } catch (error) {
      console.error("Error refreshing products:", error);
    }
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Product name is required"),
    price: Yup.number().positive("Price must be positive").required("Price is required"),
    description: Yup.string().required("Description is required"),
    image: Yup.string().url("Must be a valid URL"),
    stock: Yup.number().integer("Stock must be an integer").min(0, "Stock cannot be negative").required("Stock is required"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      if (isEditing) {
        await updateProduct(selectedCategory.id, values.id, values);
      } else {
        await addProduct(selectedCategory.id, values);
      }
      await refreshProducts();
      setModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  return (
    <Container>
      <Header as="h2">Manage Products</Header>
      <Card.Group>
        {categories.map((category) => (
          <Card key={category.id} onClick={() => handleCategorySelect(category)}>
            <Image src={category.image} wrapped ui={false} />
            <Card.Content>
              <Card.Header>{category.name}</Card.Header>
            </Card.Content>
          </Card>
        ))}
      </Card.Group>

      {selectedCategory && (
        <>
          <Header as="h3">{selectedCategory.name} - Products</Header>
          <Button primary onClick={() => { setIsEditing(false); setInitialValues({ name: "", price: "", description: "", image: "", stock: "" }); setModalOpen(true); }}>Add Product</Button>
          <Card.Group>
            {products.map((product) => (
              <Card key={product.id}>
                <Image src={product.image || "https://via.placeholder.com/150"} wrapped ui={false} />
                <Card.Content>
                  <Card.Header>{product.name}</Card.Header>
                  <Card.Meta>${product.price}</Card.Meta>
                  <Card.Description>{product.description}</Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <Button color="yellow" onClick={() => handleEdit(product)}>Edit</Button>
                  <Button color="red" onClick={() => handleDelete(product.id)}>Delete</Button>
                </Card.Content>
              </Card>
            ))}
          </Card.Group>
        </>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Modal.Header>{isEditing ? "Edit Product" : "Add Product"}</Modal.Header>
        <Modal.Content>
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize>
            {({ isSubmitting }) => (
              <FormikForm>
                <Grid columns={2} stackable>
                  <Grid.Row>
                    <Grid.Column>
                      <Form.Field>
                        <label>Name</label>
                        <Field name="name" as={Form.Input} placeholder="Product Name" />
                        <ErrorMessage name="name" component={Message} color="red" />
                      </Form.Field>

                      <Form.Field>
                        <label>Price</label>
                        <Field name="price" as={Form.Input} type="number" placeholder="Price" />
                        <ErrorMessage name="price" component={Message} color="red" />
                      </Form.Field>
                    </Grid.Column>

                    <Grid.Column>
                      <Form.Field>
                        <label>Stock</label>
                        <Field name="stock" as={Form.Input} type="number" placeholder="Stock" />
                        <ErrorMessage name="stock" component={Message} color="red" />
                      </Form.Field>

                      <Form.Field>
                        <label>Image URL</label>
                        <Field name="image" as={Form.Input} placeholder="Image URL" />
                        <ErrorMessage name="image" component={Message} color="red" />
                      </Form.Field>
                    </Grid.Column>
                  </Grid.Row>

                  <Grid.Row>
                    <Grid.Column width={16}>
                      <Form.Field>
                        <label>Description</label>
                        <Field name="description" as={Form.TextArea} placeholder="Product Description" />
                        <ErrorMessage name="description" component={Message} color="red" />
                      </Form.Field>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
                <Modal.Actions>
                  <Button onClick={() => setModalOpen(false)}>Cancel</Button>
                  <Button primary type="submit" loading={isSubmitting}>{isEditing ? "Update" : "Add"}</Button>
                </Modal.Actions>
              </FormikForm>
            )}
          </Formik>
        </Modal.Content>
      </Modal>
    </Container>
  );
};

export default ManageProducts;
