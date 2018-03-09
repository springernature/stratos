import { Store } from '@ngrx/store';

import { getRowMetadata } from '../../../../../features/cloud-foundry/cf.helpers';
import { FetchAllBuildpacks } from '../../../../../store/actions/buildpack.action';
import { getPaginationKey } from '../../../../../store/actions/pagination.actions';
import { AppState } from '../../../../../store/app-state';
import { buildpackSchemaKey, entityFactory } from '../../../../../store/helpers/entity-factory';
import { APIResource } from '../../../../../store/types/api.types';
import { ListDataSource } from '../../data-sources-controllers/list-data-source';
import { IListConfig } from '../../list.component.types';

export class CfBuildpacksDataSource extends ListDataSource<APIResource> {
  constructor(store: Store<AppState>, cfGuid: string, listConfig?: IListConfig<APIResource>) {
    const paginationKey = getPaginationKey('buidlpacks', cfGuid);
    const action = new FetchAllBuildpacks(cfGuid, paginationKey);
    super({
      store,
      action,
      schema: entityFactory(buildpackSchemaKey),
      getRowUniqueId: getRowMetadata,
      paginationKey,
      isLocal: true,
      transformEntities: [],
      listConfig
    });
  }
}
