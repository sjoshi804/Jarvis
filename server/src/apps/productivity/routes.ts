import express = require('express');
const ProductivityRouter = express.Router();
const base_endpoint = "productivity"

ProductivityRouter.post(base_endpoint + "/goal", async (req, res) => {
    
});

ProductivityRouter.post(base_endpoint + "/project", async (req, res) => {

});

ProductivityRouter.post(base_endpoint + "/task", async (req, res) => {

});

ProductivityRouter.post(base_endpoint + "/sprint", async (req, res) => {

});

ProductivityRouter.post(base_endpoint + "/daily_plan", async (req, res) => {

});

export { ProductivityRouter };