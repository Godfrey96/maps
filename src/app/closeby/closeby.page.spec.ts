import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ClosebyPage } from './closeby.page';

describe('ClosebyPage', () => {
  let component: ClosebyPage;
  let fixture: ComponentFixture<ClosebyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClosebyPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ClosebyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
