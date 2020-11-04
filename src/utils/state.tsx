import React, { useContext, useReducer, createContext } from 'react';
import { reducer, Action, ActionType } from './reducer';
import { getConnectedUser, User } from '../models/User';

export interface StateContext {
  isAuthenticated: boolean;
  user: User | null;
}

export interface Store {
  state: StateContext;
  dispatch?: React.Dispatch<Action>;
}

const defaultState: StateContext = { isAuthenticated: false, user: null };
const Context = createContext<Store>({ state: defaultState });

export const useStateContext = () => useContext(Context);

export const StateProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(reducer, defaultState);

  const asyncDispatch = async (action: Action) => {
    switch (action.type) {
      case ActionType.GET_USER:
        const payload = await getConnectedUser();
        dispatch({ ...action, payload });
        break;

      default:
        dispatch(action);
        break;
    }
  };

  return <Context.Provider value={{ state, dispatch: asyncDispatch }} children={children} />;
};
