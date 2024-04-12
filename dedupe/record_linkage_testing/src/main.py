"""
main.py: Main module for performace testing the record linkage API.

This module overrides the default phdi app.main module, so we can monkey patch the
existing phdi.linkage code with opentelemetry traces.

Usage:
    uvicorn main:app ...
"""
import logging
import inspect

# Load the original app.main module early so logging and other service values
# are properly initialized, before we monkey patch the modules.
from phdi.linkage import link

from opentelemetry import trace

LOGGER = logging.getLogger(__name__)
TRACER = trace.get_tracer(__name__)

def instrument_function(func):
    """
    Decorator to instrument a function with opentelemetry traces.
    """
    def wrapper(*args, **kwargs):
        with TRACER.start_as_current_span(func.__name__):
            return func(*args, **kwargs)
    return wrapper

def instrument_module(module):
    """
    Instrument all functions in a module with opentelemetry traces.
    """
    for name, obj in inspect.getmembers(module):
        if inspect.isfunction(obj):
            setattr(module, name, instrument_function(obj))

LOGGER.info("Monkey patching %s functions with opentelemetry traces", link.__name__)
instrument_module(link)
