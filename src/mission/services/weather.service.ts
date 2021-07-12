import { Injectable } from '@nestjs/common';
import { Mission } from '../mission.decorator';

@Injectable()
@Mission()
export class WeatherMissionService {
  console() {
    console.log('aaa');
  }
}
