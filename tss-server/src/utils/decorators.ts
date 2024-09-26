import { ValidationOptions, registerDecorator, ValidationArguments } from 'class-validator'

export function IsLessThan(property: string, validationOptions?: ValidationOptions) {
	return function (object: unknown, propertyName: string): void {
		registerDecorator({
			name: 'IsLessThan',
			target: object.constructor,
			propertyName: propertyName,
			constraints: [property],
			options: validationOptions,
			validator: {
				validate(value: unknown, args: ValidationArguments) {
					const [relatedPropertyName] = args.constraints
					const relatedValue = (args.object as unknown)[relatedPropertyName]
					return typeof value === 'number' && typeof relatedValue === 'number' && value < relatedValue
				}
			}
		})
	}
}

export function IsNotExpired(validationOptions?: ValidationOptions) {
	return (object: unknown, propertyName: string): void => {
		registerDecorator({
			name: 'IsNotExpired',
			target: object.constructor,
			propertyName,
			options: validationOptions,
			validator: {
				validate(value: number): boolean {
					return value > new Date().getTime()
				},

				defaultMessage(): string {
					return `${propertyName} is expired`
				}
			}
		})
	}
}
