import { StateContext } from './state';


export enum ActionType {
  SIGN_IN = 'Log out',
  SIGN_OUT = 'Sign out',
  GET_USER = 'Get User'
}

export type Action = { type: ActionType, payload?: any };

export const reducer = (state: StateContext, action: Action) => {
  switch (action.type) {
    case ActionType.SIGN_OUT:
      return { ...state, isAuthenticated: false };
    case ActionType.GET_USER:
      const { isAuthenticated, user } = action.payload!;
      return {...state, isAuthenticated, user}
    default:
      throw new Error('Not among actions');
  }
};