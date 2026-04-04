import stripe
import os
from typing import Dict, Any
from app.config import settings

class StripeService:
    @staticmethod
    def _get_stripe_api_key():
        """Lazy load Stripe API key"""
        if not hasattr(StripeService, '_stripe_initialized'):
            stripe.api_key = settings.STRIPE_SECRET_KEY
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
                description="Crop Insurance Premium",
                shipping={
                    "name": "Farmer",
                    "address": {
                        "line1": "123 Farm Road",
                        "city": "Mumbai",
                        "state": "MH",
                        "postal_code": "400001",
                        "country": "IN",
                    },
                },
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
                'status': getattr(intent, 'status', 'requires_action'),
                'amount': getattr(intent, 'amount', 0),
                'currency': getattr(intent, 'currency', 'usd'),
                'payment_method': getattr(intent, 'payment_method', None),
                'latest_charge': getattr(intent, 'latest_charge', None)
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
            charge_id = getattr(intent, 'latest_charge', None)
            
            if not charge_id:
                raise Exception("No charges found for this payment intent")

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