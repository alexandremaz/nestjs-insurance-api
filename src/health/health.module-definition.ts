import { ConfigurableModuleBuilder } from '@nestjs/common';
import { type HealthModuleOptions } from './health.interface';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<HealthModuleOptions>().build();
