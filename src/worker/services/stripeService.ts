import Stripe from 'stripe';

export class StripeService {
	private stripe: Stripe;

	constructor(secretKey: string) {
		this.stripe = new Stripe(secretKey);
	}

	/**
	 * Creates a Stripe checkout session for tee time monitor
	 */
	async createMonitorCheckoutSession(
		searchCriteriaId: string,
		priceId: string,
		successUrl: string,
		cancelUrl: string
	): Promise<string> {
		const session = await this.stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			line_items: [
				{
					price: priceId,
					quantity: 1,
				},
			],
			mode: 'payment',
			allow_promotion_codes: true,
			success_url: successUrl,
			cancel_url: cancelUrl,
			metadata: {
				searchCriteriaId,
			},
		});

		if (!session.url) {
			throw new Error('Failed to create checkout session URL');
		}

		return session.url;
	}

	/**
	 * Retrieves a checkout session, returning the customer id and email. Used to identify a
	 * subscriber from the session_id carried in the /connect link.
	 */
	async getCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session> {
		return this.stripe.checkout.sessions.retrieve(sessionId);
	}

	/**
	 * Creates a Stripe Billing Portal session for a customer so they can manage or cancel.
	 */
	async createBillingPortalSession(customerId: string, returnUrl: string): Promise<string> {
		const session = await this.stripe.billingPortal.sessions.create({
			customer: customerId,
			return_url: returnUrl,
		});
		return session.url;
	}
}
