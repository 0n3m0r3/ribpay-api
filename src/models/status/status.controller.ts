import {
  Controller,
  Get
} from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
} from '@nestjs/terminus';


@Controller('status')
export class StatusController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      async () => this.http.pingCheck('api', 'https://ribpay-api.greensea-0163ceac.francecentral.azurecontainerapps.io/api'),
      async () => this.http.pingCheck('api-docs', 'https://ribpay-api-docs-vercel.vercel.app/'),
      // Here you can add more health indicators e.g., database, storage, etc.
    ]);
  }
}
