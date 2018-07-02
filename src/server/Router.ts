import { IncomingMessage, ServerResponse } from 'http';
import pathToRegexp from 'path-to-regexp';
import { ParsedUrlQuery } from 'querystring';
import { parse } from 'url';

interface IQueryableIncomingMessage extends IncomingMessage {
  query?: ParsedUrlQuery;
}

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS',
}

export interface IRoute {
  method: HttpMethod;
  url: string;
  handler(
    req: IQueryableIncomingMessage,
    res: ServerResponse,
    ...urlParts: string[]
  ): void;
}

export class Router {
  public routes: IRoute[] = [];

  public add(method: HttpMethod, url: string, handler: () => void) {
    this.routes.push({ method, url, handler });
  }

  public resolve(req: IQueryableIncomingMessage, res: ServerResponse) {
    const parsed = parse(req.url || '', true);
    const path = parsed.pathname;
    req.query = parsed.query;

    return this.routes.some(route => {
      const match =
        route.method === req.method && this.match(route.url, path || '');
      if (!match) {
        return false;
      }
      const urlParts = match.map(decodeURIComponent);
      route.handler(req, res, ...urlParts);
      return true;
    });
  }

  private match(pattern: string, path: string) {
    const matcher = pathToRegexp(pattern);
    const match = matcher.exec(path);
    return match && match.slice(1);
  }
}
