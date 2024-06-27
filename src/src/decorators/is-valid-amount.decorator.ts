import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import Dinero from 'dinero.js';

export function IsAmountFormatCorrect(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isAmountFormatCorrect',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          let cents;
          // This code assumes the currency is EUR
          //
          //  First we check if the value is a string or a number
          //  If it is a string, we remove all characters that are not digits, commas, or dots
          //  Then we replace commas with dots
          //  Then we parse the string to a float
          //  If the value is not a number, we return false
          //
          //
          //  If the value is a number, we check if it is an integer
          //  If it is, we assign it to cents
          //
          //
          //  If it is not, we convert it to an integer by multiplying it by 100
          //  Finally, we create a Dinero object with the amount in cents and the currency EUR
          //
          //
          if (typeof value === 'string') {
            // Validate the format of the amount

            


            // Remove all characters that are not digits, commas, or dots
            value = value.replace(/[^0-9.,-]/g, '');

            // Replace commas with dots
            value = value.replace(',', '.');

            const floatAmount = parseFloat(value);
            if (isNaN(floatAmount)) {
              return false;
            }
            cents = Dinero({
              amount: Math.round(floatAmount * 100),
              currency: 'EUR',
            }).getAmount();
          } else if (typeof value === 'number') {
            if (Number.isInteger(value)) {
              cents = Dinero({ amount: value, currency: 'EUR' }).getAmount();
            } else {
              cents = Dinero({
                amount: Math.round(value * 100),
                currency: 'EUR',
              }).getAmount();
            }
          } else {
            return false;
          }
          const dineroAmount = Dinero({ amount: cents, currency: 'EUR' });
          args.object[propertyName] = dineroAmount.getAmount();
          return true;
        },
      },
    });
  };
}
