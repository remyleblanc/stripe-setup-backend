const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");

const app = express();

// 🔓 CORS ouvert pour éviter le blocage navigateur
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

app.options("*", cors());
app.use(express.json());

// 🔑 Stripe avec la clé secrète stockée dans Railway
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ Route test (quand tu ouvres l’URL Railway)
app.get("/", (req, res) => {
  res.send("OK");
});

// ✅ Route création Setup Intent (empreinte bancaire)
app.post("/create-setup-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "setup",
      payment_method_types: ["card"],
      success_url: "https://remyleblanc.github.io/caution-stripe/success.html",
      cancel_url: "https://remyleblanc.github.io/caution-stripe/cancel.html",
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// 🚀 Lancement serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});

