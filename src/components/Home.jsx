import React from 'react';
import { Container, Button, Header, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom'; 

import '../App.css'; 

const Home = () => {
  return (
    <div className="home-page">
      <Segment inverted textAlign="center" className="container">
        <Container>
          <Header 
            as="h1" 
            inverted 
            style={{
              fontSize: '4rem', 
              fontWeight: 'bold', 
              textShadow: '2px 2px 5px rgba(0, 0, 0, 0.7)'
            }}
          >
            Welcome to Farm Fresh Shop
          </Header>
          
          <Header 
            as="h2" 
            inverted 
            style={{
              fontSize: '2rem', 
              marginBottom: '30px', 
              textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)'
            }}
          >
            Fresh Produce Delivered to Your Doorstep
          </Header>

          <Link to="/allproducts">
            <Button 
              primary 
              size="huge" 
              style={{ marginTop: '20px' }}
            >
              Shop Now
            </Button>
          </Link>
        </Container>
      </Segment>
    </div>
  );
};

export default Home;
