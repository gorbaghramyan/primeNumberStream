import { Component, OnDestroy } from '@angular/core';
import { interval, Observable, Subscription } from 'rxjs';
import { StreamItem as Stream } from './models/StreamItem';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  isStarted: boolean = false;
  intervalInitialValue: number = 0;

  primeNumbers$: Subscription = new Subscription();
  arrPrime: Stream[] = [];

  startStream(): void {
    if (this.isStarted) {
      this.pauseStream();
      return;
    }

    this.isStarted = true;
    this.subscriber();
  };

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

  subscriber(): void {
    this.primeNumbers$ = interval(1)
      .pipe(
        this.isPrime(this.arrPrime, new Stream(this.intervalInitialValue))
      )
      .subscribe(number => {
        const item = new Stream(number);
        this.arrPrime.push(item);
      });
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

  ngOnDestroy(): void{
    this.primeNumbers$.unsubscribe();
  }
}