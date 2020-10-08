const express = require("express");
const getRecords = require('../modals/rootModal');
const exceptionHandler = require("../middleware/exceptionHandler");
const router = express.Router();

router.post("/getAllRecords",
    exceptionHandler(async (req, res) => {
        let query = "select * from products";
        getRecords.selectRecords(query).then(result => {
            console.log(result);
            res.status(200).json(result[0]);
        })
    })
);

router.post("/getFewRecords",
    exceptionHandler(async (req, res) => {
        let query = "select * from products where Id = @input_parameter";
        let inputValue = 65;
        getRecords.selectRecords(query, inputValue).then(result => {
            console.log(result);
            res.status(200).json(result[0]);
        })
    })
);

module.exports = router;