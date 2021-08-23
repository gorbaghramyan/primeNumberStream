import { Component } from '@angular/core';
import { interval, Observable, Subscription } from 'rxjs';
import { StreamItem as Stream } from './models/StreamItem';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  arrPrime: Stream[] = [];
  primeNumbers$: Subscription = new Subscription();
  isStarted: boolean = false;
  intervalInitialValue: number = 0;

  startStream(): void {
    if (this.isStarted) {
      this.pauseStream();
      return;
    }

    this.isStarted = true;
    this.subscriber();
  };

  subscriber(): void {
    this.primeNumbers$ = interval(1)
      .pipe(this.isPrime(this.arrPrime, new Stream(this.intervalInitialValue)))
      .subscribe(number => {
        const item = new Stream(number);
        this.arrPrime.push(item);
      });
  }

  pauseStream(): void {
    this.isStarted = false;
    this.intervalInitialValue = this.arrPrime?.pop()?.value || 0;
    this.primeNumbers$.unsubscribe();
  }

  stopStream(): void {
    this.isStarted = false;
    this.intervalInitialValue = 0;
    this.arrPrime = [];
    this.primeNumbers$.unsubscribe();
  }

  isPrime(arrPrime: Stream[], startValue: Stream) {
    return function (source: Observable<number>): Observable<number> {
      return new Observable(observer => {
        source.subscribe({
          next(value) {
            if (value < startValue.value) {
              value += startValue.value;
            }
            if (isPrime(Number(value), arrPrime)) {
              observer.next(value);
            }
          },
          error(error) {
            observer.error(error);
          },
          complete() {
            observer.complete();
          }
        });
      });

      function isPrime(value: number, arr: Stream[]): boolean {
        if (value < 2) {
          return false;
        } else if (value === 2) {
          return true;
        }

        let isPrime = true;
        arr.map(el => {
          if (value % el.value === 0) {
            isPrime = false;
          }
        });

        return isPrime;
      }
    }
  }

  checkDisabled(): boolean {
    return this.isStarted;
  }
}