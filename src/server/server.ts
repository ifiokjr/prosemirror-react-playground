import { IncomingMessage, ServerResponse } from 'http';
// import { Step } from 'prosemirror-transform';
// import schema from '../editor/config/schema';
import { HttpMethod, Router } from './Router';

const router = new Router();

export function handleCollabRequest(req: IncomingMessage, res: ServerResponse) {
  router.resolve(req, res);
}

export enum HTTPStatusCodes {
  CONTINUE = 100,
  SWITCHING_PROTOCOLS = 101,
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NON_AUTHORITATIVE_INFORMATION = 203,
  NO_CONTENT = 204,
  RESET_CONTENT = 205,
  PARTIAL_CONTENT = 206,
  MULTIPLE_CHOICES = 300,
  MOVED_PERMANENTLY = 301,
  FOUND = 302,
  SEE_OTHER = 303,
  NOT_MODIFIED = 304,
  USE_PROXY = 305,
  TEMPORARY_REDIRECT = 307,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  PAYMENT_REQUIRED = 402,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  NOT_ACCEPTABLE = 406,
  PROXY_AUTHENTICATION_REQUIRED = 407,
  REQUEST_TIMEOUT = 408,
  CONFLICT = 409,
  GONE = 410,
  LENGTH_REQUIRED = 411,
  PRECONDITION_FAILED = 412,
  REQUEST_ENTITY_TOO_LARGE = 413,
  REQUEST_URI_TOO_LONG = 414,
  UNSUPPORTED_MEDIA_TYPE = 415,
  REQUESTED_RANGE_NOT_SATISFIABLE = 416,
  EXPECTATION_FAILED = 417,
  UNPROCESSABLE_ENTITY = 422,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
  HTTP_VERSION_NOT_SUPPORTED = 505,
}

export class Output {
  public static json(data: any) {
    return new Output(
      HTTPStatusCodes.OK,
      JSON.stringify(data),
      'application/json',
    );
  }

  constructor(
    private code: HTTPStatusCodes,
    private body: string,
    private type: string,
  ) {}

  public res(res: ServerResponse) {
    res.writeHead(this.code, { 'Content-Type': this.type });
    res.end(this.body);
  }
}

function readStreamAsJSON(
  stream: IncomingMessage,
  callback: (error: Error, result?: any) => void,
) {
  let data = '';
  stream.on('data', chunk => (data += chunk));
  stream.on('end', () => {
    let result;
    let error;
    try {
      result = JSON.parse(data);
    } catch (err) {
      error = err;
    }
    callback(error, result);
  });

  stream.on('error', e => callback(e));
}

function handle(method: HttpMethod, url: string, f: any) {
  router.add(method, url, (req, resp, ...args) => {
    function finish() {
      let output;
      try {
        output = f(...args, req, resp);
      } catch (err) {
        console.log(err.stack);
        output = new Output(err.status || 500, err.toString());
      }
      if (output) {
        output.resp(resp);
      }
    }

    if (method === HttpMethod.PUT || method === HttpMethod.POST) {
      readStreamAsJSON(req, (err, val) => {
        if (err) {
          new Output(500, err.toString()).resp(resp);
        } else {
          args.unshift(val);
          finish();
        }
      });
    } else {
      finish();
    }
  });
}
