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
		successUrl: string,
		cancelUrl: string
	): Promise<string> {
		const session = await this.stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			line_items: [
				{
					price_data: {
						currency: 'usd',
						product_data: {
							name: 'Tee Time Monitor',
							description: 'Monitor tee times and get notified when your preferred slots become available',
						},
						unit_amount: 99, // $0.99 in cents
					},
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
