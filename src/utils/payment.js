import Stripe from "stripe";


async function createStripeAccount(user) {
    const account = await stripe.accounts.create({
        type: 'express',
        country: 'US',
        email: user.email,
    });

    user.stripeAccountId = account.id;
    await user.save();

    return account;
}

async function payment({
    metadata = {},
    payment_method_types = ['card'],
    mode = 'payment',
    success_url = process.env.SUCCUESS_URL,
    cancel_url = process.env.CANCEL_URL,
    discounts = [],
    customer_email = '',
    line_items = []
} = {}) {
    const session = await stripe.checkout.sessions.create({
        payment_method_types,
        mode,
        metadata,
        success_url,
        cancel_url,
        discounts,
        customer_email,
        line_items
    });
    return session;
}

export default { createStripeAccount, payment };
