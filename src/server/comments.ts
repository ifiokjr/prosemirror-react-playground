import { Mapping } from 'prosemirror-transform';

export interface IJSONComment {
  id: string;
  from: number;
  to: number;
  text: string;
}

export interface ICommentEvent extends Partial<IJSONComment> {
  type: 'create' | 'delete';
  id: string;
}

export class Comment {
  public static fromJSON(json: IJSONComment) {
    return new Comment(json.from, json.to, json.text, json.id);
  }

  constructor(
    public from: number,
    public to: number,
    public text: string,
    public id: string,
  ) {}
}

// tslint:disable-next-line:max-classes-per-file
export class Comments {
  private comments: Comment[] = [];
  private events: ICommentEvent[] = [];
  private version: number = 0;

  constructor(comments: Comment[]) {
    this.comments = comments || [];
  }

  public mapThrough(mapping: Mapping) {
    for (let ii = this.comments.length - 1; ii >= 0; ii--) {
      const comment = this.comments[ii];
      const from = mapping.map(comment.from, 1);
      const to = mapping.map(comment.to, -1);
      if (from >= to) {
        this.comments.splice(ii, 1);
      } else {
        comment.from = from;
        comment.to = to;
      }
    }
  }

  public created(data: IJSONComment) {
    this.comments.push(new Comment(data.from, data.to, data.text, data.id));
    this.events.push({ type: 'create', id: data.id });
    this.version++;
  }

  public index(id: string) {
    for (let ii = 0; ii < this.comments.length; ii++) {
      if (this.comments[ii].id === id) {
        return ii;
      }
    }
    return;
  }

  public delete(id: string) {
    const found = this.index(id);
    if (typeof found === 'number') {
      this.comments.splice(found, 1);
      this.version++;
      this.events.push({ type: 'delete', id });
    }
  }

  public eventsAfter(startIndex: number) {
    const result: ICommentEvent[] = [];
    for (let ii = startIndex; ii < this.events.length; ii++) {
      const event = this.events[ii];
      if (event.type === 'delete') {
        result.push(event);
      } else {
        const found = this.index(event.id);
        if (typeof found === 'number') {
          const comment = this.comments[found];
          result.push({
            type: 'create',
            id: event.id,
            text: comment.text,
            from: comment.from,
            to: comment.to,
          });
        }
      }
    }
    return result;
  }
}
