const express = require('express');
const axios = require('axios');
const cors=require("cors");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const app = express();
app.use(express.json());
app.use(cors())
require('dotenv').config(); 
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
app.post('/ask', async (req, res) => {
    try {
        const {user_input} = req.body;
        
        let response = await fetch(`https://api.openai.com/v1/chat/completions`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENAI_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "system", content: "You are a helpful assistant." },
                { role: "user", content: user_input },],
                
            })
        });
  
        response = await response.json();
  
        // Check if response.choices is defined and not empty
        if (response.choices && response.choices.length > 0) {
            const data = response.choices[0].message.content;
            res.status(200).send({ code: data });
        } else {
            // Handle the case when response.choices is empty
            res.status(500).send({ msg: "No valid response from the API" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ msg: error.message });
    }
  })
  let port=3000
app.listen(3000, () => {
  console.log(`Server is running on port ${port}`);
});
