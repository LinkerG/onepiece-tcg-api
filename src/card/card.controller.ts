import {
    Body,
    Controller,
    Get,
    Header,
    Inject,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { CardService } from './card.service';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiParam,
    ApiTags,
} from '@nestjs/swagger';
import { Card } from './schemas/card.schema';
import { FindAllCardsQuery } from './dto/find-card.dto';
import { CreateCardDto } from './dto/create-card.dto';
import { AuthGuard } from '@nestjs/passport';
import { Cache, CACHE_MANAGER, CacheInterceptor } from '@nestjs/cache-manager';

@Controller('card')
@ApiTags('Card')
export class CardController {
    constructor(
        private readonly cardService: CardService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) { }

    @Get()
    @UseInterceptors(CacheInterceptor)
    @Header('Cache-Control', 'public, max-age=300') // 5min
    @ApiOperation({ description: 'Get cards matching parameters' })
    async findAll(@Query() query: FindAllCardsQuery): Promise<Card[]> {
        return this.cardService.find(query);
    }

    @Get(':card_id')
    @UseInterceptors(CacheInterceptor)
    @Header('Cache-Control', 'public, max-age=300') // 5min
    @ApiParam({ name: 'card_id', description: 'ID of the card', type: String })
    @ApiOperation({ description: 'Get card by card_id' })
    async findById(@Param('card_id') card_id: string): Promise<Card> {
        return this.cardService.findById(card_id);
    }

    @Patch(':card_id/addAlteredArt')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiParam({ name: 'card_id', description: 'ID of the card', type: String })
    @ApiOperation({ description: 'Increases alternate art counter for card' })
    async addAlternateArt(@Param('card_id') card_id: string): Promise<Card> {
        const result = this.cardService.addAlternateArt(card_id);
        await this.cacheManager.del(`/card/${card_id}`);
        return result;
    }

    @Patch(':card_id/removeAlteredArt')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiParam({ name: 'card_id', description: 'ID of the card', type: String })
    @ApiOperation({ description: 'Decreases alternate art counter for card' })
    async removeAlternateArt(@Param('card_id') card_id: string): Promise<Card> {
        const result = this.cardService.removeAlternateArt(card_id);
        await this.cacheManager.del(`/card/${card_id}`);
        return result;
    }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ description: 'Create a new card' })
    async create(@Body() card: CreateCardDto): Promise<Card> {
        const result = this.cardService.create(card);
        await this.cacheManager.del(`/card`);
        return result;
    }
}
