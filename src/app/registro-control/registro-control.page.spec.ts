import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RegistroControlPage } from './registro-control.page';

describe('RegistroControlPage', () => {
  let component: RegistroControlPage;
  let fixture: ComponentFixture<RegistroControlPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistroControlPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroControlPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
