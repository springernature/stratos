import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { first, tap, map, filter } from 'rxjs/operators';

import {
  CFEndpointsListConfigService,
} from '../../../shared/components/list/list-types/cf-endpoints/cf-endpoints-list-config.service';
import { ListConfig } from '../../../shared/components/list/list.component.types';
import { AppState } from '../../../store/app-state';
import { CloudFoundryService } from '../cloud-foundry.service';
import { RouterNav } from '../../../store/actions/router.actions';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-cloud-foundry',
  templateUrl: './cloud-foundry.component.html',
  styleUrls: ['./cloud-foundry.component.scss'],
  providers: [{
    provide: ListConfig,
    useClass: CFEndpointsListConfigService,
  }]
})
export class CloudFoundryComponent {
  hasOneCf$: Observable<boolean>;
  constructor(
    private store: Store<AppState>,
    private cfService: CloudFoundryService
  ) {
    this.hasOneCf$ = cfService.cFEndpoints$.pipe(
      map(cfEndpoints => {
        const connectedEndpoints = cfEndpoints.filter(
          c => c.connectionStatus === 'connected'
        );
        const hasOne = connectedEndpoints.length === 1;
        if (hasOne) {
          this.store.dispatch(new RouterNav({ path: ['cloud-foundry', cfEndpoints[0].guid] }));
        }
        return connectedEndpoints.length === 1;
      }),
      filter(hasOne => !hasOne),
      first()
    );

  }
}
