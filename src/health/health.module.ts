import { Logger, Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigurableModuleClass } from './health.module-definition';

@Module({
  imports: [
    TerminusModule.forRoot({
      logger: Logger,
    }),
    HttpModule,
  ],
  controllers: [HealthController],
  providers: [Logger],
})
export class HealthModule extends ConfigurableModuleClass {}
