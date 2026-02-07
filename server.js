const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");

const app = express();
app.use(express.json());

const FRONTEND = "TON_URL_GITHUB_PAGES"; 
// ex: https://remyleblanc.github.io/caution-stripe

app.use(cors({ origin: FRONTEND }));

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

app.get("/", (req, res) => {
  res.send("OK");
});

app.post("/create-setup-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "setup",
      payment_method_types: ["card"],
      success_url: `${FRONTEND}/success.html`,
      cancel_url: `${FRONTEND}/cancel.html`,
    });

    res.json({ id: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
