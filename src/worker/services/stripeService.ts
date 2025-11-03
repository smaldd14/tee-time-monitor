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
}
