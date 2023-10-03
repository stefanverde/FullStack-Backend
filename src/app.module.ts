import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AppController/*, MailerController*/ } from './app.controller';
import { AppService/*, MailService */} from './app.service';
import { HealthModule } from './health/health.module';
import { configuration, IConfig, validate } from './public/configuration';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ItemsModule } from './items/items.module';
import { Item } from './items/entities/items.entity';
//import { MailerModule } from '@nestjs-modules/mailer';
// todo: add all entities here
const ENTITIES = [User, Item];

@Module({
  imports: [
  //   MailerModule.forRoot({
  //     transport: {
  //       host: 'smtp.gmail.com',
  //       auth: {
  //         user: 'verdestefan87@gmail.com',
  //         pass: 'rysc qsac igan zpvv',
  //       },
  //     },
  //   }),
    ConfigModule.forRoot({
      envFilePath: [
        `config/${process.env.NODE_ENV || 'development'}.env`,
        '.env',
      ],
      load: [configuration],
      isGlobal: true,
      cache: true,
      validate,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async (config: ConfigService<IConfig>) => {
        return {
          type: 'postgres',
          host: config.get('DB_HOST'),
          port: config.get('DB_PORT'),
          username: config.get('DB_USERNAME'),
          password: config.get('DB_PASSWORD'),
          database: config.get('DB_DATABASE'),
          entities: ENTITIES,
          synchronize: true,
          namingStrategy: new SnakeNamingStrategy(),
        };
      },
      inject: [ConfigService],
    }),
    HealthModule,
    UsersModule,
    AuthModule,
    ItemsModule,
    // MailerModule,
  ],
  controllers: [AppController/*, MailerController*/],
  providers: [AppService/*, MailService*/],
})
export class AppModule {}
