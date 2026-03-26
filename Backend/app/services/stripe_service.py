import stripe
import os
from typing import Dict, Any
from app.config import settings

class StripeService:
    @staticmethod
    def _get_stripe_api_key():
        """Lazy load Stripe API key"""
        if not hasattr(StripeService, '_stripe_initialized'):
            stripe.api_key = settings.stripe_secret_key
            StripeService._stripe_initialized = True
        return stripe.api_key

    @staticmethod
    def create_payment_intent(amount: int, currency: str = "usd", metadata: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Create a Stripe payment intent for policy purchase

        Args:
            amount: Amount in cents (e.g., 1000 for $10.00)
            currency: Currency code (default: usd)
            metadata: Additional metadata for the payment

        Returns:
            Payment intent data from Stripe
        """
        StripeService._get_stripe_api_key()  # Ensure API key is set
        try:
            intent = stripe.PaymentIntent.create(
                amount=amount,
                currency=currency,
                metadata=metadata or {},
                automatic_payment_methods={
                    'enabled': True,
                },
            )
            return {
                'client_secret': intent.client_secret,
                'payment_intent_id': intent.id,
                'amount': intent.amount,
                'currency': intent.currency,
                'status': intent.status
            }
        except stripe.error.StripeError as e:
            raise Exception(f"Stripe error: {str(e)}")

    @staticmethod
    def confirm_payment_intent(payment_intent_id: str) -> Dict[str, Any]:
        """
        Confirm a payment intent (for manual confirmation if needed)

        Args:
            payment_intent_id: The payment intent ID to confirm

        Returns:
            Updated payment intent data
        """
        StripeService._get_stripe_api_key()  # Ensure API key is set
        try:
            intent = stripe.PaymentIntent.retrieve(payment_intent_id)
            return {
                'status': intent.status,
                'amount': intent.amount,
                'currency': intent.currency,
                'payment_method': intent.payment_method,
                'charges': intent.charges
            }
        except stripe.error.StripeError as e:
            raise Exception(f"Stripe error: {str(e)}")

    @staticmethod
    def create_refund(payment_intent_id: str, amount: int = None) -> Dict[str, Any]:
        """
        Create a refund for a payment

        Args:
            payment_intent_id: The payment intent ID to refund
            amount: Amount to refund in cents (optional, full refund if not specified)

        Returns:
            Refund data from Stripe
        """
        StripeService._get_stripe_api_key()  # Ensure API key is set
        try:
            intent = stripe.PaymentIntent.retrieve(payment_intent_id)
            if not intent.charges.data:
                raise Exception("No charges found for this payment intent")

            charge_id = intent.charges.data[0].id

            refund_params = {'charge': charge_id}
            if amount:
                refund_params['amount'] = amount

            refund = stripe.Refund.create(**refund_params)

            return {
                'refund_id': refund.id,
                'amount': refund.amount,
                'status': refund.status,
                'payment_intent_id': payment_intent_id
            }
        except stripe.error.StripeError as e:
            raise Exception(f"Stripe error: {str(e)}")