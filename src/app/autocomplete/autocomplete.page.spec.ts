import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AutocompletePage } from './autocomplete.page';

describe('AutocompletePage', () => {
  let component: AutocompletePage;
  let fixture: ComponentFixture<AutocompletePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutocompletePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AutocompletePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
