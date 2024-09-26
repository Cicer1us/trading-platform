import { ConfigModule } from '@nestjs/config';
import { validate } from './env.validation';

export default ConfigModule.forRoot({
  validate: validate,
  isGlobal: true,
});
