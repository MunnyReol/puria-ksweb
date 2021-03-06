# -*- coding: utf-8 -*-
"""Error controller"""
from tg import request, expose
from ksweb.lib.base import BaseController
from tg.i18n import lazy_ugettext as l_, ugettext as _


__all__ = ['ErrorController']


class ErrorController(BaseController):
    """
    Generates error documents as and when they are required.

    The ErrorDocuments middleware forwards to ErrorController when error
    related status codes are returned from the application.

    This behaviour can be altered by changing the parameters to the
    ErrorDocuments middleware in your config/middleware.py file.

    """

    @expose('ksweb.templates.error')
    def document(self, *args, **kwargs):
        """Render the error document"""
        resp = request.environ.get('tg.original_response')
        try:
            # tg.abort exposes the message as .detail in response
            message = resp.detail
        except: # pragma: no cover
            message = None

        if not message:
            message = _("<p>We're sorry but we weren't able to process "
                         " this request.</p>")

        values = dict(prefix=request.environ.get('SCRIPT_NAME', ''),
                      code=request.params.get('code', resp.status_int),
                      message=request.params.get('message', message))
        return values
