import { RequestAction, SingleEntityAction } from '../../types/request.types';
import { CfEntityDataState } from '../../types/entity.types';
import { mergeState } from '../../helpers/reducer.helper';
import { RequestMethod } from '@angular/http';
import { defaultActionState, defaultDeletingActionState, defaultRequestState, RequestInfoState, rootUpdatingKey } from './types';


export function getEntityRequestState(state, action: SingleEntityAction): RequestInfoState {
  const { entityKey, guid } = action;
  const requestState = { ...state[entityKey][guid] };
  if (requestState && typeof requestState === 'object' && Object.keys(requestState).length) {
    return requestState;
  }
  return { ...defaultRequestState };
}

export function setEntityRequestState(state, requestState, { entityKey, guid }: RequestAction) {
  const newState = {
    [entityKey]: {
      [guid]: {
        ...requestState
      }
    }
  };
  return mergeState(state, newState);
}


export function createRequestStateFromResponse(entities, state) {
  let newState = { ...state };
  Object.keys(entities).forEach(entityKey => {
    Object.keys(entities[entityKey]).forEach(guid => {
      const entState = getEntityRequestState(state, { entityKey, guid } as SingleEntityAction);
      entState.fetching = false;
      entState.error = false;
      entState.deleting = { ...defaultDeletingActionState };
      newState = setEntityRequestState(newState, entState, { entityKey, guid } as RequestAction);
    });
  });
  return newState;
}

export type ApiRequestTypes = 'fetch' | 'update' | 'create' | 'delete';

export function getRequestTypeFromMethod(method): ApiRequestTypes {
  if (typeof method === 'string') {
    method = method.toString().toLowerCase();
    if (method === 'post') {
      return 'create';
    }
    if (method === 'put') {
      return 'update';
    }
    if (method === 'delete') {
      return 'delete';
    }
  } else if (typeof method === 'number') {
    if (method === RequestMethod.Post) {
      return 'create';
    }
    if (method === RequestMethod.Put) {
      return 'update';
    }
    if (method === RequestMethod.Delete) {
      return 'delete';
    }
  }
  return 'fetch';
}

export function modifyRequestWithRequestType(requestState: RequestInfoState, type: ApiRequestTypes) {
  if (type === 'fetch') {
    requestState.fetching = true;
  } else if (type === 'create') {
    requestState.creating = true;
  } else if (type === 'delete') {
    requestState.deleting = { ...defaultDeletingActionState, busy: true };
  }

  return requestState;
}

export function mergeUpdatingState(apiAction, updatingState, newUpdatingState) {
  const updateKey = apiAction.updatingKey || rootUpdatingKey;
  return {
    ...updatingState,
    ...{ [updateKey]: newUpdatingState }
  };
}

export function generateDefaultState(keys: Array<string>, initialSections?: {
  [key: string]: string[];
}) {
  const defaultState = {};

  keys.forEach(key => {
    defaultState[key] = {};
    if (initialSections && initialSections[key] && initialSections[key].length) {
      console.log(initialSections);
      initialSections[key].forEach(sectionKey => {
        defaultState[key][sectionKey] = { ...defaultActionState };
      });
    }
  });
  return defaultState;
}
