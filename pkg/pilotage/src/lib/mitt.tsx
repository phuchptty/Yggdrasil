import React, { PropsWithChildren, useContext } from 'react';
import mitt, { Emitter } from 'mitt';

export enum MittEvent {
    HOME_CHANGE_WORKSPACE_TITLE_MODAL_VISIBLE = 'HOME_CHANGE_WORKSPACE_TITLE_MODAL_VISIBLE',
    HOME_CHANGE_WORKSPACE_DATA = 'HOME_CHANGE_WORKSPACE_DATA',
    HOME_REFETCH_WORKSPACE = 'HOME_REFETCH_WORKSPACE',
    WORKSPACE_RUN_CODE = 'WORKSPACE_RUN_CODE',
}

type Events = {
    [key in MittEvent]: any;
};

const emitter: Emitter<Events> = mitt();

export interface MittContextType {
    emitter: Emitter<Events>;
}

const MittContext = React.createContext<MittContextType>({ emitter });

export const MittProvider = ({ children }: PropsWithChildren) => {
    return <MittContext.Provider value={{ emitter }}>{children}</MittContext.Provider>;
};

export const useMitt = (): MittContextType => useContext(MittContext);
