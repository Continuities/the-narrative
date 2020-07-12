/**
 * Simple emitter pattern, with functional paradigms
 * @author mtownsend
 * @since July 2020
 * @flow
 */

import { useState, useEffect } from 'react';

export type Join<L, R> = {|
  left: L,
  right: ?R
|};

export type Emitter<T> = {|
  addListener: (?T => void) => void,
  destroy: () => void
|};

export const asEmitter =  <T> (action:(?T => void) => ?(() => void)):() => Emitter<T> => {
  const listeners:Array<(?T) => void> = [];
  let lastValue:?T = null;

  const emit = (value:?T) => {
    lastValue = value;
    listeners.forEach(l => l(value));
  };

  const addListener = (listener: (?T) => void) => {
    listeners.push(listener);
    if (lastValue != null) {
      listener(lastValue);
    }
  };

  return () => {
    const onDestroy = action(emit);
    return {
      addListener,
      destroy: () => {
        listeners.length = 0;
        onDestroy && onDestroy();
      }
    };
  };
};

export const map = <T, R> (emitter:() => Emitter<T>, mapper:T => R):() => Emitter<R> => {
  const mapped = emit => {
    const inner = emitter();
    inner.addListener(t => emit(t == null ? null : mapper(t)));
    return inner.destroy;
  };
  return asEmitter(mapped);
};

export const flatMap = <T, R> (emitter:() => Emitter<T>, mapper:T => Emitter<R>):() => Emitter<R> => {
  const mapped = emit => {
    const inner = emitter();
    let outer = null;
    inner.addListener(t => {
      if (t == null) {
        emit(null);
        return;
      }
      outer = mapper(t);
      outer.addListener(emit);
    });
    return () => {
      inner.destroy();
      outer && outer.destroy();
    };
  };
  return asEmitter(mapped);
};

export const join = <L, R> (getLeft: () => Emitter<L>, getRight:L => ?Emitter<R>):() => Emitter<Join<L, R>> => {

  return flatMap(getLeft, left => {
    const makeJoin = emit => {
      const right:?Emitter<R> = getRight(left);
      emit({
        left,
        right: null
      });
      if (right == null) {
        return;
      }
      right.addListener(r => {
        emit({
          left,
          right: r
        });
      });
      return right.destroy;
    };

    return asEmitter<Join<L, R>>(makeJoin)();
  });
};

export const useEmitter = <T> (makeEmitter:() => Emitter<T>):(?T) => {
  const [ data, setData ] = useState<?T>(null);

  useEffect(() => {
    const emitter = makeEmitter();
    emitter.addListener(setData);
    return emitter.destroy;
  }, []);

  return data;
};
