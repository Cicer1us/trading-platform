import { registerDecorator, ValidationOptions } from 'class-validator'

export function IsNotExpired(validationOptions?: ValidationOptions) {
	return (object: any, propertyName: string): void => {
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
