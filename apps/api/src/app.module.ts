import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { InsightsModule } from './insights/insights.module';
import { SeedService } from './seed/seed.service';
import { User } from './auth/entities/user.entity';
import { Category } from './categories/entities/category.entity';
import { Insight } from './insights/entities/insight.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const dbType = config.get<string>('DATABASE_TYPE');
        if (dbType === 'postgres') {
          return {
            type: 'postgres',
            url: config.get<string>('DATABASE_URL'),
            ssl: { rejectUnauthorized: false },
            entities: [User, Category, Insight],
            synchronize: true,
          };
        }
        return {
          type: 'better-sqlite3',
          database: 'data/app.db',
          entities: [User, Category, Insight],
          synchronize: true,
        };
      },
    }),
    TypeOrmModule.forFeature([User, Category, Insight]),
    AuthModule,
    CategoriesModule,
    InsightsModule,
  ],
  providers: [SeedService],
})
export class AppModule {}
