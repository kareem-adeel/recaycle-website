import Stripe from 'stripe';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // تأكد من ضبط مفتاح Stripe السري في ملف البيئة

// دالة لإنشاء حساب متصل
export const createStripeAccount = async (user) => {
    const account = await stripe.accounts.create({
        type: 'express', // يمكنك اختيار نوع الحساب المناسب لنموذج عملك
        country: 'US', // قم بتغيير البلد حسب الحاجة
        email: user.email,
    });

    // تخزين معرف حساب Stripe في نموذج المستخدم
    user.stripeAccountId = account.id;
    await user.save();

    return account;
};
