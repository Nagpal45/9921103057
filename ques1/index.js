const { default: axios } = require('axios');
const express = require('express');
const { config } = require('dotenv');
const { v4: uuidv4 } = require('uuid');

config();

const app = express();
app.use(express.json());

const API_BASE_URL = 'http://20.244.56.144/test';
const companies = ["AMZ", "FLP", "SNP", "MYN", "AZO"];

let allProducts = []; 

app.get('/categories/:categoryName/products', async (req, res) => {
    try {
        const { categoryName } = req.params;
        const { top, minPrice, maxPrice, page, sort, company: filterCompany } = req.query;

        const selectedCompanies = filterCompany ? [filterCompany] : companies;

        allProducts = []; 

        for (const company of selectedCompanies) {
            let url = `${API_BASE_URL}/companies/${company}/categories/${categoryName}/products?`;

            if (top) url += `top=${top}&`;
            if (minPrice) url += `minPrice=${minPrice}&`;
            if (maxPrice) url += `maxPrice=${maxPrice}&`;
            if (page) url += `page=${page}&`;
            if (sort) url += `sort=${sort}&`;

            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`
                }
            });

            const products = response.data.map(product => ({
                id: uuidv4(), 
                name: product.name,
                price: product.price,
                company: company,
            }));

            allProducts.push(...products);
        }

        res.json(allProducts);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/categories/:categoryName/products/:productId', async (req, res) => {
    try {
        const { productId } = req.params;

        const product = allProducts.find(product => product.id === productId);

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        console.error('Error fetching product details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
