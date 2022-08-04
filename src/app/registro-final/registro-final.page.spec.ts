import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RegistroFinalPage } from './registro-final.page';

describe('RegistroFinalPage', () => {
  let component: RegistroFinalPage;
  let fixture: ComponentFixture<RegistroFinalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistroFinalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroFinalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
