import { useState, useEffect } from "react";
import {
    Container,
    Card,
    Button,
    Header,
    Icon,
    Image,
    Loader,
    Segment,
    Input,
    Dropdown,
    Pagination
} from "semantic-ui-react";
import http from "../common/http"; // Importing Axios instance

const AllProducts = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [priceFilter, setPriceFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        setLoading(true);
        http.get("/categories")
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => console.error("Error fetching categories:", error))
            .finally(() => setLoading(false));
    }, []);

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };

    const handleBack = () => {
        setSelectedCategory(null);
        setSearchTerm("");
        setPriceFilter("all");
        setCurrentPage(1);
    };

    const priceOptions = [
        { key: "all", text: "All Prices", value: "all" },
        { key: "low", text: "Below ₹100", value: "low" },
        { key: "mid", text: "₹100 - ₹500", value: "mid" },
        { key: "high", text: "Above ₹500", value: "high" },
    ];

    const filterProducts = (products) => {
        return products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
            let matchesPrice = true;
            
            if (priceFilter === "low") {
                matchesPrice = product.price < 100;
            } else if (priceFilter === "mid") {
                matchesPrice = product.price >= 100 && product.price <= 500;
            } else if (priceFilter === "high") {
                matchesPrice = product.price > 500;
            }

            return matchesSearch && matchesPrice;
        });
    };

    const displayedProducts = selectedCategory ? filterProducts(selectedCategory.products || []) : [];
    const totalPages = Math.ceil(displayedProducts.length / itemsPerPage);
    const paginatedProducts = displayedProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <Container style={{ padding: "2rem 0" }}>
            <Header as="h1" textAlign="center" style={{ fontSize: "2.5rem", color: "#2c3e50" }}>
                🛒 Browse Our Farm Fresh Products
            </Header>

            {/* Show Categories */}
            {!selectedCategory ? (
                loading ? (
                    <Loader active inline="centered" size="large">Loading...</Loader>
                ) : (
                    <Card.Group itemsPerRow={4} stackable>
                        {categories.map(category => (
                            <Card key={category.id} onClick={() => handleCategoryClick(category)} raised style={{ cursor: "pointer" }}>
                                <Image 
                                    src={category.image || "https://via.placeholder.com/150"} 
                                    wrapped 
                                    ui={false} 
                                    style={{ height: "150px", objectFit: "cover", borderRadius: "8px" }} 
                                />
                                <Card.Content style={{ textAlign: "center" }}>
                                    <Card.Header style={{ marginTop: "10px" }}>
                                        {category.name}
                                    </Card.Header>
                                </Card.Content>
                            </Card>
                        ))}
                    </Card.Group>
                )
            ) : (
                <>
                    <Button icon labelPosition="left" onClick={handleBack} style={{ marginBottom: "1rem" }}>
                        <Icon name="arrow left" /> Back to Categories
                    </Button>

                    <Segment textAlign="center" style={{ background: "#f7f7f7", padding: "1.5rem", borderRadius: "10px" }}>
                        <Header as="h2">{selectedCategory.name} Products</Header>
                    </Segment>

                    {/* Search and Filters */}
                    <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "1rem" }}>
                        <Input
                            icon="search"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: "50%" }}
                        />
                        <Dropdown
                            selection
                            options={priceOptions}
                            value={priceFilter}
                            onChange={(e, { value }) => setPriceFilter(value)}
                            style={{ width: "200px" }}
                        />
                    </div>

                    {/* Product Listing */}
                    <Card.Group itemsPerRow={5} stackable>
                        {paginatedProducts.length > 0 ? (
                            paginatedProducts.map(product => (
                                <Card key={product.id} raised>
                                    <Image 
                                        src={product.image} 
                                        wrapped 
                                        ui={false} 
                                        style={{ height: "200px", objectFit: "cover", borderRadius: "8px" }} 
                                    />
                                    <Card.Content>
                                        <Card.Header>{product.name}</Card.Header>
                                        <Card.Meta style={{ color: "green" }}>₹{product.price}</Card.Meta>
                                        <Card.Description>{product.description}</Card.Description>
                                    </Card.Content>
                                    <Card.Content extra textAlign="center">
                                        <Button color="green" icon labelPosition="left">
                                            <Icon name="cart plus" /> Buy Now
                                        </Button>
                                    </Card.Content>
                                </Card>
                            ))
                        ) : (
                            <p style={{ textAlign: "center", fontSize: "1.2rem" }}>No products found.</p>
                        )}
                    </Card.Group>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <Pagination
                            totalPages={totalPages}
                            activePage={currentPage}
                            onPageChange={(e, { activePage }) => setCurrentPage(activePage)}
                            style={{ marginTop: "1rem", display: "flex", justifyContent: "center" }}
                        />
                    )}
                </>
            )}
        </Container>
    );
};

export default AllProducts;
