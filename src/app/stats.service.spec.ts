/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { StatsService } from './stats.service';

describe('StatsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StatsService]
    });
  });

  it('should ...', inject([StatsService], (service: StatsService) => {
    expect(service).toBeTruthy();
  }));
});
