from django.core.management.base import BaseCommand
from product.models import Product
import os

class Command(BaseCommand):
    help = 'Seed products from static/images folder'

    def handle(self, *args, **options):
        static_images_dir = os.path.join('static', 'images')
        if not os.path.isdir(static_images_dir):
            self.stdout.write(self.style.ERROR(f"Static images directory not found: {static_images_dir}"))
            return

        created = 0
        for fname in os.listdir(static_images_dir):
            if fname.startswith('.'):
                continue
            # skip non-image lookups
            if not any(fname.lower().endswith(ext) for ext in ('.png', '.jpg', '.jpeg', '.gif')):
                continue
            name = os.path.splitext(fname)[0].replace('_', ' ').title()
            defaults = {
                'description': f'Sample product {name}',
                'price': '99.99',
                'stock': True,
                'image': fname
            }
            obj, created_flag = Product.objects.get_or_create(name=name, defaults=defaults)
            if created_flag:
                created += 1
                self.stdout.write(self.style.SUCCESS(f'Created product: {obj.name} -> {fname}'))
        self.stdout.write(self.style.SUCCESS(f'Done. {created} products created.'))
