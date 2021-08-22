import { Component, OnInit } from '@angular/core';
import { interval, Observable } from 'rxjs';
import { StreamItem as Stream } from './models/StreamItem';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  arrStream: Stream[] = [];

  ngOnInit(): void {
    const numbers$ = interval(500);

    const primeNumbers$ = numbers$.pipe(
      this.filterNil(this.arrStream)
    );

    primeNumbers$.subscribe(x => {
      const item = new Stream(x);
      this.arrStream.push(item);
      console.log(item);

      return console.log('Next prime pumber: ', x);
    });
  }

  filterNil(arrStream: Stream[]) {
    return function <T>(source: Observable<T>): Observable<T> {
      return new Observable(subscriber => {
        source.subscribe({
          next(value) {
            if (isPrime(Number(value), arrStream)) {
              subscriber.next(value);
            }
          },
          error(error) {
            subscriber.error(error);
          },
          complete() {
            subscriber.complete();
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
        arr.map((el, i) => {
          if (value % el.value === 0) {
            isPrime = false;
          }
        })

        return isPrime;
      }
    }
  }
}