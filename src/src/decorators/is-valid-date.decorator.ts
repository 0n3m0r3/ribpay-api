import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import moment from 'moment';
import momentParseFormat from 'moment-parseformat';

export function IsDateFormatCorrect(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isDateFormatCorrect',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          // Determine the format of the date
          const format = momentParseFormat(value);

          // Create a moment object with the value and the format obtained above
          // True is passed to match the format strictly
          const date = moment(value, format, true);
          if (date.isValid()) {
            // Conversion to YYYY/MM/DD format
            const formattedDate = date.format('YYYY/MM/DD');

            // Assign the formatted date to the object
            args.object[propertyName] = formattedDate;
            return true;
          }
          return false;
        },
      },
    });
  };
}
