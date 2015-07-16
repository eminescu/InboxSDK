/* @flow */
//jshint ignore:start

import type Kefir from 'kefir';

export type MoleViewDriver = {
  show(): void;
  setTitle(title: string): void;
  setMinimized(minimized: boolean): void;
  getMinimized(): boolean;
  getEventStream(): Kefir.Stream;
  destroy(): void;
};
