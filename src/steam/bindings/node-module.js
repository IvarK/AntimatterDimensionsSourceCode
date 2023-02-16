/* eslint-disable no-console */

import { STEAM } from "@/env";

/**
 * @template TModule
 */
export class NodeModule {

  /**
   * @param {string} name
   */
  constructor(name) {
    this.name = name;
    /**
     * @type {TModule}
     * @private
     */
    this.__module__ = STEAM && window.require !== undefined ? window.require(name) : undefined;
  }

  get isLoaded() {
    return this.__module__ !== undefined;
  }

  /**
   * @template TResult
   * @param {(module: TModule, resolve: (value?: TResult) => void, reject: (reason?: any) => void) => void} executor
   * @returns {Promise<TResult>}
   */
  makePromise(executor) {
    if (!this.isLoaded) {
      throw Error(`Node module "${this.name}" is not loaded.`);
    }

    return new Promise((resolve, reject) => {
      executor(this.__module__, resolve, reject);
    });
  }

  /**
   * @template TResult
   * @param {(module: TModule) => TResult} call
   * @param {TResult} [defaultValue]
   * @returns {TResult}
   */
  safeCall(call, defaultValue) {
    if (!this.isLoaded) {
      throw Error(`Node module "${this.name}" is not loaded.`);
    }

    try {
      return call(this.__module__);
    } catch (e) {
      console.error(`Failed to make a call to node module "${this.name}".`);
      console.error(e);
      return defaultValue;
    }
  }
}
