import { Logger } from '../interface';

class ConsoleLogger implements Logger {
  print(message: string): void {
    console.log(message);
  }
}

export default ConsoleLogger;
