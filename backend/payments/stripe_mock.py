import uuid
from types import SimpleNamespace


class FakeObject(dict):
    def __getattr__(self, k):
        # return None for missing attributes to be tolerant like Stripe objects
        return self.get(k, None)


def _make(id_prefix="id"):
    return FakeObject({"id": f"{id_prefix}_{uuid.uuid4().hex[:8]}"})


class StripeMock:
    api_key = None

    class Token:
        @staticmethod
        def create(card=None):
            return _make("tok")

    class PaymentIntent:
        @staticmethod
        def create(amount=None, currency="usd", payment_method_types=None, receipt_email=None, **kwargs):
            obj = _make("pi")
            obj.update({"amount": amount, "currency": currency, "status": "succeeded"})
            return obj

    class Customer:
        @staticmethod
        def create(email=None, source=None, description=None):
            c = _make("cus")
            c["email"] = email or f"user_{uuid.uuid4().hex[:6]}@example.com"
            # add a default source structure
            card = FakeObject({"id": f"card_{uuid.uuid4().hex[:8]}", "last4": "4242", "exp_month": 12, "exp_year": 2030})
            c["sources"] = SimpleNamespace(data=[card])
            return c

        @staticmethod
        def list(limit=10, email=None):
            # If caller filters by email, return a matching customer; otherwise return empty list
            if email:
                c = _make("cus")
                c["email"] = email
                card = FakeObject({"id": f"card_{uuid.uuid4().hex[:8]}", "last4": "4242", "exp_month": 12, "exp_year": 2030})
                c["sources"] = SimpleNamespace(data=[card])
                return SimpleNamespace(data=[c])
            return SimpleNamespace(data=[])

        @staticmethod
        def retrieve_source(customer_id, card_id):
            return FakeObject({"id": card_id, "last4": "4242", "exp_month": 12, "exp_year": 2030})

        @staticmethod
        def create_source(customer_id, source=None):
            return FakeObject({"id": f"card_{uuid.uuid4().hex[:8]}", "last4": "4242", "exp_month": 12, "exp_year": 2030})

        @staticmethod
        def modify_source(customer_id, card_id, **kwargs):
            updated = FakeObject({"id": card_id, "last4": "4242"})
            updated.update(kwargs)
            return updated

        @staticmethod
        def delete_source(customer_id, card_id):
            return SimpleNamespace(deleted=True)

        @staticmethod
        def delete(customer_id):
            return SimpleNamespace(deleted=True)

    class Charge:
        @staticmethod
        def create(amount=None, currency="usd", customer=None, source=None, description=None):
            return _make("ch")


stripe = StripeMock()
