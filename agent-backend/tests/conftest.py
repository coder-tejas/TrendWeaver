import pytest
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

def pytest_configure(config):
    config.addinivalue_line("markers", "asyncio: mark test as asyncio")
