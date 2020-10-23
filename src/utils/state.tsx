import React, { useContext, useReducer, createContext } from 'react';
import { reducer, Action } from './reducer';
import {User} from '../models/User'

export interface StateContext {
  isAuthenticated: boolean;
  user: User | null;
}

export interface Store {
  state: StateContext;
  dispatch?: React.Dispatch<Action>;
}

const defaultState: StateContext = { isAuthenticated: false, user: null};
const Context = createContext<Store>({state: defaultState});

export const useStateContext = () => useContext(Context);

export const StateProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(reducer, defaultState);
  const value = { state, dispatch };
  return (
    <Context.Provider value={value} children={children} />
  );
};