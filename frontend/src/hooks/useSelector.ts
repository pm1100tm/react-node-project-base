import { useEffect, useState } from 'react';
import { State } from '../stores/Store';
import useStore from './useStore';
import useForceUpdate from './useForceUpdate';

type Selector<T> = (state: State) => T;

export default function useSelector<T>(selector: Selector<T>): T {
  const store = useStore();
  const [state, setState] = useState<T>(selector(store.state));
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    const update = () => {
      const newState = selector(store.state);
      // TODO: T가 object일 때 처리 필요함.
      if (newState !== state) {
        setState(newState);
        forceUpdate();
      }
    };

    store.addListener(update);
    return () => store.removeListener(update);
  }, [store, forceUpdate]);

  return state;
}
