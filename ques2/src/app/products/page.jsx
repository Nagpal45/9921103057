"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    company: '',
    minPrice: '1',
    maxPrice: '10000',
    rating: '',
    category: '',
    availability: '',
  });

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products', {
        params: filters,
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  return (
    <div>
      <h1>Products</h1>
      <form onSubmit={handleFormSubmit}>
        <label htmlFor="company">Company:</label>
        <select id="company" name="company" onChange={handleFilterChange}>
          <option value="">All</option>
          <option value="AMZ">AMZ</option>
          <option value="FLP">FLP</option>
          <option value="SNP">SNP</option>
          <option value="MYN">MYN</option>
          <option value="AZO">AZO</option>
        </select>

        <label htmlFor="minPrice">Min Price:</label>
        <input type="number" id="minPrice" name="minPrice" onChange={handleFilterChange} />

        <label htmlFor="maxPrice">Max Price:</label>
        <input type="number" id="maxPrice" name="maxPrice" onChange={handleFilterChange} />

        <label htmlFor="rating">Rating:</label>
        <select id="rating" name="rating" onChange={handleFilterChange}>
          <option value="">All</option>
          <option value="1">1 star</option>
          <option value="2">2 stars</option>
          <option value="3">3 stars</option>
          <option value="4">4 stars</option>
          <option value="5">5 stars</option>
        </select>

        <label htmlFor="category">Category:</label>
        <input type="text" id="category" name="category" onChange={handleFilterChange} />

        <label htmlFor="availability">Availability:</label>
        <select id="availability" name="availability" onChange={handleFilterChange}>
          <option value="">All</option>
          <option value="In Stock">In Stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>

        <button type="submit">Apply Filters</button>
      </form>

      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} - ${product.price}
          </li>
        ))}
      </ul>
    </div>
  );
}
