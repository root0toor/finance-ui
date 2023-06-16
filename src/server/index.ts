/* eslint-disable no-console */

import { DefaultBodyType, rest } from 'msw';
import { setupServer } from 'msw/node';

type ApiMethods = 'post' | 'get' | 'put' | 'patch' | 'delete';

export type MockServerHandler = {
    path: string;
    status?: number;
    response: unknown;
    method: ApiMethods;
};

export const createMockedApi = (path: string, method: ApiMethods, response: unknown) => {
    return rest[method](`${path}`, (req, res, ctx) => {
        return res.once(ctx.status(200), ctx.json(response as DefaultBodyType));
    });
};

export const createServer = (v2Url: string, baseUrl: string, handlers: MockServerHandler[], isDebugMode = false) => {
    const result = handlers.map((handler) => {
        const url = handler.path.includes('token') ? v2Url : baseUrl;
        return rest[handler.method](`${url}${handler.path}`, (req, res, ctx) => {
            return res(ctx.status(handler.status || 200), ctx.json(handler.response as DefaultBodyType));
        });
    });
    const server = setupServer(...result);
    const onRequestStart = (req: { method: string; url: { href: string } }) => {
        console.log('==requeset started==', req.method, req.url.href);
    };

    const onRequestMatch = (req: { method: string; url: { href: string } }) => {
        console.log('==requeset matched==', req.method, req.url.href);
    };

    const onRequestUnhandled = (req: { method: string; url: { href: string } }) => {
        console.log('==requeset unhandled==', req.method, req.url.href);
    };

    if (isDebugMode) {
        server.events.on('request:match', onRequestMatch);
        server.events.on('request:start', onRequestStart);
        server.events.on('request:unhandled', onRequestUnhandled);
    }

    const removeListners = () => {
        server.events.removeAllListeners();
    };

    return { server, removeListners };
};
