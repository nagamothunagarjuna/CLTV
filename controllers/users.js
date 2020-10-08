const express = require("express");
const users = require("../modals/rootModal");
const config = require('../config/config.json');
const _lodash = require("lodash");
const exceptionHandler = require("../middleware/exceptionHandler");
const auth = require(". ./middleware/auth");
const router = express.Router();
const {
    check,
    validationResult
} = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post(
    "/list",
    exceptionHandler(async (req, res) => {
        const result = await users.find({});
        res.status(200).json({
            result
        });
    })
);

router.post(
    "/login",
    [
        check("username", "Please Enter a Valid Username")
        .not()
        .isEmpty(),
        check("password", "Please enter a valid password").isLength({
            min: 6
        })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
            });
        }
        const {
            username,
            password
        } = req.body;
        try {
            let user = await users.findOne({
                username,
            });
            if (!user)
                return res.status(400).json({
                    message: "User Not Exist",
                });
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch)
                return res.status(400).json({
                    message: "Incorrect Password !",
                });
            const payload = {
                user: {
                    id: user.id,
                    role:user.role_id
                },
            };
            jwt.sign(
                payload,
                config.Rtoken, {
                expiresIn: 3600,
            },
                (err, token) => {
                    if (err) throw err;
                    res.status(200).json({
                        token,
                    });
                }
            );
        } catch (e) {
            console.error(e);
            res.status(500).json({
                message: "Server Error",
            });
        }
    }
);
router.get("/me", auth, async (req, res) => {
    try {
        // request.user is getting fetched from Middleware after token authentication
        const user = await users.findById(req.user.id);
        res.json(user);
    } catch (e) {
        res.send({
            message: "Error in Fetching user"
        });
    }
});

router.post(
    "/signup",
    [
        check("username", "Please Enter a Valid Username")
        .not()
        .isEmpty(),
        check("email", "Please enter a valid email").isEmail(),
        check("password", "Please enter a valid password").isLength({
            min: 6
        })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const {
            username,
            email,
            password,
            role_id
        } = req.body;
        try {
            let user = await users.findOne({
                email
            });
            if (user) {
                return res.status(400).json({
                    msg: "User Already Exists"
                });
            }

            user = new users({
                username,
                email,
                password,
                role_id
            });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();

            const payload = {
                user: {
                    id: user.id,
                    role:user.role_id
                }
            };

            jwt.sign(
                payload,
                config.Rtoken, {
                    expiresIn: 10000
                },
                (err, token) => {
                    if (err) throw err;
                    res.status(200).json({
                        token
                    });
                }
            );
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Error in Saving");
        }
    }
);

module.exports = router;