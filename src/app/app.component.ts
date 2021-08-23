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

  startStream(): void {
    if (this.arrPrime.length !== 0) {
      this.arrPrime = []
    }
    this.primeNumbers$ = interval(1)
      .pipe(this.isPrime(this.arrPrime))
      .subscribe(number => {
        const item = new Stream(number);
        this.arrPrime.push(item);
      });
  };

  stopStream(): void {
    this.primeNumbers$.unsubscribe()
  }

  isPrime(arrPrime: Stream[]) {
    return function <StreamItem>(source: Observable<StreamItem>): Observable<StreamItem> {
      return new Observable(observer => {
        source.subscribe({
          next(value) {
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
}