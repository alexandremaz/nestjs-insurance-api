import { Injectable, UnauthorizedException } from '@nestjs/common';
// biome-ignore lint/style/useImportType: NestJS constructor injection
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
// biome-ignore lint/style/useImportType: NestJS constructor injection
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Partner } from './entities/partner.entity';

// Service to handle the creation of partners and the login of partners
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Partner)
    private partnerRepository: Repository<Partner>,
    private jwtService: JwtService,
  ) {}

  async generatePartnerApiKey(partnerName: string): Promise<string> {
    const apiKey = `pk_${uuidv4()}`;
    const partner = new Partner();
    partner.name = partnerName;
    partner.apiKey = apiKey;

    await this.partnerRepository.save(partner);
    return apiKey;
  }

  async validatePartnerApiKey(apiKey: string): Promise<Partner> {
    const partner = await this.partnerRepository.findOne({
      where: { apiKey },
    });

    if (!partner) {
      throw new UnauthorizedException('Invalid API key');
    }

    return partner;
  }

  async loginPartner(partner: Partner) {
    const validPartner = await this.validatePartnerApiKey(partner.apiKey);

    if (validPartner.id !== partner.id) {
      throw new UnauthorizedException('Unauthorized partner access');
    }

    const payload = {
      name: partner.name,
      sub: partner.id,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
