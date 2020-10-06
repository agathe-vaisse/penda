import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GameComponent} from './game.component';
import {of} from "rxjs";
import {WordService} from "./word.service";
import {Word} from "./word";
import {ActivatedRoute, Params} from "@angular/router";

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;
  let dom;
  let wordServiceSpy;

  beforeEach(async () => {
    wordServiceSpy = jasmine.createSpyObj<WordService>(['findOneRandomly']);
    wordServiceSpy.findOneRandomly.and.returnValue(of(<Word>{value: 'panda'}));
    const routeSpy = {queryParams: of(<Params>{language: 'fr'})}
    await TestBed.configureTestingModule({
      declarations: [ GameComponent ],
      providers: [
        {provide: WordService, useValue: wordServiceSpy},
        {provide: ActivatedRoute, useValue: routeSpy}
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    dom = fixture.nativeElement;
  });

  it('should display the placeholder text of the word to guess', () => {
      const placeholders = Array.from(dom.querySelectorAll('#guess .placeholder'))
          .map((e: any) => e.textContent);

      expect(placeholders).toEqual(['_', '_', '_', '_', '_']);
  });

  // TODO: find out why subscription is already closed
  xit('destroys subscriptions on destroy', () => {
      expect(component.queryParamSubscription.closed).toBeFalse();

      component.ngOnDestroy();

      expect(component.queryParamSubscription.closed).toBeTrue();
  })
});
