import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Insight } from '../insights/entities/insight.entity';
import { Category } from '../categories/entities/category.entity';
import { User } from '../auth/entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Insight)
    private readonly insightRepository: Repository<Insight>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async seed() {
    const count = await this.insightRepository.count();
    if (count > 0) {
      return;
    }

    // Create a demo user if none exists
    let demoUser = await this.userRepository.findOne({ where: { email: 'demo@insightvault.com' } });
    if (!demoUser) {
      const hashedPassword = await bcrypt.hash('demo123456', 10);
      demoUser = await this.userRepository.save({
        email: 'demo@insightvault.com',
        name: 'Demo User',
        password: hashedPassword,
      });
    }

    // Create sample categories
    const techCategory = await this.categoryRepository.save({
      name: 'Technology',
      description: 'Insights about technology, software, and innovation',
      userId: demoUser.id,
    });

    const scienceCategory = await this.categoryRepository.save({
      name: 'Science',
      description: 'Scientific discoveries and research insights',
      userId: demoUser.id,
    });

    const businessCategory = await this.categoryRepository.save({
      name: 'Business',
      description: 'Business strategies, market analysis, and entrepreneurship',
      userId: demoUser.id,
    });

    // Create sample insights
    await this.insightRepository.save([
      {
        title: 'The Rise of AI Agents',
        content: 'AI agents are transforming how we interact with software. Unlike traditional chatbots, agents can execute complex workflows, use tools, and make decisions autonomously. This paradigm shift will redefine productivity tools in 2026 and beyond.',
        categoryId: techCategory.id,
        tags: 'AI,agents,productivity',
        userId: demoUser.id,
      },
      {
        title: 'Quantum Computing Breakthroughs',
        content: 'Recent advances in quantum error correction have brought us closer to fault-tolerant quantum computers. With major investments from both public and private sectors, we may see practical quantum advantage within the next 3-5 years.',
        categoryId: scienceCategory.id,
        tags: 'quantum,computing,research',
        userId: demoUser.id,
      },
      {
        title: 'Lean Startup Methodology',
        content: 'The build-measure-learn feedback loop remains the cornerstone of modern entrepreneurship. Starting with a minimum viable product (MVP) and iterating based on customer feedback reduces waste and increases the chances of product-market fit.',
        categoryId: businessCategory.id,
        tags: 'startup,lean,business',
        userId: demoUser.id,
      },
    ]);
  }
}
