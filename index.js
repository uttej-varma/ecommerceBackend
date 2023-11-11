const env=require("dotenv");
env.config();
const express = require("express");
const server = express();
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const { User } = require("./models/User");
const LocalStrategy = require("passport-local").Strategy;
const crypto = require("crypto");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken");
const cookieParser=require('cookie-parser')

const productRouters = require("./routers/Products");
const brandsRouter = require("./routers/Brands");
const categoryRouter = require("./routers/Categories");
const userRouter = require("./routers/User");
const authRouter = require("./routers/Auth");
const cartRouter = require("./routers/Cart");
const orderRouter = require("./routers/Orders");
const { isAuth, sanitizeUser, cookieExtractor } = require("./services/common");
const path=require('path')


//webhook
//todo:should capture the live order

const endpointSecret = process.env.ENDPOINT_SECRET;

server.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntentSucceeded = event.data.object;
      // Then define and call a function to handle the event payment_intent.succeeded
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});


//JWT options

// ...

const opts = {};
opts.jwtFromRequest = cookieExtractor
opts.secretOrKey =process.env.JWT_SECRET_KEY; //should not be in code
//middleware
server.use(express.static(path.resolve(__dirname,'build')));
server.use(cookieParser());
async function dataBaseConnection() {
  try {
    await mongoose.connect(
      process.env.MONGO_URL
    );
    console.log("connected to db");
  } catch (error) {
    console.log(error);
  }
}
dataBaseConnection();
server.use(
  session({
    secret: process.env.SESSION_SECRETKEY,
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
  })
);
server.use(passport.authenticate("session"));
server.use(
  cors({
    exposedHeaders: ["X-Total-Count"],
  })
);

server.use(express.json()); //to parse req.body
server.use("/products", isAuth(), productRouters.router); //we can also use JWT token
server.use("/brands", isAuth(), brandsRouter.router);
server.use("/categories", isAuth(), categoryRouter.router);
server.use("/users", isAuth(), userRouter.router);
server.use("/auth", authRouter.router);
server.use("/cart", isAuth(), cartRouter.router);
server.use("/orders", isAuth(), orderRouter.router);
// server.get("/", async (req, res) => {
//   res.json({ status: "success" });
// });

// //passport strategy (local)
passport.use(
  "local",
  new LocalStrategy(
    {usernameField:'email'},
    async function (email, password, done) {
    //by default passport uses userNAme
    try {
      const user = await User.findOne({ email: email }).exec();
      if (!user) {
        return done(null, false, { message: "invalid credentials" }); //for safety
      }
      crypto.pbkdf2(
        password,
        user.salt,
        310000,
        32,
        "sha256",
        async function (err, hashedPassword) {
          if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
            return done(null, false, { message: "invalid credentials" });
          }
          const token = jwt.sign(sanitizeUser(user), process.env.JWT_SECRET_KEY);
          done(null, {id:user.id,role:user.role,token:token});
        }
      );
    } catch (e) {
      done(e);
    }
  })
);

//passport strategy (JWT)

passport.use(
  "jwt",
  new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
      const user = await User.findById(jwt_payload.id);
      if (user) {
        return done(null, sanitizeUser(user)); //this calls serializer
      } else {
        return done(null, false);
        // or you could create a new account
      }
    } catch (e) {
      return done(err, false);
    }
  })
);

// //this craetes session variable req.user on beign called from callbacks
passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, { id: user.id, role: user.role });
  });
});
// //this creates session variable req.user when called from authorised req
passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

//payments


// This is your test secret API key.
const stripe = require("stripe")(process.env.STRIPE_SERVER_KEY);




server.post("/create-payment-intent", async (req, res) => {
  const { totalAmount } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount*100,
    currency: "inr",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});




server.listen(process.env.PORT, () => {
  console.log("server is running in port 3004");
});
