#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys
from dotenv import load_dotenv, find_dotenv


def main():
    """Run administrative tasks."""
    if os.environ.get("DEBUG", False):
        os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.prd_settings")
    else:
        load_dotenv(find_dotenv(".env.development"))
        os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.dev_settings")
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main()
