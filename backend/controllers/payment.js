const errorHandler = require("../Util/ErrorHandler/errorSender");
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

exports.createPaymentIntent = async (req, res) => {
    const amount = Math.round(req.body.amount * 100);
    try {
        console.log("Creating payment intent with amount:", amount);
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'EGP',
            payment_method_types: ['card'],
        });

        console.log("Payment intent created: ", paymentIntent);

        return res.status(200).json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error("Error creating payment intent: ", error.message);
        res.status(400).json({ error: error.message });
    }
}