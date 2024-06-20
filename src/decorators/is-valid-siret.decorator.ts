import { registerDecorator, ValidationOptions, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { isSiret } from '../utils/inpi/models/siren-and-siret'

@ValidatorConstraint({ async: true })
export class IsSiretConstraint implements ValidatorConstraintInterface {
    validate(siret: any, args: ValidationArguments) {
        try{
        return isSiret(siret); 
        } catch (error) {
            return false; 
        }
    }

    defaultMessage(args: ValidationArguments) {
        return 'SIRET number ($value) is not valid'; 
    }
}

export function IsSiret(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsSiretConstraint,
        });
    };
}
