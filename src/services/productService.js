import http from "../common/http";

// Fetch all categories
export const getCategories = () => http.get(`/categories`);

// Fetch products of a specific category
export const getProductsByCategory = async (categoryId) => {
    try {
      const { data } = await http.get(`/categories/${categoryId}`);
      return data?.products || [];
    } catch (error) {
      console.error(`Error fetching products: ${error.message}`);
      return [];
    }
  };

// Add a new product
export const addProduct = async (categoryId, product) => {
    const { data } = await http.get(`/categories/${categoryId}`);
    const newProduct = { id: Date.now(), ...product };
    return http.put(`/categories/${categoryId}`, {
        ...data,
        products: [...data.products, newProduct],
    });
};

// Update an existing product
export const updateProduct = async (categoryId, productId, updatedProduct) => {
    const { data } = await http.get(`/categories/${categoryId}`);
    return http.put(`/categories/${categoryId}`, {
        ...data,
        products: data.products.map((p) => p.id === productId ? { ...p, ...updatedProduct } : p),
    });
};

// Delete a product
export const deleteProduct = async (categoryId, productId) => {
    const { data } = await http.get(`/categories/${categoryId}`);
    return http.put(`/categories/${categoryId}`, {
        ...data,
        products: data.products.filter((p) => p.id !== productId),
    });
};