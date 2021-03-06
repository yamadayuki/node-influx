import { IBackoffStrategy } from './backoff/backoff';
import * as urlModule from 'url';

export class Host {

  public url: urlModule.Url;

  /**
   * Creates a new Host instance.
   * @param {String} url
   * @param {IBackoffStrategy} backoff
   */
  constructor (url: string, private backoff: IBackoffStrategy) {
    this.url = urlModule.parse(url);
  }

  /**
   * Marks a failure on the host and returns the length of time it
   * should be removed from the pool
   * @return {Number} removal time in milliseconds
   */
  public fail(): number {
    const value = this.backoff.getDelay();
    this.backoff = this.backoff.next();
    return value;
  }

  /**
   * Should be called when a successful operation is run against the host.
   * It resets the host's backoff strategy.
   */
  public success(): void {
    this.backoff = this.backoff.reset();
  }

}
