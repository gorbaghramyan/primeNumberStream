import { IStreamItem } from '../interfaces/IStreamItem';

export class StreamItem implements IStreamItem {
  value: number;
  index: number;

  constructor(value: number) {
    this.value = value;
    this.index = value * 5;
  }
}